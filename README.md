# 🌦️ React Weather App

A modern **React + Vite** weather application that displays **real-time weather data** and **3-day forecasts** using the [WeatherAPI](https://www.weatherapi.com/).  
Built to learn and demonstrate React fundamentals — including **hooks, API integration, state management, conditional rendering, and responsive UI design**.

---

## ⚡ Features

- **Real-time Weather Data** — get current temperature, humidity, pressure, wind speed, and condition.
- **3-Day Forecast** — view future weather predictions with hourly breakdowns.
- **Optional AQI (Air Quality Index)** — toggle to include air quality metrics like PM2.5, CO, NO₂, etc.
- **Dynamic Backgrounds** — backgrounds change based on weather conditions (sunny, cloudy, rain, etc).
- **Unit Switching** — easily toggle between Celsius/Fahrenheit and kph/mph.
- **Loading States** — clean skeleton loader with shimmer and spinner animations.
- **Polished UI** — smooth hover transitions, entrance animations, and gradient cards.
- **Responsive Layout** — optimized for both mobile and desktop devices.

---

## 🧩 Component Structure

| Component         | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `SearchBar.jsx`   | Handles city input, AQI toggle, and search functionality.               |
| `WeatherData.jsx` | Displays real-time weather details with condition icons and AQI data.   |
| `Forecast.jsx`    | Renders 3-day forecast with hourly temperatures in scrollable cards.    |
| `Loading.jsx`     | Displays animated loader and skeleton placeholders while fetching data. |

Each component includes its own `.css` file for modular and maintainable styling.

---

## 🔗 API Integration

This project uses [WeatherAPI.com](https://www.weatherapi.com/) — a reliable free weather service.

### **1️⃣ Realtime Weather API**

Endpoint:
https://api.weatherapi.com/v1/current.json

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/weather-app.git
cd weather-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in your project root:

```bash
VITE_WEATHER_API_KEY=your_api_key_here
```

Add it to .gitignore to keep your API key safe.
