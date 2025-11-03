import { type Train, type TrainMessage, stations, mockTrains } from "./railway-data"

export class TrainMovementSimulator {
  private trains: Train[] = [...mockTrains]
  private messages: TrainMessage[] = []
  private isPeakHours = false
  private callbacks: ((trains: Train[], messages: TrainMessage[]) => void)[] = []

  constructor() {
    this.updatePeakHours()
    this.startSimulation()
  }

  private updatePeakHours() {
    const hour = new Date().getHours()
    // Peak hours: 7-10 AM and 5-8 PM
    this.isPeakHours = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)
  }

  private getNextStation(currentStation: string, route: string[], direction: "up" | "down"): string | null {
    const currentIndex = route.indexOf(currentStation)
    if (currentIndex === -1) return null

    if (direction === "up") {
      return currentIndex < route.length - 1 ? route[currentIndex + 1] : null
    } else {
      return currentIndex > 0 ? route[currentIndex - 1] : null
    }
  }

  private generateTrainMessage(
    train: Train,
    action: "entering" | "departing" | "passing",
    station: string,
  ): TrainMessage {
    const stationData = stations.find((s) => s.code === station)
    const platform = Math.floor(Math.random() * (stationData?.platforms || 2)) + 1

    let message = ""
    const trainTypeUpper = train.type.toUpperCase()

    switch (action) {
      case "entering":
        message = `${trainTypeUpper} ${train.number} entering our section into Platform ${platform} at ${stationData?.name}`
        break
      case "departing":
        message = `${trainTypeUpper} ${train.number} departing from Platform ${platform} at ${stationData?.name}`
        break
      case "passing":
        message = `${trainTypeUpper} ${train.number} passing through ${stationData?.name} without halt`
        break
    }

    return {
      id: `MSG_${Date.now()}_${train.id}`,
      trainId: train.id,
      trainNumber: train.number,
      trainType: train.type as any,
      message,
      timestamp: new Date(),
      priority: train.type === "express" ? "high" : train.type === "emu" ? "medium" : "low",
      station,
      platform: platform.toString(),
    }
  }

  private updateTrainPriorities() {
    this.trains = this.trains.map((train) => {
      let newPriority = train.priority

      if (this.isPeakHours) {
        // During peak hours, EMU gets higher priority
        if (train.type === "emu") {
          newPriority = Math.max(1, train.priority - 1)
        }
      } else {
        // Normal hours, express gets priority
        if (train.type === "express" || train.type === "superfast") {
          newPriority = Math.max(1, train.priority - 1)
        }
      }

      return { ...train, priority: newPriority as any }
    })
  }

  private simulateTrainMovement() {
    this.trains = this.trains.map((train) => {
      const nextStation = this.getNextStation(train.currentStation, train.route, train.direction)

      // Simulate train movement every 30-60 seconds
      if (Math.random() < 0.3 && nextStation) {
        // Generate entering message
        const enteringMessage = this.generateTrainMessage(train, "entering", nextStation)
        this.messages.unshift(enteringMessage)

        // Update train position
        const updatedTrain = {
          ...train,
          currentStation: nextStation,
          nextStation: this.getNextStation(nextStation, train.route, train.direction) || "Terminal",
          lastUpdated: new Date(),
          speed:
            train.type === "freight"
              ? 35 + Math.random() * 10
              : train.type === "emu"
                ? 45 + Math.random() * 20
                : 85 + Math.random() * 25,
        }

        // Keep only last 20 messages
        if (this.messages.length > 20) {
          this.messages = this.messages.slice(0, 20)
        }

        return updatedTrain
      }

      return {
        ...train,
        speed: Math.max(0, train.speed + (Math.random() - 0.5) * 10),
        lastUpdated: new Date(),
      }
    })
  }

  private generatePrecedenceRecommendation(): TrainMessage | null {
    // Check for potential precedence scenarios
    const emuTrains = this.trains.filter((t) => t.type === "emu")
    const expressTrains = this.trains.filter((t) => t.type === "express")

    if (this.isPeakHours && emuTrains.length > 0 && expressTrains.length > 0) {
      const emu = emuTrains[0]
      const express = expressTrains[0]

      if (Math.random() < 0.1) {
        // 10% chance of recommendation
        return {
          id: `REC_${Date.now()}`,
          trainId: emu.id,
          trainNumber: emu.number,
          trainType: "emu",
          message: `RECOMMENDATION: EMU ${emu.number} to precede Express ${express.number} due to peak hours - passenger priority`,
          timestamp: new Date(),
          priority: "high",
          station: emu.currentStation,
        }
      }
    }

    return null
  }

  private startSimulation() {
    setInterval(() => {
      this.updatePeakHours()
      this.updateTrainPriorities()
      this.simulateTrainMovement()

      // Generate precedence recommendations
      const recommendation = this.generatePrecedenceRecommendation()
      if (recommendation) {
        this.messages.unshift(recommendation)
      }

      // Notify callbacks
      this.callbacks.forEach((callback) => callback([...this.trains], [...this.messages]))
    }, 10000) // Update every 10 seconds
  }

  public subscribe(callback: (trains: Train[], messages: TrainMessage[]) => void) {
    this.callbacks.push(callback)
    // Immediately call with current data
    callback([...this.trains], [...this.messages])
  }

  public unsubscribe(callback: (trains: Train[], messages: TrainMessage[]) => void) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback)
  }

  public getCurrentData() {
    return {
      trains: [...this.trains],
      messages: [...this.messages],
      isPeakHours: this.isPeakHours,
    }
  }
}

export const trainSimulator = new TrainMovementSimulator()
