"use client";

import { useEffect, useState } from "react";

export default function AIGenerationErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error("AI Generation Error:", error);
      setError(error.message);
      setLoading(false);
    };

    window.addEventListener("ai-generation-error", handleError);
    return () => window.removeEventListener("ai-generation-error", handleError);
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">AI Generation Error</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-2 text-sm text-red-700 hover:text-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <p className="text-blue-700">Generating content...</p>
        </div>
      </div>
    );
  }

  return children;
}