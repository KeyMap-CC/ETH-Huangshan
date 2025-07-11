export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return Response.json({ error: "缺少文本内容" }, { status: 400 })
    }

    // 检查 OpenAI API 密钥
    if (!process.env.OPENAI_API_KEY) {
      // 返回模拟总结当 API 密钥未配置时
      const mockSummary = `【总结】

## 核心要点
• ${text.split("。")[0]}。
• 内容涉及多个关键信息点
• 需要进一步分析和处理

## 主要内容
${text.length > 100 ? text.substring(0, 100) + "..." : text}

## 说明
*此为模拟总结，完整功能需要配置 OpenAI API 密钥*`

      return Response.json({ summary: mockSummary })
    }

    // 只有在 API 密钥存在时才导入 AI SDK
    const { generateText } = await import("ai")
    const { openai } = await import("@ai-sdk/openai")

    const { text: summary } = await generateText({
      model: openai("gpt-4o"),
      system: `你是一个专业的文本总结助手。请对用户提供的文本进行精准总结。

要求：
1. 提取核心要点和关键信息
2. 保持简洁明了，突出重点
3. 使用结构化格式（如要点列表）
4. 保持客观中性的语调
5. 总结长度控制在原文的20-30%

请用中文回复，并在开头标注【总结】。`,
      prompt: `请对以下文本进行总结：

${text}`,
    })

    return Response.json({ summary })
  } catch (error: any) {
    console.error("总结生成错误:", error)

    // 提供详细的错误信息
    let errorMessage = "总结生成失败"
    if (error.message) {
      errorMessage = error.message
    }

    // 如果是 API 相关错误，提供备用总结
    try {
      const { text } = await request.json()
      const fallbackSummary = `【总结】

## 内容概要
${text.length > 200 ? text.substring(0, 200) + "..." : text}

## 处理状态
• 由于 API 服务暂时不可用，这是备用总结
• 原文已进行基本的格式化处理
• 建议稍后重试以获得完整的 AI 总结功能

---
*备用处理模式*`

      return Response.json({ summary: fallbackSummary })
    } catch {
      return Response.json(
        {
          error: errorMessage,
        },
        { status: 500 },
      )
    }
  }
}
