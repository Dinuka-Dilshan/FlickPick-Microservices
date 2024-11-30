import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { WatchListTableItem } from "../../types/dynamodb";
import { convertToMovie } from "../../utils/movie";

type Params = {
  client: DynamoDBDocumentClient;
  userId: string;
};

export default async ({ client, userId }: Params) => {
  if (!userId) {
    throw new Error("user id is required");
  }

  try {
    const data = await client.send(
      new QueryCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        KeyConditionExpression: "PK = :pk AND begins_with(SK,:prefix)",
        ExpressionAttributeValues: {
          ":pk": `USER#${userId}`,
          ":prefix": "WATCHLIST#",
        },
      })
    );
    return {
      watchListItems: (data.Items as WatchListTableItem[])?.map((item) =>
        convertToMovie(item)
      ),
      error: undefined,
    };
  } catch (error) {
    console.log("###RETRIEVE_WATCHLIST_ERROR###", JSON.stringify(error));
    return { watchListItems: undefined, error: error };
  }
};
