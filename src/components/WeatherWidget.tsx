"use client";

import { useState } from "react";

interface WeatherDay {
    day: string;
    temp: number;
    icon: string;
    condition: string;
}

interface RegionalClimate {
    location: string;
    district: string;
    elevation: string;
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    uvIndex: string;
    advisory: string;
    trekStatus: "Optimal" | "Moderate" | "Caution";
    forecast: WeatherDay[];
}

const REGIONAL_PROFILES: Record<string, RegionalClimate> = {
    tawang: {
        location: "Tawang & Sangestar Tso",
        district: "Tawang District",
        elevation: "3,048 m – 4,868 m",
        temp: 11,
        condition: "Crisp Alpine Clear",
        icon: "☀️",
        humidity: 48,
        windSpeed: 14,
        uvIndex: "Very High (Altitude)",
        advisory: "Clear morning skies. Afternoon mountain mist expected around passes. Pack a windbreaker & UV sunglasses.",
        trekStatus: "Optimal",
        forecast: [
            { day: "Today", temp: 11, icon: "☀️", condition: "Clear Skies" },
            { day: "Tomorrow", temp: 10, icon: "🌤️", condition: "Passing Clouds" },
            { day: "Wed", temp: 9, icon: "⛅", condition: "Cool Breeze" },
            { day: "Thu", temp: 12, icon: "☀️", condition: "Sunny & Crisp" },
        ],
    },
    ziro: {
        location: "Ziro & Talle Valley",
        district: "Lower Subansiri",
        elevation: "1,560 m – 2,745 m",
        temp: 18,
        condition: "Mild Valley Breeze",
        icon: "⛅",
        humidity: 62,
        windSpeed: 8,
        uvIndex: "Moderate",
        advisory: "Comfortable trekking temperature through pine & bamboo groves. Trails are dry and accessible.",
        trekStatus: "Optimal",
        forecast: [
            { day: "Today", temp: 18, icon: "⛅", condition: "Mild Sun" },
            { day: "Tomorrow", temp: 19, icon: "☀️", condition: "Clear Valley" },
            { day: "Wed", temp: 17, icon: "🌦️", condition: "Light Rain" },
            { day: "Thu", temp: 18, icon: "🌤️", condition: "Partly Cloudy" },
        ],
    },
    anini: {
        location: "Anini & Seven Lakes",
        district: "Dibang Valley",
        elevation: "1,968 m – 4,000 m",
        temp: 8,
        condition: "Subalpine Cool",
        icon: "🌤️",
        humidity: 55,
        windSpeed: 18,
        uvIndex: "High",
        advisory: "Glacial winds above 3,500m. Nights drop close to 0°C. Quality down jacket & thermal sleeping bag recommended.",
        trekStatus: "Moderate",
        forecast: [
            { day: "Today", temp: 8, icon: "🌤️", condition: "Alpine Sun" },
            { day: "Tomorrow", temp: 7, icon: "⛅", condition: "High Clouds" },
            { day: "Wed", temp: 6, icon: "🌧️", condition: "Ridge Mist" },
            { day: "Thu", temp: 8, icon: "☀️", condition: "Clear Lakes" },
        ],
    },
    anjaw: {
        location: "Dong Valley & Walong",
        district: "Anjaw District",
        elevation: "1,240 m – 2,200 m",
        temp: 15,
        condition: "Dawn Glow",
        icon: "🌅",
        humidity: 50,
        windSpeed: 10,
        uvIndex: "High",
        advisory: "Night hike temperature is around 4°C at the sunrise crest. Daylight heats up comfortably to 19°C.",
        trekStatus: "Optimal",
        forecast: [
            { day: "Today", temp: 15, icon: "🌅", condition: "Clear Dawn" },
            { day: "Tomorrow", temp: 16, icon: "☀️", condition: "Bright Sun" },
            { day: "Wed", temp: 15, icon: "🌤️", condition: "Pleasant" },
            { day: "Thu", temp: 14, icon: "⛅", condition: "Scattered Cloud" },
        ],
    },
    "west-kameng": {
        location: "Dirang & Bailey Trail",
        district: "West Kameng",
        elevation: "1,560 m – 4,980 m",
        temp: 9,
        condition: "Pass Breeze",
        icon: "🏔️",
        humidity: 52,
        windSpeed: 16,
        uvIndex: "Very High",
        advisory: "Tse La pass is clear. Keep hydration high for crossing high passes. Early departures recommended.",
        trekStatus: "Optimal",
        forecast: [
            { day: "Today", temp: 9, icon: "🏔️", condition: "Cool Crest" },
            { day: "Tomorrow", temp: 8, icon: "⛅", condition: "High Pass Wind" },
            { day: "Wed", temp: 9, icon: "☀️", condition: "Clear Pass" },
            { day: "Thu", temp: 10, icon: "🌤️", condition: "Mild Mountain" },
        ],
    },
};

interface WeatherWidgetProps {
    location?: string;
    compact?: boolean;
}

export default function WeatherWidget({ location = "tawang", compact = false }: WeatherWidgetProps) {
    const key = location.toLowerCase();
    const matchedKey = Object.keys(REGIONAL_PROFILES).find(k => key.includes(k)) || "tawang";
    const [selectedRegion, setSelectedRegion] = useState<string>(matchedKey);
    const [isFahrenheit, setIsFahrenheit] = useState(false);

    const weather = REGIONAL_PROFILES[selectedRegion] || REGIONAL_PROFILES.tawang;

    const convertTemp = (celsius: number) => {
        if (!isFahrenheit) return `${celsius}°C`;
        return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    };

    const statusBadgeColors = {
        Optimal: { bg: "rgba(63, 143, 95, 0.15)", text: "#3f8f5f", border: "#3f8f5f" },
        Moderate: { bg: "rgba(217, 95, 36, 0.15)", text: "#d95f24", border: "#d95f24" },
        Caution: { bg: "rgba(176, 64, 47, 0.15)", text: "#b0402f", border: "#b0402f" },
    };

    const statusStyle = statusBadgeColors[weather.trekStatus];

    if (compact) {
        return (
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 14px",
                background: "var(--night-2, #132130)",
                border: "1px solid var(--line, rgba(243, 238, 228, 0.14))",
                borderRadius: "var(--r-md, 12px)",
                color: "#fff",
                fontSize: "13px"
            }}>
                <span style={{ fontSize: "20px" }}>{weather.icon}</span>
                <div>
                    <strong>{convertTemp(weather.temp)}</strong> · {weather.condition}
                    <div style={{ fontSize: "11px", color: "var(--stone, #cfc7b6)" }}>{weather.district}</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: "linear-gradient(170deg, #132130 0%, #0d1721 100%)",
            border: "1px solid rgba(243, 238, 228, 0.12)",
            borderRadius: "var(--r-lg, 16px)",
            padding: "24px",
            color: "#f4efe5",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
        }}>
            {/* Header with region picker and °C/°F toggle */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                <div>
                    <span style={{
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ice, #8fbac9)",
                        fontWeight: 600,
                        display: "block",
                        marginBottom: "4px"
                    }}>
                        Live Trail Mountain Weather
                    </span>
                    <h3 style={{ margin: 0, fontSize: "18px", color: "#fff", fontFamily: "var(--font-serif)" }}>
                        {weather.location}
                    </h3>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        style={{
                            background: "#1b2c3d",
                            color: "#f4efe5",
                            border: "1px solid rgba(243, 238, 228, 0.2)",
                            padding: "6px 10px",
                            borderRadius: "var(--r-sm, 8px)",
                            fontSize: "12px",
                            outline: "none",
                            cursor: "pointer"
                        }}
                        aria-label="Select Arunachal Region"
                    >
                        <option value="tawang">Tawang District</option>
                        <option value="ziro">Ziro / Talle Valley</option>
                        <option value="anini">Anini / Dibang Valley</option>
                        <option value="anjaw">Dong Valley (Anjaw)</option>
                        <option value="west-kameng">Dirang / West Kameng</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => setIsFahrenheit(!isFahrenheit)}
                        style={{
                            background: "rgba(255,255,255,0.08)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "var(--r-sm, 8px)",
                            padding: "6px 10px",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                        title="Toggle temperature scale"
                    >
                        {isFahrenheit ? "°F" : "°C"}
                    </button>
                </div>
            </div>

            {/* Current Metrics Card */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "20px",
                alignItems: "center",
                padding: "16px 20px",
                background: "rgba(255, 255, 255, 0.04)",
                borderRadius: "var(--r-md, 12px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                marginBottom: "18px"
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "42px", lineHeight: 1 }}>{weather.icon}</div>
                    <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "6px", fontFamily: "var(--font-mono, monospace)" }}>
                        {convertTemp(weather.temp)}
                    </div>
                </div>

                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>{weather.condition}</span>
                        <span style={{
                            fontSize: "11px",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            background: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`,
                            fontWeight: 600
                        }}>
                            {weather.trekStatus} Trail Conditions
                        </span>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                        gap: "8px",
                        fontSize: "12px",
                        color: "var(--stone, #cfc7b6)",
                        marginTop: "8px"
                    }}>
                        <div>🏔️ <strong>Elevation:</strong> {weather.elevation}</div>
                        <div>💧 <strong>Humidity:</strong> {weather.humidity}%</div>
                        <div>💨 <strong>Wind:</strong> {weather.windSpeed} km/h</div>
                        <div>☀️ <strong>UV Index:</strong> {weather.uvIndex}</div>
                    </div>
                </div>
            </div>

            {/* Trekker Advisory Note */}
            <div style={{
                padding: "10px 14px",
                background: "rgba(217, 95, 36, 0.1)",
                borderLeft: "3px solid #d95f24",
                borderRadius: "0 8px 8px 0",
                fontSize: "12px",
                color: "#f4efe5",
                lineHeight: 1.5,
                marginBottom: "18px"
            }}>
                <strong style={{ color: "#d95f24" }}>Trail Advisory: </strong>
                {weather.advisory}
            </div>

            {/* 4-Day Forecast Grid */}
            <div>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--stone, #cfc7b6)", marginBottom: "8px", fontWeight: 600 }}>
                    4-Day Mountain Outlook
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px"
                }}>
                    {weather.forecast.map((f, i) => (
                        <div key={i} style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            borderRadius: "var(--r-sm, 8px)",
                            padding: "10px 8px",
                            textAlign: "center"
                        }}>
                            <div style={{ fontSize: "11px", color: "var(--stone, #cfc7b6)", marginBottom: "4px" }}>{f.day}</div>
                            <div style={{ fontSize: "20px", marginBottom: "4px" }}>{f.icon}</div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{convertTemp(f.temp)}</div>
                            <div style={{ fontSize: "10px", color: "var(--ice, #8fbac9)", marginTop: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {f.condition}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}