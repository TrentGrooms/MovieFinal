"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import MediaCard from "../components/MediaCard"
import { MediaItem } from "../types/media";
import NavBar from "../components/NavBar";

export default function SearchPageInner() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";
    const [results, setResults] = useState<MediaItem[]>([]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.results);
        };
        fetchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <NavBar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Search Results</h1>
                    <p className="text-gray-400 mt-1 text-sm">Showing results for "<span className="text-white">{query}</span>"</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {results.map((item) => (
                        <MediaCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}