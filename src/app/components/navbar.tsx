// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-indigo-600">
        VideoStream
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            {/* The Upload Button is here, visible only if logged in */}
            <Link
              href="../videoUpload"
              className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <span>+</span>
              <span className="hidden sm:inline">Upload</span>
            </Link>
            <button onClick={() => signOut()} className="text-sm font-medium">
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-indigo-600 font-medium border border-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-50"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
