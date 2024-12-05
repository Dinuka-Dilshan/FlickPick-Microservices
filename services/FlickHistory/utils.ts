import { HistoryItem, HistoryTableItem } from "./types";

export const convertHistoryItemToMovie = (
  item: HistoryTableItem
): HistoryItem => {
  return {
    genre: item.genre,
    image: item.image,
    imdbId: item.SK.split("#")[1],
    note: item.note,
    releaseYear: item.releaseYear,
    runtime: item.runtime,
    title: item.title,
    type: item.type,
    userRating: item.userRating,
    watchedOn: item.watchedOn,
  };
};
