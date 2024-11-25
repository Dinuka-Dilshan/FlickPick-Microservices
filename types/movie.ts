export type Movie = {
  posterUrl: string;
  title: string;
  imdbId: string;
  releaseYear: string;
  runtime?: string;
  certificate?: string;
  ratings?: string;
  voteCount?: string;
  imdbUrl?: string;
  videoUrls?: string[];
  genres?: string[];
  plot?: string;
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
};

export type WatchListMovie = Pick<
  Movie,
  "imdbId" | "posterUrl" | "title" | "releaseYear"
> & { addedOn: number };
