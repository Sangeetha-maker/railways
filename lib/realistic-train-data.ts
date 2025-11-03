export interface RealTrainSchedule {
  trainNumber: string
  trainName: string
  type: "emu" | "express" | "superfast" | "freight" | "special"
  zone: string
  runningDays: string
  stations: {
    stationCode: string
    stationName: string
    arrivalTime: string
    departureTime: string
    platform?: string
    distance: number
    haltTime?: number
  }[]
}

// EMU Local Services based on the timetable image
export const emuLocalSchedules: RealTrainSchedule[] = [
  {
    trainNumber: "43851",
    trainName: "1st LOCAL",
    type: "emu",
    zone: "SR",
    runningDays: "MTWTFSS",
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "", departureTime: "00:15", distance: 0 },
      { stationCode: "BBQ", stationName: "Basin Bridge Jn", arrivalTime: "00:22", departureTime: "00:22", distance: 2 },
      { stationCode: "KOTR", stationName: "Korukkupet Jn", arrivalTime: "00:26", departureTime: "00:26", distance: 4 },
      { stationCode: "TNP", stationName: "Tondiarpet", arrivalTime: "00:28", departureTime: "00:28", distance: 5 },
      { stationCode: "VOC", stationName: "V.O.C. Nagar", arrivalTime: "00:30", departureTime: "00:30", distance: 7 },
      { stationCode: "TI", stationName: "Tiruvottiyur", arrivalTime: "00:35", departureTime: "00:35", distance: 9 },
      { stationCode: "WCN", stationName: "Wimco Nagar", arrivalTime: "00:41", departureTime: "00:41", distance: 12 },
      { stationCode: "KTVM", stationName: "Kathivakkam", arrivalTime: "00:44", departureTime: "00:44", distance: 15 },
      { stationCode: "ENR", stationName: "Ennore", arrivalTime: "00:50", departureTime: "00:50", distance: 16 },
      {
        stationCode: "AIPP",
        stationName: "Attipattu Pudu Nagar",
        arrivalTime: "00:57",
        departureTime: "00:57",
        distance: 20,
      },
      { stationCode: "AIP", stationName: "Attipattu", arrivalTime: "00:59", departureTime: "00:59", distance: 22 },
      { stationCode: "NDBM", stationName: "Nandiambakkam", arrivalTime: "01:01", departureTime: "01:01", distance: 24 },
      { stationCode: "MJR", stationName: "Minjur", arrivalTime: "01:04", departureTime: "01:04", distance: 26 },
      { stationCode: "ANPM", stationName: "Anuppambattu", arrivalTime: "01:08", departureTime: "01:08", distance: 30 },
      { stationCode: "PNE", stationName: "Ponneri", arrivalTime: "01:13", departureTime: "01:13", distance: 35 },
      {
        stationCode: "KPTI",
        stationName: "Kavaraippettai",
        arrivalTime: "01:19",
        departureTime: "01:19",
        distance: 42,
      },
      { stationCode: "GPD", stationName: "Gummidipundi", arrivalTime: "01:35", departureTime: "", distance: 47 },
    ],
  },
  {
    trainNumber: "43853",
    trainName: "2nd LOCAL",
    type: "emu",
    zone: "SR",
    runningDays: "MTWTFSS",
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "", departureTime: "06:15", distance: 0 },
      { stationCode: "BBQ", stationName: "Basin Bridge Jn", arrivalTime: "06:22", departureTime: "06:22", distance: 2 },
      { stationCode: "KOTR", stationName: "Korukkupet Jn", arrivalTime: "06:26", departureTime: "06:26", distance: 4 },
      { stationCode: "TNP", stationName: "Tondiarpet", arrivalTime: "06:28", departureTime: "06:28", distance: 5 },
      { stationCode: "VOC", stationName: "V.O.C. Nagar", arrivalTime: "06:30", departureTime: "06:30", distance: 7 },
      { stationCode: "TI", stationName: "Tiruvottiyur", arrivalTime: "06:35", departureTime: "06:35", distance: 9 },
      { stationCode: "WCN", stationName: "Wimco Nagar", arrivalTime: "06:41", departureTime: "06:41", distance: 12 },
      { stationCode: "KTVM", stationName: "Kathivakkam", arrivalTime: "06:44", departureTime: "06:44", distance: 15 },
      { stationCode: "ENR", stationName: "Ennore", arrivalTime: "06:50", departureTime: "06:50", distance: 16 },
      {
        stationCode: "AIPP",
        stationName: "Attipattu Pudu Nagar",
        arrivalTime: "06:57",
        departureTime: "06:57",
        distance: 20,
      },
      { stationCode: "AIP", stationName: "Attipattu", arrivalTime: "06:59", departureTime: "06:59", distance: 22 },
      { stationCode: "NDBM", stationName: "Nandiambakkam", arrivalTime: "07:01", departureTime: "07:01", distance: 24 },
      { stationCode: "MJR", stationName: "Minjur", arrivalTime: "07:04", departureTime: "07:04", distance: 26 },
      { stationCode: "ANPM", stationName: "Anuppambattu", arrivalTime: "07:08", departureTime: "07:08", distance: 30 },
      { stationCode: "PNE", stationName: "Ponneri", arrivalTime: "07:13", departureTime: "07:13", distance: 35 },
      {
        stationCode: "KPTI",
        stationName: "Kavaraippettai",
        arrivalTime: "07:19",
        departureTime: "07:19",
        distance: 42,
      },
      { stationCode: "GPD", stationName: "Gummidipundi", arrivalTime: "07:50", departureTime: "", distance: 47 },
    ],
  },
]

// Express trains based on the detailed schedule images
export const expressTrainSchedules: RealTrainSchedule[] = [
  {
    trainNumber: "02842",
    trainName: "MGR Chennai Central - Shalimar Special",
    type: "express",
    zone: "SER",
    runningDays: "W",
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "", departureTime: "04:30", distance: 0 },
      {
        stationCode: "GPD",
        stationName: "Gummidipundi",
        arrivalTime: "07:00",
        departureTime: "07:00",
        distance: 138,
        haltTime: 0,
      },
    ],
  },
  {
    trainNumber: "16031",
    trainName: "Andaman Express (PT)",
    type: "express",
    zone: "SR",
    runningDays: "SMWTF",
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "", departureTime: "05:10", distance: 0 },
      {
        stationCode: "GPD",
        stationName: "Gummidipundi",
        arrivalTime: "07:13",
        departureTime: "07:13",
        distance: 138,
        haltTime: 2,
      },
    ],
  },
  {
    trainNumber: "12603",
    trainName: "MGR Chennai Central - Charlapalli SF Express",
    type: "superfast",
    zone: "SR",
    runningDays: "SMWTFS",
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "", departureTime: "16:45", distance: 0 },
      {
        stationCode: "GPD",
        stationName: "Gummidipundi",
        arrivalTime: "18:58",
        departureTime: "18:58",
        distance: 138,
        haltTime: 2,
      },
    ],
  },
  {
    trainNumber: "12615",
    trainName: "Grand Trunk Express (PT)",
    type: "superfast",
    zone: "SR",
    runningDays: "SMWTFS",
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "", departureTime: "18:10", distance: 0 },
      {
        stationCode: "GPD",
        stationName: "Gummidipundi",
        arrivalTime: "20:28",
        departureTime: "20:28",
        distance: 138,
        haltTime: 2,
      },
    ],
  },
]

// Freight trains (unscheduled)
export const freightTrainSchedules: RealTrainSchedule[] = [
  {
    trainNumber: "FREIGHT-001",
    trainName: "Container Special",
    type: "freight",
    zone: "SR",
    runningDays: "Daily",
    stations: [
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "", departureTime: "03:00", distance: 0 },
      { stationCode: "GPD", stationName: "Gummidipundi", arrivalTime: "05:30", departureTime: "", distance: 138 },
    ],
  },
  {
    trainNumber: "FREIGHT-002",
    trainName: "Coal Rake",
    type: "freight",
    zone: "SR",
    runningDays: "Daily",
    stations: [
      { stationCode: "GPD", stationName: "Gummidipundi", arrivalTime: "", departureTime: "14:00", distance: 0 },
      { stationCode: "MAS", stationName: "Chennai Central", arrivalTime: "16:45", departureTime: "", distance: 138 },
    ],
  },
]

// Peak hours definition for Chennai suburban
export const peakHours = {
  morning: { start: "07:00", end: "10:00" },
  evening: { start: "17:00", end: "20:00" },
}

// Priority matrix based on time and train type
export function calculateTrainPriority(trainType: string, currentTime: Date): number {
  const hour = currentTime.getHours()
  const minute = currentTime.getMinutes()
  const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

  const isPeakHour =
    (timeString >= peakHours.morning.start && timeString <= peakHours.morning.end) ||
    (timeString >= peakHours.evening.start && timeString <= peakHours.evening.end)

  if (isPeakHour) {
    // During peak hours, EMU gets highest priority
    switch (trainType) {
      case "emu":
        return 1
      case "express":
        return 2
      case "superfast":
        return 3
      case "freight":
        return 5
      default:
        return 4
    }
  } else {
    // During non-peak hours, express gets priority
    switch (trainType) {
      case "express":
        return 1
      case "superfast":
        return 1
      case "emu":
        return 2
      case "freight":
        return 4
      default:
        return 3
    }
  }
}

// Generate realistic train movements
export function generateRealisticTrainMovements() {
  const currentTime = new Date()
  const movements = []

  // Add EMU services
  for (const schedule of emuLocalSchedules) {
    movements.push({
      trainNumber: schedule.trainNumber,
      trainName: schedule.trainName,
      type: schedule.type,
      currentStation: schedule.stations[Math.floor(Math.random() * schedule.stations.length)],
      priority: calculateTrainPriority(schedule.type, currentTime),
      schedule: schedule.stations,
    })
  }

  // Add express trains
  for (const schedule of expressTrainSchedules) {
    movements.push({
      trainNumber: schedule.trainNumber,
      trainName: schedule.trainName,
      type: schedule.type,
      currentStation: schedule.stations[Math.floor(Math.random() * schedule.stations.length)],
      priority: calculateTrainPriority(schedule.type, currentTime),
      schedule: schedule.stations,
    })
  }

  // Randomly add freight trains
  if (Math.random() > 0.7) {
    const freightSchedule = freightTrainSchedules[Math.floor(Math.random() * freightTrainSchedules.length)]
    movements.push({
      trainNumber: freightSchedule.trainNumber,
      trainName: freightSchedule.trainName,
      type: freightSchedule.type,
      currentStation: freightSchedule.stations[Math.floor(Math.random() * freightSchedule.stations.length)],
      priority: calculateTrainPriority(freightSchedule.type, currentTime),
      schedule: freightSchedule.stations,
    })
  }

  return movements
}
