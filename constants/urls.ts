export const URLS = {
  SEARCH_URL: (searchText: string) =>
    `https://www.imdb.com/find/?s=tt&q==${searchText}&ref_=nv_sr_sm`,
  TITLE_DETAILS_URL: (id: string) =>
    `https://www.imdb.com/title/${id}/?ref_=chtmvm_t_2`,
};
