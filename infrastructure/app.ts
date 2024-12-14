import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { ApiGatewayStack } from "./apigateway";
import { CognitoUserPoolStack } from "./cognito";
import { DynamodbStack } from "./dynamodb";
import { EventStack } from "./eventbridge";
import { LambdaStack } from "./lambdas";

const app = new cdk.App();
const lambdas = new LambdaStack(app, "FlickPickLambdaStack");

const cognito = new CognitoUserPoolStack(app, "CognitoUserPoolStack");
new ApiGatewayStack(app, "FlickPickApiGatewayStack", {
  searchLambda: lambdas.FlickPickSearchMoviesLambda,
  titleDetailsLambda: lambdas.FlickPickTitleDetailsLambda,
  authorizer: cognito.authorizer,
  watchListLambda: lambdas.FlickPickWatchListLambda,
  flickHistoryLambda: lambdas.FlickPickFlickHistoryLambda,
  popularLambda: lambdas.FlickPickPopularMoviesTvsLambda,
});
new EventStack(app, "FlickPickEventStack", {
  lambdaFunction: lambdas.FlickPickPopularMoviesTvsPopulateLambda,
});
new DynamodbStack(app, "FlickPickDynamodbStack", {
  lambdas: [
    lambdas.FlickPickWatchListLambda,
    lambdas.FlickPickFlickHistoryLambda,
    lambdas.FlickPickTitleDetailsLambda,
    lambdas.FlickPickPopularMoviesTvsLambda,
    lambdas.FlickPickPopularMoviesTvsPopulateLambda,
  ],
});
