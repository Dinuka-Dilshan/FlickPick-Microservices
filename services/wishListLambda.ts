import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { LambdaFunctionType } from "../types";
import { Movie } from "../types/movie";

const ddbClient = new DynamoDBClient();
const client = DynamoDBDocumentClient.from(ddbClient);

export const handler: LambdaFunctionType = async (event) => {
  const userId = event.requestContext.authorizer.jwt.claims.username;

  if (event.requestContext.http.method === "GET") {
    try {
      const data = await client.send(
        new QueryCommand({
          TableName: process.env.FLICK_PICK_TABLE,
          KeyConditionExpression: "PK = :pk AND begins_with(SK,:prefix)",
          ExpressionAttributeValues: {
            ":pk": `USER#${userId}`,
            ":prefix": "WISHLIST#",
          },
        })
      );
      return {
        body: JSON.stringify(data.Items),
        statusCode: 200,
      };
    } catch (error) {
      console.log("ERROR", error);
      return {
        body: JSON.stringify({ error: "Internal server error" }),
        statusCode: 500,
      };
    }
  } else if (event.requestContext.http.method === "POST") {
    const movie = JSON.parse(event.body || "") as Movie;

    if (!movie.imdbId) {
      throw new Error("movie id is required");
    }

    try {
      const itemToSave = {
        PK: `USER#${userId}`,
        SK: `WISHLIST#${movie.imdbId}`,
        Title: movie.title,
        Image: movie.posterUrl,
        Year: movie.releaseYear,
        AddedOn: Date.now(),
      };
      await client.send(
        new PutCommand({
          TableName: process.env.FLICK_PICK_TABLE,
          Item: itemToSave,
        })
      );
      return {
        statusCode: 200,
        body: JSON.stringify(itemToSave),
      };
    } catch (error) {
      console.log("ERROR", error);
      return {
        body: JSON.stringify({ error: "Internal server error" }),
        statusCode: 500,
      };
    }
  } else if (event.requestContext.http.method === "DELETE") {
    const imdbId = event?.queryStringParameters?.imdbId;

    if (!imdbId) {
      throw new Error("movie id is required");
    }

    try {
      await client.send(
        new DeleteCommand({
          TableName: process.env.FLICK_PICK_TABLE,
          Key: {
            PK: `USER#${userId}`,
            SK: `WISHLIST#${imdbId}`,
          },
        })
      );
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Removed Item Successfully" }),
      };
    } catch (error) {
      console.log("ERROR", error);
      return {
        body: JSON.stringify({ error: "Internal server error" }),
        statusCode: 500,
      };
    }
  }

  return { body: "", statusCode: 404 };
};
