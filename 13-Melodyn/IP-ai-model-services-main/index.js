const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 配置外部API的基本信息
const EXTERNAL_API_CONFIG = {
  url: 'http://localhost:7861/chat/kb_chat',
  default_kb_name: 'wenxialin', // 改为默认知识库名称
  stream: true
};

// API服务：调用外部聊天API
class ChatService {
  static async callExternalAPI(query, kbName) {
    try {
      const requestData = {
        query: query,
        stream: EXTERNAL_API_CONFIG.stream,
        kb_name: kbName || EXTERNAL_API_CONFIG.default_kb_name
      };

      console.log('调用外部API:', EXTERNAL_API_CONFIG.url, '知识库:', requestData.kb_name);
      const response = await axios.post(EXTERNAL_API_CONFIG.url, requestData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
        responseType: 'text' // 确保获取原始文本
      });

      // 从流式响应中提取内容
      const extractContent = (rawData) => {
        let content = '';
        const chunks = rawData.split('\r\n\r\n').filter(chunk => chunk.includes('data:'));

        for (const chunk of chunks) {
          const dataLine = chunk.split('\n').find(line => line.startsWith('data:'));
          if (!dataLine) continue;

          const jsonStr = dataLine.replace('data: ', '');
          if (jsonStr.trim() === '[DONE]') continue;

          try {
            const dataObj = JSON.parse(jsonStr);
            if (dataObj.choices?.[0]?.delta?.content) {
              content += dataObj.choices[0].delta.content;
            }
          } catch (e) {
            console.warn('解析JSON失败:', jsonStr);
          }
        }
        return content;
      };

      const content = extractContent(response.data);
      console.log('提取内容:', content);

      return {
        success: true,
        data: content, // 返回提取的内容
        status: response.status,
        kb_name: requestData.kb_name
      };
    } catch (error) {
      console.error('调用外部API失败:', error.message);

      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data
        }
      };
    }
  }
}

// 路由：简化的查询API
app.post('/query', async (req, res) => {
  try {
    const { query, kb_name } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: '缺少query参数'
      });
    }

    console.log(`收到查询请求: ${query}`, kb_name ? `知识库: ${kb_name}` : '');

    const result = await ChatService.callExternalAPI(query, kb_name);

    if (result.success) {
      res.json({
        success: true,
        query: query,
        response: result.data,
        kb_name: result.kb_name,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        query: query,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('处理请求时发生错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      timestamp: new Date().toISOString()
    });
  }
});

// 路由：简化的GET查询API（支持query参数）
app.get('/query', async (req, res) => {
  try {
    const { query, kb_name } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: '缺少query参数'
      });
    }

    console.log(`收到GET查询请求: ${query}`, kb_name ? `知识库: ${kb_name}` : '');

    const result = await ChatService.callExternalAPI(query, kb_name);

    if (result.success) {
      res.json({
        success: true,
        query: query,
        response: result.data,
        kb_name: result.kb_name,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        query: query,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('处理GET请求时发生错误:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误',
      timestamp: new Date().toISOString()
    });
  }
});

// 获取API信息
app.get('/info', (req, res) => {
  res.json({
    service: 'IP Model Chat Service',
    version: '1.0.0',
    endpoints: {
      'POST /query': '发送聊天查询（JSON body中包含query字段）',
      'GET /query': '发送聊天查询（URL参数中包含query和kb_name）',
    },
    externalAPI: {
      url: EXTERNAL_API_CONFIG.url,
      default_kb_name: EXTERNAL_API_CONFIG.default_kb_name,
      stream: EXTERNAL_API_CONFIG.stream
    },
    examples: {
      'POST /query': {
        method: 'POST',
        url: 'http://localhost:3000/query',
        headers: { 'Content-Type': 'application/json' },
        body: {
          query: '你好',
          kb_name: 'optional_kb_name'
        }
      },
      'GET /query': {
        method: 'GET',
        url: 'http://localhost:3000/query?query=你好&kb_name=optional_kb_name'
      }
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 IP Model Chat Service 启动成功!`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 查询端点: 
    POST http://localhost:${PORT}/query (JSON body)
    GET  http://localhost:${PORT}/query?query=你的问题&kb_name=知识库名称`);
  console.log(`🎯 外部API: ${EXTERNAL_API_CONFIG.url}`);
  console.log(`📚 默认知识库: ${EXTERNAL_API_CONFIG.default_kb_name}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n收到关闭信号，正在优雅关闭服务器...');
  process.exit(0);
});

module.exports = app;