// src/components/WeatherData.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./css/WeatherData.css";

const getEpaLabel = (idx) => {
    switch (Number(idx)) {
        case 1:
            return { text: "Good", color: "aq-good" };
        case 2:
            return { text: "Moderate", color: "aq-moderate" };
        case 3:
            return { text: "Unhealthy (S.G.)", color: "aq-unhealthy-sg" };
        case 4:
            return { text: "Unhealthy", color: "aq-unhealthy" };
        case 5:
            return { text: "Very Unhealthy", color: "aq-very-unhealthy" };
        case 6:
            return { text: "Hazardous", color: "aq-hazardous" };
        default:
            return { text: "Unknown", color: "aq-unknown" };
    }
};

const getGbLabel = (idx) => {
    const i = Number(idx);
    if (i <= 3) return { text: "Low", color: "aq-good" };
    if (i <= 6) return { text: "Moderate", color: "aq-moderate" };
    if (i <= 8) return { text: "High", color: "aq-unhealthy" };
    return { text: "Very High", color: "aq-hazardous" };
};

export default function WeatherData({ data }) {
    const [tempUnit, setTempUnit] = useState("C"); // "C" or "F"
    const [windUnit, setWindUnit] = useState("kph"); // "kph" or "mph"

    useEffect(() => {
        if (data) {
            setTempUnit("C");
            setWindUnit("kph");
        }
    }, [data]);

    const bgClass = useMemo(() => {
        const text = (data?.current?.condition?.text || "").toLowerCase();
        if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) return "bg-rain";
        if (text.includes("thunder") || text.includes("storm")) return "bg-storm";
        if (text.includes("snow") || text.includes("sleet") || text.includes("blizzard")) return "bg-snow";
        if (text.includes("overcast")) return "bg-overcast";
        if (text.includes("cloud") || text.includes("cloudy")) return "bg-cloudy";
        if (text.includes("fog") || text.includes("mist") || text.includes("haze")) return "bg-fog";
        if (text.includes("clear") || text.includes("sun") || text.includes("sunny")) return "bg-clear";
        return "bg-default";
    }, [data?.current?.condition?.text]);

    if (!data) return null;
    const { location, current } = data;
    if (!location || !current) return null;

    const tempValue = tempUnit === "C" ? Math.round(current.temp_c) : Math.round(current.temp_f);
    const feelsValue = tempUnit === "C" ? Math.round(current.feelslike_c) : Math.round(current.feelslike_f);
    const windValue = windUnit === "kph" ? current.wind_kph : current.wind_mph;
    const rawIcon = current.condition?.icon || "";
    const iconUrl = rawIcon.startsWith("//") ? "https:" + rawIcon : rawIcon;
    const windDegree = current.wind_degree ?? 0;
    const aq = current.air_quality || null;

    const formatNum = (n) => (n === undefined || n === null ? "—" : Number(n).toFixed(2));

    return (
        <section
            className={`weather-card ${bgClass} w-full max-w-[820px] mx-auto p-6 rounded-[14px] border border-[rgba(2,6,23,0.04)] shadow-[0_8px_28px_rgba(12,14,20,0.06)]`}
            aria-live="polite"
        >
            {/* Header */}
            <header className="wd-location text-sm text-slate-700 mb-3">
                <span className="wd-place font-semibold text-slate-900">{location.name}</span>
                <span className="wd-region text-slate-600">{location.region ? `, ${location.region}` : ""}{location.country ? `, ${location.country}` : ""}</span>
            </header>

            {/* Main: temp + cond */}
            <div className="wd-main flex flex-wrap items-center justify-between gap-6">
                <div className="wd-temp flex flex-col items-center min-w-[170px]">
                    <div className="wd-temp-value text-[64px] font-bold leading-none text-slate-900">{tempValue}°</div>

                    <div className="wd-unit-toggle inline-flex gap-2 mt-3" role="tablist" aria-label="Temperature units">
                        <button
                            type="button"
                            className={`unit-btn px-3 py-1 rounded-md font-semibold border ${tempUnit === "C" ? "bg-slate-900 text-white border-slate-900" : "bg-white/90 text-slate-900 border-[rgba(15,23,36,0.06)]"}`}
                            onClick={() => setTempUnit("C")}
                            aria-pressed={tempUnit === "C"}
                        >
                            C
                        </button>
                        <button
                            type="button"
                            className={`unit-btn px-3 py-1 rounded-md font-semibold border ${tempUnit === "F" ? "bg-slate-900 text-white border-slate-900" : "bg-white/90 text-slate-900 border-[rgba(15,23,36,0.06)]"}`}
                            onClick={() => setTempUnit("F")}
                            aria-pressed={tempUnit === "F"}
                        >
                            F
                        </button>
                    </div>

                    <div className="wd-feels text-sm text-slate-600 mt-3">Feels like: {feelsValue}°</div>
                </div>

                <div className="wd-condition flex items-center gap-4 min-w-[240px]">
                    <img className="w-16 h-16" src={iconUrl} alt={current.condition?.text || "weather icon"} />
                    <div className="min-w-0">
                        <div className="wd-cond-text text-lg font-semibold text-slate-900">{current.condition?.text}</div>
                        <div className="wd-stats-small text-sm text-slate-600 mt-1">UV: {current.uv} • Vis: {current.vis_km} km</div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="wd-details mt-6 flex flex-wrap gap-4 justify-center">
                <div className="wd-detail-block min-w-[200px] bg-white/60 p-3 rounded-lg border border-[rgba(2,6,23,0.03)]">
                    <div className="detail-title text-sm text-slate-700 font-semibold">Wind</div>
                    <div className="detail-value mt-1 flex items-center gap-3">
                        <span className="wind-value font-bold text-slate-900">{windValue} {windUnit}</span>
                        <div className="wind-controls inline-flex items-center ml-2 gap-2">
                            <button
                                type="button"
                                className={`small-btn px-2 py-1 rounded-md text-sm font-semibold ${windUnit === "kph" ? "bg-slate-900 text-white" : "bg-white/90 text-slate-900 border border-[rgba(15,23,36,0.06)]"}`}
                                onClick={() => setWindUnit("kph")}
                                aria-pressed={windUnit === "kph"}
                            >
                                kph
                            </button>
                            <button
                                type="button"
                                className={`small-btn px-2 py-1 rounded-md text-sm font-semibold ${windUnit === "mph" ? "bg-slate-900 text-white" : "bg-white/90 text-slate-900 border border-[rgba(15,23,36,0.06)]"}`}
                                onClick={() => setWindUnit("mph")}
                                aria-pressed={windUnit === "mph"}
                            >
                                mph
                            </button>
                        </div>
                    </div>

                    <div className="wind-direction mt-3 flex items-center gap-3">
                        <svg
                            className="wind-arrow w-6 h-6 transform"
                            viewBox="0 0 24 24"
                            aria-hidden
                            focusable="false"
                            style={{ transform: `rotate(${windDegree}deg)` }}
                        >
                            <path d="M12 2 L19 21 L12 17 L5 21 Z" fill="currentColor" />
                        </svg>
                        <div className="wind-dir-text text-sm text-slate-700">{current.wind_dir} ({windDegree}°)</div>
                    </div>
                </div>

                <div className="wd-detail-block min-w-[200px] bg-white/60 p-3 rounded-lg border border-[rgba(2,6,23,0.03)]">
                    <div className="detail-title text-sm text-slate-700 font-semibold">Pressure</div>
                    <div className="detail-value mt-1 font-bold text-slate-900">{current.pressure_mb} mb • {current.pressure_in} in</div>
                </div>

                <div className="wd-detail-block min-w-[160px] bg-white/60 p-3 rounded-lg border border-[rgba(2,6,23,0.03)]">
                    <div className="detail-title text-sm text-slate-700 font-semibold">Humidity</div>
                    <div className="detail-value mt-1 font-bold text-slate-900">{current.humidity}%</div>
                </div>
            </div>

            {/* AQI */}
            {aq && (
                <div className="wd-aqi mt-6 p-3 rounded-lg bg-white/70 border border-[rgba(2,6,23,0.04)]">
                    <div className="aqi-header flex items-center justify-between mb-3">
                        <div className="aqi-title font-semibold text-slate-900">Air Quality</div>
                        <div className="aqi-indices flex items-center gap-2">
                            <div className={`aqi-badge px-3 py-1 rounded-md text-white font-bold ${getEpaLabel(aq["us-epa-index"]).color}`}>
                                EPA: {getEpaLabel(aq["us-epa-index"]).text}
                            </div>
                            <div className={`aqi-badge px-3 py-1 rounded-md text-white font-bold ${getGbLabel(aq["gb-defra-index"]).color}`}>
                                UK: {getGbLabel(aq["gb-defra-index"]).text}
                            </div>
                        </div>
                    </div>

                    <div className="aqi-grid grid grid-cols-3 gap-3">
                        <div className="aqi-item flex justify-between items-center p-2 bg-white/80 rounded-md border border-[rgba(2,6,23,0.03)]">
                            <div className="aqi-key font-semibold text-slate-700">PM2.5</div>
                            <div className="aqi-val font-bold">{formatNum(aq.pm2_5)} µg/m³</div>
                        </div>

                        <div className="aqi-item flex justify-between items-center p-2 bg-white/80 rounded-md border border-[rgba(2,6,23,0.03)]">
                            <div className="aqi-key font-semibold text-slate-700">PM10</div>
                            <div className="aqi-val font-bold">{formatNum(aq.pm10)} µg/m³</div>
                        </div>

                        <div className="aqi-item flex justify-between items-center p-2 bg-white/80 rounded-md border border-[rgba(2,6,23,0.03)]">
                            <div className="aqi-key font-semibold text-slate-700">NO₂</div>
                            <div className="aqi-val font-bold">{formatNum(aq.no2)} µg/m³</div>
                        </div>

                        <div className="aqi-item flex justify-between items-center p-2 bg-white/80 rounded-md border border-[rgba(2,6,23,0.03)]">
                            <div className="aqi-key font-semibold text-slate-700">O₃</div>
                            <div className="aqi-val font-bold">{formatNum(aq.o3)} µg/m³</div>
                        </div>

                        <div className="aqi-item flex justify-between items-center p-2 bg-white/80 rounded-md border border-[rgba(2,6,23,0.03)]">
                            <div className="aqi-key font-semibold text-slate-700">SO₂</div>
                            <div className="aqi-val font-bold">{formatNum(aq.so2)} µg/m³</div>
                        </div>

                        <div className="aqi-item flex justify-between items-center p-2 bg-white/80 rounded-md border border-[rgba(2,6,23,0.03)]">
                            <div className="aqi-key font-semibold text-slate-700">CO</div>
                            <div className="aqi-val font-bold">{formatNum(aq.co)} µg/m³</div>
                        </div>
                    </div>

                    <div className="aqi-note text-sm text-slate-600 mt-3">
                        Note: pollutant units are provided by the API and shown as-is. Use these values to show color-coded warnings or guidance.
                    </div>
                </div>
            )}
        </section>
    );
}

function formatNum(n) {
    return n === undefined || n === null ? "—" : Number(n).toFixed(2);
}
