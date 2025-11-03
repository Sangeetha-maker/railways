"use server"

export interface WeatherData {
  condition: string
  visibility: number // in km
  temperature: number // in celsius
  impact: string
  recommendations: string[]
  windSpeed?: number // in m/s
  humidity?: number // in percentage
}

export async function getCurrentWeather(): Promise<WeatherData> {
  const CHENNAI_LAT = 13.0827
  const CHENNAI_LON = 80.2707
  const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

  const apiKey = "0672c44952e356da196f612bdcc3ff95"

  try {
    const url = `${API_BASE_URL}?lat=${CHENNAI_LAT}&lon=${CHENNAI_LON}&appid=${apiKey}&units=metric`
    console.log("[WeatherAction] Fetching live weather data for Chennai...")

    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.warn("[WeatherAction] API request failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })

      return {
        condition: "Weather data unavailable",
        visibility: 8,
        temperature: 30,
        impact: "Unable to fetch current weather conditions",
        recommendations: ["Weather service temporarily unavailable", "Using default operational parameters"],
        windSpeed: 5,
        humidity: 70,
      }
    }

    const data = await response.json()
    console.log("[WeatherAction] Successfully fetched live weather data for Chennai")
    return parseWeatherData(data)
  } catch (error) {
    console.warn("[WeatherAction] Weather API error:", error instanceof Error ? error.message : "Unknown error")

    return {
      condition: "Weather service error",
      visibility: 8,
      temperature: 30,
      impact: "Weather data temporarily unavailable",
      recommendations: ["Weather service connection failed", "Using default operational parameters"],
      windSpeed: 5,
      humidity: 70,
    }
  }
}

function parseWeatherData(apiData: any): WeatherData {
  const temperature = Math.round(apiData.main.temp)
  const humidity = apiData.main.humidity
  const weatherMain = apiData.weather[0].main
  const weatherDescription = apiData.weather[0].description
  const windSpeed = apiData.wind?.speed || 0
  const visibilityKm = apiData.visibility ? Math.round(apiData.visibility / 1000) : 10

  let condition = weatherMain
  let impact = "Normal operations"
  const recommendations: string[] = []

  // Determine impact based on weather conditions
  switch (weatherMain.toLowerCase()) {
    case "rain":
    case "drizzle":
      if (weatherDescription.includes("heavy")) {
        condition = "Heavy Rain"
        impact = "Significant delays expected"
        recommendations.push(
          "Monitor track conditions",
          "Check drainage systems",
          "Reduce train speeds by 15%",
          "Alert maintenance teams",
        )
      } else {
        condition = "Light Rain"
        impact = "Minor delays possible"
        recommendations.push("Monitor track conditions", "Check drainage systems")
      }
      break

    case "thunderstorm":
      condition = "Thunderstorm"
      impact = "Safety protocols activated"
      recommendations.push(
        "Suspend overhead electrical work",
        "Monitor lightning activity",
        "Prepare for emergency protocols",
        "Reduce train speeds by 20%",
      )
      break

    case "mist":
    case "fog":
      condition = "Fog"
      impact = "Reduced visibility operations"
      recommendations.push(
        "Activate fog signal protocols",
        "Reduce train speeds by 25%",
        "Increase station dwell time",
        "Use additional signaling measures",
      )
      break

    case "clear":
      condition = "Clear"
      impact = "Optimal conditions"
      break

    case "clouds":
      condition = weatherDescription.includes("overcast") ? "Overcast" : "Partly Cloudy"
      impact = "Normal operations"
      break

    default:
      condition = weatherMain
      impact = "Monitor conditions"
  }

  // Additional checks
  if (visibilityKm < 2) {
    impact = "Severely reduced visibility - extreme caution required"
    recommendations.push(
      "Implement emergency fog protocols",
      "Consider service suspension if visibility drops below 1km",
    )
  } else if (visibilityKm < 5) {
    if (!recommendations.some((r) => r.includes("fog signal"))) {
      recommendations.push("Activate fog signal protocols", "Reduce train speeds by 20%")
    }
  }

  if (windSpeed > 15) {
    recommendations.push("Monitor wind conditions", "Check for debris on tracks")
  }

  if (temperature > 40) {
    recommendations.push("Monitor track expansion", "Check for heat-related track issues")
  } else if (temperature < 15) {
    recommendations.push("Monitor for potential fog formation")
  }

  return {
    condition,
    visibility: visibilityKm,
    temperature,
    impact,
    recommendations,
    windSpeed,
    humidity,
  }
}

function getChennaiWeatherSimulation(): WeatherData {
  const currentHour = new Date().getHours()
  const currentMonth = new Date().getMonth() + 1 // 1-12

  // Chennai weather patterns based on season and time
  let baseConditions: Omit<WeatherData, "recommendations">[]

  if (currentMonth >= 6 && currentMonth <= 9) {
    // Monsoon season (June-September)
    baseConditions = [
      {
        condition: "Heavy Rain",
        visibility: 3,
        temperature: 26,
        impact: "Significant delays expected",
        windSpeed: 12,
        humidity: 85,
      },
      {
        condition: "Thunderstorm",
        visibility: 2,
        temperature: 25,
        impact: "Safety protocols activated",
        windSpeed: 15,
        humidity: 90,
      },
      {
        condition: "Light Rain",
        visibility: 5,
        temperature: 28,
        impact: "Minor delays possible",
        windSpeed: 8,
        humidity: 80,
      },
      {
        condition: "Overcast",
        visibility: 7,
        temperature: 29,
        impact: "Normal operations",
        windSpeed: 6,
        humidity: 75,
      },
    ]
  } else if (currentMonth >= 10 && currentMonth <= 2) {
    // Post-monsoon/Winter (October-February)
    baseConditions = [
      { condition: "Clear", visibility: 10, temperature: 28, impact: "Optimal conditions", windSpeed: 4, humidity: 65 },
      {
        condition: "Partly Cloudy",
        visibility: 9,
        temperature: 30,
        impact: "Normal operations",
        windSpeed: 5,
        humidity: 70,
      },
      { condition: "Hazy", visibility: 6, temperature: 27, impact: "Normal operations", windSpeed: 3, humidity: 75 },
    ]
  } else {
    // Summer (March-May)
    baseConditions = [
      {
        condition: "Clear",
        visibility: 8,
        temperature: 36,
        impact: "Hot conditions - monitor track expansion",
        windSpeed: 6,
        humidity: 60,
      },
      {
        condition: "Hazy",
        visibility: 6,
        temperature: 38,
        impact: "Very hot - check for heat-related issues",
        windSpeed: 4,
        humidity: 55,
      },
      {
        condition: "Partly Cloudy",
        visibility: 7,
        temperature: 34,
        impact: "Hot conditions",
        windSpeed: 7,
        humidity: 65,
      },
    ]
  }

  // Add early morning fog during winter months
  if ((currentMonth >= 11 || currentMonth <= 2) && currentHour >= 5 && currentHour <= 8) {
    baseConditions.push({
      condition: "Fog",
      visibility: 2,
      temperature: 24,
      impact: "Reduced visibility operations",
      windSpeed: 2,
      humidity: 95,
    })
  }

  const selected = baseConditions[Math.floor(Math.random() * baseConditions.length)]
  const recommendations = ["Using simulated Chennai weather data"]

  // Add condition-specific recommendations
  if (selected.visibility < 3) {
    recommendations.push("Activate fog signal protocols", "Reduce train speeds by 25%")
  } else if (selected.visibility < 5) {
    recommendations.push("Monitor visibility conditions", "Reduce train speeds by 15%")
  }

  if (selected.condition.includes("Rain")) {
    recommendations.push("Monitor track conditions", "Check drainage systems")
  }

  if (selected.condition === "Thunderstorm") {
    recommendations.push("Suspend overhead electrical work", "Monitor lightning activity")
  }

  if (selected.condition === "Fog") {
    recommendations.push("Implement fog protocols", "Increase station dwell time")
  }

  if (selected.temperature && selected.temperature > 35) {
    recommendations.push("Monitor track expansion", "Check for heat-related track issues")
  }

  return {
    ...selected,
    recommendations,
  }
}
