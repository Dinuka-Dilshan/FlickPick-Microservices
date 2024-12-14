import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Message } from "../../constants/Messages";
import { LambdaFunctionType } from "../../types";
import getList from "./getList";

const ddbClient = new DynamoDBClient();
const client = DynamoDBDocumentClient.from(ddbClient);

export const handler: LambdaFunctionType = async (event) => {
  const type = event.pathParameters?.type?.toUpperCase();

  if (type === "MOVIES" || type === "TVS") {
    const { items, message, error } = await getList({
      client,
      type,
    });

    if (message === Message.ERROR) {
      return {
        body: JSON.stringify({ error }),
        statusCode: 500,
      };
    }

    return {
      body: JSON.stringify(items),
      statusCode: 200,
    };
  }

  return { body: "", statusCode: 404 };
};
