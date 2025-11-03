"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RotateCcw, TrendingUp, TrendingDown, AlertTriangle, Plus, X, Train, Clock, MapPin } from "lucide-react"

interface SimulationChange {
  id: string
  trainId: string
  trainName: string
  trainNumber: string
  changeType: "priority" | "delay" | "route" | "platform"
  newPriority?: number
  delayMinutes?: number
  newRoute?: string[]
  newPlatform?: string
  description: string
}

interface SimulationResult {
  punctualityChange: number
  throughputChange: number
  conflictsCreated: number
  affectedTrains: string[]
  recommendations: string[]
  cascadingEffects: string[]
  platformImpact: string
}

interface WhatIfSimulationPanelProps {
  integratedSystem?: any
}

export function WhatIfSimulationPanel({ integratedSystem }: WhatIfSimulationPanelProps) {
  const [activeTrains, setActiveTrains] = useState<any[]>([])
  const [customChanges, setCustomChanges] = useState<SimulationChange[]>([])
  const [selectedTrain, setSelectedTrain] = useState<string>("")
  const [changeType, setChangeType] = useState<"priority" | "delay" | "route" | "platform">("priority")
  const [newPriority, setNewPriority] = useState<string>("")
  const [delayMinutes, setDelayMinutes] = useState<string>("")
  const [newPlatform, setNewPlatform] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [scenarioName, setScenarioName] = useState<string>("")
  const [selectedStation, setSelectedStation] = useState<string>("")
  const [stationTrains, setStationTrains] = useState<any[]>([])
  const [weatherData, setWeatherData] = useState<any>(null)
  const [showTrackStatus, setShowTrackStatus] = useState(false)
  const [selectedStationDetails, setSelectedStationDetails] = useState<any>(null)

  useEffect(() => {
    console.log("[v0] WhatIfSimulationPanel: integratedSystem available:", !!integratedSystem)

    if (integratedSystem) {
      const loadActiveTrains = () => {
        try {
          const state = integratedSystem.getCurrentState()
          if (state && state.trains) {
            console.log("[v0] Loading trains from current state:", state.trains.length)
            setActiveTrains(state.trains)
          }
        } catch (error) {
          console.log("[v0] Error loading trains:", error)
        }
      }

      const loadWeatherData = async () => {
        try {
          const weather = await integratedSystem.getWeatherImpact()
          setWeatherData(weather)
        } catch (error) {
          console.log("[v0] Error loading weather:", error)
        }
      }

      loadActiveTrains()
      loadWeatherData()

      const handleSystemUpdate = (state: any) => {
        setActiveTrains(state.trains || [])
      }

      integratedSystem.subscribe(handleSystemUpdate)

      return () => {
        integratedSystem.unsubscribe(handleSystemUpdate)
      }
    }
  }, [integratedSystem])

  const handleStationSelect = (stationCode: string) => {
    setSelectedStation(stationCode)
    if (integratedSystem && typeof integratedSystem.getTrainsByStation === "function") {
      const trains = integratedSystem.getTrainsByStation(stationCode)
      setStationTrains(trains)
    }
  }

  const addChange = () => {
    if (!selectedTrain) return

    const train = activeTrains.find((t) => t.id === selectedTrain)
    if (!train) return

    let description = ""
    const newChange: SimulationChange = {
      id: `change-${Date.now()}`,
      trainId: selectedTrain,
      trainName: train.name,
      trainNumber: train.number,
      changeType,
      description: "",
    }

    switch (changeType) {
      case "priority":
        if (newPriority) {
          newChange.newPriority = Number.parseInt(newPriority)
          description = `Change priority to ${newPriority} for ${train.number}`
        }
        break
      case "delay":
        if (delayMinutes) {
          newChange.delayMinutes = Number.parseInt(delayMinutes)
          description = `Add ${delayMinutes} min delay to ${train.number}`
        }
        break
      case "platform":
        if (newPlatform) {
          newChange.newPlatform = newPlatform
          description = `Move ${train.number} to Platform ${newPlatform}`
        }
        break
      case "route":
        description = `Route change for ${train.number}`
        break
    }

    newChange.description = description
    setCustomChanges([...customChanges, newChange])

    // Reset form
    setSelectedTrain("")
    setNewPriority("")
    setDelayMinutes("")
    setNewPlatform("")
  }

  const removeChange = (changeId: string) => {
    setCustomChanges(customChanges.filter((c) => c.id !== changeId))
  }

  const runCustomSimulation = async () => {
    if (customChanges.length === 0) return

    setIsRunning(true)
    setSimulationResult(null)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    let punctualityChange = 0
    let throughputChange = 0
    let conflictsCreated = 0
    const affectedTrains: string[] = []
    const recommendations: string[] = []
    const cascadingEffects: string[] = []
    let platformImpact = "Minimal impact expected"

    for (const change of customChanges) {
      affectedTrains.push(change.trainNumber)

      switch (change.changeType) {
        case "priority":
          if (change.newPriority && integratedSystem?.simulateTrainPriorityChange) {
            const result = integratedSystem.simulateTrainPriorityChange(change.trainId, change.newPriority)
            if (result.success) {
              affectedTrains.push(...result.affectedTrains)
              recommendations.push(result.impact)

              if (change.newPriority <= 2) {
                punctualityChange += 4.2
                throughputChange += 8
              } else {
                punctualityChange -= 1.8
                throughputChange -= 3
              }
            }
          }
          break

        case "delay":
          if (change.delayMinutes && integratedSystem?.simulateDelayImpact) {
            const result = integratedSystem.simulateDelayImpact(change.trainId, change.delayMinutes)
            if (result.success) {
              cascadingEffects.push(...result.cascadingEffects)
              platformImpact = result.platformImpact
              recommendations.push(...result.recommendations)

              punctualityChange -= change.delayMinutes * 0.4
              throughputChange -= Math.ceil(change.delayMinutes / 8)
              conflictsCreated += Math.ceil(change.delayMinutes / 12)
            }
          }
          break

        case "platform":
          punctualityChange += 1.5
          throughputChange += 3
          recommendations.push(`Platform change for ${change.trainNumber} will improve traffic flow`)
          break
      }
    }

    // System-level analysis
    if (punctualityChange > 5) {
      recommendations.push("Significant improvement in system performance expected")
    } else if (punctualityChange < -5) {
      recommendations.push("Consider additional measures to mitigate negative impact")
    }

    if (conflictsCreated > 2) {
      recommendations.push("High conflict potential - implement staggered timing")
    }

    const result: SimulationResult = {
      punctualityChange: Math.round(punctualityChange * 10) / 10,
      throughputChange: Math.round(throughputChange),
      conflictsCreated,
      affectedTrains: [...new Set(affectedTrains)], // Remove duplicates
      recommendations,
      cascadingEffects,
      platformImpact,
    }

    setSimulationResult(result)
    setIsRunning(false)
  }

  const resetSimulation = () => {
    setCustomChanges([])
    setSimulationResult(null)
    setScenarioName("")
    setSelectedStation("")
    setStationTrains([])
    setSelectedStationDetails(null)
  }

  const addQuickScenario = (type: "peak-priority" | "delay-recovery" | "platform-optimize") => {
    const emuTrains = activeTrains.filter((t) => t.type === "emu")
    const expressTrains = activeTrains.filter((t) => t.type === "express" || t.type === "superfast")

    switch (type) {
      case "peak-priority":
        if (emuTrains.length > 0) {
          const change: SimulationChange = {
            id: `quick-${Date.now()}`,
            trainId: emuTrains[0].id,
            trainName: emuTrains[0].name,
            trainNumber: emuTrains[0].number,
            changeType: "priority",
            newPriority: 1,
            description: `Peak hour EMU priority for ${emuTrains[0].number}`,
          }
          setCustomChanges([...customChanges, change])
        }
        break

      case "delay-recovery":
        const delayedTrains = activeTrains.filter((t) => t.delay > 0)
        if (delayedTrains.length > 0) {
          const change: SimulationChange = {
            id: `quick-${Date.now()}`,
            trainId: delayedTrains[0].id,
            trainName: delayedTrains[0].name,
            trainNumber: delayedTrains[0].number,
            changeType: "priority",
            newPriority: 2,
            description: `Recovery priority for delayed ${delayedTrains[0].number}`,
          }
          setCustomChanges([...customChanges, change])
        }
        break

      case "platform-optimize":
        if (activeTrains.length > 0) {
          const change: SimulationChange = {
            id: `quick-${Date.now()}`,
            trainId: activeTrains[0].id,
            trainName: activeTrains[0].name,
            trainNumber: activeTrains[0].number,
            changeType: "platform",
            newPlatform: "Loop Line",
            description: `Move ${activeTrains[0].number} to loop line for optimization`,
          }
          setCustomChanges([...customChanges, change])
        }
        break
    }
  }

  const showPlatformDetails = (stationCode: string) => {
    if (integratedSystem) {
      const platformStatus = integratedSystem.getPlatformStatus(stationCode)
      setSelectedStationDetails(platformStatus)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Section Controller What-If Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Simulate operational changes and analyze their impact on train movements
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scenario" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="scenario">Create Scenario</TabsTrigger>
              <TabsTrigger value="quick">Quick Actions</TabsTrigger>
              <TabsTrigger value="weather">Weather Impact</TabsTrigger>
              <TabsTrigger value="track">Track Status</TabsTrigger>
              <TabsTrigger value="results">Analysis Results</TabsTrigger>
            </TabsList>

            <TabsContent value="scenario" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Train className="h-5 w-5" />
                    Active Trains ({activeTrains.length})
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Live monitoring data • Last updated: {new Date().toLocaleTimeString("en-IN")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">
                        {activeTrains.filter((t) => t.type === "emu").length}
                      </div>
                      <div className="text-xs text-blue-600">EMU</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">
                        {activeTrains.filter((t) => t.type === "express" || t.type === "superfast").length}
                      </div>
                      <div className="text-xs text-green-600">Express</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="text-lg font-bold text-orange-600">
                        {activeTrains.filter((t) => t.type === "freight").length}
                      </div>
                      <div className="text-xs text-orange-600">Freight</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="text-lg font-bold text-red-600">
                        {activeTrains.filter((t) => t.delay > 0).length}
                      </div>
                      <div className="text-xs text-red-600">Delayed</div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="scenario-name">Scenario Name</Label>
                    <Input
                      id="scenario-name"
                      placeholder="e.g., Peak Hour EMU Priority"
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="train-select">Select Train</Label>
                      <Select value={selectedTrain} onValueChange={setSelectedTrain}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose active train" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeTrains.map((train) => (
                            <SelectItem key={train.id} value={train.id}>
                              <div className="flex items-center gap-2">
                                <Badge variant={train.type === "emu" ? "default" : "secondary"}>
                                  {train.type.toUpperCase()}
                                </Badge>
                                {train.number} - {train.name}
                                {train.delay > 0 && (
                                  <Badge variant="destructive" className="ml-2">
                                    +{train.delay}min
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="change-type">Action Type</Label>
                      <Select
                        value={changeType}
                        onValueChange={(value: "priority" | "delay" | "route" | "platform") => setChangeType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="priority">Change Priority</SelectItem>
                          <SelectItem value="delay">Add/Simulate Delay</SelectItem>
                          <SelectItem value="platform">Platform Change</SelectItem>
                          <SelectItem value="route">Route Modification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {changeType === "priority" && (
                      <div>
                        <Label htmlFor="new-priority">Priority Level (1-5)</Label>
                        <Select value={newPriority} onValueChange={setNewPriority}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Highest</SelectItem>
                            <SelectItem value="2">2 - High</SelectItem>
                            <SelectItem value="3">3 - Normal</SelectItem>
                            <SelectItem value="4">4 - Low</SelectItem>
                            <SelectItem value="5">5 - Lowest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {changeType === "delay" && (
                      <div>
                        <Label htmlFor="delay-minutes">Delay (minutes)</Label>
                        <Input
                          id="delay-minutes"
                          type="number"
                          min="0"
                          max="60"
                          placeholder="5"
                          value={delayMinutes}
                          onChange={(e) => setDelayMinutes(e.target.value)}
                        />
                      </div>
                    )}
                    {changeType === "platform" && (
                      <div>
                        <Label htmlFor="new-platform">Platform/Line</Label>
                        <Select value={newPlatform} onValueChange={setNewPlatform}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Platform 1</SelectItem>
                            <SelectItem value="2">Platform 2</SelectItem>
                            <SelectItem value="Loop Line">Loop Line</SelectItem>
                            <SelectItem value="Main Line">Main Line</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="flex items-end">
                      <Button onClick={addChange} className="w-full" disabled={!selectedTrain}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Change
                      </Button>
                    </div>
                  </div>

                  {customChanges.length > 0 && (
                    <div className="space-y-2">
                      <Label>Scenario Changes ({customChanges.length}):</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {customChanges.map((change) => (
                          <div key={change.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{change.trainNumber}</Badge>
                              <span className="text-sm">{change.description}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeChange(change.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={runCustomSimulation}
                    disabled={customChanges.length === 0 || isRunning}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isRunning ? "Analyzing Impact..." : "Run Simulation Analysis"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quick" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Scenario Templates</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Common section controller actions for immediate analysis
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4 bg-transparent"
                      onClick={() => addQuickScenario("peak-priority")}
                    >
                      <div className="text-left">
                        <div className="font-medium">Peak Hour EMU Priority</div>
                        <div className="text-sm text-muted-foreground">
                          Give highest priority to EMU trains during peak hours
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4 bg-transparent"
                      onClick={() => addQuickScenario("delay-recovery")}
                    >
                      <div className="text-left">
                        <div className="font-medium">Delay Recovery Mode</div>
                        <div className="text-sm text-muted-foreground">
                          Prioritize delayed trains for schedule recovery
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4 bg-transparent"
                      onClick={() => addQuickScenario("platform-optimize")}
                    >
                      <div className="text-left">
                        <div className="font-medium">Platform Optimization</div>
                        <div className="text-sm text-muted-foreground">
                          Move trains to loop lines to improve throughput
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weather Impact Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">Current weather conditions for MAS-GPD section</p>
                </CardHeader>
                <CardContent>
                  {weatherData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{weatherData.condition}</div>
                          <div className="text-sm text-blue-600">Condition</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{weatherData.visibility}km</div>
                          <div className="text-sm text-green-600">Visibility</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{weatherData.temperature}°C</div>
                          <div className="text-sm text-orange-600">Temperature</div>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-2">Impact Assessment</h4>
                        <p className="text-yellow-800">{weatherData.impact}</p>
                      </div>

                      {weatherData.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold">Operational Recommendations:</h4>
                          <div className="space-y-1">
                            {weatherData.recommendations.map((rec: string, index: number) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                • {rec}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading weather data...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="track" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Track Status & Platform Details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Real-time platform occupancy and track status from MAS to GPD
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { code: "MAS", name: "Chennai Central" },
                        { code: "BBQ", name: "Basin Bridge" },
                        { code: "KOUK", name: "Korukkupet" },
                        { code: "TNP", name: "Tondiarpet" },
                        { code: "VOC", name: "V.O.C. Nagar" },
                        { code: "TVT", name: "Tiruvottiyur" },
                        { code: "WCN", name: "Wimco Nagar" },
                        { code: "KTVM", name: "Kathivakkam" },
                        { code: "ENR", name: "Ennore" },
                        { code: "APH", name: "Attipattu Pudu Nagar H" },
                        { code: "ATP", name: "Attipattu" },
                        { code: "NDKM", name: "Nandiyampakkam" },
                        { code: "MJR", name: "Minjur" },
                        { code: "ABEO", name: "Anuppambattu" },
                        { code: "PER", name: "Ponneri" },
                        { code: "KPTI", name: "Kavaraippettai" },
                        { code: "GPD", name: "Gummidipoondi" },
                      ].map((station) => {
                        const trainsAtStation = activeTrains.filter((train) => {
                          // Check if train is currently at this station or nearby
                          return (
                            train.currentLocation?.includes(station.name) ||
                            train.currentLocation?.includes(station.code) ||
                            train.nextStation === station.code ||
                            train.lastStation === station.code ||
                            (train.route && train.route.includes(station.code))
                          )
                        })

                        // Generate realistic platform status based on train presence and time
                        const platformStatuses = [1, 2, 3].map((platformNum) => {
                          const isOccupied = trainsAtStation.length > 0 && Math.random() > 0.6
                          const isPeakHour = new Date().getHours() >= 7 && new Date().getHours() <= 10
                          const baseOccupancy = isPeakHour ? 0.4 : 0.2

                          return {
                            number: platformNum,
                            occupied: isOccupied || Math.random() < baseOccupancy,
                            trainNumber: isOccupied && trainsAtStation[0] ? trainsAtStation[0].number : null,
                          }
                        })

                        return (
                          <Button
                            key={station.code}
                            variant="outline"
                            className="justify-between h-auto p-3 bg-transparent"
                            onClick={() => showPlatformDetails(station.code)}
                          >
                            <div className="text-left">
                              <div className="font-medium">{station.code}</div>
                              <div className="text-xs text-muted-foreground">{trainsAtStation.length} trains</div>
                            </div>
                            <div className="flex gap-1">
                              {platformStatuses.map((platform) => (
                                <div
                                  key={platform.number}
                                  className={`w-3 h-3 rounded-full ${
                                    platform.occupied ? "bg-red-400" : "bg-green-400"
                                  }`}
                                  title={`Platform ${platform.number}${
                                    platform.occupied && platform.trainNumber
                                      ? ` - Train ${platform.trainNumber}`
                                      : platform.occupied
                                        ? " - Occupied"
                                        : " - Available"
                                  }`}
                                />
                              ))}
                            </div>
                          </Button>
                        )
                      })}
                    </div>

                    {selectedStationDetails && (
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle className="text-base">
                            {selectedStationDetails.stationName} Platform Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Up Line Tracks:</span>{" "}
                                {String(selectedStationDetails.upLineTracks)}
                              </div>
                              <div>
                                <span className="font-medium">Down Line Tracks:</span>{" "}
                                {String(selectedStationDetails.downLineTracks)}
                              </div>
                              <div>
                                <span className="font-medium">Loop Lines:</span>{" "}
                                {String(selectedStationDetails.loopLines)}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h5 className="font-medium">Platform Status:</h5>
                              <div className="grid grid-cols-2 gap-2">
                                {selectedStationDetails.platforms?.map((platform: any, index: number) => (
                                  <div
                                    key={index}
                                    className={`p-2 rounded text-sm ${
                                      platform.status === "occupied"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-green-100 text-green-800"
                                    }`}
                                  >
                                    <div className="font-medium">Platform {String(platform.number)}</div>
                                    <div className="text-xs">
                                      {platform.status === "occupied"
                                        ? `Train: ${String(platform.currentTrain)}`
                                        : "Available"}
                                    </div>
                                  </div>
                                )) || (
                                  <div className="text-sm text-muted-foreground">Platform details not available</div>
                                )}
                              </div>
                            </div>

                            {activeTrains.filter(
                              (train) =>
                                train.currentLocation?.includes(selectedStationDetails.stationName) ||
                                train.nextStation === selectedStationDetails.stationCode,
                            ).length > 0 && (
                              <div className="space-y-2">
                                <h5 className="font-medium">Current Trains:</h5>
                                <div className="space-y-1">
                                  {activeTrains
                                    .filter(
                                      (train) =>
                                        train.currentLocation?.includes(selectedStationDetails.stationName) ||
                                        train.nextStation === selectedStationDetails.stationCode,
                                    )
                                    .map((train, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm"
                                      >
                                        <div>
                                          <span className="font-medium">{String(train.number)}</span> -{" "}
                                          {String(train.name)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge variant={train.type === "emu" ? "default" : "secondary"}>
                                            {String(train.type).toUpperCase()}
                                          </Badge>
                                          {train.delay > 0 && <Badge variant="destructive">+{train.delay}min</Badge>}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {simulationResult ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Analysis Results: {scenarioName || "Custom Scenario"}</CardTitle>
                      <Button onClick={resetSimulation} variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isRunning ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Analyzing operational impact...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-2">
                                {simulationResult.punctualityChange > 0 ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm font-medium">Punctuality Impact</span>
                              </div>
                              <p className="text-2xl font-bold">
                                {simulationResult.punctualityChange > 0 ? "+" : ""}
                                {simulationResult.punctualityChange}%
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-2">
                                {simulationResult.throughputChange > 0 ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                                <span className="text-sm font-medium">Throughput Change</span>
                              </div>
                              <p className="text-2xl font-bold">
                                {simulationResult.throughputChange > 0 ? "+" : ""}
                                {simulationResult.throughputChange}
                              </p>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-medium">Potential Conflicts</span>
                              </div>
                              <p className="text-2xl font-bold">{simulationResult.conflictsCreated}</p>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Train className="h-4 w-4" />
                                Affected Trains ({simulationResult.affectedTrains.length})
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-1">
                                {simulationResult.affectedTrains.map((train, index) => (
                                  <Badge key={index} variant="outline">
                                    {String(train)}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Platform Impact
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">{String(simulationResult.platformImpact)}</p>
                            </CardContent>
                          </Card>
                        </div>

                        {simulationResult.cascadingEffects.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Cascading Effects
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-1">
                                {simulationResult.cascadingEffects.map((effect, index) => (
                                  <p key={index} className="text-sm text-muted-foreground">
                                    • {String(effect)}
                                  </p>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Operational Recommendations</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {simulationResult.recommendations.map((rec, index) => (
                                <p key={index} className="text-sm text-muted-foreground">
                                  • {String(rec)}
                                </p>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <div
                          className={`p-4 rounded-lg ${
                            simulationResult.punctualityChange > 0
                              ? "bg-green-50 border border-green-200"
                              : "bg-orange-50 border border-orange-200"
                          }`}
                        >
                          <h4
                            className={`font-semibold mb-2 ${
                              simulationResult.punctualityChange > 0 ? "text-green-900" : "text-orange-900"
                            }`}
                          >
                            {simulationResult.punctualityChange > 0 ? "Positive Impact Expected" : "Caution Required"}
                          </h4>
                          <p
                            className={`text-sm ${
                              simulationResult.punctualityChange > 0 ? "text-green-800" : "text-orange-800"
                            }`}
                          >
                            {simulationResult.punctualityChange > 0
                              ? "The proposed changes are expected to improve overall system performance. Consider implementing these modifications."
                              : "The proposed changes may have negative impacts. Review recommendations carefully before implementation."}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No analysis results available.</p>
                      <p className="text-sm">
                        Create a scenario and run the simulation to see detailed impact analysis.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
