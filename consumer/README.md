# Consumer Service

This service process messages sent by publisher and stores it into a database.

## How to run

Before continue, check if these services are running into your machine:

- Publisher (_api-gateway_ folder)
- Postgres Database
- Kafka
- Zookeeper

You can run some services with `docker compose up --build` command on root folder.

### Npm

To run via `npm` package manager:

1. Install the dependencies

   ```bash
   npm install
   ```

1. Launch the app

   ```bash
   npm start:dev
   ```

1. Enjoy!

### Docker

1. Build the App

   ```bash
   docker build -t consumer .
   ```

1. Run the container

   ```bash
   docker run -it consumer
   ```

1. Enjoy!
