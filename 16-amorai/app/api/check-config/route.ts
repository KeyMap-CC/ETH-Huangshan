export async function GET() {
  try {
    const openaiConfigured = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "")

    return Response.json({
      openaiConfigured,
      message: openaiConfigured ? "OpenAI API 已配置" : "OpenAI API 未配置",
    })
  } catch (error) {
    return Response.json({
      openaiConfigured: false,
      message: "配置检查失败",
    })
  }
}
