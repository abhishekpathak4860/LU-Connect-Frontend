import { auth } from "@clerk/nextjs/server";
import axios from "@/lib/axios";
import Link from "next/link";

type Application = {
  id: string;
  created_at: string;
  status: "APPLIED" | "UNDER_REVIEW" | "SHORTLISTED" | "REJECTED";
  compatibility_score: number | null;
  job: {
    id: string;
    company_name: string;
    role: string;
    location: string;
    package: string;
  };
};

type ApplicationsResponse = {
  applications: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const statusLabels: Record<Application["status"], string> = {
  APPLIED: "Applied",
  UNDER_REVIEW: "Under Review",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const parsedPage = Number(params.page ?? "1");
  const page =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return <p className="p-6">Please sign in to view your applications.</p>;
  }

  let data: ApplicationsResponse;

  try {
    const response = await axios.get<ApplicationsResponse>(
      "/applications/me",
      {
        params: { page, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    data = response.data;
  } catch {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">My Applications</h1>
        <p className="mt-4 text-red-600">
          Unable to load your applications. Please try again later.
        </p>
      </div>
    );
  }

  const { applications, pagination } = data;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">My Applications</h1>
      <p className="mt-2 text-sm text-gray-500">
        Track your job applications and recruitment updates.
      </p>

      <p className="mt-5 text-sm text-gray-600">
        Total applications: {pagination.total}
      </p>

      {applications.length === 0 ? (
        <div className="mt-6 rounded-xl border p-8 text-center">
          <h2 className="font-semibold">No applications yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your submitted job applications will appear here.
          </p>
          <Link
            href="/student/dashboard/jobs"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Explore jobs
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <h2 className="text-lg font-semibold">
                    {application.job.role}
                  </h2>
                  <p className="text-gray-600">
                    {application.job.company_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {application.job.location} · {application.job.package}
                  </p>
                </div>

                <span className="h-fit w-fit rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {statusLabels[application.status]}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-sm text-gray-500">
                <p>
                  Applied:{" "}
                  {new Date(application.created_at).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "Asia/Kolkata",
                    },
                  )}
                </p>

                {application.compatibility_score !== null && (
                  <p>
                    Resume compatibility: {application.compatibility_score}%
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <nav
          aria-label="Application pages"
          className="mt-6 flex items-center justify-between"
        >
          {pagination.page > 1 ? (
            <Link
              href={`?page=${pagination.page - 1}`}
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          {pagination.page < pagination.totalPages ? (
            <Link
              href={`?page=${pagination.page + 1}`}
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </main>
  );
}