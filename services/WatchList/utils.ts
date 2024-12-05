import { WatchListItem, WatchListTableItem } from "./types";

export const convertWatchListItemToMovie = (
  item: WatchListTableItem
): WatchListItem => {
  return {
    releaseYear: item.year,
    title: item.title,
    posterUrl: item.image,
    imdbId: item.SK.split("#")[2],
    addedOn: item.on,
  };
};
