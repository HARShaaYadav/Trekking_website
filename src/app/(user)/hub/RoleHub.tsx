"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./hub.module.css";

type Role = "tourist" | "guide" | "seller";

const roleMeta: Record<Role, { eyebrow: string; title: string; description: string; mark: string }> = {
    tourist: { eyebrow: "Traveller workspace", title: "Your next mountain story starts here.", description: "Keep every booked route, free registration and trail document in one calm, useful place.", mark: "T" },
    guide: { eyebrow: "Guide workspace", title: "Make every departure feel looked after.", description: "Confirm paid departures, share clear trail notes and keep your availability visible to trekkers.", mark: "G" },
    seller: { eyebrow: "Maker workspace", title: "Bring Arunachal craft to the trail.", description: "Manage products, fulfil new orders and keep a simple pulse on your mountain business.", mark: "S" },
};

export default function RoleHub({ name, email, role }: { name: string; email: string; role: Role }) {
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [message, setMessage] = useState("");
    const [availability, setAvailability] = useState("12 Oct - 19 Oct");
    const [orderState, setOrderState] = useState<"New" | "Accepted" | "Cancelled">("New");
    const [products, setProducts] = useState(4);
    const meta = roleMeta[role];

    function downloadCertificate() {
        const file = new Blob([`TREKKING ARUNACHAL\n\nCertificate of trail completion\nPresented to ${name}\nDong Valley Sunrise Trek\n\nWalk lightly. Return with stories.`], { type: "text/plain" });
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = "dong-valley-trek-certificate.txt";
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.grid} aria-hidden="true" />
                <div className={`wrap ${styles.heroInner}`}>
                    <div className={styles.identity}><span>{meta.mark}</span><div><p>{meta.eyebrow}</p><strong>{name}</strong></div></div>
                    <div className={styles.heroCopy}><p className={styles.eyebrow}>{meta.eyebrow}</p><h1>{meta.title}</h1><p>{meta.description}</p></div>
                    <Link href="/account" className={styles.accountLink}>Account settings</Link>
                </div>
            </section>
            <section className={`wrap ${styles.workspace}`}>
                {role === "tourist" && <TouristPanel downloadCertificate={downloadCertificate} />}
                {role === "guide" && <GuidePanel paymentConfirmed={paymentConfirmed} setPaymentConfirmed={setPaymentConfirmed} message={message} setMessage={setMessage} availability={availability} setAvailability={setAvailability} />}
                {role === "seller" && <SellerPanel products={products} setProducts={setProducts} orderState={orderState} setOrderState={setOrderState} />}
                <aside className={styles.sideRail}>
                    <div className={styles.profileCard}><span className={styles.avatar}>{name.charAt(0).toUpperCase()}</span><p>Signed in as</p><strong>{name}</strong><small>{email}</small><Link href="/account">Edit profile</Link></div>
                    <div className={styles.helpCard}><span>Trail support</span><p>Need a hand with a booking, delivery or departure?</p><Link href="/contact">Talk to our team</Link></div>
                </aside>
            </section>
        </>
    );
}

function TouristPanel({ downloadCertificate }: { downloadCertificate: () => void }) {
    return <div className={styles.content}>
        <div className={styles.statRow}><Stat value="02" label="Upcoming paid trips" /><Stat value="01" label="Free trail registration" /><Stat value="4.9" label="Your trail rating" /></div>
        <section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.kicker}>Paid packages</p><h2>Upcoming adventures</h2></div><Link href="/book">Book a package</Link></div><article className={styles.trip}><div className={styles.tripImage}>G</div><div><span className={styles.status}>Payment received</span><h3>Gorichen Base Camp</h3><p>Booking TA-4821 · 14-20 October 2026 · 4 travellers</p><small>Custom plan: 7 days · Moderate · ₹18,900 per person</small></div><div className={styles.tripActions}><strong>₹75,600</strong><button>View itinerary</button><small>Cancel by 14 Sep for a full refund</small></div></article><article className={styles.pastTrip}><div><span>Completed · TA-3810</span><h3>Talle Valley Trek</h3><p>March 2026 · Certificate ready</p></div><button onClick={downloadCertificate}>Download certificate</button></article></section>
        <section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.kicker}>No-cost trails</p><h2>Free trek registrations</h2></div><Link href="/treks">Explore free treks</Link></div><div className={styles.freeTrek}><span>01</span><div><h3>Dong Valley Sunrise Walk</h3><p>Registered for 02 November 2026 · Orientation pack will arrive 7 days before.</p></div><button>View details</button></div></section>
        <section className={styles.discover}><p>Small-group packages built around your pace.</p><Link href="/treks">Compare routes, budgets and reviews <span>→</span></Link></section>
    </div>;
}

function GuidePanel({ paymentConfirmed, setPaymentConfirmed, message, setMessage, availability, setAvailability }: { paymentConfirmed: boolean; setPaymentConfirmed: (value: boolean) => void; message: string; setMessage: (value: string) => void; availability: string; setAvailability: (value: string) => void }) {
    return <div className={styles.content}>
        <div className={styles.statRow}><Stat value="03" label="Assigned departures" /><Stat value="12" label="Trekkers this month" /><Stat value="94%" label="Response rate" /></div>
        <section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.kicker}>Assigned paid booking</p><h2>Gorichen Base Camp</h2></div><span className={paymentConfirmed ? styles.success : styles.pending}>{paymentConfirmed ? "Payment confirmed" : "Payment pending"}</span></div><div className={styles.guideBooking}><div><h3>TA-4821 · 4 trekkers</h3><p>14-20 October 2026 · Moderate · 7 days</p><p className={styles.muted}>Lead traveller: Aanya Sharma · +91 98765 43210</p></div><button onClick={() => setPaymentConfirmed(true)} disabled={paymentConfirmed}>{paymentConfirmed ? "Payment confirmed" : "Confirm payment"}</button></div><label className={styles.messageLabel}>Message your travellers<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Share a welcome note, packing reminder or meeting point..." /></label><button className={styles.sendButton} disabled={!message.trim()} onClick={() => setMessage("")}>Send trail update</button></section>
        <section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.kicker}>Your calendar</p><h2>Availability</h2></div></div><div className={styles.availability}><input value={availability} onChange={(event) => setAvailability(event.target.value)} aria-label="Available dates" /><span>Open for bookings</span><button>Save availability</button></div></section>
    </div>;
}

function SellerPanel({ products, setProducts, orderState, setOrderState }: { products: number; setProducts: (value: number) => void; orderState: "New" | "Accepted" | "Cancelled"; setOrderState: (value: "New" | "Accepted" | "Cancelled") => void }) {
    return <div className={styles.content}>
        <div className={styles.statRow}><Stat value={`0${products}`} label="Active products" /><Stat value="06" label="New orders" /><Stat value="₹18.4k" label="This month's earnings" /></div>
        <section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.kicker}>Order board</p><h2>New order · AR-1068</h2></div><span className={orderState === "Accepted" ? styles.success : orderState === "Cancelled" ? styles.cancelled : styles.pending}>{orderState}</span></div><div className={styles.order}><div><h3>Handwoven Yak Wool Stole × 1</h3><p>For Riya Khanna · Itanagar · ₹2,400</p><small>Delivery: Dispatch within 2 working days</small></div><div className={styles.orderButtons}><button onClick={() => setOrderState("Accepted")}>Accept</button><button className={styles.reject} onClick={() => setOrderState("Cancelled")}>Reject</button></div></div></section>
        <section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.kicker}>Your shelf</p><h2>Product listings</h2></div><button className={styles.addProduct} onClick={() => setProducts(products + 1)}>+ Add product</button></div><div className={styles.productGrid}><Product name="Bamboo trail basket" category="Bamboo handicrafts" price="₹1,250" stock="8 in stock" /><Product name="Yak wool stole" category="Yak wool products" price="₹2,400" stock="3 in stock" /><Product name="Monpa bead bracelet" category="Tribal jewelry" price="₹780" stock="14 in stock" /></div></section>
    </div>;
}

function Stat({ value, label }: { value: string; label: string }) { return <div className={styles.stat}><strong>{value}</strong><span>{label}</span></div>; }
function Product({ name, category, price, stock }: { name: string; category: string; price: string; stock: string }) { return <article className={styles.product}><div className={styles.productArt}>{name.charAt(0)}</div><p>{category}</p><h3>{name}</h3><div><strong>{price}</strong><span>{stock}</span></div><button>Edit listing</button></article>; }
