import type { Metadata } from "next";
import Link from "next/link";
import WeatherWidget from "@/components/WeatherWidget";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Mountain Weather & Seasonal Forecasts — Arunachal Pradesh",
    description: "Check live temperatures, altitude microclimates, 4-day forecasts, and seasonal trekking conditions across Tawang, Ziro, Anini, and Anjaw.",
    path: "/weather",
});

const REGIONS = [
    {
        id: "tawang",
        title: "Tawang & High Himalayas",
        altitude: "3,048 m – 4,868 m",
        temp: "11°C",
        condition: "Crisp Alpine Clear",
        icon: "☀️",
        advisory: "Clear early mornings. Afternoon mist around Sela Pass and high lakes. Sub-zero night temperatures at higher camps.",
        bestMonths: "Apr – Jun, Sep – Nov",
        treks: [
            { name: "Sangestar Tso Loop", slug: "sangestar-tso-madhuri-lake-loop", days: "2 Days" },
            { name: "Gorichen Base Camp", slug: "gorichen-base-camp-trek", days: "10 Days" },
        ],
    },
    {
        id: "ziro",
        title: "Ziro & Talle Valley",
        altitude: "1,560 m – 2,745 m",
        temp: "18°C",
        condition: "Mild Valley Breeze",
        icon: "⛅",
        advisory: "Comfortable rainforest temperatures. Dry trails through giant bamboo forests and Apatani villages.",
        bestMonths: "Oct – Apr",
        treks: [
            { name: "Talle Valley Trek", slug: "talle-valley-trek", days: "6 Days" },
        ],
    },
    {
        id: "anini",
        title: "Anini & Seven Lakes",
        altitude: "1,968 m – 4,000 m",
        temp: "8°C",
        condition: "Subalpine Cool",
        icon: "🌤️",
        advisory: "Glacial valley winds above 3,200m. Nights hover near 0°C. Quality 4-season down gear required.",
        bestMonths: "May – Oct",
        treks: [
            { name: "Seven Lakes Trek", slug: "seven-lakes-trek-anini", days: "11 Days" },
        ],
    },
    {
        id: "anjaw",
        title: "Dong Valley & Eastern Frontier",
        altitude: "1,240 m – 2,200 m",
        temp: "15°C",
        condition: "Dawn Sun & Crisp Air",
        icon: "🌅",
        advisory: "Pre-dawn hike temperatures reach 4°C at the sunrise crest. Daytime heats pleasantly to 19°C.",
        bestMonths: "Nov – Apr",
        treks: [
            { name: "Dong Valley Sunrise Trek", slug: "dong-valley-sunrise-trek", days: "3 Days" },
        ],
    },
    {
        id: "west-kameng",
        title: "Dirang & The Bailey Trail",
        altitude: "1,560 m – 4,980 m",
        temp: "9°C",
        condition: "Pass Breeze",
        icon: "🏔️",
        advisory: "Tse La Pass is clear of heavy snow. Early departures recommended to cross passes before afternoon cloud buildup.",
        bestMonths: "Apr – Jun, Sep – Oct",
        treks: [
            { name: "The Bailey Trail Trek", slug: "bailey-trail-trek", days: "10 Days" },
        ],
    },
];

export default function WeatherPage() {
    return (
        <div style={{ paddingTop: "var(--header-h, 78px)", minHeight: "100vh", background: "var(--night, #0d1721)", color: "#f4efe5" }}>
            <div className="wrap" style={{ padding: "40px 20px 80px 20px" }}>
                {/* Header */}
                <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 40px auto" }}>
                    <div style={{
                        fontSize: "12px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--flare, #d95f24)",
                        fontWeight: 700,
                        marginBottom: "8px"
                    }}>
                        Himalayan Meteorological Station
                    </div>
                    <h1 style={{
                        fontSize: "clamp(30px, 4.5vw, 48px)",
                        fontFamily: "var(--font-serif)",
                        color: "#fff",
                        lineHeight: 1.15,
                        margin: "0 0 16px 0"
                    }}>
                        Arunachal Mountain Weather & Forecasts
                    </h1>
                    <p style={{ fontSize: "16px", color: "var(--stone, #cfc7b6)", lineHeight: 1.6 }}>
                        Track real-time temperature, altitude microclimates, 4-day forecasts, and seasonal trail conditions across every trekking region in Arunachal Pradesh.
                    </p>
                </div>

                {/* Main Interactive Weather Widget Station */}
                <div style={{ maxWidth: "880px", margin: "0 auto 50px auto" }}>
                    <WeatherWidget location="tawang" />
                </div>

                {/* All Districts at a Glance */}
                <div style={{ marginBottom: "60px" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--flare, #d95f24)", fontWeight: 700 }}>
                            Regional Microclimates
                        </span>
                        <h2 style={{ fontSize: "24px", color: "#fff", fontFamily: "var(--font-serif)", margin: "4px 0 0 0" }}>
                            Current District Conditions Across the State
                        </h2>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "20px"
                    }}>
                        {REGIONS.map((reg) => (
                            <div
                                key={reg.id}
                                style={{
                                    background: "rgba(255, 255, 255, 0.03)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    borderRadius: "var(--r-lg, 16px)",
                                    padding: "24px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between"
                                }}
                            >
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                        <div>
                                            <span style={{ fontSize: "11px", color: "var(--ice, #8fbac9)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                                                {reg.altitude}
                                            </span>
                                            <h3 style={{ margin: "2px 0 0 0", fontSize: "18px", color: "#fff", fontFamily: "var(--font-serif)" }}>
                                                {reg.title}
                                            </h3>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <span style={{ fontSize: "28px", lineHeight: 1 }}>{reg.icon}</span>
                                            <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono, monospace)" }}>
                                                {reg.temp}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        fontSize: "12px",
                                        background: "rgba(255,255,255,0.04)",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        color: "#f4efe5",
                                        marginBottom: "14px",
                                        lineHeight: 1.5
                                    }}>
                                        <strong style={{ color: "var(--flare, #d95f24)" }}>Condition: </strong>
                                        {reg.condition}. {reg.advisory}
                                    </div>

                                    <div style={{ fontSize: "12px", color: "var(--stone, #cfc7b6)", marginBottom: "14px" }}>
                                        <strong>Prime Trekking Window:</strong> {reg.bestMonths}
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px" }}>
                                    <span style={{ fontSize: "11px", color: "var(--stone, #cfc7b6)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>
                                        Signature Trails in this Region:
                                    </span>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                        {reg.treks.map((trk) => (
                                            <Link
                                                key={trk.slug}
                                                href={`/treks/${trk.slug}`}
                                                style={{
                                                    background: "rgba(217, 95, 36, 0.15)",
                                                    color: "#f4efe5",
                                                    border: "1px solid rgba(217, 95, 36, 0.3)",
                                                    borderRadius: "14px",
                                                    padding: "4px 10px",
                                                    fontSize: "11px",
                                                    textDecoration: "none",
                                                    fontWeight: 600
                                                }}
                                            >
                                                {trk.name} ({trk.days}) →
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seasonal Trekking Breakdown */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "var(--r-lg, 16px)",
                    padding: "32px",
                    marginBottom: "40px"
                }}>
                    <h2 style={{ fontSize: "22px", color: "#fff", fontFamily: "var(--font-serif)", marginTop: 0, marginBottom: "16px" }}>
                        Arunachal Seasonal Trekking Calendar
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", fontSize: "13px", lineHeight: 1.6, color: "var(--stone, #cfc7b6)" }}>
                        <div>
                            <h3 style={{ color: "#fff", fontSize: "15px", margin: "0 0 8px 0" }}>🌸 Spring (April – June)</h3>
                            <p style={{ margin: 0 }}>
                                Rhododendrons, magnolias and orchids in bloom across Tawang, Dirang and Ziro. Mild daytime temperatures (12°C to 20°C) with occasional pre-monsoon showers. High passes begin opening.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ color: "#fff", fontSize: "15px", margin: "0 0 8px 0" }}>🍂 Autumn (September – November)</h3>
                            <p style={{ margin: 0 }}>
                                The premier high-altitude trekking season. Post-monsoon blue skies, crisp visibility of snow massifs like Gorichen and Kangto, and dry trails. Nights get chilly close to freezing above 3,500m.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ color: "#fff", fontSize: "15px", margin: "0 0 8px 0" }}>❄️ Winter (December – March)</h3>
                            <p style={{ margin: 0 }}>
                                High passes close under deep snow, but low-to-mid elevation routes like Dong Valley sunrise and Ziro valley cultural walks shine with crystal-clear morning light and festive local celebrations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <div style={{ textAlign: "center" }}>
                    <Link
                        href="/treks"
                        style={{
                            display: "inline-block",
                            background: "var(--flare, #d95f24)",
                            color: "#fff",
                            padding: "11px 24px",
                            borderRadius: "var(--r-pill, 999px)",
                            fontSize: "14px",
                            fontWeight: 700,
                            textDecoration: "none",
                            boxShadow: "var(--shadow-glow)"
                        }}
                    >
                        Browse All Treks with Weather Conditions →
                    </Link>
                </div>
            </div>
        </div>
    );
}
