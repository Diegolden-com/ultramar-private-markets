"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from("waitlist").insert({
        email: email.toLowerCase().trim(),
        name: name.trim() || null,
        status: "pending",
      })

      if (insertError) {
        // Handle duplicate email error
        if (insertError.code === "23505") {
          throw new Error("This email is already on the waitlist")
        }
        throw insertError
      }

      setSuccess(true)
      setEmail("")
      setName("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="border-2 border-accent bg-accent/10 p-6 text-center">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-accent" />
        <h3 className="text-xl font-bold font-mono mb-2">YOU&apos;RE ON THE LIST!</h3>
        <p className="text-sm">We&apos;ll notify you when we launch. Check your email for confirmation.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-2 border-foreground px-4 py-3 font-mono text-base focus:outline-none focus:ring-2 focus:ring-accent bg-background"
          disabled={isLoading}
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-2 border-foreground px-4 py-3 font-mono text-base focus:outline-none focus:ring-2 focus:ring-accent bg-background"
          disabled={isLoading}
        />
      </div>
      
      {error && (
        <div className="border-2 border-red-500 bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 sm:px-8 sm:py-4 font-mono text-base sm:text-lg hover:bg-foreground/90 transition-colors border-2 border-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "JOINING..." : "JOIN THE WAITLIST"}
        <ArrowRight className="w-5 h-5" />
      </button>
    </form>
  )
}
