import Image from "next/image";
import MediaCard from "./components/MediaCard";
import NavBar from "./components/NavBar";

export default async function Home() {
  const res = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.NEXT_PUBLIC_API_KEY}`);
  const data = await res.json();
  return (
    <div className="p-4">
      <NavBar />
      <h1 className="text-2xl font-bold mb-4">Trending</h1>
      <div className="grid grid-cols-4 gap-3">
        {data.results.map((item: any) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>

    </div>
  );
}
