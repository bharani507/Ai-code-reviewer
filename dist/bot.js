import './fetch-polyfill.js';
import OpenAI from 'openai';
export class Bot {
    client;
    options;
    constructor(options) {
        this.options = options;
        const apiKey = process.env.GROQ_API_KEY || process.env.INPUT_GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("GROQ_API_KEY is missing");
        }
        // ✅ CRITICAL: Groq base URL
        this.client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://api.groq.com/openai/v1'
        });
        console.log("API KEY PRESENT:", !!apiKey);
    }
    chat = async (message, _ids) => {
        try {
            if (!message)
                return ['', {}];
            console.log("🚀 CALLING GROQ...");
            c;
            // ✅ DEBUG (IMPORTANT)
            console.log("✅ RESPONSE:", JSON.stringify(response, null, 2));
            const text = response?.choices?.[0]?.message?.content;
            if (!text) {
                console.log("⚠️ EMPTY RESPONSE FROM GROQ");
                return ['', {}];
            }
            return [text, {}];
        }
        catch (e) {
            console.log("❌ GROQ ERROR:", e.message);
            return ['', {}];
        }
    };
}
