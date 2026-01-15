"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const terms = formData.get("terms");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    // Validate @nd.edu email
    if (!email.endsWith("@nd.edu")) {
      setError("Only Notre Dame (@nd.edu) email addresses are allowed");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    if (!terms) {
      setError("Please agree to the Terms and Conditions");
      setIsSubmitting(false);
      return;
    }

    // Sign up with Supabase
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Redirect to onboarding page
      router.push("/onboarding");
    } catch (err: any) {
      const errorMessage = err?.message || err?.toString() || "Something went wrong. Please try again.";
      if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        setError("Network error: Unable to connect to Supabase. Please check your internet connection and ensure Supabase is properly configured.");
      } else {
        setError(errorMessage);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Navigation */}
      <nav className="w-full border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <Link href="/" className="text-xl font-bold text-black dark:text-zinc-50">
            Strove
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-base font-medium text-zinc-700 transition-colors hover:text-cyan-700 dark:text-zinc-300 dark:hover:text-cyan-500"
            >
              About
            </Link>
            <Link
              href="/signin"
              className="text-base font-medium text-zinc-700 transition-colors hover:text-cyan-700 dark:text-zinc-300 dark:hover:text-cyan-500"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-base font-medium text-cyan-700 dark:text-cyan-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-6 py-16 sm:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
              Sign Up
            </h1>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              Create your Strove account to get started
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-500 shadow-sm transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-500 shadow-sm transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                  placeholder="you@nd.edu"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-500 shadow-sm transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-500 shadow-sm transition-colors focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-zinc-300 text-cyan-700 focus:ring-cyan-700 dark:border-zinc-600 dark:focus:ring-cyan-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                I agree to the{" "}
                <Link
                  href="#"
                  className="font-medium text-cyan-700 hover:text-cyan-800 dark:text-cyan-500 dark:hover:text-cyan-400"
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-lg px-4 py-3 text-base font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 ${
                  isSubmitting
                    ? "cursor-not-allowed bg-zinc-400 dark:bg-zinc-600"
                    : "bg-cyan-700 hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                }`}
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-zinc-600 dark:text-zinc-400">
                Already have an account?{" "}
              </span>
              <Link
                href="/signin"
                className="font-medium text-cyan-700 hover:text-cyan-800 dark:text-cyan-500 dark:hover:text-cyan-400"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
