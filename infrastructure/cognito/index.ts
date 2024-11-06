import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { HttpUserPoolAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import {
  AccountRecovery,
  Mfa,
  UserPool,
  UserPoolClient,
  UserPoolDomain,
  UserPoolEmail,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class CognitoUserPoolStack extends Stack {
  public readonly authorizer: HttpUserPoolAuthorizer;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, "FlickPickUserPool", {
      userPoolName: "FlickPickUserPool",
      mfa: Mfa.OFF,
      passwordPolicy: {
        minLength: 8,
        requireDigits: true,
        requireLowercase: true,
        requireSymbols: true,
        requireUppercase: true,
      },
      signInCaseSensitive: false,
      signInAliases: {
        email: true,
        username: false,
      },
      standardAttributes: {
        birthdate: {
          required: true,
          mutable: false,
        },
        gender: {
          required: true,
          mutable: false,
        },
        fullname: {
          required: true,
          mutable: false,
        },
      },
      selfSignUpEnabled: true,
      email: UserPoolEmail.withCognito(),
      accountRecovery: AccountRecovery.EMAIL_ONLY,
    });

    const userPoolClient = new UserPoolClient(this, "FlickPickUserPoolClient", {
      userPool,
      accessTokenValidity: Duration.days(1),
      idTokenValidity: Duration.days(1),
      refreshTokenValidity: Duration.days(30),
      userPoolClientName: "FlickPickUserPoolClient",
      authFlows: { userPassword: true },
    });

    // to enable hosted UI
    new UserPoolDomain(this, "FlickPickUserPoolDomain", {
      userPool,
      cognitoDomain: { domainPrefix: "dinuka" },
    });

    this.authorizer = new HttpUserPoolAuthorizer(
      "FlickPickUserPoolAuthorizer",
      userPool,
      {
        authorizerName: "FlickPickUserPoolAuthorizer",
        userPoolClients: [userPoolClient],
      }
    );
  }
}
