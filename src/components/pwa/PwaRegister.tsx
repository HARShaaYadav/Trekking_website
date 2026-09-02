"use client";

import { useEffect, useState } from "react";

export default function PwaRegister() {
    // Start as false on both server and client to avoid hydration mismatch.
    // The real online/offline state is set after mount in useEffect.
    const [isOffline, setIsOffline] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .catch((err) => {
                    console.log("ServiceWorker registration failed: ", err);
                });
        }

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Sync with actual current state after mount
        setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Don't render anything until after hydration is complete
    if (!mounted || !isOffline) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10000,
                background: "#b0402f",
                color: "#fff",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: 600,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
            }}
            role="status"
            aria-live="polite"
        >
            <span>📡</span>
            <span>You are currently offline in the mountains. Cached trail guides remain accessible.</span>
            <a
                href="/offline"
                style={{
                    color: "#fff",
                    textDecoration: "underline",
                    marginLeft: "8px",
                    fontWeight: 700
                }}
            >
                View Offline Survival Guide →
            </a>
        </div>
    );
}
