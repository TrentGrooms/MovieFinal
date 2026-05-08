import MediaCard from "./components/MediaCard";
import NavBar from "./components/NavBar";

export default async function Home() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}`);
    const data = await res.json();

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <NavBar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Trending This Week</h1>
                    <p className="text-gray-400 mt-1 text-sm">The most popular movies and shows right now</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {data.results.map((item: any) => (
                        <MediaCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
