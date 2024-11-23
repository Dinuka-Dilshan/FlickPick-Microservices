import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
  Context,
} from "aws-lambda";

export type LambdaFunctionType = (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
  context: Context
) => Promise<APIGatewayProxyResultV2>;
