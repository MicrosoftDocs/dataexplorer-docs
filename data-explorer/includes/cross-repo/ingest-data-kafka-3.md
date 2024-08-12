---
ms.topic: include
ms.date: 08/12/2024
---


Replace the values for the following attributes as per your setup: `aad.auth.authority`, `aad.auth.appid`, `aad.auth.appkey`, `kusto.tables.topics.mapping` (the database name), `kusto.ingestion.url`, and `kusto.query.url`.

#### Connector - Dockerfile

This file has the commands to generate the docker image for the connector instance.  It includes the connector download from the git repo release directory.

#### Storm-events-producer directory

This directory has a Go program that reads a local "StormEvents.csv" file and publishes the data to a Kafka topic.

#### docker-compose.yaml

```yaml
version: "2"
services:
  zookeeper:
    image: debezium/zookeeper:1.2
    ports:
      - 2181:2181
  kafka:
    image: debezium/kafka:1.2
    ports:
      - 9092:9092
    links:
      - zookeeper
    depends_on:
      - zookeeper
    environment:
      - ZOOKEEPER_CONNECT=zookeeper:2181
      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
  kusto-connect:
    build:
      context: ./connector
      args:
        KUSTO_KAFKA_SINK_VERSION: 1.0.1
    ports:
      - 8083:8083
    links:
      - kafka
    depends_on:
      - kafka
    environment:
      - BOOTSTRAP_SERVERS=kafka:9092
      - GROUP_ID=adx
      - CONFIG_STORAGE_TOPIC=my_connect_configs
      - OFFSET_STORAGE_TOPIC=my_connect_offsets
      - STATUS_STORAGE_TOPIC=my_connect_statuses
  events-producer:
    build:
      context: ./storm-events-producer
    links:
      - kafka
    depends_on:
      - kafka
    environment:
      - KAFKA_BOOTSTRAP_SERVER=kafka:9092
      - KAFKA_TOPIC=storm-events
      - SOURCE_FILE=StormEvents.csv
```

### Start the containers

1. In a terminal, start the containers:

    ```shell
    docker-compose up
    ```

    The producer application will start sending events to the `storm-events` topic.
    You should see logs similar to the following logs:

    ```shell
    ....
    events-producer_1  | sent message to partition 0 offset 0
    events-producer_1  | event  2007-01-01 00:00:00.0000000,2007-01-01 00:00:00.0000000,13208,NORTH CAROLINA,Thunderstorm Wind,Public
    events-producer_1  |
    events-producer_1  | sent message to partition 0 offset 1
    events-producer_1  | event  2007-01-01 00:00:00.0000000,2007-01-01 05:00:00.0000000,23358,WISCONSIN,Winter Storm,COOP Observer
    ....
    ```

1. To check the logs, run the following command in a separate terminal:

    ```shell
    docker-compose logs -f | grep kusto-connect
    ```

### Start the connector

Use a Kafka Connect REST call to start the connector.

1. In a separate terminal, launch the sink task with the following command:

    ```shell
    curl -X POST -H "Content-Type: application/json" --data @adx-sink-config.json http://localhost:8083/connectors
    ```

1. To check the status, run the following command in a separate terminal:

    ```shell
    curl http://localhost:8083/connectors/storm/status
    ```

The connector will start queueing ingestion processes to Azure Data Explorer.

> [!NOTE]
> If you have log connector issues, [create an issue](https://github.com/Azure/kafka-sink-azure-kusto/issues).

