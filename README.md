<div align="center">
<h1>Simbora</h1>
<img src="ui/src/assets/simbora.svg" width="45%"/>
<br></br>
<i>Application for reporting incidents on highways</i>
<br></br>

</div>

One of the biggest problems for people who enjoy traveling is encountering unexpected incidents along highways. This application aims to be a platform where users can report incidents in real time on certain sections of highways.

Three Brazilian highways are pre-registered where users can report the conditions of their sections. Each reported incident consists of the reported time, its type (pothole, accident, animals, and others), the kilometer where it is located, the direction of the road, and the city under whose jurisdiction it falls.

On the Simbora platform, users can report an incident and view other incidents previously reported by users.

## Technologies

- NestJs
- Kafka
- PostgreSQL
- Reactjs
- AWS CDK

## Operation & Architecture

Each highway has a specific identifier, which is used as the name of the topics in Kafka. Each incident is treated as a message and is sent to its respective topic using the highway identifier. The initial data format is as follows: `TIMESTAMP;INCIDENT;DISTANCE;DIRECTION;CITY`, as in the early stages of the project, the idea was to send a simpler payload to integrate with other services, such as IoT devices.

The message is then processed by the microservices of this application and stored in the database in a more suitable format for integration with the frontend and other services.

<img src="ui/src/assets/system architecture.jpg" width="100%"/>

The section for sending and processing messages is described in the image above. In addition to sending and processing messages, the API Gateway also allows for listing the pre-registered highways and their metadata. Furthermore, it is possible to list all the messages (incidents) already processed by the application.

You can find more information about the routes in the `postman` folder, and details about the main API (API Gateway) can be found in its `api-gateway` folder.

## How to run

### Via Docker (Recommended)

To run the project via docker, you just need to run the command below:

```bash
docker compose up --build
```

The following services will be available:

- [Simbora](http://localhost:3010/) - Frontend
- [Kafka UI](http://localhost:8080/) - Monitor your Kafka server
- [Zookeeper](http://localhost:22181/)
- [Kafka](http://localhost:29092/)
- [API Gateway](http://localhost:3000) - Main API & Publisher
- Consumer - Microservice to consume messages from Kafka
- Postgres - Available on port 5432 TCP

For more information on how to run services in isolation, you can find it in the `README.md` file of each respective service folder.
