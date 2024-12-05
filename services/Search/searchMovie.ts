import { MIMIC_HEADERS } from "../../constants/headers";
import { URLS } from "../../constants/urls";
import { ImdbSearchResponse, SearchFlick } from "./types";

export default async (
  searchText: string
): Promise<{ movies: SearchFlick[]; error?: string }> => {
  try {
    const response = await fetch(URLS.SEARCH_URL(searchText), {
      headers: MIMIC_HEADERS,
    });
    const responseJson = (await response.json()) as ImdbSearchResponse;

    const movieData = responseJson.d
      ?.filter(
        (item) =>
          item.qid === "movie" ||
          item.qid === "tvSeries" ||
          item.qid === "tvMiniSeries"
      )
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
