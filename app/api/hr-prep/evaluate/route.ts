import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(request: Request) {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

  try {
    const { company, answers } = await request.json();

    if (!company || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Company and answers are required' }, { status: 400 });
    }

    const formattedAnswers = answers.map((a: any, i: number) => `
Question ${i + 1}: ${a.question}
Candidate's Answer: ${a.answer}
    `).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: `Evaluate the following HR interview answers for a candidate interviewing at ${company}.
      
      ${formattedAnswers}
      `,
      config: {
        systemInstruction: "You are an expert technical recruiter. Evaluate the candidate's answers based on the STAR method, clarity, and alignment with the company's values. Provide constructive feedback.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "The ID of the question being evaluated" },
              score: { type: Type.INTEGER, description: "Score out of 10 for the answer" },
              feedback: { type: Type.STRING, description: "Detailed constructive feedback on the answer" },
              improvement: { type: Type.STRING, description: "Specific suggestion on how to improve the answer using the STAR method or better phrasing" }
            },
            required: ["id", "score", "feedback", "improvement"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    const evaluations = JSON.parse(text);
    return NextResponse.json({ success: true, evaluations });

  } catch (error: any) {
    console.error('Evaluate HR answers error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate answers' },
      { status: 500 }
    );
  }
}
