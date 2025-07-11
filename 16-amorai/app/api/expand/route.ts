export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return Response.json({ error: "缺少文本内容" }, { status: 400 })
    }

    // 检查 OpenAI API 密钥
    if (!process.env.OPENAI_API_KEY) {
      // 返回模拟扩展当 API 密钥未配置时
      const mockExpansion = `【扩展内容】

## 原始内容
${text}

## 详细分析
基于原始内容，我们可以从以下几个方面进行深入分析：

### 1. 背景信息
• 该内容涉及的主要话题和背景
• 相关的上下文信息
• 可能的应用场景

### 2. 关键要点解析
• 核心信息的详细解释
• 重要概念的进一步阐述
• 相关细节的补充说明

### 3. 实践建议
• 基于内容的行动建议
• 可能的下一步措施
• 相关的注意事项

### 4. 相关扩展
• 与主题相关的其他信息
• 可能的延伸思考
• 进一步学习的方向

---
*此为模拟扩展，完整功能需要配置 OpenAI API 密钥*`

      return Response.json({ expansion: mockExpansion })
    }

    // 只有在 API 密钥存在时才导入 AI SDK
    const { generateText } = await import("ai")
    const { openai } = await import("@ai-sdk/openai")

    const { text: expansion } = await generateText({
      model: openai("gpt-4o"),
      system: `你是一个专业的内容扩展助手。请对用户提供的文本进行智能扩展和补充。

要求：
1. 保持原文核心内容不变
2. 补充相关的背景信息和上下文
3. 添加详细的解释和说明
4. 提供相关的建议或行动要点
5. 使用清晰的结构化格式
6. 保持专业和实用的语调
7. 扩展内容应该是原文的2-3倍长度

请用中文回复，并在开头标注【扩展内容】。`,
      prompt: `请对以下文本进行扩展和补充：

${text}`,
    })

    return Response.json({ expansion })
  } catch (error: any) {
    console.error("扩展生成错误:", error)

    // 提供详细的错误信息
    let errorMessage = "扩展生成失败"
    if (error.message) {
      errorMessage = error.message
    }

    // 如果是 API 相关错误，提供备用扩展
    try {
      const { text } = await request.json()
      const fallbackExpansion = `【扩展内容】

## 原始内容
${text}

## 基本扩展
由于 API 服务暂时不可用，这里提供基本的内容扩展：

### 内容分析
• 原文包含了重要的信息点
• 内容具有一定的实用价值
• 可以从多个角度进行深入分析

### 补充说明
• 建议结合具体情况进行理解
• 可以根据需要进行进一步的研究
• 相关的背景信息有助于更好地理解内容

### 实用建议
• 将内容与实际应用相结合
• 考虑不同场景下的适用性
• 持续关注相关领域的发展

---
*备用处理模式，建议稍后重试以获得完整功能*`

      return Response.json({ expansion: fallbackExpansion })
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
