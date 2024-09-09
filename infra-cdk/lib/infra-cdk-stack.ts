import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as rds from "aws-cdk-lib/aws-rds";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as secrets from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export class InfraCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC and RDS Postgres Provisionning
    // VPC for RDS and Lambda resolvers
    const vpc = new ec2.Vpc(this, "VPC", {
      vpcName: "rds-vpc",
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
          name: "rds",
        },
      ],
    });

    // Security Groups
    const securityGroupResolvers = new ec2.SecurityGroup(
      this,
      "SecurityGroupResolvers",
      {
        vpc,
        securityGroupName: "resolvers-sg",
        description: "Security Group with Resolvers",
      }
    );
    const securityGroupRds = new ec2.SecurityGroup(this, "SecurityGroupRds", {
      vpc,
      securityGroupName: "rds-sg",
      description: "Security Group with RDS",
    });

    // Ingress and Egress Rules
    securityGroupRds.addIngressRule(
      securityGroupResolvers,
      ec2.Port.tcp(5432),
      "Allow inbound traffic to RDS"
    );

    // VPC Interfaces
    vpc.addInterfaceEndpoint("LAMBDA", {
      service: ec2.InterfaceVpcEndpointAwsService.LAMBDA,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [securityGroupResolvers],
    });
    vpc.addInterfaceEndpoint("SECRETS_MANAGER", {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [securityGroupResolvers],
    });

    // IAM Role
    const role = new iam.Role(this, "Role", {
      roleName: "MyRDS",
      description: "Role used in the RDS stack",
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("ec2.amazonaws.com"),
        new iam.ServicePrincipal("lambda.amazonaws.com")
      ),
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "cloudwatch:PutMetricData",
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeInstances",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeRouteTables",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "lambda:InvokeFunction",
          "secretsmanager:GetSecretValue",
          "kms:decrypt",
          "rds-db:connect",
        ],
        resources: ["*"],
      })
    );

    // RDS PostgreSQL Instance

    const mysqlSecret = new cdk.aws_secretsmanager.Secret(
      this,
      "pg-credentials",
      {
        secretName: "postgres-pg-credentials",
        description: "Postgres Db Credentials",
        generateSecretString: {
          excludeCharacters: "\"@/\\ '",
          generateStringKey: "password",
          passwordLength: 30,
          secretStringTemplate: JSON.stringify({ username: "root" }),
        },
      }
    );

    const dbCredentials = rds.Credentials.fromSecret(mysqlSecret, "root");

    const rdsInstance = new rds.DatabaseInstance(this, "PostgresRds", {
      vpc,
      securityGroups: [securityGroupRds],
      vpcSubnets: { subnets: vpc.isolatedSubnets },
      availabilityZone: vpc.isolatedSubnets[0].availabilityZone,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.SMALL
      ),
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      port: 5432,
      instanceIdentifier: "postgresdb-instance",
      allocatedStorage: 10,
      maxAllocatedStorage: 10,
      deleteAutomatedBackups: true,
      backupRetention: cdk.Duration.millis(0),
      credentials: dbCredentials,
      publiclyAccessible: false,
    });
    rdsInstance.secret?.grantRead(role);
  }
}
