"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { treks } from "@/data/treks";
import WhatsAppButton from "@/components/WhatsAppButton";

interface MapPin {
    slug: string;
    name: string;
    x: number; // percentage coordinates on Arunachal map
    y: number;
    altitude: string;
    days: number;
    grade: string;
    region: string;
    highlights: string[];
    price: string;
    image: string;
    summary: string;
}

const MAP_PINS: MapPin[] = [
    {
        slug: "sangestar-tso-madhuri-lake-loop",
        name: "Sangestar Tso (Madhuri Lake)",
        x: 18,
        y: 42,
        altitude: "12,165 ft / 3,708 m",
        days: 2,
        grade: "Easy to Moderate",
        region: "Tawang District",
        highlights: ["Submerged tree trunks", "High alpine pass", "Monpa monasteries"],
        price: "$240",
        image: "/Sangester.png",
        summary: "Scenic lakeside walk amidst high Himalayan peaks, accessible from historic Tawang.",
    },
    {
        slug: "gorichen-base-camp-trek",
        name: "Gorichen Base Camp Trek",
        x: 23,
        y: 30,
        altitude: "15,970 ft / 4,868 m",
        days: 10,
        grade: "Difficult",
        region: "Tawang / Gorichen Massif",
        highlights: ["Arunachal's highest massif", "Glacial moraines", "Remote Mago valley"],
        price: "$1,450",
        image: "/Gorichen.png",
        summary: "Demanding high-altitude expedition beneath Arunachal's most dramatic peak.",
    },
    {
        slug: "bailey-trail-trek",
        name: "The Bailey Trail",
        x: 26,
        y: 60,
        altitude: "16,338 ft / 4,980 m",
        days: 10,
        grade: "Difficult",
        region: "West Kameng",
        highlights: ["Historic British trail", "Tse La Pass crossing", "Ancient Monpa villages"],
        price: "$1,350",
        image: "/BaileyTrek.png",
        summary: "Historic trans-Himalayan trail following early explorer routes between Dirang and Tawang.",
    },
    {
        slug: "talle-valley-trek",
        name: "Talle Valley Wildlife Trek",
        x: 48,
        y: 64,
        altitude: "9,000 ft / 2,745 m",
        days: 6,
        grade: "Easy",
        region: "Lower Subansiri (Ziro)",
        highlights: ["Giant bamboo groves", "Apatani cultural landscape", "Pange river sanctuary"],
        price: "$620",
        image: "/Ziro.png",
        summary: "Enchanting temperate rainforest and rich Apatani tribal heritage near Ziro.",
    },
    {
        slug: "seven-lakes-trek-anini",
        name: "Seven Lakes of Anini",
        x: 75,
        y: 34,
        altitude: "13,100 ft / 4,000 m",
        days: 11,
        grade: "Challenging",
        region: "Dibang Valley",
        highlights: ["7 crystal alpine tarns", "Idu Mishmi wilderness", "Untouched glacial ridges"],
        price: "$1,250",
        image: "/anini.png",
        summary: "Expedition into India's most remote alpine chain nestled high in the Mishmi Hills.",
    },
    {
        slug: "dong-valley-sunrise-trek",
        name: "Dong Valley Sunrise Trek",
        x: 90,
        y: 52,
        altitude: "5,500 ft / 1,676 m",
        days: 3,
        grade: "Moderate",
        region: "Anjaw District",
        highlights: ["First sunrise in India", "Lohit River confluence", "Eastern border ridges"],
        price: "$390",
        image: "/DongValley.png",
        summary: "Pre-dawn hike to catch India's very first rays of dawn over the tri-junction peaks.",
    },
];

export default function InteractiveArunachalMap() {
    const [selectedPin, setSelectedPin] = useState<MapPin | null>(MAP_PINS[0]);
    const [difficultyFilter, setDifficultyFilter] = useState<string>("All");

    const filteredPins = MAP_PINS.filter((pin) => {
        if (difficultyFilter === "All") return true;
        if (difficultyFilter === "Easy") return pin.grade.toLowerCase().includes("easy");
        if (difficultyFilter === "Moderate") return pin.grade.toLowerCase().includes("moderate");
        if (difficultyFilter === "Difficult") return pin.grade.toLowerCase().includes("difficult") || pin.grade.toLowerCase().includes("challenging");
        return true;
    });

    const getGradeColor = (grade: string) => {
        const lower = grade.toLowerCase();
        if (lower.includes("easy")) return "#3f8f5f"; // green
        if (lower.includes("moderate")) return "#f59e0b"; // amber
        return "#d95f24"; // orange/red
    };

    return (
        <div style={{
            background: "var(--night, #0d1721)",
            borderRadius: "var(--r-xl, 22px)",
            padding: "24px",
            color: "#f4efe5",
            border: "1px solid var(--line, rgba(243, 238, 228, 0.14))",
            boxShadow: "var(--shadow-xl)"
        }}>
            {/* Header & Controls */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "18px"
            }}>
                <div>
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--flare, #d95f24)", fontWeight: 700 }}>
                        Interactive Expedition Atlas
                    </span>
                    <h2 style={{ margin: "4px 0 0 0", fontSize: "24px", fontFamily: "var(--font-serif)", color: "#fff" }}>
                        Trail Map of Arunachal Pradesh
                    </h2>
                    <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--stone, #cfc7b6)" }}>
                        Click on any route pin or trail marker to explore route details, elevation, and terrain.
                    </p>
                </div>

                {/* Difficulty Filter */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--stone, #cfc7b6)" }}>Difficulty:</span>
                    {["All", "Easy", "Moderate", "Difficult"].map((diff) => (
                        <button
                            key={diff}
                            type="button"
                            onClick={() => setDifficultyFilter(diff)}
                            style={{
                                background: difficultyFilter === diff ? "var(--flare, #d95f24)" : "rgba(255,255,255,0.06)",
                                color: "#fff",
                                border: `1px solid ${difficultyFilter === diff ? "#d95f24" : "rgba(255,255,255,0.12)"}`,
                                borderRadius: "var(--r-pill, 999px)",
                                padding: "6px 14px",
                                fontSize: "12px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Interactive Map Stage */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr minmax(320px, 380px)",
                gap: "24px",
                alignItems: "start",
            }}>
                {/* Visual Map Canvas / SVG */}
                <div style={{
                    position: "relative",
                    background: "radial-gradient(ellipse at 60% 40%, #17283c 0%, #0d1721 100%)",
                    borderRadius: "var(--r-lg, 16px)",
                    minHeight: "460px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    overflow: "hidden",
                    padding: "20px"
                }}>
                    {/* Stylized Topographic Contours / District Outlines */}
                    <svg
                        viewBox="0 0 1000 600"
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            opacity: 0.6
                        }}
                    >
                        <defs>
                            <linearGradient id="trailGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#d95f24" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                            </linearGradient>
                            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                            </pattern>
                        </defs>

                        {/* Topo Grid */}
                        <rect width="1000" height="600" fill="url(#gridPattern)" />

                        {/* Mountain Ridge Lines / Terrain Stylization */}
                        {/* Western Himalayas (Tawang / Kameng) */}
                        <path d="M 80,180 Q 180,120 280,220 T 360,340" fill="none" stroke="rgba(143, 186, 201, 0.2)" strokeWidth="2" strokeDasharray="4,4" />
                        <path d="M 120,260 Q 220,200 320,380" fill="none" stroke="rgba(143, 186, 201, 0.15)" strokeWidth="1.5" />
                        {/* Central Subansiri Valleys */}
                        <path d="M 360,340 Q 480,280 580,380" fill="none" stroke="rgba(143, 186, 201, 0.2)" strokeWidth="2" strokeDasharray="4,4" />
                        {/* Eastern Dibang & Mishmi Hills */}
                        <path d="M 640,160 Q 750,220 850,280 T 940,380" fill="none" stroke="rgba(143, 186, 201, 0.2)" strokeWidth="2" strokeDasharray="4,4" />
                        <path d="M 700,240 Q 820,320 920,440" fill="none" stroke="rgba(143, 186, 201, 0.15)" strokeWidth="1.5" />

                        {/* Connecting Trek Trail Lines */}
                        <path
                            d="M 180,252 L 230,180 L 260,360 L 480,384 L 750,204 L 900,312"
                            fill="none"
                            stroke="url(#trailGlow)"
                            strokeWidth="2.5"
                            strokeDasharray="6,6"
                        />

                        {/* District Labels */}
                        <text x="130" y="440" fill="rgba(255,255,255,0.25)" fontSize="14" fontWeight="600" letterSpacing="2">TAWANG</text>
                        <text x="210" y="520" fill="rgba(255,255,255,0.25)" fontSize="14" fontWeight="600" letterSpacing="2">WEST KAMENG</text>
                        <text x="430" y="540" fill="rgba(255,255,255,0.25)" fontSize="14" fontWeight="600" letterSpacing="2">ZIRO / SUBANSIRI</text>
                        <text x="700" y="420" fill="rgba(255,255,255,0.25)" fontSize="14" fontWeight="600" letterSpacing="2">DIBANG VALLEY</text>
                        <text x="840" y="520" fill="rgba(255,255,255,0.25)" fontSize="14" fontWeight="600" letterSpacing="2">ANJAW / DONG</text>
                    </svg>

                    {/* Compass Rose */}
                    <div style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        fontSize: "11px",
                        color: "var(--ice, #8fbac9)",
                        fontFamily: "var(--font-mono, monospace)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    }}>
                        <span style={{ fontSize: "16px" }}>🧭</span> N 27°35′ E 93°30′ · Eastern Himalaya
                    </div>

                    {/* Map Legend */}
                    <div style={{
                        position: "absolute",
                        bottom: "16px",
                        left: "16px",
                        background: "rgba(13, 23, 33, 0.8)",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        fontSize: "11px",
                        display: "flex",
                        gap: "12px",
                        backdropFilter: "blur(4px)"
                    }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3f8f5f", display: "inline-block" }} /> Easy
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} /> Moderate
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#d95f24", display: "inline-block" }} /> Difficult / Alpine
                        </span>
                    </div>

                    {/* Interactive Pins */}
                    {filteredPins.map((pin) => {
                        const isSelected = selectedPin?.slug === pin.slug;
                        const gradeColor = getGradeColor(pin.grade);

                        return (
                            <div
                                key={pin.slug}
                                onClick={() => setSelectedPin(pin)}
                                style={{
                                    position: "absolute",
                                    left: `${pin.x}%`,
                                    top: `${pin.y}%`,
                                    transform: "translate(-50%, -50%)",
                                    cursor: "pointer",
                                    zIndex: isSelected ? 10 : 2,
                                }}
                                title={pin.name}
                            >
                                {/* Pulsating Ring on Selected */}
                                {isSelected && (
                                    <div style={{
                                        position: "absolute",
                                        inset: "-10px",
                                        borderRadius: "50%",
                                        border: `2px solid ${gradeColor}`,
                                        animation: "pulse 2s infinite",
                                        pointerEvents: "none"
                                    }} />
                                )}

                                {/* Pin Body */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    background: isSelected ? "#fff" : "rgba(19, 33, 48, 0.9)",
                                    color: isSelected ? "var(--night, #0d1721)" : "#fff",
                                    padding: "6px 10px",
                                    borderRadius: "20px",
                                    border: `2px solid ${gradeColor}`,
                                    boxShadow: isSelected ? "0 0 20px rgba(217, 95, 36, 0.6)" : "0 4px 12px rgba(0,0,0,0.4)",
                                    whiteSpace: "nowrap",
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    transition: "all 0.2s ease",
                                }}>
                                    <span style={{
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        background: gradeColor,
                                    }} />
                                    <span>{pin.name.split(" ")[0]}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected Trek Inspector Panel */}
                {selectedPin && (
                    <div style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "var(--r-lg, 16px)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div style={{ position: "relative", width: "100%", height: "180px" }}>
                            <Image
                                src={selectedPin.image}
                                alt={selectedPin.name}
                                fill
                                style={{ objectFit: "cover" }}
                            />
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(13,23,33,0.95) 0%, transparent 60%)"
                            }} />
                            <span style={{
                                position: "absolute",
                                bottom: "12px",
                                left: "14px",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#fff",
                                background: getGradeColor(selectedPin.grade),
                                padding: "3px 10px",
                                borderRadius: "12px"
                            }}>
                                {selectedPin.grade} · {selectedPin.days} Days
                            </span>
                            <span style={{
                                position: "absolute",
                                bottom: "12px",
                                right: "14px",
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "#fff",
                                fontFamily: "var(--font-mono, monospace)"
                            }}>
                                {selectedPin.price}
                            </span>
                        </div>

                        <div style={{ padding: "20px" }}>
                            <div style={{ fontSize: "11px", color: "var(--ice, #8fbac9)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                                {selectedPin.region}
                            </div>
                            <h3 style={{ margin: "4px 0 10px 0", fontSize: "18px", fontFamily: "var(--font-serif)", color: "#fff" }}>
                                {selectedPin.name}
                            </h3>
                            <p style={{ fontSize: "13px", color: "var(--stone, #cfc7b6)", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                                {selectedPin.summary}
                            </p>

                            <div style={{
                                background: "rgba(0,0,0,0.2)",
                                borderRadius: "8px",
                                padding: "10px 12px",
                                fontSize: "12px",
                                marginBottom: "16px"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                    <span style={{ color: "var(--stone, #cfc7b6)" }}>Peak Altitude:</span>
                                    <strong style={{ color: "#fff" }}>{selectedPin.altitude}</strong>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "var(--stone, #cfc7b6)" }}>Duration:</span>
                                    <strong style={{ color: "#fff" }}>{selectedPin.days} Days Walking</strong>
                                </div>
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--stone, #cfc7b6)", marginBottom: "6px" }}>
                                    Key Trail Highlights:
                                </div>
                                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#f4efe5", lineHeight: 1.6 }}>
                                    {selectedPin.highlights.map((h, i) => (
                                        <li key={i}>{h}</li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <Link
                                    href={`/treks/${selectedPin.slug}`}
                                    style={{
                                        display: "block",
                                        textAlign: "center",
                                        background: "var(--flare, #d95f24)",
                                        color: "#fff",
                                        padding: "11px 16px",
                                        borderRadius: "var(--r-pill, 999px)",
                                        fontWeight: 600,
                                        fontSize: "13px",
                                        textDecoration: "none"
                                    }}
                                >
                                    Explore Route & Itinerary →
                                </Link>

                                <WhatsAppButton
                                    style="inline"
                                    trekName={selectedPin.name}
                                    days={selectedPin.days}
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
