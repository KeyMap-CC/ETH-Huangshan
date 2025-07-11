"use client"

import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form"
import { VoiceNoteApp } from "@/components/voice-note-app"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ""
  )
}

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    // Check if we should use demo mode
    if (!isSupabaseConfigured()) {
      setDemoMode(true)
      setLoading(false)
      return
    }

    // Only import and use Supabase if it's configured
    const initSupabase = async () => {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

      const checkUser = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
      }

      checkUser()

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }

    initSupabase()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {demoMode ? (
        <VoiceNoteApp user={{ email: "demo@example.com", id: "demo-user" }} demoMode={true} />
      ) : !user ? (
        <LoginForm />
      ) : (
        <VoiceNoteApp user={user} demoMode={false} />
      )}
    </div>
  )
}
