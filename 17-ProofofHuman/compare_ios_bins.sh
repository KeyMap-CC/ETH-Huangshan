#!/bin/bash
# compare_ios_bins_legacy.sh  <fileA> <fileB>
# 传 IPA / .app / Mach-O 都行；输出 codesign、otool、整体 SHA-256 差异。

set -e

die() { echo "❌ $*" >&2; exit 1; }
[ $# -eq 2 ] || die "用法: $0 fileA fileB"

# ---------- 工具函数 ----------
extract_exec () {              # $1 路径 -> 打印可执行文件路径
  local in="$1"
  if [ -d "$in" ] && [[ "$in" == *.app ]]; then
      echo "$in/$(basename "$in" .app)"
  elif [[ "$in" == *.ipa ]]; then
      local tmp; tmp=$(mktemp -d)
      unzip -qq "$in" -d "$tmp"
      local app; app=$(find "$tmp/Payload" -maxdepth 1 -type d -name "*.app" | head -n1)
      [ -n "$app" ] || die "未找到 .app in $in"
      echo "$app/$(basename "$app" .app)"
  else
      echo "$in"
  fi
}

collect_info () {              # $1 可执行  $2 前缀(A_ / B_)
  local exe="$1" pre="$2"

  # CDHash
  local cdhash team
  cdhash=$(codesign -d --verbose=4 "$exe" 2>&1 |
           awk -F= '/^CDHash=/{print $2; exit}')
  team=$(codesign -d --verbose=4 "$exe" 2>&1 |
         awk -F= '/^TeamIdentifier=/{print $2; exit}')

  # cryptid / cryptoff / cryptsize
  local cryptid cryptoff cryptsize
  while read -r key val; do
      case "$key" in
        cryptid)   cryptid="$val"   ;;
        cryptoff)  cryptoff="$val"  ;;
        cryptsize) cryptsize="$val" ;;
      esac
  done < <(otool -l "$exe" | awk '
      /LC_ENCRYPTION_INFO/ {flag=5}
      /LC_ENCRYPTION_INFO_64/ {flag=5}
      flag>0 {if($1~/crypt(id|off|size)/){print $1,$2}; flag--}')

  # 文件 SHA-256
  local sha; sha=$(shasum -a 256 "$exe" | awk '{print $1}')

  # 导出为变量
  eval "${pre}CDHASH='$cdhash'"
  eval "${pre}TEAM='$team'"
  eval "${pre}CRYPTID='${cryptid:-N/A}'"
  eval "${pre}CRYPTOFF='${cryptoff:-0}'"
  eval "${pre}CRYPTSIZE='${cryptsize:-0}'"
  eval "${pre}SHA='$sha'"
}

# ---------- 主流程 ----------
exeA=$(extract_exec "$1"); echo "File A exec: $exeA"
exeB=$(extract_exec "$2"); echo "File B exec: $exeB"

collect_info "$exeA" A_
collect_info "$exeB" B_

printf "\n%-10s | %-64s | %-s\n" 字段 FileA FileB
printf -- "----------|------------------------------------------------------------------|------------------------------------------------------------------\n"
for key in CDHASH TEAM CRYPTID CRYPTOFF CRYPTSIZE SHA; do
  printf "%-10s | %-64s | %-s\n" "$key" "$(eval echo \${A_$key})" "$(eval echo \${B_$key})"
done

echo
[ "$A_CDHASH"   = "$B_CDHASH" ]   && echo "✔️  CDHash 一致"   || echo "❌  CDHash 不同"
[ "$A_SHA"      = "$B_SHA" ]      && echo "✔️  文件 SHA 一致" || echo "❌  文件 SHA 不同"
[ "$A_CRYPTID"  = "$B_CRYPTID" ]  && echo "✔️  cryptid 一致"  || echo "❌  cryptid 不同" 
