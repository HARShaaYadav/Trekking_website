"use client";

import { useEffect, useRef, useState } from "react";
import { treks } from "@/data/treks";
import type { Region } from "@/lib/types";

interface ChatMessage {
    from: "bot" | "user";
    text: string;
    timestamp: Date;
}

interface VoiceConfig {
    isListening: boolean;
    isRecording: boolean;
    isSpeaking: boolean;
    voicesLoaded: boolean;
    selectedVoiceIndex: number;
    speechRate: number;
    speechPitch: number;
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
    text: "Namaste 🙏 I'm TrekBot, your AI assistant for Trekking Arunachal Pradesh. I can recommend treks by region, difficulty or duration, and answer questions about prices and the best seasons. You can type or use voice - just click the microphone button! Try one of the quick questions below, or ask me anything about Arunachal Pradesh trekking.",
    timestamp: new Date(),
};

function regionInText(text: string): Region | undefined {
    for (const [alias, region] of Object.entries(REGION_ALIASES)) {
        if (text.toLowerCase().includes(alias)) return region;
    }
    return undefined;
}

function listTreks(region: Region): string {
    const matches = treks.filter((t) => t.region === region);
    if (matches.length === 0) {
        return `I don't have any routes listed for that region yet, but we can absolutely plan a custom trek there. Message us on the contact page.`;
    }
    const lines = matches
        .map((t) => `• ${t.name} — ${t.days} days, ${t.price}`)
        .join("\n");
    return `Here are our treks in ${REGION_LABEL[region]}:\n${lines}\n\nWant details on any of them? Just say the name.`;
}

function getBotReply(raw: string): string {
    const text = " " + raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ") + " ";

    // Greetings
    if (/(^|\s)(hi|hello|hey|namaste|yo)(\s|$)/.test(text)) {
        return GREETING.text;
    }

    // Thanks
    if (text.includes("thank")) {
        return "You're welcome! Anything else I can help you plan? 😊";
    }

    // Contact / book / human
    if (
        text.includes("contact") ||
        text.includes("book") ||
        text.includes("human") ||
        text.includes("agent") ||
        text.includes("call")
    ) {
        return `You can reach our team via the contact page — a real trek expert replies within 24 hours. Meanwhile I'm happy to answer quick questions here!`;
    }

    const specificTrek = treks.find((t) =>
        text.includes(t.slug.split("-")[0]) ||
        text.includes(t.name.toLowerCase().split(" ")[0])
    );
    if (specificTrek) {
        return `${specificTrek.name} is a ${specificTrek.days}-day ${specificTrek.grade.toLowerCase()} trek in ${specificTrek.regionLabel}. It reaches ${specificTrek.altitude}, starts from ${specificTrek.startPoint}, costs ${specificTrek.price} per person, and is best during ${specificTrek.bestMonths}.`;
    }

    // Price / cost / budget
    if (text.includes("price") || text.includes("cost") || text.includes("budget") || text.includes("cheap") || text.includes("expensive")) {
        const byPrice = [...treks].sort(
            (a, b) =>
                parseInt(a.price.replace(/[^0-9]/g, ""), 10) -
                parseInt(b.price.replace(/[^0-9]/g, ""), 10)
        );
        const cheapest = byPrice[0];
        const priciest = byPrice[byPrice.length - 1];
        return `Our ${treks.length} treks range from ${cheapest.price} (${cheapest.name}, ${cheapest.days} days) up to ${priciest.price} (${priciest.name}, ${priciest.days} days). Most include permits, accommodation, meals, guide and porter. Want me to narrow it down by budget?`;
    }

    // Duration / days / long / short
    if (text.includes("day") || text.includes("duration") || text.includes("long") || text.includes("short") || text.includes("week")) {
        const byDays = [...treks].sort((a, b) => a.days - b.days);
        const shortest = byDays[0];
        const longest = byDays[byDays.length - 1];
        return `Treks range from ${shortest.days} days (${shortest.name}) to ${longest.days} days (${longest.name}). If you tell me how many days you have, I can suggest a perfect fit.`;
    }

    // Beginner / easy / first time
    if (
        text.includes("beginner") ||
        text.includes("easy") ||
        text.includes("first time") ||
        text.includes("first-time") ||
        text.includes("new to") ||
        text.includes("no experience")
    ) {
        const easy = treks.filter((t) => /easy|moderate/i.test(t.grade));
        const names = easy
            .slice(0, 3)
            .map((t) => `• ${t.name} — ${t.days} days, ${t.grade}`)
            .join("\n");
        return `Great news — Arunachal Pradesh has some wonderfully accessible routes for your first trek. My top picks for beginners:\n${names}\n\nThe Sangestar Tso (Madhuri Lake) Loop is usually our most recommended starting point. Want more detail on any?`;
    }

    // Difficult / challenging / hard
    if (text.includes("difficult") || text.includes("challenging") || text.includes("hard") || text.includes("experienced") || text.includes("adventure")) {
        const hard = treks.filter((t) => /difficult|challenging/i.test(t.grade));
        const names = hard
            .slice(0, 3)
            .map((t) => `• ${t.name} — ${t.days} days, ${t.grade}`)
            .join("\n");
        return `If you're after a real challenge, these are our most demanding routes:\n${names}\n\nFor the ultimate experience, the Gorichen Base Camp or Seven Lakes Trek are unforgettable adventures.`;
    }

    // Season / best time / weather
    if (text.includes("season") || text.includes("best time") || text.includes("when") || text.includes("month") || text.includes("weather") || text.includes("snow")) {
        return `The main trekking seasons in Arunachal Pradesh are autumn (September–November) with clear views and comfortable temperatures, and spring (April–June) with blooming rhododendrons. Some routes like Dong Valley are best in winter (November–April) for clear sunrise views. Each trek's page lists its specific best months.`;
    }

    // Region-specific query
    const region = regionInText(text);
    if (region) {
        return listTreks(region);
    }

    // Recommend
    if (text.includes("recommend") || text.includes("suggest") || text.includes("best trek") || text.includes("which trek") || text.includes("where should i")) {
        return `Here are some crowd-favourites across different regions:\n• Sangestar Tso (Madhuri Lake) Loop — scenic and accessible\n• Talle Valley Trek — perfect for forest lovers\n• Bailey Trail Trek — for real adventurers\n\nTell me your days available or a region you're interested in and I'll narrow it down.`;
    }

    // Default fallback
    return `I can help with trek recommendations, regions, difficulty, duration, seasons and prices. Try asking things like:\n• "Recommend a trek"\n• "Best for beginners"\n• "Tawang treks"\n• "Bailey Trail details"\n• "How much does it cost?"`;
}

function isCatalogueQuestion(text: string): boolean {
    return /trek|route|tawang|ziro|anini|dong|talle|sangestar|gorichen|bailey|lake|permit|ilp|pap|price|cost|budget|beginner|easy|difficult|challenging|weather|season|month|pack|altitude|duration|days|recommend|suggest|best/.test(text.toLowerCase());
}

const QUICK_REPLIES = [
    "Recommend a trek",
    "Best for beginners", 
    "Tawang treks",
    "Ziro treks",
    "Price range",
    "Best season to visit",
];

export default function ChatBotPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
        isListening: false,
        isRecording: false,
        isSpeaking: false,
        voicesLoaded: false,
        selectedVoiceIndex: 0,
        speechRate: 0.9,
        speechPitch: 1,
    });
    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
    const [speakingMessage, setSpeakingMessage] = useState<number | null>(null);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize client-side features
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Check if mobile
            setIsMobile(window.innerWidth < 480);
            
            // Handle window resize
            const handleResize = () => {
                setIsMobile(window.innerWidth < 480);
            };
            window.addEventListener("resize", handleResize);
            
            // Initialize speech synthesis
            if ("speechSynthesis" in window) {
                setSynthesis(window.speechSynthesis);
                
                // Load voices
                const loadVoices = () => {
                    const voices = window.speechSynthesis.getVoices();
                    setAvailableVoices(voices);
                    setVoiceConfig(prev => ({ ...prev, voicesLoaded: voices.length > 0 }));
                };
                
                loadVoices();
                window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
            }
            
            // Initialize speech recognition
            if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
                const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
                const recognition = new SpeechRecognition();
                
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = "en-IN";
                
                recognition.onstart = () => {
                    setVoiceConfig(prev => ({ ...prev, isListening: true, isRecording: true }));
                };
                
                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    setVoiceConfig(prev => ({ ...prev, isListening: false, isRecording: false }));
                };
                
                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error:", event.error);
                    setVoiceConfig(prev => ({ ...prev, isListening: false, isRecording: false }));
                    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                        alert("Microphone access is blocked. Allow it in your browser settings, then try again.");
                    } else if (event.error === "no-speech") {
                        alert("I could not hear anything. Try again and speak after the microphone turns red.");
                    }
                };
                
                recognition.onend = () => {
                    setVoiceConfig(prev => ({ ...prev, isListening: false, isRecording: false }));
                };
                
                setRecognition(recognition);
            }
            
            return () => {
                window.removeEventListener("resize", handleResize);
                if ("speechSynthesis" in window) {
                    window.speechSynthesis.removeEventListener("voiceschanged", () => {});
                }
            };
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typing]);

    const startListening = () => {
        if (recognition && !voiceConfig.isListening) {
            // Stop current speech if speaking
            if (voiceConfig.isSpeaking && synthesis) {
                synthesis.cancel();
                setVoiceConfig(prev => ({ ...prev, isSpeaking: false }));
                setSpeakingMessage(null);
            }
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition && voiceConfig.isListening) {
            recognition.stop();
        }
    };

    const speakText = (text: string, messageIndex: number) => {
        if (synthesis) {
            if (speakingMessage === messageIndex) {
                stopSpeaking();
                return;
            }
            // Cancel any ongoing speech
            synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = availableVoices[voiceConfig.selectedVoiceIndex] || null;
            utterance.rate = voiceConfig.speechRate;
            utterance.pitch = voiceConfig.speechPitch;
            
            utterance.onstart = () => {
                setVoiceConfig(prev => ({ ...prev, isSpeaking: true }));
                setSpeakingMessage(messageIndex);
                currentUtterance.current = utterance;
            };
            
            utterance.onend = () => {
                setVoiceConfig(prev => ({ ...prev, isSpeaking: false }));
                setSpeakingMessage(null);
                currentUtterance.current = null;
            };
            
            utterance.onerror = (event) => {
                console.error("Speech synthesis error:", event.error);
                setVoiceConfig(prev => ({ ...prev, isSpeaking: false }));
                setSpeakingMessage(null);
                currentUtterance.current = null;
            };
            
            synthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if (synthesis && voiceConfig.isSpeaking) {
            synthesis.cancel();
            setVoiceConfig(prev => ({ ...prev, isSpeaking: false }));
            setSpeakingMessage(null);
            currentUtterance.current = null;
        }
    };

    async function send(text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;
        
        const userMessage: ChatMessage = { 
            from: "user", 
            text: trimmed, 
            timestamp: new Date() 
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setTyping(true);

        let reply: string;
        if (isCatalogueQuestion(trimmed)) {
            reply = getBotReply(trimmed);
        } else try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed }),
            });
            const data: { reply?: string } = await res.json();
            reply = data?.reply && data.reply.trim() ? data.reply : getBotReply(trimmed);
        } catch {
            reply = getBotReply(trimmed);
        }

        setTyping(false);
        const botMessage: ChatMessage = { 
            from: "bot", 
            text: reply, 
            timestamp: new Date() 
        };
        setMessages((prev) => [...prev, botMessage]);
        
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        send(input);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '600px' }}>
            {/* Header */}
            <div className="chatbot-header">
                <div className="chatbot-avatar">
                    <span className="chatbot-avatar-dot" />
                </div>
                <div>
                    <strong>TrekBot</strong>
                    <div className="chatbot-status">
                        Online · AI Assistant for Arunachal Pradesh Treks
                    </div>
                </div>
                <div style={{ 
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: 'clamp(11px, 2vw, 12px)',
                    color: 'var(--stone)',
                    flexDirection: isMobile ? 'column' : 'row'
                }}>
                    {voiceConfig.isSpeaking && (
                        <button
                            onClick={stopSpeaking}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                            title="Stop speaking"
                        >
                            🔇
                        </button>
                    )}
                    <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
                        <div>🎙️ Voice</div>
                        <div>🗣️ Audio</div>
                    </div>
                </div>
            </div>

            {/* Voice Settings Panel */}
            {voiceConfig.voicesLoaded && availableVoices.length > 0 && (
                <div style={{ 
                    background: 'var(--mist)', 
                    padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)', 
                    borderBottom: '1px solid var(--hline)',
                    fontSize: 'clamp(11px, 2vw, 13px)',
                    overflowX: 'auto'
                }}>
                    <details>
                        <summary style={{ 
                            cursor: 'pointer', 
                            fontWeight: '600', 
                            color: 'var(--ink)', 
                            marginBottom: '10px',
                            userSelect: 'none'
                        }}>
                            ⚙️ Voice Settings
                        </summary>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))', 
                            gap: '10px' 
                        }}>
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: 'clamp(11px, 2vw, 12px)', 
                                    fontWeight: '600', 
                                    color: 'var(--sub)', 
                                    marginBottom: '4px' 
                                }}>
                                    Voice
                                </label>
                                <select
                                    value={voiceConfig.selectedVoiceIndex}
                                    onChange={(e) => setVoiceConfig(prev => ({ 
                                        ...prev, 
                                        selectedVoiceIndex: parseInt(e.target.value) 
                                    }))}
                                    style={{
                                        width: '100%',
                                        padding: '6px 8px',
                                        border: '1px solid var(--hline)',
                                        borderRadius: 'var(--r-sm)',
                                        fontSize: 'clamp(11px, 2vw, 12px)',
                                        background: '#fff'
                                    }}
                                >
                                    {availableVoices.map((voice, index) => (
                                        <option key={index} value={index}>
                                            {voice.name.slice(0, 20)} ({voice.lang.slice(0, 2).toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: 'clamp(11px, 2vw, 12px)', 
                                    fontWeight: '600', 
                                    color: 'var(--sub)', 
                                    marginBottom: '4px' 
                                }}>
                                    Speed: {voiceConfig.speechRate.toFixed(1)}x
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={voiceConfig.speechRate}
                                    onChange={(e) => setVoiceConfig(prev => ({ 
                                        ...prev, 
                                        speechRate: parseFloat(e.target.value) 
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: 'clamp(11px, 2vw, 12px)', 
                                    fontWeight: '600', 
                                    color: 'var(--sub)', 
                                    marginBottom: '4px' 
                                }}>
                                    Pitch: {voiceConfig.speechPitch.toFixed(1)}x
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    value={voiceConfig.speechPitch}
                                    onChange={(e) => setVoiceConfig(prev => ({ 
                                        ...prev, 
                                        speechPitch: parseFloat(e.target.value) 
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </details>
                </div>
            )}

            {/* Chat Messages */}
            <div 
                ref={scrollRef}
                className="chatbot-body"
                style={{ flex: 1, minHeight: '300px' }}
            >
                {messages.map((m, i) => (
                    <div key={i} className={`chat-msg ${m.from}`}>
                        <div className="chat-bubble">
                            {m.text}
                            <div style={{ 
                                fontSize: '11px', 
                                opacity: 0.6, 
                                marginTop: '6px',
                                color: m.from === "user" ? 'var(--stone)' : 'var(--sub)'
                            }}>
                                {m.timestamp.toLocaleTimeString()}
                            </div>
                            {m.from === "bot" && synthesis && (
                                <button
                                    onClick={() => speakText(m.text, i)}
                                    style={{
                                        fontSize: '10px',
                                        background: 'var(--mist)',
                                        border: '1px solid var(--hline)',
                                        padding: '4px 8px',
                                        borderRadius: 'var(--r-sm)',
                                        marginTop: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {speakingMessage === i ? "Stop" : "Listen"}
                                </button>
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

            {/* Quick Replies */}
            <div className="chatbot-quick" style={{ overflowX: 'auto', display: 'flex', gap: '8px', padding: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap', justifyContent: 'center' }}>
                {QUICK_REPLIES.map((q) => (
                    <button key={q} style={{ whiteSpace: 'nowrap', fontSize: 'clamp(11px, 2vw, 12px)', padding: 'clamp(6px, 1vw, 10px) clamp(10px, 2vw, 14px)' }} onClick={() => send(q)}>
                        {q}
                    </button>
                ))}
            </div>

            {/* Voice Feature Note */}
            {!recognition && (
                <div style={{ 
                    padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
                    background: '#fef3c7',
                    borderTop: '1px solid #fcd34d',
                    fontSize: 'clamp(10px, 1.5vw, 11px)',
                    color: '#78350f',
                    textAlign: 'center'
                }}>
                    ℹ️ Voice input works best on Chrome/Edge. Use HTTPS for voice on all browsers.
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="chatbot-input" style={{ display: 'flex', gap: '8px', padding: 'clamp(8px, 2vw, 12px)' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about treks, regions, or prices..."
                    disabled={voiceConfig.isRecording}
                    style={{ flex: 1, minWidth: 0 }}
                />
                
                {/* Voice Input Button - Always visible on mobile */}
                {recognition && (
                    <button
                        type="button"
                        onClick={voiceConfig.isListening ? stopListening : startListening}
                        className="voice-btn"
                        title={voiceConfig.isListening ? "Stop listening" : "Click to speak (works on desktop & mobile)"}
                        style={{
                            background: voiceConfig.isListening 
                                ? 'linear-gradient(135deg, #dc2626, #b91c1c)' 
                                : 'var(--flare, #d95f24)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 'var(--r-pill)',
                            padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: 'clamp(12px, 3vw, 14px)',
                            flexShrink: 0,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {voiceConfig.isListening ? "🔴 Stop" : "🎙️ Voice"}
                    </button>
                )}
                
                <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    style={{
                        opacity: (!input.trim() || typing) ? 0.5 : 1,
                        cursor: (!input.trim() || typing) ? 'not-allowed' : 'pointer',
                        background: 'var(--ink-2)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 'var(--r-pill)',
                        padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        flexShrink: 0,
                        fontWeight: '600'
                    }}
                >
                    ➤
                </button>
            </form>
            
            {voiceConfig.isRecording && (
                <div style={{ 
                    padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                    textAlign: 'center',
                    fontSize: 'clamp(11px, 2vw, 12px)',
                    color: '#dc2626',
                    fontWeight: '600',
                    background: '#fef2f2',
                    borderTop: '1px solid var(--hline)',
                    animation: 'pulse 1s infinite'
                }}>
                    🎙️ Listening... Speak now! ({recognition ? 'Supported' : 'Not supported'})
                </div>
            )}
        </div>
    );
}
