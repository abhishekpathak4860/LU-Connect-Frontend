
"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import InternshipApplicationModal from "@/components/student/InternshipApplicationModal";

interface Internship {
  id: string;
  company_name: string;
  role: string;
}

export default function InternshipApplicationLauncher({
  internship,
}: {
  internship: Internship;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <FileText className="h-4 w-4" />
        Apply for this internship
      </button>

      {open && (
        <InternshipApplicationModal
          internship={internship}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
