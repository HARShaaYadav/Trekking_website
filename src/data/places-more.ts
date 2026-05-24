import type { Trek } from "@/lib/types";

// Additional Arunachal Pradesh treks across various regions
// Including multi-day expeditions in Tawang, Anjaw, Lohit, and remote frontier areas
export const moreTreks: Trek[] = [
    // ───────────────────────────── TAWANG ─────────────────────────────
    {
        slug: "monpa-culture-trek",
        image: "/monpa-culture.png",
        name: "Monpa Culture & Heritage Trek",
        region: "tawang",
        regionLabel: "Tawang District, Arunachal Pradesh",
        days: 5,
        grade: "Easy to Moderate",
        altitude: "10,500 ft / 3,200 m",
        startPoint: "Tawang Town",
        endingPoint: "Tawang",
        bestMonths: "Mar–Jun, Sep–Nov",
        groupSize: "4–12",
        price: "$580",
        overview:
            "Explore the rich Monpa Buddhist culture of Tawang District through visits to ancient monasteries, traditional villages and sacred pilgrimage sites. This trek combines short walks with cultural immersion, offering insights into Monpa traditions, architecture and spiritual practices in the heart of the Eastern Himalayas.",
        highlights: [
            "Tawang Monastery, one of the world''s highest and most important Buddhist centers",
            "Traditional Monpa wooden architecture and villages",
            "Sacred pilgrimage routes and prayer sites",
            "Local Monpa hospitality and cultural exchange",
        ],
        itinerary: [
            {
                t: "Arrive in Tawang and cultural orientation",
                d: "Meet your guide and explore Tawang town, visit local monasteries and markets.",
                alt: "10,200 ft",
                hrs: "3–4 hrs walking",
            },
            {
                t: "Tawang to Jampaling Gompa",
                d: "Trek through forest trails to the scenic Jampaling Monastery with views toward the Bhutanese border.",
                alt: "11,200 ft",
                hrs: "4–5 hrs",
            },
            {
                t: "Explore Monpa villages and monasteries",
                d: "Visit traditional villages, meet Monpa families and visit smaller gompas in the region.",
                alt: "10,500 ft",
                hrs: "3–4 hrs walking",
            },
            {
                t: "Tawang Monastery deep dive",
                d: "Full-day exploration of the great monastery complex including prayer halls, libraries and meditation caves.",
                alt: "10,000 ft",
                hrs: "4–5 hrs exploration",
            },
            {
                t: "Return to Tawang",
                d: "Final walk and rest day in Tawang town.",
                alt: "10,200 ft",
                hrs: "2–3 hrs walking",
            },
        ],
        included: [
            "Local guide with deep cultural knowledge",
            "Accommodation in Tawang guesthouses",
            "All meals including traditional Monpa cuisine",
            "Monastery entry fees and permits",
            "Cultural visits and interactions",
        ],
        excluded: [
            "Travel to Tawang",
            "Personal trekking gear",
            "Travel insurance",
            "Personal expenses",
        ],
        faqs: [
            {
                q: "Do I need to be Buddhist to enjoy this trek?",
                a: "No. This trek is designed for all visitors interested in learning about Monpa culture and Buddhist heritage. Respect for local customs is appreciated.",
            },
            {
                q: "Are the walks difficult?",
                a: "Most walks are easy to moderate, suitable for general fitness levels. Daily walks are 3–5 hours.",
            },
        ],
    },
];
export function getMoreTrek(slug: string): typeof moreTreks[0] | undefined {
    return moreTreks.find((trek) => trek.slug === slug);
}
