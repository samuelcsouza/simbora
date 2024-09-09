# Frontend

## How to run

Before continue, check if these services are running into your machine:

- Publisher (_api-gateway_ folder)
- Consumer (_consumer_ folder)
- Postgres Database
- Kafka
- Zookeeper

You can run some services with `docker compose up --build` command on root folder.

### Yarn

To run via `yarn` package manager:

1. Install the dependencies

   ```bash
   yarn
   ```

1. Launch the app

   ```bash
   yarn start
   ```

1. The URL show into console. The default is http://localhost:3000/

### Docker

1. Build the App

   ```bash
   docker build -t ui .
   ```

1. Run the container

   ```bash
   docker run -it -p 3010:3000 ui
   ```

1. Go to http://localhost:3010/ and enjoy!
