import { Pool, type QueryResultRow } from "pg";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadLocalEnvironment(): void {
    try {
        const raw = readFileSync(resolve(".env.local"), "utf8");
        for (const line of raw.split(/\r?\n/)) {
            const separator = line.indexOf("=");
            if (separator < 1 || line.trimStart().startsWith("#")) continue;
            const key = line.slice(0, separator).trim();
            const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
            if (!process.env[key]) process.env[key] = value;
        }
    } catch {
        // Next.js and hosted platforms provide environment variables directly.
    }
}

loadLocalEnvironment();

const connectionString = process.env.DATABASE_URL;

if (!connectionString || !connectionString.startsWith("postgres")) {
    throw new Error("DATABASE_URL must be a PostgreSQL connection string.");
}

const pool = new Pool({ connectionString });

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    image TEXT,
    provider TEXT NOT NULL DEFAULT 'credentials',
    role TEXT NOT NULL DEFAULT 'tourist',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
    user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    reference TEXT NOT NULL UNIQUE,
    trek_slug TEXT NOT NULL,
    trek_name TEXT NOT NULL,
    days INTEGER NOT NULL,
    departure DATE NOT NULL,
    departure_type TEXT NOT NULL DEFAULT 'fixed',
    group_size INTEGER NOT NULL DEFAULT 1,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    notes TEXT,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS treks (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
    trek_slug TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    visited_month TEXT,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    verified INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS community_posts (
    id TEXT PRIMARY KEY DEFAULT md5(random()::text || clock_timestamp()::text),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_location TEXT,
    trek_slug TEXT,
    upvotes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

let schemaPromise: Promise<void> | null = null;

async function ensureSchema(): Promise<void> {
    if (!schemaPromise) {
        schemaPromise = pool.query(SCHEMA).then(() => undefined).catch((error) => {
            schemaPromise = null;
            throw error;
        });
    }
    return schemaPromise;
}

function normalizePlaceholders(sql: string): string {
    if (sql.includes("$1")) return sql;
    let index = 0;
    return sql.replace(/\?/g, () => `$${++index}`);
}

export async function query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = []
): Promise<{ rows: T[]; rowCount: number }> {
    await ensureSchema();
    const result = await pool.query<T>(normalizePlaceholders(sql), params);
    return { rows: result.rows, rowCount: result.rowCount ?? 0 };
}
