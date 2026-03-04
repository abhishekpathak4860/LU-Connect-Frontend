import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { PDFParse } from 'pdf-parse';

// Initialize Gemini API
export async function POST(request: Request) {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
    }

    // Parse PDF text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    const resumeText = textResult.pages.map(p => p.text).join('\n');

    if (!resumeText || resumeText.trim() === '') {
      return NextResponse.json({ error: 'Could not extract text from the PDF' }, { status: 400 });
    }

    // Call Gemini API to analyze the resume
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Analyze the following resume text and extract key information.
      
      Resume Text:
      ${resumeText}
      `,
      config: {
        systemInstruction: "You are an expert technical recruiter and career coach. Analyze the resume and provide structured feedback.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of technical and soft skills found in the resume."
            },
            education: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Summary of education history."
            },
            projects: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key projects mentioned."
            },
            experience: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Summary of work experience."
            },
            suggestedRoles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Job roles suitable for this candidate."
            },
            skillsToImprove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Skills the candidate should learn or improve based on current industry trends."
            },
            enhancementTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable tips to improve the resume format, wording, or content."
            }
          },
          required: ["skills", "education", "projects", "experience", "suggestedRoles", "skillsToImprove", "enhancementTips"]
        }
      }
    });

    const analysisText = response.text;
    if (!analysisText) {
      throw new Error('No response from Gemini API');
    }

    const analysisResult = JSON.parse(analysisText);

    return NextResponse.json({ success: true, analysis: analysisResult });

  } catch (error: any) {
    console.error('Resume analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
