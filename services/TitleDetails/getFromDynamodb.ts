import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Message } from "../../constants/Messages";
import { FlickTitleDetailsTableItem } from "./types";

type Params = {
  client: DynamoDBDocumentClient;
  imdbId: string;
};

export default async ({ client, imdbId }: Params) => {
  try {
    if (!imdbId) {
      throw new Error("imdb id is required");
    }

    const data = await client.send(
      new QueryCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        KeyConditionExpression: "PK = :pk AND SK = :sk",
        ExpressionAttributeValues: {
          ":pk": "MOVIE",
          ":sk": imdbId,
        },
      })
    );
    return {
      movieCache: data.Items?.[0] as FlickTitleDetailsTableItem,
      message: Message.OK,
    };
  } catch (error) {
    console.log("###RETRIEVE_MOVIE_ERROR###", JSON.stringify(error));
    return { message: Message.ERROR, error: error };
  }
};
