import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(request: Request) {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

  try {
    const { company } = await request.json();

    if (!company) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: `Generate 3 realistic HR/Behavioral interview questions that a candidate might face when interviewing at ${company}. Make them specific to the culture and values of ${company} if possible.`,
      config: {
        systemInstruction: "You are an expert technical recruiter.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique identifier for the question (e.g., q1, q2)" },
              question: { type: Type.STRING, description: "The interview question" },
              context: { type: Type.STRING, description: "Brief context on why this company asks this question" }
            },
            required: ["id", "question", "context"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    const questions = JSON.parse(text);
    return NextResponse.json({ success: true, questions });

  } catch (error: any) {
    console.error('Generate HR questions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
