import React from "react";
import "./css/Forecast.css";

export default function Forecast({ data, location }) {
    if (!data) {
        return (
            <div className="forecast-empty">
                <h3>No forecast data</h3>
                <p>Search a location to load the 3-day forecast.</p>
            </div>
        );
    }

    const forecastDays = data.forecast?.forecastday || [];

    // Helper to format "2025-11-12" → "12 November, 2025"
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <section className="forecast-component">
            <header className="forecast-header">
                <div>
                    <h2>
                        {location
                            ? `${location.name}, ${location.region}, ${location.country}`
                            : ""}
                    </h2>
                </div>
            </header>

            <div className="forecast-list">
                {forecastDays.map((day) => (
                    <article key={day.date} className="forecast-day">
                        <div className="day-summary">
                            {/* ✅ formatted date */}
                            <div className="date">{formatDate(day.date)}</div>

                            <div className="cond">
                                <img
                                    src={
                                        day.day.condition.icon.startsWith("//")
                                            ? "https:" + day.day.condition.icon
                                            : day.day.condition.icon
                                    }
                                    alt={day.day.condition.text}
                                />
                                <div>
                                    <div className="cond-text">{day.day.condition.text}</div>
                                    <div className="temps">
                                        Max: {Math.round(day.day.maxtemp_c)}°C • Min:{" "}
                                        {Math.round(day.day.mintemp_c)}°C • Avg:{" "}
                                        {Math.round(day.day.avgtemp_c)}°C
                                    </div>
                                </div>
                            </div>

                            <div className="uv">UV: {day.day.uv}</div>
                        </div>

                        <div className="hourly-strip" aria-hidden={false}>
                            {day.hour.map((h) => {
                                const range = Math.max(1, day.day.maxtemp_c - day.day.mintemp_c);
                                const height =
                                    Math.round(((h.temp_c - day.day.mintemp_c) / range) * 48) + 8;
                                return (
                                    <div className="hour-item" key={h.time}>
                                        <div className="hour-time">{h.time.slice(-5)}</div>
                                        <img
                                            className="hour-icon"
                                            src={
                                                h.condition.icon.startsWith("//")
                                                    ? "https:" + h.condition.icon
                                                    : h.condition.icon
                                            }
                                            alt={h.condition.text}
                                        />
                                        <div className="hour-temp">{Math.round(h.temp_c)}°C</div>
                                        <div
                                            className="hour-bar"
                                            style={{ height: `${Math.max(6, height)}px` }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
