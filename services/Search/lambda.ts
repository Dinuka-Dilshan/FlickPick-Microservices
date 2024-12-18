import { LambdaFunctionType } from "../../types";
import searchMovie from "./searchMovie";
import searchMovieParse from "./searchMovieParse";

export const handler: LambdaFunctionType = async (event, context) => {
  const searchText = event.queryStringParameters?.searchText;
  const exact = event.queryStringParameters?.exact;

  if (!searchText) {
    return {
      body: JSON.stringify({ error: "searchText is required" }),
      statusCode: 400,
    };
  }

  const { movies, error } = exact
    ? await searchMovieParse(searchText)
    : await searchMovie(searchText);

  if (error) {
    return {
      body: JSON.stringify({ error: "Internal server error" }),
      statusCode: 500,
    };
  }

  return {
    body: JSON.stringify(movies),
    statusCode: 200,
  };
};
