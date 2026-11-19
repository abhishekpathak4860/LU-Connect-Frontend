
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
  Clock,
  Code,
} from "lucide-react";

interface Internship {
  id: string;
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
  start_date?: string | null;
}

interface InternshipPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedInternship: Internship | null;
}

interface InternshipFormData {
  company_name: string;
  role: string;
  location: string;
  work_mode: "REMOTE" | "HYBRID" | "ONSITE";
  stipend: string;
  duration: string;
  eligibility_criteria: string;
  required_skills: string;
  description: string;
  application_deadline: string;
  start_date: string;
}

const initialFormData: InternshipFormData = {
  company_name: "",
  role: "",
  location: "",
  work_mode: "ONSITE",
  stipend: "",
  duration: "",
  eligibility_criteria: "",
  required_skills: "",
  description: "",
  application_deadline: "",
  start_date: "",
};

export default function InternshipPostForm({
  isOpen,
  onClose,
  onSuccess,
  selectedInternship,
}: InternshipPostFormProps) {
  const [formData, setFormData] =
    useState<InternshipFormData>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedInternship) {
      setFormData({
        company_name: selectedInternship.company_name,
        role: selectedInternship.role,
        location: selectedInternship.location,
        work_mode: selectedInternship.work_mode,
        stipend: selectedInternship.stipend,
        duration: selectedInternship.duration,
        eligibility_criteria: selectedInternship.eligibility_criteria,
        required_skills: selectedInternship.required_skills.join(", "),
        description: selectedInternship.description,
        application_deadline:
          selectedInternship.application_deadline.slice(0, 10),
        start_date: selectedInternship.start_date
          ? selectedInternship.start_date.slice(0, 10)
          : "",
      });
    } else {
      setFormData(initialFormData);
    }

    setError("");
    setSuccess(false);
  }, [selectedInternship]);

  if (!isOpen) return null;

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

      const requiredSkills = formData.required_skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      if (requiredSkills.length === 0) {
        setError("Please enter at least one required skill.");
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        required_skills: requiredSkills,
   application_deadline: new Date(
  `${formData.application_deadline}T23:59:59.999Z`
).toISOString(),

start_date: formData.start_date
  ? new Date(`${formData.start_date}T12:00:00.000Z`).toISOString()
  : undefined,
      };

      if (selectedInternship) {
        await axiosInstance.patch(
          `/internships/${selectedInternship.id}`,
          payload
        );
      } else {
        await axiosInstance.post("/internships", payload);
      }

      setSuccess(true);
      onSuccess();

      setTimeout(() => {
        setFormData(initialFormData);
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error("Internship submission failed:", err);

      const message = err.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Unable to save internship. Please try again."
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
        aria-labelledby="internship-form-title"
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
              id="internship-form-title"
              className="mt-2 text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl"
            >
              {selectedInternship
                ? "Edit Internship"
                : "Post New Internship"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add internship details and opportunities for students.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close internship form"
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
                Internship saved successfully!
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
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Internship Role <span className="text-red-500">*</span>
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
                      placeholder="e.g. Software Developer Intern"
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Location <span className="text-red-500">*</span>
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
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="work_mode"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Work Mode <span className="text-red-500">*</span>
                  </label>

                  <select
                    id="work_mode"
                    name="work_mode"
                    value={formData.work_mode}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="ONSITE">Onsite</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="stipend"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Stipend <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="stipend"
                      name="stipend"
                      value={formData.stipend}
                      onChange={handleChange}
                      required
                      placeholder="e.g. ₹15,000/month or Unpaid"
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="duration"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Duration <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Clock
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 3 months"
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Application information */}
            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Application Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      min={selectedInternship ? undefined : minDate}
                      required
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="start_date"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Internship Start Date{" "}
                    <span className="text-gray-400">(Optional)</span>
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
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
                    className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Required skills */}
            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Required Skills
              </h3>

              <label
                htmlFor="required_skills"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Skills <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <Code
                  size={17}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <textarea
                  id="required_skills"
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="e.g. React, Node.js, TypeScript, MongoDB"
                  className="w-full resize-y rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Separate each skill with a comma.
              </p>
            </section>

            <div className="border-t border-gray-100" />

            {/* Description */}
            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Internship Description
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
                  placeholder="Describe the internship, responsibilities, learning opportunities and other important details..."
                  className="w-full resize-y rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm leading-6 text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  {selectedInternship
                    ? "Updating Internship..."
                    : "Posting Internship..."}
                </>
              ) : success ? (
                <>
                  <CheckCircle2 size={16} />
                  Saved Successfully
                </>
              ) : (
                <>
                  <BriefcaseBusiness size={16} />
                  {selectedInternship
                    ? "Update Internship"
                    : "Post Internship"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
