"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onAudioReady: (audioBlob: Blob, audioUrl: string, transcriptionMethod: "whisper") => void
}

export function FileUpload({ onAudioReady }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith("audio/")) {
      alert("请选择音频文件")
      return
    }

    // 检查文件大小 (限制为 25MB，Whisper API限制)
    if (file.size > 25 * 1024 * 1024) {
      alert("文件大小不能超过 25MB")
      return
    }

    const audioUrl = URL.createObjectURL(file)
    // 文件上传只支持Whisper API转录
    onAudioReady(file, audioUrl, "whisper")
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium mb-2">导入音频文件</h3>

        <Button onClick={handleFileSelect} variant="outline" className="w-full bg-transparent">
          <Upload className="h-4 w-4 mr-2" />
          选择音频文件
        </Button>

        <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileChange} className="hidden" />

        <p className="text-xs text-gray-500 mt-2">
          支持 MP3, WAV, M4A 等格式，最大 25MB
          <br />
          文件将使用 OpenAI Whisper API 进行转录
        </p>
      </div>
    </div>
  )
}
