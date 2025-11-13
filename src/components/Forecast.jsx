import React from "react";
import "./css/Forecast.css"; // small helper: animations + scrollbar + reduced-motion

export default function Forecast({ data, location }) {
    if (!data) {
        return (
            <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-slate-800">No forecast data</h3>
                <p className="text-sm text-slate-500 mt-2">
                    Search a location to load the 3-day forecast.
                </p>
            </div>
        );
    }

    const forecastDays = data.forecast?.forecastday || [];

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <section className="forecast-component max-w-[980px] mx-auto text-slate-900 px-2">
            <header className="forecast-header mb-3">
                <div>
                    <h2 className="text-xl font-extrabold">
                        {location ? `${location.name}, ${location.region}, ${location.country}` : ""}
                    </h2>
                </div>
            </header>

            <div className="forecast-list flex flex-col gap-4">
                {forecastDays.map((day, idx) => (
                    <article
                        key={day.date}
                        className="forecast-day bg-white/90 rounded-lg p-4 shadow-sm hover:shadow-md transition-transform duration-200 transform-gpu will-change-transform"
                        style={{ animationDelay: `${idx * 40}ms` }}
                    >
                        <div className="day-summary flex flex-wrap items-center justify-between gap-4 mb-3">
                            <div className="date font-semibold text-slate-800 min-w-[140px]">
                                {formatDate(day.date)}
                            </div>

                            <div className="cond flex items-center gap-3 flex-1 min-w-0">
                                <img
                                    className="w-[54px] h-[54px] flex-shrink-0 transition-transform duration-200"
                                    src={
                                        day.day.condition.icon?.startsWith("//")
                                            ? "https:" + day.day.condition.icon
                                            : day.day.condition.icon
                                    }
                                    alt={day.day.condition.text}
                                />

                                <div className="min-w-0">
                                    <div className="cond-text font-semibold text-slate-900 truncate">
                                        {day.day.condition.text}
                                    </div>
                                    <div className="temps text-sm text-slate-600 mt-1">
                                        Max: {Math.round(day.day.maxtemp_c)}°C • Min:{" "}
                                        {Math.round(day.day.mintemp_c)}°C • Avg:{" "}
                                        {Math.round(day.day.avgtemp_c)}°C
                                    </div>
                                </div>
                            </div>

                            <div className="uv font-semibold text-slate-800 min-w-[80px] text-right">
                                UV: {day.day.uv}
                            </div>
                        </div>

                        <div
                            className="hourly-strip flex gap-3 overflow-x-auto py-2 px-1 border-t border-dashed border-slate-100 touch-pan-y"
                            aria-hidden={false}
                        >
                            {day.hour.map((h) => {
                                const range = Math.max(1, day.day.maxtemp_c - day.day.mintemp_c);
                                const height =
                                    Math.round(((h.temp_c - day.day.mintemp_c) / range) * 48) + 8;
                                return (
                                    <div
                                        className="hour-item flex flex-col items-center gap-2 min-w-[64px] p-2 bg-white/80 rounded-md border border-slate-100 shadow-sm hover:translate-y-[-6px] transition-transform"
                                        key={h.time}
                                    >
                                        <div className="hour-time text-xs text-slate-600">
                                            {h.time.slice(-5)}
                                        </div>

                                        <img
                                            className="hour-icon w-8 h-8"
                                            src={
                                                h.condition.icon?.startsWith("//")
                                                    ? "https:" + h.condition.icon
                                                    : h.condition.icon
                                            }
                                            alt={h.condition.text}
                                        />

                                        <div className="hour-temp text-sm font-semibold">
                                            {Math.round(h.temp_c)}°C
                                        </div>

                                        <div
                                            className="hour-bar rounded-md mt-1 w-[18px] temp-bar-gradient"
                                            style={{ height: `${Math.max(6, height)}px` }}
                                            aria-hidden
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
