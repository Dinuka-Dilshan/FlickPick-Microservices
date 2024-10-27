import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { ApiGatewayStack } from "./apigateway";
import { LambdaStack } from "./lambdas";

const app = new cdk.App();
new LambdaStack(app, "FlickPickLambdaStack");
new ApiGatewayStack(app, "FlickPickApiGatewayStack");
