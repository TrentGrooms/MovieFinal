"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function NavBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const { data: session } = useSession();

    const handleSearch = () => {
        if (query.trim() !== "") {
            router.push(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <nav className="bg-gray-950 border-b border-gray-800 px-6 py-3 flex items-center justify-between gap-6 sticky top-0 z-50">
            <a href="/" className="text-white text-xl font-bold tracking-tight hover:text-blue-400 transition shrink-0">
            Movie Explorer
            </a>
            
            <div className="flex items-center gap-2 flex-1 justify-center max-w-xl">
                <input
                    className="w-full max-w-md p-2 rounded-md text-gray-800 bg-white placeholder:text-gray-500"
                    placeholder="Search movies & shows"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button onClick={handleSearch} className="px-4 py-2 bg-blue-600 text-white rounded-md shrink-0">Search</button>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {session ? (
                    <>
                        <span className="text-white text-sm">{session.user?.name}</span>
                        <a href="/watchlist" className="text-white text-sm hover:underline">Watchlist</a>
                        <button
                            onClick={() => signOut()}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => signIn()}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
}