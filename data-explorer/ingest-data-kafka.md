---
title: 'Ingest data from Kafka into Azure Data Explorer'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer from Kafka.
author: orspod
ms.author: orspodek
ms.reviewer: ankhanol
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/10/2020
 
#Customer intent: As an integration developer, I want to build integration pipelines from Kafka into Azure Data Explorer, so I can make data available for near real time analytics.
---
 
# Ingest data from Apache Kafka into Azure Data Explorer
 
Azure Data Explorer offers ingestion (data loading) from Apache Kafka. Apache Kafka is a distributed streaming platform for building real-time streaming data pipelines that reliably move data between systems or applications. [Kafka Connect](https://docs.confluent.io/3.0.1/connect/intro.html#kafka-connect) is an open source, code free, configuration-based ETL (extract, transform, and load) service for bi-directional data movement between Kafka and any storage or database.  Azure Data Explorer offers an open source Kafka Connect sink connector available to use, parse, and ingest data from Kafka into Azure Data Explorer without using code. For more information, see the connector [Git repo](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md).  

This article shows Kafka ingestion into Azure Data Explorer, using a self-contained Docker setup that removes complexities of Kafka cluster and Kafka connector cluster setup. 

## Prerequisites

* You will need a [Microsoft Azure account](https://docs.microsoft.com/azure/).
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) on your machine, if you don't have it already.
* [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install) on your machine, if you don't have it already.

## Create an Azure Active Directory service principal

This service principal will be the identity leveraged by the connector to write to the Azure Data Explorer table.  In the next step, we will grant permissions for this service principal to access Azure Data Explorer.

### Login to your Azure subscription via Azure CLI

```
az login
```

This launches a browser to authenticate.  Follow the steps to authenticate.

### Choose the subscription you want to run the lab in.  This is needed when you have multiple.

```
az account set --subscription YOUR_SUBSCRIPTION_GUID
```

### Create the service principal

Lets call our service principal, kusto-kafka-spn.  Run the command below to create it.

```
az ad sp create-for-rbac -n "kusto-kafka-spn"
```

You will get a JSON response as shown below. Note down the `appId`, `password` and `tenant` as you will need them in subsequent steps

```json
{
  "appId": "fe7280c7-5705-4789-b17f-71a472340429",
  "displayName": "kusto-kafka-spn",
  "name": "http://kusto-kafka-spn",
  "password": "29c719dd-f2b3-46de-b71c-4004fb6116ee",
  "tenant": "42f988bf-86f1-42af-91ab-2d7cd011db42"
}
```

## Provision and configure Azure Data Explorer

1. [Create an Azure Data Explorer cluster and database in the Azure portal](create-cluster-database-portal.md). Use the default cache and retention policies.
1. Create a table called `Storms` and the corresponding table mapping `Storms_CSV_Mapping` for ingested data.

```kusto
.create table Storms (StartTime: datetime, EndTime: datetime, EventId: int, State: string, EventType: string, Source: string)

.create table Storms ingestion csv mapping 'Storms_CSV_Mapping' '[{"Name":"StartTime","datatype":"datetime","Ordinal":0}, {"Name":"EndTime","datatype":"datetime","Ordinal":1},{"Name":"EventId","datatype":"int","Ordinal":2},{"Name":"State","datatype":"string","Ordinal":3},{"Name":"EventType","datatype":"string","Ordinal":4},{"Name":"Source","datatype":"string","Ordinal":5}]'
```

### Create a batch ingestion policy on the table for configurable ingestion latency

The [ingestion batching policy](kusto/management/batchingpolicy.md) is a performance optimizer and includes three parameters, the first one met triggers an ingestion into Azure Data Explorer table.

```kusto
.alter table Storms policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:15", "MaximumNumberOfItems": 100, "MaximumRawDataSizeMB": 300}'
```

### Grant permissions to the service principal

Use the service principal from [Create the service principal](#create-the-service-principal) to grant permission to work with the database.

```kusto
.add database YOUR_DATABASE_NAME admins  ('aadapp=YOUR_APP_ID;YOUR_TENANT_ID') 'AAD App'
```

## Clone the lab's git repo

1. Create a local directory on your machine

```
mkdir ~/kafka-kusto-hol
cd ~/kafka-kusto-hol
```

1. Clone the repo

```shell
cd ~/kafka-kusto-hol
git clone https://github.com/Azure/azure-kusto-labs
cd azure-kusto-labs/kafka-integration/dockerized-quickstart
```

## Review contents

### List the contents

```
cd ~/kafka-kusto-hol/azure-kusto-labs/kafka-integration/dockerized-quickstart
tree
```

This is what it should look like

```
├── README.md
├── adx-query.png
├── adx-sink-config.json
├── connector
│   └── Dockerfile
├── docker-compose.yaml
└── storm-events-producer
    ├── Dockerfile
    ├── StormEvents.csv
    ├── go.mod
    ├── go.sum
    ├── kafka
    │   └── kafka.go
    └── main.go
 ```

### adx-sink-config.json

This is the Kusto sink properties file where we need to update our specific configuration details for the lab.<br>
Here is what it looks like

```json
{
    "name": "storm",
    "config": {
        "connector.class": "com.microsoft.azure.kusto.kafka.connect.sink.KustoSinkConnector",
        "flush.size.bytes": 10000,
        "flush.interval.ms": 10000,
        "tasks.max": 1,
        "topics": "storm-events",
        "kusto.tables.topics.mapping": "[{'topic': 'storm-events','db': '<enter database name>', 'table': 'Storms','format': 'csv', 'mapping':'Storms_CSV_Mapping'}]",
        "aad.auth.authority": "<enter tenant ID>",
        "aad.auth.appid": "<enter application ID>",
        "aad.auth.appkey": "<enter client secret>",
        "kusto.url": "https://ingest-<name of cluster>.<region>.kusto.windows.net",
        "key.converter": "org.apache.kafka.connect.storage.StringConverter",
        "value.converter": "org.apache.kafka.connect.storage.StringConverter"
    }
}
```

Replace the values for the following attributes as per your Azure Data Explorer setup - `aad.auth.authority`, `aad.auth.appid`, `aad.auth.appkey`, `kusto.tables.topics.mapping` (the database name) and `kusto.url`.


### Connector/Dockerfile

Has the commands for generating the docker image for the connector instance.  It includes download of the connector from the git repo release directory.

### Storm-events-producer directory and its contents

At a high level - this has a Go program that reads a local "StormEvents.csv" file and publishes the same to a Kafka topic.

### docker-compose.yaml

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

## Run the lab setup

### Start the containers - Kafka, connect, producer etc

In a terminal, start the containers

```shell
docker-compose up
```

The producer application will start sending events to the `storm-events` topic. You should see logs similar to:

```shell
....
events-producer_1  | sent message to partition 0 offset 0
events-producer_1  | event  2007-01-01 00:00:00.0000000,2007-01-01 00:00:00.0000000,13208,NORTH CAROLINA,Thunderstorm Wind,Public
events-producer_1  | 
events-producer_1  | sent message to partition 0 offset 1
events-producer_1  | event  2007-01-01 00:00:00.0000000,2007-01-01 05:00:00.0000000,23358,WISCONSIN,Winter Storm,COOP Observer
....
```

Should you need to check the logs, in a separate terminal run the following

```shell
docker-compose logs -f | grep kusto-connect
```

### Start the connector via Kafka Connect REST call

In a separate terminal, launch sink task

```shell
curl -X POST -H "Content-Type: application/json" --data @adx-sink-config.json http://localhost:8083/connectors
```

Check status:

```shell
curl http://localhost:8083/connectors/storm/status
```

The connector should start queueing ingestion processes to Azure Data Explorer.

## Check Azure Data Explorer for event delivery by the connector

Wait for sometime before data ends up in the `Storms` table. To confirm, check the row count and confirm that there are no failures in the ingestion process:

```kusto
Storms | count

. show ingestion failures
```

Once there is some data, try out a few queries. To see all the records:

```kusto
Storms
```

Use `where` and `project` to filter specific data

```kusto
Storms
| where EventType == 'Drought' and State == 'TEXAS'
| project StartTime, EndTime, Source, EventId
```

Use the [`summarize`](https://docs.microsoft.com/azure/data-explorer/write-queries#summarize) operator

```kusto
Storms
| summarize event_count=count() by State
| where event_count > 10
| project State, event_count
| render columnchart
```

![\\anagha - where is image file\\](adx-query.png)

These are just few examples. Dig into the [Kusto Query Language documentation](https://docs.microsoft.com/azure/data-explorer/kusto/query/) or explore tutorials about [how to ingest JSON formatted sample data into Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/ingest-json-formats?tabs=kusto-query-language), using [scalar operators](https://docs.microsoft.com/azure/data-explorer/write-queries#scalar-operators), [timecharts](https://docs.microsoft.com/azure/data-explorer/kusto/query/tutorial?pivots=azuredataexplorer#timecharts), and so on.


## Reset and Clean up

If you want to re-start from scratch, simply stop the containers (`docker-compose down -v`), delete (`drop table Storms`) and re-create the `Storms` table (along with the mapping) and re-start containers (`docker-compose up`)

To delete the Azure Data Explorer cluster/database, use [az cluster delete](https://docs.microsoft.com/cli/azure/kusto/cluster?view=azure-cli-latest#az-kusto-cluster-delete) or [az kusto database delete](https://docs.microsoft.com/cli/azure/kusto/database?view=azure-cli-latest#az-kusto-database-delete)

```azurecli
az kusto cluster delete -n <cluster name> -g <resource group name>
az kusto database delete -n <database name> --cluster-name <cluster name> -g <resource group name>
```

## Next Steps

The following resources supply additional information about the Kafka connector. This information includes Kafka ingestion from HDInsight Kafka (with and without Enterprise Security Package), Confluent Cloud, and Confluent Kafka IaaS with Confluent operator.

* [Kafka Connect](https://docs.confluent.io/3.0.1/connect/intro.html#kafka-connect)
* [Kusto sink connector Git repo with comprehensive documentation](https://github.com/Azure/kafka-sink-azure-kusto/blob/master/README.md)
* Download the sink connector jar from our [Git repo](https://github.com/Azure/kafka-sink-azure-kusto/releases) or [Confluent Connector Hub](https://www.confluent.io/hub/microsoftcorporation/kafka-sink-azure-kusto)
* [Hands on lab for ingestion from Confluent Cloud Kafka in distributed mode](https://github.com/Azure/azure-kusto-labs/blob/master/kafka-integration/confluent-cloud/README.md)
* [Hands on lab for ingestion from HDInsight Kafka in distributed mode](https://github.com/Azure/azure-kusto-labs/tree/master/kafka-integration/distributed-mode/hdinsight-kafka)
* [Hands on lab for ingestion from Confluent IaaS Kafka on AKS in distributed mode](https://github.com/Azure/azure-kusto-labs/blob/master/kafka-integration/distributed-mode/confluent-kafka/README.md)
* [Big data architecture](/azure/architecture/solution-ideas/articles/big-data-azure-data-explorer)
* [Log connector issues, request support](https://github.com/Azure/kafka-sink-azure-kusto/issues)
 
