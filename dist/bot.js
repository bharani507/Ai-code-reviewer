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
                model: 'llama3-70b-8192',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a senior code reviewer. Give clear feedback on code quality, bugs, and improvements.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.3
            });
            console.log("GROQ RESPONSE:", JSON.stringify(response, null, 2));
            const text = response?.choices?.[0]?.message?.content;
            if (!text) {
                throw new Error("Groq returned empty response");
            }
            return [text, {}];
        }
        catch (e) {
            return ['', {}];
        }
    };
}
