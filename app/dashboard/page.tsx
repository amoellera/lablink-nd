"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";

// Mock data for postings - in production, this would come from Supabase
const mockPostings = [
  {
    id: 1,
    professor: "Dr. Sarah Johnson",
    department: "Computer Science",
    title: "Machine Learning Research Assistant",
    description: "Join our team working on cutting-edge ML algorithms for healthcare applications.",
    spotsTotal: 2,
    spotsFilled: 1,
    deadline: new Date("2026-02-15"), // 30 days from now (assuming today is around Jan 16)
    applicationQuestions: [
      "Why are you interested in machine learning research?",
      "Describe any previous experience with Python or machine learning frameworks.",
      "What are your research goals for this position?",
    ],
  },
  {
    id: 2,
    professor: "Dr. Michael Chen",
    department: "Biology",
    title: "Undergraduate Research in Genetics",
    description: "Research opportunity studying genetic markers in plant development.",
    spotsTotal: 3,
    spotsFilled: 2,
    deadline: new Date("2026-03-01"), // 45 days from now
    applicationQuestions: [
      "What draws you to genetics research?",
      "Have you completed any biology laboratory courses?",
    ],
  },
  {
    id: 3,
    professor: "Dr. Emily Rodriguez",
    department: "Chemistry",
    title: "Organic Synthesis Lab Assistant",
    description: "Assist with organic synthesis experiments and data analysis.",
    spotsTotal: 1,
    spotsFilled: 0,
    deadline: new Date("2026-01-25"), // 10 days from now
    applicationQuestions: [
      "Which organic chemistry courses have you completed?",
      "Describe your interest in synthetic chemistry.",
    ],
  },
  {
    id: 4,
    professor: "Dr. James Wilson",
    department: "Physics",
    title: "Quantum Computing Research",
    description: "Explore quantum algorithms and their applications in computing.",
    spotsTotal: 2,
    spotsFilled: 1,
    deadline: new Date("2026-02-28"), // 43 days from now
    applicationQuestions: [
      "Have you studied quantum mechanics? If so, which courses?",
      "What interests you about quantum computing?",
      "Describe your mathematical background.",
    ],
  },
];

export default function Dashboard() {
  const { userProfile } = useUser();
  const [appliedPostings, setAppliedPostings] = useState<number[]>([]);
  const [starredPostings, setStarredPostings] = useState<number[]>([]);
  const [applicationData, setApplicationData] = useState<Record<number, { appliedDate: Date }>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedPostingForApplication, setSelectedPostingForApplication] = useState<typeof mockPostings[0] | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const storedApplied = localStorage.getItem("appliedPostings");
    const storedStarred = localStorage.getItem("starredPostings");
    const storedApplications = localStorage.getItem("applications");

    if (storedApplied) {
      try {
        setAppliedPostings(JSON.parse(storedApplied));
      } catch (e) {
        console.error("Error parsing applied postings:", e);
      }
    }

    if (storedStarred) {
      try {
        setStarredPostings(JSON.parse(storedStarred));
      } catch (e) {
        console.error("Error parsing starred postings:", e);
      }
    }

    if (storedApplications) {
      try {
        const parsed = JSON.parse(storedApplications);
        const appData: Record<number, { appliedDate: Date }> = {};
        parsed.forEach((app: any) => {
          appData[app.id] = { appliedDate: new Date(app.appliedDate) };
        });
        setApplicationData(appData);
      } catch (e) {
        console.error("Error parsing applications:", e);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("appliedPostings", JSON.stringify(appliedPostings));
  }, [appliedPostings]);

  useEffect(() => {
    localStorage.setItem("starredPostings", JSON.stringify(starredPostings));
    
    // Also save starred postings data for the starred page
    const starredData = mockPostings
      .filter((p) => starredPostings.includes(p.id))
      .map((posting) => ({
        ...posting,
        deadline: posting.deadline.toISOString(),
      }));
    localStorage.setItem("starredPostingsData", JSON.stringify(starredData));
  }, [starredPostings]);

  useEffect(() => {
    const applicationsForStorage = mockPostings
      .filter((p) => appliedPostings.includes(p.id))
      .map((posting) => ({
        ...posting,
        appliedDate: (applicationData[posting.id]?.appliedDate || new Date()).toISOString(),
        deadline: posting.deadline.toISOString(),
      }));
    localStorage.setItem("applications", JSON.stringify(applicationsForStorage));
  }, [appliedPostings, applicationData]);

  const handleApply = (postingId: number) => {
    const posting = mockPostings.find((p) => p.id === postingId);
    if (posting) {
      setSelectedPostingForApplication(posting);
      setShowApplicationModal(true);
      // Reset form state
      setResumeFile(null);
      setQuestionAnswers({});
    }
  };

  const handleSubmitApplication = () => {
    if (!selectedPostingForApplication || !resumeFile) {
      alert("Please attach your resume before submitting.");
      return;
    }

    // Check if all questions are answered
    const allQuestionsAnswered = selectedPostingForApplication.applicationQuestions?.every(
      (question) => questionAnswers[question] && questionAnswers[question].trim() !== ""
    );

    if (!allQuestionsAnswered) {
      alert("Please answer all application questions before submitting.");
      return;
    }

    // Submit application
    const postingId = selectedPostingForApplication.id;
    const newApplied = [...appliedPostings, postingId];
    setAppliedPostings(newApplied);
    setApplicationData({
      ...applicationData,
      [postingId]: { appliedDate: new Date() },
    });

    // In production, this would upload the resume and submit answers to Supabase
    console.log("Resume file:", resumeFile.name);
    console.log("Question answers:", questionAnswers);

    // Close modal and reset
    setShowApplicationModal(false);
    setSelectedPostingForApplication(null);
    setResumeFile(null);
    setQuestionAnswers({});
    alert("Application submitted successfully!");
  };

  const handleCloseModal = () => {
    setShowApplicationModal(false);
    setSelectedPostingForApplication(null);
    setResumeFile(null);
    setQuestionAnswers({});
  };

  const handleStar = (postingId: number) => {
    let newStarred;
    if (starredPostings.includes(postingId)) {
      newStarred = starredPostings.filter((id) => id !== postingId);
    } else {
      newStarred = [...starredPostings, postingId];
    }
    setStarredPostings(newStarred);
    // In production, this would sync with Supabase
  };

  const isApplied = (postingId: number) => appliedPostings.includes(postingId);
  const isStarred = (postingId: number) => starredPostings.includes(postingId);

  // Helper function to calculate deadline progress
  const getDeadlineProgress = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalDays = 60; // Assuming typical application window is 60 days
    const progress = Math.max(0, Math.min(100, ((totalDays - diffDays) / totalDays) * 100));
    return { diffDays, progress };
  };

  // Get applied postings with deadlines for the dashboard display
  const appliedWithDeadlines = mockPostings
    .filter((posting) => isApplied(posting.id))
    .map((posting) => ({
      ...posting,
      appliedDate: applicationData[posting.id]?.appliedDate || new Date(),
    }))
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  // Get unique departments for filter dropdown
  const departments = Array.from(new Set(mockPostings.map((p) => p.department)));

  // Filter postings based on search and filters
  const filteredPostings = mockPostings.filter((posting) => {
    // Search filter - search across professor, title, description, and department
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      posting.professor.toLowerCase().includes(searchLower) ||
      posting.title.toLowerCase().includes(searchLower) ||
      posting.description.toLowerCase().includes(searchLower) ||
      posting.department.toLowerCase().includes(searchLower);

    // Department filter
    const matchesDepartment =
      selectedDepartment === "all" || posting.department === selectedDepartment;

    // Availability filter
    const spotsAvailable = posting.spotsTotal - posting.spotsFilled;
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && spotsAvailable > 0) ||
      (availabilityFilter === "full" && spotsAvailable === 0);

    return matchesSearch && matchesDepartment && matchesAvailability;
  });
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Left Sidebar - Fixed */}
      <aside className="fixed left-0 top-0 h-full w-52 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-full flex-col">
          {/* Profile Section */}
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-zinc-500 dark:text-zinc-400">
                  {userProfile.name
                    ? userProfile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : userProfile.email
                    ? userProfile.email[0].toUpperCase()
                    : "?"}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                  {userProfile.name || "Your Name"}
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                  {userProfile.email || "Email"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 p-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-cyan-700 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-400"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/dashboard/positions"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Positions
            </Link>
            <Link
              href="/dashboard/applications"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Applications
            </Link>
            <Link
              href="/dashboard/starred"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Starred
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </Link>
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Top Header Bar - Fixed */}
      <header className="fixed left-52 right-0 top-0 z-40 border-b border-zinc-200 bg-white px-8 py-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <Link href="/dashboard/profile" className="cursor-pointer">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700 transition-transform hover:scale-105">
              {userProfile.name
                ? userProfile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                : userProfile.email
                ? userProfile.email[0].toUpperCase()
                : "?"}
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-52 mt-16 flex-1 overflow-y-auto">
        {/* Page Content */}
        <div className="p-6">
          <div className="mx-auto max-w-7xl">
            {/* Welcome Section */}
            <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Welcome to Strove!
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Browse available research opportunities from professors below.
              </p>
            </div>

            {/* Upcoming Deadlines Section */}
            {appliedWithDeadlines.length > 0 && (
              <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  Upcoming Application Deadlines
                </h2>
                <div className="space-y-4">
                  {appliedWithDeadlines.map((posting) => {
                    const { diffDays, progress } = getDeadlineProgress(posting.deadline);
                    const isOverdue = diffDays < 0;
                    const isUrgent = diffDays >= 0 && diffDays <= 7;
                    
                    return (
                      <div
                        key={posting.id}
                        className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                              {posting.title}
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              {posting.professor} • {posting.department}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              isOverdue
                                ? "text-red-600 dark:text-red-400"
                                : isUrgent
                                ? "text-orange-600 dark:text-orange-400"
                                : "text-zinc-600 dark:text-zinc-400"
                            }`}>
                              {isOverdue
                                ? `Overdue by ${Math.abs(diffDays)} days`
                                : `${diffDays} days left`}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500">
                              Deadline: {posting.deadline.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                          <div
                            className={`h-full transition-all ${
                              isOverdue
                                ? "bg-red-600 dark:bg-red-500"
                                : isUrgent
                                ? "bg-orange-600 dark:bg-orange-500"
                                : "bg-cyan-600 dark:bg-cyan-500"
                            }`}
                            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Browse Opportunities Section */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  Browse Opportunities
                </h2>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {filteredPostings.length} of {mockPostings.length} opportunities
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by professor, research topic, or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-4 text-base text-zinc-900 placeholder-zinc-500 shadow-sm transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <svg
                        className="h-5 w-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Filter Row */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Department Filter */}
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="department-filter"
                      className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Department:
                    </label>
                    <select
                      id="department-filter"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    >
                      <option value="all">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability Filter */}
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="availability-filter"
                      className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Availability:
                    </label>
                    <select
                      id="availability-filter"
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    >
                      <option value="all">All Opportunities</option>
                      <option value="available">Available Spots</option>
                      <option value="full">Full</option>
                    </select>
                  </div>

                  {/* Clear Filters Button */}
                  {(searchQuery || selectedDepartment !== "all" || availabilityFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDepartment("all");
                        setAvailabilityFilter("all");
                      }}
                      className="text-sm font-medium text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Results Message */}
              {filteredPostings.length === 0 && (
                <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <svg
                    className="mx-auto h-12 w-12 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-4 text-base font-medium text-zinc-900 dark:text-zinc-50">
                    No opportunities found
                  </p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}

              {/* Postings Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPostings.map((posting) => {
                  const spotsAvailable = posting.spotsTotal - posting.spotsFilled;
                  const isFull = spotsAvailable === 0;
                  const hasApplied = isApplied(posting.id);

                  return (
                    <div
                      key={posting.id}
                      className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      {/* Professor Info */}
                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                          {posting.professor}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {posting.department}
                        </p>
                      </div>

                      {/* Title */}
                      <h4 className="mb-2 text-base font-medium text-zinc-900 dark:text-zinc-50">
                        {posting.title}
                      </h4>

                      {/* Description */}
                      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {posting.description}
                      </p>

                      {/* Spots Available */}
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>
                            {posting.spotsFilled}/{posting.spotsTotal} spots filled
                          </span>
                        </div>
                        {isFull && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            Full
                          </span>
                        )}
                        {!isFull && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            {spotsAvailable} available
                          </span>
                        )}
                      </div>

                      {/* Star and Apply Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStar(posting.id)}
                          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 ${
                            isStarred(posting.id)
                              ? "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                              : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          }`}
                        >
                          {isStarred(posting.id) ? "★ Starred" : "☆ Star"}
                        </button>
                        <button
                          onClick={() => handleApply(posting.id)}
                          disabled={isFull || hasApplied}
                          className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 ${
                            hasApplied
                              ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                              : isFull
                              ? "cursor-not-allowed bg-zinc-400 dark:bg-zinc-600"
                              : "bg-cyan-700 hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                          }`}
                        >
                          {hasApplied
                            ? "✓ Applied"
                            : isFull
                            ? "Full"
                            : "Apply"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Application Modal */}
      {showApplicationModal && selectedPostingForApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            {/* Modal Header */}
            <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    Apply to {selectedPostingForApplication.title}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {selectedPostingForApplication.professor} • {selectedPostingForApplication.department}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Resume Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Resume <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2">
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-6 transition-colors hover:border-cyan-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-cyan-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="mb-2 h-8 w-8 text-zinc-500 dark:text-zinc-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {resumeFile ? (
                            <span className="font-medium text-cyan-700 dark:text-cyan-400">{resumeFile.name}</span>
                          ) : (
                            <>
                              <span className="font-medium text-cyan-700 dark:text-cyan-400">Click to upload</span> or drag and drop
                            </>
                          )}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">PDF, DOC, DOCX (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("File size must be less than 5MB");
                              return;
                            }
                            setResumeFile(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Application Questions */}
                {selectedPostingForApplication.applicationQuestions && selectedPostingForApplication.applicationQuestions.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Application Questions
                    </h3>
                    <div className="space-y-4">
                      {selectedPostingForApplication.applicationQuestions.map((question, index) => (
                        <div key={index}>
                          <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {question} <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            rows={4}
                            value={questionAnswers[question] || ""}
                            onChange={(e) =>
                              setQuestionAnswers({
                                ...questionAnswers,
                                [question]: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                            placeholder="Your answer..."
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-200 p-6 dark:border-zinc-800">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
