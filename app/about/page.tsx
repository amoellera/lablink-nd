import Link from "next/link";

export default function About() {
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
              className="text-base font-medium text-cyan-700 dark:text-cyan-500"
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
              className="text-base font-medium text-zinc-700 transition-colors hover:text-cyan-700 dark:text-zinc-300 dark:hover:text-cyan-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-8">
        <div className="w-full max-w-4xl space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-5xl md:text-6xl">
            About
          </h1>
          
          <div className="mx-auto max-w-2xl space-y-6 pt-4">
            <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300 sm:text-xl">
              [Placeholder - Content to be discussed]
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
