import React, { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import WeatherData from "./components/WeatherData";
import Forecast from "./components/Forecast";
import Loading from "./components/Loading";
import "./App.css";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);   // current.json response
  const [forecastData, setForecastData] = useState(null); // forecast.json response (days=3)
  const [lastQuery, setLastQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("realtime"); // "realtime" | "forecast"

  const handleSearch = async (query, includeAqi) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!apiKey) {
      alert("Missing API key (VITE_WEATHER_API_KEY).");
      return;
    }

    setLastQuery(query);
    setLoading(true);
    setView("realtime"); // default to realtime whenever a new search runs

    const currentUrl = "https://api.weatherapi.com/v1/current.json";
    const forecastUrl = "https://api.weatherapi.com/v1/forecast.json";

    try {
      const [currentResp, forecastResp] = await Promise.all([
        axios.get(currentUrl, {
          params: { key: apiKey, q: query, aqi: includeAqi ? "yes" : "no" }
        }),
        axios.get(forecastUrl, {
          params: { key: apiKey, q: query, days: 3, aqi: "no", alerts: "no" }
        })
      ]);

      setWeatherData(currentResp.data ?? null);
      setForecastData(forecastResp.data ?? null);
    } catch (err) {
      console.error("Search error:", err);
      setWeatherData({ error: "Failed to fetch current weather" });
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleSearch} />

      {/* Controls / Tabs shown after first search result */}
      {lastQuery && (
        <div className="view-controls">
          <div className="view-left">
            <button
              className={`view-btn ${view === "realtime" ? "active" : ""}`}
              onClick={() => setView("realtime")}
            >
              Realtime
            </button>
            <button
              className={`view-btn ${view === "forecast" ? "active" : ""}`}
              onClick={() => setView("forecast")}
            >
              Forecast (3 days)
            </button>
          </div>
        </div>
      )}

      <main style={{ maxWidth: 980, margin: "18px auto", padding: "0 14px" }}>
        {loading && <Loading />}

        {!loading && view === "realtime" && (
          <WeatherData data={weatherData} />
        )}

        {!loading && view === "forecast" && (
          <Forecast data={forecastData} location={weatherData?.location} />
        )}
      </main>
    </div>
  );
}
