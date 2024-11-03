import React from "react";

export default function TopBarLoader({text}: {text?: string}) {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 mb-8 h-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-purple-700 dark:via-pink-700 dark:to-blue-700">
      <div className="h-4 bg-white dark:bg-gray-800 flex justify-center text-sm animate-pulse">
        {text || ''}
      </div>
    </div>
  );
}
