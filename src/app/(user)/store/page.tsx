import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import StoreFront from "./StoreFront";

export const metadata: Metadata = buildMetadata({
    title: "Mountain Makers Store",
    description: "Shop thoughtful local craft, wool, jewellery and pantry goods from Arunachal Pradesh.",
    path: "/store",
});

export default function StorePage() {
    return <StoreFront />;
}
