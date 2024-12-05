import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { Message } from "../../constants/Messages";
import { HistoryItem, HistoryTableItem } from "./types";

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
    const movie: HistoryItem = JSON.parse(event.body);

    if (!movie.imdbId) {
      throw new Error("movie id and title are required");
    }

    const itemToSave: HistoryTableItem = {
      PK: `USER#${userId}`,
      SK: `HISTORY#${movie.imdbId}`,
      genre: movie.genre,
      image: movie.image,
      note: movie.note,
      runtime: movie.runtime,
      title: movie.title,
      type: movie.type,
      userRating: movie.userRating,
      watchedOn: movie.watchedOn,
      releaseYear: movie.releaseYear,
    };

    await client.send(
      new PutCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        Item: itemToSave,
      })
    );

    return { message: Message.OK };
  } catch (error) {
    console.log("###ADD_TO_HISTORY_ERROR###", JSON.stringify(error));
    return { message: Message.ERROR, error: error };
  }
};
