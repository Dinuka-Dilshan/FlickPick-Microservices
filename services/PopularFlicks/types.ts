export type PopularFlick = {
  imdbId?: string;
  title?: string;
  releaseYear?: string;
  posterUrl?: string;
  rank?: number;
};

export type PopularFlickTableItem = {
  PK: string;
  SK: string;
  items: PopularFlick[];
};
