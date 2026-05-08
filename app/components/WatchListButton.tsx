"use client";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export default function WatchlistButton({ mediaId, mediaType, title, poster }: {
    mediaId: number;
    mediaType: string;
    title: string;
    poster: string | null;
}) {
    const { data: session } = useSession();
    const [inWatchlist, setInWatchlist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!session) return;
        fetch("/api/watchlist")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const found = data.some(
                        (item: any) => item.mediaId === mediaId && item.mediaType === mediaType
                    );
                    setInWatchlist(found);
                }
            });
    }, [session, mediaId, mediaType]);

    const handleAdd = async () => {
        if (!session) { signIn(); return; }
        setLoading(true);
        const res = await fetch("/api/watchlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mediaId, mediaType, title, poster }),
        });
        if (res.ok) setInWatchlist(true);
        setLoading(false);
    };

    const handleRemove = async () => {
        setLoading(true);
        const res = await fetch("/api/watchlist", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mediaId, mediaType }),
        });
        if (res.ok) setInWatchlist(false);
        setLoading(false);
    };

    return (
        <button
            onClick={inWatchlist ? handleRemove : handleAdd}
            disabled={loading}
            className={`mt-3 px-4 py-2 rounded-md text-sm font-semibold transition ${
                inWatchlist
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
            {loading ? "..." : inWatchlist ? "✕ Remove from Watchlist" : "+ Add to Watchlist"}
        </button>
    );
}