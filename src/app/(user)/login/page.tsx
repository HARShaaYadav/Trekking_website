import type { Metadata } from "next";
import AuthContainer from "@/components/AuthContainer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
    title: "Login / Register",
    description:
        "Log in or create a Trekking Arunachal Pradesh account to manage your bookings, saved treks, and expedition plans.",
    path: "/login",
    noIndex: true,
});

interface LoginPageProps {
    searchParams: Promise<{ mode?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
    const params = await searchParams;
    const initialMode = params.mode === "register" ? "register" : "login";

    return (
        <section className="auth-section">
            <svg
                className="auth-ridge"
                viewBox="0 0 1440 160"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path
                    fill="#25324A"
                    fillOpacity="0.06"
                    d="M0,160 L0,96 L140,64 L280,88 L420,48 L560,84 L700,36 L840,72 L980,28 L1120,64 L1260,44 L1440,76 L1440,160 Z"
                />
            </svg>

            <div className="wrap login-wrap">
                <AuthContainer initialMode={initialMode} />
            </div>
        </section>
    );
}
