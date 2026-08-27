"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { treks } from "@/data/treks";
import type { Trek } from "@/lib/types";

interface QuestionStep {
    id: string;
    title: string;
    subtitle: string;
    options: {
        value: string;
        label: string;
        desc: string;
        icon: string;
    }[];
}

const STEPS: QuestionStep[] = [
    {
        id: "fitness",
        title: "What is your mountain trekking experience?",
        subtitle: "This ensures the trail pacing and elevation match your comfort level.",
        options: [
            {
                value: "beginner",
                label: "Beginner / Relaxed Hiker",
                desc: "Comfortable with 2-4 hours of easy to moderate walking with minimal steep ascents.",
                icon: "🚶",
            },
            {
                value: "moderate",
                label: "Regular Trekker",
                desc: "Accustomed to full-day hiking (5-6 hrs) and moderate elevation gain up to 3,000m.",
                icon: "🥾",
            },
            {
                value: "experienced",
                label: "Experienced Mountaineer",
                desc: "Thrive on remote alpine terrain, high pass crossings (4,000m+), and multi-day camping.",
                icon: "🏔️",
            },
        ],
    },
    {
        id: "duration",
        title: "How many days do you have in Arunachal Pradesh?",
        subtitle: "Keep in mind that internal travel in the mountains takes time.",
        options: [
            {
                value: "short",
                label: "Short Getaway (2 – 3 Days)",
                desc: "Quick, scenic mountain escape focused on a specific highlight.",
                icon: "⏱️",
            },
            {
                value: "medium",
                label: "Classic Trek (5 – 7 Days)",
                desc: "Balanced itinerary with forest camps, cultural immersion, and valley exploration.",
                icon: "📅",
            },
            {
                value: "expedition",
                label: "Deep Expedition (10 – 12 Days)",
                desc: "Immersive wilderness crossing high passes, remote lakes, and mountain ridges.",
                icon: "⛺",
            },
        ],
    },
    {
        id: "landscape",
        title: "What landscape stirs your imagination most?",
        subtitle: "Arunachal ranges from subtropical rainforests to glacier-carved tarns.",
        options: [
            {
                value: "lakes",
                label: "High Alpine Glacial Lakes",
                desc: "Crystal-clear tarns surrounded by prayer flags and snow-dusted peaks.",
                icon: "🌊",
            },
            {
                value: "forest",
                label: "Bamboo Rainforest & Tribal Heritage",
                desc: "Deep mossy woods, giant rhododendrons, and living Apatani/Monpa traditions.",
                icon: "🌲",
            },
            {
                value: "sunrise",
                label: "Golden Dawn & Historic Passes",
                desc: "Pre-dawn ridgeline ascents and historic trans-Himalayan wartime trails.",
                icon: "🌅",
            },
        ],
    },
];

export default function TrekRecommendationWizard() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [matchedResults, setMatchedResults] = useState<
        { trek: Trek; score: number; rationale: string }[] | null
    >(null);

    const handleSelectOption = (stepId: string, value: string) => {
        const nextAnswers = { ...answers, [stepId]: value };
        setAnswers(nextAnswers);

        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            calculateRecommendations(nextAnswers);
        }
    };

    const calculateRecommendations = (userAnswers: Record<string, string>) => {
        const results = treks.map((trek) => {
            let score = 50; // base score
            let rationale = "";

            // Fitness matching
            const gradeLower = trek.grade.toLowerCase();
            if (userAnswers.fitness === "beginner") {
                if (gradeLower.includes("easy")) {
                    score += 35;
                    rationale = "Perfect grade for beginners with comfortable daily walking distances and moderate altitude.";
                } else if (gradeLower.includes("moderate")) {
                    score += 15;
                    rationale = "Accessible for active beginners willing to take a steady mountain pace.";
                } else {
                    score -= 30;
                }
            } else if (userAnswers.fitness === "moderate") {
                if (gradeLower.includes("moderate") || gradeLower.includes("easy to moderate")) {
                    score += 35;
                    rationale = "Ideal balance of rewarding elevation and picturesque mountain trails.";
                } else if (gradeLower.includes("easy")) {
                    score += 20;
                } else {
                    score += 10;
                }
            } else if (userAnswers.fitness === "experienced") {
                if (gradeLower.includes("difficult") || gradeLower.includes("challenging")) {
                    score += 40;
                    rationale = "High-altitude expedition designed for seasoned trekkers looking for real wilderness adventure.";
                } else {
                    score += 10;
                }
            }

            // Duration matching
            if (userAnswers.duration === "short" && trek.days <= 4) {
                score += 30;
            } else if (userAnswers.duration === "medium" && trek.days >= 5 && trek.days <= 8) {
                score += 30;
            } else if (userAnswers.duration === "expedition" && trek.days >= 9) {
                score += 35;
            }

            // Landscape matching
            if (userAnswers.landscape === "lakes" && (trek.slug.includes("sangestar") || trek.slug.includes("seven-lakes"))) {
                score += 25;
            } else if (userAnswers.landscape === "forest" && trek.slug.includes("talle")) {
                score += 30;
            } else if (userAnswers.landscape === "sunrise" && (trek.slug.includes("dong") || trek.slug.includes("bailey"))) {
                score += 30;
            }

            score = Math.min(99, Math.max(35, score));

            if (!rationale) {
                rationale = `A captivating ${trek.days}-day route through ${trek.regionLabel} featuring authentic Himalayan hospitality.`;
            }

            return { trek, score, rationale };
        });

        results.sort((a, b) => b.score - a.score);
        setMatchedResults(results);
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentStepIndex(0);
        setMatchedResults(null);
    };

    const currentStep = STEPS[currentStepIndex];

    return (
        <div style={{
            background: "linear-gradient(145deg, #132130 0%, #0d1721 100%)",
            borderRadius: "var(--r-xl, 22px)",
            padding: "36px",
            color: "#f4efe5",
            border: "1px solid rgba(243, 238, 228, 0.15)",
            boxShadow: "var(--shadow-xl)"
        }}>
            {/* Header */}
            <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 30px auto" }}>
                <span style={{
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--flare, #d95f24)",
                    fontWeight: 700
                }}>
                    AI Trek Matcher
                </span>
                <h2 style={{
                    fontSize: "26px",
                    fontFamily: "var(--font-serif)",
                    color: "#fff",
                    margin: "6px 0 8px 0"
                }}>
                    Find Your Perfect Arunachal Trek
                </h2>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--stone, #cfc7b6)" }}>
                    Answer 3 quick preferences and our mountain matching engine will select the ideal route for your fitness, timeline, and landscape dreams.
                </p>
            </div>

            {/* Questions Step Flow */}
            {!matchedResults ? (
                <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                    {/* Progress indicator */}
                    <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
                        {STEPS.map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    flex: 1,
                                    height: "4px",
                                    borderRadius: "2px",
                                    background: idx <= currentStepIndex ? "var(--flare, #d95f24)" : "rgba(255,255,255,0.1)",
                                    transition: "background 0.3s ease"
                                }}
                            />
                        ))}
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <span style={{ fontSize: "12px", color: "var(--ice, #8fbac9)", fontWeight: 600 }}>
                            Step {currentStepIndex + 1} of {STEPS.length}
                        </span>
                        <h3 style={{ fontSize: "20px", color: "#fff", fontFamily: "var(--font-serif)", margin: "4px 0 4px 0" }}>
                            {currentStep.title}
                        </h3>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--stone, #cfc7b6)" }}>
                            {currentStep.subtitle}
                        </p>
                    </div>

                    {/* Options Cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {currentStep.options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelectOption(currentStep.id, opt.value)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                    padding: "18px 20px",
                                    background: "rgba(255, 255, 255, 0.04)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "var(--r-md, 12px)",
                                    color: "#fff",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = "#d95f24";
                                    e.currentTarget.style.background = "rgba(217, 95, 36, 0.08)";
                                    e.currentTarget.style.transform = "translateX(4px)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                                    e.currentTarget.style.transform = "translateX(0)";
                                }}
                            >
                                <span style={{ fontSize: "28px", lineHeight: 1 }}>{opt.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <strong style={{ display: "block", fontSize: "15px", marginBottom: "2px" }}>{opt.label}</strong>
                                    <span style={{ fontSize: "12px", color: "var(--stone, #cfc7b6)", lineHeight: 1.4 }}>{opt.desc}</span>
                                </div>
                                <span style={{ color: "var(--flare, #d95f24)", fontSize: "18px" }}>→</span>
                            </button>
                        ))}
                    </div>

                    {currentStepIndex > 0 && (
                        <button
                            type="button"
                            onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                            style={{
                                marginTop: "20px",
                                background: "none",
                                border: "none",
                                color: "var(--stone, #cfc7b6)",
                                fontSize: "13px",
                                cursor: "pointer",
                                padding: "6px 0"
                            }}
                        >
                            ← Back to previous question
                        </button>
                    )}
                </div>
            ) : (
                /* Results View */
                <div style={{ maxWidth: "840px", margin: "0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <span style={{ fontSize: "14px", color: "#4ade80", fontWeight: 700 }}>
                            ✓ Match Calculated Across All 6 Routes
                        </span>
                        <button
                            type="button"
                            onClick={handleReset}
                            style={{
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                color: "#f4efe5",
                                borderRadius: "var(--r-pill, 999px)",
                                padding: "6px 14px",
                                fontSize: "12px",
                                cursor: "pointer"
                            }}
                        >
                            🔄 Retake Quiz
                        </button>
                    </div>

                    {/* Top 1 Highlight Card */}
                    {matchedResults[0] && (
                        <div style={{
                            background: "rgba(217, 95, 36, 0.08)",
                            border: "2px solid #d95f24",
                            borderRadius: "var(--r-lg, 16px)",
                            padding: "24px",
                            marginBottom: "28px",
                            display: "grid",
                            gridTemplateColumns: "180px 1fr",
                            gap: "24px",
                            alignItems: "center"
                        }}>
                            <div style={{ position: "relative", width: "100%", height: "140px", borderRadius: "10px", overflow: "hidden" }}>
                                <Image
                                    src={matchedResults[0].trek.image}
                                    alt={matchedResults[0].trek.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                                <span style={{
                                    position: "absolute",
                                    top: "8px",
                                    left: "8px",
                                    background: "#d95f24",
                                    color: "#fff",
                                    fontSize: "11px",
                                    fontWeight: 800,
                                    padding: "2px 8px",
                                    borderRadius: "10px"
                                }}>
                                    {matchedResults[0].score}% MATCH
                                </span>
                            </div>

                            <div>
                                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ice, #8fbac9)", fontWeight: 700 }}>
                                    Your Top Recommendation
                                </span>
                                <h3 style={{ margin: "4px 0 6px 0", fontSize: "20px", color: "#fff", fontFamily: "var(--font-serif)" }}>
                                    {matchedResults[0].trek.name}
                                </h3>
                                <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#f4efe5", lineHeight: 1.5 }}>
                                    <strong>AI Insight:</strong> {matchedResults[0].rationale}
                                </p>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                                    <Link
                                        href={`/treks/${matchedResults[0].trek.slug}`}
                                        style={{
                                            background: "var(--flare, #d95f24)",
                                            color: "#fff",
                                            padding: "8px 18px",
                                            borderRadius: "var(--r-pill, 999px)",
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            textDecoration: "none"
                                        }}
                                    >
                                        View Full Route Details →
                                    </Link>
                                    <span style={{ fontSize: "12px", color: "var(--stone, #cfc7b6)" }}>
                                        {matchedResults[0].trek.days} Days · {matchedResults[0].trek.altitude} · From {matchedResults[0].trek.price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other Matching Treks */}
                    <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--stone, #cfc7b6)", marginBottom: "12px", fontWeight: 700 }}>
                        Alternative Strong Matches:
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                        {matchedResults.slice(1, 4).map(({ trek, score }) => (
                            <Link
                                key={trek.slug}
                                href={`/treks/${trek.slug}`}
                                style={{
                                    display: "block",
                                    background: "rgba(255, 255, 255, 0.03)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    color: "#fff",
                                    textDecoration: "none",
                                    transition: "border-color 0.2s ease"
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                    <span style={{ fontSize: "11px", color: "var(--ice, #8fbac9)" }}>{trek.regionLabel.split(",")[0]}</span>
                                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#f59e0b" }}>{score}% Match</span>
                                </div>
                                <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontFamily: "var(--font-serif)" }}>{trek.name}</h4>
                                <span style={{ fontSize: "12px", color: "var(--stone, #cfc7b6)" }}>
                                    {trek.days} Days · {trek.grade} · {trek.price}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
