import type { Testimonial, TrekGuide } from "@/lib/types";

/* ============================================================
   PEOPLE — a single source of truth for the site's testimonials
   and local guides.

   Both the homepage testimonials, the about-page team grid and
   the trek detail page ("Reviews" + "Your Local Guide") read from
   here so there is only ever one copy of this content.
   ============================================================ */

export const TESTIMONIALS: Testimonial[] = [
    {
        name: "James M.",
        trek: "Sangestar Tso (Madhuri Lake) Loop",
        quote:
            "Our guide, Tenzin, knew every prayer flag and local story around Madhuri Lake. The high-altitude lake experience felt intimate and deeply connected to Monpa culture.",
    },
    {
        name: "Priya K.",
        trek: "Talle Valley Trek",
        quote:
            "The acclimatization days weren't rushed — our guide refused to push us through the bamboo forests until everyone felt ready. That care made all the difference.",
    },
    {
        name: "David L.",
        trek: "Bailey Trail Trek",
        quote:
            "Barely saw another trekking group across the high passes. If you want authentic Eastern Himalayan wilderness without crowds, this is it.",
    },
    {
        name: "Sophia R.",
        trek: "Monpa Culture & Heritage Trek",
        quote:
            "Our guide's family connections in Tawang opened doors to monasteries and villages that tourists rarely visit. A genuine cultural exchange throughout.",
    },
];

/**
 * Local trek leaders / ambassadors featured on trek detail pages.
 * Each guide carries the region(s) they lead so a detail page can show
 * the guides that are genuinely responsible for that trek.
 */
export const GUIDES: TrekGuide[] = [
    {
        name: "Tenzin Monpa",
        role: "Head Trek Leader, Tawang Region",
        region: "tawang",
        image: "/Sangester.png",
        bio: "Leads the Sangestar Tso, Monpa Culture and Gorichen Base Camp routes. Raised in Tawang, he has spent over a decade guiding trekkers through high-altitude monasteries and Monpa villages.",
    },
    {
        name: "Anu Mishmi",
        role: "Trek Leader, Lohit & Anjaw Regions",
        region: "lohit",
        bio: "Guides Dong Valley Sunrise Trek and Lohit Valley Explorer routes. Known for deep knowledge of tribal customs, river crossings and pre-dawn mountain hikes.",
    },
    {
        name: "Dorje Tamang",
        role: "Trek Leader, Lower Subansiri & Dibang Valley",
        region: "lower-subansiri",
        bio: "Leads Talle Valley and Seven Lakes treks with intimate knowledge of Apatani culture, bamboo forests and remote alpine lakes across the region.",
    },
    {
        name: "Karma Apa",
        role: "Operations & Permits, Itanagar",
        region: "west-kameng",
        bio: "Runs permits, logistics and guide coordination from the Itanagar office, ensuring every Arunachal Pradesh departure is fully arranged before trekkers arrive.",
    },
];