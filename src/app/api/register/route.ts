import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/users";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/register
 *
 * Creates a new email/password account in the `users` table and returns
 * the created user. The client then signs in with Credentials and is
 * redirected to /account.
 *
 * Success: 200 { ok: true, user: { id, name, email } }
 * Errors:  400 (bad input), 409 (email already registered), 500 (db)
 */
export async function POST(request: Request) {
    const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
    if (process.env.VERCEL && databaseUrl.startsWith("file:")) {
        return NextResponse.json(
            {
                ok: false,
                error: "Account creation is not available on this deployment yet. Connect a hosted database before enabling sign-up.",
            },
            { status: 503 }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: "Invalid request." },
            { status: 400 }
        );
    }

    const { name, email, password, role } = (body ?? {}) as {
        name?: unknown;
        email?: unknown;
        password?: unknown;
        role?: unknown;
    };

    const fullName = typeof name === "string" ? name.trim() : "";
    const cleanEmail =
        typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPassword = typeof password === "string" ? password : "";
    const cleanRole = typeof role === "string" ? role : "tourist";

    if (fullName.length < 2) {
        return NextResponse.json(
            { ok: false, error: "Please enter your full name." },
            { status: 400 }
        );
    }
    if (!EMAIL_RE.test(cleanEmail)) {
        return NextResponse.json(
            { ok: false, error: "Enter a valid email address." },
            { status: 400 }
        );
    }
    if (cleanPassword.length < 8) {
        return NextResponse.json(
            { ok: false, error: "Password must be at least 8 characters." },
            { status: 400 }
        );
    }
    if (!(["tourist", "guide", "seller"] as string[]).includes(cleanRole)) {
        return NextResponse.json(
            { ok: false, error: "Choose a valid account role." },
            { status: 400 }
        );
    }

    try {
        const existing = await findUserByEmail(cleanEmail);
        if (existing) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "An account with that email already exists. Try logging in.",
                },
                { status: 409 }
            );
        }

        const user = await createUser({
            name: fullName,
            email: cleanEmail,
            password: cleanPassword,
            role: cleanRole as "tourist" | "guide" | "seller",
        });

        return NextResponse.json({
            ok: true,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("[api/register] failed to create user:", err);
        return NextResponse.json(
            { ok: false, error: "Could not create your account right now. Please try again." },
            { status: 500 }
        );
    }
}
