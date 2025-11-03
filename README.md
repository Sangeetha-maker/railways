# Railway Decision Support System (DSS)

A comprehensive railway management system for the Chennai Central - Gummidipundi section, featuring real-time train monitoring, AI-powered decision making, safety compliance, and weather integration.

## Features

- **Live Train Monitoring**: Real-time tracking of EMU, Express, Superfast, and Freight trains
- **AI Decision Support**: Intelligent conflict resolution and operational recommendations
- **Safety Compliance**: Automated safety rule checking with G&SR, SWR, Operating, and Signal rules
- **Weather Integration**: Live weather data from Chennai affecting railway operations
- **What-If Analysis**: Simulate operational changes and analyze their impact
- **Conflict Management**: Automatic detection and resolution of train conflicts
- **Peak Hour Management**: Dynamic priority adjustment based on time of day

## Weather API Setup

The system uses OpenWeatherMap API to fetch real-time weather data for Chennai, which affects safety protocols and operational decisions.

### Getting Your API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "My API Keys" in your account dashboard
4. Copy your API key

### Environment Configuration

Add your OpenWeatherMap API key to your environment variables:

\`\`\`bash
# In your .env.local file or Vercel Project Settings
OPENWEATHER_API_KEY=your_api_key_here
\`\`\`

**Security Note**: The API key is now handled server-side for security. Do not use the `NEXT_PUBLIC_` prefix as this would expose your API key to client-side code.

### Weather Impact on Operations

The system automatically adjusts safety protocols based on weather conditions:

- **Fog/Low Visibility (< 2km)**: Speed restrictions to 25 km/h, fog signal protocols
- **Heavy Rain/Thunderstorms**: Speed restrictions to 50 km/h, electrical work suspension
- **High Winds**: Track debris monitoring, additional safety checks
- **Extreme Temperatures**: Track expansion monitoring, heat-related precautions

### Fallback Behavior

If the weather API is unavailable or no API key is provided:
- System uses simulated weather data
- Safety compliance continues to function
- User is notified about using mock data
- All other features remain fully operational

## System Components

### Live Monitoring
- Real-time train positions and status
- Speed, delay, and passenger load tracking
- Platform occupancy and throughput metrics

### Safety Compliance
- Automated G&SR rule checking (speed restrictions, visibility protocols)
- SWR rule monitoring (platform occupation limits)
- Signal violation detection
- Operating rule compliance (capacity limits)

### AI Decision Making
- Conflict prediction and resolution
- Priority-based train scheduling
- Peak hour optimization
- Weather-based operational adjustments

### What-If Analysis
- Scenario simulation and impact analysis
- Priority change effects
- Delay propagation modeling
- Platform optimization strategies

## Technical Architecture

- **Frontend**: Next.js with React components
- **State Management**: Integrated Railway System with real-time updates
- **Weather API**: OpenWeatherMap integration
- **Safety Engine**: Rule-based compliance checking
- **AI Engine**: Priority-based decision making

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your weather API key (see above)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Railway Section Details

**Route**: Chennai Central (MAS) to Gummidipundi (GPD)
**Division**: Chennai Division, Southern Railways
**Distance**: ~58 km
**Stations**: 17 stations including major junctions
**Train Types**: EMU Local, Express, Superfast, Freight

## Safety Standards

The system implements Indian Railway safety standards:
- General & Subsidiary Rules (G&SR)
- Station Working Rules (SWR)
- Operating procedures
- Signal regulations

Weather-based safety protocols ensure compliance with visibility, speed, and operational restrictions as per railway safety guidelines.
