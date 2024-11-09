import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

type Props = StackProps & {
  lambdaFunction: NodejsFunction;
};

export class EventStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    new Rule(this, "FlickPickEventBridge", {
      description: "Run popular movies lambda function every tweleve hours",
      schedule: Schedule.rate(Duration.hours(12)),
      targets: [new LambdaFunction(props.lambdaFunction)],
    });
  }
}
