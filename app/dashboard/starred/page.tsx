"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/useUser";

// This should match the mockPostings structure from the dashboard
type Posting = {
  id: number;
  professor: string;
  department: string;
  title: string;
  description: string;
  spotsTotal: number;
  spotsFilled: number;
  deadline: Date;
};

export default function Starred() {
  const { userProfile } = useUser();
  const [starredPostings, setStarredPostings] = useState<Posting[]>([]);

  useEffect(() => {
    // In production, this would fetch from Supabase
    // Load starred postings data from localStorage
    const storedStarredData = localStorage.getItem("starredPostingsData");
    if (storedStarredData) {
      try {
        const parsed = JSON.parse(storedStarredData);
        setStarredPostings(
          parsed.map((posting: any) => ({
            ...posting,
            deadline: new Date(posting.deadline),
          }))
        );
      } catch (e) {
        console.error("Error parsing starred postings:", e);
      }
    }
  }, []);

  const handleUnstar = (postingId: number) => {
    const updated = starredPostings.filter((p) => p.id !== postingId);
    setStarredPostings(updated);
    localStorage.setItem("starredPostingsData", JSON.stringify(updated));
    
    // Also update the starred IDs list
    const starredIds = localStorage.getItem("starredPostings");
    if (starredIds) {
      try {
        const ids = JSON.parse(starredIds).filter((id: number) => id !== postingId);
        localStorage.setItem("starredPostings", JSON.stringify(ids));
      } catch (e) {
        console.error("Error updating starred IDs:", e);
      }
    }
    // In production, this would sync with Supabase
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Left Sidebar - Fixed */}
      <aside className="fixed left-0 top-0 h-full w-52 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-full flex-col">
          {/* Profile Section */}
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                {userProfile.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-zinc-500 dark:text-zinc-400">
                    {userProfile.name
                      ? userProfile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      : userProfile.email
                      ? userProfile.email[0].toUpperCase()
                      : "?"}
                  </div>
                )}
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
            Starred
          </h1>
          <Link href="/dashboard/profile" className="cursor-pointer">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700 transition-transform hover:scale-105">
              {userProfile.profileImage ? (
                <img
                  src={userProfile.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-base font-semibold text-zinc-500 dark:text-zinc-400">
                  {userProfile.name
                    ? userProfile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                    : userProfile.email
                    ? userProfile.email[0].toUpperCase()
                    : "?"}
                </div>
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-52 mt-24 flex-1 overflow-y-auto">
        {/* Page Content */}
        <div className="p-6">
          <div className="mx-auto max-w-7xl">
            {starredPostings.length === 0 ? (
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <p className="mt-4 text-base font-medium text-zinc-900 dark:text-zinc-50">
                  No starred opportunities yet
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Star opportunities from the dashboard to save them here
                </p>
                <Link
                  href="/dashboard"
                  className="mt-4 inline-block rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                >
                  Browse Opportunities
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {starredPostings.map((posting) => {
                  const spotsAvailable = posting.spotsTotal - posting.spotsFilled;
                  const isFull = spotsAvailable === 0;
                  const daysLeft = getDaysUntilDeadline(posting.deadline);

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

                      {/* Spots Available and Deadline */}
                      <div className="mb-4 space-y-2">
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
                          {isFull ? (
                            <span className="ml-2 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                              Full
                            </span>
                          ) : (
                            <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              {spotsAvailable} available
                            </span>
                          )}
                        </div>
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            Deadline: {posting.deadline.toLocaleDateString()} ({daysLeft > 0 ? `${daysLeft} days left` : `Overdue`})
                          </span>
                        </div>
                      </div>

                      {/* Unstar Button */}
                      <button
                        onClick={() => handleUnstar(posting.id)}
                        className="w-full rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-800 transition-colors hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                      >
                        ★ Unstar
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
