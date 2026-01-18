"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

// Mock user data - in production, this would come from Supabase
const mockUserProfile = {
  name: "Your Name",
  email: "you@nd.edu",
  major: "Computer Science",
  year: "Junior",
  followers: 42,
  following: 28,
  profileImage: null,
  bio: "Passionate about machine learning and research. Always looking for new opportunities to learn and collaborate.",
  gpa: 3.85,
  education: [
    {
      institution: "University of Notre Dame",
      degree: "Bachelor of Science",
      major: "Computer Science",
      startDate: "2023",
      endDate: "2027",
      current: true,
    },
  ],
  workExperience: [
    {
      title: "Software Engineering Intern",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "June 2024",
      endDate: "August 2024",
      description: "Developed features for web applications using React and Node.js. Collaborated with a team of 5 engineers to deliver production-ready code.",
    },
    {
      title: "Research Assistant",
      company: "Notre Dame Research Labs",
      location: "Notre Dame, IN",
      startDate: "January 2024",
      endDate: "Present",
      description: "Assist in machine learning research projects. Work with graduate students on data analysis and algorithm development.",
    },
  ],
  courses: [
    "Data Structures and Algorithms",
    "Machine Learning",
    "Database Systems",
    "Software Engineering",
    "Computer Systems",
    "Artificial Intelligence",
    "Web Development",
    "Distributed Systems",
  ],
  languages: [
    { name: "Python", proficiency: "Advanced" },
    { name: "JavaScript", proficiency: "Advanced" },
    { name: "Java", proficiency: "Intermediate" },
    { name: "C++", proficiency: "Intermediate" },
    { name: "SQL", proficiency: "Advanced" },
    { name: "Spanish", proficiency: "Conversational" },
  ],
};

// Mock suggested connections based on major
const mockSuggestions = [
  {
    id: 1,
    name: "Alex Johnson",
    major: "Computer Science",
    year: "Senior",
    mutualConnections: 5,
    profileImage: null,
  },
  {
    id: 2,
    name: "Sarah Chen",
    major: "Computer Science",
    year: "Junior",
    mutualConnections: 3,
    profileImage: null,
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    major: "Computer Science",
    year: "Sophomore",
    mutualConnections: 2,
    profileImage: null,
  },
  {
    id: 4,
    name: "Emily Zhang",
    major: "Computer Science",
    year: "Senior",
    mutualConnections: 4,
    profileImage: null,
  },
  {
    id: 5,
    name: "David Kim",
    major: "Computer Science",
    year: "Junior",
    mutualConnections: 6,
    profileImage: null,
  },
];

export default function Profile() {
  const { user, userProfile: initialUserProfile } = useUser();
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    bio: "",
    major: "",
    year: "",
    profileImage: null as string | null,
    gpa: null as string | null,
    workExperience: [] as any[],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [editedMajor, setEditedMajor] = useState("");
  const [editedYear, setEditedYear] = useState("");
  const [editedGpa, setEditedGpa] = useState("");
  const [editedWorkExperience, setEditedWorkExperience] = useState<any[]>([]);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Load profile data including GPA and work experience from Supabase
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) return;

      try {
        // Load full profile from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('gpa, work_experience')
          .eq('id', user.id)
          .single();

        if (profileData) {
          // Handle work_experience which might be JSON string or JSONB object
          let workExp: any[] = [];
          if (profileData.work_experience) {
            try {
              workExp = typeof profileData.work_experience === 'string' 
                ? JSON.parse(profileData.work_experience) 
                : profileData.work_experience;
              if (!Array.isArray(workExp)) {
                workExp = [];
              }
            } catch (e) {
              workExp = [];
            }
          }
          
          setUserProfile(prev => ({
            ...prev,
            gpa: profileData.gpa || null,
            workExperience: workExp,
          }));
          setEditedGpa(profileData.gpa || '');
          setEditedWorkExperience(workExp);
        }

        // Get followers count (users following current user)
        const { count: followersCount } = await supabase
          .from('followers')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', user.id);

        // Get following count (users current user is following)
        const { count: followingCount } = await supabase
          .from('followers')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', user.id);

        // Get list of users current user is following
        const { data: followingData } = await supabase
          .from('followers')
          .select('following_id')
          .eq('follower_id', user.id);

        setFollowerCount(followersCount || 0);
        setFollowingCount(followingCount || 0);
        if (followingData) {
          setFollowedUsers(new Set(followingData.map(f => f.following_id)));
        }
      } catch (error) {
        // If tables don't exist yet, use defaults
        console.error("Error loading profile data:", error);
      }
    };

    loadProfileData();
  }, [user]);

  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      ...initialUserProfile,
    }));
    setEditedName(initialUserProfile.name);
    setEditedBio(initialUserProfile.bio);
    setEditedMajor(initialUserProfile.major);
    setEditedYear(initialUserProfile.year);
  }, [initialUserProfile]);

  const handleSave = async () => {
    if (!user) return;

    // Update user metadata in Supabase
    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        name: editedName,
        bio: editedBio,
        major: editedMajor,
        year: editedYear,
      },
    });

    if (metadataError) {
      alert("Error updating profile: " + metadataError.message);
      return;
    }

    // Update profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email || '',
        name: editedName,
        bio: editedBio,
        major: editedMajor,
        year: editedYear,
        gpa: editedGpa || null,
        work_experience: editedWorkExperience.length > 0 ? editedWorkExperience : null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (profileError && !profileError.message.includes("does not exist")) {
      alert("Error updating profile: " + profileError.message);
      return;
    }

    setUserProfile({
      ...userProfile,
      name: editedName,
      bio: editedBio,
      major: editedMajor,
      year: editedYear,
      gpa: editedGpa || null,
      workExperience: editedWorkExperience,
    });
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleFollow = async (userId: string) => {
    if (!user?.id) return;

    const isCurrentlyFollowing = followedUsers.has(userId);
    let success = false;

    if (isCurrentlyFollowing) {
      // Unfollow: delete the follow relationship
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (!error) {
        const newFollowedUsers = new Set(followedUsers);
        newFollowedUsers.delete(userId);
        setFollowedUsers(newFollowedUsers);
        setFollowingCount(prev => Math.max(0, prev - 1));
        success = true;
      }
    } else {
      // Follow: create the follow relationship
      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: user.id,
          following_id: userId,
        });

      if (!error) {
        const newFollowedUsers = new Set(followedUsers);
        newFollowedUsers.add(userId);
        setFollowedUsers(newFollowedUsers);
        setFollowingCount(prev => prev + 1);
        success = true;
      }
    }

    if (!success) {
      alert("Error updating follow status. Please try again.");
    }
  };

  const isFollowing = (userId: string) => followedUsers.has(userId);

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
            Profile
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

      {/* Main Content - Three Column Layout */}
      <main className="ml-52 mt-24 flex flex-1 overflow-y-auto">
        {/* Left Column - Profile Info */}
        <div className="w-56 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4">
            <div className="mb-3 flex items-center justify-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                {userProfile.profileImage ? (
                  <img
                    src={userProfile.profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-500 dark:text-zinc-400">
                    {userProfile.name
                      ? userProfile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                      : userProfile.email
                      ? userProfile.email[0].toUpperCase()
                      : "?"}
                  </div>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-center text-sm text-zinc-900 placeholder-zinc-500 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                />
                <input
                  type="text"
                  value={editedMajor}
                  onChange={(e) => setEditedMajor(e.target.value)}
                  placeholder="Major"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-center text-xs text-zinc-900 placeholder-zinc-500 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                />
                <select
                  value={editedYear}
                  onChange={(e) => setEditedYear(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-center text-xs text-zinc-900 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                >
                  <option value="">Select Year</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 rounded-lg bg-cyan-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(userProfile.name);
                      setEditedBio(userProfile.bio);
                      setEditedMajor(userProfile.major);
                      setEditedYear(userProfile.year);
                      setEditedGpa(userProfile.gpa || '');
                      setEditedWorkExperience(userProfile.workExperience || []);
                    }}
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="mb-1 text-center text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {userProfile.name || "Your Name"}
                </h1>
                <p className="mb-1 text-center text-xs text-zinc-600 dark:text-zinc-400">
                  {userProfile.email || "Email"}
                </p>
                <p className="mb-3 text-center text-xs text-zinc-600 dark:text-zinc-400">
                  {userProfile.major || userProfile.year
                    ? `${userProfile.major || ""}${userProfile.major && userProfile.year ? " • " : ""}${userProfile.year || ""}`
                    : ""}
                </p>
                <div className="mb-4">
                  {userProfile.bio ? (
                    <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
                      {userProfile.bio}
                    </p>
                  ) : (
                    <p className="text-center text-xs italic text-zinc-400 dark:text-zinc-500">
                      Click Edit to add a bio
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Followers/Following Stats */}
          <div className="mb-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {followerCount}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {followingCount}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Following</p>
              </div>
            </div>
          </div>

          {/* GPA */}
          <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            {isEditing ? (
              <>
                <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">GPA</p>
                <input
                  type="text"
                  value={editedGpa}
                  onChange={(e) => setEditedGpa(e.target.value)}
                  placeholder="3.85"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-center text-base font-bold text-zinc-900 placeholder-zinc-500 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                />
              </>
            ) : (
              <>
                <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">GPA</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {userProfile.gpa || 'N/A'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Center Column - Resume Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Bio Section */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  About
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="rounded-lg bg-cyan-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedBio(userProfile.bio);
                      }}
                      className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {userProfile.bio ? (
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                      {userProfile.bio}
                    </p>
                  ) : (
                    <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
                      No bio yet. Click "Edit" to add information about yourself.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Education Section */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Education
              </h2>
              {mockUserProfile.education.map((edu, index) => (
                <div
                  key={index}
                  className={index !== mockUserProfile.education.length - 1 ? "mb-3 pb-3 border-b border-zinc-200 dark:border-zinc-800" : ""}
                >
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {edu.institution}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {edu.degree} in {edu.major}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
                    {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                  </p>
                </div>
              ))}
            </div>

            {/* Work Experience Section */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  Work Experience
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
                  >
                    Edit
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  {editedWorkExperience.map((work, index) => (
                    <div key={index} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                      <input
                        type="text"
                        value={work.title || ''}
                        onChange={(e) => {
                          const updated = [...editedWorkExperience];
                          updated[index] = { ...updated[index], title: e.target.value };
                          setEditedWorkExperience(updated);
                        }}
                        placeholder="Job Title"
                        className="mb-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                      />
                      <input
                        type="text"
                        value={work.company || ''}
                        onChange={(e) => {
                          const updated = [...editedWorkExperience];
                          updated[index] = { ...updated[index], company: e.target.value };
                          setEditedWorkExperience(updated);
                        }}
                        placeholder="Company"
                        className="mb-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                      />
                      <textarea
                        value={work.description || ''}
                        onChange={(e) => {
                          const updated = [...editedWorkExperience];
                          updated[index] = { ...updated[index], description: e.target.value };
                          setEditedWorkExperience(updated);
                        }}
                        placeholder="Description"
                        rows={3}
                        className="mb-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                      />
                      <button
                        onClick={() => {
                          setEditedWorkExperience(editedWorkExperience.filter((_, i) => i !== index));
                        }}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setEditedWorkExperience([...editedWorkExperience, { title: '', company: '', description: '' }]);
                    }}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    + Add Work Experience
                  </button>
                </div>
              ) : (
                <>
                  {userProfile.workExperience && userProfile.workExperience.length > 0 ? (
                    userProfile.workExperience.map((work, index) => (
                      <div
                        key={index}
                        className={index !== userProfile.workExperience.length - 1 ? "mb-5 pb-5 border-b border-zinc-200 dark:border-zinc-800" : "mb-3"}
                      >
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                          {work.title || 'Untitled Position'}
                        </h3>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {work.company || 'Unknown Company'}
                          {work.location && ` • ${work.location}`}
                        </p>
                        {(work.startDate || work.endDate) && (
                          <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-500">
                            {work.startDate || ''} - {work.endDate || 'Present'}
                          </p>
                        )}
                        {work.description && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            {work.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
                      No work experience yet. Click "Edit" to add your work experience.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Courses Section */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Relevant Courses
              </h2>
              <div className="flex flex-wrap gap-2">
                {mockUserProfile.courses.map((course, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-medium text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Section */}
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Languages & Skills
              </h2>
              <div className="space-y-2">
                {mockUserProfile.languages.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {lang.name}
                    </span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Suggested Connections */}
        <div className="w-64 border-l border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            People You May Know
          </h2>
          <p className="mb-3 text-xs text-zinc-600 dark:text-zinc-400">
            Based on your major ({mockUserProfile.major})
          </p>
          <div className="space-y-3">
            {mockSuggestions.map((person) => (
              <div
                key={person.id}
                className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {person.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {person.name}
                    </p>
                    <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                      {person.major} • {person.year}
                    </p>
                  </div>
                </div>
                <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-500">
                  {person.mutualConnections} mutual{person.mutualConnections !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={() => handleFollow(person.id.toString())}
                  className={`w-full rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isFollowing(person.id.toString())
                      ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                      : "bg-cyan-700 text-white hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                  }`}
                >
                  {isFollowing(person.id.toString()) ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
