import { load } from "cheerio";
import { MIMIC_HEADERS } from "../../constants/headers";
import { getImageURL } from "../../utils/images";
import { PopularFlick } from "./types";

type Varient = "moviemeter" | "tvmeter";

export default async (
  varient: Varient
): Promise<{ movies: PopularFlick[]; error?: string }> => {
  try {
    const response = await fetch(`https://www.imdb.com/chart/${varient}`, {
      headers: MIMIC_HEADERS,
    });
    const responseText = await response.text();
    const cheerioHtmlTree = load(responseText);

    const movieDataWithoutPoster: PopularFlick[] = cheerioHtmlTree(
      "div.ipc-metadata-list-summary-item__tc"
    )
      .get()
      .map((e: any) => ({
        title:
          e.children[1].children[1].children[0].children[0].children[0].data,
        imdbId: `${
          e.children[1].children[1].children[0].attribs.href.split("/")?.[2]
        }`,
        releaseYear: e.children[1].children[2].children[0].children[0].data,
        posterUrl: "",
        rank: 0,
      }));

    const movieDataWithPoster = cheerioHtmlTree("div.cli-poster-container")
      .get()
      .map((e: any, index) => ({
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
