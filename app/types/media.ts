export type MediaItem = {
    id: number;
    media_type: "movie" | "tv";
    title?: string;
    name?: string;
    poster_path: string | null;
    vote_average: number;
};

export interface MediaCardProps {
  item: MediaItem;
}