import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class LambdaStack extends Stack {
  public readonly FlickPickSearchMoviesLambda: NodejsFunction;
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
        entry: join(__dirname, "..", "..", "services", "searchMoviesLambda.ts"),
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
          "popularMoviesTvsLambda.ts"
        ),
        functionName: "FlickPickPopularMoviesTvsLambda",
      }
    );
  }
}
