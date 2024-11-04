import { LambdaFunctionType } from "../types";
import titleDetailsParse from "../utils/titleDetailsParse";

export const handler: LambdaFunctionType = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return {
      body: JSON.stringify({ error: "id is required" }),
      statusCode: 400,
    };
  }

  const { movie, error } = await titleDetailsParse(id);

  if (error) {
    return {
      body: JSON.stringify({ error: "Internal server error" }),
      statusCode: 500,
    };
  }

  return {
    body: JSON.stringify(movie),
    statusCode: 200,
  };
};
