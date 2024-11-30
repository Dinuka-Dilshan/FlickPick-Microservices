import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { LambdaFunctionType } from "../../types";
import addToWatchList from "./addToWatchList";
import deleteWatchListItem from "./deleteWatchListItem";
import getWatchListItems from "./getWatchListItems";

const ddbClient = new DynamoDBClient();
const client = DynamoDBDocumentClient.from(ddbClient);

export const handler: LambdaFunctionType = async (event) => {
  const userId = event.requestContext.authorizer.jwt.claims.username as string;

  if (event.requestContext.http.method === "GET") {
    const { watchListItems, error } = await getWatchListItems({
      client,
      userId,
    });

    if (error) {
      return {
        body: JSON.stringify({ error: "Retrieve watchList Failed" }),
        statusCode: 500,
      };
    }

    return {
      body: JSON.stringify(watchListItems),
      statusCode: 200,
    };
  } else if (event.requestContext.http.method === "POST") {
    const { addedItem, error } = await addToWatchList({
      client,
      event,
      userId,
    });

    if (error) {
      return {
        body: JSON.stringify({ error: "Failed to add" }),
        statusCode: 500,
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(addedItem),
    };
  } else if (event.requestContext.http.method === "DELETE") {
    const { error, isDeleted } = await deleteWatchListItem({
      client,
      event,
      userId,
    });

    if (isDeleted) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Removed Item Successfully" }),
      };
    }
    return {
      body: JSON.stringify({ error: "Removed Item Failed" }),
      statusCode: 500,
    };
  }

  return { body: "", statusCode: 404 };
};
