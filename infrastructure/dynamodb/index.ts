import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  Billing,
  Capacity,
  TableV2 as Table,
} from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

type Props = StackProps & {
  lambdas: NodejsFunction[];
};

export class DynamodbStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const flickPickTable = new Table(this, "FlickPickTable", {
      tableName: "FlickPickTable",
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING,
      },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(2),
        writeCapacity: Capacity.autoscaled({ maxCapacity: 2 }),
      }),
      sortKey: { name: "SK", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      timeToLiveAttribute: "TTL",
    });

    props.lambdas.forEach((lambda) => {
      flickPickTable.grantFullAccess(lambda);
      lambda.addEnvironment("FLICK_PICK_TABLE", flickPickTable.tableName);
    });
  }
}
