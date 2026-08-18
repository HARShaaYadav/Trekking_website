import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const db = getDb();
        let posts;

        if (category && category !== "all") {
            posts = db.prepare(`
                SELECT id, title, content, category, author_name, author_location, trek_slug, upvotes, created_at
                FROM community_posts
                WHERE category = ?
                ORDER BY upvotes DESC, created_at DESC
            `).all(category);
        } else {
            posts = db.prepare(`
                SELECT id, title, content, category, author_name, author_location, trek_slug, upvotes, created_at
                FROM community_posts
                ORDER BY upvotes DESC, created_at DESC
            `).all();
        }

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Failed to fetch community posts:", error);
        return NextResponse.json({ error: "Failed to fetch community posts" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, id, title, content, category, author_name, author_location, trek_slug } = body;

        const db = getDb();

        // Upvote action
        if (action === "upvote" && id) {
            db.prepare("UPDATE community_posts SET upvotes = upvotes + 1 WHERE id = ?").run(id);
            return NextResponse.json({ success: true });
        }

        // New post
        if (!title || !content || !category || !author_name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const stmt = db.prepare(`
            INSERT INTO community_posts (title, content, category, author_name, author_location, trek_slug, upvotes)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        `);

        stmt.run(
            title.trim(),
            content.trim(),
            category.trim(),
            author_name.trim(),
            author_location ? author_location.trim() : "Arunachal Trekker",
            trek_slug || null
        );

        return NextResponse.json({ success: true, message: "Community post published" });
    } catch (error) {
        console.error("Failed to process community request:", error);
        return NextResponse.json({ error: "Failed to process community request" }, { status: 500 });
    }
}
