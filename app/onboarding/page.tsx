"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    major: "",
    year: "",
    researchInterests: [] as string[],
  });

  const majors = [
    "Computer Science",
    "Engineering",
    "Biology",
    "Chemistry",
    "Physics",
    "Mathematics",
    "Psychology",
    "Business",
    "Economics",
    "Political Science",
    "History",
    "English",
    "Other",
  ];

  const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate Student"];

  const researchAreas = [
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Biotechnology",
    "Renewable Energy",
    "Climate Science",
    "Neuroscience",
    "Biomedical Engineering",
    "Robotics",
    "Cybersecurity",
    "Quantum Computing",
    "Materials Science",
    "Social Sciences",
    "Economics Research",
    "Other",
  ];

  const handleMajorChange = (major: string) => {
    setFormData({ ...formData, major });
  };

  const handleYearChange = (year: string) => {
    setFormData({ ...formData, year });
  };

  const handleResearchInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.researchInterests.includes(interest)
        ? prev.researchInterests.filter((i) => i !== interest)
        : [...prev.researchInterests, interest];
      return { ...prev, researchInterests: interests };
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit form data to backend
    console.log("Form submitted:", formData);
    // Redirect to dashboard after submission
    router.push("/dashboard");
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.major !== "";
    if (currentStep === 2) return formData.year !== "";
    if (currentStep === 3) return formData.researchInterests.length > 0;
    return false;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-950">
      {/* Navigation */}
      <nav className="w-full border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <Link href="/" className="text-xl font-bold text-black dark:text-zinc-50">
            Strove
          </Link>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-6 py-16 sm:px-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full bg-cyan-700 transition-all duration-300 dark:bg-cyan-600"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Major */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
                    What's your major?
                  </h2>
                  <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                    Select your field of study
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {majors.map((major) => (
                    <button
                      key={major}
                      type="button"
                      onClick={() => handleMajorChange(major)}
                      className={`rounded-lg border-2 px-4 py-3 text-left text-base font-medium transition-colors ${
                        formData.major === major
                          ? "border-cyan-700 bg-cyan-50 text-cyan-900 dark:border-cyan-500 dark:bg-cyan-900/20 dark:text-cyan-400"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
                      }`}
                    >
                      {major}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Year */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
                    What year are you?
                  </h2>
                  <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                    Select your academic year
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearChange(year)}
                      className={`rounded-lg border-2 px-4 py-3 text-left text-base font-medium transition-colors ${
                        formData.year === year
                          ? "border-cyan-700 bg-cyan-50 text-cyan-900 dark:border-cyan-500 dark:bg-cyan-900/20 dark:text-cyan-400"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Research Interests */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
                    What are you looking to research?
                  </h2>
                  <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                    Select all areas that interest you
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {researchAreas.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleResearchInterestToggle(area)}
                      className={`rounded-lg border-2 px-4 py-3 text-left text-base font-medium transition-colors ${
                        formData.researchInterests.includes(area)
                          ? "border-cyan-700 bg-cyan-50 text-cyan-900 dark:border-cyan-500 dark:bg-cyan-900/20 dark:text-cyan-400"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`rounded-lg border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-700 transition-colors dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 ${
                  currentStep === 1
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-700"
                }`}
              >
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`rounded-lg px-6 py-3 text-base font-semibold text-white transition-colors ${
                    canProceed()
                      ? "bg-cyan-700 hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                      : "cursor-not-allowed bg-zinc-400 dark:bg-zinc-600"
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed()}
                  className={`rounded-lg px-6 py-3 text-base font-semibold text-white transition-colors ${
                    canProceed()
                      ? "bg-cyan-700 hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700"
                      : "cursor-not-allowed bg-zinc-400 dark:bg-zinc-600"
                  }`}
                >
                  Complete Setup
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
