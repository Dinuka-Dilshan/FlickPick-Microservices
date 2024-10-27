import { LambdaFunctionType } from "../types";
import searchMovieParse from "../utils/searchMovieParse";

export const handler: LambdaFunctionType = async (event, context) => {
  const searchText = event.queryStringParameters?.searchText;

  if (!searchText) {
    return {
      body: JSON.stringify({ error: "searchText is required" }),
      statusCode: 400,
    };
  }

  const { movies, error } = await searchMovieParse(searchText);

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
