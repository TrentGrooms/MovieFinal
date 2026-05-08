"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import NavBar from "../../components/NavBar";
import MediaCard from "../../components/MediaCard";
import WatchlistButton from "@/app/components/WatchListButton";

export default function TVPage() {
    const params = useParams();
    const id = params.id as string;

    const [show, setShow] = useState<any>(null);
    const [credits, setCredits] = useState<any>(null);
    const [similar, setSimilar] = useState<any[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`).then(r => r.json()),
            fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`).then(r => r.json()),
            fetch(`https://api.themoviedb.org/3/tv/${id}/similar?api_key=${process.env.NEXT_PUBLIC_API_KEY}`).then(r => r.json()),
        ]).then(([showData, creditsData, similarData]) => {
            setShow(showData);
            setCredits(creditsData);
            setSimilar(similarData.results?.slice(0, 8).map((s: any) => ({ ...s, media_type: "tv" })) || []);
        });
    }, [id]);

    const handleSeasonSelect = async (seasonNumber: number) => {
        if (selectedSeason == seasonNumber) {
            setSelectedSeason(null);
            setEpisodes([]);
            return;
        }
        setSelectedSeason(seasonNumber);
        setLoadingEpisodes(true);
        const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`);
        const data = await res.json();
        setEpisodes(data.episodes || []);
        setLoadingEpisodes(false);
    };

    if (!show) return <div className="p-8 text-center">Loading...</div>;

    const cast = credits?.cast?.slice(0, 8) || [];

    return (
        <div>
            <NavBar />

            <div className="relative w-full h-100">
                {show.backdrop_path && (
                    <Image
                        src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
                        alt={show.name}
                        fill
                        className="object-cover brightness-50"
                    />
                )}
                <div className="absolute inset-0 flex items-end p-8 gap-6">
                    {show.poster_path && (
                        <Image
                            src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                            alt={show.name}
                            width={150}
                            height={225}
                            className="rounded-lg hidden md:block shrink-0"
                        />
                    )}
                    <div>
                        <h1 className="text-4xl font-bold text-white">{show.name}</h1>
                        <div className="flex gap-3 mt-2 flex-wrap">
                            <span className="text-yellow-400 font-semibold">★ {show.vote_average?.toFixed(1)}</span>
                            <span className="text-gray-300">{show.first_air_date?.slice(0, 4)}</span>
                            <span className="text-gray-300">{show.number_of_seasons} seasons</span>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {show.genres?.map((g: any) => (
                                <span key={g.id} className="px-2 py-1 bg-gray-700 text-white text-xs rounded-full">{g.name}</span>
                            ))}
                        </div>
                        <WatchlistButton
                            mediaId={show.id}
                            mediaType="tv"
                            title={show.title}
                            poster={show.poster_path}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-6xl mx-auto">
               
                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-2">Overview</h2>
                    <p className="text-gray-400 leading-relaxed">{show.overview}</p>
                </section>
                {cast.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Cast</h2>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                            {cast.map((person: any) => (
                                <div key={person.id} className="text-center">
                                    {person.profile_path ? (
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                            alt={person.name}
                                            width={80}
                                            height={80}
                                            className="rounded-full w-16 h-16 object-cover mx-auto"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-700 mx-auto flex items-center justify-center text-gray-400 text-xs">N/A</div>
                                    )}
                                    <p className="text-xs mt-1 font-medium">{person.name}</p>
                                    <p className="text-xs text-gray-500">{person.character}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Seasons</h2>
                    <div className="flex flex-col gap-2">
                        {show.seasons?.map((season: any) => (
                            <div key={season.id} className="border border-gray-700 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => handleSeasonSelect(season.season_number)}
                                    className="w-full flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700 transition text-left"
                                >
                                    <span className="font-semibold">{season.name}</span>
                                    <span className="text-gray-400 text-sm">{season.episode_count} episodes {selectedSeason == season.season_number ? "▲" : "▼"}</span>
                                </button>

                                {selectedSeason == season.season_number && (
                                    <div className="p-4 bg-gray-900">
                                        {loadingEpisodes ? (
                                            <p className="text-gray-400">Loading episodes...</p>
                                        ) : (
                                            <div className="flex flex-col gap-4">
                                                {episodes.map((ep: any) => (
                                                    <div key={ep.id} className="flex gap-4 border-b border-gray-800 pb-4">
                                                        {ep.still_path && (
                                                            <Image
                                                                src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                                                                alt={ep.name}
                                                                width={160}
                                                                height={90}
                                                                className="rounded-md object-cover shrink-0"
                                                            />
                                                        )}
                                                        <div>
                                                            <p className="font-semibold">{ep.episode_number}. {ep.name}</p>
                                                            <div className="flex gap-3 text-sm text-gray-400 mt-1">
                                                                <span>★ {ep.vote_average?.toFixed(1)}</span>
                                                                {ep.runtime && <span>{ep.runtime} min</span>}
                                                            </div>
                                                            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{ep.overview || "No overview available."}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {similar.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-4">Similar Shows</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {similar.map((item: any) => (
                                <MediaCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}