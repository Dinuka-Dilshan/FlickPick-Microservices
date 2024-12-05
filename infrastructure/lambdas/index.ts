import { Duration, Stack, type StackProps } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { Bucket } from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";
import { join } from "path";

type Props = StackProps & {
  bucket: Bucket;
};

export class LambdaStack extends Stack {
  public readonly FlickPickSearchMoviesLambda: NodejsFunction;
  public readonly FlickPickPopularMoviesTvsLambda: NodejsFunction;
  public readonly FlickPickTitleDetailsLambda: NodejsFunction;
  public readonly FlickPickWatchListLambda: NodejsFunction;
  public readonly FlickPickFlickHistoryLambda: NodejsFunction;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    this.FlickPickSearchMoviesLambda = new NodejsFunction(
      this,
      "FlickPickSearchMoviesLambda",
      {
        runtime: Runtime.NODEJS_LATEST,
        memorySize: 512,
        timeout: Duration.minutes(2),
        handler: "handler",
        entry: join(__dirname, "..", "..", "services", "Search", "lambda.ts"),
        functionName: "FlickPickSearchMoviesLambda",
      }
    );

    this.FlickPickPopularMoviesTvsLambda = new NodejsFunction(
      this,
      "FlickPickPopularMoviesTvsLambda",
      {
        runtime: Runtime.NODEJS_LATEST,
        memorySize: 512,
        timeout: Duration.minutes(2),
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "services",
          "PopularFlicks",
          "lambda.ts"
        ),
        functionName: "FlickPickPopularMoviesTvsLambda",
        environment: {
          BUCKET: props.bucket.bucketName,
        },
      }
    );

    this.FlickPickPopularMoviesTvsLambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [`${props.bucket.bucketArn}/*`],
      })
    );

    this.FlickPickTitleDetailsLambda = new NodejsFunction(
      this,
      "FlickPickTitleDetailsLambda",
      {
        runtime: Runtime.NODEJS_LATEST,
        memorySize: 512,
        timeout: Duration.minutes(2),
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "services",
          "TitleDetails",
          "lambda.ts"
        ),
        functionName: "FlickPickTitleDetailsLambda",
      }
    );

    this.FlickPickWatchListLambda = new NodejsFunction(
      this,
      "FlickPickWatchListLambda",
      {
        runtime: Runtime.NODEJS_LATEST,
        memorySize: 256,
        timeout: Duration.minutes(1),
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "services",
          "WatchList",
          "lambda.ts"
        ),
        functionName: "FlickPickWatchListLambda",
      }
    );

    this.FlickPickFlickHistoryLambda = new NodejsFunction(
      this,
      "FlickPickFlickHistoryLambda",
      {
        runtime: Runtime.NODEJS_LATEST,
        memorySize: 256,
        timeout: Duration.minutes(1),
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "services",
          "FlickHistory",
          "lambda.ts"
        ),
        functionName: "FlickPickFlickHistoryLambda",
      }
    );
  }
}
