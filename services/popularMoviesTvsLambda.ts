import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import popularMovieTvParse from "../utils/popularMovieTvParse";

const s3Cleient = new S3Client();

export const handler = async () => {
  const moviesPromise = popularMovieTvParse("moviemeter");
  const tvsPromise = popularMovieTvParse("tvmeter");

  const { movies, error: moviesError } = await moviesPromise;
  const { movies: tvs, error: tvsError } = await tvsPromise;

  if (!moviesError) {
    await s3Cleient.send(
      new PutObjectCommand({
        Body: JSON.stringify(movies),
        Bucket: process.env.BUCKET,
        Key: "popular-movies.json",
      })
    );
  }

  if (!tvsError) {
    await s3Cleient.send(
      new PutObjectCommand({
        Body: JSON.stringify(tvs),
        Bucket: process.env.BUCKET,
        Key: "popular-tvs.json",
      })
    );
  }
};
