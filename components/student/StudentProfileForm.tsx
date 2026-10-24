
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "@/lib/axios";
import {
  FiPlus,
  FiTrash2,
  FiSave,
  FiUser,
  FiBriefcase,
  FiBookOpen,
  FiGlobe,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

type Entry = Record<string, string>;

interface Profile {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  location?: string | null;
  primaryRole?: string | null;
  experienceYears?: number | null;
  openToRoles?: string[];
  bio?: string | null;
  website?: string | null;
  linkedin?: string | null;
  github?: string | null;
  twitter?: string | null;
  workExperience?: Entry[] | null;
  education?: Entry[] | null;
  skills?: string[];
  achievements?: string | null;
  pronouns?: string | null;
  genderIdentity?: string | null;
  resumeUrl?: string | null;
}

const emptyProfile: Profile = {
  firstName: "",
  middleName: "",
  lastName: "",
  location: "",
  primaryRole: "",
  experienceYears: 0,
  openToRoles: [],
  bio: "",
  website: "",
  linkedin: "",
  github: "",
  twitter: "",
  workExperience: [],
  education: [],
  skills: [],
  achievements: "",
  pronouns: "",
  genderIdentity: "",
  resumeUrl: "",
};

const inputClass =
  "mt-2 w-full min-w-0 border border-black/10 bg-white px-3 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

const labelClass = "block text-sm font-medium text-neutral-700";

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-black/10 bg-white">
      <div className="flex items-start gap-3 border-b border-black/10 p-5 sm:p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-blue-50 text-blue-600">
          <Icon size={19} />
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold text-neutral-900">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-neutral-500">
            {description}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className={labelClass}>
      {label}
      <input
        className={inputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanUrl(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export default function StudentProfileForm() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [skillsText, setSkillsText] = useState("");
  const [rolesText, setRolesText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const loadProfile = useCallback(async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setError("Please sign in to view your student profile.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = await getToken();
      if (!token) throw new Error("Unable to verify your session.");

      const response = await axios.get("/student-profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data?.data ?? response.data;
      const loaded: Profile = { ...emptyProfile, ...data };

      loaded.workExperience = Array.isArray(data?.workExperience)
        ? data.workExperience
        : [];
      loaded.education = Array.isArray(data?.education)
        ? data.education
        : [];
      loaded.skills = Array.isArray(data?.skills) ? data.skills : [];
      loaded.openToRoles = Array.isArray(data?.openToRoles)
        ? data.openToRoles
        : [];

      setProfile(loaded);
      setSkillsText(loaded.skills?.join(", ") ?? "");
      setRolesText(loaded.openToRoles?.join(", ") ?? "");
    } catch (err) {
      console.error("Failed to load student profile:", err);
      setError("Could not load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateEntry = (
    key: "education" | "workExperience",
    index: number,
    field: string,
    value: string,
  ) => {
    const entries = [...(profile[key] ?? [])];
    entries[index] = { ...entries[index], [field]: value };
    update(key, entries);
  };


const addEntry = (key: "education" | "workExperience") => {
  const entry: Entry =
    key === "education"
      ? {
          institution: "",
          degree: "",
          field: "",
          startYear: "",
          endYear: "",
        }
      : {
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        };

  update(key, [...(profile[key] ?? []), entry]);
};


  const removeEntry = (
    key: "education" | "workExperience",
    index: number,
  ) => {
    update(
      key,
      (profile[key] ?? []).filter((_, entryIndex) => entryIndex !== index),
    );
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = await getToken();
      if (!token) throw new Error("Unable to verify your session.");

      const payload: Record<string, unknown> = {
        firstName: profile.firstName?.trim() || "",
        middleName: profile.middleName?.trim() || "",
        lastName: profile.lastName?.trim() || "",
        location: profile.location?.trim() || "",
        primaryRole: profile.primaryRole?.trim() || "",
        experienceYears: Math.max(
          0,
          Math.floor(Number(profile.experienceYears) || 0),
        ),
        openToRoles: splitList(rolesText),
        bio: profile.bio?.trim() || "",
        skills: splitList(skillsText),
        achievements: profile.achievements?.trim() || "",
        pronouns: profile.pronouns?.trim() || "",
        genderIdentity: profile.genderIdentity?.trim() || "",
        workExperience: profile.workExperience ?? [],
        education: profile.education ?? [],
      };

      const optionalUrls = {
        website: profile.website,
        linkedin: profile.linkedin,
        github: profile.github,
        twitter: profile.twitter,
        resumeUrl: profile.resumeUrl,
      };

      for (const [key, value] of Object.entries(optionalUrls)) {
        const cleaned = cleanUrl(value);
        if (cleaned) payload[key] = cleaned;
      }

      await axios.patch("/student-profile/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess("Your profile has been saved successfully.");
    } catch (err: unknown) {
      console.error("Failed to save student profile:", err);
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err
          ? (err as { response?: { data?: { message?: string | string[] } } })
              .response?.data?.message
          : undefined;

      setError(
        Array.isArray(message)
          ? message.join(", ")
          : message || "Could not save your profile. Check your details and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-neutral-500">
        <FiLoader className="animate-spin" size={19} />
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
          Student workspace
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
          Keep your personal details, skills, education, and career information
          up to date.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-5 flex items-start gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          <FiCheckCircle className="mt-0.5 shrink-0" size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Section
          title="Personal information"
          description="Tell us the basics about yourself."
          icon={FiUser}
        >
          <Field
            label="First name"
            value={profile.firstName ?? ""}
            onChange={(v) => update("firstName", v)}
            placeholder="First name"
          />
          <Field
            label="Middle name"
            value={profile.middleName ?? ""}
            onChange={(v) => update("middleName", v)}
            placeholder="Middle name (optional)"
          />
          <Field
            label="Last name"
            value={profile.lastName ?? ""}
            onChange={(v) => update("lastName", v)}
            placeholder="Last name"
          />
          <Field
            label="Location"
            value={profile.location ?? ""}
            onChange={(v) => update("location", v)}
            placeholder="City, state"
          />
          <Field
            label="Pronouns"
            value={profile.pronouns ?? ""}
            onChange={(v) => update("pronouns", v)}
            placeholder="Optional"
          />
          <Field
            label="Gender identity"
            value={profile.genderIdentity ?? ""}
            onChange={(v) => update("genderIdentity", v)}
            placeholder="Optional"
          />
          <label className={`${labelClass} sm:col-span-2`}>
            Bio
            <textarea
              className={`${inputClass} min-h-28 resize-y`}
              value={profile.bio ?? ""}
              onChange={(e) => update("bio", e.target.value)}
              placeholder="Write a short introduction about yourself..."
              maxLength={2000}
            />
            <span className="mt-1 block text-right text-xs font-normal text-neutral-400">
              {(profile.bio ?? "").length}/2000
            </span>
          </label>
        </Section>

        <Section
          title="Career preferences"
          description="Highlight your skills and the roles you're interested in."
          icon={FiBriefcase}
        >
          <Field
            label="Primary role"
            value={profile.primaryRole ?? ""}
            onChange={(v) => update("primaryRole", v)}
            placeholder="e.g. Full Stack Developer"
          />
          <Field
            label="Years of experience"
            type="number"
            value={profile.experienceYears ?? 0}
            onChange={(v) =>
              update("experienceYears", Math.max(0, Number(v) || 0))
            }
          />
          <label className={`${labelClass} sm:col-span-2`}>
            Skills
            <input
              className={inputClass}
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="React, Next.js, Node.js, PostgreSQL"
            />
            <span className="mt-1 block text-xs font-normal text-neutral-400">
              Separate skills with commas.
            </span>
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Roles you're open to
            <input
              className={inputClass}
              value={rolesText}
              onChange={(e) => setRolesText(e.target.value)}
              placeholder="Frontend Developer, Software Engineer"
            />
            <span className="mt-1 block text-xs font-normal text-neutral-400">
              Separate roles with commas.
            </span>
          </label>
          <label className={`${labelClass} sm:col-span-2`}>
            Achievements
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={profile.achievements ?? ""}
              onChange={(e) => update("achievements", e.target.value)}
              placeholder="Certifications, awards, notable projects..."
            />
          </label>
        </Section>

        <Section
          title="Education"
          description="Add your academic qualifications."
          icon={FiBookOpen}
        >
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => addEntry("education")}
              className="inline-flex items-center gap-2 border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              <FiPlus size={16} /> Add education
            </button>
          </div>

          {(profile.education ?? []).map((entry, index) => (
            <div
              key={`education-${index}`}
              className="relative space-y-4 border border-black/10 bg-[#fafaf8] p-4 sm:col-span-2 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">
                  Education {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeEntry("education", index)}
                  aria-label={`Remove education ${index + 1}`}
                  className="p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["institution", "Institution", "University or college"],
                  ["degree", "Degree", "B.Tech, B.Sc, etc."],
                  ["field", "Field of study", "Computer Science"],
                  ["startYear", "Start year", "2022"],
                  ["endYear", "End year", "2026 or Present"],
                ].map(([field, label, placeholder]) => (
                  <Field
                    key={field}
                    label={label}
                    value={entry[field] ?? ""}
                    onChange={(v) =>
                      updateEntry("education", index, field, v)
                    }
                    placeholder={placeholder}
                  />
                ))}
              </div>
            </div>
          ))}
          {(profile.education ?? []).length === 0 && (
            <p className="text-sm text-neutral-500 sm:col-span-2">
              No education entries added yet.
            </p>
          )}
        </Section>

        <Section
          title="Work experience"
          description="Add internships, jobs, and relevant professional experience."
          icon={FiBriefcase}
        >
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => addEntry("workExperience")}
              className="inline-flex items-center gap-2 border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >
              <FiPlus size={16} /> Add experience
            </button>
          </div>

          {(profile.workExperience ?? []).map((entry, index) => (
            <div
              key={`experience-${index}`}
              className="space-y-4 border border-black/10 bg-[#fafaf8] p-4 sm:col-span-2 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">
                  Experience {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeEntry("workExperience", index)}
                  aria-label={`Remove experience ${index + 1}`}
                  className="p-2 text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["position", "Job title", "Software Developer Intern"],
                  ["company", "Company", "Company name"],
                  ["location", "Location", "Remote or city"],
                  ["startDate", "Start date", "Jan 2025"],
                  ["endDate", "End date", "Present or Dec 2025"],
                ].map(([field, label, placeholder]) => (
                  <Field
                    key={field}
                    label={label}
                    value={entry[field] ?? ""}
                    onChange={(v) =>
                      updateEntry("workExperience", index, field, v)
                    }
                    placeholder={placeholder}
                  />
                ))}
                <label className={`${labelClass} sm:col-span-2`}>
                  Description
                  <textarea
                    className={`${inputClass} min-h-24 resize-y`}
                    value={entry.description ?? ""}
                    onChange={(e) =>
                      updateEntry(
                        "workExperience",
                        index,
                        "description",
                        e.target.value,
                      )
                    }
                    placeholder="Responsibilities and accomplishments..."
                  />
                </label>
              </div>
            </div>
          ))}
          {(profile.workExperience ?? []).length === 0 && (
            <p className="text-sm text-neutral-500 sm:col-span-2">
              No work experience added yet. You can leave this empty if you're
              just starting your career.
            </p>
          )}
        </Section>

        <Section
          title="Online presence"
          description="Share your professional links and resume."
          icon={FiGlobe}
        >
          <Field
            label="Personal website"
            value={profile.website ?? ""}
            onChange={(v) => update("website", v)}
            placeholder="https://example.com"
            type="url"
          />
          <Field
            label="LinkedIn URL"
            value={profile.linkedin ?? ""}
            onChange={(v) => update("linkedin", v)}
            placeholder="https://linkedin.com/in/..."
            type="url"
          />
          <Field
            label="GitHub URL"
            value={profile.github ?? ""}
            onChange={(v) => update("github", v)}
            placeholder="https://github.com/..."
            type="url"
          />
          <Field
            label="Twitter / X URL"
            value={profile.twitter ?? ""}
            onChange={(v) => update("twitter", v)}
            placeholder="https://x.com/..."
            type="url"
          />
          <label className={`${labelClass} sm:col-span-2`}>
            Resume URL
            <input
              className={inputClass}
              type="url"
              value={profile.resumeUrl ?? ""}
              onChange={(e) => update("resumeUrl", e.target.value)}
              placeholder="https://..."
            />
            <span className="mt-1 block text-xs font-normal text-neutral-400">
              Add a publicly accessible resume link.
            </span>
          </label>
        </Section>

        <div className="sticky bottom-0 z-10 -mx-5 border-t border-black/10 bg-[#fafaf8]/95 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto sm:w-auto"
          >
            {saving ? (
              <FiLoader className="animate-spin" size={17} />
            ) : (
              <FiSave size={17} />
            )}
            {saving ? "Saving profile..." : "Save profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
