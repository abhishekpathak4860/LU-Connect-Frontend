import Jobs from "./jobs";

interface Job {
  id: string;
  created_at: string;
  company_name: string;
  role: string;
  location: string;
  package: string;
  eligibility_criteria: string;
  description: string;
  application_deadline: string;
}

interface JobsResponse {
  jobs: Job[];
  pagination: {
    currentPage: number;
    limit: number;
    totalJobs: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

async function getJobs(): Promise<JobsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/jobs?page=1&limit=10`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  return response.json();
}

export default async function JobsPage() {
  const data = await getJobs();

  return (
    <Jobs
      initialJobs={data.jobs}
      initialPagination={data.pagination}
    />
  );
}
