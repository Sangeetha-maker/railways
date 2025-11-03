"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AIDecisionPanel } from "@/components/ai-decision-panel"
import { WhatIfSimulationPanel } from "@/components/what-if-simulation-panel"
import { TrainMessagesPanel } from "@/components/train-messages-panel"
import { TimeDistanceChartPanel } from "@/components/time-distance-chart-panel"
import AISuggestionsPanel from "@/components/ai-suggestions-panel"
import { integratedRailwaySystem, type SystemState } from "@/lib/integrated-railway-system"
import { performanceMetrics } from "@/lib/railway-data"
import { getLiveTrainData, type LiveTrainData } from "@/lib/actions/train-actions"
import { TrainIcon, AlertTriangle, Clock, Activity, MapPin, Zap, Shield, RefreshCw, Play, Pause } from "lucide-react"

export function RailwayDashboard() {
  const [systemState, setSystemState] = useState<SystemState>({
    trains: [],
    messages: [],
    conflicts: [],
    trackSections: [],
    isPeakHours: false,
    lastUpdate: new Date(),
    activeSchedules: [],
    currentTrainMovements: [],
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isSimulationRunning, setIsSimulationRunning] = useState(true)
  const [liveTrainData, setLiveTrainData] = useState<LiveTrainData[]>([])
  const [isLoadingTrains, setIsLoadingTrains] = useState(true)

  useEffect(() => {
    const handleSystemUpdate = (state: SystemState) => {
      console.log("[v0] System state updated:", {
        trainsCount: state.trains.length,
        messagesCount: state.messages.length,
        conflictsCount: state.conflicts.length,
        isPeakHours: state.isPeakHours,
        activeSchedules: state.activeSchedules.length,
      })
      setSystemState(state)
    }

    integratedRailwaySystem.subscribe(handleSystemUpdate)
    return () => integratedRailwaySystem.unsubscribe(handleSystemUpdate)
  }, [])

  useEffect(() => {
    const fetchTrainData = async () => {
      if (!isSimulationRunning) return

      try {
        console.log("[v0] Fetching live train data...")
        setIsLoadingTrains(true)
        const data = await getLiveTrainData()
        setLiveTrainData(data)
        console.log("[v0] Live train data updated:", data.length, "trains")
      } catch (error) {
        console.error("[v0] Error fetching train data:", error)
      } finally {
        setIsLoadingTrains(false)
      }
    }

    fetchTrainData()

    const trainDataInterval = setInterval(fetchTrainData, 5000)

    return () => clearInterval(trainDataInterval)
  }, [isSimulationRunning])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleResolveConflict = (conflictId: string) => {
    console.log("[v0] Resolving conflict:", conflictId)
    integratedRailwaySystem.resolveConflict(conflictId)
  }

  const handleRefreshData = async () => {
    console.log("[v0] Refreshing system data")
    setCurrentTime(new Date())
    const currentState = integratedRailwaySystem.getCurrentState()
    setSystemState({ ...currentState, lastUpdate: new Date() })

    try {
      setIsLoadingTrains(true)
      const data = await getLiveTrainData()
      setLiveTrainData(data)
    } catch (error) {
      console.error("[v0] Error refreshing train data:", error)
    } finally {
      setIsLoadingTrains(false)
    }
  }

  const handleToggleSimulation = () => {
    setIsSimulationRunning(!isSimulationRunning)
    console.log("[v0] Simulation toggled:", !isSimulationRunning)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-green-500"
      case "delayed":
        return "bg-orange-500"
      case "cancelled":
        return "bg-red-500"
      case "diverted":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "border-yellow-500"
      case "medium":
        return "border-orange-500"
      case "high":
        return "border-red-500"
      case "critical":
        return "border-red-700"
      default:
        return "border-gray-500"
    }
  }

  const getTrainTypeDisplay = (type: string) => {
    switch (type) {
      case "emu":
        return "EMU LOCAL"
      case "express":
        return "EXPRESS"
      case "superfast":
        return "SUPERFAST"
      case "freight":
        return "FREIGHT"
      default:
        return type.toUpperCase()
    }
  }

  const getPriorityBadgeColor = (priority: number, trainType: string, isPeakHours: boolean) => {
    if (isPeakHours && trainType === "emu" && priority === 1) {
      return "bg-green-600 text-white"
    }
    if (!isPeakHours && (trainType === "express" || trainType === "superfast") && priority === 1) {
      return "bg-blue-600 text-white"
    }
    return priority <= 2 ? "bg-orange-500 text-white" : "bg-gray-500 text-white"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Railway Decision Support System</h1>
          <p className="text-muted-foreground">
            Chennai Central - Gummidipundi Section | Chennai Division | Southern Railways
            {systemState.isPeakHours && (
              <Badge variant="destructive" className="ml-2">
                PEAK HOURS ACTIVE
              </Badge>
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Live Trains: {liveTrainData.length} | Active Schedules: {systemState.activeSchedules.length}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Time</p>
          <p className="text-lg font-mono">{currentTime.toLocaleTimeString("en-IN", { hour12: false })}</p>
          <div className="flex gap-2 mt-2">
            <Button onClick={handleToggleSimulation} variant="outline" size="sm" className="bg-transparent">
              {isSimulationRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <Button onClick={handleRefreshData} variant="outline" size="sm" className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Punctuality</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{performanceMetrics.punctuality}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{performanceMetrics.throughput}</div>
            <p className="text-xs text-muted-foreground">trains/hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{performanceMetrics.safetyScore}</div>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{performanceMetrics.energyEfficiency}%</div>
            <p className="text-xs text-muted-foreground">+1.5% improvement</p>
          </CardContent>
        </Card>
      </div>

      {systemState.conflicts.filter((c) => c.status === "detected").length > 0 && (
        <Alert className="border-orange-500 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>
              {systemState.conflicts.filter((c) => c.status === "detected").length} active conflicts detected.
            </strong>{" "}
            AI recommendations available for resolution.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="messages">Train Messages</TabsTrigger>
          <TabsTrigger value="what-if">What-If Analysis</TabsTrigger>
          <TabsTrigger value="ai-decisions">AI Decisions</TabsTrigger>
          <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          <TabsTrigger value="track-status">Track Status</TabsTrigger>
          <TabsTrigger value="time-distance">Time-Distance Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrainIcon className="h-5 w-5" />
                Live Train Monitoring - Chennai Central to Gummidipundi
                <Badge variant={isLoadingTrains ? "secondary" : "outline"} className="ml-auto text-xs">
                  {isLoadingTrains
                    ? "Updating..."
                    : `Updated: ${currentTime.toLocaleTimeString("en-IN", { hour12: false })}`}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingTrains && liveTrainData.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <TrainIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Loading live train data from RapidAPI...</p>
                  </div>
                ) : liveTrainData.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <TrainIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No trains currently scheduled for MAS-GPD route</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Train Number</th>
                          <th className="text-left p-3 font-medium">Train Name</th>
                          <th className="text-left p-3 font-medium">Scheduled Time</th>
                          <th className="text-left p-3 font-medium">Actual Time</th>
                          <th className="text-left p-3 font-medium">Delay</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Platform</th>
                          <th className="text-left p-3 font-medium">Route</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveTrainData.map((train, index) => (
                          <tr key={`${train.trainNumber}-${index}`} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(train.status)}`} />
                                <span className="font-mono font-medium">{train.trainNumber}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-medium">{train.trainName}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-mono">{train.scheduledTime}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-mono">{train.actualTime}</span>
                            </td>
                            <td className="p-3">
                              {train.delay > 0 ? (
                                <Badge variant="destructive" className="text-xs">
                                  +{train.delay}min
                                </Badge>
                              ) : (
                                <Badge variant="default" className="text-xs">
                                  On Time
                                </Badge>
                              )}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  train.status === "on-time"
                                    ? "default"
                                    : train.status === "delayed"
                                      ? "destructive"
                                      : train.status === "cancelled"
                                        ? "destructive"
                                        : "secondary"
                                }
                                className="text-xs"
                              >
                                {train.status.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {train.platform && (
                                <Badge variant="outline" className="text-xs">
                                  PF {train.platform}
                                </Badge>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="text-sm text-muted-foreground">
                                {train.currentStation} → {train.nextStation}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {isSimulationRunning && (
                  <div className="text-center text-xs text-muted-foreground mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Auto-refreshing every 5 seconds
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <TrainMessagesPanel messages={systemState.messages} />
        </TabsContent>

        <TabsContent value="what-if" className="space-y-4">
          <WhatIfSimulationPanel integratedSystem={integratedRailwaySystem} />
        </TabsContent>

        <TabsContent value="ai-decisions" className="space-y-4">
          <AIDecisionPanel />
        </TabsContent>

        <TabsContent value="ai-suggestions" className="space-y-4">
          <AISuggestionsPanel />
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Conflict Detection & Management
                <Badge variant="destructive" className="ml-auto">
                  {systemState.conflicts.filter((c) => c.status === "detected").length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemState.conflicts.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No conflicts detected. System operating normally.</p>
                  </div>
                ) : (
                  systemState.conflicts.map((conflict) => (
                    <div
                      key={conflict.id}
                      className={`p-4 border-l-4 rounded-lg ${getSeverityColor(conflict.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{conflict.type}</Badge>
                            <Badge
                              variant={
                                conflict.severity === "high" || conflict.severity === "critical"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {conflict.severity}
                            </Badge>
                            <Badge
                              variant={
                                conflict.status === "resolved"
                                  ? "default"
                                  : conflict.status === "resolving"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {conflict.status}
                            </Badge>
                          </div>
                          <p className="font-medium">Location: {conflict.location}</p>
                          <p className="text-sm text-muted-foreground">Trains: {conflict.trainsInvolved.join(", ")}</p>
                          <p className="text-sm text-muted-foreground">
                            Estimated delay: {conflict.estimatedDelay} minutes
                          </p>
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm font-medium text-blue-900">AI Recommendation:</p>
                            <p className="text-sm text-blue-800">{conflict.aiRecommendation}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={conflict.status === "detected" ? "default" : "outline"}
                          onClick={() => handleResolveConflict(conflict.id)}
                          disabled={conflict.status === "resolving"}
                        >
                          {conflict.status === "detected"
                            ? "Resolve Conflict"
                            : conflict.status === "resolving"
                              ? "Resolving..."
                              : "Resolved"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="track-status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Track Section Status
                <Badge variant="secondary" className="ml-auto">
                  {systemState.trackSections.filter((s) => s.blockStatus === "occupied").length} Occupied
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemState.trackSections.map((section) => (
                  <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{section.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {section.length} km | Max: {section.maxSpeed} km/h
                      </p>
                      {section.lastUpdated && (
                        <p className="text-xs text-muted-foreground">
                          Updated: {section.lastUpdated.toLocaleTimeString("en-IN", { hour12: false })}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={section.blockStatus === "clear" ? "default" : "secondary"}>
                        {section.blockStatus}
                      </Badge>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          section.signalStatus === "green"
                            ? "bg-green-500"
                            : section.signalStatus === "yellow"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      {section.currentOccupancy && <Badge variant="outline">{section.currentOccupancy}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-distance" className="space-y-4">
          <TimeDistanceChartPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
