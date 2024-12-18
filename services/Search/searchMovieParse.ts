import { load } from "cheerio";
import { MIMIC_HEADERS } from "../../constants/headers";
import { URLS } from "../../constants/urls";
import { SearchFlick } from "./types";

export default async (
  searchText: string
): Promise<{ movies?: SearchFlick[]; error?: string }> => {
  try {
    const response = await fetch(URLS.SEARCH(searchText), {
      headers: MIMIC_HEADERS,
    });

    const responseText = await response.text();
    const cheerioHtmlTree = load(responseText);

    const nextDataScript = cheerioHtmlTree("#__NEXT_DATA__").html();

    if (!nextDataScript) {
      console.log("###SEARCH-PARSE-ERROR###", "nextDataScript is empty");
      return { error: "Unknown server error" };
    }

    const nextDataScriptParsed = JSON.parse(nextDataScript);

    const parsed = nextDataScriptParsed?.props?.pageProps?.titleResults
      ?.results as {
      id: string;
      titleNameText: string;
      titleReleaseText: string;
      titleTypeText: string;
      titlePosterImageModel: {
        url: string;
        caption: string;
      };
      imageType: string;
    }[];

    const movies: SearchFlick[] = parsed
      .filter(
        (r) =>
          r?.imageType === "movie" ||
          r?.imageType === "tvSeries" ||
          r?.imageType === "tvMiniSeries"
      )
      .map((r) => ({
        imdbId: r?.id,
        posterUrl: r?.titlePosterImageModel?.url,
        releaseYear: r?.titleReleaseText,
        title: r?.titleNameText,
      }));

    return {
      movies,
    };
  } catch (error) {
    console.log("###SEARCH-PARSE-ERROR###", JSON.stringify(error));
    return {
      error: JSON.stringify(error),
    };
  }
};
