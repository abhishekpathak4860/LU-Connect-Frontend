
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

const statusStyles: Record<Application["status"], string> = {
  APPLIED: "bg-blue-50 text-blue-700",
  UNDER_REVIEW: "bg-amber-50 text-amber-700",
  SHORTLISTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
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
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Applications
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Track your job applications and recruitment updates.
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">
          Total applications:{" "}
          <span className="font-semibold text-gray-900">
            {pagination.total}
          </span>
        </p>

        <Link
          href="/student/dashboard/jobs"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Explore jobs
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-10 text-center">
          <h2 className="font-semibold text-gray-900">
            No applications yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your submitted job applications will appear here.
          </p>
          <Link
            href="/student/dashboard/jobs"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Explore jobs
          </Link>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Job Details
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Applied On
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    Resume Match
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {applications.map((application) => (
                  <tr
                    key={application.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {application.job.role}
                      </p>
                      <p className="mt-1 text-gray-600">
                        {application.job.company_name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {application.job.location} ·{" "}
                        {application.job.package}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                          statusStyles[application.status]
                        }`}
                      >
                        {statusLabels[application.status]}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {new Date(application.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          timeZone: "Asia/Kolkata",
                        },
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {application.compatibility_score !== null ? (
                        <span className="font-semibold text-gray-800">
                          {application.compatibility_score}%
                        </span>
                      ) : (
                        <span className="text-gray-400">Not available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
