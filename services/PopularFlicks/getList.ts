import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Message } from "../../constants/Messages";
import { PopularFlickTableItem } from "./types";

type Params = {
  client: DynamoDBDocumentClient;
  type: "MOVIES" | "TVS";
};

export default async ({ client, type }: Params) => {
  try {
    const data = await client.send(
      new QueryCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        KeyConditionExpression: "PK = :pk AND SK = :sk",
        ExpressionAttributeValues: {
          ":pk": `POPULAR`,
          ":sk": type,
        },
      })
    );
    return {
      items: (data.Items as PopularFlickTableItem[])?.[0]?.items,
      message: Message.OK,
    };
  } catch (error) {
    console.log(`###RETRIEVE_POPULAR_${type}_ERROR###`, JSON.stringify(error));
    return { message: Message.ERROR, error: error };
  }
};
