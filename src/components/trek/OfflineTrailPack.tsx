"use client";

import { useEffect, useState } from "react";
import type { Trek } from "@/lib/types";

interface OfflineTrailPackProps {
    trek: Trek;
}

const DEFAULT_PACKING_ITEMS = [
    { id: "permit", label: "Arunachal ILP / PAP physical printed copies (x3)", category: "Permits" },
    { id: "id_proof", label: "Original Government Photo ID (Aadhar/Passport)", category: "Permits" },
    { id: "boots", label: "Broken-in waterproof trekking boots with ankle support", category: "Footwear" },
    { id: "socks", label: "Merino wool or moisture-wicking socks (4 pairs)", category: "Clothing" },
    { id: "thermal", label: "Thermal base layers (top & bottom)", category: "Clothing" },
    { id: "fleece", label: "Warm mid-layer fleece or down jacket", category: "Clothing" },
    { id: "raincoat", label: "Windproof & waterproof rain jacket / poncho", category: "Clothing" },
    { id: "headlamp", label: "Headlamp with extra batteries (cold drains batteries fast)", category: "Gear" },
    { id: "meds", label: "Personal medical kit (Diamox, band-aids, ORS, pain relief)", category: "Medical" },
    { id: "powerbank", label: "High-capacity power bank (20,000 mAh)", category: "Gear" },
    { id: "bottle", label: "Insulated water bottle & water purification tablets", category: "Hydration" },
];

export default function OfflineTrailPack({ trek }: OfflineTrailPackProps) {
    const [saved, setSaved] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [showChecklist, setShowChecklist] = useState(false);

    const storageKey = `trail_pack_${trek.slug}`;
    const checklistKey = `packing_check_${trek.slug}`;

    useEffect(() => {
        try {
            if (localStorage.getItem(storageKey)) {
                setSaved(true);
            }
            const savedChecklist = localStorage.getItem(checklistKey);
            if (savedChecklist) {
                setCheckedItems(JSON.parse(savedChecklist));
            }
        } catch {
            // ignore
        }
    }, [trek.slug, storageKey, checklistKey]);

    const handleSaveOffline = () => {
        try {
            const packData = {
                slug: trek.slug,
                name: trek.name,
                days: trek.days,
                altitude: trek.altitude,
                itinerary: trek.itinerary,
                included: trek.included,
                savedAt: new Date().toISOString(),
            };
            localStorage.setItem(storageKey, JSON.stringify(packData));
            setSaved(true);
        } catch (err) {
            console.error("Failed to save offline pack:", err);
        }
    };

    const toggleCheckItem = (id: string) => {
        const next = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(next);
        try {
            localStorage.setItem(checklistKey, JSON.stringify(next));
        } catch {
            // ignore
        }
    };

    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const progressPct = Math.round((checkedCount / DEFAULT_PACKING_ITEMS.length) * 100);

    return (
        <div style={{
            background: "linear-gradient(135deg, #132130 0%, #0d1721 100%)",
            border: "1px solid rgba(243, 238, 228, 0.15)",
            borderRadius: "var(--r-lg, 16px)",
            padding: "24px",
            color: "#f4efe5",
            marginBottom: "32px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
        }}>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                marginBottom: "20px"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontSize: "32px" }}>📱</span>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <h3 style={{ margin: 0, fontSize: "18px", color: "#fff", fontFamily: "var(--font-serif)" }}>
                                Offline Trail Pack & Checklist
                            </h3>
                            {saved && (
                                <span style={{
                                    fontSize: "10px",
                                    background: "rgba(63, 143, 95, 0.2)",
                                    color: "#4ade80",
                                    border: "1px solid #4ade80",
                                    padding: "2px 8px",
                                    borderRadius: "10px",
                                    fontWeight: 700
                                }}>
                                    ✓ Saved Offline
                                </span>
                            )}
                        </div>
                        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--stone, #cfc7b6)" }}>
                            Heading to remote passes with no phone reception? Save this route and pack with confidence.
                        </p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                        type="button"
                        onClick={handleSaveOffline}
                        style={{
                            background: saved ? "rgba(255,255,255,0.08)" : "var(--flare, #d95f24)",
                            color: "#fff",
                            border: `1px solid ${saved ? "rgba(255,255,255,0.2)" : "#d95f24"}`,
                            borderRadius: "var(--r-pill, 999px)",
                            padding: "9px 20px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <span>{saved ? "✓" : "📥"}</span>
                        <span>{saved ? "Trail Pack Saved" : "Save Trail Pack Offline"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowChecklist(!showChecklist)}
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: "var(--r-pill, 999px)",
                            padding: "9px 18px",
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <span>🎒</span>
                        <span>{showChecklist ? "Hide Checklist" : `Packing Checklist (${checkedCount}/${DEFAULT_PACKING_ITEMS.length})`}</span>
                    </button>
                </div>
            </div>

            {/* Interactive Offline Packing Checklist Drawer */}
            {showChecklist && (
                <div style={{
                    marginTop: "16px",
                    paddingTop: "20px",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    animation: "fadeIn 0.2s ease-out"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "12px", color: "var(--stone, #cfc7b6)", fontWeight: 600 }}>
                            Rucksack Readiness: {progressPct}% Packed
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--ice, #8fbac9)" }}>
                            Auto-saved to device
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden", marginBottom: "16px" }}>
                        <div style={{ width: `${progressPct}%`, height: "100%", background: progressPct === 100 ? "#4ade80" : "#d95f24", transition: "width 0.3s ease" }} />
                    </div>

                    {/* Checklist Items */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "8px" }}>
                        {DEFAULT_PACKING_ITEMS.map((item) => {
                            const isChecked = Boolean(checkedItems[item.id]);
                            return (
                                <label
                                    key={item.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "10px",
                                        padding: "8px 12px",
                                        background: isChecked ? "rgba(63, 143, 95, 0.1)" : "rgba(255,255,255,0.03)",
                                        border: `1px solid ${isChecked ? "rgba(63, 143, 95, 0.3)" : "rgba(255,255,255,0.06)"}`,
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        color: isChecked ? "#a7f3d0" : "#f4efe5",
                                        userSelect: "none"
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleCheckItem(item.id)}
                                        style={{ accentColor: "#d95f24", marginTop: "2px" }}
                                    />
                                    <span style={{ textDecoration: isChecked ? "line-through" : "none", lineHeight: 1.4 }}>
                                        {item.label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
