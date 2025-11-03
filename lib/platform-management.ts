export interface Platform {
  id: string
  number: number
  type: "main" | "loop" | "siding"
  length: number // in meters
  status: "occupied" | "clear" | "maintenance"
  currentTrain?: string
  direction: "up" | "down" | "both"
  canAccommodate: ("emu" | "express" | "superfast" | "freight")[]
  lastOccupied?: Date
  estimatedClearTime?: Date
}

export interface StationPlatformData {
  stationCode: string
  stationName: string
  platforms: Platform[]
  mainLines: {
    up: Platform[]
    down: Platform[]
  }
  loopLines: Platform[]
  totalCapacity: number
  currentOccupancy: number
  throughputCapacity: number // trains per hour
}

export const stationPlatformData: StationPlatformData[] = [
  {
    stationCode: "MAS",
    stationName: "Chennai Central (Basin Bridge Jn)",
    platforms: [
      // Up lines (5-6 tracks)
      {
        id: "MAS_UP1",
        number: 1,
        type: "main",
        length: 700,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express", "superfast"],
      },
      {
        id: "MAS_UP2",
        number: 2,
        type: "main",
        length: 700,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express", "superfast"],
      },
      {
        id: "MAS_UP3",
        number: 3,
        type: "main",
        length: 650,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "MAS_UP4",
        number: 4,
        type: "main",
        length: 650,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "MAS_UP5",
        number: 5,
        type: "main",
        length: 600,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      {
        id: "MAS_UP6",
        number: 6,
        type: "main",
        length: 600,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down lines (5-6 tracks)
      {
        id: "MAS_DN1",
        number: 7,
        type: "main",
        length: 700,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express", "superfast"],
      },
      {
        id: "MAS_DN2",
        number: 8,
        type: "main",
        length: 700,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express", "superfast"],
      },
      {
        id: "MAS_DN3",
        number: 9,
        type: "main",
        length: 650,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "MAS_DN4",
        number: 10,
        type: "main",
        length: 650,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "MAS_DN5",
        number: 11,
        type: "main",
        length: 600,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      {
        id: "MAS_DN6",
        number: 12,
        type: "main",
        length: 600,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop lines (5-6 tracks)
      {
        id: "MAS_LP1",
        number: 13,
        type: "loop",
        length: 600,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "MAS_LP2",
        number: 14,
        type: "loop",
        length: 600,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "MAS_LP3",
        number: 15,
        type: "loop",
        length: 550,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "MAS_LP4",
        number: 16,
        type: "loop",
        length: 550,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "MAS_LP5",
        number: 17,
        type: "loop",
        length: 500,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "MAS_LP6",
        number: 18,
        type: "loop",
        length: 500,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "MAS_UP1",
          number: 1,
          type: "main",
          length: 700,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express", "superfast"],
        },
        {
          id: "MAS_UP2",
          number: 2,
          type: "main",
          length: 700,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express", "superfast"],
        },
        {
          id: "MAS_UP3",
          number: 3,
          type: "main",
          length: 650,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "MAS_UP4",
          number: 4,
          type: "main",
          length: 650,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "MAS_UP5",
          number: 5,
          type: "main",
          length: 600,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
        {
          id: "MAS_UP6",
          number: 6,
          type: "main",
          length: 600,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "MAS_DN1",
          number: 7,
          type: "main",
          length: 700,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express", "superfast"],
        },
        {
          id: "MAS_DN2",
          number: 8,
          type: "main",
          length: 700,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express", "superfast"],
        },
        {
          id: "MAS_DN3",
          number: 9,
          type: "main",
          length: 650,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "MAS_DN4",
          number: 10,
          type: "main",
          length: 650,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "MAS_DN5",
          number: 11,
          type: "main",
          length: 600,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
        {
          id: "MAS_DN6",
          number: 12,
          type: "main",
          length: 600,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "MAS_LP1",
        number: 13,
        type: "loop",
        length: 600,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "MAS_LP2",
        number: 14,
        type: "loop",
        length: 600,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "MAS_LP3",
        number: 15,
        type: "loop",
        length: 550,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "MAS_LP4",
        number: 16,
        type: "loop",
        length: 550,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "MAS_LP5",
        number: 17,
        type: "loop",
        length: 500,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "MAS_LP6",
        number: 18,
        type: "loop",
        length: 500,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 18,
    currentOccupancy: 0,
    throughputCapacity: 60, // Enhanced capacity for major terminal
  },
  {
    stationCode: "KOUK",
    stationName: "Korukkupet",
    platforms: [
      // Up lines (1-2 tracks)
      {
        id: "KOUK_UP1",
        number: 1,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "KOUK_UP2",
        number: 2,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down lines (1-2 tracks)
      {
        id: "KOUK_DN1",
        number: 3,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "KOUK_DN2",
        number: 4,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop lines (1-2 tracks)
      {
        id: "KOUK_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "KOUK_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "KOUK_UP1",
          number: 1,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "KOUK_UP2",
          number: 2,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "KOUK_DN1",
          number: 3,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "KOUK_DN2",
          number: 4,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "KOUK_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "KOUK_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 6,
    currentOccupancy: 0,
    throughputCapacity: 24,
  },
  {
    stationCode: "TNP",
    stationName: "Tondiarpet",
    platforms: [
      // Up lines (1-2 tracks)
      {
        id: "TNP_UP1",
        number: 1,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "TNP_UP2",
        number: 2,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down lines (1-2 tracks)
      {
        id: "TNP_DN1",
        number: 3,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "TNP_DN2",
        number: 4,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop lines (1-2 tracks)
      {
        id: "TNP_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "TNP_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "TNP_UP1",
          number: 1,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "TNP_UP2",
          number: 2,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "TNP_DN1",
          number: 3,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "TNP_DN2",
          number: 4,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "TNP_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "TNP_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 6,
    currentOccupancy: 0,
    throughputCapacity: 24,
  },
  {
    stationCode: "VOC",
    stationName: "V.O.C. Nagar",
    platforms: [
      // Up lines (1-2 tracks)
      {
        id: "VOC_UP1",
        number: 1,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "VOC_UP2",
        number: 2,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down lines (1-2 tracks)
      {
        id: "VOC_DN1",
        number: 3,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "VOC_DN2",
        number: 4,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop lines (1-2 tracks)
      {
        id: "VOC_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "VOC_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "VOC_UP1",
          number: 1,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "VOC_UP2",
          number: 2,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "VOC_DN1",
          number: 3,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "VOC_DN2",
          number: 4,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "VOC_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "VOC_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 6,
    currentOccupancy: 0,
    throughputCapacity: 24,
  },
  {
    stationCode: "TI",
    stationName: "Tiruvottiyur",
    platforms: [
      // Up lines (1-2 tracks)
      {
        id: "TI_UP1",
        number: 1,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express"],
      },
      { id: "TI_UP2", number: 2, type: "main", length: 400, status: "clear", direction: "up", canAccommodate: ["emu"] },
      // Down lines (1-2 tracks)
      {
        id: "TI_DN1",
        number: 3,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "TI_DN2",
        number: 4,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop lines (1-2 tracks)
      {
        id: "TI_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "TI_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "TI_UP1",
          number: 1,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "TI_UP2",
          number: 2,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "TI_DN1",
          number: 3,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "TI_DN2",
          number: 4,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "TI_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "TI_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 6,
    currentOccupancy: 0,
    throughputCapacity: 24,
  },
  {
    stationCode: "WN",
    stationName: "Wimco Nagar",
    platforms: [
      // Up lines (1-2 tracks)
      {
        id: "WN_UP1",
        number: 1,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express"],
      },
      { id: "WN_UP2", number: 2, type: "main", length: 400, status: "clear", direction: "up", canAccommodate: ["emu"] },
      // Down lines (1-2 tracks)
      {
        id: "WN_DN1",
        number: 3,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "WN_DN2",
        number: 4,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop lines (1-2 tracks)
      {
        id: "WN_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "WN_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "WN_UP1",
          number: 1,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "WN_UP2",
          number: 2,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "WN_DN1",
          number: 3,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "WN_DN2",
          number: 4,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "WN_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "WN_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 6,
    currentOccupancy: 0,
    throughputCapacity: 24,
  },
  {
    stationCode: "KAVM",
    stationName: "Kathivakkam",
    platforms: [
      // Up line (1 track)
      {
        id: "KAVM_UP1",
        number: 1,
        type: "main",
        length: 350,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down line (1 track)
      {
        id: "KAVM_DN1",
        number: 2,
        type: "main",
        length: 350,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop line (1 track)
      {
        id: "KAVM_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "KAVM_UP1",
          number: 1,
          type: "main",
          length: 350,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "KAVM_DN1",
          number: 2,
          type: "main",
          length: 350,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "KAVM_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 3,
    currentOccupancy: 0,
    throughputCapacity: 12,
  },
  {
    stationCode: "ENR",
    stationName: "Ennore",
    platforms: [
      // Up line (1 track)
      {
        id: "ENR_UP1",
        number: 1,
        type: "main",
        length: 350,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down line (1 track)
      {
        id: "ENR_DN1",
        number: 2,
        type: "main",
        length: 350,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop line (1 track)
      {
        id: "ENR_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "ENR_UP1",
          number: 1,
          type: "main",
          length: 350,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "ENR_DN1",
          number: 2,
          type: "main",
          length: 350,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "ENR_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 3,
    currentOccupancy: 0,
    throughputCapacity: 12,
  },
  {
    stationCode: "APDH",
    stationName: "Attipattu Pudu Nagar H",
    platforms: [
      // Up line (1 track)
      {
        id: "APDH_UP1",
        number: 1,
        type: "main",
        length: 350,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down line (1 track)
      {
        id: "APDH_DN1",
        number: 2,
        type: "main",
        length: 350,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop line (1 track)
      {
        id: "APDH_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "APDH_UP1",
          number: 1,
          type: "main",
          length: 350,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "APDH_DN1",
          number: 2,
          type: "main",
          length: 350,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "APDH_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 3,
    currentOccupancy: 0,
    throughputCapacity: 12,
  },
  {
    stationCode: "APD",
    stationName: "Attipattu",
    platforms: [
      // Up line (1 track)
      {
        id: "APD_UP1",
        number: 1,
        type: "main",
        length: 350,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down line (1 track)
      {
        id: "APD_DN1",
        number: 2,
        type: "main",
        length: 350,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop line (1 track)
      {
        id: "APD_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "APD_UP1",
          number: 1,
          type: "main",
          length: 350,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "APD_DN1",
          number: 2,
          type: "main",
          length: 350,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "APD_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 3,
    currentOccupancy: 0,
    throughputCapacity: 12,
  },
  {
    stationCode: "NAMP",
    stationName: "Nandiyampakkam",
    platforms: [
      // Up line (1 track)
      {
        id: "NAMP_UP1",
        number: 1,
        type: "main",
        length: 350,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down line (1 track)
      {
        id: "NAMP_DN1",
        number: 2,
        type: "main",
        length: 350,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop line (1 track)
      {
        id: "NAMP_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "NAMP_UP1",
          number: 1,
          type: "main",
          length: 350,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "NAMP_DN1",
          number: 2,
          type: "main",
          length: 350,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "NAMP_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 3,
    currentOccupancy: 0,
    throughputCapacity: 12,
  },
  {
    stationCode: "MJR",
    stationName: "Minjur",
    platforms: [
      // Up line (1 track)
      {
        id: "MJR_UP1",
        number: 1,
        type: "main",
        length: 350,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down line (1 track)
      {
        id: "MJR_DN1",
        number: 2,
        type: "main",
        length: 350,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop line (1 track)
      {
        id: "MJR_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "MJR_UP1",
          number: 1,
          type: "main",
          length: 350,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "MJR_DN1",
          number: 2,
          type: "main",
          length: 350,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "MJR_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 3,
    currentOccupancy: 0,
    throughputCapacity: 12,
  },
  {
    stationCode: "ANPM",
    stationName: "Anuppambattu",
    platforms: [
      // Up line (1 track)
      {
        id: "ANPM_UP1",
        number: 1,
        type: "main",
        length: 350,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down line (1 track)
      {
        id: "ANPM_DN1",
        number: 2,
        type: "main",
        length: 350,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop line (1 track)
      {
        id: "ANPM_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "ANPM_UP1",
          number: 1,
          type: "main",
          length: 350,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "ANPM_DN1",
          number: 2,
          type: "main",
          length: 350,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "ANPM_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 3,
    currentOccupancy: 0,
    throughputCapacity: 12,
  },
  {
    stationCode: "PNR",
    stationName: "Ponneri",
    platforms: [
      // Up lines (1-2 tracks)
      {
        id: "PNR_UP1",
        number: 1,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "PNR_UP2",
        number: 2,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down lines (1-2 tracks)
      {
        id: "PNR_DN1",
        number: 3,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express"],
      },
      {
        id: "PNR_DN2",
        number: 4,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop lines (1-2 tracks)
      {
        id: "PNR_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "PNR_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "PNR_UP1",
          number: 1,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "PNR_UP2",
          number: 2,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "PNR_DN1",
          number: 3,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express"],
        },
        {
          id: "PNR_DN2",
          number: 4,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "PNR_LP1",
        number: 5,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "PNR_LP2",
        number: 6,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 6,
    currentOccupancy: 0,
    throughputCapacity: 24,
  },
  {
    stationCode: "KVPT",
    stationName: "Kavaraippettai",
    platforms: [
      // Up line (1 track)
      {
        id: "KVPT_UP1",
        number: 1,
        type: "main",
        length: 350,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu"],
      },
      // Down line (1 track)
      {
        id: "KVPT_DN1",
        number: 2,
        type: "main",
        length: 350,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu"],
      },
      // Loop line (1 track)
      {
        id: "KVPT_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "KVPT_UP1",
          number: 1,
          type: "main",
          length: 350,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu"],
        },
      ],
      down: [
        {
          id: "KVPT_DN1",
          number: 2,
          type: "main",
          length: 350,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu"],
        },
      ],
    },
    loopLines: [
      {
        id: "KVPT_LP1",
        number: 3,
        type: "loop",
        length: 300,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 3,
    currentOccupancy: 0,
    throughputCapacity: 12,
  },
  {
    stationCode: "GPD",
    stationName: "Gummidipoondi",
    platforms: [
      // Up line (1 track)
      {
        id: "GPD_UP1",
        number: 1,
        type: "main",
        length: 400,
        status: "clear",
        direction: "up",
        canAccommodate: ["emu", "express"],
      },
      // Down line (1 track)
      {
        id: "GPD_DN1",
        number: 2,
        type: "main",
        length: 400,
        status: "clear",
        direction: "down",
        canAccommodate: ["emu", "express"],
      },
      // Loop lines (1-2 tracks)
      {
        id: "GPD_LP1",
        number: 3,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "GPD_LP2",
        number: 4,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    mainLines: {
      up: [
        {
          id: "GPD_UP1",
          number: 1,
          type: "main",
          length: 400,
          status: "clear",
          direction: "up",
          canAccommodate: ["emu", "express"],
        },
      ],
      down: [
        {
          id: "GPD_DN1",
          number: 2,
          type: "main",
          length: 400,
          status: "clear",
          direction: "down",
          canAccommodate: ["emu", "express"],
        },
      ],
    },
    loopLines: [
      {
        id: "GPD_LP1",
        number: 3,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
      {
        id: "GPD_LP2",
        number: 4,
        type: "loop",
        length: 350,
        status: "clear",
        direction: "both",
        canAccommodate: ["emu"],
      },
    ],
    totalCapacity: 4,
    currentOccupancy: 0,
    throughputCapacity: 18,
  },
]

export class PlatformManager {
  private platformData: Map<string, StationPlatformData> = new Map()

  constructor() {
    stationPlatformData.forEach((station) => {
      this.platformData.set(station.stationCode, station)
    })
  }

  findBestPlatform(
    stationCode: string,
    trainType: string,
    direction: "up" | "down",
    priority: number,
  ): Platform | null {
    const station = this.platformData.get(stationCode)
    if (!station) return null

    // First try main lines for the direction
    const mainLinePlatforms = direction === "up" ? station.mainLines.up : station.mainLines.down
    const availableMainPlatforms = mainLinePlatforms.filter(
      (p) => p.status === "clear" && p.canAccommodate.includes(trainType as any),
    )

    if (availableMainPlatforms.length > 0) {
      return availableMainPlatforms[0]
    }

    // If no main line available, try loop lines for high priority trains
    if (priority <= 3) {
      const availableLoopPlatforms = station.loopLines.filter(
        (p) => p.status === "clear" && p.canAccommodate.includes(trainType as any),
      )
      if (availableLoopPlatforms.length > 0) {
        return availableLoopPlatforms[0]
      }
    }

    return null
  }

  occupyPlatform(stationCode: string, platformId: string, trainNumber: string): boolean {
    const station = this.platformData.get(stationCode)
    if (!station) return false

    const platform = station.platforms.find((p) => p.id === platformId)
    if (!platform || platform.status !== "clear") return false

    platform.status = "occupied"
    platform.currentTrain = trainNumber
    platform.lastOccupied = new Date()
    platform.estimatedClearTime = new Date(Date.now() + (2 + Math.random() * 3) * 60000) // 2-5 minutes

    station.currentOccupancy++
    this.platformData.set(stationCode, station)
    return true
  }

  clearPlatform(stationCode: string, platformId: string): boolean {
    const station = this.platformData.get(stationCode)
    if (!station) return false

    const platform = station.platforms.find((p) => p.id === platformId)
    if (!platform || platform.status !== "occupied") return false

    platform.status = "clear"
    platform.currentTrain = undefined
    platform.estimatedClearTime = undefined

    station.currentOccupancy = Math.max(0, station.currentOccupancy - 1)
    this.platformData.set(stationCode, station)
    return true
  }

  calculateThroughput(stationCode: string): number {
    const station = this.platformData.get(stationCode)
    if (!station) return 0

    const baseCapacity = station.throughputCapacity
    const occupancyRate = station.currentOccupancy / station.totalCapacity
    const efficiencyFactor = Math.max(0.5, 1 - occupancyRate * 0.3)

    // Apply 25% throughput bonus as requested
    const enhancedThroughput = baseCapacity * efficiencyFactor * 1.25

    return Math.round(enhancedThroughput)
  }

  getStationStatus(stationCode: string): StationPlatformData | null {
    return this.platformData.get(stationCode) || null
  }

  getAllStationsStatus(): StationPlatformData[] {
    return Array.from(this.platformData.values())
  }

  updatePlatformStatus() {
    const now = new Date()

    this.platformData.forEach((station, stationCode) => {
      station.platforms.forEach((platform) => {
        if (platform.status === "occupied" && platform.estimatedClearTime && now > platform.estimatedClearTime) {
          // Auto-clear platforms that should be free by now
          this.clearPlatform(stationCode, platform.id)
        }
      })
    })
  }
}

export const platformManager = new PlatformManager()
