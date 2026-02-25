import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma'; // Bring in your database!

// Tells Vercel to allow this function to run for up to 60 seconds!
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Standardize the query (lowercase and trim spaces) so " ccna " and "CCNA" share the same cache
    const normalizedQuery = query.toLowerCase().trim();

    // --- 1. CHECK THE DATABASE CACHE FIRST ---
    const cachedSearch = await prisma.searchCache.findUnique({
      where: { query: normalizedQuery }
    });

    if (cachedSearch) {
      console.log('Cache HIT! Loading instantly from Postgres.');
      // Return the cached JSON directly
      return NextResponse.json({ results: cachedSearch.results });
    }

    console.log('Cache MISS! Firing up Gemini...');
    // --- 2. IF NOT IN DATABASE, CALL GEMINI ---
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Your updated preview model
      contents: `Find completely FREE study resources, guides, videos, and practice materials for the IT certification: "${query}". 
      Do not include paid courses. Focus on high-quality, legitimate free resources.
      You MUST use Google Search to find ACTUAL, WORKING URLs that exist right now. Do not hallucinate URLs.
      Return a JSON array of the best resources found. The JSON array must be the ONLY output.
      Format: [{"title": "...", "url": "...", "snippet": "...", "type": "Video Course|Study Guide|Practice Exam|Community Forum", "source": "..."}]`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text || '[]');

    // --- 3. SAVE THE NEW RESULTS TO THE DATABASE ---
    // Only save if Gemini actually found stuff (array length > 0) so we don't cache errors
    if (Array.isArray(parsed) && parsed.length > 0) {
      await prisma.searchCache.create({
        data: {
          query: normalizedQuery,
          results: parsed,
        }
      });
    }

    return NextResponse.json({ results: parsed });
    
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
