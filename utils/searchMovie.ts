import { URLS } from "../constants/urls";
import { ImdbSearchResponse } from "../types/imdbApi";
import { Movie } from "../types/movie";

export default async (
  searchText: string
): Promise<{ movies: Movie[]; error?: string }> => {
  try {
    const response = await fetch(URLS.SEARCH_URL(searchText));
    const responseJson = (await response.json()) as ImdbSearchResponse;

    const movieData = responseJson.d
      ?.filter((item) => item.qid === "movie" || item.qid === "tvSeries")
      .map((item) => ({
        imdbId: item?.id || "",
        posterUrl: item?.i?.imageUrl || "",
        releaseYear: `${item?.y || item?.yr || ""}`,
        title: item.l,
      }));

    return {
      movies: movieData,
      error: undefined,
    };
  } catch (error) {
    console.log("###SEARCH-MOVIE-ERROR###", JSON.stringify(error));
    return {
      movies: [],
      error: JSON.stringify(error),
    };
  }
};
