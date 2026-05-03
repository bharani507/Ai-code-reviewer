import './fetch-polyfill.js';
import OpenAI from 'openai';
export class Bot {
    client;
    options;
    constructor(options) {
        this.options = options;
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is missing");
        }
        // ✅ CRITICAL: Groq base URL
        this.client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1'
        });
    }
    chat = async (message, _ids) => {
        try {
            if (!message)
                return ['', {}];
            const response = await this.client.chat.completions.create({
                model: this.options.openai_model || 'llama3-70b-8192',
                messages: [
                    {
                        role: 'system',
                        content: this.options.system_message || 'You are a code reviewer'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: Number(this.options.openai_model_temperature ?? "0.2")
            });
            // ✅ DEBUG (IMPORTANT)
            console.log("GROQ RESPONSE:", JSON.stringify(response, null, 2));
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
