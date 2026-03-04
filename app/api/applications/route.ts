import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobId = formData.get('jobId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const resume = formData.get('resume') as File;

    if (!jobId || !name || !email || !phone || !resume) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1. Upload resume to Supabase Storage
    const fileExt = resume.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `resumes/${jobId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, resume, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error('Failed to upload resume');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    // 2. Insert application record
    const { data: applicationData, error: insertError } = await supabase
      .from('applications')
      .insert([
        {
          job_id: jobId,
          name,
          email,
          phone,
          resume_url: publicUrl,
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Insert Error:', insertError);
      throw new Error('Failed to submit application');
    }

    return NextResponse.json({ success: true, application: applicationData });

  } catch (error: any) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Basic auth check using cookie
    const adminSession = request.headers.get('cookie')?.includes('admin_session=true');
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabase();
    
    // Fetch applications with job details
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          role,
          company_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ applications });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
