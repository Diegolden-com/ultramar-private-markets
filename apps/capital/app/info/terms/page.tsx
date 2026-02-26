import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navigation } from "@/components/navigation" // Fixed import to use named export

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <Link href="/info" className="inline-flex items-center gap-2 mb-8 text-sm font-mono hover:underline">
          <ArrowLeft className="w-4 h-4" />
          BACK TO INFO
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold font-mono mb-4">TERMS AND CONDITIONS</h1>
            <p className="text-sm text-muted-foreground font-mono">Last Updated: January 2025</p>
          </div>

          <div className="space-y-6 border-2 border-foreground p-6 sm:p-8">
            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">1. ACCEPTANCE OF TERMS</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using pantech.capital (the &quot;Platform&quot;), you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">2. INVESTMENT RISKS</h2>
              <p className="text-muted-foreground leading-relaxed">
                All investment strategies and instruments presented on this Platform involve risk of loss. Past
                performance is not indicative of future results. You should carefully consider your investment
                objectives, level of experience, and risk appetite before making any investment decisions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                DeFi protocols and blockchain-based investments carry additional risks including but not limited to:
                smart contract vulnerabilities, market volatility, liquidity risks, regulatory uncertainty, and
                potential loss of access to funds.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">3. NO FINANCIAL ADVICE</h2>
              <p className="text-muted-foreground leading-relaxed">
                The information provided on this Platform is for informational purposes only and does not constitute
                financial, investment, legal, or tax advice. pantech.capital is not a registered investment advisor,
                broker-dealer, or financial planner.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You should consult with qualified professionals before making any investment decisions. We do not
                recommend or endorse any specific investment strategy or financial product.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">4. USER RESPONSIBILITIES</h2>
              <p className="text-muted-foreground leading-relaxed">You are solely responsible for:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Maintaining the security of your wallet and private keys</li>
                <li>Verifying all transaction details before execution</li>
                <li>Understanding the risks associated with each investment strategy</li>
                <li>Complying with all applicable laws and regulations in your jurisdiction</li>
                <li>Paying any applicable taxes on your investments and returns</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">5. PLATFORM AVAILABILITY</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to maintain continuous Platform availability but do not guarantee uninterrupted access. The
                Platform may be temporarily unavailable due to maintenance, updates, or circumstances beyond our
                control. We are not liable for any losses resulting from Platform downtime.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">6. INTELLECTUAL PROPERTY</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, trademarks, logos, and intellectual property on this Platform are owned by Odisea Labs LLC
                or its licensors. You may not reproduce, distribute, or create derivative works without explicit written
                permission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">7. LIMITATION OF LIABILITY</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, pantech.capital and Odisea Labs LLC shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
                whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses
                resulting from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Your use or inability to use the Platform</li>
                <li>Any investment decisions made based on Platform information</li>
                <li>Unauthorized access to or alteration of your data</li>
                <li>Smart contract failures or blockchain network issues</li>
                <li>Any other matter relating to the Platform</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">8. INDEMNIFICATION</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless pantech.capital, Odisea Labs LLC, and their officers,
                directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including
                legal fees) arising from your use of the Platform or violation of these Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">9. MODIFICATIONS TO TERMS</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
                posting to the Platform. Your continued use of the Platform after changes constitutes acceptance of the
                modified Terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">10. GOVERNING LAW</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without
                regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the
                Platform shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold font-mono">11. CONTACT INFORMATION</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms and Conditions, please contact:
              </p>
              <p className="text-muted-foreground font-mono">
                Odisea Labs LLC
                <br />
                Email: legal@pantech.capital
              </p>
            </section>
          </div>

          <div className="text-center pt-8 border-t-2 border-foreground/20">
            <p className="text-xs text-muted-foreground font-mono">
              © 2025 pantech.capital care of Odisea Labs LLC. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
