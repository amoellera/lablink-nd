"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser } from "@/lib/useUser";

// Extended position data with more details
type Position = {
  id: number;
  professor: string;
  department: string;
  title: string;
  description: string;
  spotsTotal: number;
  spotsFilled: number;
  deadline: Date;
  postedDate: Date;
  labName: string;
  labLocation: string;
  internshipLength: string; // e.g., "10 weeks", "1 semester", "Full academic year"
  summary: string; // More extensive description
};

// Mock positions data - in production, this would come from Supabase
const mockPositions: Position[] = [
  {
    id: 1,
    professor: "Dr. Sarah Johnson",
    department: "Computer Science",
    title: "Machine Learning Research Assistant",
    description: "Join our team working on cutting-edge ML algorithms for healthcare applications.",
    spotsTotal: 2,
    spotsFilled: 1,
    deadline: new Date("2026-02-15"),
    postedDate: new Date("2026-01-01"),
    labName: "Intelligent Systems Laboratory",
    labLocation: "Fitzpatrick Hall, Room 365",
    internshipLength: "Full Academic Year (Fall & Spring)",
    summary: "The Intelligent Systems Laboratory is seeking motivated undergraduate students to join our research team focused on developing machine learning algorithms for healthcare applications. This position offers hands-on experience with state-of-the-art deep learning frameworks including TensorFlow and PyTorch. Students will work directly with graduate researchers and faculty on projects involving medical image analysis, predictive modeling for patient outcomes, and natural language processing of clinical notes. Prior experience with Python and basic machine learning concepts is preferred but not required. The lab provides opportunities for co-authorship on publications and presentations at conferences. Weekly lab meetings, reading groups, and one-on-one mentorship are integral parts of this research experience.",
  },
  {
    id: 2,
    professor: "Dr. Michael Chen",
    department: "Biology",
    title: "Undergraduate Research in Genetics",
    description: "Research opportunity studying genetic markers in plant development.",
    spotsTotal: 3,
    spotsFilled: 2,
    deadline: new Date("2026-03-01"),
    postedDate: new Date("2026-01-05"),
    labName: "Plant Genetics and Development Lab",
    labLocation: "Galvin Life Science Center, Room 203",
    internshipLength: "10 weeks (Summer)",
    summary: "Join the Plant Genetics and Development Lab for an immersive summer research experience investigating genetic markers associated with plant growth and development. This project focuses on understanding how specific genes regulate flowering time and stress responses in model organisms. Undergraduate researchers will learn essential molecular biology techniques including PCR, gel electrophoresis, DNA sequencing, and gene expression analysis. The lab uses Arabidopsis thaliana and crop plants as model systems. Students will participate in weekly lab meetings, journal clubs, and have the opportunity to present their findings at the end of the summer. No prior research experience is required, but a strong interest in genetics and molecular biology is essential. This position offers excellent preparation for graduate school and careers in biotechnology.",
  },
  {
    id: 3,
    professor: "Dr. Emily Rodriguez",
    department: "Chemistry",
    title: "Organic Synthesis Lab Assistant",
    description: "Assist with organic synthesis experiments and data analysis.",
    spotsTotal: 1,
    spotsFilled: 0,
    deadline: new Date("2026-01-25"),
    postedDate: new Date("2025-12-15"),
    labName: "Organic Materials Research Group",
    labLocation: "Stepan Chemistry Hall, Room 115",
    internshipLength: "1 Semester (Fall or Spring)",
    summary: "The Organic Materials Research Group is looking for an enthusiastic undergraduate student to assist with organic synthesis projects aimed at developing novel materials for electronic applications. This position involves working with advanced synthetic chemistry techniques including multi-step organic synthesis, purification methods (column chromatography, recrystallization), and spectroscopic characterization (NMR, IR, MS). The student will work on synthesizing conjugated organic molecules for use in organic photovoltaics and light-emitting devices. Safety training and proper handling of chemicals will be emphasized. The ideal candidate should have completed at least one semester of organic chemistry. The position requires approximately 10-15 hours per week during the semester, with flexibility around exam periods. This is an excellent opportunity to gain hands-on research experience in a collaborative environment and contribute to publications.",
  },
  {
    id: 4,
    professor: "Dr. James Wilson",
    department: "Physics",
    title: "Quantum Computing Research",
    description: "Explore quantum algorithms and their applications in computing.",
    spotsTotal: 2,
    spotsFilled: 1,
    deadline: new Date("2026-02-28"),
    postedDate: new Date("2026-01-10"),
    labName: "Quantum Information and Computing Lab",
    labLocation: "Nieuwland Science Hall, Room 276",
    internshipLength: "Full Academic Year (Flexible)",
    summary: "The Quantum Information and Computing Lab invites undergraduate students to participate in cutting-edge research on quantum computing algorithms and quantum information theory. This interdisciplinary position combines theoretical physics, computer science, and mathematics to explore the potential of quantum computers to solve problems that are intractable for classical computers. Students will work on projects involving quantum algorithm design, quantum error correction, and simulation of quantum systems using classical computers. Prior coursework in quantum mechanics or linear algebra is highly recommended. The lab provides training in quantum computing frameworks like Qiskit and Cirq. Research topics include optimization problems, quantum machine learning, and quantum cryptography. Students will collaborate with graduate students and postdocs, attend weekly seminars, and have opportunities to present work at conferences. This position is particularly suitable for students interested in pursuing graduate studies in quantum information science.",
  },
  {
    id: 5,
    professor: "Dr. Lisa Park",
    department: "Computer Science",
    title: "Human-Computer Interaction Research",
    description: "Study user interfaces and accessibility in software design.",
    spotsTotal: 2,
    spotsFilled: 0,
    deadline: new Date("2026-03-15"),
    postedDate: new Date("2026-01-12"),
    labName: "Interactive Systems Lab",
    labLocation: "Fitzpatrick Hall, Room 288",
    internshipLength: "1-2 Semesters",
    summary: "The Interactive Systems Lab is conducting research on improving human-computer interaction with a focus on accessibility and inclusive design. Undergraduate researchers will help design, implement, and evaluate user interfaces for diverse user populations, including individuals with disabilities. This position involves user studies, prototype development, data analysis, and iterative design processes. Students will learn usability testing methodologies, statistical analysis of user data, and modern web/mobile development frameworks. Projects may include developing assistive technologies, creating accessible educational software, or designing interfaces for healthcare applications. Strong communication skills and empathy are essential for this position. The lab emphasizes the importance of user-centered design and ethical considerations in technology development. Experience with JavaScript, React, or similar web technologies is a plus but not required. Weekly lab meetings and collaborative design sessions are core to the experience.",
  },
  {
    id: 6,
    professor: "Dr. Robert Kim",
    department: "Engineering",
    title: "Renewable Energy Systems Design",
    description: "Design and test components for solar and wind energy systems.",
    spotsTotal: 3,
    spotsFilled: 1,
    deadline: new Date("2026-02-20"),
    postedDate: new Date("2025-12-20"),
    labName: "Sustainable Energy Research Laboratory",
    labLocation: "Fitzpatrick Hall of Engineering, Room 156",
    internshipLength: "Full Academic Year",
    summary: "The Sustainable Energy Research Laboratory offers undergraduate research positions focused on renewable energy systems, with particular emphasis on solar photovoltaic and wind energy technologies. Students will work on projects involving system design, performance optimization, and economic analysis of renewable energy installations. Hands-on work includes building and testing prototypes, conducting performance measurements, and analyzing data using MATLAB and Python. The lab collaborates with industry partners and conducts field studies at campus renewable energy installations. Students will gain experience with power electronics, instrumentation, and data acquisition systems. This position is ideal for engineering students interested in sustainable technology and climate solutions. No prior research experience is required, but coursework in circuits, thermodynamics, or energy systems is helpful. The lab provides opportunities for conference presentations and potential publication. Students commit to 8-12 hours per week during the academic year.",
  },
];

export default function Positions() {
  const { userProfile } = useUser();
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    mockPositions.length > 0 ? mockPositions[0] : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [starredPositions, setStarredPositions] = useState<number[]>([]);

  const handleShare = async (position: Position) => {
    const url = `${window.location.origin}/dashboard/positions?id=${position.id}`;
    const shareText = `Check out this research position: ${position.title} with ${position.professor}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: position.title,
          text: shareText,
          url: url,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.log("Error copying to clipboard:", err);
      }
    }
  };

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const spotsAvailable = (position: Position) => position.spotsTotal - position.spotsFilled;

  const handleStar = (positionId: number) => {
    if (starredPositions.includes(positionId)) {
      setStarredPositions(starredPositions.filter((id) => id !== positionId));
    } else {
      setStarredPositions([...starredPositions, positionId]);
    }
    // In production, this would sync with Supabase
  };

  const isStarred = (positionId: number) => starredPositions.includes(positionId);

  // Get similar positions based on department
  const getSimilarPositions = (position: Position) => {
    return mockPositions
      .filter((p) => p.id !== position.id && p.department === position.department)
      .slice(0, 3); // Show up to 3 similar positions
  };

  // Filter positions based on search query
  const filteredPositions = mockPositions.filter((position) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      position.title.toLowerCase().includes(searchLower) ||
      position.professor.toLowerCase().includes(searchLower) ||
      position.department.toLowerCase().includes(searchLower) ||
      position.labName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Left Sidebar Navigation - Fixed */}
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
            Positions
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

      {/* Main Content - Split Panel Layout */}
      <main className="ml-52 mt-24 flex flex-1 overflow-hidden">
        {/* Left Panel - Scrollable Position List */}
        <div className="flex h-full w-1/3 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Research Positions
            </h2>
            {/* Search Bar */}
            <div className="relative mb-3">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-zinc-400"
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
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-500 transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <svg
                    className="h-4 w-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
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
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {filteredPositions.length} position{filteredPositions.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredPositions.map((position) => {
              const isSelected = selectedPosition?.id === position.id;
              const available = spotsAvailable(position);
              const isFull = available === 0;

              return (
                <button
                  key={position.id}
                  onClick={() => setSelectedPosition(position)}
                  className={`w-full border-b border-zinc-200 p-4 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 ${
                    isSelected
                      ? "bg-cyan-50 dark:bg-cyan-900/20"
                      : "bg-white dark:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          isSelected
                            ? "text-cyan-900 dark:text-cyan-400"
                            : "text-zinc-900 dark:text-zinc-50"
                        }`}
                      >
                        {position.title}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {position.professor} • {position.department}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">
                          {getDaysAgo(position.postedDate)}
                        </span>
                        {isFull ? (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            Full
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            {available} spot{available !== 1 ? "s" : ""} available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Position Details */}
        <div className="h-full flex-1 overflow-y-auto">
          {selectedPosition ? (
            <div className="p-8">
              <div className="mx-auto max-w-4xl space-y-8">
                {/* Header Section */}
                <div>
                  <h1 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {selectedPosition.title}
                  </h1>
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <span>Posted {getDaysAgo(selectedPosition.postedDate)}</span>
                    <span>•</span>
                    <span>Deadline: {selectedPosition.deadline.toLocaleDateString()}</span>
                  </div>

                  {/* Share and Star Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleShare(selectedPosition)}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      Share Position
                    </button>
                    <button
                      onClick={() => handleStar(selectedPosition.id)}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                        isStarred(selectedPosition.id)
                          ? "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                          : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {isStarred(selectedPosition.id) ? "★ Starred" : "☆ Star"}
                    </button>
                  </div>
                </div>

                {/* Professor and Lab Details */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    Professor & Lab Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Professor
                      </p>
                      <p className="text-base text-zinc-900 dark:text-zinc-50">
                        {selectedPosition.professor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Department
                      </p>
                      <p className="text-base text-zinc-900 dark:text-zinc-50">
                        {selectedPosition.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Lab Name
                      </p>
                      <p className="text-base text-zinc-900 dark:text-zinc-50">
                        {selectedPosition.labName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Lab Location
                      </p>
                      <p className="text-base text-zinc-900 dark:text-zinc-50">
                        {selectedPosition.labLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Research Internship Length */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    Research Internship Length
                  </h2>
                  <p className="text-base text-zinc-600 dark:text-zinc-400">
                    {selectedPosition.internshipLength}
                  </p>
                </div>

                {/* Availability */}
                <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    Availability
                  </h2>
                  <p className="text-base text-zinc-600 dark:text-zinc-400">
                    {selectedPosition.spotsFilled} of {selectedPosition.spotsTotal} spots filled
                    {spotsAvailable(selectedPosition) > 0 && (
                      <span className="ml-2 text-green-600 dark:text-green-400">
                        ({spotsAvailable(selectedPosition)} spot{spotsAvailable(selectedPosition) !== 1 ? "s" : ""} available)
                      </span>
                    )}
                  </p>
                </div>

                {/* Summary Section */}
                <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                  <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    Summary
                  </h2>
                  <p className="whitespace-pre-line text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {selectedPosition.summary}
                  </p>
                </div>

                {/* Similar Positions Section */}
                {getSimilarPositions(selectedPosition).length > 0 && (
                  <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <h2 className="mb-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Similar Positions
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {getSimilarPositions(selectedPosition).map((similarPosition) => {
                        const available = spotsAvailable(similarPosition);
                        const isFull = available === 0;

                        return (
                          <button
                            key={similarPosition.id}
                            onClick={() => setSelectedPosition(similarPosition)}
                            className="rounded-lg border border-zinc-200 bg-white p-4 text-left transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                          >
                            <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                              {similarPosition.title}
                            </h3>
                            <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                              {similarPosition.professor} • {similarPosition.department}
                            </p>
                            <p className="mb-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                              {similarPosition.description}
                            </p>
                            <div className="flex items-center gap-2">
                              {isFull ? (
                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                                  Full
                                </span>
                              ) : (
                                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                  {available} spot{available !== 1 ? "s" : ""} available
                                </span>
                              )}
                              <span className="text-xs text-zinc-500 dark:text-zinc-500">
                                {getDaysAgo(similarPosition.postedDate)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-4 text-base font-medium text-zinc-900 dark:text-zinc-50">
                  Select a position to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
