"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { VoiceRecorder } from "@/components/voice-recorder"
import { FileUpload } from "@/components/file-upload"
import { VoicePlayer } from "@/components/voice-player"
import { LogOut, Sparkles, Save, Trash2, AlertCircle, FileText, Expand, Info } from "lucide-react"

// Helper function to create Supabase client only when configured
const createSupabaseClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Supabase not configured")
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

interface VoiceNote {
  id: string
  audio_url: string
  original_text: string
  summary_text: string
  expanded_text: string
  created_at: string
}

interface VoiceNoteAppProps {
  user: any
  demoMode?: boolean
}

export function VoiceNoteApp({ user, demoMode = false }: VoiceNoteAppProps) {
  const [currentNote, setCurrentNote] = useState<VoiceNote | null>(null)
  const [notes, setNotes] = useState<VoiceNote[]>([])
  const [originalText, setOriginalText] = useState("")
  const [summaryText, setSummaryText] = useState("")
  const [expandedText, setExpandedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    // 检查 API 密钥配置状态
    checkApiKeyStatus()

    if (demoMode) {
      // Load demo notes
      setNotes([
        {
          id: "demo-1",
          audio_url: "/placeholder-audio.mp3",
          original_text:
            "今天的会议讨论了项目进度和下一步计划。团队成员分享了各自的工作进展，并确定了接下来的重点任务。",
          summary_text:
            "【总结】\n\n## 核心要点\n• 项目进度回顾\n• 团队工作分享\n• 确定重点任务\n\n## 主要内容\n会议聚焦项目推进和任务规划",
          expanded_text:
            "【扩展内容】\n\n## 会议详情\n今天的会议是一次重要的项目推进会议...\n\n## 背景分析\n项目当前处于关键阶段...",
          created_at: new Date().toISOString(),
        },
      ])
    } else {
      loadNotes()
    }
  }, [demoMode])

  const checkApiKeyStatus = async () => {
    try {
      const response = await fetch("/api/check-config")
      const data = await response.json()
      setApiKeyConfigured(data.openaiConfigured)
    } catch (error) {
      setApiKeyConfigured(false)
    }
  }

  const loadNotes = async () => {
    if (demoMode) return

    try {
      const supabase = createSupabaseClient()

      const { data, error } = await supabase
        .from("voice_notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setNotes(data)
      }
    } catch (error) {
      console.error("加载笔记时出错:", error)
    }
  }

  const handleLogout = async () => {
    if (demoMode) {
      window.location.reload()
      return
    }

    try {
      const supabase = createSupabaseClient()
      await supabase.auth.signOut()
    } catch (error) {
      console.error("退出登录时出错:", error)
    }
  }

  const handleAudioReady = async (audioBlob: Blob, audioUrl: string, transcriptionMethod: "web-speech" | "whisper") => {
    setCurrentAudioUrl(audioUrl)
    setIsProcessing(true)
    setError(null)
    setProcessingStep("正在转录语音...")

    try {
      let transcription = ""

      if (transcriptionMethod === "web-speech") {
        // Web Speech API 的模拟实现
        await new Promise((resolve) => setTimeout(resolve, 2000))
        transcription =
          "这是通过浏览器语音识别获得的文字内容。实际使用中会显示真实的识别结果。用户可以通过录制语音来获得文字转换，然后系统会使用AI技术对文字进行总结和扩展。"
      } else {
        // 使用 Whisper API 进行转录
        const formData = new FormData()
        formData.append("audio", audioBlob, "recording.wav")

        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `转录失败: ${response.status}`)
        }

        transcription = data.text
      }

      setOriginalText(transcription)
      setProcessingStep("正在生成总结...")

      // 生成总结
      await generateSummary(transcription)

      setProcessingStep("正在扩展内容...")

      // 生成扩展内容
      await generateExpansion(transcription)
    } catch (error: any) {
      console.error("处理音频时出错:", error)
      setError(error.message || "处理音频时出现错误")
    } finally {
      setIsProcessing(false)
      setProcessingStep("")
    }
  }

  const generateSummary = async (text: string) => {
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (response.ok) {
        setSummaryText(data.summary)
      } else {
        throw new Error(data.error || `总结生成失败: ${response.status}`)
      }
    } catch (error: any) {
      console.error("生成总结时出错:", error)
      // 使用本地备用总结
      const localSummary = `【总结】

## 核心要点
• ${text.split("。")[0] || text.substring(0, 50)}
• 内容包含重要信息
• 需要进一步分析

## 主要内容
${text.length > 100 ? text.substring(0, 100) + "..." : text}

---
*本地生成的基础总结*`

      setSummaryText(localSummary)
    }
  }

  const generateExpansion = async (text: string) => {
    try {
      const response = await fetch("/api/expand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (response.ok) {
        setExpandedText(data.expansion)
      } else {
        throw new Error(data.error || `扩展生成失败: ${response.status}`)
      }
    } catch (error: any) {
      console.error("生成扩展时出错:", error)
      // 使用本地备用扩展
      const localExpansion = `【扩展内容】

## 原始内容
${text}

## 详细分析
基于原始内容，可以从以下方面进行分析：

### 1. 内容要点
• 主要信息的详细解释
• 关键概念的进一步阐述
• 相关细节的补充说明

### 2. 背景信息
• 相关的上下文信息
• 可能的应用场景
• 相关领域的知识

### 3. 实践建议
• 基于内容的行动建议
• 可能的下一步措施
• 相关的注意事项

---
*本地生成的基础扩展*`

      setExpandedText(localExpansion)
    }
  }

  const retryProcessing = async () => {
    if (originalText) {
      setIsProcessing(true)
      setError(null)

      setProcessingStep("正在重新生成总结...")
      await generateSummary(originalText)

      setProcessingStep("正在重新扩展内容...")
      await generateExpansion(originalText)

      setIsProcessing(false)
      setProcessingStep("")
    }
  }

  const saveNote = async () => {
    if (!currentAudioUrl || !originalText) return

    if (demoMode) {
      const newNote: VoiceNote = {
        id: `demo-${Date.now()}`,
        audio_url: currentAudioUrl,
        original_text: originalText,
        summary_text: summaryText,
        expanded_text: expandedText,
        created_at: new Date().toISOString(),
      }
      setNotes([newNote, ...notes])
      clearCurrentNote()
      return
    }

    try {
      const supabase = createSupabaseClient()

      const { data, error } = await supabase
        .from("voice_notes")
        .insert({
          user_id: user.id,
          audio_url: currentAudioUrl,
          original_text: originalText,
          summary_text: summaryText,
          expanded_text: expandedText,
        })
        .select()
        .single()

      if (!error && data) {
        setNotes([data, ...notes])
        clearCurrentNote()
      }
    } catch (error) {
      console.error("保存笔记时出错:", error)
    }
  }

  const clearCurrentNote = () => {
    setCurrentNote(null)
    setOriginalText("")
    setSummaryText("")
    setExpandedText("")
    setCurrentAudioUrl(null)
    setError(null)
  }

  const loadNote = (note: VoiceNote) => {
    setCurrentNote(note)
    setOriginalText(note.original_text)
    setSummaryText(note.summary_text)
    setExpandedText(note.expanded_text)
    setCurrentAudioUrl(note.audio_url)
    setError(null)
  }

  const deleteNote = async (noteId: string) => {
    if (demoMode) {
      setNotes(notes.filter((note) => note.id !== noteId))
      if (currentNote?.id === noteId) {
        clearCurrentNote()
      }
      return
    }

    try {
      const supabase = createSupabaseClient()
      const { error } = await supabase.from("voice_notes").delete().eq("id", noteId)

      if (!error) {
        setNotes(notes.filter((note) => note.id !== noteId))
        if (currentNote?.id === noteId) {
          clearCurrentNote()
        }
      }
    } catch (error) {
      console.error("删除笔记时出错:", error)
    }
  }

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">AI 语音笔记</h1>
            {demoMode && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">演示模式</span>}
            {apiKeyConfigured === false && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">API 未配置</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">欢迎，{user.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {demoMode ? "重新开始" : "退出"}
            </Button>
          </div>
        </div>

        {/* API 配置提示 */}
        {apiKeyConfigured === false && !demoMode && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">配置 OpenAI API 密钥</h3>
                <p className="text-sm text-blue-700 mt-1">
                  为了使用完整的 AI 功能（Whisper 转录、智能总结、内容扩展），请配置 OpenAI API 密钥。
                  <br />
                  当前系统会使用备用模式提供基础功能。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：笔记列表 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">我的笔记</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentNote?.id === note.id ? "bg-indigo-50 border-indigo-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => loadNote(note)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{new Date(note.created_at).toLocaleDateString()}</p>
                      <p className="text-sm line-clamp-2">{note.original_text.substring(0, 50)}...</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNote(note.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：主要工作区 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 语音控制区 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">语音录制与导入</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <VoiceRecorder onAudioReady={handleAudioReady} />
                <FileUpload onAudioReady={handleAudioReady} />
              </div>

              {/* 语音播放器 */}
              {currentAudioUrl && (
                <div className="mt-4">
                  <VoicePlayer audioUrl={currentAudioUrl} />
                </div>
              )}

              {/* 处理状态 */}
              {isProcessing && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                    <span className="text-sm text-blue-800">{processingStep}</span>
                  </div>
                </div>
              )}

              {/* 错误提示 */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-800">{error}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={retryProcessing}>
                    重试
                  </Button>
                </div>
              )}

              {/* 操作按钮 */}
              {(originalText || summaryText || expandedText) && (
                <div className="flex space-x-2 mt-4">
                  <Button onClick={saveNote} disabled={!originalText}>
                    <Save className="h-4 w-4 mr-2" />
                    保存笔记
                  </Button>
                  <Button variant="outline" onClick={clearCurrentNote}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    清空
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 文字内容区 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 原始文字 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  语音转文字
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="语音转换的文字将显示在这里..."
                  value={originalText}
                  onChange={(e) => setOriginalText(e.target.value)}
                  className="min-h-64 resize-none"
                />
              </CardContent>
            </Card>

            {/* AI 总结 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-green-500" />
                  AI 总结
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="AI 生成的总结将显示在这里..."
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  className="min-h-64 resize-none"
                />
              </CardContent>
            </Card>

            {/* AI 扩展 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Expand className="h-5 w-5 mr-2 text-purple-500" />
                  AI 扩展
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="AI 扩展的内容将显示在这里..."
                  value={expandedText}
                  onChange={(e) => setExpandedText(e.target.value)}
                  className="min-h-64 resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
