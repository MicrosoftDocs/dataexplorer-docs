---
ms.topic: include
ms.date: 08/12/2024
---

## Create a Microsoft Entra service principal

The Microsoft Entra service principal can be created through the [Azure portal](/azure/active-directory/develop/howto-create-service-principal-portal) or programatically, as in the following example.

This service principal is the identity used by the connector to write data your table in Kusto. You grant permissions for this service principal to access Kusto resources.

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]

## Create a target table

1. From your query environment, create a table called `Storms` using the following command:

    ```kusto
    .create table Storms (StartTime: datetime, EndTime: datetime, EventId: int, State: string, EventType: string, Source: string)
    ```

1. Create the corresponding table mapping `Storms_CSV_Mapping` for ingested data using the following command:

    ```kusto
    .create table Storms ingestion csv mapping 'Storms_CSV_Mapping' '[{"Name":"StartTime","datatype":"datetime","Ordinal":0}, {"Name":"EndTime","datatype":"datetime","Ordinal":1},{"Name":"EventId","datatype":"int","Ordinal":2},{"Name":"State","datatype":"string","Ordinal":3},{"Name":"EventType","datatype":"string","Ordinal":4},{"Name":"Source","datatype":"string","Ordinal":5}]'
    ```

1. Create an [ingestion batching policy](/azure/data-explorer/kusto/management/batching-policy) on the table for configurable queued ingestion latency.

    > [!TIP]
    > The ingestion batching policy is a performance optimizer and includes three parameters. The first condition satisfied triggers ingestion into the table.

    ```kusto
    .alter table Storms policy ingestionbatching @'{"MaximumBatchingTimeSpan":"00:00:15", "MaximumNumberOfItems": 100, "MaximumRawDataSizeMB": 300}'
    ```

1. Use the service principal from [Create a Microsoft Entra service principal](#create-a-microsoft-entra-service-principal) to grant permission to work with the database.

    ```kusto
    .add database YOUR_DATABASE_NAME admins  ('aadapp=YOUR_APP_ID;YOUR_TENANT_ID') 'AAD App'
    ```

## Run the lab

The following lab is designed to give you the experience of starting to create data, setting up the Kafka connector, and streaming this data. You can then look at the ingested data.

### Clone the git repo

Clone the lab's git [repo](https://github.com/Azure/azure-kusto-labs).

1. Create a local directory on your machine.

    ```
    mkdir ~/kafka-kusto-hol
    cd ~/kafka-kusto-hol
    ```

1. Clone the repo.

    ```shell
    cd ~/kafka-kusto-hol
    git clone https://github.com/Azure/azure-kusto-labs
    cd azure-kusto-labs/kafka-integration/dockerized-quickstart
    ```

#### Contents of the cloned repo

Run the following command to list the contents of the cloned repo:

```
cd ~/kafka-kusto-hol/azure-kusto-labs/kafka-integration/dockerized-quickstart
tree
```

This result of this search is:

```
├── README.md
├── adx-query.png
├── adx-sink-config.json
├── connector
│   └── Dockerfile
├── docker-compose.yaml
└── storm-events-producer
    ├── Dockerfile
    ├── StormEvents.csv
    ├── go.mod
    ├── go.sum
    ├── kafka
    │   └── kafka.go
    └── main.go
 ```
