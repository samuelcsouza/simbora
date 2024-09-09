# Publisher Service

This service sends messages to Kafka and manages your devices.

## How to run

Before continue, check if these services are running into your machine:

- Consumer (_consumer_ folder)
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

1. The API will be available at address http://localhost:300/

### Docker

1. Build the App

   ```bash
   docker build -t api .
   ```

1. Run the container

   ```bash
   docker run -it -p 3000:3000 api
   ```

1. Enjoy!

## Endpoints

Here are listed all the endpoints available in this application

- POST /devices/:id - _Send device data_
- GET /devices - _List all available devices_
- GET /devices/:id - _Get Device Metadata_
- GET /devices/:id/observations - _List device observations (timeserie)_

The payload to use the POST route as describe bellow:

```json
{
  "payload": "TIMESTAMP;DEVICE_VALUE;DEVICE_VARIABLE;UNIT"
}
```
