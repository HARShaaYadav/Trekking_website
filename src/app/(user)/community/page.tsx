"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { treks } from "@/data/treks";
import WhatsAppButton from "@/components/WhatsAppButton";

interface CommunityPost {
    id: string;
    title: string;
    content: string;
    category: string;
    author_name: string;
    author_location?: string;
    trek_slug?: string | null;
    upvotes: number;
    created_at: string;
}

const CATEGORIES = [
    { id: "all", label: "All Topics", icon: "🌐" },
    { id: "trail-update", label: "Trail Conditions", icon: "🏔️" },
    { id: "buddy-finder", label: "Find a Trek Buddy", icon: "🤝" },
    { id: "qa", label: "Permits & Q&A", icon: "❓" },
    { id: "gear", label: "Gear & Packing", icon: "🎒" },
];

export default function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [upvotedPosts, setUpvotedPosts] = useState<Record<string, boolean>>({});

    // Form state
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formCategory, setFormCategory] = useState("trail-update");
    const [formAuthor, setFormAuthor] = useState("");
    const [formLocation, setFormLocation] = useState("");
    const [formTrek, setFormTrek] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchPosts = async (cat: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/community?category=${cat}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
            }
        } catch (err) {
            console.error("Failed to load posts:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(selectedCategory);
    }, [selectedCategory]);

    const handleUpvote = async (id: string) => {
        if (upvotedPosts[id]) return;
        setUpvotedPosts(prev => ({ ...prev, [id]: true }));
        setPosts(prev =>
            prev.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p)
        );

        try {
            await fetch("/api/community", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "upvote", id }),
            });
        } catch {
            // ignore
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle || !formContent || !formAuthor) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/community", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formTitle,
                    content: formContent,
                    category: formCategory,
                    author_name: formAuthor,
                    author_location: formLocation,
                    trek_slug: formTrek || null,
                }),
            });

            if (res.ok) {
                setShowModal(false);
                setFormTitle("");
                setFormContent("");
                fetchPosts(selectedCategory);
            }
        } catch (err) {
            console.error("Failed to submit post:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const getCategoryBadge = (cat: string) => {
        switch (cat) {
            case "trail-update":
                return { label: "Trail Update", bg: "rgba(217, 95, 36, 0.15)", color: "#d95f24" };
            case "buddy-finder":
                return { label: "Buddy Finder", bg: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" };
            case "qa":
                return { label: "Permits & Q&A", bg: "rgba(168, 85, 247, 0.15)", color: "#a855f7" };
            case "gear":
                return { label: "Gear Advice", bg: "rgba(34, 197, 94, 0.15)", color: "#22c55e" };
            default:
                return { label: "General", bg: "rgba(255, 255, 255, 0.1)", color: "#cfc7b6" };
        }
    };

    return (
        <div style={{ paddingTop: "var(--header-h, 78px)", minHeight: "100vh", background: "var(--night, #0d1721)" }}>
            <div className="wrap" style={{ padding: "40px 20px 80px 20px" }}>
                {/* Header banner */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    marginBottom: "36px",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    paddingBottom: "24px"
                }}>
                    <div>
                        <div style={{
                            fontSize: "12px",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "var(--flare, #d95f24)",
                            fontWeight: 700,
                            marginBottom: "6px"
                        }}>
                            Trekker Basecamp & Network
                        </div>
                        <h1 style={{
                            fontSize: "clamp(28px, 4vw, 42px)",
                            fontFamily: "var(--font-serif)",
                            color: "#fff",
                            margin: 0
                        }}>
                            Arunachal Trekker Community
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: "15px", color: "var(--stone, #cfc7b6)", maxWidth: "600px" }}>
                            Real-time trail reports from the mountains, solo buddy coordination for permit sharing, and guidance from experienced Himalayan guides.
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            style={{
                                background: "var(--flare, #d95f24)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "var(--r-pill, 999px)",
                                padding: "12px 24px",
                                fontWeight: 700,
                                fontSize: "14px",
                                cursor: "pointer",
                                boxShadow: "var(--shadow-glow)"
                            }}
                        >
                            + Post Update or Query
                        </button>
                        <WhatsAppButton style="inline" message="Hi! I want to join the Arunachal Trekkers WhatsApp Community group." size="md" />
                    </div>
                </div>

                {/* Topic Navigation Filter Pills */}
                <div style={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    paddingBottom: "16px",
                    marginBottom: "30px"
                }}>
                    {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: isActive ? "#fff" : "rgba(255,255,255,0.05)",
                                    color: isActive ? "var(--night, #0d1721)" : "#f4efe5",
                                    border: `1px solid ${isActive ? "#fff" : "rgba(255,255,255,0.12)"}`,
                                    borderRadius: "var(--r-pill, 999px)",
                                    padding: "8px 18px",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Posts Feed */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--stone, #cfc7b6)" }}>
                        Loading community dispatches...
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.08)"
                    }}>
                        <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏕️</div>
                        <h3 style={{ color: "#fff", fontFamily: "var(--font-serif)" }}>No posts in this topic yet</h3>
                        <p style={{ color: "var(--stone, #cfc7b6)", fontSize: "14px", maxWidth: "400px", margin: "0 auto 20px auto" }}>
                            Be the first to share trail conditions or seek trekking companions for this route!
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            style={{
                                background: "var(--flare, #d95f24)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "var(--r-pill, 999px)",
                                padding: "10px 20px",
                                fontWeight: 600,
                                cursor: "pointer"
                            }}
                        >
                            Start the Discussion
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                        {posts.map((post) => {
                            const badge = getCategoryBadge(post.category);
                            const matchingTrek = treks.find(t => t.slug === post.trek_slug);

                            return (
                                <article
                                    key={post.id}
                                    style={{
                                        background: "rgba(255, 255, 255, 0.03)",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                        borderRadius: "var(--r-lg, 16px)",
                                        padding: "24px",
                                        transition: "border-color 0.2s ease",
                                        display: "grid",
                                        gridTemplateColumns: "auto 1fr",
                                        gap: "20px",
                                        alignItems: "start"
                                    }}
                                >
                                    {/* Upvote Button Column */}
                                    <button
                                        type="button"
                                        onClick={() => handleUpvote(post.id)}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "52px",
                                            padding: "10px 0",
                                            background: upvotedPosts[post.id] ? "rgba(217, 95, 36, 0.2)" : "rgba(255, 255, 255, 0.05)",
                                            border: `1px solid ${upvotedPosts[post.id] ? "#d95f24" : "rgba(255, 255, 255, 0.1)"}`,
                                            borderRadius: "var(--r-md, 12px)",
                                            color: upvotedPosts[post.id] ? "#d95f24" : "#fff",
                                            cursor: upvotedPosts[post.id] ? "default" : "pointer",
                                            transition: "all 0.2s ease"
                                        }}
                                        title="Upvote this trail report"
                                    >
                                        <span style={{ fontSize: "16px", lineHeight: 1 }}>↑</span>
                                        <span style={{ fontSize: "13px", fontWeight: 700, marginTop: "4px" }}>{post.upvotes}</span>
                                    </button>

                                    {/* Post Content */}
                                    <div>
                                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                            <span style={{
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                padding: "3px 10px",
                                                borderRadius: "12px",
                                                background: badge.bg,
                                                color: badge.color
                                            }}>
                                                {badge.label}
                                            </span>

                                            {matchingTrek && (
                                                <Link
                                                    href={`/treks/${matchingTrek.slug}`}
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "var(--ice, #8fbac9)",
                                                        textDecoration: "none",
                                                        borderBottom: "1px dotted var(--ice, #8fbac9)"
                                                    }}
                                                >
                                                    Trail: {matchingTrek.name}
                                                </Link>
                                            )}
                                        </div>

                                        <h2 style={{ margin: "0 0 10px 0", fontSize: "18px", color: "#fff", fontFamily: "var(--font-serif)" }}>
                                            {post.title}
                                        </h2>

                                        <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--stone, #cfc7b6)", lineHeight: 1.6 }}>
                                            {post.content}
                                        </p>

                                        <div style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: "12px",
                                            color: "rgba(243, 238, 228, 0.5)",
                                            borderTop: "1px solid rgba(255,255,255,0.06)",
                                            paddingTop: "12px"
                                        }}>
                                            <div>
                                                Dispatched by <strong style={{ color: "#fff" }}>{post.author_name}</strong>
                                                {post.author_location && <span> · {post.author_location}</span>}
                                            </div>
                                            <div>
                                                {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* New Post Modal */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(13, 23, 33, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "16px",
                    backdropFilter: "blur(6px)"
                }}>
                    <div style={{
                        background: "#132130",
                        color: "#f4efe5",
                        borderRadius: "var(--r-lg, 16px)",
                        maxWidth: "540px",
                        width: "100%",
                        padding: "30px",
                        boxShadow: "var(--shadow-xl)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        position: "relative"
                    }}>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            style={{
                                position: "absolute",
                                top: "18px",
                                right: "18px",
                                background: "none",
                                border: "none",
                                color: "var(--stone, #cfc7b6)",
                                fontSize: "20px",
                                cursor: "pointer"
                            }}
                        >
                            ✕
                        </button>

                        <h3 style={{ margin: "0 0 6px 0", fontSize: "20px", fontFamily: "var(--font-serif)", color: "#fff" }}>
                            Create Community Dispatch
                        </h3>
                        <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--stone, #cfc7b6)" }}>
                            Share road updates, find trail buddies, or ask questions about Arunachal trekking.
                        </p>

                        <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                    Topic Category *
                                </label>
                                <select
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        background: "#1b2c3d",
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        borderRadius: "var(--r-sm, 8px)",
                                        fontSize: "13px"
                                    }}
                                >
                                    <option value="trail-update">🏔️ Trail Conditions & Road Update</option>
                                    <option value="buddy-finder">🤝 Find a Trek Buddy / Group Share</option>
                                    <option value="qa">❓ Permits (ILP/PAP) & Q&A</option>
                                    <option value="gear">🎒 Gear & Packing Tips</option>
                                </select>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formAuthor}
                                        onChange={(e) => setFormAuthor(e.target.value)}
                                        placeholder="e.g. Tenzing"
                                        style={{
                                            width: "100%",
                                            padding: "9px 12px",
                                            background: "#1b2c3d",
                                            color: "#fff",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            borderRadius: "var(--r-sm, 8px)",
                                            fontSize: "13px"
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                        Location / City
                                    </label>
                                    <input
                                        type="text"
                                        value={formLocation}
                                        onChange={(e) => setFormLocation(e.target.value)}
                                        placeholder="e.g. Guwahati / Mumbai"
                                        style={{
                                            width: "100%",
                                            padding: "9px 12px",
                                            background: "#1b2c3d",
                                            color: "#fff",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            borderRadius: "var(--r-sm, 8px)",
                                            fontSize: "13px"
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                    Related Route (Optional)
                                </label>
                                <select
                                    value={formTrek}
                                    onChange={(e) => setFormTrek(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        background: "#1b2c3d",
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        borderRadius: "var(--r-sm, 8px)",
                                        fontSize: "13px"
                                    }}
                                >
                                    <option value="">General / All Arunachal</option>
                                    {treks.map(t => (
                                        <option key={t.slug} value={t.slug}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                    Headline / Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    placeholder="e.g. Snow update at Sela Pass or Looking for partners on Bailey Trail"
                                    style={{
                                        width: "100%",
                                        padding: "9px 12px",
                                        background: "#1b2c3d",
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        borderRadius: "var(--r-sm, 8px)",
                                        fontSize: "13px"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                                    Message / Trail Report *
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    value={formContent}
                                    onChange={(e) => setFormContent(e.target.value)}
                                    placeholder="Provide detailed dates, road or trail status, contact details, or question..."
                                    style={{
                                        width: "100%",
                                        padding: "9px 12px",
                                        background: "#1b2c3d",
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.15)",
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
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "#f4efe5",
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
                                        padding: "9px 24px",
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        cursor: submitting ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {submitting ? "Publishing..." : "Publish Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
