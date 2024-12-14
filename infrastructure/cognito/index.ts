import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { HttpUserPoolAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import {
  AccountRecovery,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  Mfa,
  UserPool,
  UserPoolClient,
  UserPoolDomain,
  UserPoolEmail,
} from "aws-cdk-lib/aws-cognito";
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
} from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";
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
      autoVerify: { email: true },
    });

    const userPoolClient = new UserPoolClient(this, "FlickPickUserPoolClient", {
      userPool,
      accessTokenValidity: Duration.hours(1),
      idTokenValidity: Duration.hours(1),
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

    const identityPool = new CfnIdentityPool(this, "FlickPickIdentityPool", {
      allowUnauthenticatedIdentities: false,
      identityPoolName: "FlickPickIdentityPool",
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    const role = new Role(this, "FlickPickIdentityPoolAuthenticatedRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    // role.addToPolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     resources: [`${props.s3Bucket.bucketArn}/*`],
    //     actions: ["s3:GetObject"],
    //   })
    // );

    new CfnIdentityPoolRoleAttachment(
      this,
      "FlickPickIdentityPoolRoleAttachment",
      {
        identityPoolId: identityPool.ref,
        roles: {
          authenticated: role.roleArn,
        },
      }
    );
  }
}
