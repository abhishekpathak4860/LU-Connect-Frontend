
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
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
  alreadyApplied: boolean;
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

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Student authentication token not found");
  }

  const response = await axios.get<JobsResponse>(
    `${baseUrl.replace(/\/$/, "")}/jobs/student?page=1&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
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
