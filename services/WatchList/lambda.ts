import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Message } from "../../constants/Messages";
import { LambdaFunctionType } from "../../types";
import addToWatchList from "./addToWatchList";
import deleteWatchListItem from "./deleteWatchListItem";
import getWatchListItems from "./getWatchListItems";

const ddbClient = new DynamoDBClient();
const client = DynamoDBDocumentClient.from(ddbClient);

export const handler: LambdaFunctionType = async (event) => {
  const userId = event.requestContext.authorizer.jwt.claims.username as string;

  if (event.requestContext.http.method === "GET") {
    const { watchListItems, message, error } = await getWatchListItems({
      client,
      userId,
    });

    if (message === Message.ERROR) {
      return {
        body: JSON.stringify({ error }),
        statusCode: 500,
      };
    }

    return {
      body: JSON.stringify(watchListItems),
      statusCode: 200,
    };
  } else if (event.requestContext.http.method === "POST") {
    const { message, error } = await addToWatchList({
      client,
      event,
      userId,
    });

    if (message === Message.ERROR) {
      return {
        body: JSON.stringify({ error }),
        statusCode: 500,
      };
    }

    return {
      statusCode: 204,
    };
  } else if (event.requestContext.http.method === "DELETE") {
    const { error, message } = await deleteWatchListItem({
      client,
      event,
      userId,
    });

    if (message === Message.ERROR)
      return {
        body: JSON.stringify({ error }),
        statusCode: 500,
      };

    return {
      statusCode: 204,
    };
  }

  return { body: "", statusCode: 404 };
};
