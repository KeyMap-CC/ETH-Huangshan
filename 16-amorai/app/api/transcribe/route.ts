export async function POST(request: Request) {
  try {
    // 检查 OpenAI API 密钥
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        {
          error: "需要配置 OpenAI API 密钥才能使用 Whisper 转录功能",
          suggestion: "请在环境变量中设置 OPENAI_API_KEY，或使用浏览器语音识别功能",
        },
        { status: 400 },
      )
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return Response.json({ error: "缺少音频文件" }, { status: 400 })
    }

    // 检查文件大小（Whisper API 限制 25MB）
    if (audioFile.size > 25 * 1024 * 1024) {
      return Response.json({ error: "音频文件大小不能超过 25MB" }, { status: 400 })
    }

    // 调用 OpenAI Whisper API
    const whisperFormData = new FormData()
    whisperFormData.append("file", audioFile)
    whisperFormData.append("model", "whisper-1")
    whisperFormData.append("language", "zh")
    whisperFormData.append("response_format", "json")

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`

      throw new Error(`Whisper API 错误: ${errorMessage}`)
    }

    const data = await response.json()

    if (!data.text) {
      throw new Error("Whisper API 返回了空的转录结果")
    }

    return Response.json({ text: data.text })
  } catch (error: any) {
    console.error("转录错误:", error)

    let errorMessage = "转录失败"
    let suggestion = "请检查网络连接或稍后重试"

    if (error.message.includes("API key")) {
      errorMessage = "OpenAI API 密钥无效或已过期"
      suggestion = "请检查 API 密钥是否正确配置"
    } else if (error.message.includes("quota")) {
      errorMessage = "API 配额已用完"
      suggestion = "请检查 OpenAI 账户余额或升级套餐"
    } else if (error.message.includes("rate limit")) {
      errorMessage = "API 调用频率超限"
      suggestion = "请稍后重试"
    } else if (error.message) {
      errorMessage = error.message
    }

    return Response.json(
      {
        error: errorMessage,
        suggestion: suggestion,
      },
      { status: 500 },
    )
  }
}
