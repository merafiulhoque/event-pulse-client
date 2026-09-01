interface FullScreenLoaderProps {
  /** Optional text to display below the spinner */
  message?: string;
  /** Background opacity variant */
  blur?: boolean;
}

export default function Loader({
  message = 'Loading...',
  blur = true,
}: FullScreenLoaderProps) {
  return (
    <div
      aria-label="Loading"
      role="status"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-950/80 ${
        blur ? 'backdrop-blur-sm' : ''
      } transition-all duration-300`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-800"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent dark:border-indigo-500 dark:border-t-transparent"></div>
        </div>

        {/* Loading Message */}
        {message && (
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}