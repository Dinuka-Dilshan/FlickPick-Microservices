import { HistoryItem, HistoryTableItem } from "./types";

export const convertHistoryItemToMovie = (
  item: HistoryTableItem
) => {
  return {
    image: item.image,
    imdbId: item.SK.split("#")[1],
    title: item.title,
    type: item.type,
    addedOn: item.addedOn,
  };
};
