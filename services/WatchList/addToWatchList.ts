import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { Message } from "../../constants/Messages";
import { DEFAULT_WATCHLIST_NAME } from "../../constants/watchList";
import { WatchListItem, WatchListTableItem } from "./types";

type Params = {
  client: DynamoDBDocumentClient;
  userId: string;
  event: APIGatewayProxyEventV2WithJWTAuthorizer;
};

export default async ({ client, event, userId }: Params) => {
  try {
    if (!event.body) {
      throw new Error("Empty request");
    }

    const movie: WatchListItem = JSON.parse(event.body);

    if (!movie.imdbId || !movie.title) {
      throw new Error("movie id and title are required");
    }

    movie.watchListName ??= DEFAULT_WATCHLIST_NAME; // if no wtachlist specified, save to default watchlist

    const itemToSave: WatchListTableItem = {
      PK: `USER#${userId}`,
      SK: `WATCHLIST#${movie.watchListName}#${movie.imdbId}`,
      title: movie.title,
      image: movie.posterUrl || "",
      year: movie.releaseYear || "",
      on: Date.now(),
    };
    await client.send(
      new PutCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        Item: itemToSave,
      })
    );
    return { message: Message.OK };
  } catch (error) {
    console.log("###ADD_TO_WATCHLIST_ERROR###", JSON.stringify(error));
    return { message: Message.ERROR, error: error };
  }
};
