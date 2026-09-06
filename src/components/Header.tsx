"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import SearchBar from "./SearchBar";
import WeatherHeaderBadge from "./WeatherHeaderBadge";
import { treks } from "@/data/treks";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/treks", label: "Treks" },
    { href: "/book", label: "Packages" },
    { href: "/store", label: "Store" },
    { href: "/hub", label: "Trail Hub" },
];

const MORE_LINKS = [
    { href: "/weather", label: "Live Weather" },
    { href: "/map", label: "Trail Map" },
    { href: "/community", label: "Community" },
    { href: "/chatbot", label: "AI Assistant" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Header() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isHome = pathname === "/";
    // Inner pages start solid; the home hero starts transparent until you scroll.
    const [solid, setSolid] = useState(!isHome);
    const [hidden, setHidden] = useState(false);
    const [open, setOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);

    const dropRef = useRef<HTMLDivElement>(null);
    const moreRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);

    useEffect(() => {
        if (!isHome) {
            setSolid(true);
        }
        const onScroll = () => {
            const nextScrollY = window.scrollY;
            setSolid(!isHome || nextScrollY > 40);
            // Keep the reading area clear while moving down; reveal navigation on upward scroll.
            setHidden(nextScrollY > 96 && nextScrollY > lastScrollY.current);
            lastScrollY.current = nextScrollY;
        };
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    // Close the mobile menu and Choose Trek dropdown whenever the route changes
    useEffect(() => {
        setOpen(false);
        setDropOpen(false);
        setMoreOpen(false);
    }, [pathname]);

    // Close the Choose Trek dropdown when clicking outside of it
    useEffect(() => {
        const onDocDown = (e: MouseEvent) => {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setDropOpen(false);
            }
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
                setMoreOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocDown);
        return () => document.removeEventListener("mousedown", onDocDown);
    }, []);

    return (
        <header className={`${solid ? "solid" : ""} ${hidden ? "header-hidden" : ""}`}>
            <nav className="wrap" aria-label="Main navigation">
                <Link href="/" className="logo" onClick={() => setOpen(false)}>
                    <span className="mark">Trekking</span>
                    <span className="sub">Arunachal Pradesh</span>
                </Link>
                <SearchBar />
                <WeatherHeaderBadge />
                <div className={`nav-links ${open ? "open" : ""}`} id="navLinks">
                    <div className="nav-drop" ref={dropRef}>
                        <button
                            type="button"
                            className="nav-drop-btn"
                            aria-expanded={dropOpen}
                            aria-haspopup="true"
                            onClick={() => setDropOpen((v) => !v)}
                        >
                            Choose Trek
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                        <div
                            className={`nav-drop-menu ${dropOpen ? "open" : ""}`}
                            aria-hidden={!dropOpen}
                        >
                            {treks.slice(0, 6).map((t) => (
                                <Link
                                    key={t.slug}
                                    href={`/treks/${t.slug}`}
                                    className="nav-drop-link"
                                    onClick={() => {
                                        setDropOpen(false);
                                        setOpen(false);
                                    }}
                                >
                                    <span className="t-name">{t.name}</span>
                                    <span className="t-meta">
                                        {t.regionLabel} · {t.days} days
                                    </span>
                                </Link>
                            ))}
                            <Link
                                href="/treks"
                                className="nav-drop-all"
                                onClick={() => {
                                    setDropOpen(false);
                                    setOpen(false);
                                }}
                            >
                                View all treks
                            </Link>
                        </div>
                    </div>
                    {NAV_LINKS.map((link) => {
                        const isCurrent =
                            link.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={isCurrent ? "current" : undefined}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <div className="nav-drop nav-more" ref={moreRef}>
                        <button
                            type="button"
                            className="nav-drop-btn"
                            aria-expanded={moreOpen}
                            aria-haspopup="true"
                            onClick={() => setMoreOpen((value) => !value)}
                        >
                            More
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                        <div className={`nav-drop-menu ${moreOpen ? "open" : ""}`} aria-hidden={!moreOpen}>
                            {MORE_LINKS.map((link) => (
                                <Link key={link.href} href={link.href} className="nav-drop-link" onClick={() => { setMoreOpen(false); setOpen(false); }}>
                                    <span className="t-name">{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="nav-actions">
                        {session?.user ? (
                            <>
                                <Link
                                    href="/hub"
                                    className="nav-user"
                                    title={session.user.email ?? undefined}
                                    onClick={() => setOpen(false)}
                                >
                                    <span
                                        className="nav-user-avatar"
                                        aria-hidden="true"
                                    >
                                        {(
                                            session.user.name ||
                                            session.user.email ||
                                            "?"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                    <span className="nav-user-name">
                                        {session.user.name?.split(" ")[0] ||
                                            "Account"}
                                    </span>
                                </Link>
                                <button
                                    type="button"
                                    className="nav-login"
                                    onClick={() =>
                                        signOut({ callbackUrl: "/" })
                                    }
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login?mode=register"
                                className="nav-login"
                                onClick={() => setOpen(false)}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Sign up
                            </Link>
                        )}
                        <Link
                            href="/book"
                            className="nav-cta"
                            onClick={() => setOpen(false)}
                        >
                            Book a Trek
                        </Link>
                    </div>
                </div>
                <button
                    type="button"
                    className={`burger ${open ? "open" : ""}`}
                    aria-label="Menu"
                    aria-controls="navLinks"
                    aria-expanded={open}
                    onClick={() => {
                        setHidden(false);
                        setOpen((v) => !v);
                    }}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </nav>
            <div
                className={`nav-overlay ${open ? "open" : ""}`}
                onClick={() => setOpen(false)}
                aria-hidden="true"
            />
        </header>
    );
}
