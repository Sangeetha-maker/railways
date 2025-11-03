"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { RefreshCw } from "lucide-react"
import { getLiveTrainData } from "@/lib/actions/train-actions"

interface TrainPath {
  trainNumber: string
  trainName: string
  category: "Priority" | "Normal" | "Delayed"
  plannedPath: { time: string; station: string; distance: number }[]
  actualPath: { time: string; station: string; distance: number }[]
}

interface ChartDataPoint {
  time: string
  [key: string]: string | number
}

const stations = [
  { code: "MAS", name: "Chennai Central", distance: 0 },
  { code: "BBQ", name: "Basin Bridge", distance: 8 },
  { code: "WST", name: "Washermanpet", distance: 12 },
  { code: "VLK", name: "Villivakkam", distance: 18 },
  { code: "PER", name: "Perambur", distance: 22 },
  { code: "KOK", name: "Korukkupet", distance: 28 },
  { code: "TNP", name: "Tondiarpet", distance: 32 },
  { code: "EPH", name: "Ennore Port", distance: 38 },
  { code: "SRU", name: "Sulurpeta", distance: 42 },
  { code: "GPD", name: "Gummidipoondi", distance: 48 },
]

export function TimeDistanceChartPanel() {
  const [trainPaths, setTrainPaths] = useState<TrainPath[]>([])
  const [showPlanned, setShowPlanned] = useState(true)
  const [showActual, setShowActual] = useState(true)
  const [efficiency, setEfficiency] = useState(92.93)
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  const generateTimeDistanceData = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Fetching time-distance chart data...")
      const liveData = await getLiveTrainData()
      console.log(`[v0] Time-distance chart updated: ${liveData.length} trains`)

      // Generate time-distance chart data
      const paths: TrainPath[] = liveData.map((train, index) => {
        const baseTime = new Date()
        baseTime.setHours(6 + index * 2, 0, 0, 0) // Stagger train times

        const category: "Priority" | "Normal" | "Delayed" =
          train.delay > 15 ? "Delayed" : train.trainNumber.includes("12") ? "Priority" : "Normal"

        // Generate planned path
        const plannedPath = stations.map((station, stationIndex) => {
          const plannedTime = new Date(baseTime)
          plannedTime.setMinutes(baseTime.getMinutes() + stationIndex * 8) // 8 minutes per station
          return {
            time: plannedTime.toTimeString().slice(0, 5),
            station: station.code,
            distance: station.distance,
          }
        })

        // Generate actual path with delays
        const actualPath = stations.map((station, stationIndex) => {
          const actualTime = new Date(baseTime)
          const baseDelay = train.delay || 0
          const additionalDelay = Math.random() * 5 // Random additional delay
          actualTime.setMinutes(baseTime.getMinutes() + stationIndex * 8 + baseDelay + additionalDelay)
          return {
            time: actualTime.toTimeString().slice(0, 5),
            station: station.code,
            distance: station.distance,
          }
        })

        return {
          trainNumber: train.trainNumber,
          trainName: train.trainName,
          category,
          plannedPath,
          actualPath,
        }
      })

      setTrainPaths(paths)

      // Calculate efficiency
      const totalDelays = paths.reduce((sum, path) => {
        const plannedEnd = new Date(`2024-01-01 ${path.plannedPath[path.plannedPath.length - 1].time}`)
        const actualEnd = new Date(`2024-01-01 ${path.actualPath[path.actualPath.length - 1].time}`)
        return sum + Math.max(0, actualEnd.getTime() - plannedEnd.getTime())
      }, 0)

      const avgDelay = totalDelays / (paths.length * 60000) // Convert to minutes
      const newEfficiency = Math.max(85, 100 - avgDelay * 2)
      setEfficiency(Number(newEfficiency.toFixed(2)))
      console.log(`[v0] Time-distance efficiency calculated: ${newEfficiency.toFixed(2)}%`)

      // Generate chart data for visualization
      generateChartData(paths)
    } catch (error) {
      console.error("Error generating time-distance data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateChartData = (paths: TrainPath[]) => {
    const timePoints: string[] = []
    const startHour = 6
    const endHour = 20

    // Generate time points every 30 minutes
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        timePoints.push(timeStr)
      }
    }

    const data: ChartDataPoint[] = timePoints.map((time) => {
      const dataPoint: ChartDataPoint = { time }

      paths.forEach((path, pathIndex) => {
        if (showPlanned) {
          // Find planned position at this time
          const plannedPos = interpolatePosition(path.plannedPath, time)
          if (plannedPos !== null) {
            dataPoint[`${path.trainNumber}_planned`] = plannedPos
          }
        }

        if (showActual) {
          // Find actual position at this time
          const actualPos = interpolatePosition(path.actualPath, time)
          if (actualPos !== null) {
            dataPoint[`${path.trainNumber}_actual`] = actualPos
          }
        }
      })

      return dataPoint
    })

    setChartData(data)
  }

  const interpolatePosition = (path: { time: string; distance: number }[], targetTime: string): number | null => {
    const target = new Date(`2024-01-01 ${targetTime}`)

    for (let i = 0; i < path.length - 1; i++) {
      const current = new Date(`2024-01-01 ${path[i].time}`)
      const next = new Date(`2024-01-01 ${path[i + 1].time}`)

      if (target >= current && target <= next) {
        const ratio = (target.getTime() - current.getTime()) / (next.getTime() - current.getTime())
        return path[i].distance + (path[i + 1].distance - path[i].distance) * ratio
      }
    }

    return null
  }

  const getCategoryColor = (category: string, isPlanned: boolean) => {
    const colors = {
      Priority: isPlanned ? "#ff6b6b" : "#ff4757",
      Normal: isPlanned ? "#4834d4" : "#3742fa",
      Delayed: isPlanned ? "#ff9f43" : "#ff6348",
    }
    return colors[category as keyof typeof colors] || "#74b9ff"
  }

  useEffect(() => {
    generateTimeDistanceData()
    const interval = setInterval(generateTimeDistanceData, 5000) // Update every 5 seconds to match main dashboard
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (trainPaths.length > 0) {
      generateChartData(trainPaths)
    }
  }, [showPlanned, showActual, trainPaths])

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">Time-Distance Chart (COA Style)</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Planned vs Actual</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{efficiency}%</div>
              <div className="text-xs text-muted-foreground">Overall Efficiency</div>
            </div>
            <Button variant="outline" size="sm" onClick={generateTimeDistanceData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant={showPlanned ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPlanned(!showPlanned)}
            >
              Planned
            </Button>
            <Button variant={showActual ? "default" : "outline"} size="sm" onClick={() => setShowActual(!showActual)}>
              Actual
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 border-2 border-dashed border-gray-400"></div>
              <span>Planned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-gray-600"></div>
              <span>Actual</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[600px] w-full bg-slate-900 rounded-lg p-4">
          <div className="text-white text-sm mb-4 text-center">
            Time-Distance Chart (COA Style) - Planned vs Actual
            <br />
            <span className="text-xs text-gray-400">Overall Efficiency: {efficiency}%</span>
          </div>

          <ChartContainer
            config={{
              planned: { label: "Planned", color: "hsl(var(--chart-1))" },
              actual: { label: "Actual", color: "hsl(var(--chart-2))" },
            }}
            className="h-[520px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} interval="preserveStartEnd" />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={10}
                  domain={[0, 50]}
                  ticks={[0, 8, 12, 18, 22, 28, 32, 38, 42, 48]}
                  tickFormatter={(value) => {
                    const station = stations.find((s) => s.distance === value)
                    return station ? station.code : value.toString()
                  }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                    color: "#F9FAFB",
                  }}
                />

                {trainPaths.map((path, index) => (
                  <g key={path.trainNumber}>
                    {showPlanned && (
                      <Line
                        type="linear"
                        dataKey={`${path.trainNumber}_planned`}
                        stroke={getCategoryColor(path.category, true)}
                        strokeWidth={2}
                        strokeDasharray="5,5"
                        dot={false}
                        connectNulls={false}
                      />
                    )}
                    {showActual && (
                      <Line
                        type="linear"
                        dataKey={`${path.trainNumber}_actual`}
                        stroke={getCategoryColor(path.category, false)}
                        strokeWidth={2}
                        dot={false}
                        connectNulls={false}
                      />
                    )}
                  </g>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="mt-4 text-xs text-gray-400 text-center">
            Stations: MAS-BBQ-WST-VLK-PER-KOK-TNP-EPH-SRU-GPD | Distance: 0-48 km | Duration: 06:00-20:00
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
