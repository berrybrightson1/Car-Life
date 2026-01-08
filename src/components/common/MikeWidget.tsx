
"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

type Message = {
    id: string;
    role: 'user' | 'bot';
    text: string;
};

export default function MikeWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'bot', text: "Yo. Mike here. I handle the logistics. Need to track something or ask about shipping rules?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    // Command Processor
    const processResponse = (text: string) => {
        const navRegex = /\[\[NAVIGATE:(.*?)\]\]/;
        const match = text.match(navRegex);

        if (match && match[1]) {
            const route = match[1].trim();
            const cleanText = text.replace(navRegex, '').trim();

            // Execute Navigation
            toast.promise(
                new Promise((resolve) => {
                    setTimeout(() => {
                        router.push(route);
                        resolve(true);
                    }, 800);
                }),
                {
                    loading: `Mike is taking you to ${route}...`,
                    success: 'Here we are!',
                    error: 'Could not navigate.'
                }
            );

            return cleanText;
        }

        return text;
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            // Call Server Action
            const response = await fetch('/api/mike', {
                method: 'POST',
                body: JSON.stringify({ message: userMsg.text, history: messages }),
            });

            const data = await response.json();

            if (data.reply) {
                const cleanReply = processResponse(data.reply);
                setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: cleanReply }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: "Network error. Even I can't fix that." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <motion.div
            drag
            dragMomentum={false}
            className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[380px] max-w-[calc(100vw-40px)] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[600px] max-h-[80vh]"
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 flex items-center gap-4 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                            <div className="relative w-12 h-12 rounded-full border-2 border-white/50 p-0.5 bg-white">
                                <img
                                    src="https://ui-avatars.com/api/?name=Mike&background=1E40AF&color=fff&bold=true"
                                    className="w-full h-full rounded-full object-cover"
                                    alt="Mike Avatar"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg leading-tight">Mike</h3>
                                <p className="text-blue-100 text-xs flex items-center gap-1.5 opacity-90">
                                    <Sparkles size={10} /> Logistics Copilot
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50 space-y-4 scrollbar-thin">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    {msg.role === 'bot' && (
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            <img src="https://ui-avatars.com/api/?name=Mike&background=1E40AF&color=fff&bold=true" className="w-full h-full" alt="Mike Avatar Small" />
                                        </div>
                                    )}

                                    <div
                                        className={`p-3.5 max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        <img src="https://ui-avatars.com/api/?name=Mike&background=1E40AF&color=fff&bold=true" className="w-full h-full" alt="Mike Typing" />
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex gap-1 items-center h-10 w-16">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-full px-4 py-1.5 focus-within:ring-2 ring-blue-500/20 transition-all border border-transparent focus-within:border-blue-500/30 focus-within:bg-white flex items-center">
                                <label htmlFor="mike-input" className="sr-only">Message Mike</label>
                                <input
                                    id="mike-input"
                                    type="text"
                                    className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-gray-800 placeholder:text-gray-400"
                                    placeholder="Ask about shipments..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                                title="Send Message"
                                aria-label="Send Message"
                            >
                                <Send size={18} className={isTyping ? "opacity-0" : "ml-0.5"} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-900 rotate-45' : 'bg-blue-600 rotate-0 hover:rotate-12'
                    }`}
                title={isOpen ? "Close Chat" : "Open Chat"}
                aria-label={isOpen ? "Close Chat" : "Open Chat"}
            >
                {isOpen ? <X color="white" size={24} /> : <MessageCircle color="white" size={28} />}
            </motion.button>
        </motion.div>
    );
}
