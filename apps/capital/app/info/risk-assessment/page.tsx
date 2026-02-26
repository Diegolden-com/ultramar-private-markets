"use client"

import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useState } from "react"

type Answer = {
  questionId: string
  value: string
}

export default function RiskAssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      id: "goal",
      question: "What is your primary investment goal?",
      options: [
        { value: "growth", label: "Aggressive Growth - Maximize returns", score: 3 },
        { value: "balanced", label: "Balanced Growth - Moderate returns with stability", score: 2 },
        { value: "preservation", label: "Capital Preservation - Protect my investment", score: 1 },
      ],
    },
    {
      id: "risk-tolerance",
      question: "How would you react to a 20% drop in your portfolio value?",
      options: [
        { value: "buy-more", label: "Buy more - It's an opportunity", score: 3 },
        { value: "hold", label: "Hold - Wait for recovery", score: 2 },
        { value: "sell", label: "Sell - Minimize losses", score: 1 },
      ],
    },
    {
      id: "time-horizon",
      question: "What is your investment time horizon?",
      options: [
        { value: "long", label: "Long-term (5+ years)", score: 3 },
        { value: "medium", label: "Medium-term (1-5 years)", score: 2 },
        { value: "short", label: "Short-term (< 1 year)", score: 1 },
      ],
    },
    {
      id: "experience",
      question: "What is your experience with DeFi investments?",
      options: [
        { value: "expert", label: "Expert - I understand complex strategies", score: 3 },
        { value: "intermediate", label: "Intermediate - I know the basics", score: 2 },
        { value: "beginner", label: "Beginner - This is new to me", score: 1 },
      ],
    },
    {
      id: "amount",
      question: "How much are you planning to invest?",
      options: [
        { value: "large", label: "$50,000+", score: 3 },
        { value: "medium", label: "$10,000 - $50,000", score: 2 },
        { value: "small", label: "Under $10,000", score: 1 },
      ],
    },
  ]

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = [...answers.filter((a) => a.questionId !== questionId), { questionId, value }]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setTimeout(() => setShowResults(true), 300)
    }
  }

  const calculateRiskScore = () => {
    let totalScore = 0
    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId)
      const option = question?.options.find((o) => o.value === answer.value)
      if (option) totalScore += option.score
    })
    return totalScore
  }

  const getRecommendations = () => {
    const score = calculateRiskScore()
    const maxScore = questions.length * 3

    if (score >= maxScore * 0.75) {
      return {
        profile: "AGGRESSIVE INVESTOR",
        description: "You have high risk tolerance and seek maximum returns",
        strategies: [
          {
            name: "Private Markets",
            reason: "High-growth potential with tokenized private equity",
            href: "/info/private-markets",
          },
          {
            name: "Polymarket Arbitrage",
            reason: "Active trading opportunities with higher volatility",
            href: "/info/polymarket-arbitrage",
          },
          {
            name: "Derivative Arbitrage",
            reason: "Complex strategies for experienced investors",
            href: "/info/derivative-arbitrage",
          },
        ],
      }
    } else if (score >= maxScore * 0.5) {
      return {
        profile: "BALANCED INVESTOR",
        description: "You seek a balance between growth and stability",
        strategies: [
          {
            name: "Derivative Arbitrage",
            reason: "Moderate risk with consistent returns",
            href: "/info/derivative-arbitrage",
          },
          {
            name: "Lending Markets",
            reason: "Stable yields with lower volatility",
            href: "/info/lending-markets",
          },
          {
            name: "Polymarket Arbitrage",
            reason: "Diversification with medium-risk opportunities",
            href: "/info/polymarket-arbitrage",
          },
        ],
      }
    } else {
      return {
        profile: "CONSERVATIVE INVESTOR",
        description: "You prioritize capital preservation and steady returns",
        strategies: [
          {
            name: "Lending Markets",
            reason: "Low-risk strategy with predictable yields",
            href: "/info/lending-markets",
          },
          {
            name: "Derivative Arbitrage",
            reason: "Moderate risk with systematic approach",
            href: "/info/derivative-arbitrage",
          },
        ],
      }
    }
  }

  const resetTest = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  if (showResults) {
    const recommendations = getRecommendations()

    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Navigation />

        <main className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
          <Link href="/info" className="inline-flex items-center gap-2 font-mono text-sm mb-8 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            BACK TO INFO
          </Link>

          <div className="border-2 border-foreground p-6 sm:p-8 bg-accent/10 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono">ASSESSMENT COMPLETE</h1>
                <p className="text-sm sm:text-base font-mono text-muted-foreground mt-2">
                  Your Risk Profile: <span className="text-foreground font-bold">{recommendations.profile}</span>
                </p>
              </div>
            </div>
            <p className="font-mono text-sm sm:text-base">{recommendations.description}</p>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-mono mb-6">RECOMMENDED STRATEGIES</h2>

          <div className="space-y-4 mb-8">
            {recommendations.strategies.map((strategy, index) => (
              <Link
                key={index}
                href={strategy.href}
                className="block border-2 border-foreground p-4 sm:p-6 hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-mono mb-2">{strategy.name}</h3>
                    <p className="text-sm sm:text-base font-mono text-muted-foreground">{strategy.reason}</p>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-accent">{index + 1}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetTest}
              className="flex-1 border-2 border-foreground px-6 py-3 font-mono font-bold hover:bg-muted transition-colors"
            >
              RETAKE TEST
            </button>
            <Link
              href="/app"
              className="flex-1 border-2 border-foreground px-6 py-3 font-mono font-bold bg-foreground text-background hover:bg-background hover:text-foreground transition-colors text-center"
            >
              VIEW STRATEGIES
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navigation />

      <main className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        <Link href="/info" className="inline-flex items-center gap-2 font-mono text-sm mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          BACK TO INFO
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono mb-4">RISK ASSESSMENT TEST</h1>
          <p className="text-base sm:text-lg text-muted-foreground font-mono">
            Answer {questions.length} questions to discover which instruments match your financial goals
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm text-muted-foreground">
              QUESTION {currentQuestion + 1} OF {questions.length}
            </span>
            <span className="font-mono text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="border-2 border-foreground h-4 bg-background">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="border-2 border-foreground p-6 sm:p-8 mb-8 bg-muted/30">
          <h2 className="text-xl sm:text-2xl font-bold font-mono mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className="w-full border-2 border-foreground p-4 font-mono text-left hover:bg-foreground hover:text-background transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        {currentQuestion > 0 && (
          <button
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="border-2 border-foreground px-6 py-3 font-mono font-bold hover:bg-muted transition-colors"
          >
            PREVIOUS QUESTION
          </button>
        )}
      </main>
    </div>
  )
}
