"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            const dismissed = localStorage.getItem("pwa_banner_dismissed");
            if (!dismissed) {
                setShowBanner(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
            setShowBanner(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem("pwa_banner_dismissed", "true");
    };

    if (!showBanner) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "96px",
                zIndex: 997,
                background: "var(--night-2, #132130)",
                color: "#f4efe5",
                border: "1px solid rgba(243, 238, 228, 0.2)",
                borderRadius: "var(--r-lg, 16px)",
                padding: "16px 20px",
                boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
                maxWidth: "340px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                animation: "fadeIn 0.3s ease-out"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "24px" }}>📱</span>
                    <div>
                        <strong style={{ fontSize: "14px", color: "#fff", display: "block" }}>Install Arunachal Treks</strong>
                        <span style={{ fontSize: "11px", color: "var(--stone, #cfc7b6)" }}>1-Tap access with offline trail guides</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDismiss}
                    style={{
                        background: "none",
                        border: "none",
                        color: "var(--stone, #cfc7b6)",
                        fontSize: "16px",
                        cursor: "pointer",
                        padding: "0 4px"
                    }}
                >
                    ✕
                </button>
            </div>

            <p style={{ margin: 0, fontSize: "12px", color: "var(--stone, #cfc7b6)", lineHeight: 1.4 }}>
                Keep trail routes, elevation profiles, and emergency packing lists available when you lose mobile coverage in remote valleys.
            </p>

            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button
                    type="button"
                    onClick={handleInstall}
                    style={{
                        flex: 1,
                        background: "var(--flare, #d95f24)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "var(--r-pill, 999px)",
                        padding: "8px 14px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer"
                    }}
                >
                    Install App
                </button>
                <button
                    type="button"
                    onClick={handleDismiss}
                    style={{
                        background: "rgba(255,255,255,0.08)",
                        color: "#f4efe5",
                        border: "none",
                        borderRadius: "var(--r-pill, 999px)",
                        padding: "8px 14px",
                        fontSize: "12px",
                        cursor: "pointer"
                    }}
                >
                    Later
                </button>
            </div>
        </div>
    );
}
