import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0d1721",
                    borderRadius: "6px",
                }}
             >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M8 48 L24 20 L34 34 L40 24 L56 48 Z" fill="#D95F24" />
                    <path d="M18 48 L46 48 L32 26 Z" fill="#F4EFE5" opacity="0.9" />
                    <circle cx="48" cy="16" r="5" fill="#F59E0B" />
                </svg>
            </div>
        ),
        size
    );
}
