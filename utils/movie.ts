import { WatchListTableItem } from "../types/dynamodb";
import { Movie, WatchListMovie } from "../types/movie";

export const convertToWatchListItem = (
  movie: Movie,
  userId: string
): WatchListTableItem => {
  return {
    PK: `USER#${userId}`,
    SK: `WATCHLIST#${movie.imdbId}`,
    Title: movie.title,
    Image: movie.posterUrl || "",
    Year: movie.releaseYear,
    On: Date.now(),
  };
};

export const convertToMovie = (item: WatchListTableItem): WatchListMovie => {
  return {
    releaseYear: item.Year,
    title: item.Title,
    posterUrl: item.Image,
    imdbId: item.SK.split("#")[1],
    addedOn: item.On,
  };
};
