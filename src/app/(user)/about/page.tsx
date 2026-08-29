import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import RidgeSVG from "@/components/RidgeSVG";
import { GUIDES } from "@/data/trek-people";
import { treks } from "@/data/treks";
import { aboutPageJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import styles from "./about.module.css";

export const metadata: Metadata = buildMetadata({
    title: "About Us",
    description:
        "Arunachal Trekking — remote guided treks exclusively inside Arunachal Pradesh, run by local trek guides who live in-country year-round.",
    path: "/about",
});

/* ----------------------------------------------------------------
   Content
   ---------------------------------------------------------------- */

const MILESTONES: { year: string; title: string; desc: string }[] = [
    {
        year: "2020",
        title: "Pioneering Arunachal treks",
        desc: "A dedicated team of local trek guides launching regular departures through the remote Eastern Himalayas.",
    },
    {
        year: "2021",
        title: "Remote region expertise",
        desc: "Licensed to arrange permits across all major Arunachal Pradesh trekking regions.",
    },
    {
        year: "2023",
        title: "Local guide team expands",
        desc: "25+ licensed trek leaders, all based in Arunachal Pradesh year-round.",
    },
    {
        year: "2024",
        title: "11 regions covered",
        desc: "From the western Kameng to the remote Dibang Valley — Arunachal Pradesh exclusively.",
    },
];

const VALUES: { title: string; desc: string; icon: string }[] = [
    {
        title: "Acclimatization first",
        desc: "Every itinerary above 3,500m carries dedicated rest days as the default plan, not an upsell. We will not compress a schedule to save a night's cost.",
        icon: "🏔️",
    },
    {
        title: "Arunachal-led, always",
        desc: "Every trek leader is licensed by Arunachal Pradesh's tourism authority and lives in-region year-round — never flown in for the season.",
        icon: "�️",
    },
    {
        title: "Fair pay on the trail",
        desc: "Porters and kitchen staff are paid above the regional guideline rate, with weight limits enforced on every departure.",
        icon: "🤝",
    },
    {
        title: "Small groups",
        desc: "Most fixed departures cap at 14–16 trekkers, with a minimum 1:8 guide-to-trekker ratio on every route.",
        icon: "👥",
    },
];

const REGIONS: { name: string; value: string; blurb: string }[] = [
    { name: "Tawang", value: "tawang", blurb: "High mountains & Monpa culture" },
    { name: "Anjaw", value: "anjaw", blurb: "Remote valleys & Dong sunrise" },
    { name: "Lohit", value: "lohit", blurb: "River gorges & Idu Mishmi" },
    { name: "Lower Subansiri", value: "lower-subansiri", blurb: "Forests & tribal villages" },
    { name: "Upper Subansiri", value: "upper-subansiri", blurb: "Alpine passes & wilderness" },
    { name: "West Kameng", value: "west-kameng", blurb: "Kameng River & rhododendrons" },
    { name: "Dibang Valley", value: "dibang-valley", blurb: "Remote alpine lakes" },
    { name: "Changlang", value: "changlang", blurb: "Tiger Reserve & wildlife" },
    { name: "West Siang", value: "west-siang", blurb: "River valleys & Galo culture" },
];

const TRUST = [
    "Arunachal Pradesh Adventure Association",
    "TAAN",
    "NMA",
    "KEEP",
    "40+ Licensed Guides",
    "In-House Permits",
];

const STATS: { num: string; lbl: string }[] = [
    { num: "2,000+", lbl: "Trekkers guided across Arunachal Pradesh" },
    { num: "97.8%", lbl: "Departures completed as scheduled" },
    { num: "25+", lbl: "Licensed local guides on staff" },
    { num: "11", lbl: "Trekking regions covered" },
];

const STORY_POINTS = [
    "Founded by local Arunachal Pradesh trek leaders",
    "Every itinerary runs entirely inside Arunachal Pradesh",
    "Guides on staff year-round, all from Arunachal Pradesh",
];

/** Images for the "trails we call home" strip (sourced from the gallery). */
const TRAIL: { src: string; alt: string; label: string }[] = [
    { src: "/Sangester.png", alt: "Sangestar Tso (Madhuri Lake) in Tawang", label: "Tawang" },
    { src: "/DongValley.png", alt: "Dong Valley in Anjaw District", label: "Anjaw" },
    { src: "/Ziro.png", alt: "Talle Valley near Ziro", label: "Ziro" },
    { src: "/Gorichen.png", alt: "Gorichen Base Camp Trek", label: "Tawang Peak" },
    { src: "/BaileyTrek.png", alt: "Bailey Trail between Dirang and Tawang", label: "Bailey Trail" },
];

/** Scrolling ticker copy — regions + trust badges in one seamless band. */
const TICKER = [
    ...REGIONS.map((r) => r.name),
    ...TRUST,
];

/* ----------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------- */

/** "Pemba Sherpa" → "PS" */
function initials(name: string): string {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function AboutPage() {
    const trekCount = (value: string) =>
        treks.filter((t) => t.region === value).length;

    return (
        <div id="main-content">
            <JsonLd
                data={[
                    aboutPageJsonLd(),
                    breadcrumbJsonLd([
                        { name: "Home", path: "/" },
                        { name: "About Us", path: "/about" },
                    ]),
                ]}
            />

            {/* ============================================================
                1 · HERO
                ============================================================ */}
            <section className={styles.hero}>
                <div className={styles.heroMedia}>
                    <Image
                        src="/images/about-hero.jpg"
                        alt="Trekking Nepal guides crossing a ridge in the Nepali Himalaya"
                        fill
                        priority
                        sizes="100vw"
                        className={styles.heroImg}
                    />
                    <div className={styles.heroScrim} aria-hidden="true" />
                </div>

                <span className={styles.heroRail} aria-hidden="true">
                    Remote Eastern Himalayan Treks
                </span>

                <div className={`wrap ${styles.heroContent}`}>
                    <div className="eyebrow">About Us</div>
                    <h1>
                        Guided by people who call these mountains <em>home.</em>
                    </h1>
                    <p className={styles.heroLede}>
                        Trekking Arunachal Pradesh runs guided treks exclusively
                        inside Arunachal Pradesh by a dedicated team of local trek
                        leaders who know every trail like their own backyard —
                        unhurried, well-acclimatized, and led by people who
                        actually live in the mountains they guide.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/treks" className="btn btn-primary">
                            Explore Our Treks
                        </Link>
                        <Link href="/contact" className="btn btn-ghost">
                            Talk to a Guide
                        </Link>
                    </div>
                </div>

                <div className={styles.heroStatsBar}>
                    <div className="wrap">
                        <div className={styles.heroStats}>
                            {STATS.map((s) => (
                                <div key={s.lbl} className={styles.heroStat}>
                                    <div className={styles.num}>{s.num}</div>
                                    <span className={styles.lbl}>{s.lbl}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================
                2 · TRUST TICKER
                ============================================================ */}
            <div className={styles.ticker} aria-hidden="true">
                <div className={styles.tickerTrack}>
                    {[0, 1].map((copy) => (
                        <div className={styles.tickerGroup} key={copy}>
                            {TICKER.map((item) => (
                                <span className={styles.tickerItem} key={`${copy}-${item}`}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ============================================================
                3 · STORY
                ============================================================ */}
            <section className={styles.story}>
                <div className={`wrap reveal ${styles.storyGrid}`} id="story-reveal">
                    <div className={styles.storyMedia}>
                        <RidgeSVG seed={4} />
                        <div className={styles.storyFrame}>
                            <Image
                                src="/Sangester.png"
                                alt="A trek guide in the Arunachal Pradesh mountains"
                                fill
                                sizes="(max-width: 900px) 100vw, 45vw"
                                className={styles.storyImg}
                            />
                        </div>
                        <div className={styles.storyBadge}>
                            <span>Remote</span>
                            <strong>Peaks</strong>
                        </div>
                        <div className={styles.storyChip}>
                            Arunachal Pradesh · India
                        </div>
                    </div>

                    <div className={styles.storyText}>
                        <div className="sec-eyebrow">A Deliberate Choice</div>
                        <h2>Doing fewer things, properly.</h2>
                        <p>
                            We made a deliberate choice to only run treks
                            inside <strong>Arunachal Pradesh</strong>. It means our guides
                            spend every season on the same trails, and our permit
                            relationships are deep rather than wide.
                        </p>
                        <p>
                            One state, eleven trekking districts, and deep connections
                            with local communities — that focus is the whole business.
                        </p>
                        <ul className={styles.storyList}>
                            {STORY_POINTS.map((point) => (
                                <li key={point}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ============================================================
                4 · TRAILS WE CALL HOME (image strip)
                ============================================================ */}
            <section className={styles.trail}>
                <div className="wrap reveal" id="trail-reveal">
                    <div className={`sec-head sec-head--center ${styles.trailHead}`}>
                        <div className="sec-eyebrow">On the Trail</div>
                        <h2>The ridges we call an office.</h2>
                        <p className="sec-lead">
                            A few frames from the valleys our guides walk every
                            season — and would happily walk again tomorrow.
                        </p>
                    </div>
                    <div className={styles.trailGrid}>
                        {TRAIL.map((t) => (
                            <figure key={t.src} className={styles.trailCard}>
                                <Image
                                    src={t.src}
                                    alt={t.alt}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 20vw"
                                    className={styles.trailImg}
                                    loading="lazy"
                                />
                                <span className={styles.trailLabel}>{t.label}</span>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                5 · VALUES
                ============================================================ */}
            <section className={styles.values}>
                <div className="wrap reveal" id="values-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">Our Approach</div>
                        <h2>What you can expect on every trail.</h2>
                        <p>
                            Four commitments we don&rsquo;t negotiate on, no
                            matter the route or the season.
                        </p>
                    </div>
                    <div className={styles.valuesGrid}>
                        {VALUES.map((v, i) => (
                            <article key={v.title} className={styles.valueCard}>
                                <span className={styles.valueNum}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span className={styles.valueIcon} aria-hidden="true">
                                    {v.icon}
                                </span>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                6 · TIMELINE
                ============================================================ */}
            <section className={styles.timeline}>
                <div className="wrap reveal" id="timeline-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">Our Journey</div>
                        <h2>Plotted like a trail.</h2>
                        <p>
                            Four markers on a route dedicated to serving the
                            remote trekking regions of Arunachal Pradesh.
                        </p>
                    </div>
                    <div className={styles.timelineList}>
                        {MILESTONES.map((m) => (
                            <div key={m.year} className={styles.timelineItem}>
                                <span className={styles.timelineDot} aria-hidden="true" />
                                <div className={styles.timelineYear}>{m.year}</div>
                                <div className={styles.timelineCard}>
                                    <h3>{m.title}</h3>
                                    <p>{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                7 · REGIONS
                ============================================================ */}
            <section className={styles.regions}>
                <div className="wrap reveal" id="regions-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">Where We Trek</div>
                        <h2>Eleven regions. One country.</h2>
                        <p>
                            From the far-western Karnali to the eastern approach
                            of Kanchenjunga — we don&rsquo;t operate anywhere
                            else.
                        </p>
                    </div>
                    <div className={styles.regionsGrid}>
                        {REGIONS.map((r) => (
                            <Link
                                key={r.value}
                                href={`/treks?region=${r.value}`}
                                className={styles.regionCard}
                            >
                                <span className={styles.regionName}>
                                    {r.name}
                                    <span className={styles.regionCount}>
                                        {trekCount(r.value)} treks
                                    </span>
                                </span>
                                <span className={styles.regionBlurb}>{r.blurb}</span>
                                <span className={styles.regionArrow} aria-hidden="true">
                                    &rarr;
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================
                8 · QUOTE
                ============================================================ */}
            <section className={styles.quote}>
                <div className={styles.quoteMedia}>
                    <Image
                        src="/images/everest.jpg"
                        alt="The Everest massif above a sea of clouds"
                        fill
                        sizes="100vw"
                        className={styles.quoteImg}
                        loading="lazy"
                    />
                    <div className={styles.quoteScrim} aria-hidden="true" />
                </div>
                <div className={`wrap reveal ${styles.quoteWrap}`} id="quote-reveal">
                    <blockquote className={styles.quoteBlock}>
                        <span className={styles.quoteMark} aria-hidden="true">
                            &ldquo;
                        </span>
                        <p>
                            I grew up in Khumbu. My father was a porter, my
                            brother is a guide. When I lead a group to Everest
                            Base Camp, I&rsquo;m not showing them a trail — I&rsquo;m
                            showing them the valley I was raised in.
                        </p>
                        <footer className={styles.quoteFooter}>
                            <span className={styles.quoteAvatar} aria-hidden="true">
                                PS
                            </span>
                            <strong>Pemba Sherpa</strong>
                            <span>Head Trek Leader, Khumbu</span>
                        </footer>
                    </blockquote>
                </div>
            </section>

            {/* ============================================================
                9 · TEAM
                ============================================================ */}
            <section className={styles.team}>
                <div className="wrap reveal" id="team-reveal">
                    <div className={styles.sectionHead}>
                        <div className="sec-eyebrow">The Team</div>
                        <h2>Trek leaders, not tour operators.</h2>
                        <p>
                            A handful of the guides who&rsquo;ll be on the trail
                            with you — plus forty more behind them.
                        </p>
                    </div>
                    <div className={styles.teamGrid}>
                        {GUIDES.map((m) => (
                            <article key={m.name} className={styles.teamCard}>
                                <div className={styles.teamAvatar}>
                                    {m.image ? (
                                        <Image
                                            src={m.image}
                                            alt={`Portrait of ${m.name}`}
                                            fill
                                            sizes="160px"
                                            className={styles.teamAvatarImg}
                                        />
                                    ) : (
                                        <span className={styles.teamAvatarInitials}>
                                            {initials(m.name)}
                                        </span>
                                    )}
                                </div>
                                <h3>{m.name}</h3>
                                <span className={styles.teamRole}>{m.role}</span>
                                {m.bio && <p className={styles.teamBio}>{m.bio}</p>}
                            </article>
                        ))}
                        <Link href="/contact" className={styles.teamJoin}>
                            <span className={styles.joinPlus} aria-hidden="true">
                                +
                            </span>
                            <h3>Join the team</h3>
                            <p>
                                We&rsquo;re always looking for licensed Nepali
                                guides to grow the group.
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============================================================
                10 · CTA
                ============================================================ */}
            <section className={styles.cta}>
                <div className="wrap reveal" id="cta-reveal">
                    <h2>Ready to walk these trails with us?</h2>
                    <p>
                        Tell us your dates and group size — a trek expert replies
                        within 24 hours with a day-by-day plan.
                    </p>
                    <div className={styles.ctaActions}>
                        <Link href="/book" className="btn btn-primary">
                            Plan My Trek
                        </Link>
                        <Link href="/contact" className="btn btn-ghost">
                            Ask a Question
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}