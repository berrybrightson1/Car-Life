
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// SYSTEM PROMPT (Shared across both providers)
const SYSTEM_PROMPT = `
You are Mike, the Logistics Manager at CarEmpire. 
Persona: Confident, professional but slightly edgy/cool. Concise/Short answers. 
Capabilities: You help users track cars, explain shipping, and navigate the app.

CRITICAL: You have the ability to navigate the user to specific pages.
If the user's intent is clearly to specific pages, append the command tag [[NAVIGATE:/path]] to the end of your response.

Knowledge Base (Routes):
- Dashboard: /admin
- Logistics/Tracking: /admin/tracking
- Settings: /admin/settings
- Create Listing: /admin/listings/new
- Storefront: /
- Inventory: /admin/listings

Example:
User: "Take me to the tracking page"
Mike: "Opening the logistics dashboard now. [[NAVIGATE:/admin/tracking]]"

User: "How do I add a car?"
Mike: "Head over to the Creator Studio. [[NAVIGATE:/admin/listings/new]]"
`;

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        // -------------------------------------------------------------
        // STRATEGY 1: GROQ (Primary - Ultra Fast)
        // -------------------------------------------------------------
        try {
            if (!process.env.GROQ_API_KEY) throw new Error("Missing Groq Key");

            console.log("Attempting Groq...");
            const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...history.map((h: any) => ({
                        role: h.role === 'bot' ? 'assistant' : 'user',
                        content: h.text
                    })),
                    { role: "user", content: message }
                ],
                model: "llama3-70b-8192", // Fast & Smart
                temperature: 0.7,
                max_tokens: 200,
            });

            const reply = completion.choices[0]?.message?.content || "";
            if (reply) return NextResponse.json({ reply, provider: "groq" });

            throw new Error("Empty Groq Response");

        } catch (groqError) {
            console.warn("Groq Limit/Error, Switching to Backup...", groqError);
            // Fallthrough to backup
        }

        // -------------------------------------------------------------
        // STRATEGY 2: GOOGLE GEMINI (Backup - Reliable Free Tier)
        // -------------------------------------------------------------
        console.log("Falling back to Gemini...");

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                reply: "I'm currently offline (Missing API Keys). Tell the developer to check .env!"
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Transform history for Gemini (supports 'user' and 'model')
        const geminiHistory = history.map((h: any) => ({
            role: h.role === 'bot' ? 'model' : 'user',
            parts: [{ text: h.text }]
        }));

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_PROMPT + "\n\nHello Mike." }]
                },
                {
                    role: "model",
                    parts: [{ text: "Yo. Mike here. Ready to roll." }]
                },
                ...geminiHistory
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ reply: text, provider: "gemini" });

    } catch (error) {
        console.error("Mike AI Critical Failure:", error);
        return NextResponse.json({
            reply: "Sorry, I'm having trouble connecting to HQ right now. Try again later."
        });
    }
}
