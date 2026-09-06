import { NextResponse } from "next/server";
import { treks } from "@/data/treks";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Build a compact, factual profile of every trek so the model answers with
 * the site's real data (names, days, grades, altitudes, prices, seasons)
 * instead of guessing.
 */
function buildTrekContext(): string {
    return treks
        .map((t) => {
            const overview =
                t.overview.length > 220
                    ? `${t.overview.slice(0, 220)}…`
                    : t.overview;
            return [
                `- ${t.name}`,
                `  Region: ${t.regionLabel}`,
                `  Duration: ${t.days} days`,
                `  Grade: ${t.grade}`,
                `  Max altitude: ${t.altitude}`,
                `  Price: ${t.price} per person`,
                `  Best months: ${t.bestMonths}`,
                `  Start point: ${t.startPoint}`,
                `  Overview: ${overview}`,
            ].join("\n");
        })
        .join("\n\n");
}

const SYSTEM_PROMPT = `You are TrekBot, the friendly AI travel assistant for Trekking Arunachal Pradesh, an Arunachal Pradesh trekking company. You help website visitors choose and plan treks in the beautiful northeastern state of India.

Rules:
1. Ground every answer in the AVAILABLE TREKS data below. Give real trek names, durations, grades, max altitudes, prices, best months and start points from that data.
2. If the user asks about a trek that is NOT in the data, say you do not currently offer it and recommend the closest matching listed trek instead.
3. For "best time to go", prefer each trek's listed best months, and mention that autumn (Sep–Nov) and spring (Apr–Jun) are the main trekking seasons in Arunachal Pradesh.
4. Be friendly, concise and accurate. Keep answers under ~180 words. Use "Namaste 🙏" only occasionally.
5. You may answer general Arunachal Pradesh trekking questions (fitness, permits, packing, altitude) using well-established knowledge, but never invent specific prices, durations or altitudes that contradict the data.
6. Remember that Arunachal Pradesh requires special permits (Inner Line Permit for Indians, Protected Area Permit for foreigners).
7. Mention the unique Eastern Himalayan ecosystem, diverse tribal cultures, and that it's India's easternmost state when relevant.

AVAILABLE TREKS:
__TREKS__`;

export async function POST(req: Request) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "AI assistant is not configured yet. Set OPENROUTER_API_KEY in your environment." },
            { status: 503 }
        );
    }

    let message: string;
    try {
        const body = await req.json();
        message = typeof body?.message === "string" ? body.message : "";
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (!message.trim()) {
        return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
    const payload = {
        model,
        messages: [
            { role: "system", content: SYSTEM_PROMPT.replace("__TREKS__", buildTrekContext()) },
            { role: "user", content: message },
        ],
        temperature: 0.6,
        max_tokens: 700,
        stream: false,
    };

    try {
        const res = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", // Required by OpenRouter
                "X-Title": "Trekking Arunachal Pradesh", // Optional, for OpenRouter analytics
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errText = await res.text();
            return NextResponse.json(
                { error: `OpenRouter API error (${res.status}): ${errText.slice(0, 200)}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content?.trim();
        if (!reply) {
            return NextResponse.json({ error: "Empty response from OpenRouter." }, { status: 502 });
        }

        return NextResponse.json({ reply });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Failed to reach OpenRouter." },
            { status: 500 }
        );
    }
}