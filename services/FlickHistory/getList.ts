import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Message } from "../../constants/Messages";
import { HistoryTableItem } from "./types";
import { convertHistoryItemToMovie } from "./utils";

type Params = {
  client: DynamoDBDocumentClient;
  userId: string;
};

export default async ({ client, userId }: Params) => {
  try {
    if (!userId) {
      throw new Error("user id is required");
    }

    const data = await client.send(
      new QueryCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        KeyConditionExpression: "PK = :pk AND begins_with(SK,:prefix)",
        ExpressionAttributeValues: {
          ":pk": `USER#${userId}`,
          ":prefix": "HISTORY#",
        },
      })
    );
    return {
      historyItems: (data.Items as HistoryTableItem[])?.map((item) =>
        convertHistoryItemToMovie(item)
      ),
      message: Message.OK,
    };
  } catch (error) {
    console.log("###RETRIEVE_HISTORY_ERROR###", JSON.stringify(error));
    return { message: Message.ERROR, error: error };
  }
};
