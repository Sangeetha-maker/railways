import {
  type Train,
  type TrainMessage,
  type Conflict,
  type TrackSection,
  stations,
  mockTrains,
  trackSections,
} from "./railway-data"
import {
  generateRealisticTrainMovements,
  calculateTrainPriority,
  peakHours,
  emuLocalSchedules,
  expressTrainSchedules,
  freightTrainSchedules,
  type RealTrainSchedule,
} from "./realistic-train-data"
import { platformManager, type StationPlatformData } from "./platform-management"
import { WeatherService, type WeatherData } from "./weather-service"

export interface SystemState {
  trains: Train[]
  messages: TrainMessage[]
  conflicts: Conflict[]
  trackSections: TrackSection[]
  isPeakHours: boolean
  lastUpdate: Date
  activeSchedules: RealTrainSchedule[]
  currentTrainMovements: any[]
  platformStatus: StationPlatformData[]
  systemThroughput: number
}

export class IntegratedRailwaySystem {
  private state: SystemState = {
    trains: [...mockTrains],
    messages: [],
    conflicts: [],
    trackSections: [...trackSections],
    isPeakHours: false,
    lastUpdate: new Date(),
    activeSchedules: [...emuLocalSchedules, ...expressTrainSchedules, ...freightTrainSchedules],
    currentTrainMovements: [],
    platformStatus: platformManager.getAllStationsStatus(),
    systemThroughput: 0,
  }

  private callbacks: ((state: SystemState) => void)[] = []

  constructor() {
    this.updatePeakHours()
    this.initializeRealisticTrains()
    this.initializeSystem()
    this.startSimulation()
  }

  private initializeRealisticTrains() {
    const realisticMovements = generateRealisticTrainMovements()
    this.state.currentTrainMovements = realisticMovements

    // Convert realistic movements to Train objects
    const realisticTrains: Train[] = realisticMovements.map((movement, index) => {
      const currentTime = new Date()
      const stationIndex = Math.floor(Math.random() * movement.schedule.length)
      const currentStationData = movement.schedule[stationIndex]
      const nextStationData = movement.schedule[stationIndex + 1]

      return {
        id: `REAL_${movement.trainNumber}`,
        number: movement.trainNumber,
        name: movement.trainName,
        type: movement.type as any,
        currentStation: currentStationData.stationCode,
        nextStation: nextStationData?.stationCode || "Terminal",
        status: Math.random() > 0.8 ? "delayed" : "on-time",
        delay: Math.random() > 0.8 ? Math.floor(Math.random() * 10) + 1 : 0,
        speed: this.calculateRealisticSpeed(movement.type),
        direction: Math.random() > 0.5 ? "up" : "down",
        priority: movement.priority as any,
        passengers: this.calculatePassengerLoad(movement.type),
        capacity: this.getTrainCapacity(movement.type),
        lastUpdated: new Date(),
        estimatedArrival: new Date(Date.now() + (Math.random() * 20 + 5) * 60000),
        estimatedDeparture: new Date(Date.now() + (Math.random() * 25 + 7) * 60000),
        route: movement.schedule.map((s) => s.stationCode),
      }
    })

    // Mix realistic trains with some mock trains
    this.state.trains = [...realisticTrains, ...mockTrains.slice(0, 2)]
  }

  // Helper methods for realistic train data
  private calculateRealisticSpeed(trainType: string): number {
    switch (trainType) {
      case "emu":
        return 35 + Math.random() * 25
      case "express":
        return 65 + Math.random() * 30
      case "superfast":
        return 80 + Math.random() * 40
      case "freight":
        return 25 + Math.random() * 15
      default:
        return 45 + Math.random() * 20
    }
  }

  private calculatePassengerLoad(trainType: string): number {
    switch (trainType) {
      case "emu":
        return Math.floor(800 + Math.random() * 400)
      case "express":
        return Math.floor(600 + Math.random() * 600)
      case "superfast":
        return Math.floor(700 + Math.random() * 500)
      case "freight":
        return 0
      default:
        return Math.floor(400 + Math.random() * 300)
    }
  }

  private getTrainCapacity(trainType: string): number {
    switch (trainType) {
      case "emu":
        return 1200
      case "express":
        return 1400
      case "superfast":
        return 1600
      case "freight":
        return 0
      default:
        return 1000
    }
  }

  private initializeSystem() {
    this.updateTrackOccupancy()
    this.detectConflicts()
  }

  private updatePeakHours() {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    this.state.isPeakHours =
      (currentTime >= peakHours.morning.start && currentTime <= peakHours.morning.end) ||
      (currentTime >= peakHours.evening.start && currentTime <= peakHours.evening.end)
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

  private updateTrackOccupancy() {
    platformManager.updatePlatformStatus()
    this.state.platformStatus = platformManager.getAllStationsStatus()

    this.state.trackSections = this.state.trackSections.map((section) => {
      // Check for trains in this specific track section more accurately
      const trainsInSection = this.state.trains.filter((train) => {
        // Check if train's current station matches any station in this section
        const sectionStations = section.name.split(" - ")
        return sectionStations.some(
          (stationName) =>
            train.currentStation &&
            (train.currentStation.toLowerCase().includes(stationName.toLowerCase()) ||
              stationName.toLowerCase().includes(train.currentStation.toLowerCase()) ||
              // Also check by station codes
              this.getStationCode(train.currentStation) === this.getStationCode(stationName)),
        )
      })

      const hasTrains = trainsInSection.length > 0
      const currentTrain = trainsInSection[0]

      if (currentTrain && section.name.includes(currentTrain.currentStation)) {
        const stationData = this.state.platformStatus.find(
          (s) =>
            s.stationName.toLowerCase().includes(currentTrain.currentStation.toLowerCase()) ||
            s.stationCode === currentTrain.currentStation,
        )

        if (stationData) {
          const platform = platformManager.findBestPlatform(
            stationData.stationCode,
            currentTrain.type,
            currentTrain.direction,
            currentTrain.priority,
          )

          if (platform && platform.status === "clear") {
            platformManager.occupyPlatform(stationData.stationCode, platform.id, currentTrain.number)
          }
        }
      }

      return {
        ...section,
        blockStatus: hasTrains ? ("occupied" as const) : ("clear" as const),
        signalStatus: hasTrains ? ("red" as const) : ("green" as const),
        currentOccupancy: currentTrain ? `${currentTrain.number}` : undefined,
        lastUpdated: new Date(),
      }
    })

    this.calculateSystemThroughput()
  }

  private calculateSystemThroughput() {
    const totalThroughput = this.state.platformStatus.reduce((total, station) => {
      return total + platformManager.calculateThroughput(station.stationCode)
    }, 0)

    this.state.systemThroughput = totalThroughput
  }

  private generateTrainMessage(
    train: Train,
    action: "entering" | "departing" | "passing",
    station: string,
  ): TrainMessage {
    const stationData = stations.find((s) => s.code === station)
    const platformData = this.state.platformStatus.find(
      (s) => s.stationCode === station || s.stationName.toLowerCase().includes(station.toLowerCase()),
    )

    let platformNumber = Math.floor(Math.random() * (stationData?.platforms || 2)) + 1

    if (platformData) {
      const assignedPlatform = platformManager.findBestPlatform(
        platformData.stationCode,
        train.type,
        train.direction,
        train.priority,
      )
      if (assignedPlatform) {
        platformNumber = assignedPlatform.number
      }
    }

    let message = ""
    const trainTypeUpper = train.type.toUpperCase()
    const currentTime = new Date().toLocaleTimeString("en-IN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })

    switch (action) {
      case "entering":
        if (train.type === "emu") {
          message = `${currentTime} - EMU ${train.number} from Sullurpeta entering GPD-GDR section into Platform ${platformNumber} at ${stationData?.name}`
        } else if (train.type === "express" || train.type === "superfast") {
          message = `${currentTime} - EXPRESS ${train.number} entering our section into Platform ${platformNumber} at ${stationData?.name} - ${train.delay > 0 ? `Running ${train.delay} min late` : "On time"}`
        } else if (train.type === "freight") {
          message = `${currentTime} - FREIGHT ${train.number} entering section at ${stationData?.name} - Unscheduled movement`
        } else {
          message = `${currentTime} - ${trainTypeUpper} ${train.number} entering our section into Platform ${platformNumber} at ${stationData?.name}`
        }
        break
      case "departing":
        message = `${currentTime} - ${trainTypeUpper} ${train.number} departing from Platform ${platformNumber} at ${stationData?.name} - Next: ${train.nextStation}`
        if (platformData) {
          const platform = platformData.platforms.find((p) => p.number === platformNumber)
          if (platform) {
            platformManager.clearPlatform(platformData.stationCode, platform.id)
          }
        }
        break
      case "passing":
        message = `${currentTime} - ${trainTypeUpper} ${train.number} passing through ${stationData?.name} without halt - Speed: ${Math.round(train.speed)} kmph`
        break
    }

    return {
      id: `MSG_${Date.now()}_${train.id}`,
      trainId: train.id,
      trainNumber: train.number,
      trainType: train.type as any,
      message,
      timestamp: new Date(),
      priority:
        train.type === "express" || train.type === "superfast" ? "high" : train.type === "emu" ? "medium" : "low",
      station,
      platform: platformNumber.toString(),
    }
  }

  private updateTrainPriorities() {
    const currentTime = new Date()
    this.state.trains = this.state.trains.map((train) => {
      const newPriority = calculateTrainPriority(train.type, currentTime)
      return { ...train, priority: newPriority as any }
    })
  }

  private simulateTrainMovement() {
    this.state.trains = this.state.trains.map((train) => {
      const nextStation = this.getNextStation(train.currentStation, train.route, train.direction)

      if (Math.random() < 0.3 && nextStation) {
        const enteringMessage = this.generateTrainMessage(train, "entering", nextStation)
        this.state.messages.unshift(enteringMessage)

        const updatedTrain = {
          ...train,
          currentStation: nextStation,
          nextStation: this.getNextStation(nextStation, train.route, train.direction) || "Terminal",
          lastUpdated: new Date(),
          speed: this.calculateTrainSpeed(train),
        }

        if (this.state.messages.length > 20) {
          this.state.messages = this.state.messages.slice(0, 20)
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

  private calculateTrainSpeed(train: Train): number {
    const baseSpeed = train.type === "freight" ? 35 : train.type === "emu" ? 45 : 85
    const variation = train.type === "freight" ? 10 : train.type === "emu" ? 20 : 25
    return baseSpeed + Math.random() * variation
  }

  private generateSystemRecommendations() {
    const activeConflicts = this.state.conflicts.filter((c) => c.status === "detected")

    if (activeConflicts.length > 0 && Math.random() < 0.2) {
      const conflict = activeConflicts[0]
      const recommendation: TrainMessage = {
        id: `SYS_REC_${Date.now()}`,
        trainId: "SYSTEM",
        trainNumber: "SYSTEM",
        trainType: "system",
        message: `SYSTEM RECOMMENDATION: ${conflict.aiRecommendation}`,
        timestamp: new Date(),
        priority: "high",
        station: conflict.location,
      }
      this.state.messages.unshift(recommendation)
    }
  }

  private startSimulation() {
    setInterval(() => {
      this.updatePeakHours()
      this.updateTrainPriorities()
      this.simulateTrainMovement()
      this.updateTrackOccupancy()
      this.detectConflicts()
      this.generateSystemRecommendations()

      this.state.lastUpdate = new Date()

      this.callbacks.forEach((callback) => callback({ ...this.state }))
    }, 6000)
  }

  public subscribe(callback: (state: SystemState) => void) {
    this.callbacks.push(callback)
    callback({ ...this.state })
  }

  public unsubscribe(callback: (state: SystemState) => void) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback)
  }

  public resolveConflict(conflictId: string) {
    this.state.conflicts = this.state.conflicts.map((conflict) =>
      conflict.id === conflictId ? { ...conflict, status: "resolving" as const } : conflict,
    )

    const conflict = this.state.conflicts.find((c) => c.id === conflictId)
    if (conflict) {
      const resolutionMessage: TrainMessage = {
        id: `RESOLUTION_${Date.now()}`,
        trainId: "SYSTEM",
        trainNumber: "SYSTEM",
        trainType: "system",
        message: `CONFLICT RESOLVED: ${conflict.location} - ${conflict.aiRecommendation}`,
        timestamp: new Date(),
        priority: "medium",
        station: conflict.location,
      }
      this.state.messages.unshift(resolutionMessage)
    }

    setTimeout(() => {
      this.state.conflicts = this.state.conflicts.map((conflict) =>
        conflict.id === conflictId ? { ...conflict, status: "resolved" as const } : conflict,
      )
      this.callbacks.forEach((callback) => callback({ ...this.state }))
    }, 3000)
  }

  public getCurrentState(): SystemState {
    return { ...this.state }
  }

  public getActiveTrains(): Train[] {
    return this.state.trains.filter((train) => train.id && train.number) // Only filter out invalid trains
  }

  public getTrainsByStation(stationCode: string): Train[] {
    return this.state.trains.filter(
      (train) => train.currentStation === stationCode || train.nextStation === stationCode,
    )
  }

  public getPlatformStatus(stationCode: string): any {
    const platformData = this.state.platformStatus.find(
      (station) =>
        station.stationCode === stationCode ||
        station.stationName.toLowerCase().includes(stationCode.toLowerCase()) ||
        this.getStationCode(station.stationName) === stationCode,
    )

    if (!platformData) {
      return {
        stationCode,
        stationName: this.getStationName(stationCode),
        upLineTracks: "1",
        downLineTracks: "1",
        loopLines: "1",
        platforms: [
          { number: 1, status: "available", currentTrain: null },
          { number: 2, status: "available", currentTrain: null },
        ],
      }
    }

    const trainsAtStation = this.state.trains.filter((train) => {
      return (
        train.currentStation === stationCode ||
        train.currentStation === platformData.stationName ||
        this.getStationCode(train.currentStation) === stationCode ||
        train.nextStation === stationCode
      )
    })

    const enhancedPlatforms = platformData.platforms.map((platform, index) => {
      const trainOnPlatform = trainsAtStation[index] || null
      return {
        number: platform.number,
        status: trainOnPlatform ? "occupied" : "available",
        currentTrain: trainOnPlatform ? trainOnPlatform.number : null,
        trainType: trainOnPlatform ? trainOnPlatform.type : null,
        delay: trainOnPlatform ? trainOnPlatform.delay : 0,
      }
    })

    return {
      stationCode: platformData.stationCode,
      stationName: platformData.stationName,
      upLineTracks: platformData.upLineTracks,
      downLineTracks: platformData.downLineTracks,
      loopLines: platformData.loopLines,
      platforms: enhancedPlatforms,
      totalTrains: trainsAtStation.length,
      occupancyRate: Math.round(
        (enhancedPlatforms.filter((p) => p.status === "occupied").length / enhancedPlatforms.length) * 100,
      ),
    }
  }

  private getStationName(stationCode: string): string {
    const codeToNameMap: { [key: string]: string } = {
      MAS: "Chennai Central",
      BBQ: "Basin Bridge",
      KOUK: "Korukkupet",
      TNP: "Tondiarpet",
      VOC: "V.O.C. Nagar",
      TVT: "Tiruvottiyur",
      WCN: "Wimco Nagar",
      KTVM: "Kathivakkam",
      ENR: "Ennore",
      APH: "Attipattu Pudu Nagar H",
      ATP: "Attipattu",
      NDKM: "Nandiyampakkam",
      MJR: "Minjur",
      ABEO: "Anuppambattu",
      PER: "Ponneri",
      KPTI: "Kavaraippettai",
      GPD: "Gummidipoondi",
    }

    return codeToNameMap[stationCode] || stationCode
  }

  public simulateTrainPriorityChange(
    trainId: string,
    newPriority: number,
  ): {
    success: boolean
    impact: string
    affectedTrains: string[]
  } {
    const train = this.state.trains.find((t) => t.id === trainId)
    if (!train) {
      return { success: false, impact: "Train not found", affectedTrains: [] }
    }

    const oldPriority = train.priority
    const affectedTrains: string[] = []

    // Find trains that might be affected by this priority change
    const sameStationTrains = this.state.trains.filter(
      (t) => t.currentStation === train.currentStation && t.id !== trainId,
    )

    affectedTrains.push(...sameStationTrains.map((t) => t.number))

    let impact = ""
    if (newPriority < oldPriority) {
      impact = `Increasing priority will reduce delays by 2-4 minutes for ${train.number}`
    } else if (newPriority > oldPriority) {
      impact = `Decreasing priority may increase delays by 1-3 minutes for ${train.number}`
    } else {
      impact = "No significant impact expected"
    }

    return { success: true, impact, affectedTrains }
  }

  public simulateDelayImpact(
    trainId: string,
    delayMinutes: number,
  ): {
    success: boolean
    cascadingEffects: string[]
    platformImpact: string
    recommendations: string[]
  } {
    const train = this.state.trains.find((t) => t.id === trainId)
    if (!train) {
      return {
        success: false,
        cascadingEffects: [],
        platformImpact: "Train not found",
        recommendations: [],
      }
    }

    const cascadingEffects: string[] = []
    const recommendations: string[] = []

    // Calculate cascading effects
    const followingTrains = this.state.trains.filter(
      (t) =>
        t.route.includes(train.currentStation) &&
        t.id !== trainId &&
        t.route.indexOf(train.currentStation) > t.route.indexOf(t.currentStation),
    )

    followingTrains.forEach((followingTrain) => {
      const estimatedDelay = Math.ceil(delayMinutes * 0.3)
      if (estimatedDelay > 0) {
        cascadingEffects.push(`${followingTrain.number} may face ${estimatedDelay}min delay`)
      }
    })

    // Platform impact analysis
    const platformData = this.getPlatformStatus(train.currentStation)
    let platformImpact = "Minimal platform impact"

    if (platformData && delayMinutes > 5) {
      const occupiedPlatforms = platformData.platforms.filter((p) => p.status === "occupied").length
      const totalPlatforms = platformData.platforms.length

      if (occupiedPlatforms / totalPlatforms > 0.7) {
        platformImpact = `High platform congestion expected - ${occupiedPlatforms}/${totalPlatforms} platforms occupied`
        recommendations.push("Consider using loop line or alternate platform")
      }
    }

    // Generate recommendations
    if (delayMinutes > 10) {
      recommendations.push("Notify passengers about significant delay")
      recommendations.push("Consider alternate routing for following trains")
    }

    if (train.type === "emu" && this.state.isPeakHours) {
      recommendations.push("Peak hour EMU delay - prioritize quick resolution")
    }

    return {
      success: true,
      cascadingEffects,
      platformImpact,
      recommendations,
    }
  }

  public async getWeatherImpact(): Promise<{
    condition: string
    visibility: number
    temperature: number
    impact: string
    recommendations: string[]
  }> {
    try {
      console.log("[v0] Getting weather data from WeatherService...")
      const weatherData: WeatherData = await WeatherService.getCurrentWeather()

      console.log("[v0] Weather data received:", weatherData)

      return {
        condition: weatherData.condition,
        visibility: weatherData.visibility,
        temperature: weatherData.temperature,
        impact: weatherData.impact,
        recommendations: weatherData.recommendations,
      }
    } catch (error) {
      console.error("[v0] Weather API error in IntegratedRailwaySystem:", error)

      const fallbackWeather = {
        condition: "Clear",
        visibility: 10,
        temperature: 32,
        impact: "Weather data unavailable - using manual observations",
        recommendations: ["Manual weather monitoring in effect", "Contact control room for current conditions"],
      }

      return fallbackWeather
    }
  }

  private detectConflicts() {
    const newConflicts: Conflict[] = []

    // Check for same track conflicts
    const occupiedSections = this.state.trackSections.filter((section) => section.blockStatus === "occupied")

    occupiedSections.forEach((section) => {
      const trainsInSection = this.state.trains.filter((train) => section.name.includes(train.currentStation))

      if (trainsInSection.length > 1) {
        const conflictId = `CONFLICT_${Date.now()}_${section.id}`
        newConflicts.push({
          id: conflictId,
          type: "track-occupation",
          severity: "high",
          status: "detected",
          location: section.name,
          trainsInvolved: trainsInSection.map((t) => t.number),
          estimatedDelay: 5 + Math.floor(Math.random() * 10),
          aiRecommendation: this.generateConflictRecommendation(trainsInSection),
          detectedAt: new Date(),
        })
      }
    })

    // Peak hour precedence conflicts
    if (this.state.isPeakHours) {
      const emuTrains = this.state.trains.filter((t) => t.type === "emu")
      const expressTrains = this.state.trains.filter((t) => t.type === "express" || t.type === "superfast")

      if (emuTrains.length > 0 && expressTrains.length > 0) {
        const sameStationPairs = emuTrains.flatMap((emu) =>
          expressTrains
            .filter((express) => express.currentStation === emu.currentStation)
            .map((express) => ({ emu, express })),
        )

        sameStationPairs.forEach(({ emu, express }) => {
          if (Math.random() < 0.4) {
            newConflicts.push({
              id: `PRECEDENCE_${Date.now()}_${emu.id}_${express.id}`,
              type: "precedence",
              severity: "medium",
              status: "detected",
              location: emu.currentStation,
              trainsInvolved: [emu.number, express.number],
              estimatedDelay: 3,
              aiRecommendation: `PEAK HOUR PRIORITY: Allow EMU ${emu.number} to precede Express ${express.number} due to high passenger density and suburban traffic management`,
              detectedAt: new Date(),
            })
          }
        })
      }
    } else {
      // Non-peak hours - express gets priority
      const emuTrains = this.state.trains.filter((t) => t.type === "emu")
      const expressTrains = this.state.trains.filter((t) => t.type === "express" || t.type === "superfast")

      if (emuTrains.length > 0 && expressTrains.length > 0) {
        const sameStationPairs = expressTrains.flatMap((express) =>
          emuTrains.filter((emu) => emu.currentStation === express.currentStation).map((emu) => ({ express, emu })),
        )

        sameStationPairs.forEach(({ express, emu }) => {
          if (Math.random() < 0.25) {
            newConflicts.push({
              id: `PRECEDENCE_${Date.now()}_${express.id}_${emu.id}`,
              type: "precedence",
              severity: "low",
              status: "detected",
              location: express.currentStation,
              trainsInvolved: [express.number, emu.number],
              estimatedDelay: 2,
              aiRecommendation: `NON-PEAK PRIORITY: Allow Express ${express.number} to precede EMU ${emu.number} for optimal long-distance connectivity`,
              detectedAt: new Date(),
            })
          }
        })
      }
    }

    // Update conflicts, keeping existing resolved ones
    const existingResolved = this.state.conflicts.filter((c) => c.status === "resolved")
    this.state.conflicts = [...existingResolved, ...newConflicts]
  }

  private generateConflictRecommendation(trains: Train[]): string {
    if (trains.length === 2) {
      const [train1, train2] = trains
      const currentTime = new Date()

      const priority1 = calculateTrainPriority(train1.type, currentTime)
      const priority2 = calculateTrainPriority(train2.type, currentTime)

      if (priority1 < priority2) {
        return `Priority to ${train1.type.toUpperCase()} ${train1.number} (Priority ${priority1}) over ${train2.type.toUpperCase()} ${train2.number} (Priority ${priority2})`
      } else if (priority2 < priority1) {
        return `Priority to ${train2.type.toUpperCase()} ${train2.number} (Priority ${priority2}) over ${train1.type.toUpperCase()} ${train1.number} (Priority ${priority1})`
      }

      if (this.state.isPeakHours && train1.type === "emu" && train2.type === "express") {
        return `PEAK HOUR PRIORITY: Allow EMU ${train1.number} to precede Express ${train2.number} due to high passenger density and suburban traffic management`
      } else if (this.state.isPeakHours && train2.type === "emu" && train1.type === "express") {
        return `PEAK HOUR PRIORITY: Allow EMU ${train2.number} to precede Express ${train1.number} due to high passenger density and suburban traffic management`
      }
    }
    return "Apply standard precedence rules - Hold slower train at signal, allow faster train to proceed first"
  }

  // Helper method to get station codes for better matching
  private getStationCode(stationName: string): string {
    const stationMap: { [key: string]: string } = {
      "Chennai Central": "MAS",
      "Basin Bridge": "BBQ",
      Korukkupet: "KOUK",
      Tondiarpet: "TNP",
      Vyasarpadi: "VOC",
      Tiruvottiyur: "TVT",
      "Wimco Nagar": "WCN",
      Kathivakkam: "KTVM",
      Ennore: "ENR",
      Athipattu: "APH",
      Minjur: "MJR",
      Ponneri: "PER",
      Kavaraipettai: "KPTI",
      Gummidipundi: "GPD",
    }

    // Return the code if found, otherwise return the input
    return stationMap[stationName] || stationName
  }
}

export const integratedRailwaySystem = new IntegratedRailwaySystem()
