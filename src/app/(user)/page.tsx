import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroContours from "@/components/HeroContours";
import JsonLd from "@/components/JsonLd";
import TrekCard from "@/components/TrekCard";
import WeatherWidget from "@/components/WeatherWidget";
import { treks } from "@/data/treks";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

const DESTINATIONS = [
    { value: "tawang", name: "Tawang", tag: "High Himalaya", desc: "High lakes, monasteries and dramatic Himalayan valleys around Sangestar Tso and Gorichen." },
    { value: "anjaw", name: "Anjaw", tag: "Eastern Frontier", desc: "Remote valleys, traditional villages and the unforgettable Dong Valley sunrise." },
    { value: "lower-subansiri", name: "Ziro & Talle Valley", tag: "Forest & Culture", desc: "Apatani cultural landscapes, bamboo forests and peaceful mountain camps." },
    { value: "west-kameng", name: "West Kameng", tag: "Historic Trails", desc: "The Bailey Trail’s high passes, Monpa settlements and wild mountain terrain." },
    { value: "dibang-valley", name: "Dibang Valley", tag: "Remote Wilderness", desc: "Anini and the Seven Lakes: an expedition into Arunachal’s most remote alpine country." },
];

const WHY = [
    { n: "01", t: "Routes designed for Arunachal", d: "Every itinerary is built around the state’s remote valleys, local weather and permit requirements." },
    { n: "02", t: "Local mountain knowledge", d: "Our routes are led with local expertise across Tawang, Anjaw, Ziro, West Kameng and Dibang Valley." },
    { n: "03", t: "Permits planned early", d: "We help you prepare the permits and entry requirements needed for remote Arunachal travel." },
    { n: "04", t: "Small, considered groups", d: "We keep groups manageable for safer trail pacing and a lighter footprint in fragile mountain environments." },
];

export const metadata: Metadata = buildMetadata({
    title: "Arunachal Pradesh Treks — Guided Himalayan Adventures",
    description: "Explore six unforgettable trekking routes across Arunachal Pradesh: Tawang, Dong Valley, Talle Valley, Gorichen, the Bailey Trail and Seven Lakes.",
    path: "/",
});

export default function HomePage() {
    const regionCount = new Set(treks.map((trek) => trek.region)).size;

    return (
        <>
            <JsonLd data={itemListJsonLd(treks.map((trek) => ({ name: trek.name, path: `/treks/${trek.slug}` })))} />
            <section className="hero">
                <HeroContours />
                <Image className="hero-image" src="/Sangester.png" alt="Sangestar Tso in Tawang, Arunachal Pradesh" fill priority sizes="100vw" />
                <div className="hero-scrim" aria-hidden="true" />
                <div className="wrap hero-content">
                    <div className="eyebrow">Arunachal Pradesh · India’s eastern Himalaya</div>
                    <h1>Walk the wild <em>eastern Himalaya</em> of Arunachal Pradesh.</h1>
                    <p className="lede">From Madhuri Lake in Tawang to the remote Seven Lakes of Anini, discover intimate guided treks through high passes, ancient forests and living mountain cultures.</p>
                    <div className="hero-actions">
                        <Link href="/treks" className="btn btn-primary">Browse Arunachal Treks</Link>
                        <Link href="/contact" className="btn btn-ghost">Plan Your Trek</Link>
                    </div>
                    <div className="hero-meta">
                        <div><span className="num">{treks.length}</span><span className="lbl">Signature Treks</span></div>
                        <div><span className="num">{regionCount}</span><span className="lbl">Regions Covered</span></div>
                        <div><span className="num">1</span><span className="lbl">Remarkable State</span></div>
                        <div><span className="num">Small</span><span className="lbl">Group Adventures</span></div>
                    </div>
                </div>
                <div className="scroll-cue" aria-hidden="true" />
            </section>

            <section className="trek-carousel-section">
                <div className="wrap reveal">
                    <div className="sec-head"><div className="sec-eyebrow">Featured Treks</div><h2>Six extraordinary routes, one wild frontier.</h2><p>Choose a short lakeside walk, a forest trek, or a full Himalayan expedition.</p></div>
                    <div className="trek-carousel">{treks.map((trek) => <TrekCard key={trek.slug} trek={trek} />)}</div>
                    <div className="sec-more"><Link href="/treks" className="sec-link">View all Arunachal treks →</Link></div>
                </div>
            </section>

            <section className="dest-section">
                <div className="wrap reveal">
                    <div className="sec-head"><div className="sec-eyebrow">Destinations</div><h2>Follow the trail into Arunachal.</h2><p>Each region brings a different landscape, culture and way of walking.</p></div>
                    <div className="dest-grid">{DESTINATIONS.map((destination) => <Link key={destination.value} href={`/treks?region=${destination.value}`} className="dest-card"><span className="dest-tag">{destination.tag}</span><h3>{destination.name}</h3><p>{destination.desc}</p><span className="dest-link">Explore routes →</span></Link>)}</div>
                </div>
            </section>

            {/* Interactive Trail Atlas Feature Callout */}
            <section className="sec-block sec-block--band" style={{ background: "linear-gradient(180deg, #132130 0%, #0d1721 100%)", color: "#f4efe5", padding: "60px 0" }}>
                <div className="wrap reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "36px", alignItems: "center" }}>
                    <div>
                        <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--flare, #d95f24)", fontWeight: 700 }}>
                            Himalayan Navigation
                        </span>
                        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", color: "#fff", fontFamily: "var(--font-serif)", margin: "8px 0 14px 0" }}>
                            Explore Arunachal on our Interactive Trail Atlas
                        </h2>
                        <p style={{ fontSize: "15px", color: "var(--stone, #cfc7b6)", lineHeight: 1.6, marginBottom: "24px" }}>
                            From Sela Pass to the Seven Glacial Lakes of Anini, visualize elevations, daily stage waypoints, live regional weather, and trail difficulty ratings across every mountain district.
                        </p>
                        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                            <Link href="/map" className="btn btn-primary">
                                Open Interactive Trail Map →
                            </Link>
                            <Link href="/community" className="btn btn-ghost" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}>
                                Trekker Community & Trail Updates
                            </Link>
                        </div>
                    </div>

                    <div style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "var(--r-lg, 16px)",
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "28px" }}>🗺️</span>
                            <div>
                                <strong style={{ color: "#fff", fontSize: "15px", display: "block" }}>GPS Waypoints & Contours</strong>
                                <span style={{ fontSize: "12px", color: "var(--stone, #cfc7b6)" }}>Interactive district pins and elevation curves</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "28px" }}>⛅</span>
                            <div>
                                <strong style={{ color: "#fff", fontSize: "15px", display: "block" }}>Live Mountain Weather</strong>
                                <span style={{ fontSize: "12px", color: "var(--stone, #cfc7b6)" }}>Altitude advisories & 4-day regional forecasts</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "28px" }}>📱</span>
                            <div>
                                <strong style={{ color: "#fff", fontSize: "15px", display: "block" }}>Offline Trail Packs (PWA)</strong>
                                <span style={{ fontSize: "12px", color: "var(--stone, #cfc7b6)" }}>Save routes & packing checklists on your device</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="why-arunachal">
                <div className="wrap reveal">
                    <div className="sec-head"><div className="sec-eyebrow">Why Trek Arunachal</div><h2>Travel deeper, with care.</h2><p>Remote trails reward thoughtful planning, capable local support and a flexible mountain mindset.</p></div>
                    <div className="why-nepal-grid">{WHY.map((item) => <article key={item.n} className="why-nepal-card"><span className="why-nepal-num">{item.n}</span><h3>{item.t}</h3><p>{item.d}</p></article>)}</div>
                </div>
            </section>
        </>
    );
}
