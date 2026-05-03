import './fetch-polyfill.js'
import * as optionsJs from './options.js'
import OpenAI from 'openai'

export type Ids = {}

export class Bot {
  private client: OpenAI
  private options: optionsJs.Options

  constructor(options: optionsJs.Options) {
    this.options = options

    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing")
    }
    
    // ✅ CRITICAL: Groq base URL
    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    })
  }
   

  chat = async (message: string, _ids?: any): Promise<[string, Ids]> => {
    try {
      if (!message) return ['', {}]
      console.log("🚀 CALLING GROQ...");

      const response = await this.client.chat.completions.create({
        model: 'llama3-70b-8192',// ✅ use your model
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
        temperature: 0.2
      })

      // ✅ DEBUG (IMPORTANT)
      
      console.log("✅ RESPONSE:", JSON.stringify(response, null, 2));

      const text = response?.choices?.[0]?.message?.content

      if (!text) {
        console.log("⚠️ EMPTY RESPONSE FROM GROQ")
        return ['', {}]
      }

      return [text, {}]
    } catch (e: any) {
      console.log("❌ GROQ ERROR:", e.message)
      return ['', {}]
    }
  }
}