#!/usr/bin/env node

const axios = require('axios');

// 配置
const API_BASE_URL = 'http://localhost:3000';

// 颜色输出函数
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

// 主要的查询函数
async function query(question) {
  console.log(colors.blue(`\n🤔 正在查询: "${question}"`));
  
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, {
      query: question
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      console.log(colors.green('✅ 查询成功!'));
      console.log(colors.cyan('📝 响应:'), JSON.stringify(response.data.response, null, 2));
    } else {
      console.log(colors.red('❌ 查询失败:'), response.data.error);
    }
  } catch (error) {
    console.log(colors.red('❌ 请求失败:'), error.message);
    if (error.response?.data) {
      console.log(colors.yellow('📋 错误详情:'), JSON.stringify(error.response.data, null, 2));
    }
  }
}

// 命令行参数处理
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(colors.cyan('🚀 IP Model Chat Service 客户端'));
    console.log(colors.yellow('用法: node client.js "你的问题"'));
    console.log(colors.yellow('示例: node client.js "你好，请介绍一下自己"'));
    
    // 运行一些示例查询
    console.log(colors.green('\n🧪 运行示例查询...'));
    await query('你好');
    await query('请介绍一下自己');
    await query('今天天气怎么样？');
    
    return;
  }

  const question = args.join(' ');
  await query(question);
}

// 运行主函数
main().catch(error => {
  console.error(colors.red('❌ 程序运行出错:'), error.message);
  process.exit(1);
});
