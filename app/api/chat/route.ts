import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { messages, isPro } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Convert frontend chat format into the format Gemini expects
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
    const latestMessage = messages[messages.length - 1].text;

    // 1. Base instructions that everyone gets
    const baseInstruction = "You are an expert IT certification study advisor. You MUST ONLY answer questions related to IT certifications, study plans, and learning resources. If the user asks about anything else, politely decline. Format with markdown.";
    
    // 2. Dynamic length instructions based on their tier!
    const lengthInstruction = isPro 
      ? "Provide highly detailed, comprehensive answers. Your responses should generally be 1 to 2 paragraphs long, explaining concepts thoroughly."
      : "Keep your answers extremely concise and to the point. You MUST strictly limit your response to a maximum of 2 sentences.";

    // Combine them
    const systemInstruction = `${baseInstruction} ${lengthInstruction}`;

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview', 
      history: history,
      config: {
        systemInstruction: systemInstruction,
        // 3. Raise the token ceiling so it never cuts off mid-sentence
        // 400 tokens = ~300 words (plenty for 2 sentences)
        // 1000 tokens = ~750 words (plenty for 2 paragraphs)
        maxOutputTokens: isPro ? 1000 : 400, 
        tools: [{ googleSearch: {} }],
      }
    });

    const response = await chat.sendMessage({ message: latestMessage });

    return NextResponse.json({ text: response.text });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 });
  }
}
