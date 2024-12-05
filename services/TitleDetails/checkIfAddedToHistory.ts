import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Message } from "../../constants/Messages";

type Params = {
  client: DynamoDBDocumentClient;
  userId: string;
  imdbId: string;
};

export default async ({ client, userId, imdbId }: Params) => {
  try {
    const data = await client.send(
      new QueryCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        KeyConditionExpression: "PK = :pk AND SK = :sk",
        ExpressionAttributeValues: {
          ":pk": `USER#${userId}`,
          ":sk": `HISTORY#${imdbId}`,
        },
      })
    );
    return {
      isAdded: !!data?.Items?.length,
      message: Message.OK,
    };
  } catch (error) {
    console.log(
      "###RETRIEVE_HISTORY_ITEM_ADDED_CHECK_ERROR###",
      JSON.stringify(error)
    );
    return { message: Message.ERROR, error: error };
  }
};
