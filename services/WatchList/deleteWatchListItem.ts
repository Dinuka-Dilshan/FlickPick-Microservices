import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { DEFAULT_WATCHLIST_NAME } from "../../constants/watchList";

type Params = {
  client: DynamoDBDocumentClient;
  userId: string;
  event: APIGatewayProxyEventV2WithJWTAuthorizer;
};

export default async ({ client, userId, event }: Params) => {
  const imdbId = event?.queryStringParameters?.imdbId;
  const watchListName =
    event?.queryStringParameters?.watchListName || DEFAULT_WATCHLIST_NAME;

  if (!imdbId) {
    throw new Error("movie id is required");
  }

  try {
    await client.send(
      new DeleteCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        Key: {
          PK: `USER#${userId}`,
          SK: `WATCHLIST#${watchListName || "Default"}#${imdbId}`,
        },
      })
    );
    return {
      isDeleted: true,
      error: undefined,
    };
  } catch (error) {
    console.log("###DELETE_WATCHLIST_ITEM_ERROR###", JSON.stringify(error));
    return {
      isDeleted: false,
      error,
    };
  }
};
