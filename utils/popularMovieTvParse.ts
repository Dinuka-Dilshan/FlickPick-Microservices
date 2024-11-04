import { load } from "cheerio";
import { Movie } from "../types/movie";
import { getImageURL } from "./images";

type Varient = "moviemeter" | "tvmeter";

export default async (
  varient: Varient
): Promise<{ movies: Movie[]; error?: string }> => {
  try {
    const response = await fetch(`https://www.imdb.com/chart/${varient}`);
    const responseText = await response.text();
    const cheerioHtmlTree = load(responseText);

    const movieDataWithoutPoster: Movie[] = cheerioHtmlTree(
      "div.ipc-metadata-list-summary-item__tc"
    )
      .get()
      .map((e) => ({
        title:
          e.children[1].children[1].children[0].children[0].children[0].data,
        imdbUrl: `https://www.imdb.com${e.children[1].children[1].children[0].attribs.href}`,
        imdbId: `${
          e.children[1].children[1].children[0].attribs.href.split("/")?.[2]
        }`,
        releaseYear: e.children[1].children[2].children[0].children[0].data,
        runtime: e.children[1].children[2].children[1]?.children[0].data,
        certificate: e.children[1].children[2].children[2]?.children[0].data,
        ratings:
          e.children[1].children[3].children[0].children[0]?.children[1]
            ?.children[0]?.data,
        voteCount:
          e.children[1].children[3].children[0].children[0]?.children[2]
            ?.children[2]?.data,
      }));

    const movieDataWithPoster = cheerioHtmlTree("div.cli-poster-container")
      .get()
      .map((e, index) => ({
        ...movieDataWithoutPoster[index],
        posterUrl: getImageURL(
          e.children[0].children[1].children[0].attribs.src
        ),
        rank: index + 1,
      }));
    return { movies: movieDataWithPoster, error: undefined };
  } catch (error) {
    console.log("###POPULAR-MOVIE-PARSE-ERROR###", JSON.stringify(error));
    return {
      movies: [],
      error: JSON.stringify(error),
    };
  }
};
