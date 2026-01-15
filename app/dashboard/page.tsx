"use client";

import Link from "next/link";
import { useState } from "react";

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
  },
  {
    id: 2,
    professor: "Dr. Michael Chen",
    department: "Biology",
    title: "Undergraduate Research in Genetics",
    description: "Research opportunity studying genetic markers in plant development.",
    spotsTotal: 3,
    spotsFilled: 2,
  },
  {
    id: 3,
    professor: "Dr. Emily Rodriguez",
    department: "Chemistry",
    title: "Organic Synthesis Lab Assistant",
    description: "Assist with organic synthesis experiments and data analysis.",
    spotsTotal: 1,
    spotsFilled: 0,
  },
  {
    id: 4,
    professor: "Dr. James Wilson",
    department: "Physics",
    title: "Quantum Computing Research",
    description: "Explore quantum algorithms and their applications in computing.",
    spotsTotal: 2,
    spotsFilled: 1,
  },
];

export default function Dashboard() {
  const [appliedPostings, setAppliedPostings] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  const handleApply = (postingId: number) => {
    setAppliedPostings([...appliedPostings, postingId]);
    // In production, this would make an API call to Supabase
    alert("Application submitted successfully!");
  };

  const isApplied = (postingId: number) => appliedPostings.includes(postingId);

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
    <div className="flex min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-full flex-col">
          {/* Profile Section */}
          <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-500 dark:text-zinc-400">
                  YN
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Your Name
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  you@nd.edu
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-cyan-700 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-400"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/dashboard/opportunities"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Opportunities
            </Link>
            <Link
              href="/dashboard/applications"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Applications
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Dashboard
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Welcome back!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                Notifications
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <div className="mx-auto max-w-7xl">
            {/* Welcome Section */}
            <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Welcome to Strove!
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Browse available research opportunities from professors below.
              </p>
            </div>

            {/* Browse Opportunities Section */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
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
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
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

                      {/* Apply Button */}
                      <button
                        onClick={() => handleApply(posting.id)}
                        disabled={isFull || hasApplied}
                        className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 ${
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
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
