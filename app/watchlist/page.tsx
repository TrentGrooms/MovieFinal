"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NavBar from "../components/NavBar";

type WatchlistItem = {
    id: string;
    mediaId: number;
    mediaType: string;
    title: string;
    poster: string | null;
};

export default function WatchlistPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (status === "unauthenticated") {
        signIn();
        return;
    }
    if (status === "authenticated") {
        fetch("/api/watchlist")
            .then(r => r.json())
            .then(data => {
                setWatchlist(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }
    }, [status]);

    const removeFromWatchlist = async (mediaId: number, mediaType: string) => {
        await fetch("/api/watchlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mediaId, mediaType }),
        });
        setWatchlist(prev => prev.filter(item => !(item.mediaId === mediaId && item.mediaType === mediaType)));
    };

    if (status === "loading" || loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div>
            <NavBar />
            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Watchlist</h1>
                {watchlist.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20">
                        <p className="text-xl mb-4">Your watchlist is empty.</p>
                        <button onClick={() => router.push("/")} className="px-4 py-2 bg-blue-600 text-white rounded-md">Browse Movies & Shows</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {watchlist.map(item => (
                            <div key={item.id} className="relative group cursor-pointer" onClick={() => router.push(`/${item.mediaType}/${item.mediaId}`)}>
                                {item.poster ? (
                                    <Image src={`https://image.tmdb.org/t/p/w500${item.poster}`} alt={item.title} width={300} height={450} className="rounded-lg w-full" />
                                ) : (
                                    <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <h3 className="text-sm font-semibold mt-2">{item.title}</h3>
                                <span className="text-xs text-gray-400 capitalize">{item.mediaType}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.mediaId, item.mediaType); }}
                                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}