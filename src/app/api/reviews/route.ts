import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        const db = getDb();
        let reviews;

        if (slug) {
            reviews = db.prepare(`
                SELECT id, trek_slug, user_name, rating, title, comment, visited_month, helpful_count, verified, created_at
                FROM reviews
                WHERE trek_slug = ?
                ORDER BY created_at DESC
            `).all(slug);
        } else {
            reviews = db.prepare(`
                SELECT id, trek_slug, user_name, rating, title, comment, visited_month, helpful_count, verified, created_at
                FROM reviews
                ORDER BY created_at DESC
                LIMIT 30
            `).all();
        }

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { trek_slug, user_name, user_email, rating, title, comment, visited_month } = body;

        if (!trek_slug || !user_name || !rating || !title || !comment) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const numericRating = Number(rating);
        if (numericRating < 1 || numericRating > 5) {
            return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO reviews (trek_slug, user_name, user_email, rating, title, comment, visited_month, helpful_count, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1)
        `);

        stmt.run(
            trek_slug,
            user_name.trim(),
            user_email ? user_email.trim() : null,
            numericRating,
            title.trim(),
            comment.trim(),
            visited_month ? visited_month.trim() : "Recent"
        );

        return NextResponse.json({ success: true, message: "Review submitted successfully" });
    } catch (error) {
        console.error("Failed to submit review:", error);
        return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }
}
