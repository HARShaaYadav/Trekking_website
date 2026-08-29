export interface BlogPost {
    slug: string;
    title: string;
    category: string;
    excerpt: string;
    date: string;
    read: string;
    href: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: "best-time-to-trek-arunachal",
        title: "The Best Time to Trek in Arunachal Pradesh, Month by Month",
        category: "Planning",
        excerpt:
            "Spring or autumn? When the rhododendrons bloom versus the clearest mountain air — and the months we quietly steer first-timers away from.",
        date: "May 28, 2026",
        read: "6 min read",
        href: "/blog",
    },
    {
        slug: "tawang-monastery-trek",
        title: "Tawang Monastery: Arunachal's Spiritual Heart and Trekking Base",
        category: "Arunachal Pradesh",
        excerpt:
            "At 10,000 feet in the Eastern Himalayas, Tawang Monastery is one of the world's highest and a gateway to some of Arunachal's most beautiful treks.",
        date: "May 12, 2026",
        read: "8 min read",
        href: "/treks/monpa-culture-trek",
    },
    {
        slug: "dong-valley-vs-talle-valley",
        title: "Dong Valley or Talle Valley? Choosing Your First Arunachal Trek",
        category: "Compare",
        excerpt:
            "Two very different first routes — one a remote high-altitude valley, the other a forest trek through pristine wilderness. We break down the trade-offs.",
        date: "April 30, 2026",
        read: "7 min read",
        href: "/treks/dong-valley-sunrise-trek",
    },
    {
        slug: "monpa-village-etiquette",
        title: "Monpa Village Etiquette: 9 Things Every First-Time Trekker Should Know",
        category: "Culture",
        excerpt:
            "From respecting prayer flags to understanding Buddhist customs — the cultural practices that make a homestay in Arunachal villages meaningful and respectful.",
        date: "April 15, 2026",
        read: "5 min read",
        href: "/blog",
    },
    {
        slug: "packing-list-2026",
        title: "The 2026 Nepal Trekking Packing List",
        category: "Gear",
        excerpt:
            "Everything we tell our guests to bring — and the handful of things that should stay home. Built from fifteen seasons of what actually gets used.",
        date: "March 22, 2026",
        read: "9 min read",
        href: "/blog",
    },
    {
        slug: "altitude-sickness-guide",
        title: "Altitude Sickness: Prevention, Symptoms and What to Do",
        category: "Safety",
        excerpt:
            "The most important chapter in any trekker's preparation — how acclimatization works, the warning signs, and when to turn around.",
        date: "March 4, 2026",
        read: "10 min read",
        href: "/blog",
    },
];