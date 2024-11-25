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

    const movie: Movie = {
      title: parsed?.titleText?.text,
      ratings: parsed?.ratingsSummary?.aggregateRating,
      voteCount: parsed?.ratingsSummary?.voteCount,
      releaseYear: parsed?.releaseYear?.year,
      certificate: parsed?.certificate?.rating,
      runtime: parsed?.runtime?.displayableProperty?.value?.plainText,
      posterUrl: parsed?.primaryImage?.url,
      videoUrls: parsed?.primaryVideos?.edges?.map(
        (edge: any) => edge.node?.playbackURLs?.[0]?.url
      ),
      genres: parsed?.genres?.genres?.map((genre: any) => genre.text),
      plot: parsed?.plot?.plotText?.plainText,
      imdbId: id,
      releaseDate: `${parsed?.releaseDate?.year}/${parsed?.releaseDate?.month}/${parsed?.releaseDate?.day}`,
      meterRanking: {
        currentRank: parsed?.meterRanking?.currentRank,
        rankChange: {
          changeDirection: parsed?.meterRanking?.rankChange?.changeDirection,
          difference: parsed?.meterRanking?.rankChange?.difference,
        },
      },
      userReviewsCout: parsed?.reviews?.total,
      titleType: parsed?.titleType?.displayableProperty?.value?.plainText,
      isSeries: parsed?.titleType?.isSeries,
      publicationStatus: parsed?.meta?.publicationStatus,
      criticReviewsTotal: parsed?.criticReviewsTotal?.total,
      countriesOfOrigin: parsed?.countriesOfOrigin?.countries?.map(
        (i: any) => i.id
      ),
      featuredReviews: parsed?.featuredReviews?.edges?.map((item: any) => ({
        author: item?.node?.author?.nickName,
        summary: item?.node?.summary?.originalText,
        text: item?.node?.text?.originalText?.plainText,
        date: item?.node?.submissionDate,
        authorRating: item?.node?.authorRating,
      })),
      creators: parsed?.creatorsPageTitle?.flatMap((category: any) =>
        category.credits.map((credit: any) => credit.name.nameText.text)
      ),
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
