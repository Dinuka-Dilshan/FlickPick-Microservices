import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { ApiGatewayStack } from "./apigateway";
import { CognitoUserPoolStack } from "./cognito";
import { DynamodbStack } from "./dynamodb";
import { EventStack } from "./eventbridge";
import { LambdaStack } from "./lambdas";
import { S3Stack } from "./s3";

const app = new cdk.App();
const s3Stack = new S3Stack(app, "FlickPickS3Stack");
const lambdas = new LambdaStack(app, "FlickPickLambdaStack", {
  bucket: s3Stack.bucket,
});

const cognito = new CognitoUserPoolStack(app, "CognitoUserPoolStack", {
  s3Bucket: s3Stack.bucket,
});
new ApiGatewayStack(app, "FlickPickApiGatewayStack", {
  searchLambda: lambdas.FlickPickSearchMoviesLambda,
  titleDetailsLambda: lambdas.FlickPickTitleDetailsLambda,
  authorizer: cognito.authorizer,
  wishListLambda: lambdas.FlickPickWishListLambda,
});
new EventStack(app, "FlickPickEventStack", {
  lambdaFunction: lambdas.FlickPickPopularMoviesTvsLambda,
});
new DynamodbStack(app, "FlickPickDynamodbStack", {
  lambdas: [lambdas.FlickPickWishListLambda],
});
