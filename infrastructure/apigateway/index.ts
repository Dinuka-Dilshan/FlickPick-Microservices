import { CfnOutput, Stack, type StackProps } from "aws-cdk-lib";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import type { HttpUserPoolAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import type { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";
import { ROUTES } from "../../constants/routes";

type Props = StackProps & {
  searchLambda: NodejsFunction;
  titleDetailsLambda: NodejsFunction;
  watchListLambda: NodejsFunction;
  flickHistoryLambda: NodejsFunction;
  popularLambda: NodejsFunction;
  authorizer: HttpUserPoolAuthorizer;
};

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const api = new HttpApi(this, "FlickPickAPIGateWay", {
      apiName: "FlickPickAPIGateWay",
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.DELETE,
        ],
        allowHeaders: ["*"],
      },
    });

    api.addRoutes({
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        "FlickPickSearchIntegration",
        props.searchLambda
      ),
      path: ROUTES.SEARCH,
      authorizer: props.authorizer,
    });

    api.addRoutes({
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        "FlickPickTitleDetailsIntegration",
        props.titleDetailsLambda
      ),
      path: ROUTES.TITLE_DETAILS,
      authorizer: props.authorizer,
    });

    api.addRoutes({
      methods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.DELETE],
      integration: new HttpLambdaIntegration(
        "FlickPickWishListIntegration",
        props.watchListLambda
      ),
      path: ROUTES.WATCH_LIST,
      authorizer: props.authorizer,
    });

    api.addRoutes({
      methods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.DELETE],
      integration: new HttpLambdaIntegration(
        "FlickPickFlickHistoryIntegration",
        props.flickHistoryLambda
      ),
      path: ROUTES.FLICK_HISTORY,
      authorizer: props.authorizer,
    });

    api.addRoutes({
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        "FlickPickPopularFlicksIntegration",
        props.popularLambda
      ),
      path: ROUTES.POPULAR,
      authorizer: props.authorizer,
    });

    new CfnOutput(this, "FlickPickAPIURL", {
      key: "FlickPickAPIURL",
      value: api.apiEndpoint,
      exportName: "FlickPickAPIURL",
      description: "This is the entry url for the api",
    });
  }
}
