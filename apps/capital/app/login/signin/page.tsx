import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import { OakLeafLogo } from "@/components/oak-leaf-logo"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b-2 border-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/login" className="flex items-center gap-2 font-mono text-sm hover:underline">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
          <OakLeafLogo className="w-10 h-10" />
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold font-mono">SIGN IN</h1>
            <p className="text-muted-foreground">Welcome back to ULTRAMAR CAPITAL</p>
          </div>

          {/* Form */}
          <div className="border-2 border-foreground p-6 sm:p-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block font-mono text-sm font-bold">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-background"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block font-mono text-sm font-bold">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full border-2 border-foreground px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-background"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="#" className="font-mono text-sm text-muted-foreground hover:text-foreground hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button className="w-full bg-foreground text-background border-2 border-foreground px-6 py-4 font-mono text-sm font-bold hover:bg-foreground/90 transition-colors">
              SIGN IN
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-foreground" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 font-mono text-xs text-muted-foreground">OR</span>
              </div>
            </div>

            {/* Wallet Connect Button (Placeholder) */}
            <button className="w-full border-2 border-foreground px-6 py-4 font-mono text-sm font-bold hover:bg-muted transition-colors">
              CONNECT WALLET
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/login/signup" className="font-mono font-bold text-foreground hover:underline">
              SIGN UP
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
