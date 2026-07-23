"use client";

import { useState } from "react";

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
    trekName?: string;
    days?: number;
    size?: "sm" | "md" | "lg";
    style?: "floating" | "inline" | "badge";
}

export default function WhatsAppButton({
    phoneNumber = "+916009276459", // Arunachal Pradesh local guide helpline
    message = "Hi! I am planning a trek in Arunachal Pradesh and would like more details.",
    trekName,
    days,
    size = "md",
    style = "floating",
}: WhatsAppButtonProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    const getPrefilledMessage = () => {
        if (trekName) {
            return `Namaste! I am interested in booking the ${trekName}${days ? ` (${days} Days)` : ""}. Could you please share available departure dates, permit process (ILP/PAP), and package inclusions?`;
        }
        return message;
    };

    const handleWhatsAppClick = () => {
        const text = encodeURIComponent(getPrefilledMessage());
        const cleanedNumber = phoneNumber.replace(/[^0-9]/g, "");
        const url = `https://wa.me/${cleanedNumber}?text=${text}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    if (style === "inline") {
        const sizePadding = size === "sm" ? "8px 14px" : size === "lg" ? "14px 28px" : "11px 20px";
        const fontSize = size === "sm" ? "12px" : size === "lg" ? "15px" : "13px";

        return (
            <button
                type="button"
                onClick={handleWhatsAppClick}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "linear-gradient(135deg, #25D366, #128C7E)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "var(--r-pill, 999px)",
                    padding: sizePadding,
                    fontSize,
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(37, 211, 102, 0.45)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(37, 211, 102, 0.35)";
                }}
                title="Inquire instantly on WhatsApp"
            >
                <span style={{ fontSize: "16px" }}>💬</span>
                <span>Inquire on WhatsApp</span>
            </button>
        );
    }

    if (style === "badge") {
        return (
            <button
                type="button"
                onClick={handleWhatsAppClick}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(37, 211, 102, 0.12)",
                    color: "#128C7E",
                    border: "1px solid rgba(37, 211, 102, 0.3)",
                    borderRadius: "16px",
                    padding: "4px 10px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer"
                }}
                title="Direct WhatsApp chat"
            >
                <span>🟢</span>
                <span>WhatsApp Expert</span>
            </button>
        );
    }

    // Floating Button (fixed bottom-left to avoid clashing with ChatBot at bottom-right)
    return (
        <div
            style={{
                position: "fixed",
                bottom: "28px",
                left: "28px",
                zIndex: 998,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                fontFamily: "var(--font-sans, system-ui)",
            }}
        >
            {/* Tooltip Popup */}
            {showTooltip && (
                <div
                    style={{
                        marginBottom: "12px",
                        background: "#fff",
                        color: "var(--ink, #151a20)",
                        padding: "12px 16px",
                        borderRadius: "14px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                        border: "1px solid var(--hline, #e1dbcb)",
                        maxWidth: "240px",
                        fontSize: "12px",
                        lineHeight: 1.4,
                        animation: "fadeIn 0.2s ease-out",
                    }}
                >
                    <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#25D366", display: "inline-block" }} />
                        Local Guide Online
                    </div>
                    <div>Have questions about permits or trail gear? Message our local team directly!</div>
                </div>
            )}

            <button
                type="button"
                onClick={handleWhatsAppClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50px",
                    padding: "12px 20px",
                    boxShadow: "0 6px 24px rgba(37, 211, 102, 0.45)",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "14px",
                    transition: "all 0.25s ease",
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                }}
                aria-label="Chat on WhatsApp"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp Us</span>
            </button>
        </div>
    );
}