import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { getSupabase } from '@/lib/supabase';
import { PDFParse } from 'pdf-parse';

export async function POST(request: Request) {
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const jobId = formData.get('jobId') as string;

    if (!file || !jobId) {
      return NextResponse.json({ error: 'Missing resume or jobId' }, { status: 400 });
    }

    // Fetch job details
    const supabase = getSupabase();
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Parse PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    const resumeText = textResult.pages.map(p => p.text).join('\n');

    if (!resumeText || resumeText.trim() === '') {
      return NextResponse.json({ error: 'Could not extract text from the PDF' }, { status: 400 });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Compare the following resume against the job description.
      
      Job Role: ${job.role}
      Company: ${job.company_name}
      Job Description: ${job.description}
      Eligibility Criteria: ${job.eligibility_criteria}
      
      Resume Text:
      ${resumeText}
      `,
      config: {
        systemInstruction: "You are an expert technical recruiter. Analyze the resume against the job description and provide a compatibility score and feedback.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Compatibility score from 0 to 100."
            },
            matchingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Skills from the resume that match the job requirements."
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Important skills required by the job that are missing from the resume."
            },
            suggestions: {
              type: Type.STRING,
              description: "A short paragraph with actionable advice for the candidate."
            }
          },
          required: ["score", "matchingSkills", "missingSkills", "suggestions"]
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
    console.error('Compatibility check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check compatibility' },
      { status: 500 }
    );
  }
}
