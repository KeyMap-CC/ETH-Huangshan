export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return Response.json({ error: "缺少文本内容" }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      // Return mock enhanced text when API key is not configured
      const mockEnhancedText = `【AI 增强版本】

${text}

## 内容分析
• 原文已进行语法优化和结构调整
• 添加了适当的标点符号和段落分隔
• 补充了相关的背景信息

## 补充说明
• 这是模拟的 AI 增强结果
• 实际使用需要配置 OpenAI API Key
• 系统会自动纠正语音识别中的常见错误

## 建议改进
• 可以进一步细化内容结构
• 添加更多相关的上下文信息
• 考虑目标受众进行语言风格调整

---
*由 AI 语音笔记系统生成*`

      return Response.json({ enhancedText: mockEnhancedText })
    }

    // Only import AI SDK if API key is available
    const { generateText } = await import("ai")
    const { openai } = await import("@ai-sdk/openai")

    const { text: enhancedText } = await generateText({
      model: openai("gpt-4o"),
      system: `你是一个专业的文本编辑助手。请对用户提供的语音转文字内容进行分析、整理和补全。

要求：
1. 保持原意不变，但优化语言表达
2. 补充必要的标点符号和段落结构
3. 纠正可能的语音识别错误
4. 添加适当的格式化（如标题、列表等）
5. 补充相关的背景信息或解释（如果需要）
6. 保持专业和准确的语调

请用中文回复，并在开头标注【AI 增强版本】。`,
      prompt: `请对以下语音转文字内容进行分析、整理和补全：

${text}`,
    })

    return Response.json({ enhancedText })
  } catch (error) {
    console.error("增强文本时出错:", error)

    // Fallback response when API fails
    const { text } = await request.json()
    const fallbackEnhanced = `【AI 增强版本】

${text}

## 处理说明
• 由于 API 服务暂时不可用，这是备用增强结果
• 原文已进行基本的格式化处理
• 建议稍后重试以获得完整的 AI 增强功能

## 基本优化
• 保持了原文的核心内容
• 添加了基本的结构化格式
• 补充了必要的说明信息

---
*备用处理模式*`

    return Response.json({ enhancedText: fallbackEnhanced })
  }
}
