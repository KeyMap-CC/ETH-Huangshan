const { ethers } = require("hardhat");
const { firstSigner, sponsorSigner } = require("./signers");


// 用于为赞助调用创建签名的函数，它在实现合约中是必需的
async function createSignatureForCalls(calls, contractNonce) {
  // 对签名调用进行编码
  let encodedCalls = "0x";
  for (const call of calls) {
    const [to, value, data] = call;
    encodedCalls += ethers
      .solidityPacked(["address", "uint256", "bytes"], [to, value, data])
      .slice(2);
  }

  // 创建需要签名的摘要
  const digest = ethers.keccak256(
    ethers.solidityPacked(["uint256", "bytes"], [contractNonce, encodedCalls])
  );

  // 使用 EOA 的私钥签署摘要
  return await firstSigner.signMessage(ethers.getBytes(digest));
}

async function sendSponsoredTransaction(deployer) {
  console.log("\n=== 交易 2：赞助 (合约函数调用) ===");

  // 准备 ERC20 转移调用数据
  const erc20ABI = [
    "function transfer(address to, uint256 amount) external returns (bool)",
  ];
  const erc20Interface = new ethers.Interface(erc20ABI);

  const calls = [
    [
      usdcAddress,
      0n,
      erc20Interface.encodeFunctionData("transfer", [
        recipientAddress,
        ethers.parseUnits("0.1", 6), // 0.1 USDC\
      ]),
    ],
    [recipientAddress, ethers.parseEther("0.001"), "0x"],
  ];

  // 为赞助交易创建合约实例
  const delegatedContract = new ethers.Contract(
    deployer.address,
    contractABI,
    sponsorSigner
  );

  // 获取合约 nonce 并创建签名
  const contractNonce = await delegatedContract.nonce();
  const signature = await createSignatureForCalls(calls, contractNonce);

  await checkUSDCBalance(firstSigner.address, "第一个签名者 (发送者)");

  // 执行赞助交易
  const tx = await delegatedContract[
    "execute((address,uint256,bytes)[],bytes)"
  ](calls, signature, {
    // type: 4,                   // 重用现有委托。
    // authorizationList: [auth], // 不需要新授权或 EIP-7702 类型。
  });

  console.log("已发送赞助交易：", tx.hash);

  const receipt = await tx.wait();
  console.log("赞助交易的回执：", receipt);

  // 交易后检查 USDC 余额
  console.log("\n--- 交易后 USDC 余额 ---");
  await checkUSDCBalance(firstSigner.address, "第一个签名者 (发送者)");

  return receipt;
}

async function checkDelegationStatus(address) {
  console.log("\n=== 正在检查委托状态 ===");

  try {
    // 获取 EOA 地址的代码
    const code = await ethers.provider.getCode(address);

    if (code === "0x") {
      console.log(`❌ 未找到 ${address} 的委托`);
      return null;
    }

    // 检查它是否是 EIP-7702 委托 (以 0xef0100 开头)
    if (code.startsWith("0xef0100")) {
      // 提取委托的地址 (删除 0xef0100 前缀)
      const delegatedAddress = "0x" + code.slice(8); // 删除 0xef0100 (8 个字符)

      console.log(`✅ 找到 ${address} 的委托`);
      console.log(`📍 委托给：${delegatedAddress}`);
      console.log(`📝 完整委托代码：${code}`);

      return delegatedAddress;
    } else {
      console.log(`❓ 地址有代码但不是 EIP-7702 委托：${code}`);
      return null;
    }
  } catch (error) {
    console.error("检查委托状态时出错：", error);
    return null;
  }
}

async function sendEIP7702Transactions(deployer) {
  try {
 

    // 在开始之前检查委托
    await checkDelegationStatus(deployer.address);

    // 执行交易
    const receipt1 = await sendNonSponsoredTransaction();

    // 在第一次交易后检查委托
    await checkDelegationStatus(deployer.address);

    const receipt2 = await sendSponsoredTransaction(deployer);

    console.log("\n=== 成功 ===");
    console.log("两个 EIP-7702 交易均已成功完成！");
    console.log("非赞助交易区块：", receipt1.blockNumber);
    console.log("赞助交易区块：", receipt2.blockNumber);

    // 如果你想在最后撤销委托，请取消注释
    // await revokeDelegation();

    return { receipt1, receipt2 };
  } catch (error) {
    console.error("EIP-7702 交易中出错：", error);
    throw error;
  }
}



async function main() {
  console.log("开始部署到Sepolia测试网...");
  
  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  const initialBalance = await deployer.provider.getBalance(deployer.address);
  console.log("部署账户:", deployer.address);
  console.log("初始账户余额:", ethers.formatEther(initialBalance), "ETH");
  

  // 执行主函数
sendEIP7702Transactions(deployer)
.then(() => {
  console.log("流程已成功完成。");
})
.catch((error) => {
  console.error("无法发送 EIP-7702 交易：", error);
});
  // 获取当前gas价格
  const gasPrice = await deployer.provider.getFeeData();
  console.log("当前gas价格:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "Gwei");

  // 检查环境变量
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "your_private_key_here") {
    console.log("⚠️  警告: 请设置有效的PRIVATE_KEY环境变量");
    console.log("1. 编辑 .env 文件");
    console.log("2. 将 your_private_key_here 替换为您的实际私钥");
    console.log("3. 私钥应该是64位十六进制字符串（不包含0x前缀）");
    process.exit(1);
  }
   


try{

  // 先部署USDT合约
  // const usdtToken = await ethers.deployContract("GovernanceToken",["0xc70025f24be879be9258ac41932bae873bf7ff0a"]);
  // await usdtToken.waitForDeployment();
  // const usdtTokenAddress = await usdtToken.getAddress();
  // console.log("USDT合约已部署到:", usdtTokenAddress);
  
  
  //先approve 150USDT
  
  const usdtToken = await ethers.getContractAt("GovernanceToken","0x24B5fD18E3268cDed8235FF1670a68e977512379");
   const approveTx = await usdtToken.connect(deployer).approve("0x641a7996Cf5201adEA117DFE54AF1C2874C5d71A", 
    "150000000000000000000"
    );
   await approveTx.wait();
   console.log("150USDT已approve");

   
   const swtToken = await ethers.getContractAt("SafeWalletToken", "0xe7645Ab744A71D5b187d931c873b12F3CBf1b65a");
   //SWT余额
   const swtBalance = await swtToken.balanceOf("0x641a7996Cf5201adEA117DFE54AF1C2874C5d71A");
   console.log("SWT之前余额", swtBalance);
           // 5. 部署SafeWallet7702合约
    console.log("\n调用SafeWalletTreasury合约exchange...");
    const SafeWalletTreasury = await ethers.getContractAt("SafeWalletTreasury", "0x1c074ca83EF732182e16a904F58383759aE6Ea7c");
    const safeWalletTreasury = await SafeWalletTreasury.exchangeTokens();
    await safeWalletTreasury.wait();
    console.log("SafeWalletTreasury合约exchangeTokens已调用");
    const balance = await swtToken.balanceOf("0x641a7996Cf5201adEA117DFE54AF1C2874C5d71A");

    console.log("SWT之后余额", balance);


  } catch (error) {
    console.error("部署过程中发生错误:", error);
    process.exit(1);
  }
}

// 错误处理
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 