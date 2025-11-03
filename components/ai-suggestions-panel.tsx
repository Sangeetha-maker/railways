"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, Route, Wrench, AlertCircle } from "lucide-react"
import { getLiveTrainData } from "@/lib/actions/train-actions"

interface AISuggestion {
  id: string
  type: "precedence" | "rerouting" | "maintenance" | "halting" | "delay_risk" | "priority"
  priority: "high" | "medium" | "low"
  title: string
  description: string
  impact: string
  timeSaving: number
  affectedTrains: string[]
  status: "pending" | "accepted" | "overridden" | "simulated"
}

const suggestionIcons = {
  precedence: CheckCircle,
  rerouting: Route,
  maintenance: Wrench,
  halting: Clock,
  delay_risk: AlertTriangle,
  priority: AlertCircle,
}

const priorityColors = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const

export default function AISuggestionsPanel() {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [loading, setLoading] = useState(true)

  const generateAISuggestions = async () => {
    try {
      const trainData = await getLiveTrainData()
      const currentTime = new Date()
      const suggestions: AISuggestion[] = []

      // Generate contextual AI suggestions based on live train data
      trainData.forEach((train, index) => {
        const delay = train.delay || 0

        // Precedence recommendations
        if (delay > 5 && index < trainData.length - 1) {
          const nextTrain = trainData[index + 1]
          suggestions.push({
            id: `prec-${train.number}`,
            type: "precedence",
            priority: delay > 15 ? "high" : "medium",
            title: `Train Precedence Optimization`,
            description: `Hold ${nextTrain.name} at ${nextTrain.currentStation} for ${Math.ceil(delay / 2)} minutes to allow ${train.name} to cross first. This reduces total section delay by ${Math.floor(delay * 0.6)} minutes.`,
            impact: `Reduces cascading delays across ${Math.min(3, trainData.length - index)} downstream trains`,
            timeSaving: Math.floor(delay * 0.6),
            affectedTrains: [train.number, nextTrain.number],
            status: "pending",
          })
        }

        // Delay risk alerts
        if (delay > 10) {
          suggestions.push({
            id: `risk-${train.number}`,
            type: "delay_risk",
            priority: "high",
            title: `Critical Delay Risk Alert`,
            description: `${train.name} is running ${delay} minutes late. If current precedence continues, expected cascading delay = ${Math.floor(delay * 1.4)} min across ${Math.min(4, trainData.length - index)} downstream trains.`,
            impact: `High risk of section-wide delays`,
            timeSaving: 0,
            affectedTrains: [train.number],
            status: "pending",
          })
        }

        // Rerouting recommendations for delayed trains
        if (delay > 8 && train.currentStation !== train.destination) {
          suggestions.push({
            id: `route-${train.number}`,
            type: "rerouting",
            priority: "medium",
            title: `Rerouting Recommendation`,
            description: `Divert ${train.name} to Loop Line at ${train.nextStation} to free main line for Express services. Alternative route adds 3 minutes but prevents 12-minute delays to priority trains.`,
            impact: `Maintains Express priority, reduces overall section delay`,
            timeSaving: 9,
            affectedTrains: [train.number],
            status: "pending",
          })
        }
      })

      // Maintenance window suggestions
      const lowTrafficHours = currentTime.getHours()
      if ((lowTrafficHours >= 14 && lowTrafficHours <= 16) || lowTrafficHours >= 22 || lowTrafficHours <= 5) {
        suggestions.push({
          id: `maint-${Date.now()}`,
          type: "maintenance",
          priority: "low",
          title: `Track Maintenance Window Available`,
          description: `No scheduled trains for next 2h 15m between Ennore and Basin Bridge. Maintenance crew can be allocated track slot safely.`,
          impact: `Safe maintenance window with minimal service disruption`,
          timeSaving: 0,
          affectedTrains: [],
          status: "pending",
        })
      }

      // Halting suggestions for synchronization
      if (trainData.length >= 2) {
        const fastTrain = trainData.find((t) => (t.delay || 0) < 3)
        const slowTrain = trainData.find((t) => (t.delay || 0) > 5)

        if (fastTrain && slowTrain) {
          suggestions.push({
            id: `halt-${fastTrain.number}`,
            type: "halting",
            priority: "medium",
            title: `Synchronization Halt Suggestion`,
            description: `${fastTrain.name} can be halted at ${fastTrain.nextStation} for 4 minutes to synchronize crossing with incoming ${slowTrain.name}. Optimizes track utilization.`,
            impact: `Improves section efficiency and reduces conflicts`,
            timeSaving: 6,
            affectedTrains: [fastTrain.number, slowTrain.number],
            status: "pending",
          })
        }
      }

      setSuggestions(suggestions.slice(0, 6)) // Show top 6 suggestions
    } catch (error) {
      console.error("Error generating AI suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateAISuggestions()
    const interval = setInterval(generateAISuggestions, 15000) // Update every 15 seconds
    return () => clearInterval(interval)
  }, [])

  const handleSuggestionAction = (suggestionId: string, action: "accept" | "override" | "simulate") => {
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === suggestionId
          ? { ...s, status: action === "accept" ? "accepted" : action === "override" ? "overridden" : "simulated" }
          : s,
      ),
    )

    console.log(`[v0] AI Suggestion ${suggestionId} ${action}ed by controller`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI Decision Support</h2>
          <div className="animate-pulse bg-muted h-4 w-20 rounded"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Decision Support</h2>
        <Badge variant="outline" className="text-xs">
          {suggestions.filter((s) => s.status === "pending").length} Active Recommendations
        </Badge>
      </div>

      <div className="grid gap-4">
        {suggestions.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Systems Optimal</h3>
              <p className="text-muted-foreground">
                No AI recommendations at this time. Section operating efficiently.
              </p>
            </CardContent>
          </Card>
        ) : (
          suggestions.map((suggestion) => {
            const Icon = suggestionIcons[suggestion.type]
            return (
              <Card
                key={suggestion.id}
                className={`border-l-4 ${
                  suggestion.priority === "high"
                    ? "border-l-red-500"
                    : suggestion.priority === "medium"
                      ? "border-l-yellow-500"
                      : "border-l-green-500"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`h-5 w-5 ${
                          suggestion.priority === "high"
                            ? "text-red-500"
                            : suggestion.priority === "medium"
                              ? "text-yellow-500"
                              : "text-green-500"
                        }`}
                      />
                      <CardTitle className="text-base">{suggestion.title}</CardTitle>
                    </div>
                    <Badge variant={priorityColors[suggestion.priority]} className="text-xs">
                      {suggestion.priority.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-3 leading-relaxed">{suggestion.description}</CardDescription>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">Impact:</span>
                      <span>{suggestion.impact}</span>
                    </div>
                    {suggestion.timeSaving > 0 && (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <Clock className="h-3 w-3" />
                        <span>Saves {suggestion.timeSaving} minutes</span>
                      </div>
                    )}
                    {suggestion.affectedTrains.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">Affects:</span>
                        <span>Trains {suggestion.affectedTrains.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {suggestion.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSuggestionAction(suggestion.id, "accept")}
                        className="text-xs"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSuggestionAction(suggestion.id, "simulate")}
                        className="text-xs"
                      >
                        Simulate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSuggestionAction(suggestion.id, "override")}
                        className="text-xs"
                      >
                        Override
                      </Button>
                    </div>
                  )}

                  {suggestion.status !== "pending" && (
                    <Badge variant="outline" className="text-xs">
                      {suggestion.status === "accepted"
                        ? "✓ Accepted"
                        : suggestion.status === "overridden"
                          ? "✗ Overridden"
                          : "⚡ Simulated"}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
