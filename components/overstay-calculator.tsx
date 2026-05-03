"use client"

import { useState, useMemo } from "react"
import { Calendar, AlertTriangle, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Tier = "safe" | "warning" | "danger"

interface CalculationResult {
  daysOverstayed: number
  tier: Tier
  tierLabel: string
  verdict: string
  daysUntilNextTier: number | null
  nextTierLabel: string | null
  percentToNextTier: number
}

function calculateOverstay(expiryDate: Date): CalculationResult {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  
  const diffTime = today.getTime() - expiry.getTime()
  const daysOverstayed = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  // If not overstayed yet
  if (daysOverstayed <= 0) {
    const daysRemaining = Math.abs(daysOverstayed)
    return {
      daysOverstayed: 0,
      tier: "safe",
      tierLabel: "No Overstay",
      verdict: daysRemaining === 0 
        ? "Your authorized stay expires today. Make sure to depart before midnight."
        : `You have ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining on your authorized stay. You're in good standing.`,
      daysUntilNextTier: 180,
      nextTierLabel: "3-Year Ban Zone",
      percentToNextTier: 0
    }
  }
  
  // Under 180 days - no automatic ban yet
  if (daysOverstayed < 180) {
    return {
      daysOverstayed,
      tier: "safe",
      tierLabel: "No Entry Ban (Yet)",
      verdict: `You've overstayed by ${daysOverstayed} day${daysOverstayed === 1 ? '' : 's'}. You can still leave without triggering an automatic entry ban, but you may face other consequences like visa cancellation or denial of future applications.`,
      daysUntilNextTier: 180 - daysOverstayed,
      nextTierLabel: "3-Year Ban",
      percentToNextTier: (daysOverstayed / 180) * 100
    }
  }
  
  // 180-365 days - 3-year ban territory
  if (daysOverstayed < 365) {
    return {
      daysOverstayed,
      tier: "warning",
      tierLabel: "3-Year Ban Zone",
      verdict: `You've been unlawfully present for ${daysOverstayed} days. If you leave now and try to return, you'll face a 3-year entry ban. This ban starts when you depart the US.`,
      daysUntilNextTier: 365 - daysOverstayed,
      nextTierLabel: "10-Year Ban",
      percentToNextTier: ((daysOverstayed - 180) / 185) * 100
    }
  }
  
  // 365+ days - 10-year ban territory
  return {
    daysOverstayed,
    tier: "danger",
    tierLabel: "10-Year Ban Zone",
    verdict: `You've been unlawfully present for ${daysOverstayed} days (over 1 year). If you leave now and try to return, you'll face a 10-year entry ban. This is the maximum automatic ban under US immigration law.`,
    daysUntilNextTier: null,
    nextTierLabel: null,
    percentToNextTier: 100
  }
}

export function OverstayCalculator() {
  const [dateInput, setDateInput] = useState("")
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const handleCalculate = () => {
    if (!dateInput) return
    
    const date = new Date(dateInput)
    if (isNaN(date.getTime())) return
    
    const calculation = calculateOverstay(date)
    setResult(calculation)
    setHasCalculated(true)
  }

  const handleReset = () => {
    setDateInput("")
    setResult(null)
    setHasCalculated(false)
  }

  const tierColors = {
    safe: "bg-[var(--tier-safe)]",
    warning: "bg-[var(--tier-warning)]",
    danger: "bg-[var(--tier-danger)]"
  }

  const tierBorders = {
    safe: "border-[var(--tier-safe)]",
    warning: "border-[var(--tier-warning)]",
    danger: "border-[var(--tier-danger)]"
  }

  const tierIcons = {
    safe: CheckCircle,
    warning: AlertTriangle,
    danger: XCircle
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input Section */}
      <Card className="border-2 border-secondary mb-6">
        <CardContent className="p-6">
          <h2 className="font-bold text-secondary uppercase tracking-wide mb-2">
            Step 1: Enter Your I-94 Expiry Date
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            This is the &quot;Admit Until Date&quot; on your I-94 record or entry stamp.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="pl-10 h-12 border-2 border-secondary text-foreground bg-card"
                aria-label="I-94 Expiry Date"
              />
            </div>
            <Button 
              onClick={handleCalculate}
              disabled={!dateInput}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {hasCalculated && result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Result Card */}
          <Card className={`border-2 ${tierBorders[result.tier]}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${tierColors[result.tier]}`}>
                  {(() => {
                    const Icon = tierIcons[result.tier]
                    return <Icon className="h-8 w-8 text-card" />
                  })()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Your Current Status
                  </p>
                  <h3 className="text-2xl font-bold text-secondary mt-1">
                    {result.tierLabel}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Days Overstayed */}
            <Card className="border-2 border-secondary">
              <CardContent className="p-5">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Days Overstayed
                </p>
                <p className="text-4xl font-bold text-secondary mt-2">
                  {result.daysOverstayed}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.daysOverstayed === 0 ? "You're within your authorized stay" : "days of unlawful presence"}
                </p>
              </CardContent>
            </Card>

            {/* Countdown to Next Tier */}
            <Card className="border-2 border-secondary">
              <CardContent className="p-5">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {result.daysUntilNextTier !== null ? "Days Until Next Tier" : "Maximum Tier Reached"}
                </p>
                {result.daysUntilNextTier !== null ? (
                  <>
                    <p className="text-4xl font-bold text-primary mt-2">
                      {result.daysUntilNextTier}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        until {result.nextTierLabel}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-4xl font-bold text-destructive mt-2">—</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      10-year ban already applies
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {result.tier !== "danger" && (
            <Card className="border-2 border-secondary">
              <CardContent className="p-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-secondary">Consequence Timeline</span>
                  <span className="text-muted-foreground">{Math.round(result.percentToNextTier)}% to next tier</span>
                </div>
                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${tierColors[result.tier]}`}
                    style={{ width: `${Math.min(result.percentToNextTier, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--tier-safe)]" />
                    <span>No Ban (0-179)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--tier-warning)]" />
                    <span>3-Year (180-364)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--tier-danger)]" />
                    <span>10-Year (365+)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verdict */}
          <Card className={`border-2 ${tierBorders[result.tier]} bg-card`}>
            <CardContent className="p-6">
              <h3 className="font-bold text-secondary uppercase tracking-wide mb-3 flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                What This Means
              </h3>
              <p className="text-foreground leading-relaxed">
                {result.verdict}
              </p>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="flex justify-center pt-2">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              Calculate Another Date
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
