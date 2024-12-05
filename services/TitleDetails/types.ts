export type FlickTitleDetails = {
  title: string;
  ratings?: string;
  voteCount?: string;
  releaseYear: string;
  certificate?: string;
  runtime?: string;
  posterUrl: string;
  videoUrls?: string[];
  genres?: string[];
  plot?: string;
  imdbId: string;
  releaseDate?: string;
  meterRanking?: {
    currentRank: number;
    rankChange: {
      changeDirection: string;
      difference: number;
    };
  };
  userReviewsCout?: number;
  titleType?: string;
  isSeries?: boolean;
  publicationStatus?: string;
  criticReviewsTotal?: number;
  countriesOfOrigin?: string[];
  featuredReviews?: {
    author: string;
    summary: string;
    text: string;
    date: string;
    authorRating: number;
  }[];
  creators?: string[];
  moreLikeThis: {
    posterUrl: string;
    title: string;
    releaseYear: number;
    titleType: string;
    imdbId: string;
  }[];
};

export type FlickTitleDetailsTableItem = Omit<FlickTitleDetails, "imdbId"> & {
  PK: string;
  SK: string;
};
