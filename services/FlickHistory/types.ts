export type HistoryTableItem = {
  PK: string;
  SK: string;
  title: string;
  image: string;
  addedOn: number;
  type: "Movie"|"Tv";
  runtime: number;
  genre: string[];
};

export type HistoryItem = Omit<HistoryTableItem, "PK" | "SK"> & {
  imdbId?: string;
};
