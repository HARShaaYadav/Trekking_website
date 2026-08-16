import type { Metadata } from "next";
import InteractiveArunachalMap from "@/components/map/InteractiveArunachalMap";
import WeatherWidget from "@/components/WeatherWidget";
import { treks } from "@/data/treks";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Interactive Trail Atlas & Map — Arunachal Pradesh",
    description: "Explore the wild trails, passes and high-altitude lakes of Arunachal Pradesh on our interactive topographic expedition map.",
    path: "/map",
});

export default function MapPage() {
    return (
        <div style={{ paddingTop: "var(--header-h, 78px)", minHeight: "100vh", background: "var(--night, #0d1721)" }}>
            <div className="wrap" style={{ padding: "40px 20px 80px 20px" }}>
                {/* Eyebrow & Headline */}
                <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 40px auto" }}>
                    <div style={{
                        fontSize: "12px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--flare, #d95f24)",
                        fontWeight: 700,
                        marginBottom: "8px"
                    }}>
                        Eastern Himalayan Topography
                    </div>
                    <h1 style={{
                        fontSize: "clamp(30px, 4.5vw, 48px)",
                        fontFamily: "var(--font-serif)",
                        color: "#fff",
                        lineHeight: 1.15,
                        margin: "0 0 16px 0"
                    }}>
                        Interactive Arunachal Trail Atlas
                    </h1>
                    <p style={{ fontSize: "16px", color: "var(--stone, #cfc7b6)", lineHeight: 1.6 }}>
                        Navigate through the high passes of Tawang, the deep subtropical rainforests of Ziro, and the raw glacial tarns of the Mishmi Hills in Dibang Valley.
                    </p>
                </div>

                {/* The Interactive Map Component */}
                <div style={{ marginBottom: "60px" }}>
                    <InteractiveArunachalMap />
                </div>

                {/* Regional Weather Grid */}
                <div style={{ marginBottom: "60px" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--flare, #d95f24)", fontWeight: 700 }}>
                            Real-Time Mountain Conditions
                        </span>
                        <h2 style={{ fontSize: "24px", color: "#fff", fontFamily: "var(--font-serif)", margin: "4px 0 0 0" }}>
                            Weather Across Arunachal Trekking Districts
                        </h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                        <WeatherWidget location="tawang" />
                        <WeatherWidget location="anini" />
                    </div>
                </div>

                {/* Trail Comparison Matrix */}
                <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "var(--r-lg, 16px)",
                    padding: "30px",
                    overflowX: "auto"
                }}>
                    <h3 style={{ color: "#fff", fontFamily: "var(--font-serif)", fontSize: "20px", marginTop: 0, marginBottom: "16px" }}>
                        Quick Route Elevation & Difficulty Comparison
                    </h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", color: "#f4efe5" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", textAlign: "left" }}>
                                <th style={{ padding: "12px 16px", color: "var(--ice, #8fbac9)" }}>Trek Name</th>
                                <th style={{ padding: "12px 16px", color: "var(--ice, #8fbac9)" }}>District</th>
                                <th style={{ padding: "12px 16px", color: "var(--ice, #8fbac9)" }}>Max Altitude</th>
                                <th style={{ padding: "12px 16px", color: "var(--ice, #8fbac9)" }}>Duration</th>
                                <th style={{ padding: "12px 16px", color: "var(--ice, #8fbac9)" }}>Grade</th>
                                <th style={{ padding: "12px 16px", color: "var(--ice, #8fbac9)" }}>Best Season</th>
                                <th style={{ padding: "12px 16px", textAlign: "right", color: "var(--ice, #8fbac9)" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {treks.map((t) => (
                                <tr key={t.slug} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#fff" }}>{t.name}</td>
                                    <td style={{ padding: "14px 16px", color: "var(--stone, #cfc7b6)" }}>{t.regionLabel}</td>
                                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono, monospace)" }}>{t.altitude}</td>
                                    <td style={{ padding: "14px 16px" }}>{t.days} Days</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{
                                            fontSize: "11px",
                                            padding: "3px 8px",
                                            borderRadius: "10px",
                                            background: t.grade.includes("Easy") ? "rgba(63,143,95,0.2)" : t.grade.includes("Moderate") ? "rgba(245,158,11,0.2)" : "rgba(217,95,36,0.2)",
                                            color: t.grade.includes("Easy") ? "#4ade80" : t.grade.includes("Moderate") ? "#fbbf24" : "#fb923c",
                                            fontWeight: 600
                                        }}>
                                            {t.grade}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 16px", color: "var(--stone, #cfc7b6)" }}>{t.bestMonths}</td>
                                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                        <Link
                                            href={`/treks/${t.slug}`}
                                            style={{
                                                color: "var(--flare, #d95f24)",
                                                textDecoration: "none",
                                                fontWeight: 600,
                                                fontSize: "12px"
                                            }}
                                        >
                                            View Route →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
