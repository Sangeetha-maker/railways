import type { Train, Conflict, TrackSection } from "./railway-data"

export interface AIDecision {
  id: string
  type: "precedence" | "routing" | "scheduling" | "emergency"
  confidence: number // 0-100
  recommendation: string
  reasoning: string[]
  impact: {
    delayReduction: number
    energySaving: number
    safetyImprovement: number
  }
  alternatives: string[]
  implementationSteps: string[]
  estimatedOutcome: string
}

export interface PrecedenceMatrix {
  trainId: string
  priority: number
  factors: {
    trainType: number
    passengerLoad: number
    delay: number
    connectionImportance: number
    fuelEfficiency: number
  }
  calculatedScore: number
}

export class AIDecisionEngine {
  // Calculate train precedence based on multiple factors
  static calculatePrecedence(trains: Train[]): PrecedenceMatrix[] {
    return trains.map((train) => {
      const factors = {
        trainType: this.getTrainTypePriority(train.type),
        passengerLoad: (train.passengers / train.capacity) * 20,
        delay: Math.max(0, 15 - train.delay), // Less delay = higher score
        connectionImportance: train.priority * 5,
        fuelEfficiency: train.type === "emu" ? 10 : train.type === "freight" ? 5 : 8,
      }

      const calculatedScore = Object.values(factors).reduce((sum, val) => sum + val, 0)

      return {
        trainId: train.id,
        priority: train.priority,
        factors,
        calculatedScore,
      }
    })
  }

  private static getTrainTypePriority(type: string): number {
    const priorities = {
      superfast: 25,
      express: 20,
      passenger: 15,
      emu: 12,
      dmu: 10,
      freight: 5,
    }
    return priorities[type as keyof typeof priorities] || 10
  }

  // Generate AI decisions for conflicts
  static generateDecisions(conflicts: Conflict[], trains: Train[], trackSections: TrackSection[]): AIDecision[] {
    return conflicts
      .filter((conflict) => conflict.status === "detected")
      .map((conflict) => {
        const involvedTrains = trains.filter((t) => conflict.trainsInvolved.includes(t.id))
        const precedenceMatrix = this.calculatePrecedence(involvedTrains)

        switch (conflict.type) {
          case "crossing":
            return this.generateCrossingDecision(conflict, involvedTrains, precedenceMatrix)
          case "overtaking":
            return this.generateOvertakingDecision(conflict, involvedTrains, trackSections)
          case "platform":
            return this.generatePlatformDecision(conflict, involvedTrains)
          case "signal":
            return this.generateSignalDecision(conflict, involvedTrains, trackSections)
          default:
            return this.generateGenericDecision(conflict, involvedTrains)
        }
      })
  }

  private static generateCrossingDecision(
    conflict: Conflict,
    trains: Train[],
    precedenceMatrix: PrecedenceMatrix[],
  ): AIDecision {
    const highestPriorityTrain = precedenceMatrix.reduce((prev, current) =>
      prev.calculatedScore > current.calculatedScore ? prev : current,
    )

    const priorityTrain = trains.find((t) => t.id === highestPriorityTrain.trainId)!
    const otherTrains = trains.filter((t) => t.id !== highestPriorityTrain.trainId)

    return {
      id: `AI-${conflict.id}`,
      type: "precedence",
      confidence: 92,
      recommendation: `Grant precedence to ${priorityTrain.number} (${priorityTrain.name}) at ${conflict.location}`,
      reasoning: [
        `${priorityTrain.number} has highest calculated priority score: ${highestPriorityTrain.calculatedScore}`,
        `Train type: ${priorityTrain.type} (high priority service)`,
        `Current delay: ${priorityTrain.delay} minutes`,
        `Passenger load: ${Math.round((priorityTrain.passengers / priorityTrain.capacity) * 100)}%`,
      ],
      impact: {
        delayReduction: 8,
        energySaving: 12,
        safetyImprovement: 15,
      },
      alternatives: [
        `Hold ${otherTrains[0]?.number} for ${conflict.estimatedDelay + 2} minutes`,
        `Divert ${otherTrains[0]?.number} to alternate platform if available`,
      ],
      implementationSteps: [
        `Signal ${priorityTrain.number} to proceed with caution`,
        `Hold ${otherTrains.map((t) => t.number).join(", ")} at previous signal`,
        `Monitor crossing completion`,
        `Release held trains after clearance`,
      ],
      estimatedOutcome: `Reduce overall delay by ${conflict.estimatedDelay - 3} minutes, maintain schedule integrity`,
    }
  }

  private static generateOvertakingDecision(
    conflict: Conflict,
    trains: Train[],
    trackSections: TrackSection[],
  ): AIDecision {
    const fasterTrain = trains.reduce((prev, current) => (prev.speed > current.speed ? prev : current))
    const slowerTrain = trains.find((t) => t.id !== fasterTrain.id)!

    return {
      id: `AI-${conflict.id}`,
      type: "routing",
      confidence: 88,
      recommendation: `Enable overtaking for ${fasterTrain.number} using parallel track`,
      reasoning: [
        `Speed differential: ${fasterTrain.speed - slowerTrain.speed} km/h`,
        `${fasterTrain.number} is ${fasterTrain.type} service with higher priority`,
        `Double track available for safe overtaking`,
        `Minimal impact on slower train schedule`,
      ],
      impact: {
        delayReduction: 12,
        energySaving: 8,
        safetyImprovement: 10,
      },
      alternatives: [
        `Hold faster train behind slower train (not recommended)`,
        `Divert slower train to loop line if available`,
      ],
      implementationSteps: [
        `Clear parallel track section`,
        `Signal ${fasterTrain.number} to change tracks`,
        `Monitor overtaking maneuver`,
        `Return to main line after completion`,
      ],
      estimatedOutcome: `Maintain ${fasterTrain.number} schedule, minimal delay to ${slowerTrain.number}`,
    }
  }

  private static generatePlatformDecision(conflict: Conflict, trains: Train[]): AIDecision {
    const train = trains[0]
    return {
      id: `AI-${conflict.id}`,
      type: "routing",
      confidence: 95,
      recommendation: `Assign ${train.number} to alternate platform`,
      reasoning: [
        `Primary platform occupied or under maintenance`,
        `Alternate platform available and suitable`,
        `Minimal passenger inconvenience`,
        `Maintains station throughput`,
      ],
      impact: {
        delayReduction: 5,
        energySaving: 2,
        safetyImprovement: 8,
      },
      alternatives: [`Wait for primary platform to clear (adds ${conflict.estimatedDelay} min delay)`],
      implementationSteps: [
        `Announce platform change to passengers`,
        `Update station displays`,
        `Guide ${train.number} to alternate platform`,
        `Coordinate with station master`,
      ],
      estimatedOutcome: `Eliminate platform conflict, maintain punctuality`,
    }
  }

  private static generateSignalDecision(
    conflict: Conflict,
    trains: Train[],
    trackSections: TrackSection[],
  ): AIDecision {
    return {
      id: `AI-${conflict.id}`,
      type: "emergency",
      confidence: 98,
      recommendation: `Implement automatic signal override with speed restriction`,
      reasoning: [
        `Signal failure detected in critical section`,
        `Manual control required for safety`,
        `Speed restriction ensures safe passage`,
        `Backup systems operational`,
      ],
      impact: {
        delayReduction: 0,
        energySaving: 0,
        safetyImprovement: 25,
      },
      alternatives: [`Stop all trains until signal repair (major delays)`, `Single line working with pilot protection`],
      implementationSteps: [
        `Activate manual signal control`,
        `Impose 15 km/h speed restriction`,
        `Deploy track protection measures`,
        `Monitor train movements closely`,
        `Coordinate with maintenance team`,
      ],
      estimatedOutcome: `Safe passage maintained, minimal additional delay`,
    }
  }

  private static generateGenericDecision(conflict: Conflict, trains: Train[]): AIDecision {
    return {
      id: `AI-${conflict.id}`,
      type: "scheduling",
      confidence: 75,
      recommendation: `Implement dynamic scheduling adjustment`,
      reasoning: [
        `Multiple factors contributing to conflict`,
        `Requires coordinated response`,
        `Optimize for overall system performance`,
      ],
      impact: {
        delayReduction: 6,
        energySaving: 5,
        safetyImprovement: 12,
      },
      alternatives: [`Maintain current schedule (not optimal)`, `Manual intervention required`],
      implementationSteps: [
        `Analyze current system state`,
        `Calculate optimal timing adjustments`,
        `Implement coordinated changes`,
        `Monitor system response`,
      ],
      estimatedOutcome: `Improved overall system efficiency`,
    }
  }

  // Real-time optimization suggestions
  static generateOptimizationSuggestions(trains: Train[], trackSections: TrackSection[]): string[] {
    const suggestions: string[] = []

    // Energy efficiency suggestions
    const highSpeedTrains = trains.filter((t) => t.speed > 100)
    if (highSpeedTrains.length > 0) {
      suggestions.push(`Consider speed optimization for ${highSpeedTrains.length} trains to improve energy efficiency`)
    }

    // Throughput optimization
    const delayedTrains = trains.filter((t) => t.delay > 5)
    if (delayedTrains.length > 2) {
      suggestions.push(`${delayedTrains.length} trains delayed - consider dynamic rescheduling`)
    }

    // Track utilization
    const occupiedTracks = trackSections.filter((t) => t.currentOccupancy).length
    const totalTracks = trackSections.length
    const utilization = (occupiedTracks / totalTracks) * 100

    if (utilization > 80) {
      suggestions.push(`High track utilization (${utilization.toFixed(1)}%) - optimize train spacing`)
    }

    return suggestions
  }
}
