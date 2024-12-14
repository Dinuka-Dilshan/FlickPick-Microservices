import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import popularMovieTvParse from "./popularMovieTvParse";

const ddbClient = new DynamoDBClient();
const client = DynamoDBDocumentClient.from(ddbClient);

export const handler = async () => {
  const moviesPromise = popularMovieTvParse("moviemeter");
  const tvsPromise = popularMovieTvParse("tvmeter");

  const { movies, error: moviesError } = await moviesPromise;
  const { movies: tvs, error: tvsError } = await tvsPromise;

  if (!moviesError) {
    await client.send(
      new PutCommand({
        Item: { PK: "POPULAR", SK: "MOVIES", items: movies },
        TableName: process.env.FLICK_PICK_TABLE,
      })
    );
  }

  if (!tvsError) {
    await client.send(
      new PutCommand({
        Item: { PK: "POPULAR", SK: "TVS", items: tvs },
        TableName: process.env.FLICK_PICK_TABLE,
      })
    );
  }
};
