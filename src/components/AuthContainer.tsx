"use client";

import { useState } from "react";
import LoginForm from "./LogInForm";
import RegisterForm from "./registerForm";

export default function AuthContainer({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
    const [mode, setMode] = useState<"login" | "register">(initialMode);

    return (
        <>
            {mode === "login" ? (
                <LoginForm onSwitch={() => setMode("register")} />
            ) : (
                <RegisterForm onSwitch={() => setMode("login")} />
            )}
        </>
    );
}
