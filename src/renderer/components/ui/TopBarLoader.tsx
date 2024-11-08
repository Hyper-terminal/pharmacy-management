export default function TopBarLoader({ text }: { text?: string }) {
  return (
    <div>
      {/* Top border */}
      <div className="fixed top-0 right-0 left-0 z-50 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700 animate-pulse" />

      {/* Right border */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-2 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700 animate-pulse" />

      {/* Bottom border */}
      <div className="fixed bottom-0 right-0 left-0 z-50 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700 animate-pulse" />

      {/* Left border */}
      <div className="fixed top-0 left-0 bottom-0 z-50 w-2 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700 animate-pulse" />

      {/* Text container */}
      {text && (
        <div className="fixed top-1 left-1/2 -translate-x-1/2 z-50 px-4 py-1 text-sm font-medium text-white bg-black bg-opacity-80 rounded">
          {text}
        </div>
      )}
    </div>
  );
}
