export type HistoryTableItem = {
  PK: string;
  SK: string;
  title: string;
  image: string;
  releaseYear: string;
  watchedOn: number;
  userRating: number;
  type: string;
  note: string;
  runtime: number;
  genre: string[];
};

export type HistoryItem = Omit<HistoryTableItem, "PK" | "SK"> & {
  imdbId?: string;
};
