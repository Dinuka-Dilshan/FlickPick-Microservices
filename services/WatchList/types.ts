export type WatchListItem = {
  watchListName?: string;
  imdbId?: string;
  title?: string;
  posterUrl?: string;
  releaseYear?: string;
  addedOn?: number;
};

export type WatchListTableItem = {
  PK: string;
  SK: string;
  title: string;
  image: string;
  year: string;
  on: number;
};
