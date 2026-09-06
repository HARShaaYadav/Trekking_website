import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

interface CommunityRow {
    id: string;
    title: string;
    content: string;
    category: string;
    author_name: string;
    author_location: string | null;
    trek_slug: string | null;
    upvotes: number;
    created_at: string;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        let result;

        if (category && category !== "all") {
            result = await query<CommunityRow>(
                `
                SELECT id, title, content, category, author_name, author_location, trek_slug, upvotes, created_at
                FROM community_posts
                WHERE category = ?
                ORDER BY upvotes DESC, created_at DESC
                `,
                [category]
            );
        } else {
            result = await query<CommunityRow>(
                `
                SELECT id, title, content, category, author_name, author_location, trek_slug, upvotes, created_at
                FROM community_posts
                ORDER BY upvotes DESC, created_at DESC
                `
            );
        }

        return NextResponse.json({ posts: result.rows });
    } catch (error) {
        console.error("Failed to fetch community posts:", error);
        return NextResponse.json({ error: "Failed to fetch community posts" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, id, title, content, category, author_name, author_location, trek_slug } = body;

        // Upvote action
        if (action === "upvote" && id) {
            await query("UPDATE community_posts SET upvotes = upvotes + 1 WHERE id = ?", [id]);
            return NextResponse.json({ success: true });
        }

        // New post
        if (!title || !content || !category || !author_name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await query(
            `
            INSERT INTO community_posts (title, content, category, author_name, author_location, trek_slug, upvotes)
            VALUES (?, ?, ?, ?, ?, ?, 1)
            `,
            [
                title.trim(),
                content.trim(),
                category.trim(),
                author_name.trim(),
                author_location ? author_location.trim() : "Arunachal Trekker",
                trek_slug || null
            ]
        );

        return NextResponse.json({ success: true, message: "Community post published" });
    } catch (error) {
        console.error("Failed to process community request:", error);
        return NextResponse.json({ error: "Failed to process community request" }, { status: 500 });
    }
}

