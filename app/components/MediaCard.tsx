"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { MediaCardProps} from "../types/media";



export default function MediaCard({ item }: MediaCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (item.media_type == "movie") {
            router.push(`/movie/${item.id}`);
        } else if (item.media_type == "tv") {
            router.push(`/tv/${item.id}`);
        }
    };

    const title = item.title || item.name || "Untitled";

    return (
        <div onClick={handleClick} className="cursor-pointer">
            {item.poster_path ? (
                <Image src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={title} width={300} height={500} className="rounded-lg" />
            ) : (
                <div className="w-full flex items-center justify-center p-4">
                    <p className="text-gray-500">No Image Available</p>
                </div>
            )}
            <h3 className="text-lg font-bold mt-2">{title}</h3>
            <p className="text-sm text-gray-500">Rating: {item.vote_average}</p>
        </div>
    );
}