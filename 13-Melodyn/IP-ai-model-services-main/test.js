const axios = require('axios');

// 配置
const API_BASE_URL = 'http://localhost:3000';

// 测试函数
async function testAPI() {
  console.log('🧪 开始测试 IP Model Chat Service API\n');

  try {
    // 测试健康检查
    console.log('1. 测试健康检查...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ 健康检查通过:', healthResponse.data);
    console.log('');

    // 测试API信息
    console.log('2. 获取API信息...');
    const infoResponse = await axios.get(`${API_BASE_URL}/info`);
    console.log('✅ API信息:', JSON.stringify(infoResponse.data, null, 2));
    console.log('');

    // 测试POST查询
    console.log('3. 测试POST查询...');
    const postQuery = {
      query: '你好，请介绍一下自己'
    };
    
    try {
      const postResponse = await axios.post(`${API_BASE_URL}/query`, postQuery, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ POST查询成功:', JSON.stringify(postResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ POST查询失败（可能是外部API不可用）:', error.response?.data || error.message);
    }
    console.log('');

    // 测试GET查询
    console.log('4. 测试GET查询...');
    try {
      const getResponse = await axios.get(`${API_BASE_URL}/query?query=你好`);
      console.log('✅ GET查询成功:', JSON.stringify(getResponse.data, null, 2));
    } catch (error) {
      console.log('⚠️ GET查询失败（可能是外部API不可用）:', error.response?.data || error.message);
    }
    console.log('');

    console.log('🎉 测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 提示: 请确保服务器正在运行 (npm start)');
    }
  }
}

// 运行测试
testAPI();
