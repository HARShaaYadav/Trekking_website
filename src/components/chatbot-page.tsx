"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
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
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

    // Initialize speech services
    useEffect(() => {
        if (typeof window !== "undefined") {
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
                
                return () => {
                    window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
                };
            }
            
            // Initialize speech recognition
            if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
                const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
                const recognition = new SpeechRecognition();
                
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = "en-US";
                
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
                };
                
                recognition.onend = () => {
                    setVoiceConfig(prev => ({ ...prev, isListening: false, isRecording: false }));
                };
                
                setRecognition(recognition);
            }
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
            }
            recognition.start();
        }
    };

    const stopListening = () => {
        if (recognition && voiceConfig.isListening) {
            recognition.stop();
        }
    };

    const speakText = (text: string) => {
        if (synthesis && availableVoices.length > 0) {
            // Cancel any ongoing speech
            synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = availableVoices[voiceConfig.selectedVoiceIndex] || null;
            utterance.rate = voiceConfig.speechRate;
            utterance.pitch = voiceConfig.speechPitch;
            
            utterance.onstart = () => {
                setVoiceConfig(prev => ({ ...prev, isSpeaking: true }));
                currentUtterance.current = utterance;
            };
            
            utterance.onend = () => {
                setVoiceConfig(prev => ({ ...prev, isSpeaking: false }));
                currentUtterance.current = null;
            };
            
            utterance.onerror = (event) => {
                console.error("Speech synthesis error:", event.error);
                setVoiceConfig(prev => ({ ...prev, isSpeaking: false }));
                currentUtterance.current = null;
            };
            
            synthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        if (synthesis && voiceConfig.isSpeaking) {
            synthesis.cancel();
            setVoiceConfig(prev => ({ ...prev, isSpeaking: false }));
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
        try {
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
        
        // Auto-speak bot reply if synthesis is available
        if (synthesis && availableVoices.length > 0) {
            setTimeout(() => speakText(reply), 500);
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        send(input);
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-lg">🤖</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">TrekBot</h2>
                            <p className="text-orange-100 text-sm">AI Assistant for Arunachal Pradesh Treks</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {voiceConfig.isSpeaking && (
                            <button
                                onClick={stopSpeaking}
                                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                                title="Stop speaking"
                            >
                                🔇
                            </button>
                        )}
                        <div className="text-right text-sm text-orange-100">
                            <div>🎙️ Voice enabled</div>
                            <div>🗣️ Text-to-speech ready</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Voice Settings Panel */}
            {voiceConfig.voicesLoaded && availableVoices.length > 0 && (
                <div className="bg-gray-50 p-3 border-b">
                    <details className="text-sm">
                        <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                            Voice Settings
                        </summary>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Voice
                                </label>
                                <select
                                    value={voiceConfig.selectedVoiceIndex}
                                    onChange={(e) => setVoiceConfig(prev => ({ 
                                        ...prev, 
                                        selectedVoiceIndex: parseInt(e.target.value) 
                                    }))}
                                    className="w-full px-2 py-1 border rounded text-xs"
                                >
                                    {availableVoices.map((voice, index) => (
                                        <option key={index} value={index}>
                                            {voice.name} ({voice.lang})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Speed: {voiceConfig.speechRate}
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
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Pitch: {voiceConfig.speechPitch}
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
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </details>
                </div>
            )}

            {/* Chat Messages */}
            <div 
                ref={scrollRef}
                className="h-96 overflow-y-auto p-4 space-y-4"
                style={{ height: '500px' }}
            >
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            m.from === "user" 
                                ? "bg-orange-500 text-white" 
                                : "bg-gray-100 text-gray-800"
                        }`}>
                            <div className="whitespace-pre-wrap">{m.text}</div>
                            <div className={`text-xs mt-1 ${
                                m.from === "user" ? "text-orange-100" : "text-gray-500"
                            }`}>
                                {m.timestamp.toLocaleTimeString()}
                            </div>
                            {m.from === "bot" && synthesis && (
                                <button
                                    onClick={() => speakText(m.text)}
                                    className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded mt-2 transition-colors"
                                    disabled={voiceConfig.isSpeaking}
                                >
                                    🔊 Speak
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {typing && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Replies */}
            <div className="p-4 border-t bg-gray-50">
                <div className="flex flex-wrap gap-2 mb-3">
                    {QUICK_REPLIES.map((q) => (
                        <button
                            key={q}
                            onClick={() => send(q)}
                            className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition-colors"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about treks, regions, or prices..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={voiceConfig.isRecording}
                    />
                    
                    {/* Voice Input Button */}
                    {recognition && (
                        <button
                            type="button"
                            onClick={voiceConfig.isListening ? stopListening : startListening}
                            className={`p-2 rounded-lg transition-colors ${
                                voiceConfig.isListening 
                                    ? "bg-red-500 text-white animate-pulse" 
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            title={voiceConfig.isListening ? "Stop listening" : "Start voice input"}
                        >
                            {voiceConfig.isListening ? "🔴" : "🎙️"}
                        </button>
                    )}
                    
                    <button
                        type="submit"
                        disabled={!input.trim() || typing}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Send
                    </button>
                </div>
                
                {voiceConfig.isRecording && (
                    <div className="mt-2 text-center text-sm text-red-600 font-medium">
                        🎙️ Listening... Speak now!
                    </div>
                )}
            </form>
        </div>
    );
}