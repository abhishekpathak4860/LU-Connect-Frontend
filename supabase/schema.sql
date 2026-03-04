-- Sample Supabase Schema for LU Connect

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Jobs Table
create table public.jobs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  company_name text not null,
  role text not null,
  location text not null,
  package text not null,
  eligibility_criteria text not null,
  description text not null,
  application_deadline timestamp with time zone not null
);

-- Applications Table
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  name text not null,
  email text not null,
  phone text not null,
  resume_url text not null,
  compatibility_score integer,
  matching_skills jsonb,
  missing_skills jsonb
);

-- Storage bucket for resumes
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false);

-- RLS Policies
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- Jobs are readable by everyone, but only insertable/updatable by authenticated users (or via our backend)
create policy "Jobs are viewable by everyone" on public.jobs for select using (true);
create policy "Jobs are insertable by authenticated users" on public.jobs for insert with check (auth.role() = 'authenticated');
create policy "Jobs are updatable by authenticated users" on public.jobs for update using (auth.role() = 'authenticated');

-- Applications are insertable by everyone (since it's a public form), viewable by authenticated users
create policy "Applications are insertable by everyone" on public.applications for insert with check (true);
create policy "Applications are viewable by authenticated users" on public.applications for select using (auth.role() = 'authenticated');

-- Storage Policies
create policy "Resumes are uploadable by everyone" on storage.objects for insert with check (bucket_id = 'resumes');
create policy "Resumes are viewable by authenticated users" on storage.objects for select using (bucket_id = 'resumes' and auth.role() = 'authenticated');
