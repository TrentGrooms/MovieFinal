
export default function MoviePage({ params }: { params: { id: string } }) {
    return <div>Movie {params.id}</div>;
}