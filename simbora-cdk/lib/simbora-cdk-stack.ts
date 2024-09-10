import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";
import * as alb from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from "constructs";

export class SimboraCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ** IAM Role ** //
    const taskRole = new iam.Role(this, "TaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AmazonECSTaskExecutionRolePolicy"
      )
    );

    // AmazonEC2ContainerRegistryFullAccess

    taskRole.addToPolicy(
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
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:GetAuthorizationToken",
          "ssm:GetParameters",
        ],
        resources: ["*"],
      })
    );

    // ** VPC ** //
    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 3,
    });

    // ** ECS ** //
    const cluster = new ecs.Cluster(this, "EcsCluster", {
      vpc: vpc,
      containerInsights: true,
    });

    // ** Database ** //
    const dbCredentialsSecret = new secretsmanager.Secret(
      this,
      "DbCredentialsSecret",
      {
        secretName: "DbCredentialsSecret",
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            username: "postgres",
          }),
          excludePunctuation: true,
          includeSpace: false,
          generateStringKey: "password",
        },
      }
    );

    const rdsInstance = new rds.DatabaseInstance(this, "RdsInstance", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      vpc,
      credentials: rds.Credentials.fromSecret(dbCredentialsSecret),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.SMALL
      ),
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      multiAz: true,
      publiclyAccessible: false,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
    });

    // ** Containers ** //
    const ecsTaskDefinition = new ecs.FargateTaskDefinition(this, "TaskDef", {
      cpu: 512,
      memoryLimitMiB: 1024,
      runtimePlatform: {
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
        cpuArchitecture: ecs.CpuArchitecture.ARM64,
      },
    });

    // Container 1: api-gateway
    const nestjsContainer = ecsTaskDefinition.addContainer("nestjs-app", {
      image: ecs.ContainerImage.fromRegistry(
        "535002876890.dkr.ecr.sa-east-1.amazonaws.com/nestjs-kafka/api-gateway:latest"
      ),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "nestjs-app" }),
      environment: {
        DB_HOST: rdsInstance.dbInstanceEndpointAddress,
        DB_PORT: rdsInstance.dbInstanceEndpointPort,
        DB_USERNAME: "postgres",
        DB_PASSWORD: dbCredentialsSecret
          .secretValueFromJson("password")
          .unsafeUnwrap()
          .toString(),
        KAFKA_BROKER: "localhost:9092",
      },
    });

    nestjsContainer.addPortMappings({
      containerPort: 3000,
    });

    // Container 2: Kafka
    const kafkaContainer = ecsTaskDefinition.addContainer("kafka", {
      image: ecs.ContainerImage.fromRegistry("confluentinc/cp-kafka:latest"),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "kafka" }),
      environment: {
        KAFKA_BROKER_ID: "1",
        KAFKA_LISTENERS: "PLAINTEXT://0.0.0.0:9092",
        KAFKA_ZOOKEEPER_CONNECT: "localhost:2181",
        KAFKA_ADVERTISED_LISTENERS:
          "PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092",
        KAFKA_LISTENER_SECURITY_PROTOCOL_MAP:
          "PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT",
        KAFKA_INTER_BROKER_LISTENER_NAME: "PLAINTEXT",
        KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1",
      },
    });

    kafkaContainer.addPortMappings({
      containerPort: 9092,
    });

    // Container 3: Zookeeper
    const zookeeperContainer = ecsTaskDefinition.addContainer("zookeeper", {
      image: ecs.ContainerImage.fromRegistry(
        "confluentinc/cp-zookeeper:latest"
      ),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "zookeeper" }),
      environment: {
        ALLOW_ANONYMOUS_LOGIN: "yes",
        ZOOKEEPER_CLIENT_PORT: "2181",
        ZOOKEEPER_TICK_TIME: "2000",
      },
    });

    zookeeperContainer.addPortMappings({
      containerPort: 2181,
    });

    // Container 4: ui
    const frontendContainer = ecsTaskDefinition.addContainer("frontend-app", {
      image: ecs.ContainerImage.fromRegistry(
        "535002876890.dkr.ecr.sa-east-1.amazonaws.com/nestjs-kafka/ui:latest"
      ),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "frontend-app" }),
      memoryLimitMiB: 512,
      cpu: 256,
      portMappings: [
        {
          containerPort: 80,
          hostPort: 80,
        },
      ],
      environment: {
        API_URL: "http://nestjs-app:3000",
      },
    });

    frontendContainer.addPortMappings({
      containerPort: 80,
    });

    // Container 5: consumer
    const kafkaConsumerContainer = ecsTaskDefinition.addContainer(
      "kafka-consumer",
      {
        image: ecs.ContainerImage.fromRegistry(
          "535002876890.dkr.ecr.sa-east-1.amazonaws.com/nestjs-kafka/consumer:latest"
        ),
        logging: ecs.LogDrivers.awsLogs({ streamPrefix: "kafka-consumer" }),
        environment: {
          KAFKA_BROKER: "localhost:9092",
          DB_HOST: rdsInstance.dbInstanceEndpointAddress,
          DB_PORT: rdsInstance.dbInstanceEndpointPort,
          DB_USERNAME: "postgres",
          DB_PASSWORD: dbCredentialsSecret
            .secretValueFromJson("password")
            .unsafeUnwrap()
            .toString(),
        },
      }
    );

    kafkaConsumerContainer.addPortMappings({
      containerPort: 4000,
    });

    // ** ECS and Load Balancer (ui) ** //
    const frontendService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "FrontendFargateService",
        {
          cluster,
          taskDefinition: ecsTaskDefinition,
          publicLoadBalancer: true,
          desiredCount: 1,
          assignPublicIp: true,
        }
      );

    const scalingFrontend = frontendService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 3,
    });

    const serviceSecurityGroup = new ec2.SecurityGroup(
      this,
      "ServiceSecurityGroup",
      {
        vpc,
        allowAllOutbound: true,
      }
    );

    serviceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP access from the Internet"
    );

    serviceSecurityGroup.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP access to the Internet"
    );

    scalingFrontend.scaleOnCpuUtilization("CpuScalingFrontend", {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    new cdk.CfnOutput(this, "FrontendLoadBalancerDNS", {
      value: frontendService.loadBalancer.loadBalancerDnsName,
    });
  }
}
