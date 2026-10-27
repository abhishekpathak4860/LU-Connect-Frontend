
"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import JobApplicationModal from "@/components/student/JobApplicationModal";

interface Job {
  id: string;
  company_name: string;
  role: string;
  location: string;
  package: string;
  eligibility_criteria: string;
  description: string;
  application_deadline: string;
}

export default function JobApplicationLauncher({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <FileText className="h-4 w-4" />
        Apply for this job
      </button>

      {open && (
        <JobApplicationModal job={job} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
