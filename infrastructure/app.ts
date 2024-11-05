import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { ApiGatewayStack } from "./apigateway";
import { CognitoUserPoolStack } from "./cognito";
import { LambdaStack } from "./lambdas";

const app = new cdk.App();
const lambdas = new LambdaStack(app, "FlickPickLambdaStack");
const cognito = new CognitoUserPoolStack(app, "CognitoUserPoolStack");
new ApiGatewayStack(app, "FlickPickApiGatewayStack", {
  popularMoviesTvsLambda: lambdas.FlickPickPopularMoviesTvsLambda,
  searchLambda: lambdas.FlickPickSearchMoviesLambda,
  titleDetailsLambda: lambdas.FlickPickTitleDetailsLambda,
  authorizer: cognito.authorizer,
});
