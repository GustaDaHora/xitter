"use client";

import Link from "next/link";

export default function Error() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">500</h1>
      <p className="text-lg">Server-side error occurred</p>
      <Link href="/" className="mt-4 text-blue-500">
        Go back home
      </Link>
    </div>
  );
}
