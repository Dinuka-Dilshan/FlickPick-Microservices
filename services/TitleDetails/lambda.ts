import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { LambdaFunctionType } from "../../types";
import addToDynamodb from "./addToDynamodb";
import checkIfAddedToHistory from "./checkIfAddedToHistory";
import getFromDynamodb from "./getFromDynamodb";
import titleDetailsParse from "./titleDetailsParse";
const ddbClient = new DynamoDBClient();
const client = DynamoDBDocumentClient.from(ddbClient);

export const handler: LambdaFunctionType = async (event) => {
  const imdbId = event.pathParameters?.id;
  const userId = event.requestContext.authorizer.jwt.claims.username as string;

  if (!imdbId) {
    return {
      body: JSON.stringify({ error: "id is required" }),
      statusCode: 400,
    };
  }

  const { movieCache } = await getFromDynamodb({ client, imdbId });
  const { isAdded } = await checkIfAddedToHistory({ client, imdbId, userId });

  if (movieCache) {
    return {
      body: JSON.stringify({ ...movieCache, isAlreadyWatched: isAdded }),
      statusCode: 200,
    };
  }

  const { movie, error } = await titleDetailsParse(imdbId);

  if (error) {
    return {
      body: JSON.stringify({ error }),
      statusCode: 500,
    };
  }

  await addToDynamodb({ client, movie });

  return {
    body: JSON.stringify({ ...movie, isAlreadyWatched: isAdded }),
    statusCode: 200,
  };
};
