"use client"
import { useSearchParams} from "next/navigation"
import { useEffect, useState } from "react";
import MediaCard from "../components/MediaCard"
import { MediaItem } from "../types/media";
import NavBar from "../components/NavBar";



export default function SearchResults() {
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
        <div>
            <NavBar />
            <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

            <div className="grid grid-cols-4 gap-4">
                {results.map((item) => (
                    <MediaCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}