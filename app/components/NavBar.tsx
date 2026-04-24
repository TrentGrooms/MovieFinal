"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim() !== "") {
            router.push(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <nav className="bg-gray-800 p-4 flex items-center justify-between">
            <a href="/" className="text-white text-xl font-bold">Home</a>
            <input
                className="w-1/3 p-2 rounded-md text-gray-800 bg-white placeholder:text-gray-500"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md">Search</button>
               
            

        
        </nav>
    );
}