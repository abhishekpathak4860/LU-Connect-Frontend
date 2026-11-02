
"use client";

import { FormEvent, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import {
  X,
  BriefcaseBusiness,
  Building2,
  MapPin,
  IndianRupee,
  CalendarDays,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface JobPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedJob: Job | null;
}
interface Job {
  id: string;
  company_name: string;
  role: string;
  location: string;
  package: string;
  application_deadline: string;
  eligibility_criteria: string;
  description: string;
}

interface JobFormData {
  company_name: string;
  role: string;
  location: string;
  package: string;
  eligibility_criteria: string;
  description: string;
  application_deadline: string;
}

const initialFormData: JobFormData = {
  company_name: "",
  role: "",
  location: "",
  package: "",
  eligibility_criteria: "",
  description: "",
  application_deadline: "",
};

export default function JobPostForm({
  isOpen,
  onClose,
  onSuccess,
  selectedJob
}: JobPostFormProps) {
  const [formData, setFormData] = useState<JobFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);


useEffect(() => {
  if (selectedJob) {
    setFormData({
      company_name: selectedJob.company_name,
      role: selectedJob.role,
      location: selectedJob.location,
      package: selectedJob.package,
      application_deadline: selectedJob.application_deadline.slice(0, 10),
      eligibility_criteria: selectedJob.eligibility_criteria,
      description: selectedJob.description,
    });
  } else {
    setFormData({
      company_name: "",
      role: "",
      location: "",
      package: "",
      application_deadline: "",
      eligibility_criteria: "",
      description: "",
    });
  }
}, [selectedJob]);

  if (!isOpen) return null;

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if (loading) return;

    setFormData(initialFormData);
    setError("");
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess(false);
const payload = {
  ...formData,
  application_deadline: new Date(
    `${formData.application_deadline}T23:59:59`
  ).toISOString(),
};

if (selectedJob) {
  await axiosInstance.patch(`/jobs/${selectedJob.id}`, payload);
} else {
  await axiosInstance.post("/jobs", payload);
}

      setSuccess(true);
      onSuccess();

      setTimeout(() => {
        setFormData(initialFormData);
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Job creation failed:", err);

      const message = err.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Unable to create job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-form-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-5 sm:px-7">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <BriefcaseBusiness size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">
                TPC Workspace
              </span>
            </div>

            <h2
              id="job-form-title"
              className="mt-2 text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl"
            >
           {selectedJob ? "Edit Job" : "Post New Job"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add the company and opportunity details for students.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close job form"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-6 px-5 py-6 sm:px-7">
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                <CheckCircle2 size={18} />
                Job posted successfully!
              </div>
            )}

            {/* Company and role */}
            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Company Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="company_name"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      maxLength={150}
                      placeholder="e.g. Google"
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-black text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Job Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BriefcaseBusiness
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      maxLength={150}
                      placeholder="e.g. Software Engineer"
                      className="w-full rounded-lg border text-black border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Job Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Bangalore / Remote"
                      className="w-full rounded-lg border  text-black  border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="package"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Package <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="package"
                      name="package"
                      value={formData.package}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 6 LPA"
                      className="w-full rounded-lg border  text-black border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Eligibility and deadline */}
            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Application Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="application_deadline"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Application Deadline{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="application_deadline"
                      name="application_deadline"
                      type="date"
                      value={formData.application_deadline}
                      onChange={handleChange}
                      min={minDate}
                      required
                      className="w-full rounded-lg border border-gray-200  text-black py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="eligibility_criteria"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Eligibility Criteria{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="eligibility_criteria"
                    name="eligibility_criteria"
                    value={formData.eligibility_criteria}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Enter eligible branches, minimum CGPA, backlogs, passing year, etc."
                    className="w-full resize-y rounded-lg  text-black border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Description */}
            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Job Description
              </h3>

              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText
                  size={17}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe the role, responsibilities, required skills and other important details..."
                  className="w-full resize-y rounded-lg  text-black border border-gray-200 py-2.5 pl-10 pr-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || success}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
{loading ? (
  <>
    <Loader2 size={16} className="animate-spin" />
    {selectedJob ? "Updating Job..." : "Posting Job..."}
  </>
) : success ? (
  <>
    <CheckCircle2 size={16} />
    {selectedJob ? "Updated Successfully" : "Posted Successfully"}
  </>
) : (
  <>
    <BriefcaseBusiness size={16} />
    {selectedJob ? "Update Job" : "Post Job"}
  </>
)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
