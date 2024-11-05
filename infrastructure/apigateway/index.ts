import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpUserPoolAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { ROUTES } from "../../constants/routes";

type Props = StackProps & {
  searchLambda: NodejsFunction;
  popularMoviesTvsLambda: NodejsFunction;
  titleDetailsLambda: NodejsFunction;
  authorizer: HttpUserPoolAuthorizer;
};

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const api = new HttpApi(this, "FlickPickAPIGateWay", {
      apiName: "FlickPickAPIGateWay",
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [CorsHttpMethod.GET],
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
        "FlickPickPopularMovieIntegration",
        props.popularMoviesTvsLambda
      ),
      path: ROUTES.POPULAR_MOIES,
      authorizer: props.authorizer,
    });

    api.addRoutes({
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        "FlickPickPopularTvIntegration",
        props.popularMoviesTvsLambda
      ),
      path: ROUTES.POPULAR_TVS,
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

    new CfnOutput(this, "FlickPickAPIURL", {
      key: "FlickPickAPIURL",
      value: api.apiEndpoint,
      exportName: "FlickPickAPIURL",
      description: "This is the entry url for the api",
    });
  }
}
