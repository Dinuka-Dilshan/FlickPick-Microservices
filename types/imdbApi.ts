export type ImdbSearchResponse = {
  d: Array<{
    i: {
      height: number;
      imageUrl: string;
      width: number;
    };
    id: string; // Unique identifier (e.g., IMDb ID or name ID)
    l: string; // Title or name
    q?: string; // Content type (e.g., "TV series", "feature", etc.)
    qid?: string; // Detailed type identifier (e.g., "tvSeries", "movie")
    rank: number; // Popularity rank
    s: string; // Description or key credits (e.g., actors, roles)
    y?: number; // Year of release or appearance
    yr?: string; // Range of years (for TV series or events)
  }>;
  q: string; // Query string used for the search
  v: number; // API version
};
