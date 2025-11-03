import type { Train, TrackSection, Station, Conflict } from "./railway-data"

export interface SafetyRule {
  id: string
  category: "G&SR" | "SWR" | "OPERATING" | "SIGNAL"
  ruleNumber: string
  description: string
  severity: "critical" | "major" | "minor"
  checkFunction: (context: SafetyContext) => SafetyViolation | null
}

export interface SafetyViolation {
  id: string
  ruleId: string
  severity: "critical" | "major" | "minor"
  description: string
  location: string
  trainId?: string
  timestamp: Date
  status: "active" | "acknowledged" | "resolved"
  recommendedAction: string
  autoResolvable: boolean
}

export interface SafetyContext {
  trains: Train[]
  trackSections: TrackSection[]
  stations: Station[]
  conflicts: Conflict[]
  weather?: {
    visibility: number // in meters (converted from km)
    windSpeed: number // in kmph
    rainfall: number // in mm/hr (estimated from weather conditions)
    condition: string // weather condition
    temperature: number // in celsius
  }
}

export class SafetyComplianceEngine {
  private static safetyRules: SafetyRule[] = [
    // G&SR Rules
    {
      id: "GSR_3_01",
      category: "G&SR",
      ruleNumber: "3.01",
      description: "Speed restriction in foggy conditions (visibility < 200m)",
      severity: "critical",
      checkFunction: (context) => {
        if (context.weather?.visibility && context.weather.visibility < 200) {
          const violatingTrains = context.trains.filter((train) => train.speed > 25)
          if (violatingTrains.length > 0) {
            return {
              id: `GSR_3_01_${Date.now()}`,
              ruleId: "GSR_3_01",
              severity: "critical",
              description: `${violatingTrains.length} trains exceeding 25 km/h speed limit in low visibility`,
              location: "Multiple sections",
              timestamp: new Date(),
              status: "active",
              recommendedAction: "Immediately reduce speed to 25 km/h and proceed with extreme caution",
              autoResolvable: true,
            }
          }
        }
        return null
      },
    },
    {
      id: "GSR_3_02",
      category: "G&SR",
      ruleNumber: "3.02",
      description: "Speed restriction during heavy rain and thunderstorms",
      severity: "major",
      checkFunction: (context) => {
        if (
          context.weather?.condition &&
          (context.weather.condition.toLowerCase().includes("thunderstorm") ||
            context.weather.condition.toLowerCase().includes("heavy rain"))
        ) {
          const violatingTrains = context.trains.filter((train) => train.speed > 50)
          if (violatingTrains.length > 0) {
            return {
              id: `GSR_3_02_${Date.now()}`,
              ruleId: "GSR_3_02",
              severity: "major",
              description: `${violatingTrains.length} trains exceeding 50 km/h speed limit during severe weather`,
              location: "Multiple sections",
              timestamp: new Date(),
              status: "active",
              recommendedAction: "Reduce speed to maximum 50 km/h during thunderstorm/heavy rain conditions",
              autoResolvable: true,
            }
          }
        }
        return null
      },
    },
    {
      id: "GSR_4_03",
      category: "G&SR",
      ruleNumber: "4.03",
      description: "Minimum distance between trains on same track",
      severity: "critical",
      checkFunction: (context) => {
        // Check for trains too close on same track
        const sameTrackTrains = context.trains.filter((train) => train.direction === "down")
        for (let i = 0; i < sameTrackTrains.length - 1; i++) {
          const train1 = sameTrackTrains[i]
          const train2 = sameTrackTrains[i + 1]
          // Simplified distance check - in real system would use GPS coordinates
          if (train1.currentStation === train2.currentStation && train1.id !== train2.id) {
            return {
              id: `GSR_4_03_${Date.now()}`,
              ruleId: "GSR_4_03",
              severity: "critical",
              description: `Trains ${train1.number} and ${train2.number} too close on same track`,
              location: train1.currentStation,
              timestamp: new Date(),
              status: "active",
              recommendedAction: "Stop following train immediately and maintain safe distance",
              autoResolvable: false,
            }
          }
        }
        return null
      },
    },
    {
      id: "GSR_5_02",
      category: "G&SR",
      ruleNumber: "5.02",
      description: "Speed restriction for freight trains",
      severity: "major",
      checkFunction: (context) => {
        const violatingFreight = context.trains.filter((train) => train.type === "freight" && train.speed > 75)
        if (violatingFreight.length > 0) {
          return {
            id: `GSR_5_02_${Date.now()}`,
            ruleId: "GSR_5_02",
            severity: "major",
            description: `Freight train ${violatingFreight[0].number} exceeding 75 km/h speed limit`,
            location: violatingFreight[0].currentStation,
            trainId: violatingFreight[0].id,
            timestamp: new Date(),
            status: "active",
            recommendedAction: "Reduce speed to maximum 75 km/h for freight operations",
            autoResolvable: true,
          }
        }
        return null
      },
    },
    // SWR Rules
    {
      id: "SWR_2_01",
      category: "SWR",
      ruleNumber: "2.01",
      description: "Platform occupation time limit",
      severity: "minor",
      checkFunction: (context) => {
        // Check for trains occupying platforms too long
        const stationaryTrains = context.trains.filter((train) => train.speed === 0)
        for (const train of stationaryTrains) {
          const occupationTime = Date.now() - train.lastUpdated.getTime()
          if (occupationTime > 10 * 60 * 1000) {
            // 10 minutes
            return {
              id: `SWR_2_01_${Date.now()}`,
              ruleId: "SWR_2_01",
              severity: "minor",
              description: `Train ${train.number} occupying platform for over 10 minutes`,
              location: train.currentStation,
              trainId: train.id,
              timestamp: new Date(),
              status: "active",
              recommendedAction: "Clear platform or provide justification for extended stay",
              autoResolvable: false,
            }
          }
        }
        return null
      },
    },
    // Signal Rules
    {
      id: "SIG_1_01",
      category: "SIGNAL",
      ruleNumber: "1.01",
      description: "Red signal violation check",
      severity: "critical",
      checkFunction: (context) => {
        const redSignalSections = context.trackSections.filter((section) => section.signalStatus === "red")
        for (const section of redSignalSections) {
          if (section.currentOccupancy) {
            return {
              id: `SIG_1_01_${Date.now()}`,
              ruleId: "SIG_1_01",
              severity: "critical",
              description: `Train ${section.currentOccupancy} passed red signal at ${section.name}`,
              location: section.name,
              trainId: section.currentOccupancy,
              timestamp: new Date(),
              status: "active",
              recommendedAction: "Emergency stop - investigate signal violation immediately",
              autoResolvable: false,
            }
          }
        }
        return null
      },
    },
    // Operating Rules
    {
      id: "OP_1_01",
      category: "OPERATING",
      ruleNumber: "1.01",
      description: "Maximum passenger capacity check",
      severity: "major",
      checkFunction: (context) => {
        const overcrowdedTrains = context.trains.filter(
          (train) => train.passengers > train.capacity * 1.1, // 10% tolerance
        )
        if (overcrowdedTrains.length > 0) {
          return {
            id: `OP_1_01_${Date.now()}`,
            ruleId: "OP_1_01",
            severity: "major",
            description: `Train ${overcrowdedTrains[0].number} exceeding safe passenger capacity`,
            location: overcrowdedTrains[0].currentStation,
            trainId: overcrowdedTrains[0].id,
            timestamp: new Date(),
            status: "active",
            recommendedAction: "Monitor passenger load and consider additional services",
            autoResolvable: false,
          }
        }
        return null
      },
    },
  ]

  static checkCompliance(context: SafetyContext): SafetyViolation[] {
    const violations: SafetyViolation[] = []

    for (const rule of this.safetyRules) {
      try {
        const violation = rule.checkFunction(context)
        if (violation) {
          violations.push(violation)
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error)
      }
    }

    return violations
  }

  static getSafetyScore(violations: SafetyViolation[]): number {
    let score = 100
    for (const violation of violations) {
      switch (violation.severity) {
        case "critical":
          score -= 15
          break
        case "major":
          score -= 8
          break
        case "minor":
          score -= 3
          break
      }
    }
    return Math.max(0, score)
  }

  static getComplianceReport(context: SafetyContext) {
    const violations = this.checkCompliance(context)
    const safetyScore = this.getSafetyScore(violations)

    const categorizedViolations = {
      critical: violations.filter((v) => v.severity === "critical"),
      major: violations.filter((v) => v.severity === "major"),
      minor: violations.filter((v) => v.severity === "minor"),
    }

    const ruleCategories = {
      "G&SR": violations.filter((v) => this.safetyRules.find((r) => r.id === v.ruleId)?.category === "G&SR"),
      SWR: violations.filter((v) => this.safetyRules.find((r) => r.id === v.ruleId)?.category === "SWR"),
      OPERATING: violations.filter((v) => this.safetyRules.find((r) => r.id === v.ruleId)?.category === "OPERATING"),
      SIGNAL: violations.filter((v) => this.safetyRules.find((r) => r.id === v.ruleId)?.category === "SIGNAL"),
    }

    return {
      safetyScore,
      totalViolations: violations.length,
      violations,
      categorizedViolations,
      ruleCategories,
      compliancePercentage: ((this.safetyRules.length - violations.length) / this.safetyRules.length) * 100,
    }
  }

  static autoResolveViolations(violations: SafetyViolation[]): string[] {
    const actions: string[] = []

    for (const violation of violations) {
      if (violation.autoResolvable) {
        switch (violation.ruleId) {
          case "GSR_3_01":
            actions.push(`Auto-applied speed restriction to 25 km/h for low visibility`)
            break
          case "GSR_3_02":
            actions.push(`Auto-applied speed restriction to 50 km/h for severe weather conditions`)
            break
          case "GSR_5_02":
            actions.push(`Auto-reduced freight train speed to 75 km/h`)
            break
        }
      }
    }

    return actions
  }

  static convertWeatherDataToSafetyFormat(weatherData: any): SafetyContext["weather"] {
    return {
      visibility: weatherData.visibility * 1000, // Convert km to meters for safety rules
      windSpeed: weatherData.windSpeed || 0,
      rainfall: weatherData.condition?.toLowerCase().includes("rain")
        ? weatherData.condition?.toLowerCase().includes("heavy")
          ? 10
          : 2.5
        : 0,
      condition: weatherData.condition,
      temperature: weatherData.temperature,
    }
  }
}

// Mock weather data is now only used as fallback in components
export const mockWeatherData = {
  visibility: 150, // meters - triggers fog rule
  windSpeed: 15, // kmph
  rainfall: 2.5, // mm/hr
}
