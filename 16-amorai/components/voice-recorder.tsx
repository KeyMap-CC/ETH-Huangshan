"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Square, Play, Pause } from "lucide-react"

interface VoiceRecorderProps {
  onAudioReady: (audioBlob: Blob, audioUrl: string, transcriptionMethod: "web-speech" | "whisper") => void
}

export function VoiceRecorder({ onAudioReady }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcriptionMethod, setTranscriptionMethod] = useState<"web-speech" | "whisper">("web-speech")
  const [isWebSpeechSupported, setIsWebSpeechSupported] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // 检查浏览器是否支持Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setIsWebSpeechSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "zh-CN"
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        onAudioReady(audioBlob, url, transcriptionMethod)

        // 停止所有音频轨道
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // 如果选择Web Speech API，同时启动语音识别
      if (transcriptionMethod === "web-speech" && recognitionRef.current) {
        recognitionRef.current.start()
      }

      // 开始计时
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("无法访问麦克风:", error)
      alert("无法访问麦克风，请检查权限设置")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // 停止语音识别
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium mb-2">语音录制</h3>

        {/* 转录方法选择 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">转录方式</label>
          <Select
            value={transcriptionMethod}
            onValueChange={(value: "web-speech" | "whisper") => setTranscriptionMethod(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web-speech" disabled={!isWebSpeechSupported}>
                浏览器语音识别 {!isWebSpeechSupported && "(不支持)"}
              </SelectItem>
              <SelectItem value="whisper">OpenAI Whisper API</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            {transcriptionMethod === "web-speech"
              ? "使用浏览器内置语音识别，免费但准确度有限"
              : "使用OpenAI Whisper，准确度更高但需要API密钥"}
          </p>
        </div>

        {/* 录制按钮 */}
        <div className="flex justify-center space-x-2 mb-4">
          {!isRecording ? (
            <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
              <Mic className="h-4 w-4 mr-2" />
              开始录制
            </Button>
          ) : (
            <Button onClick={stopRecording} variant="outline">
              <Square className="h-4 w-4 mr-2" />
              停止录制
            </Button>
          )}
        </div>

        {/* 录制状态 */}
        {isRecording && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">录制中 {formatTime(recordingTime)}</span>
          </div>
        )}

        {/* 播放控制 */}
        {audioUrl && (
          <div className="space-y-2">
            <Button variant="outline" onClick={togglePlayback} className="w-full bg-transparent">
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  暂停播放
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  播放录音
                </>
              )}
            </Button>

            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
          </div>
        )}
      </div>
    </div>
  )
}
