"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const REGIONAL_CONDITIONS = [
    { name: "Tawang", temp: "11°C", icon: "☀️" },
    { name: "Ziro", temp: "18°C", icon: "⛅" },
    { name: "Anini", temp: "8°C", icon: "🌤️" },
    { name: "Dong", temp: "15°C", icon: "🌅" },
];

export default function WeatherHeaderBadge() {
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % REGIONAL_CONDITIONS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const current = REGIONAL_CONDITIONS[currentIdx];

    return (
        <Link
            href="/weather"
            className="weather-header-badge"
            title="View Live Mountain Weather Station & Forecasts"
        >
            <span style={{ fontSize: "14px", lineHeight: 1 }}>{current.icon}</span>
            <span style={{ fontWeight: 600 }}>{current.name}</span>
            <span style={{ opacity: 0.85, fontFamily: "var(--font-mono, monospace)" }}>{current.temp}</span>
            <span style={{ fontSize: "10px", opacity: 0.6, marginLeft: "2px" }}>☁️</span>
        </Link>
    );
}
