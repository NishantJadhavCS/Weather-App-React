import React, { useEffect, useState, useMemo } from "react";
import "./css/WeatherData.css";

const getEpaLabel = (idx) => {
    // EPA index: 1 Good, 2 Moderate, 3 Unhealthy for Sensitive Groups, 4 Unhealthy, 5 Very Unhealthy, 6 Hazardous
    switch (Number(idx)) {
        case 1: return { text: "Good", color: "aq-good" };
        case 2: return { text: "Moderate", color: "aq-moderate" };
        case 3: return { text: "Unhealthy (S.G.)", color: "aq-unhealthy-sg" };
        case 4: return { text: "Unhealthy", color: "aq-unhealthy" };
        case 5: return { text: "Very Unhealthy", color: "aq-very-unhealthy" };
        case 6: return { text: "Hazardous", color: "aq-hazardous" };
        default: return { text: "Unknown", color: "aq-unknown" };
    }
};

const getGbLabel = (idx) => {
    // GB-DEFRA index scale: 1-10 small scale; for simplicity map coarse groups
    const i = Number(idx);
    if (i <= 3) return { text: "Low", color: "aq-good" };
    if (i <= 6) return { text: "Moderate", color: "aq-moderate" };
    if (i <= 8) return { text: "High", color: "aq-unhealthy" };
    return { text: "Very High", color: "aq-hazardous" };
};

const WeatherData = ({ data }) => {
    const [tempUnit, setTempUnit] = useState("C"); // "C" or "F"
    const [windUnit, setWindUnit] = useState("kph"); // "kph" or "mph"

    // Always call hooks in same order
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

    useEffect(() => {
        if (data) {
            setTempUnit("C");
            setWindUnit("kph");
        }
    }, [data]);

    if (!data) return null;
    const { location, current } = data;
    if (!location || !current) return null;

    const tempValue = tempUnit === "C" ? Math.round(current.temp_c) : Math.round(current.temp_f);
    const feelsValue = tempUnit === "C" ? Math.round(current.feelslike_c) : Math.round(current.feelslike_f);
    const windValue = windUnit === "kph" ? current.wind_kph : current.wind_mph;
    const rawIcon = current.condition?.icon || "";
    const iconUrl = rawIcon.startsWith("//") ? "https:" + rawIcon : rawIcon;
    const windDegree = current.wind_degree ?? 0;

    const aq = current.air_quality || null; // may be undefined if not requested

    // helper to format pollutants
    const formatNum = (n) => (n === undefined || n === null ? "—" : Number(n).toFixed(2));

    return (
        <section className={`weather-card ${bgClass}`} aria-live="polite">
            <header className="wd-location">
                <span className="wd-place"><strong>{location.name}</strong></span>
                <span className="wd-region">{location.region ? `, ${location.region}` : ""} {location.country ? `, ${location.country}` : ""}</span>
            </header>

            <div className="wd-main">
                <div className="wd-temp">
                    <div className="wd-temp-value">{tempValue}°</div>

                    <div className="wd-unit-toggle" role="tablist" aria-label="Temperature units">
                        <button className={`unit-btn ${tempUnit === "C" ? "active" : ""}`} onClick={() => setTempUnit("C")} aria-pressed={tempUnit === "C"}>C</button>
                        <button className={`unit-btn ${tempUnit === "F" ? "active" : ""}`} onClick={() => setTempUnit("F")} aria-pressed={tempUnit === "F"}>F</button>
                    </div>

                    <div className="wd-feels">Feels like: {feelsValue}°</div>
                </div>

                <div className="wd-condition">
                    <img src={iconUrl} alt={current.condition?.text || "weather icon"} />
                    <div>
                        <div className="wd-cond-text">{current.condition?.text}</div>
                        <div className="wd-stats-small">UV: {current.uv} • Vis: {current.vis_km} km</div>
                    </div>
                </div>
            </div>

            <div className="wd-details">
                <div className="wd-detail-block">
                    <div className="detail-title">Wind</div>
                    <div className="detail-value">
                        <span className="wind-value">{windValue} {windUnit}</span>
                        <div className="wind-controls">
                            <button className={`small-btn ${windUnit === "kph" ? "active" : ""}`} onClick={() => setWindUnit("kph")} aria-pressed={windUnit === "kph"}>kph</button>
                            <button className={`small-btn ${windUnit === "mph" ? "active" : ""}`} onClick={() => setWindUnit("mph")} aria-pressed={windUnit === "mph"}>mph</button>
                        </div>
                    </div>

                    <div className="wind-direction">
                        <svg className="wind-arrow" viewBox="0 0 24 24" aria-hidden focusable="false" style={{ transform: `rotate(${windDegree}deg)` }}>
                            <path d="M12 2 L19 21 L12 17 L5 21 Z" />
                        </svg>
                        <div className="wind-dir-text">{current.wind_dir} ({windDegree}°)</div>
                    </div>
                </div>

                <div className="wd-detail-block">
                    <div className="detail-title">Pressure</div>
                    <div className="detail-value">{current.pressure_mb} mb • {current.pressure_in} in</div>
                </div>

                <div className="wd-detail-block">
                    <div className="detail-title">Humidity</div>
                    <div className="detail-value">{current.humidity}%</div>
                </div>
            </div>

            {/* AQI Section: only render if air_quality exists */}
            {aq && (
                <div className="wd-aqi">
                    <div className="aqi-header">
                        <div className="aqi-title">Air Quality</div>
                        <div className="aqi-indices">
                            <div className={`aqi-badge ${getEpaLabel(aq["us-epa-index"]).color}`}>
                                EPA: {getEpaLabel(aq["us-epa-index"]).text}
                            </div>
                            <div className={`aqi-badge ${getGbLabel(aq["gb-defra-index"]).color}`}>
                                UK: {getGbLabel(aq["gb-defra-index"]).text}
                            </div>
                        </div>
                    </div>

                    <div className="aqi-grid">
                        <div className="aqi-item"><div className="aqi-key">PM2.5</div><div className="aqi-val">{formatNum(aq.pm2_5)} µg/m³</div></div>
                        <div className="aqi-item"><div className="aqi-key">PM10</div><div className="aqi-val">{formatNum(aq.pm10)} µg/m³</div></div>
                        <div className="aqi-item"><div className="aqi-key">NO₂</div><div className="aqi-val">{formatNum(aq.no2)} µg/m³</div></div>
                        <div className="aqi-item"><div className="aqi-key">O₃</div><div className="aqi-val">{formatNum(aq.o3)} µg/m³</div></div>
                        <div className="aqi-item"><div className="aqi-key">SO₂</div><div className="aqi-val">{formatNum(aq.so2)} µg/m³</div></div>
                        <div className="aqi-item"><div className="aqi-key">CO</div><div className="aqi-val">{formatNum(aq.co)} µg/m³</div></div>
                    </div>

                    <div className="aqi-note">
                        Note: pollutant units are provided by the API and shown as-is. Use these values to show color-coded warnings or guidance.
                    </div>
                </div>
            )}
        </section>
    );
};

export default WeatherData;
