import { getCurrentWeather as getWeatherFromServer } from "./actions/weather-actions"

export interface WeatherData {
  condition: string
  visibility: number // in km
  temperature: number // in celsius
  impact: string
  recommendations: string[]
  windSpeed?: number // in m/s
  humidity?: number // in percentage
}

export class WeatherService {
  static async getCurrentWeather(): Promise<WeatherData> {
    try {
      console.log("[WeatherService] Fetching weather data from server action...")
      const weatherData = await getWeatherFromServer()
      console.log("[WeatherService] Weather data received:", weatherData)
      return weatherData
    } catch (error) {
      console.error("[WeatherService] Failed to fetch weather data from server:", error)
      return this.getFallbackWeatherData()
    }
  }

  private static getFallbackWeatherData(): WeatherData {
    const fallbackConditions = [
      { condition: "Clear", visibility: 10, temperature: 32, impact: "Optimal conditions" },
      { condition: "Partly Cloudy", visibility: 8, temperature: 30, impact: "Normal operations" },
      { condition: "Light Rain", visibility: 6, temperature: 28, impact: "Minor delays possible" },
      { condition: "Heavy Rain", visibility: 4, temperature: 25, impact: "Significant delays expected" },
      { condition: "Thunderstorm", visibility: 3, temperature: 26, impact: "Safety protocols activated" },
    ]

    const selected = fallbackConditions[Math.floor(Math.random() * fallbackConditions.length)]
    const recommendations = ["Weather data unavailable - using manual observations"]

    if (selected.visibility < 5) {
      recommendations.push("Activate fog signal protocols", "Reduce train speeds by 20%")
    }

    if (selected.condition.includes("Rain")) {
      recommendations.push("Monitor track conditions", "Check drainage systems")
    }

    if (selected.condition === "Thunderstorm") {
      recommendations.push("Suspend overhead electrical work", "Monitor lightning activity")
    }

    return {
      ...selected,
      recommendations,
    }
  }
}
