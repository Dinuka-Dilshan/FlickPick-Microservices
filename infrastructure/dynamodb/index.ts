import { Stack, StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  Billing,
  Capacity,
  TableV2 as Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DynamodbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const moviesTable = new Table(this, "FlickPickTable", {
      tableName: "FlickPickTable",
      partitionKey: {
        name: "movie_id",
        type: AttributeType.STRING,
      },
      billing: Billing.provisioned({
        readCapacity: Capacity.fixed(2),
        writeCapacity: Capacity.fixed(2),
      }),
      sortKey: { name: "", type: AttributeType.STRING },
      
    });
  }
}
