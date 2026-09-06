import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ReviewRow {
    id: string;
    trek_slug: string;
    user_name: string;
    rating: number;
    title: string;
    comment: string;
    visited_month: string | null;
    helpful_count: number;
    verified: number;
    created_at: string;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        let result;

        if (slug) {
            result = await query<ReviewRow>(
                `
                SELECT id, trek_slug, user_name, rating, title, comment, visited_month, helpful_count, verified, created_at
                FROM reviews
                WHERE trek_slug = ?
                ORDER BY created_at DESC
                `,
                [slug]
            );
        } else {
            result = await query<ReviewRow>(
                `
                SELECT id, trek_slug, user_name, rating, title, comment, visited_month, helpful_count, verified, created_at
                FROM reviews
                ORDER BY created_at DESC
                LIMIT 30
                `
            );
        }

        return NextResponse.json({ reviews: result.rows });
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

        await query(
            `
            INSERT INTO reviews (trek_slug, user_name, user_email, rating, title, comment, visited_month, helpful_count, verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1)
            `,
            [
                trek_slug,
                user_name.trim(),
                user_email ? user_email.trim() : null,
                numericRating,
                title.trim(),
                comment.trim(),
                visited_month ? visited_month.trim() : "Recent"
            ]
        );

        return NextResponse.json({ success: true, message: "Review submitted successfully" });
    } catch (error) {
        console.error("Failed to submit review:", error);
        return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }
}

