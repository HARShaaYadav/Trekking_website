"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { treks } from "@/data/treks";

interface SavedPack {
    slug: string;
    name: string;
    savedAt: string;
}

export default function OfflinePage() {
    const [savedPacks, setSavedPacks] = useState<SavedPack[]>([]);

    useEffect(() => {
        try {
            const saved: SavedPack[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("trail_pack_")) {
                    const data = JSON.parse(localStorage.getItem(key) || "{}");
                    saved.push({
                        slug: data.slug,
                        name: data.name,
                        savedAt: data.savedAt,
                    });
                }
            }
            setSavedPacks(saved);
        } catch {
            // ignore
        }
    }, []);

    return (
        <div style={{ paddingTop: "var(--header-h, 78px)", minHeight: "100vh", background: "var(--night, #0d1721)", color: "#f4efe5" }}>
            <div className="wrap" style={{ padding: "40px 20px 80px 20px", maxWidth: "900px" }}>
                {/* Offline Warning Banner */}
                <div style={{
                    background: "rgba(176, 64, 47, 0.15)",
                    border: "1px solid #b0402f",
                    borderRadius: "var(--r-lg, 16px)",
                    padding: "24px",
                    marginBottom: "36px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px"
                }}>
                    <span style={{ fontSize: "42px" }}>🏔️</span>
                    <div>
                        <span style={{
                            fontSize: "11px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#f87171",
                            fontWeight: 700
                        }}>
                            Cellular Signal Disconnected
                        </span>
                        <h1 style={{ margin: "4px 0 6px 0", fontSize: "24px", color: "#fff", fontFamily: "var(--font-serif)" }}>
                            You are in Mountain Offline Mode
                        </h1>
                        <p style={{ margin: 0, fontSize: "14px", color: "#fca5a5" }}>
                            Arunachal Pradesh valleys often have zero mobile connectivity. Your saved trail packs and vital survival guidelines remain available below.
                        </p>
                    </div>
                </div>

                {/* Saved Offline Packs Section */}
                <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", color: "#fff", margin: 0 }}>
                            Saved Trail Packs on this Device ({savedPacks.length})
                        </h2>
                    </div>

                    {savedPacks.length === 0 ? (
                        <div style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            padding: "24px",
                            textAlign: "center",
                            fontSize: "13px",
                            color: "var(--stone, #cfc7b6)"
                        }}>
                            <p style={{ margin: "0 0 12px 0" }}>No trail packs saved offline yet.</p>
                            <p style={{ margin: 0, fontSize: "12px" }}>
                                When you have internet, visit any trek page (e.g. Sangestar Tso or Seven Lakes) and click <strong>&quot;Save Trail Pack for Offline Use&quot;</strong> to store it here.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                            {savedPacks.map((pack) => (
                                <div
                                    key={pack.slug}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.12)",
                                        borderRadius: "12px",
                                        padding: "16px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: "15px", color: "#fff" }}>{pack.name}</h3>
                                        <span style={{ fontSize: "11px", color: "var(--stone, #cfc7b6)" }}>Saved: {new Date(pack.savedAt).toLocaleDateString()}</span>
                                    </div>
                                    <Link
                                        href={`/treks/${pack.slug}`}
                                        style={{
                                            background: "var(--flare, #d95f24)",
                                            color: "#fff",
                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                            textDecoration: "none"
                                        }}
                                    >
                                        Open Pack →
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Emergency & SOS Contacts */}
                <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "var(--r-lg, 16px)",
                    padding: "24px",
                    marginBottom: "36px"
                }}>
                    <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", color: "#fff", marginTop: 0, marginBottom: "16px" }}>
                        🚨 Arunachal Mountain Emergency & SOS Numbers
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", fontSize: "13px" }}>
                        <div style={{ background: "rgba(0,0,0,0.25)", padding: "14px", borderRadius: "10px" }}>
                            <strong style={{ display: "block", color: "var(--flare, #d95f24)", marginBottom: "4px" }}>Emergency Police & Medical</strong>
                            <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>112</div>
                            <span style={{ fontSize: "11px", color: "var(--stone, #cfc7b6)" }}>National Unified Emergency Helpline</span>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.25)", padding: "14px", borderRadius: "10px" }}>
                            <strong style={{ display: "block", color: "var(--flare, #d95f24)", marginBottom: "4px" }}>State Disaster Management (SDMA)</strong>
                            <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>1070</div>
                            <span style={{ fontSize: "11px", color: "var(--stone, #cfc7b6)" }}>Itanagar Control Room</span>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.25)", padding: "14px", borderRadius: "10px" }}>
                            <strong style={{ display: "block", color: "var(--flare, #d95f24)", marginBottom: "4px" }}>ITBP Mountain Rescue Base</strong>
                            <div style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono, monospace)" }}>03778-222223</div>
                            <span style={{ fontSize: "11px", color: "var(--stone, #cfc7b6)" }}>High Altitude Sector Command</span>
                        </div>
                    </div>
                </div>

                {/* Altitude Sickness (AMS) Protocol */}
                <div style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "var(--r-lg, 16px)",
                    padding: "24px"
                }}>
                    <h2 style={{ fontSize: "20px", fontFamily: "var(--font-serif)", color: "#fff", marginTop: 0, marginBottom: "12px" }}>
                        ⚕️ Acute Mountain Sickness (AMS) Field Protocol
                    </h2>
                    <div style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--stone, #cfc7b6)" }}>
                        <p style={{ margin: "0 0 10px 0" }}>
                            When ascending above 2,500m (8,200 ft), altitude sickness can develop rapidly if acclimatization pacing is rushed.
                        </p>
                        <ul style={{ margin: 0, paddingLeft: "20px" }}>
                            <li><strong>Early Warning Signs:</strong> Throbbing headache, loss of appetite, dizziness, fatigue, disturbed sleep.</li>
                            <li><strong>Golden Rule 1:</strong> Any sickness at altitude is AMS until proven otherwise. Never ascend with symptoms.</li>
                            <li><strong>Golden Rule 2:</strong> If symptoms worsen or persist despite rest, descend immediately (minimum 500m / 1,600 ft).</li>
                            <li><strong>Hydration:</strong> Drink 3 to 4 liters of clean, warm water daily. Avoid alcohol and sedatives.</li>
                        </ul>
                    </div>
                </div>

                <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <Link
                        href="/"
                        style={{
                            display: "inline-block",
                            background: "rgba(255,255,255,0.08)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "var(--r-pill, 999px)",
                            padding: "10px 24px",
                            fontSize: "13px",
                            fontWeight: 600,
                            textDecoration: "none"
                        }}
                    >
                        ← Return to Main Page
                    </Link>
                </div>
            </div>
        </div>
    );
}
