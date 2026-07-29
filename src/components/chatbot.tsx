"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { treks } from "@/data/treks";
import type { Region, Trek } from "@/lib/types";

interface ChatMessage {
    from: "bot" | "user";
    text: string;
    cards?: Trek[];
}

const REGION_ALIASES: Record<string, Region> = {
    tawang: "tawang",
    "west kameng": "west-kameng",
    kameng: "west-kameng",
    anjaw: "anjaw",
    dong: "anjaw",
    "lower subansiri": "lower-subansiri",
    ziro: "lower-subansiri",
    "dibang valley": "dibang-valley",
    anini: "dibang-valley",
};

const REGION_LABEL: Record<Region, string> = {
    tawang: "Tawang",
    "west-kameng": "West Kameng",
    anjaw: "Anjaw",
    "lower-subansiri": "Lower Subansiri (Ziro)",
    "dibang-valley": "Dibang Valley (Anini)",
};

const GREETING: ChatMessage = {
    from: "bot",
    text: "Namaste 🙏 I'm TrekBot, your AI guide for Arunachal Pradesh trekking. Ask me about routes, permits (ILP/PAP), weather, packing or prices!",
    cards: [treks[0], treks[2]],
};

function regionInText(text: string): Region | undefined {
    for (const [alias, region] of Object.entries(REGION_ALIASES)) {
        if (text.includes(alias)) return region;
    }
    return undefined;
}

function getBotReply(raw: string): { reply: string; cards?: Trek[] } {
    const text = " " + raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ") + " ";

    // Greetings
    if (/(^|\s)(hi|hello|hey|namaste|yo)(\s|$)/.test(text)) {
        return { reply: GREETING.text, cards: [treks[0], treks[1]] };
    }

    // Thanks
    if (text.includes("thank")) {
        return { reply: "You're very welcome! Let me know if you need help with gear, permits, or departure dates. 😊" };
    }

    // Permits
    if (text.includes("permit") || text.includes("ilp") || text.includes("pap")) {
        return {
            reply: "Every traveller in Arunachal requires a permit:\n• Indian citizens need an Inner Line Permit (e-ILP), issued online in 24–48 hours.\n• Foreign nationals need a Protected Area Permit (PAP), requiring a min of 2 travellers through registered operators like us.\nWe handle all PAP & ILP paperwork with your booking!",
        };
    }

    // Weather
    if (text.includes("weather") || text.includes("temperature") || text.includes("climate") || text.includes("rain") || text.includes("snow")) {
        return {
            reply: "Autumn (Sep–Nov) offers crystal-clear Himalayan views and dry trails. Spring (Apr–Jun) brings blooming rhododendrons. High passes like Tse La and Gorichen Base Camp drop below 0°C at night, while lower valleys like Ziro remain mild (15°C–20°C).",
        };
    }

    // Price / cost / budget
    if (text.includes("price") || text.includes("cost") || text.includes("budget") || text.includes("cheap") || text.includes("expensive")) {
        const sorted = [...treks].sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, ""), 10) - parseInt(b.price.replace(/[^0-9]/g, ""), 10));
        return {
            reply: `Our treks range from ${sorted[0].price} (${sorted[0].name}) up to ${sorted[sorted.length - 1].price}. Packages include local guide, permits, tent/homestay accommodation, and all trail meals.`,
            cards: [sorted[0], sorted[1]],
        };
    }

    // Beginner / easy
    if (text.includes("beginner") || text.includes("easy") || text.includes("first time")) {
        const easyTreks = treks.filter((t) => /easy|moderate/i.test(t.grade));
        return {
            reply: "Arunachal has wonderful trails for beginners! Sangestar Tso (Madhuri Lake) and Talle Valley in Ziro are gentle, scenic, and well-supported.",
            cards: easyTreks.slice(0, 2),
        };
    }

    // Difficult / hard / high altitude
    if (text.includes("difficult") || text.includes("hard") || text.includes("expedition") || text.includes("challeging") || text.includes("challenging")) {
        const hardTreks = treks.filter((t) => /difficult|challenging/i.test(t.grade));
        return {
            reply: "For true high-altitude mountaineers, Gorichen Base Camp, the Bailey Trail over Tse La Pass, and the 11-day Seven Lakes expedition in Anini provide world-class wilderness challenges.",
            cards: hardTreks.slice(0, 2),
        };
    }

    // Region search
    const region = regionInText(text);
    if (region) {
        const matching = treks.filter((t) => t.region === region);
        if (matching.length > 0) {
            return {
                reply: `Here are our signature routes in ${REGION_LABEL[region]}:`,
                cards: matching,
            };
        }
    }

    // Trek specific matches by name
    const specificTrek = treks.find(t => text.includes(t.slug.split("-")[0]) || text.includes(t.name.toLowerCase().split(" ")[0]));
    if (specificTrek) {
        return {
            reply: `${specificTrek.name} is a ${specificTrek.days}-day trek reaching ${specificTrek.altitude} with grade: ${specificTrek.grade}. Best season is ${specificTrek.bestMonths}.`,
            cards: [specificTrek],
        };
    }

    // Default
    return {
        reply: "I can help you explore Arunachal's signature routes, check current permits, compare costs, or find a trek for your fitness level. Try asking one of the options below!",
        cards: [treks[0]],
    };
}

const QUICK_REPLIES = [
    "Recommend a trek",
    "Permits (ILP & PAP)",
    "Best for beginners",
    "Weather in Tawang",
    "Seven Lakes trek",
    "Price range",
];

export default function ChatBot() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typing, open]);

    const speakText = (text: string, idx: number) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

        if (speakingIdx === idx) {
            window.speechSynthesis.cancel();
            setSpeakingIdx(null);
            return;
        }

        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*•#]/g, "");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.onend = () => setSpeakingIdx(null);
        utterance.onerror = () => setSpeakingIdx(null);
        setSpeakingIdx(idx);
        window.speechSynthesis.speak(utterance);
    };

    const handleVoiceInput = () => {
        if (typeof window === "undefined") return;
        const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }).SpeechRecognition ||
            (window as unknown as { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results?.[0]?.[0]?.transcript;
            if (transcript) {
                send(transcript);
            }
        };

        recognition.start();
    };

    async function send(text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;
        setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
        setInput("");
        setTyping(true);

        let reply = "";
        let cards: Trek[] | undefined;

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed }),
            });
            const data: { reply?: string } = await res.json();
            if (data?.reply && data.reply.trim()) {
                reply = data.reply;
                const lower = reply.toLowerCase();
                cards = treks.filter(t => lower.includes(t.name.toLowerCase()) || lower.includes(t.slug.split("-")[0])).slice(0, 2);
            } else {
                const botResult = getBotReply(trimmed);
                reply = botResult.reply;
                cards = botResult.cards;
            }
        } catch {
            const botResult = getBotReply(trimmed);
            reply = botResult.reply;
            cards = botResult.cards;
        }

        setTyping(false);
        setMessages((prev) => [...prev, { from: "bot", text: reply, cards }]);
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        send(input);
    }

    return (
        <>
            {open && (
                <div
                    className="chatbot-panel"
                    role="dialog"
                    aria-label="TrekBot AI assistant"
                    style={{
                        zIndex: 999,
                        maxHeight: "85vh",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-avatar" aria-hidden="true">
                            <span className="chatbot-avatar-dot" />
                        </div>
                        <div>
                            <strong>TrekBot AI Guide</strong>
                            <span className="chatbot-status">
                                Online · Instant Himalayan Answers
                            </span>
                        </div>
                        <button
                            type="button"
                            className="chatbot-close"
                            onClick={() => setOpen(false)}
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>

                    {/* Chat Messages Body */}
                    <div className="chatbot-body" ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`chat-msg ${m.from}`}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "100%" }}>
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
                                        <span className="chat-bubble" style={{ whiteSpace: "pre-line" }}>
                                            {m.text}
                                        </span>
                                        {m.from === "bot" && (
                                            <button
                                                type="button"
                                                onClick={() => speakText(m.text, i)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                    opacity: speakingIdx === i ? 1 : 0.6,
                                                    padding: "4px"
                                                }}
                                                title={speakingIdx === i ? "Stop audio" : "Listen to answer"}
                                            >
                                                {speakingIdx === i ? "⏹️" : "🔊"}
                                            </button>
                                        )}
                                    </div>

                                    {/* Rich Interactive Trek Cards */}
                                    {m.cards && m.cards.length > 0 && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                                            {m.cards.map((c) => (
                                                <div
                                                    key={c.slug}
                                                    style={{
                                                        background: "#132130",
                                                        border: "1px solid rgba(243, 238, 228, 0.15)",
                                                        borderRadius: "10px",
                                                        overflow: "hidden",
                                                        display: "grid",
                                                        gridTemplateColumns: "70px 1fr",
                                                        color: "#f4efe5",
                                                        fontSize: "12px"
                                                    }}
                                                >
                                                    <div style={{ position: "relative", width: "70px", height: "100%" }}>
                                                        <Image src={c.image} alt={c.name} fill style={{ objectFit: "cover" }} />
                                                    </div>
                                                    <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                                        <strong style={{ color: "#fff", fontSize: "12px", lineHeight: 1.2 }}>{c.name}</strong>
                                                        <span style={{ color: "var(--stone, #cfc7b6)", fontSize: "11px" }}>
                                                            {c.days} Days · {c.price} · {c.grade}
                                                        </span>
                                                        <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                                                            <Link
                                                                href={`/treks/${c.slug}`}
                                                                onClick={() => setOpen(false)}
                                                                style={{
                                                                    background: "var(--flare, #d95f24)",
                                                                    color: "#fff",
                                                                    padding: "2px 8px",
                                                                    borderRadius: "10px",
                                                                    fontSize: "10px",
                                                                    fontWeight: 700,
                                                                    textDecoration: "none"
                                                                }}
                                                            >
                                                                View Trek →
                                                            </Link>
                                                            <a
                                                                href={`https://wa.me/916009276459?text=${encodeURIComponent(`Hi, I saw ${c.name} on TrekBot and want details.`)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    background: "#25D366",
                                                                    color: "#fff",
                                                                    padding: "2px 8px",
                                                                    borderRadius: "10px",
                                                                    fontSize: "10px",
                                                                    fontWeight: 700,
                                                                    textDecoration: "none"
                                                                }}
                                                            >
                                                                WhatsApp
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div className="chat-msg bot">
                                <span className="chat-bubble typing">
                                    <i />
                                    <i />
                                    <i />
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Quick Suggestion Pills */}
                    <div className="chatbot-quick">
                        {QUICK_REPLIES.map((q) => (
                            <button key={q} type="button" onClick={() => send(q)}>
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input Form with Mic Voice Input */}
                    <form className="chatbot-input" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about a trek, permit, or weather..."
                            aria-label="Chat message"
                        />
                        <button
                            type="button"
                            className="voice-btn"
                            title={isListening ? "Listening..." : "Click to speak"}
                            onClick={handleVoiceInput}
                            style={{
                                background: isListening ? "rgba(239, 68, 68, 0.2)" : undefined,
                                color: isListening ? "#ef4444" : undefined
                            }}
                            aria-label="Voice input"
                        >
                            🎙️
                        </button>
                        <button type="submit" aria-label="Send message">
                            ➤
                        </button>
                    </form>

                    {/* Footer with Human Escalation */}
                    <div className="chatbot-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Link href="/chatbot" onClick={() => setOpen(false)}>
                            Full Assistant Page →
                        </Link>
                        <a
                            href="https://wa.me/916009276459?text=Hi%2C%20I%20have%20questions%20about%20trekking%20in%20Arunachal%20Pradesh."
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#25D366", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}
                        >
                            <span>🟢</span> Human Guide on WhatsApp
                        </a>
                    </div>
                </div>
            )}

            {/* Chat Floating Action Button */}
            <button
                type="button"
                className={`chatbot-fab ${open ? "open" : ""}`}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close AI chat" : "Open AI chat"}
            >
                {open ? (
                    <span aria-hidden="true">✕</span>
                ) : (
                    <span className="chatbot-fab-inner" aria-hidden="true">
                        <span className="chatbot-fab-avatar" />
                    </span>
                )}
                {!open && <span className="chatbot-fab-label">Ask TrekBot</span>}
                {!open && <span className="chatbot-fab-badge" aria-hidden="true">1</span>}
            </button>
        </>
    );
}
