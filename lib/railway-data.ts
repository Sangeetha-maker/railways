export interface Station {
  id: string
  name: string
  code: string
  coordinates: { lat: number; lng: number }
  type: "junction" | "terminal" | "halt" | "crossing"
  platforms: number
  electrified: boolean
}

export interface Train {
  id: string
  number: string
  name: string
  type: "passenger" | "express" | "superfast" | "freight" | "emu" | "dmu"
  currentStation: string
  nextStation: string
  status: "on-time" | "delayed" | "cancelled" | "diverted" | "terminated"
  delay: number // in minutes
  speed: number // current speed in kmph
  direction: "up" | "down"
  priority: 1 | 2 | 3 | 4 | 5 // 1 = highest priority
  passengers: number
  capacity: number
  lastUpdated: Date
  estimatedArrival: Date
  estimatedDeparture: Date
  route: string[]
}

export interface TrackSection {
  id: string
  name: string
  from: string
  to: string
  length: number // in km
  maxSpeed: number
  currentOccupancy: string | null // train ID if occupied
  signalStatus: "green" | "yellow" | "red"
  blockStatus: "clear" | "occupied" | "failed"
  electrified: boolean
  doubleTrack: boolean
  lastUpdated?: Date
}

export interface Conflict {
  id: string
  type: "crossing" | "overtaking" | "platform" | "signal" | "maintenance" | "track-occupation" | "precedence"
  severity: "low" | "medium" | "high" | "critical"
  trainsInvolved: string[]
  location: string
  estimatedDelay: number
  aiRecommendation: string
  status: "detected" | "resolving" | "resolved"
  timestamp?: Date
  detectedAt?: Date
}

export interface PerformanceMetrics {
  punctuality: number // percentage
  throughput: number // trains per hour
  averageDelay: number // minutes
  conflictsResolved: number
  energyEfficiency: number // percentage
  safetyScore: number // out of 100
}

// Mock data for GPD-GDR section
export const stations: Station[] = [
  {
    id: "MAS",
    name: "Chennai Central",
    code: "MAS",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    type: "terminal",
    platforms: 12,
    electrified: true,
  },
  {
    id: "BBQ",
    name: "Basin Bridge Jn",
    code: "BBQ",
    coordinates: { lat: 13.1017, lng: 80.2619 },
    type: "junction",
    platforms: 4,
    electrified: true,
  },
  {
    id: "KOTR",
    name: "Korukkupet Jn",
    code: "KOTR",
    coordinates: { lat: 13.1167, lng: 80.2583 },
    type: "junction",
    platforms: 3,
    electrified: true,
  },
  {
    id: "TNP",
    name: "Tondiarpet",
    code: "TNP",
    coordinates: { lat: 13.1333, lng: 80.25 },
    type: "halt",
    platforms: 2,
    electrified: true,
  },
  {
    id: "VOC",
    name: "V.O.C. Nagar",
    code: "VOC",
    coordinates: { lat: 13.15, lng: 80.2417 },
    type: "halt",
    platforms: 2,
    electrified: true,
  },
  {
    id: "TI",
    name: "Tiruvottiyur",
    code: "TI",
    coordinates: { lat: 13.1667, lng: 80.3 },
    type: "junction",
    platforms: 3,
    electrified: true,
  },
  {
    id: "WCN",
    name: "Wimco Nagar",
    code: "WCN",
    coordinates: { lat: 13.1833, lng: 80.3167 },
    type: "halt",
    platforms: 2,
    electrified: true,
  },
  {
    id: "KTVM",
    name: "Kathivakkam",
    code: "KTVM",
    coordinates: { lat: 13.2, lng: 80.3333 },
    type: "halt",
    platforms: 2,
    electrified: true,
  },
  {
    id: "ENR",
    name: "Ennore",
    code: "ENR",
    coordinates: { lat: 13.2167, lng: 80.35 },
    type: "junction",
    platforms: 3,
    electrified: true,
  },
  {
    id: "AIPP",
    name: "Attipattu Pudu Nagar",
    code: "AIPP",
    coordinates: { lat: 13.2333, lng: 80.3667 },
    type: "halt",
    platforms: 2,
    electrified: true,
  },
  {
    id: "AIP",
    name: "Attipattu",
    code: "AIP",
    coordinates: { lat: 13.25, lng: 80.3833 },
    type: "halt",
    platforms: 2,
    electrified: true,
  },
  {
    id: "NDBM",
    name: "Nandiambakkam",
    code: "NDBM",
    coordinates: { lat: 13.2667, lng: 80.4 },
    type: "halt",
    platforms: 2,
    electrified: true,
  },
  {
    id: "MJR",
    name: "Minjur",
    code: "MJR",
    coordinates: { lat: 13.2833, lng: 80.4167 },
    type: "junction",
    platforms: 3,
    electrified: true,
  },
  {
    id: "ANPM",
    name: "Anuppambattu",
    code: "ANPM",
    coordinates: { lat: 13.3, lng: 80.4333 },
    type: "halt",
    platforms: 2,
    electrified: true,
  },
  {
    id: "PNE",
    name: "Ponneri",
    code: "PNE",
    coordinates: { lat: 13.3333, lng: 80.1833 },
    type: "junction",
    platforms: 3,
    electrified: true,
  },
  {
    id: "KPTI",
    name: "Kavaraippettai",
    code: "KPTI",
    coordinates: { lat: 13.3667, lng: 80.15 },
    type: "junction",
    platforms: 4,
    electrified: true,
  },
  {
    id: "GPD",
    name: "Gummidipundi",
    code: "GPD",
    coordinates: { lat: 13.4067, lng: 80.11 },
    type: "junction",
    platforms: 4,
    electrified: true,
  },
]

export const mockTrains: Train[] = [
  {
    id: "T001",
    number: "43851",
    name: "Chennai Central-GPD EMU",
    type: "emu",
    currentStation: "MAS",
    nextStation: "BBQ",
    status: "on-time",
    delay: 0,
    speed: 0,
    direction: "up",
    priority: 3,
    passengers: 850,
    capacity: 1200,
    lastUpdated: new Date(),
    estimatedArrival: new Date(Date.now() + 2 * 60000),
    estimatedDeparture: new Date(Date.now() + 3 * 60000),
    route: [
      "MAS",
      "BBQ",
      "KOTR",
      "TNP",
      "VOC",
      "TI",
      "WCN",
      "KTVM",
      "ENR",
      "AIPP",
      "AIP",
      "NDBM",
      "MJR",
      "ANPM",
      "PNE",
      "KPTI",
      "GPD",
    ],
  },
  {
    id: "T002",
    number: "12603",
    name: "Chennai Mail",
    type: "express",
    currentStation: "KPTI",
    nextStation: "GPD",
    status: "on-time",
    delay: 0,
    speed: 85,
    direction: "up",
    priority: 2,
    passengers: 1200,
    capacity: 1400,
    lastUpdated: new Date(),
    estimatedArrival: new Date(Date.now() + 15 * 60000),
    estimatedDeparture: new Date(Date.now() + 17 * 60000),
    route: ["MAS", "PNE", "KPTI", "GPD"],
  },
  {
    id: "T003",
    number: "43852",
    name: "GPD-Chennai Central EMU",
    type: "emu",
    currentStation: "ENR",
    nextStation: "KTVM",
    status: "delayed",
    delay: 5,
    speed: 45,
    direction: "down",
    priority: 4,
    passengers: 950,
    capacity: 1200,
    lastUpdated: new Date(),
    estimatedArrival: new Date(Date.now() + 8 * 60000),
    estimatedDeparture: new Date(Date.now() + 9 * 60000),
    route: [
      "GPD",
      "KPTI",
      "PNE",
      "ANPM",
      "MJR",
      "NDBM",
      "AIP",
      "AIPP",
      "ENR",
      "KTVM",
      "WCN",
      "TI",
      "VOC",
      "TNP",
      "KOTR",
      "BBQ",
      "MAS",
    ],
  },
  {
    id: "T004",
    number: "16053",
    name: "Tirupati Express",
    type: "express",
    currentStation: "PNE",
    nextStation: "ANPM",
    status: "on-time",
    delay: 0,
    speed: 95,
    direction: "down",
    priority: 2,
    passengers: 980,
    capacity: 1200,
    lastUpdated: new Date(),
    estimatedArrival: new Date(Date.now() + 12 * 60000),
    estimatedDeparture: new Date(Date.now() + 14 * 60000),
    route: [
      "GPD",
      "KPTI",
      "PNE",
      "ANPM",
      "MJR",
      "NDBM",
      "AIP",
      "AIPP",
      "ENR",
      "KTVM",
      "WCN",
      "TI",
      "VOC",
      "TNP",
      "KOTR",
      "BBQ",
      "MAS",
    ],
  },
  {
    id: "T005",
    number: "FREIGHT-001",
    name: "Container Special",
    type: "freight",
    currentStation: "MJR",
    nextStation: "ANPM",
    status: "on-time",
    delay: 0,
    speed: 35,
    direction: "up",
    priority: 5,
    passengers: 0,
    capacity: 0,
    lastUpdated: new Date(),
    estimatedArrival: new Date(Date.now() + 25 * 60000),
    estimatedDeparture: new Date(Date.now() + 27 * 60000),
    route: ["MAS", "BBQ", "KOTR", "PNE", "KPTI", "GPD"],
  },
]

export const trackSections: TrackSection[] = [
  {
    id: "MAS-BBQ",
    name: "Chennai Central - Basin Bridge",
    from: "MAS",
    to: "BBQ",
    length: 1.5,
    maxSpeed: 80,
    currentOccupancy: "T001",
    signalStatus: "green",
    blockStatus: "occupied",
    electrified: true,
    doubleTrack: true,
    lastUpdated: new Date(),
  },
  {
    id: "BBQ-KOTR",
    name: "Basin Bridge - Korukkupet",
    from: "BBQ",
    to: "KOTR",
    length: 2.3,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "KOTR-TNP",
    name: "Korukkupet - Tondiarpet",
    from: "KOTR",
    to: "TNP",
    length: 1.7,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "TNP-VOC",
    name: "Tondiarpet - V.O.C. Nagar",
    from: "TNP",
    to: "VOC",
    length: 2.0,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "VOC-TI",
    name: "V.O.C. Nagar - Tiruvottiyur",
    from: "VOC",
    to: "TI",
    length: 1.3,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "TI-WCN",
    name: "Tiruvottiyur - Wimco Nagar",
    from: "TI",
    to: "WCN",
    length: 1.7,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "WCN-KTVM",
    name: "Wimco Nagar - Kathivakkam",
    from: "WCN",
    to: "KTVM",
    length: 1.3,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "KTVM-ENR",
    name: "Kathivakkam - Ennore",
    from: "KTVM",
    to: "ENR",
    length: 1.7,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "ENR-AIPP",
    name: "Ennore - Attipattu Pudu Nagar",
    from: "ENR",
    to: "AIPP",
    length: 1.3,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "AIPP-AIP",
    name: "Attipattu Pudu Nagar - Attipattu",
    from: "AIPP",
    to: "AIP",
    length: 1.7,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "AIP-NDBM",
    name: "Attipattu - Nandiambakkam",
    from: "AIP",
    to: "NDBM",
    length: 1.3,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "NDBM-MJR",
    name: "Nandiambakkam - Minjur",
    from: "NDBM",
    to: "MJR",
    length: 1.7,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "MJR-ANPM",
    name: "Minjur - Anuppambattu",
    from: "MJR",
    to: "ANPM",
    length: 1.3,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "ANPM-PNE",
    name: "Anuppambattu - Ponneri",
    from: "ANPM",
    to: "PNE",
    length: 1.7,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "PNE-KPTI",
    name: "Ponneri - Kavaraippettai",
    from: "PNE",
    to: "KPTI",
    length: 1.3,
    maxSpeed: 80,
    currentOccupancy: "T002",
    signalStatus: "green",
    blockStatus: "occupied",
    electrified: true,
    doubleTrack: true,
  },
  {
    id: "KPTI-GPD",
    name: "Kavaraippettai - Gummidipundi",
    from: "KPTI",
    to: "GPD",
    length: 2.7,
    maxSpeed: 80,
    currentOccupancy: null,
    signalStatus: "green",
    blockStatus: "clear",
    electrified: true,
    doubleTrack: true,
  },
]

export const mockConflicts: Conflict[] = [
  {
    id: "C001",
    type: "crossing",
    severity: "medium",
    trainsInvolved: ["T002", "T003"],
    location: "AJJ",
    estimatedDelay: 8,
    aiRecommendation: "Hold T003 at TRL for 5 minutes to allow T002 priority crossing",
    status: "detected",
    timestamp: new Date(),
    detectedAt: new Date(),
  },
  {
    id: "C002",
    type: "platform",
    severity: "low",
    trainsInvolved: ["T001"],
    location: "GPD",
    estimatedDelay: 3,
    aiRecommendation: "Use platform 3 instead of platform 1 for departure",
    status: "resolving",
    timestamp: new Date(Date.now() - 10 * 60000),
    detectedAt: new Date(Date.now() - 10 * 60000),
  },
]

export const performanceMetrics: PerformanceMetrics = {
  punctuality: 87.5,
  throughput: 24,
  averageDelay: 4.2,
  conflictsResolved: 15,
  energyEfficiency: 92.3,
  safetyScore: 98.7,
}

export interface TrainMessage {
  id: string
  trainId: string
  trainNumber: string
  trainType: "emu" | "express" | "freight" | "special" | "system"
  message: string
  timestamp: Date
  priority: "high" | "medium" | "low"
  station: string
  platform?: string
}

export interface WhatIfScenario {
  id: string
  name: string
  description: string
  changes: {
    trainId: string
    newPriority?: number
    newRoute?: string[]
    delayMinutes?: number
  }[]
  estimatedImpact: {
    punctualityChange: number
    throughputChange: number
    conflictsCreated: number
  }
}
