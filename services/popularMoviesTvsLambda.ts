import { ROUTES } from "../constants/routes";
import { LambdaFunctionType } from "../types";
import popularMovieTvParse from "../utils/popularMovieTvParse";

export const handler: LambdaFunctionType = async (event) => {
  const isMovies = event.rawPath === ROUTES.POPULAR_MOIES;

  const { movies, error } = await popularMovieTvParse(
    isMovies ? "moviemeter" : "tvmeter"
  );

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
