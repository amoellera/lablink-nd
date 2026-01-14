import Link from "next/link";
import Image from "next/image";

export default function Home() {
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
              className="text-base font-medium text-zinc-700 transition-colors hover:text-cyan-700 dark:text-zinc-300 dark:hover:text-cyan-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-8">
        <div className="w-full max-w-4xl space-y-8 text-center">
          {/* Logo/Header */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-6xl md:text-7xl">
              Strove
            </h1>
            <p className="text-xl font-medium text-zinc-600 dark:text-zinc-400 sm:text-2xl">
              Connecting Notre Dame Students with Research Opportunities
            </p>
          </div>

          {/* Main Description */}
          <div className="mx-auto max-w-2xl space-y-6 pt-4">
            <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300 sm:text-xl">
              Strove is the premier platform for Notre Dame students to discover, explore, and apply to research opportunities across campus. Whether you're looking to join a lab, contribute to groundbreaking research, or find your next academic adventure, Strove makes it easy.
            </p>
            
            <div className="grid gap-6 pt-8 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-500">Discover</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Browse research opportunities from labs across Notre Dame
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-500">Connect</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Reach out directly to professors and research teams
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-500">Apply</div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Submit applications and track your research journey
                </p>
              </div>
            </div>

            {/* Sign In / Sign Up Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
              <Link
                href="/signin"
                className="w-full rounded-lg border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 sm:w-auto"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full rounded-lg bg-cyan-700 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-700 sm:w-auto"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Schools Served Section */}
          <div className="mx-auto mt-16 w-full max-w-2xl border-t border-zinc-200 pt-12 dark:border-zinc-800">
            <h2 className="mb-8 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
              Schools Served
            </h2>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/4/44/Notre_Dame_Fighting_Irish_logo.svg/200px-Notre_Dame_Fighting_Irish_logo.svg.png"
                    alt="University of Notre Dame Logo"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                    unoptimized
                  />
                </div>
                <div className="text-left">
                  <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    University of Notre Dame
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Notre Dame, Indiana
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
