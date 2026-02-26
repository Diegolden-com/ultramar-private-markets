import Link from "next/link"
import Image from "next/image"
import { OakLeafLogo } from "@/components/oak-leaf-logo"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Logo */}
      <div className="flex justify-center pt-6 sm:pt-12">
        <OakLeafLogo className="w-12 h-12 sm:w-20 sm:h-20" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-6 sm:pb-20">
        <div className="max-w-2xl w-full text-center space-y-4 sm:space-y-8">
          {/* Headline */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Invest in the
              <br />
              future of finance
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-xl mx-auto">
              Access institutional-grade DeFi strategies with transparent, algorithmic portfolio management.
            </p>
          </div>

          {/* Hero Image Placeholder */}
          <div className="py-4 sm:py-12">
            <div className="relative w-full max-w-[180px] sm:max-w-xs mx-auto">
              <Image
                src="/abstract-financial-growth-chart-geometric-shapes.jpg"
                alt="Financial Growth Illustration"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-foreground" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row gap-3 sm:gap-4 max-w-lg mx-auto pt-4 sm:pt-8">
            <Link
              href="/login/signin"
              className="flex-1 border-2 border-foreground px-4 sm:px-8 py-3 sm:py-4 font-mono text-sm sm:text-base font-bold hover:bg-muted transition-colors text-center"
            >
              SIGN IN
            </Link>
            <Link
              href="/login/signup"
              className="flex-1 bg-foreground text-background border-2 border-foreground px-4 sm:px-8 py-3 sm:py-4 font-mono text-sm sm:text-base font-bold hover:bg-foreground/90 transition-colors text-center"
            >
              SIGN UP
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-xs sm:text-sm text-muted-foreground pt-4 sm:pt-8">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>

      {/* Bottom Branding */}
      <div className="border-t-2 border-foreground py-4 px-4">
        <div className="flex items-center justify-center gap-2">
          <OakLeafLogo className="w-6 h-6" />
          <span className="font-mono text-sm font-bold">ULTRAMAR CAPITAL</span>
        </div>
      </div>
    </div>
  )
}
