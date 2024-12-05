import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Message } from "../../constants/Messages";
import { FlickTitleDetails, FlickTitleDetailsTableItem } from "./types";

type Params = {
  client: DynamoDBDocumentClient;
  movie?: FlickTitleDetails;
};

export default async ({ client, movie }: Params) => {
  try {
    if (!movie) {
      throw new Error("Empty Movie");
    }

    const itemToSave: FlickTitleDetailsTableItem = {
      PK: "MOVIE",
      SK: movie.imdbId,
      ...movie,
    };

    await client.send(
      new PutCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        Item: itemToSave,
      })
    );

    return { message: Message.OK };
  } catch (error) {
    console.log("###ADD_TO_MOVIE_ERROR###", JSON.stringify(error));
    return { message: Message.ERROR, error: error };
  }
};
