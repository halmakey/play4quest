import {
  Stack,
  StackProps,
  Duration,
  aws_lambda,
  aws_lambda_nodejs,
  aws_apigateway,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import path from "path";

export class PsudoJinnaiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const func = new aws_lambda_nodejs.NodejsFunction(
      this,
      "JinnaizeFunction",
      {
        entry: path.join(__dirname, "../src/handler.ts"),
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        bundling: {
          forceDockerBundling: true,
          commandHooks: {
            beforeInstall(inputDir, outputDir) {
              return [];
            },
            beforeBundling(inputDir, outputDir) {
              return [];
            },
            afterBundling(inputDir, outputDir) {
              return [
                `npx tsx ${inputDir}/scripts/dl-ytdlp.ts linux x64 ${outputDir}/bin`,
              ];
            },
          },
        },
        timeout: Duration.seconds(120),
        memorySize: 256,
        environment: {},
      }
    );

    const api = new aws_apigateway.RestApi(this, "JinnaizeGateway", {});

    api.root.addMethod("ANY", new aws_apigateway.LambdaIntegration(func));
    api.root.addProxy({
      anyMethod: true,
      defaultIntegration: new aws_apigateway.LambdaIntegration(func),
    });
  }
}
