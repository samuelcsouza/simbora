import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class InfraCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const taskRole = new iam.Role(this, "TaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AmazonECSTaskExecutionRolePolicy"
      )
    );

    // IAM Role
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

    // Criando uma VPC (rede)
    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 3, // Quantidade de zonas de disponibilidade
    });

    // Criando o cluster ECS
    const cluster = new ecs.Cluster(this, "EcsCluster", {
      vpc: vpc,
    });

    // ** Database ** //
    // Criando o segredo para o banco de dados RDS
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

    // Criando o banco de dados RDS PostgreSQL
    const rdsInstance = new rds.DatabaseInstance(this, "RdsInstance", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      vpc,
      credentials: rds.Credentials.fromSecret(dbCredentialsSecret), // Pegando credenciais do Secret Manager
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.SMALL
      ),
      allocatedStorage: 20, // Armazenamento
      maxAllocatedStorage: 100,
      multiAz: true,
      publiclyAccessible: false,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Para desenvolvimento, apaga o RDS ao destruir stack
      deletionProtection: false, // Para evitar proteção de deleção no ambiente de desenvolvimento
    });

    // Definindo a task definition para os containers
    const ecsTaskDefinition = new ecs.FargateTaskDefinition(this, "TaskDef", {
      cpu: 512, // Mais recursos já que mais containers estão rodando
      memoryLimitMiB: 1024,
    });

    // Container 1: Aplicação NestJS (Backend)
    const nestjsContainer = ecsTaskDefinition.addContainer("nestjs-app", {
      image: ecs.ContainerImage.fromRegistry(
        "535002876890.dkr.ecr.sa-east-1.amazonaws.com/nestjs-kafka/api-gateway:latest"
      ), // Sua imagem Docker do NestJS
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "nestjs-app" }),
      environment: {
        DB_HOST: rdsInstance.dbInstanceEndpointAddress,
        DB_PORT: rdsInstance.dbInstanceEndpointPort,
        DB_USERNAME: "postgres",
        DB_PASSWORD: dbCredentialsSecret
          .secretValueFromJson("password")
          .unsafeUnwrap()
          .toString(),
        KAFKA_BROKER: "localhost:9092", // Referência ao Kafka Broker
      },
    });

    nestjsContainer.addPortMappings({
      containerPort: 3000, // Porta exposta pela aplicação NestJS
    });

    // Container 2: Kafka
    const kafkaContainer = ecsTaskDefinition.addContainer("kafka", {
      image: ecs.ContainerImage.fromRegistry("bitnami/kafka:latest"), // Imagem do Kafka
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "kafka" }),
      environment: {
        KAFKA_BROKER_ID: "1",
        KAFKA_LISTENERS: "PLAINTEXT://0.0.0.0:9092",
        KAFKA_ZOOKEEPER_CONNECT: "localhost:2181",
      },
    });

    kafkaContainer.addPortMappings({
      containerPort: 9092, // Porta do Kafka
    });

    // Container 3: Zookeeper (Kafka precisa do Zookeeper para funcionar)
    const zookeeperContainer = ecsTaskDefinition.addContainer("zookeeper", {
      image: ecs.ContainerImage.fromRegistry("bitnami/zookeeper:latest"),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "zookeeper" }),
      environment: {
        ALLOW_ANONYMOUS_LOGIN: "yes",
      },
    });

    zookeeperContainer.addPortMappings({
      containerPort: 2181, // Porta do Zookeeper
    });

    // Container 4: Frontend (React, Angular, etc.)
    const frontendContainer = ecsTaskDefinition.addContainer("frontend-app", {
      image: ecs.ContainerImage.fromRegistry(
        "535002876890.dkr.ecr.sa-east-1.amazonaws.com/nestjs-kafka/ui:latest"
      ), // Sua imagem Docker do Frontend
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "frontend-app" }),
      environment: {
        API_URL: "http://nestjs-app:3000", // URL para o backend (NestJS), utilizando o nome do serviço no ECS
      },
    });

    frontendContainer.addPortMappings({
      containerPort: 80, // Porta padrão para frontend
    });

    // Container 5: Consumidor do Kafka
    const kafkaConsumerContainer = ecsTaskDefinition.addContainer(
      "kafka-consumer",
      {
        image: ecs.ContainerImage.fromRegistry(
          "535002876890.dkr.ecr.sa-east-1.amazonaws.com/nestjs-kafka/consumer:latest"
        ), // Imagem Docker do consumidor
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
      containerPort: 4000, // Porta para o consumidor (se precisar)
    });

    // Criando o serviço ECS com Fargate para o Frontend
    const frontendService =
      new ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "FrontendFargateService",
        {
          cluster,
          taskDefinition: ecsTaskDefinition,
          publicLoadBalancer: true, // Expondo o serviço ao público
          desiredCount: 1, // Número de tasks para iniciar,
        }
      );

    // Auto Scaling do Frontend
    const scalingFrontend = frontendService.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 3,
    });

    // Exemplo de Security Group permitindo tráfego HTTP do Load Balancer
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
      "Allow HTTP traffic"
    );

    scalingFrontend.scaleOnCpuUtilization("CpuScalingFrontend", {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    // Output da URL do Load Balancer para o Frontend
    new cdk.CfnOutput(this, "FrontendLoadBalancerDNS", {
      value: frontendService.loadBalancer.loadBalancerDnsName,
    });
  }
}
