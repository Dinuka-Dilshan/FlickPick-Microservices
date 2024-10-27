

import { load } from "cheerio";
import { URLS } from "../constants/urls";
import { Movie } from "../types/movie";
import { getImageURL } from "./images";

export default async (
  searchText: string
): Promise<{ movies: Movie[]; error?: string }> => {
  try {
    const response = await fetch(URLS.SEARCH_URL(searchText));
    const responseText = await response.text();
    const cheerioHtmlTree = load(responseText);

    const movieDataWithoutPoster = cheerioHtmlTree(
      "div.ipc-metadata-list-summary-item__tc"
    )
      .get()
      .map((node) => ({
        name: node?.children?.[0].children[0]?.data,
        year: node?.children?.[1].children[0]?.children?.[0]?.children[0]?.data,
        imdbUrl: `https://www.imdb.com${node?.children?.[0]?.attribs?.href}`,
        imdbId: `${node?.children[0]?.attribs?.href?.split("/")?.[2]}`,
      }));

    const movieDataWithPosters = cheerioHtmlTree("img.ipc-image")
      .get()
      .map((node, index) => {
        return {
          posterUrl: getImageURL(node.attribs.src),
          ...movieDataWithoutPoster[index],
        };
      });

    return {
      movies: movieDataWithPosters,
      error: undefined,
    };
  } catch (error) {
    console.log("###SEARCH-MOVIE-PARSE-ERROR###", JSON.stringify(error));
    return {
      movies: [],
      error: JSON.stringify(error),
    };
  }
};
