"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import NavBar from "../../components/NavBar";
import MediaCard from "../../components/MediaCard";

export default function MoviePage() {
    const params = useParams();
    const id = params.id as string;

    const [movie, setMovie] = useState<any>(null);
    const [credits, setCredits] = useState<any>(null);
    const [similar, setSimilar] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`).then(r => r.json()),
            fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`).then(r => r.json()),
            fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.NEXT_PUBLIC_API_KEY}`).then(r => r.json()),
        ]).then(([movieData, creditsData, similarData]) => {
            setMovie(movieData);
            setCredits(creditsData);
            setSimilar(similarData.results?.slice(0, 8).map((m: any) => ({ ...m, media_type: "movie" })) || []);
        });
    }, [id]);

    if (!movie) return <div className="p-8 text-center">Loading...</div>;

    const cast = credits?.cast?.slice(0, 8) || [];
    const genres = movie.genres?.map((g: any) => g.name).join(", ") || "";

    return (
        <div>
            <NavBar />
            
            <div className="relative w-full h-96">
                {movie.backdrop_path ? (
                    <Image 
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
                        alt={movie.title} 
                        fill 
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                
               
                <div className="absolute bottom-8 left-8 flex gap-6">
                    {movie.poster_path && (
                        <Image 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title} 
                            width={150} 
                            height={225} 
                            className="rounded-lg shadow-lg"
                        />
                    )}
                    <div className="text-white self-end">
                        <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                        <p className="text-lg mb-2">{genres}</p>
                        <p className="text-sm text-gray-300">
                            {movie.release_date?.split("-")[0]} • {movie.runtime} min
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                
                <div className="mb-8">
                    <span className="text-3xl font-bold text-yellow-500">★ {movie.vote_average?.toFixed(1)}</span>
                    <span className="text-gray-500 ml-2">({movie.vote_count?.toLocaleString()} votes)</span>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">{movie.overview}</p>
                </div>

                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Cast</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {cast.map((actor: any) => (
                            <div key={actor.id} className="text-center">
                                {actor.profile_path ? (
                                    <Image 
                                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                                        alt={actor.name} 
                                        width={100} 
                                        height={150} 
                                        className="rounded-lg mx-auto"
                                    />
                                ) : (
                                    <div className="w-24 h-36 bg-gray-300 rounded-lg mx-auto flex items-center justify-center">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}
                                <p className="font-bold mt-2">{actor.name}</p>
                                <p className="text-sm text-gray-500">{actor.character}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {similar.map((item) => (
                            <MediaCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
