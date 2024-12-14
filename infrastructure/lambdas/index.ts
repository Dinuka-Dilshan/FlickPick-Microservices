import { Duration, Stack, type StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";
import { join } from "path";

export class LambdaStack extends Stack {
  public readonly FlickPickSearchMoviesLambda: NodejsFunction;
  public readonly FlickPickPopularMoviesTvsPopulateLambda: NodejsFunction;
  public readonly FlickPickTitleDetailsLambda: NodejsFunction;
  public readonly FlickPickWatchListLambda: NodejsFunction;
  public readonly FlickPickFlickHistoryLambda: NodejsFunction;
  public readonly FlickPickPopularMoviesTvsLambda: NodejsFunction;

  constructor(scope: Construct, id: string, props?: StackProps) {
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

    this.FlickPickPopularMoviesTvsPopulateLambda = new NodejsFunction(
      this,
      "FlickPickPopularMoviesTvsPopulateLambda",
      {
        runtime: Runtime.NODEJS_LATEST,
        memorySize: 256,
        timeout: Duration.minutes(2),
        handler: "handler",
        entry: join(
          __dirname,
          "..",
          "..",
          "services",
          "PopularFlicks",
          "eventLambda.ts"
        ),
        functionName: "FlickPickPopularMoviesTvsPopulateLambda",
      }
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

    this.FlickPickPopularMoviesTvsLambda = new NodejsFunction(
      this,
      "FlickPickPopularMoviesTvsLambda",
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
          "PopularFlicks",
          "lambda.ts"
        ),
        functionName: "FlickPickPopularMoviesTvsLambda",
      }
    );
  }
}
