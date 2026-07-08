import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
/* ---- Load .env.local into process.env (tiny parser, no dotenv dep) ---- */
function loadEnvFile(): void {
    try {
        
        const raw = readFileSync(resolve(".env.local"), "utf8");
        for (const line of raw.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eq = trimmed.indexOf("=");
            if (eq === -1) continue;
            const key = trimmed.slice(0, eq).trim();
            let value = trimmed.slice(eq + 1).trim();
            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }
            if (!(key in process.env)) process.env[key] = value;
        }
    } catch {
        /* no .env.local — fall back to real env vars */
    }
}

loadEnvFile();

function getDatabasePath(): string {
    const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
    return dbUrl.replace("file:", "");
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    image         TEXT,
    provider      TEXT NOT NULL DEFAULT 'credentials',
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id             TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_email     TEXT NOT NULL,
    reference      TEXT NOT NULL UNIQUE,
    trek_slug      TEXT NOT NULL,
    trek_name      TEXT NOT NULL,
    days           INTEGER NOT NULL,
    departure      DATE NOT NULL,
    departure_type TEXT NOT NULL DEFAULT 'fixed',
    group_size     INTEGER NOT NULL DEFAULT 1,
    name           TEXT NOT NULL,
    email          TEXT NOT NULL,
    phone          TEXT,
    country        TEXT,
    notes          TEXT,
    total          REAL NOT NULL DEFAULT 0,
    status         TEXT NOT NULL DEFAULT 'new',
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_email) REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS treks (
    slug       TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    data       TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    trek_slug     TEXT NOT NULL,
    user_name     TEXT NOT NULL,
    user_email    TEXT,
    rating        INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    title         TEXT NOT NULL,
    comment       TEXT NOT NULL,
    visited_month TEXT,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    verified      INTEGER NOT NULL DEFAULT 1,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_posts (
    id              TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title           TEXT NOT NULL,
    content         TEXT NOT NULL,
    category        TEXT NOT NULL,
    author_name     TEXT NOT NULL,
    author_location TEXT,
    trek_slug       TEXT,
    upvotes         INTEGER NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

async function main(): Promise<void> {
    const dbPath = getDatabasePath();
    console.log(`→ Connecting to SQLite database: ${dbPath}`);
    
    const db = new Database(dbPath);
    
    // Execute schema
    db.exec(SCHEMA);
    console.log("✓ Tables ensured: users, bookings, treks, reviews, community_posts");

    // Seed a demo email/password account so login works out of the box.
    const email = "demo@trekkingarunachal.com";
    const name = "Demo Trekker";
    const password = "demo1234";

    const existing = db.prepare("SELECT id FROM users WHERE lower(email) = lower(?)").get(email);

    if (!existing) {
        const passwordHash = await bcrypt.hash(password, 12);
        db.prepare(
            `INSERT INTO users (name, email, password_hash, provider)
             VALUES (?, ?, ?, 'credentials')`
        ).run(name, email, passwordHash);
        console.log(`✓ Seeded demo user: ${email} / ${password}`);
    } else {
        console.log(`ℹ Demo user already exists (${email}) — skipping.`);
    }

    // Seed initial reviews if empty
    const reviewCount = db.prepare("SELECT COUNT(*) as count FROM reviews").get() as { count: number };
    if (reviewCount.count === 0) {
        const seedReviews = [
            {
                trek_slug: "sangestar-tso-madhuri-lake-loop",
                user_name: "Aakash Sharma",
                rating: 5,
                title: "Surreal alpine lake surrounded by snow peaks",
                comment: "Sangestar Tso was breathtaking! The weathered dead trees sticking out of the water against the Himalayan backdrop look like a painting. The local guide Dorjee was extremely knowledgeable about Monpa culture.",
                visited_month: "October 2024",
                helpful_count: 14
            },
            {
                trek_slug: "sangestar-tso-madhuri-lake-loop",
                user_name: "Elena Rostova",
                rating: 5,
                title: "Gentle acclimatisation trek with world-class views",
                comment: "Did this as my first trek in Arunachal. The road from Tawang was an adventure in itself. Cold wind but crystal clear blue skies. Highly recommend bringing warm layers and windbreakers!",
                visited_month: "May 2024",
                helpful_count: 9
            },
            {
                trek_slug: "dong-valley-sunrise-trek",
                user_name: "Priya Mukherjee",
                rating: 5,
                title: "First rays of sunlight in India — unforgettable!",
                comment: "The 2:30 AM night hike up Dong Valley was chilly and steep, but when the first sunlight touched the jagged crests across the border into Myanmar, everyone went silent in awe. A spiritual experience.",
                visited_month: "December 2024",
                helpful_count: 22
            },
            {
                trek_slug: "talle-valley-trek",
                user_name: "Marcus Vance",
                rating: 5,
                title: "Dense subtropical forest & fascinating Apatani culture",
                comment: "Walking through giant bamboo groves and fern canopies felt prehistoric. Pange River camp was tranquil, and spending time in Hong village learning about traditional farming was a highlight.",
                visited_month: "March 2024",
                helpful_count: 11
            },
            {
                trek_slug: "seven-lakes-trek-anini",
                user_name: "Dr. Rohan Sengupta",
                rating: 5,
                title: "Wildest, most pristine expedition in India",
                comment: "Seven Lakes is challenging and raw. Zero phone reception, pure untouched wilderness, and dramatic glacial tarns. The local Idu Mishmi porters and guides are the true masters of these ridges.",
                visited_month: "September 2024",
                helpful_count: 31
            }
        ];

        const insertReview = db.prepare(`
            INSERT INTO reviews (trek_slug, user_name, rating, title, comment, visited_month, helpful_count, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `);

        for (const rev of seedReviews) {
            insertReview.run(rev.trek_slug, rev.user_name, rev.rating, rev.title, rev.comment, rev.visited_month, rev.helpful_count);
        }
        console.log("✓ Seeded verified trekker reviews");
    }

    // Seed initial community posts if empty
    const postCount = db.prepare("SELECT COUNT(*) as count FROM community_posts").get() as { count: number };
    if (postCount.count === 0) {
        const seedPosts = [
            {
                title: "Sela Pass & Tawang Road Condition Update (Sep 2026)",
                content: "Just returned through the Sela Tunnel! Road is clear and asphalted well on both sides. Heavy mist around 3 PM, so plan your drive before 1 PM for the best visibility. Sangestar Lake loop trail is crisp and dry.",
                category: "trail-update",
                author_name: "Tashi Wangchuk",
                author_location: "Bomdila, AP",
                trek_slug: "sangestar-tso-madhuri-lake-loop",
                upvotes: 18
            },
            {
                title: "Looking for 2 partners for Seven Lakes Expedition (mid-October)",
                content: "Planning the 11-day Seven Lakes Trek starting from Dibrugarh around Oct 14. We are two experienced hikers from Bengaluru. Looking for 1-2 more trekkers to share the local guide, porters, and vehicle cost. Anyone interested?",
                category: "buddy-finder",
                author_name: "Vikram & Ananya",
                author_location: "Bengaluru",
                trek_slug: "seven-lakes-trek-anini",
                upvotes: 24
            },
            {
                title: "Permit requirements: ILP vs PAP for Foreign Trekkers",
                content: "For Indian nationals, the e-ILP is easily applied online with voter ID/Aadhar and processed within 24-48h. For foreign passport holders, PAP requires min 2 individuals and is routed through registered Arunachal tour operators. Don't leave it to the last minute!",
                category: "qa",
                author_name: "Arunachal Trek Team",
                author_location: "Itanagar",
                trek_slug: null,
                upvotes: 35
            },
            {
                title: "Best footwear for Talle Valley rainforest trail?",
                content: "Quick tip for anyone doing Talle Valley between April and October: Waterproof trail running shoes or Gore-Tex boots with gaiters are essential. Also keep salt / tobacco powder handy for forest leeches around the lower river sections.",
                category: "gear",
                author_name: "Subir Nath",
                author_location: "Guwahati",
                trek_slug: "talle-valley-trek",
                upvotes: 15
            }
        ];

        const insertPost = db.prepare(`
            INSERT INTO community_posts (title, content, category, author_name, author_location, trek_slug, upvotes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        for (const p of seedPosts) {
            insertPost.run(p.title, p.content, p.category, p.author_name, p.author_location, p.trek_slug, p.upvotes);
        }
        console.log("✓ Seeded authentic community discussions & trail updates");
    }

    db.close();
    console.log("Done.");
}

main().catch((err: unknown) => {
    console.error(
        "Initialization failed:",
        err instanceof Error ? err.message : String(err)
    );
    console.error(
        "Check DATABASE_URL in .env.local (or PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE)."
    );
    process.exit(1);
});