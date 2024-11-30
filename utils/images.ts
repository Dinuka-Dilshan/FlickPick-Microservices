export const getImageURL = (url: string, resolution?: number) => {
  const urlWithoutResolution = url?.split("@._V1_")?.[0];

  if (!urlWithoutResolution) {
    return undefined;
  }
  return `${urlWithoutResolution}@._V1_FMjpg_UX${resolution || 500}_.jpg`;
};
