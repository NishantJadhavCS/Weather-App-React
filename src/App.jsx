// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import WeatherData from "./components/WeatherData";
import Forecast from "./components/Forecast";
import Loading from "./components/Loading";
import "./index.css";
import "./App.css";

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [lastQuery, setLastQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("realtime");

  const handleSearch = async (query, includeAqi) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!apiKey) {
      alert("Missing API key (VITE_WEATHER_API_KEY).");
      return;
    }

    setLastQuery(query);
    setLoading(true);
    setView("realtime");

    const currentUrl = "https://api.weatherapi.com/v1/current.json";
    const forecastUrl = "https://api.weatherapi.com/v1/forecast.json";

    try {
      const [currentResp, forecastResp] = await Promise.all([
        axios.get(currentUrl, {
          params: { key: apiKey, q: query, aqi: includeAqi ? "yes" : "no" },
        }),
        axios.get(forecastUrl, {
          params: { key: apiKey, q: query, days: 3, aqi: "no", alerts: "no" },
        }),
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
    <div className="min-h-screen flex flex-col items-center text-[#0f1724] antialiased">
      <div className="w-full max-w-[1280px] px-6 py-8 flex flex-col gap-5">
        <SearchBar onSearch={handleSearch} />

        {lastQuery && (
          <div className="flex justify-center items-center gap-3 max-w-[980px] mx-auto mt-3 px-4">
            <div className="flex gap-2">
              <button
                className={
                  "px-3 py-2 rounded-lg font-bold border transition-transform duration-150 " +
                  (view === "realtime"
                    ? "bg-gradient-to-b from-[#6366f1] to-[#4f46e5] text-white shadow-lg border-[rgba(79,70,229,0.18)]"
                    : "bg-transparent text-[#0f1724] border-[rgba(2,6,23,0.06)] hover:bg-[rgba(99,102,241,0.04)]")
                }
                onClick={() => setView("realtime")}
                aria-pressed={view === "realtime"}
                type="button"
              >
                Realtime
              </button>

              <button
                className={
                  "px-3 py-2 rounded-lg font-bold border transition-transform duration-150 " +
                  (view === "forecast"
                    ? "bg-gradient-to-b from-[#6366f1] to-[#4f46e5] text-white shadow-lg border-[rgba(79,70,229,0.18)]"
                    : "bg-transparent text-[#0f1724] border-[rgba(2,6,23,0.06)] hover:bg-[rgba(99,102,241,0.04)]")
                }
                onClick={() => setView("forecast")}
                aria-pressed={view === "forecast"}
                type="button"
              >
                Forecast (3 days)
              </button>
            </div>
          </div>
        )}

        {/* only render the glass card when loading OR after at least one search */}
        {(loading || lastQuery) && (
          <main className="mx-auto w-full max-w-[980px]">
            <div className="bg-white/70 backdrop-blur-sm backdrop-saturate-125 border border-[rgba(15,23,36,0.06)] shadow-[0_10px_30px_rgba(15,23,36,0.06)] rounded-[14px] p-8">
              {loading && <Loading />}

              {!loading && view === "realtime" && <WeatherData data={weatherData} />}

              {!loading && view === "forecast" && (
                <Forecast data={forecastData} location={weatherData?.location} />
              )}
            </div>
          </main>
        )}

        {/* optional: show a tiny hint when nothing searched yet */}
        {!loading && !lastQuery && (
          <p className="text-center text-sm text-[#64748b] mt-6">
            Enter a city or location above and press Search to see the weather.
          </p>
        )}
      </div>
    </div>
  );
}
