import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { findUserById } from "@/lib/users";
import { buildMetadata } from "@/lib/seo";
import RoleHub from "./RoleHub";

export const metadata = buildMetadata({
    title: "Trail Hub",
    description: "A role-aware workspace for Arunachal trekkers, local guides and mountain makers.",
    path: "/hub",
    noIndex: true,
});

export default async function HubPage() {
    const session = await auth();
    if (!session?.user) redirect("/login?mode=register");

    const user = session.user.id ? await findUserById(session.user.id).catch(() => null) : null;
    const role = user?.role ?? "tourist";

    return (
        <main className="hub-page">
            <RoleHub name={session.user.name ?? "Trail friend"} email={session.user.email ?? ""} role={role} />
        </main>
    );
}
