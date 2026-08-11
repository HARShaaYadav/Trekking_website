import Link from "next/link";
import ChatBotPage from "@/components/chatbot-page";

export const metadata = {
    title: "AI Travel Assistant - TrekBot | Trekking Arunachal Pradesh",
    description: "Chat with TrekBot, your AI travel assistant for Arunachal Pradesh treks. Get personalized recommendations, ask questions about routes, and plan your adventure with voice support.",
};

export default function ChatBotPageRoute() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--mist)' }}>
            {/* Hero Section */}
            <div className="page-hero">
                <div className="wrap">
                    <div className="eyebrow">
                        <span>AI Assistant</span>
                    </div>
                    <h1>Meet TrekBot 🤖</h1>
                    <p className="lede">
                        Your intelligent AI travel assistant for Arunachal Pradesh trekking adventures. 
                        Get personalized recommendations, ask questions about routes, and plan your perfect trek 
                        with advanced voice support and natural conversation.
                    </p>
                </div>
            </div>

            {/* Main Chat Interface */}
            <section className="wrap" style={{ paddingTop: 'var(--sec)', paddingBottom: 'var(--sec)' }}>
                <div className="reveal">
                    {/* Feature highlights */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '20px',
                        marginBottom: '40px',
                        textAlign: 'center'
                    }}>
                        <div style={{ 
                            background: '#fff', 
                            padding: '20px',
                            borderRadius: 'var(--r-lg)',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--hline)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
                            <div style={{ fontWeight: '600', color: 'var(--ink)' }}>Smart Chat</div>
                            <div style={{ fontSize: '13px', color: 'var(--sub)', marginTop: '4px' }}>
                                Natural conversation about treks
                            </div>
                        </div>
                        <div style={{ 
                            background: '#fff', 
                            padding: '20px',
                            borderRadius: 'var(--r-lg)',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--hline)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎙️</div>
                            <div style={{ fontWeight: '600', color: 'var(--ink)' }}>Voice Input</div>
                            <div style={{ fontSize: '13px', color: 'var(--sub)', marginTop: '4px' }}>
                                Speak your questions naturally
                            </div>
                        </div>
                        <div style={{ 
                            background: '#fff', 
                            padding: '20px',
                            borderRadius: 'var(--r-lg)',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--hline)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗣️</div>
                            <div style={{ fontWeight: '600', color: 'var(--ink)' }}>Audio Responses</div>
                            <div style={{ fontSize: '13px', color: 'var(--sub)', marginTop: '4px' }}>
                                Hear answers with text-to-speech
                            </div>
                        </div>
                    </div>
                    
                    {/* Chat Interface */}
                    <div style={{ 
                        maxWidth: '900px', 
                        margin: '0 auto',
                        background: '#fff',
                        borderRadius: 'var(--r-xl)',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--hline)',
                        overflow: 'hidden'
                    }}>
                        <ChatBotPage />
                    </div>
                </div>
            </section>
            
            {/* Call to Action */}
            <section style={{ 
                background: 'var(--night)', 
                color: 'var(--mist)',
                padding: 'var(--sec) 0'
            }}>
                <div className="wrap" style={{ textAlign: 'center' }}>
                    <h2 style={{ 
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(28px, 4vw, 40px)',
                        marginBottom: '20px',
                        color: 'var(--mist)'
                    }}>
                        Need Human Expertise?
                    </h2>
                    <p style={{ 
                        fontSize: '16px',
                        color: 'var(--stone)',
                        marginBottom: '32px',
                        maxWidth: '540px',
                        margin: '0 auto 32px'
                    }}>
                        While TrekBot is incredibly knowledgeable, sometimes you need the personal touch 
                        of our experienced trek guides who know every trail in Arunachal Pradesh.
                    </p>
                    <Link
                        href="/contact"
                        className="nav-cta"
                        style={{ display: 'inline-flex' }}
                    >
                        <span>Contact Our Expert Team</span>
                        <span style={{ fontSize: '16px' }}>→</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}