"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BlogCatchAll() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to blog listing if invalid route
    router.replace('/blog');
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
        <p className="text-gray-600">Taking you to the blog page.</p>
      </div>
    </div>
  );
}
