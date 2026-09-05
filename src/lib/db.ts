import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env.local
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
        /* no .env.local */
    }
}

loadEnvFile();

function getDatabasePath(): string {
    const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
    return dbUrl.replace("file:", "");
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (!db) {
        const dbPath = getDatabasePath();
        db = new Database(dbPath);
        // Enable foreign keys
        db.pragma('foreign_keys = ON');

        // Keep existing local databases compatible with the role-aware hub.
        const columns = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
        if (columns.length > 0 && !columns.some((column) => column.name === "role")) {
            db.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'tourist'");
        }
    }
    return db;
}

// Helper function to simulate PostgreSQL's query interface
export async function query<T = any>(sql: string, params: any[] = []): Promise<{ rows: T[]; rowCount: number }> {
    const db = getDb();
    
    try {
        // Convert PostgreSQL placeholders ($1, $2, ...) to SQLite placeholders (?)
        let convertedSql = sql.replace(/\$\d+/g, '?');
        
        if (convertedSql.trim().toUpperCase().startsWith('SELECT')) {
            const stmt = db.prepare(convertedSql);
            const rows = stmt.all(...params) as T[];
            return { rows, rowCount: rows.length };
        } else {
            const stmt = db.prepare(convertedSql);
            const result = stmt.run(...params);
            return { rows: [], rowCount: result.changes };
        }
    } catch (error) {
        console.error('Database query error:', error, 'SQL:', sql);
        throw error;
    }
}
