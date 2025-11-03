"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AIDecisionEngine, type AIDecision, type PrecedenceMatrix } from "@/lib/ai-decision-engine"
import { integratedRailwaySystem, type SystemState } from "@/lib/integrated-railway-system"
import { Brain, TrendingUp, Zap, CheckCircle, Clock, AlertCircle } from "lucide-react"

export function AIDecisionPanel() {
  const [systemState, setSystemState] = useState<SystemState>({
    trains: [],
    messages: [],
    conflicts: [],
    trackSections: [],
    isPeakHours: false,
    lastUpdate: new Date(),
  })
  const [decisions, setDecisions] = useState<AIDecision[]>([])
  const [precedenceMatrix, setPrecedenceMatrix] = useState<PrecedenceMatrix[]>([])
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<string[]>([])
  const [implementedDecisions, setImplementedDecisions] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handleSystemUpdate = (state: SystemState) => {
      console.log("[v0] AI Panel received system update")
      setSystemState(state)

      const aiDecisions = AIDecisionEngine.generateDecisions(state.conflicts, state.trains, state.trackSections)
      setDecisions(aiDecisions)

      // Calculate precedence matrix
      const matrix = AIDecisionEngine.calculatePrecedence(state.trains)
      setPrecedenceMatrix(matrix.sort((a, b) => b.calculatedScore - a.calculatedScore))

      // Get optimization suggestions
      const suggestions = AIDecisionEngine.generateOptimizationSuggestions(state.trains, state.trackSections)
      setOptimizationSuggestions(suggestions)
    }

    integratedRailwaySystem.subscribe(handleSystemUpdate)
    return () => integratedRailwaySystem.unsubscribe(handleSystemUpdate)
  }, [])

  const handleImplementDecision = (decisionId: string) => {
    console.log("[v0] Implementing AI decision:", decisionId)
    setImplementedDecisions((prev) => new Set([...prev, decisionId]))
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Decision Engine</h2>
        <Badge variant="outline" className="ml-auto">
          {systemState.isPeakHours ? "Peak Hours Mode" : "Normal Mode"}
        </Badge>
      </div>

      <Tabs defaultValue="decisions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="decisions">Active Decisions</TabsTrigger>
          <TabsTrigger value="precedence">Train Precedence</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="decisions" className="space-y-4">
          {decisions.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">No Active Conflicts</p>
                  <p className="text-muted-foreground">All systems operating normally</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            decisions.map((decision) => (
              <Card key={decision.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="outline">{decision.type}</Badge>
                        <span className={`text-sm font-medium ${getConfidenceColor(decision.confidence)}`}>
                          {decision.confidence}% confidence
                        </span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{decision.recommendation}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleImplementDecision(decision.id)}
                      disabled={implementedDecisions.has(decision.id)}
                      variant={implementedDecisions.has(decision.id) ? "outline" : "default"}
                    >
                      {implementedDecisions.has(decision.id) ? "Implemented" : "Implement"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">AI Reasoning:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {decision.reasoning.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Delay Reduction</p>
                      <p className="text-lg font-bold text-green-600">-{decision.impact.delayReduction}min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Energy Saving</p>
                      <p className="text-lg font-bold text-blue-600">{decision.impact.energySaving}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Safety Improvement</p>
                      <p className="text-lg font-bold text-purple-600">+{decision.impact.safetyImprovement}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Implementation Steps:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1">
                      {decision.implementationSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary font-medium">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-green-900">Expected Outcome:</p>
                    <p className="text-sm text-green-800">{decision.estimatedOutcome}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="precedence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Dynamic Train Precedence Matrix
                <Badge variant="secondary" className="ml-auto">
                  Updated: {systemState.lastUpdate.toLocaleTimeString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {precedenceMatrix.map((matrix, index) => {
                  const train = systemState.trains.find((t) => t.id === matrix.trainId)
                  if (!train) return null

                  return (
                    <div key={matrix.trainId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                          <div className="text-xs text-muted-foreground">Rank</div>
                        </div>
                        <div>
                          <p className="font-semibold">
                            {train.number} - {train.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {train.type} | {train.passengers} passengers | {train.currentStation}
                          </p>
                          {systemState.isPeakHours && train.type === "emu" && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              PEAK PRIORITY
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{matrix.calculatedScore.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">AI Score</div>
                        <Progress value={(matrix.calculatedScore / 100) * 100} className="w-20 mt-1" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Real-time Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {optimizationSuggestions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">System Optimally Configured</p>
                  <p className="text-muted-foreground">No optimization suggestions at this time</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {optimizationSuggestions.map((suggestion, index) => (
                    <Alert key={index}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{suggestion}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Avg Decision Time</p>
                  <p className="text-xl font-bold text-blue-600">2.3s</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-xl font-bold text-green-600">94.7%</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Current System Status</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Active Trains:</span>
                    <span className="font-medium ml-2">{systemState.trains.length}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Active Conflicts:</span>
                    <span className="font-medium ml-2">
                      {systemState.conflicts.filter((c) => c.status === "detected").length}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Occupied Sections:</span>
                    <span className="font-medium ml-2">
                      {systemState.trackSections.filter((s) => s.blockStatus === "occupied").length}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Peak Hours:</span>
                    <span className="font-medium ml-2">{systemState.isPeakHours ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
