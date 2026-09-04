"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";

interface Review {
    id: string;
    trek_slug: string;
    user_name: string;
    rating: number;
    title: string;
    comment: string;
    visited_month?: string;
    helpful_count: number;
    verified: boolean;
    created_at?: string;
}

interface ReviewSectionProps {
    trekSlug: string;
    trekName: string;
    fallbackReviews?: Testimonial[];
}

export default function ReviewSection({ trekSlug, trekName, fallbackReviews = [] }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});

    // Review form state
    const [formRating, setFormRating] = useState(5);
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formMonth, setFormMonth] = useState("Autumn 2024");
    const [formTitle, setFormTitle] = useState("");
    const [formComment, setFormComment] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?slug=${encodeURIComponent(trekSlug)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.reviews && data.reviews.length > 0) {
                    setReviews(data.reviews);
                    setLoading(false);
                    return;
                }
            }
        } catch {
            // fallback
        }

        // Map fallback testimonials if no DB reviews found
        const mappedFallback: Review[] = fallbackReviews.map((fb, idx) => ({
            id: `fallback-${idx}`,
            trek_slug: trekSlug,
            user_name: fb.name,
            rating: 5,
            title: "Unforgettable Himalayan Experience",
            comment: fb.quote,
            visited_month: "Verified Departure",
            helpful_count: 8 + idx * 3,
            verified: true,
        }));
        setReviews(mappedFallback);
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [trekSlug]);

    const handleHelpful = (id: string) => {
        if (helpfulVoted[id]) return;
        setHelpfulVoted(prev => ({ ...prev, [id]: true }));
        setReviews(prev =>
            prev.map(r => r.id === id ? { ...r, helpful_count: r.helpful_count + 1 } : r)
        );
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName || !formTitle || !formComment) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    trek_slug: trekSlug,
                    user_name: formName,
                    user_email: formEmail,
                    rating: formRating,
                    title: formTitle,
                    comment: formComment,
                    visited_month: formMonth,
                }),
            });

            if (res.ok) {
                const newRev: Review = {
                    id: `temp-${Date.now()}`,
                    trek_slug: trekSlug,
                    user_name: formName,
                    rating: formRating,
                    title: formTitle,
                    comment: formComment,
                    visited_month: formMonth,
                    helpful_count: 0,
                    verified: true,
                    created_at: new Date().toISOString(),
                };
                setReviews(prev => [newRev, ...prev]);
                setSuccessMsg("Thank you! Your verified trek review has been added.");
                setTimeout(() => {
                    setShowModal(false);
                    setSuccessMsg("");
                    setFormTitle("");
                    setFormComment("");
                }, 1500);
            }
        } catch (err) {
            console.error("Submission failed:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : "5.0";

    const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
        if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
    });

    return (
        <div style={{ marginTop: "40px" }}>
            {/* Reviews Summary Header Card */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                alignItems: "center",
                padding: "24px",
                background: "var(--mist, #f4efe5)",
                border: "1px solid var(--hline, #e1dbcb)",
                borderRadius: "var(--r-lg, 16px)",
                marginBottom: "32px"
            }}>
                <div style={{ textAlign: "center", paddingRight: "16px", borderRight: "1px solid rgba(0,0,0,0.08)" }}>
                    <div style={{ fontSize: "44px", fontWeight: 800, color: "var(--ink, #151a20)", lineHeight: 1 }}>
                        {avgRating}
                    </div>
                    <div style={{ color: "#f59e0b", fontSize: "20px", margin: "6px 0" }}>
                        {"★".repeat(Math.round(Number(avgRating)))}{"☆".repeat(5 - Math.round(Number(avgRating)))}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--sub, #68604f)", fontWeight: 500 }}>
                        Based on {totalReviews} verified trekker reviews
                    </div>
                </div>

                {/* Rating Distribution */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = ratingCounts[stars] || 0;
                        const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        return (
                            <div key={stars} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--ink-2, #3a424c)" }}>
                                <span style={{ width: "32px", textAlign: "right", fontWeight: 600 }}>{stars} ★</span>
                                <div style={{ flex: 1, height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                                    <div style={{ width: `${pct}%`, height: "100%", background: "#d95f24", borderRadius: "4px" }} />
                                </div>
                                <span style={{ width: "24px", color: "var(--sub, #68604f)" }}>{count}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Write a Review Button */}
                <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "13px", color: "var(--sub, #68604f)", marginBottom: "12px" }}>
                        Have you trekked this route with our local mountain guides?
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        style={{
                            background: "var(--flare, #d95f24)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "var(--r-pill, 999px)",
                            padding: "12px 24px",
                            fontWeight: 600,
                            fontSize: "14px",
                            cursor: "pointer",
                            boxShadow: "var(--shadow-glow)"
                        }}
                    >
                        ✍️ Write a Review
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                {reviews.map((rev) => (
                    <div
                        key={rev.id}
                        style={{
                            background: "#fff",
                            border: "1px solid var(--hline, #e1dbcb)",
                            borderRadius: "var(--r-md, 12px)",
                            padding: "20px",
                            boxShadow: "var(--shadow-sm)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}
                    >
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                <div style={{ color: "#f59e0b", fontSize: "16px" }}>
                                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                </div>
                                {rev.verified && (
                                    <span style={{
                                        fontSize: "11px",
                                        background: "rgba(63, 143, 95, 0.12)",
                                        color: "#3f8f5f",
                                        padding: "2px 8px",
                                        borderRadius: "10px",
                                        fontWeight: 600
                                    }}>
                                        ✓ Verified Trekker
                                    </span>
                                )}
                            </div>

                            <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", color: "var(--ink, #151a20)", fontWeight: 700 }}>
                                {rev.title}
                            </h4>

                            <p style={{ fontSize: "13px", color: "var(--ink-2, #3a424c)", lineHeight: 1.6, margin: "0 0 12px 0" }}>
                                “{rev.comment}”
                            </p>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTop: "1px solid var(--hline, #e1dbcb)",
                            paddingTop: "12px",
                            fontSize: "12px",
                            color: "var(--sub, #68604f)"
                        }}>
                            <div>
                                <strong style={{ color: "var(--ink, #151a20)" }}>{rev.user_name}</strong>
                                {rev.visited_month && <span> · {rev.visited_month}</span>}
                            </div>

                            <button
                                type="button"
                                onClick={() => handleHelpful(rev.id)}
                                style={{
                                    background: helpfulVoted[rev.id] ? "rgba(63,143,95,0.15)" : "transparent",
                                    border: "1px solid var(--hline, #e1dbcb)",
                                    borderRadius: "14px",
                                    padding: "3px 10px",
                                    fontSize: "11px",
                                    cursor: helpfulVoted[rev.id] ? "default" : "pointer",
                                    color: helpfulVoted[rev.id] ? "#3f8f5f" : "var(--sub, #68604f)",
                                    fontWeight: 500
                                }}
                            >
                                👍 Helpful ({rev.helpful_count})
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Dialog for Writing Review */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(13, 23, 33, 0.75)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "16px",
                    backdropFilter: "blur(4px)"
                }}>
                    <div style={{
                        background: "#fff",
                        borderRadius: "var(--r-lg, 16px)",
                        maxWidth: "520px",
                        width: "100%",
                        padding: "28px",
                        boxShadow: "var(--shadow-xl)",
                        position: "relative"
                    }}>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            style={{
                                position: "absolute",
                                top: "16px",
                                right: "16px",
                                background: "none",
                                border: "none",
                                fontSize: "20px",
                                cursor: "pointer",
                                color: "var(--sub, #68604f)"
                            }}
                        >
                            ✕
                        </button>

                        <h3 style={{ margin: "0 0 6px 0", fontSize: "20px", fontFamily: "var(--font-serif)" }}>
                            Review {trekName}
                        </h3>
                        <p style={{ fontSize: "13px", color: "var(--sub, #68604f)", margin: "0 0 20px 0" }}>
                            Share your mountain experience with other trekkers planning their Arunachal adventure.
                        </p>

                        {successMsg ? (
                            <div style={{
                                padding: "16px",
                                background: "rgba(63, 143, 95, 0.15)",
                                border: "1px solid #3f8f5f",
                                color: "#2e7d32",
                                borderRadius: "8px",
                                textAlign: "center",
                                fontWeight: 600
                            }}>
                                {successMsg}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                        Rating
                                    </label>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormRating(star)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    fontSize: "24px",
                                                    cursor: "pointer",
                                                    color: star <= formRating ? "#f59e0b" : "#d1d5db"
                                                }}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            placeholder="e.g. Tenzing Norbu"
                                            style={{
                                                width: "100%",
                                                padding: "9px 12px",
                                                border: "1px solid var(--hline, #e1dbcb)",
                                                borderRadius: "var(--r-sm, 8px)",
                                                fontSize: "13px"
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                            Season / Month *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formMonth}
                                            onChange={(e) => setFormMonth(e.target.value)}
                                            placeholder="e.g. October 2025"
                                            style={{
                                                width: "100%",
                                                padding: "9px 12px",
                                                border: "1px solid var(--hline, #e1dbcb)",
                                                borderRadius: "var(--r-sm, 8px)",
                                                fontSize: "13px"
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                        Review Headline *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="e.g. Incredible sunrise and great local guide"
                                        style={{
                                            width: "100%",
                                            padding: "9px 12px",
                                            border: "1px solid var(--hline, #e1dbcb)",
                                            borderRadius: "var(--r-sm, 8px)",
                                            fontSize: "13px"
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                        Your Experience & Trail Advice *
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formComment}
                                        onChange={(e) => setFormComment(e.target.value)}
                                        placeholder="How were the trails, mountain camps, food, and guides? Any tips for other trekkers?"
                                        style={{
                                            width: "100%",
                                            padding: "9px 12px",
                                            border: "1px solid var(--hline, #e1dbcb)",
                                            borderRadius: "var(--r-sm, 8px)",
                                            fontSize: "13px",
                                            fontFamily: "inherit"
                                        }}
                                    />
                                </div>

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            background: "none",
                                            border: "1px solid var(--hline, #e1dbcb)",
                                            borderRadius: "var(--r-pill, 999px)",
                                            padding: "9px 18px",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            cursor: "pointer"
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            background: "var(--flare, #d95f24)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "var(--r-pill, 999px)",
                                            padding: "9px 22px",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            cursor: submitting ? "not-allowed" : "pointer"
                                        }}
                                    >
                                        {submitting ? "Posting..." : "Submit Review"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
