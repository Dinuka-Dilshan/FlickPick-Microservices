import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { DEFAULT_WATCHLIST_NAME } from "../../constants/watchList";
import { WatchListTableItem } from "../../types/dynamodb";
import { convertToMovie } from "../../utils/movie";

type WatchListDetails = {
  watchListName?: string;
  imdbId?: string;
  title?: string;
  posterUrl?: string;
  releaseYear?: string;
};

type Params = {
  client: DynamoDBDocumentClient;
  userId: string;
  event: APIGatewayProxyEventV2WithJWTAuthorizer;
};

export default async ({ client, event, userId }: Params) => {
  const movie = JSON.parse(event.body || "") as WatchListDetails;

  if (!movie.imdbId || !movie.title) {
    throw new Error("movie id and title are required");
  }

  movie.watchListName ??= DEFAULT_WATCHLIST_NAME; // if no wtachlist specified, save to default watchlist

  try {
    const itemToSave: WatchListTableItem = {
      PK: `USER#${userId}`,
      SK: `WATCHLIST#${movie.watchListName}#${movie.imdbId}`,
      Title: movie.title,
      Image: movie.posterUrl || "",
      Year: movie.releaseYear || "",
      On: Date.now(),
    };
    await client.send(
      new PutCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        Item: itemToSave,
      })
    );
    return { addedItem: convertToMovie(itemToSave), error: undefined };
  } catch (error) {
    console.log("###ADD_TO_WATCHLIST_ERROR###", JSON.stringify(error));
    return { addedItem: undefined, error: error };
  }
};
