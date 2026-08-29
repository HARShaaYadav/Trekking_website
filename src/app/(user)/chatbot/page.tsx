import Link from "next/link";
import ChatBotPage from "@/components/chatbot-page";

export const metadata = {
    title: "AI Travel Assistant - TrekBot | Trekking Arunachal Pradesh",
    description: "Chat with TrekBot, your AI travel assistant for Arunachal Pradesh treks. Get personalized recommendations, ask questions about routes, and plan your adventure with voice support.",
};

export default function ChatBotPageRoute() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Meet TrekBot 🤖
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            Your AI travel assistant for Arunachal Pradesh trekking adventures
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mb-6">
                            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                                💬 Chat with AI
                            </div>
                            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                                🎙️ Voice Support
                            </div>
                            <div className="bg-white px-4 py-2 rounded-full shadow-sm">
                                🗣️ Text-to-Speech
                            </div>
                        </div>
                    </div>
                    
                    <ChatBotPage />
                    
                    <div className="mt-8 text-center">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                Need Human Help?
                            </h2>
                            <p className="text-gray-600 mb-4">
                                While TrekBot is great at answering questions, sometimes you need to speak with a real trekking expert.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Contact Our Team →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}