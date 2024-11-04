import { load } from "cheerio";
import { URLS } from "../constants/urls";
import { Movie } from "../types/movie";

export default async (
  id: string
): Promise<{ movie?: Movie; error?: string }> => {
  try {
    const response = await fetch(URLS.TITLE_DETAILS_URL(id));
    const responseText = await response.text();
    const cheerioHtmlTree = load(responseText);

    const nextDataScript = cheerioHtmlTree("#__NEXT_DATA__").html();

    if (!nextDataScript) {
      console.log("###TITLE-DETAILS-PARSE-ERROR###", "nextDataScript is empty");
      return { error: "Unknown server error" };
    }

    const parsed =
      JSON.parse(nextDataScript)?.props?.pageProps?.aboveTheFoldData;

    const rank = cheerioHtmlTree(
      'div [data-testid="hero-rating-bar__popularity__score"]'
    )?.[0]?.children?.[0]?.data;

    const movie = {
      title: parsed?.titleText?.text,
      ratings: parsed?.ratingsSummary?.aggregateRating,
      voteCount: parsed?.ratingsSummary?.voteCount,
      releaseYear: parsed?.releaseYear?.year,
      certificate: parsed?.certificate?.rating,
      runtime: parsed?.runtime?.displayableProperty?.value?.plainText,
      posterUrl: parsed?.primaryImage?.url,
      videoUrls: parsed?.primaryVideos?.edges?.map(
        (edge) => edge.node?.playbackURLs?.[0]?.url
      ),
      genres: parsed?.genres?.genres?.map((genre) => genre.text),
      plot: parsed?.plot?.plotText?.plainText,
      rank,
    };
    return {
      movie,
      error: undefined,
    };
  } catch (error) {
    console.log("###TITLE-DETAILS-PARSE-ERROR###", JSON.stringify(error));
    return {
      movie: undefined,
      error: JSON.stringify(error),
    };
  }
};
