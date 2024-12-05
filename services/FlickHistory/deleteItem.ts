import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { Message } from "../../constants/Messages";

type Params = {
  client: DynamoDBDocumentClient;
  userId: string;
  event: APIGatewayProxyEventV2WithJWTAuthorizer;
};

export default async ({ client, userId, event }: Params) => {
  try {
    const imdbId = event?.queryStringParameters?.imdbId;

    if (!imdbId) {
      throw new Error("movie id is required");
    }
    await client.send(
      new DeleteCommand({
        TableName: process.env.FLICK_PICK_TABLE,
        Key: {
          PK: `USER#${userId}`,
          SK: `HISTORY#${imdbId}`,
        },
      })
    );
    return {
      message: Message.OK,
    };
  } catch (error) {
    console.log("###DELETE_HISTORY_ITEM_ERROR###", JSON.stringify(error));
    return {
      message: Message.ERROR,
      error,
    };
  }
};
