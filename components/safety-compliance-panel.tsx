"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SafetyComplianceEngine, mockWeatherData, type SafetyViolation } from "@/lib/safety-compliance"
import { mockTrains, mockConflicts, trackSections, stations } from "@/lib/railway-data"
import { Shield, AlertTriangle, CheckCircle, Eye, Zap, FileText, Activity } from "lucide-react"

interface SafetyCompliancePanelProps {
  integratedSystem?: any
}

export function SafetyCompliancePanel({ integratedSystem }: SafetyCompliancePanelProps) {
  const [complianceReport, setComplianceReport] = useState<any>(null)
  const [autoResolvedActions, setAutoResolvedActions] = useState<string[]>([])
  const [acknowledgedViolations, setAcknowledgedViolations] = useState<Set<string>>(new Set())
  const [currentWeatherData, setCurrentWeatherData] = useState<any>(null)

  useEffect(() => {
    const loadComplianceData = async () => {
      let weatherData = mockWeatherData

      if (integratedSystem && typeof integratedSystem.getWeatherImpact === "function") {
        try {
          const realWeatherData = await integratedSystem.getWeatherImpact()
          setCurrentWeatherData(realWeatherData)

          // Convert real weather data to safety compliance format
          weatherData = SafetyComplianceEngine.convertWeatherDataToSafetyFormat(realWeatherData)
        } catch (error) {
          console.log("[v0] Failed to get real weather data, using mock data:", error)
          setCurrentWeatherData({
            condition: "Mock Data",
            visibility: mockWeatherData.visibility / 1000, // Convert to km for display
            temperature: 30,
            impact: "Using simulated weather data",
            recommendations: ["Real weather data unavailable"],
          })
        }
      } else {
        setCurrentWeatherData({
          condition: "Mock Data",
          visibility: mockWeatherData.visibility / 1000,
          temperature: 30,
          impact: "Using simulated weather data",
          recommendations: ["Real weather data unavailable"],
        })
      }

      const context = {
        trains: mockTrains,
        trackSections,
        stations,
        conflicts: mockConflicts,
        weather: weatherData,
      }

      const report = SafetyComplianceEngine.getComplianceReport(context)
      setComplianceReport(report)

      // Auto-resolve violations where possible
      const actions = SafetyComplianceEngine.autoResolveViolations(report.violations)
      setAutoResolvedActions(actions)
    }

    loadComplianceData()

    if (integratedSystem) {
      const interval = setInterval(loadComplianceData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [integratedSystem])

  const handleAcknowledgeViolation = (violationId: string) => {
    setAcknowledgedViolations((prev) => new Set([...prev, violationId]))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "major":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "minor":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "major":
        return <Eye className="h-4 w-4 text-orange-600" />
      case "minor":
        return <Activity className="h-4 w-4 text-yellow-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  if (!complianceReport) {
    return <div>Loading safety compliance data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Safety Compliance Monitor</h2>
      </div>

      {/* Safety Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{complianceReport.safetyScore}/100</div>
            <Progress value={complianceReport.safetyScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{complianceReport.totalViolations}</div>
            <p className="text-xs text-muted-foreground">
              {complianceReport.categorizedViolations.critical.length} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceReport.compliancePercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Rules followed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Resolved</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{autoResolvedActions.length}</div>
            <p className="text-xs text-muted-foreground">Actions taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Violations Alert */}
      {complianceReport.categorizedViolations.critical.length > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>
              {complianceReport.categorizedViolations.critical.length} critical safety violations detected!
            </strong>{" "}
            Immediate action required.
          </AlertDescription>
        </Alert>
      )}

      {/* Auto-Resolved Actions */}
      {autoResolvedActions.length > 0 && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Zap className="h-5 w-5" />
              Auto-Resolved Safety Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {autoResolvedActions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  {action}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="violations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="violations">Active Violations</TabsTrigger>
          <TabsTrigger value="rules">Rule Categories</TabsTrigger>
          <TabsTrigger value="weather">Weather Impact</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="violations" className="space-y-4">
          {complianceReport.violations.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">All Safety Rules Compliant</p>
                  <p className="text-muted-foreground">No active violations detected</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {complianceReport.violations.map((violation: SafetyViolation) => (
                <Card key={violation.id} className={`border-l-4 ${getSeverityColor(violation.severity)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(violation.severity)}
                          <Badge variant="outline">{violation.ruleId}</Badge>
                          <Badge
                            variant={
                              violation.severity === "critical"
                                ? "destructive"
                                : violation.severity === "major"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {violation.severity}
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{violation.description}</CardTitle>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Location: {violation.location}</p>
                          {violation.trainId && <p>Train: {violation.trainId}</p>}
                          <p>Time: {violation.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={acknowledgedViolations.has(violation.id) ? "outline" : "default"}
                        onClick={() => handleAcknowledgeViolation(violation.id)}
                        disabled={acknowledgedViolations.has(violation.id)}
                      >
                        {acknowledgedViolations.has(violation.id) ? "Acknowledged" : "Acknowledge"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-blue-900">Recommended Action:</p>
                      <p className="text-sm text-blue-800">{violation.recommendedAction}</p>
                    </div>
                    {violation.autoResolvable && (
                      <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Auto-resolvable violation
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(complianceReport.ruleCategories).map(([category, violations]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {category} Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Violations:</span>
                      <span className="font-bold">{(violations as SafetyViolation[]).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical:</span>
                      <span className="font-bold text-red-600">
                        {(violations as SafetyViolation[]).filter((v) => v.severity === "critical").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Major:</span>
                      <span className="font-bold text-orange-600">
                        {(violations as SafetyViolation[]).filter((v) => v.severity === "major").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minor:</span>
                      <span className="font-bold text-yellow-600">
                        {(violations as SafetyViolation[]).filter((v) => v.severity === "minor").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather Impact on Safety - Chennai (MAS-GPD Section)</CardTitle>
              <p className="text-sm text-muted-foreground">
                {currentWeatherData?.condition === "Mock Data"
                  ? "Simulated weather data"
                  : "Live weather data from OpenWeatherMap API"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentWeatherData ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Condition</p>
                      <p className="text-2xl font-bold text-blue-600">{currentWeatherData.condition}</p>
                      <p className="text-xs text-blue-600">Current</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Visibility</p>
                      <p
                        className={`text-2xl font-bold ${currentWeatherData.visibility < 2 ? "text-red-600" : currentWeatherData.visibility < 5 ? "text-orange-600" : "text-green-600"}`}
                      >
                        {currentWeatherData.visibility}km
                      </p>
                      <p
                        className={`text-xs ${currentWeatherData.visibility < 2 ? "text-red-600" : currentWeatherData.visibility < 5 ? "text-orange-600" : "text-green-600"}`}
                      >
                        {currentWeatherData.visibility < 2
                          ? "Critical"
                          : currentWeatherData.visibility < 5
                            ? "Caution"
                            : "Normal"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Temperature</p>
                      <p className="text-2xl font-bold text-orange-600">{currentWeatherData.temperature}°C</p>
                      <p className="text-xs text-orange-600">Current</p>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${
                      currentWeatherData.impact?.includes("Safety protocols")
                        ? "bg-red-50 border-red-200"
                        : currentWeatherData.impact?.includes("delays expected")
                          ? "bg-orange-50 border-orange-200"
                          : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <h4
                      className={`font-semibold mb-2 ${
                        currentWeatherData.impact?.includes("Safety protocols")
                          ? "text-red-900"
                          : currentWeatherData.impact?.includes("delays expected")
                            ? "text-orange-900"
                            : "text-yellow-900"
                      }`}
                    >
                      Impact Assessment
                    </h4>
                    <p
                      className={`${
                        currentWeatherData.impact?.includes("Safety protocols")
                          ? "text-red-800"
                          : currentWeatherData.impact?.includes("delays expected")
                            ? "text-orange-800"
                            : "text-yellow-800"
                      }`}
                    >
                      {currentWeatherData.impact}
                    </p>
                  </div>

                  {currentWeatherData.recommendations && currentWeatherData.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Operational Recommendations:</h4>
                      <div className="space-y-1">
                        {currentWeatherData.recommendations.map((rec: string, index: number) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            • {rec}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentWeatherData.condition === "Mock Data" && (
                    <Alert className="border-blue-500 bg-blue-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Using simulated weather data.</strong> To get live weather data for Chennai, add your
                        OpenWeatherMap API key as OPENWEATHER_API_KEY environment variable in Project Settings.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading weather data...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Summary Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Violation Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Critical:</span>
                      <span className="font-bold text-red-600">
                        {complianceReport.categorizedViolations.critical.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Major:</span>
                      <span className="font-bold text-orange-600">
                        {complianceReport.categorizedViolations.major.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minor:</span>
                      <span className="font-bold text-yellow-600">
                        {complianceReport.categorizedViolations.minor.length}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">System Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Safety Score:</span>
                      <span className="font-bold text-primary">{complianceReport.safetyScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance Rate:</span>
                      <span className="font-bold text-green-600">
                        {complianceReport.compliancePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-Resolved:</span>
                      <span className="font-bold text-blue-600">{autoResolvedActions.length}</span>
                    </div>
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
