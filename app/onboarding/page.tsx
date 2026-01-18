"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [formData, setFormData] = useState({
    major: "",
    year: "",
    researchInterests: [] as string[],
    gpa: "",
    workExperience: [] as any[],
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleResumeUpload = async (file: File) => {
    setResumeFile(file);
    setIsUploadingResume(true);

    try {
      // Read file as text (this works best for plain text or if we had a parser)
      // For PDF/DOCX, we'll need to use a library or send to API for parsing
      // For now, we'll convert to base64 and let the API handle it
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Call API to parse resume
        const response = await fetch('/api/parse-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            resume: base64, 
            fileName: file.name,
            fileType: file.type 
          }),
        });

        if (!response.ok) {
          let errorMessage = 'Failed to parse resume';
          let isQuotaError = false;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
            
            // Check for quota/billing errors
            if (errorMessage.includes('quota') || 
                errorMessage.includes('billing') || 
                errorMessage.includes('exceeded') ||
                errorMessage.includes('insufficient')) {
              isQuotaError = true;
              errorMessage = 'OpenAI API quota exceeded. You can skip this step and fill in your information manually.';
            }
          } catch (e) {
            // If we can't parse error, use default message
            errorMessage = `Server error (${response.status}). Please try again or skip this step.`;
          }
          
          // For quota errors, show alert but don't throw - allow user to continue
          if (isQuotaError) {
            alert(errorMessage);
            setIsUploadingResume(false);
            return;
          }
          
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Check if response has error field but still returned data
        if (data.error && !data.gpa && (!data.workExperience || data.workExperience.length === 0)) {
          throw new Error(data.message || data.error || 'Failed to parse resume');
        }
        
        setParsedData(data);
        
        // Auto-populate form data with parsed information
        if (data.gpa && data.gpa !== null) {
          setFormData(prev => ({ ...prev, gpa: String(data.gpa) }));
        }
        if (data.workExperience && Array.isArray(data.workExperience) && data.workExperience.length > 0) {
          setFormData(prev => ({ ...prev, workExperience: data.workExperience }));
        }
        
        setIsUploadingResume(false);
      };
      reader.onerror = () => {
        throw new Error('Error reading file');
      };
    } catch (error: any) {
      console.error('Error parsing resume:', error);
      alert(`Error parsing resume: ${error.message}. You can still continue and fill in your information manually.`);
      setIsUploadingResume(false);
    }
  };

  const handleSkipResume = () => {
    setCurrentStep(4); // Skip to research interests step
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Update user metadata with major and year
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata, // Preserve existing metadata (like name)
          major: formData.major,
          year: formData.year,
        },
      });

      if (metadataError) {
        console.error("Error updating user metadata:", metadataError);
        // Continue anyway - we'll try to update the profile table
      }

      // Update or insert profile in profiles table
      const profileUpdateData = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        major: formData.major,
        year: formData.year,
        gpa: formData.gpa || null,
        work_experience: formData.workExperience.length > 0 ? formData.workExperience : null,
        updated_at: new Date().toISOString(),
      };

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert(profileUpdateData, {
          onConflict: 'id'
        })
        .select();

      if (profileError) {
        // If table doesn't exist, that's okay - user can still proceed
        const errorMessage = profileError.message || JSON.stringify(profileError) || 'Unknown error';
        if (!errorMessage.includes("does not exist") && !errorMessage.includes("relation") && !errorMessage.includes("table")) {
          alert(`Error saving profile information: ${errorMessage}. You can still continue - your profile will be saved when the database is set up.`);
          // Don't return - allow user to proceed to dashboard
        }
      } else {
        // Successfully saved - could log this for debugging
        console.log('Profile saved successfully:', profileData);
      }
    }
    
    // Redirect to dashboard after submission
    router.push("/dashboard");
  };

  const canProceed = () => {
    if (currentStep === 1) return formData.major !== "";
    if (currentStep === 2) return formData.year !== "";
    if (currentStep === 3) return true; // Resume is optional
    if (currentStep === 4) return formData.researchInterests.length > 0;
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
              <span>Step {currentStep} of 4</span>
              <span>{Math.round((currentStep / 4) * 100)}% Complete</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full bg-cyan-700 transition-all duration-300 dark:bg-cyan-600"
                style={{ width: `${(currentStep / 4) * 100}%` }}
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

            {/* Step 3: Resume Upload */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
                    Upload Your Resume (Optional)
                  </h2>
                  <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                    We'll automatically extract your GPA and work experience from your resume
                  </p>
                </div>
                <div className="space-y-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 transition-colors hover:border-cyan-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-cyan-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="mb-4 h-12 w-12 text-zinc-500 dark:text-zinc-400"
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
                      <p className="text-base text-zinc-600 dark:text-zinc-400">
                        {resumeFile ? (
                          <span className="font-medium text-cyan-700 dark:text-cyan-400">{resumeFile.name}</span>
                        ) : (
                          <>
                            <span className="font-medium text-cyan-700 dark:text-cyan-400">Click to upload</span> or drag and drop
                          </>
                        )}
                      </p>
                      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">PDF, DOC, DOCX (MAX. 5MB)</p>
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
                          handleResumeUpload(file);
                        }
                      }}
                      disabled={isUploadingResume}
                    />
                  </label>
                  {isUploadingResume && (
                    <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                      Parsing resume with AI...
                    </div>
                  )}
                  {parsedData && !isUploadingResume && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                      <p className="text-sm font-medium text-green-800 dark:text-green-400">
                        ✓ Resume parsed successfully! Your profile has been auto-populated.
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSkipResume}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Research Interests */}
            {currentStep === 4 && (
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

              {currentStep < 4 ? (
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
