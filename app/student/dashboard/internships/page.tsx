
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import Internships from "./internships";


interface Internship {
  id: string;
  created_at: string;
  company_name: string;
  role: string;
  location: string;
  work_mode: "REMOTE" | "HYBRID" | "ONSITE";
  stipend: string;
  duration: string;
  eligibility_criteria: string;
  required_skills: string[];
  description: string;
  application_deadline: string;
  start_date: string | null;
  alreadyApplied: boolean;
}

interface InternshipsResponse {
  internships: Internship[];
  pagination: {
    currentPage: number;
    limit: number;
    totalInternships: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

async function getInternships(): Promise<InternshipsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not configured");
  }

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    throw new Error("Student authentication token not found");
  }

  const response = await axios.get<InternshipsResponse>(
    `${baseUrl.replace(/\/$/, "")}/internships/student?page=1&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export default async function InternshipsPage() {
  const data = await getInternships();

  return (
    <Internships
      initialInternships={data.internships}
      initialPagination={data.pagination}
    />
  );
}

