---
title: 'Ingest data with Kusto Java SDK'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer using Java SDK.
ms.reviewer: abhishgu
ms.topic: how-to
ms.date: 09/07/2022

# Customer intent: As a Java developer, I want to ingest data into Azure Data Explorer so that I can query data to include in my apps.
---

# Ingest data using the Kusto Java SDK

> [!div class="op_single_selector"]
> * [.NET](net-sdk-ingest-data.md)
> * [Python](python-ingest-data.md)
> * [Node](node-ingest-data.md)
> * [Go](go-ingest-data.md)
> * [Java](java-ingest-data.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. The [Java client library](kusto/api/java/kusto-java-client-library.md) can be used to ingest data, issue management commands, and query data in Azure Data Explorer clusters.

In this article, learn how to ingest data using the Azure Data Explorer Java library. First, you'll create a table and a data mapping in a test cluster. Then you'll queue an ingestion from blob storage to the cluster using the Java SDK and validate the results.

## Prerequisites

* A Microsoft account or an Azure Active Directory user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* JDK version 1.8 or later.
* [Maven](https://maven.apache.org/download.cgi).
* Create an [App Registration and grant it permissions to the database](provision-azure-ad-app.md). Save the client ID and client secret for later use.

## Review the code

This section is optional. Review the following code snippets to learn how the code works. To skip this section, go to [run the application](#run-the-application).

### Authentication

The program uses Azure Active Directory authentication credentials with ConnectionStringBuilder`.

1. Create a `com.microsoft.azure.kusto.data.Client` for query and management.

    ```java
    static Client getClient() throws Exception {
        ConnectionStringBuilder csb = ConnectionStringBuilder.createWithAadApplicationCredentials(endpoint, clientID, clientSecret, tenantID);
        return ClientFactory.createClient(csb);
    }
    ```

1. Create and use a `com.microsoft.azure.kusto.ingest.IngestClient` to queue data ingestion into Azure Data Explorer:

    ```java
    static IngestClient getIngestionClient() throws Exception {
        String ingestionEndpoint = "https://ingest-" + URI.create(endpoint).getHost();
        ConnectionStringBuilder csb = ConnectionStringBuilder.createWithAadApplicationCredentials(ingestionEndpoint, clientID, clientSecret);
        return IngestClientFactory.createClient(csb);
    }
    ```

### Management commands

[Management commands](kusto/management/commands.md), such as [`.drop`](kusto/management/drop-function.md) and [`.create`](kusto/management/create-function.md), are executed by calling `execute` on a `com.microsoft.azure.kusto.data.Client` object.

For example, the `StormEvents` table is created as follows:

```java
static final String createTableCommand = ".create table StormEvents (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)";

static void createTable(String database) {
    try {
        getClient().execute(database, createTableCommand);
        System.out.println("Table created");
    } catch (Exception e) {
        System.out.println("Failed to create table: " + e.getMessage());
        return;
    }

}
```

### Data ingestion

Queue ingestion by using a file from an existing Azure Blob Storage container.

* Use `BlobSourceInfo` to specify the Blob Storage path.
* Use `IngestionProperties` to define table, database, mapping name, and data type.
In the following example, the data type is `CSV`.

```java
    ...
    static final String blobPathFormat = "https://%s.blob.core.windows.net/%s/%s%s";
    static final String blobStorageAccountName = "kustosamples";
    static final String blobStorageContainer = "samplefiles";
    static final String fileName = "StormEvents.csv";
    static final String blobStorageToken = ""; //If relevant add SAS token
    ....

    static void ingestFile(String database) throws InterruptedException {
        String blobPath = String.format(blobPathFormat, blobStorageAccountName, blobStorageContainer,
                fileName, blobStorageToken);
        BlobSourceInfo blobSourceInfo = new BlobSourceInfo(blobPath);

        IngestionProperties ingestionProperties = new IngestionProperties(database, tableName);
        ingestionProperties.setDataFormat(DATA_FORMAT.csv);
        ingestionProperties.setIngestionMapping(ingestionMappingRefName, IngestionMappingKind.Csv);
        ingestionProperties.setReportLevel(IngestionReportLevel.FailuresAndSuccesses);
        ingestionProperties.setReportMethod(IngestionReportMethod.QueueAndTable);
    ....
```

The ingestion process starts in a separate thread and the `main` thread waits for the ingestion thread to complete. This process uses [CountdownLatch](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CountDownLatch.html). The ingestion API (`IngestClient#ingestFromBlob`) isn't asynchronous. A `while` loop is used to poll the current status every 5 secs and waits for the ingestion status to change from `Pending` to a different status. The final status can be `Succeeded`, `Failed`, or `PartiallySucceeded`.

```java
        ....
        CountDownLatch ingestionLatch = new CountDownLatch(1);
        new Thread(new Runnable() {
            @Override
            public void run() {
                IngestionResult result = null;
                try {
                    result = getIngestionClient().ingestFromBlob(blobSourceInfo, ingestionProperties);
                } catch (Exception e) {
                    ingestionLatch.countDown();
                }
                try {
                    IngestionStatus status = result.getIngestionStatusCollection().get(0);
                    while (status.status == OperationStatus.Pending) {
                        Thread.sleep(5000);
                        status = result.getIngestionStatusCollection().get(0);
                    }
                    ingestionLatch.countDown();
                } catch (Exception e) {
                    ingestionLatch.countDown();
                }
            }
        }).start();
        ingestionLatch.await();
    }
```

> [!TIP]
> There are other methods to handle ingestion asynchronously for different applications. For example, you could use [`CompletableFuture`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) to create a pipeline defining the action post-ingestion, such as query the table, or handle exceptions that were reported to the `IngestionStatus`.

## Run the application

### General

When you run the sample code, the following actions are performed:

   1. **Drop table**: `StormEvents` table is dropped (if it exists).
   1. **Table creation**: `StormEvents` table is created.
   1. **Mapping creation**: `StormEvents_CSV_Mapping` mapping is created.
   1. **File ingestion**: A CSV file (in Azure Blob Storage) is queued for ingestion.

The following sample code is from `App.java`:

```java
public static void main(final String[] args) throws Exception {
    dropTable(database);
    createTable(database);
    createMapping(database);
    ingestFile(database);
}
```

> [!TIP]
> To try different combinations of operations, uncomment/comment the respective methods in `App.java`.

### Run the application

1. Clone the sample code from GitHub:

    ```console
    git clone https://github.com/Azure-Samples/azure-data-explorer-java-sdk-ingest.git
    cd azure-data-explorer-java-sdk-ingest
    ```

1. Set the service principal information with the following information as environment variables used by the program:
    * Cluster endpoint
    * Database name

    ```console
    export AZURE_SP_CLIENT_ID="<replace with appID>"
    export AZURE_SP_CLIENT_SECRET="<replace with password>"
    export KUSTO_ENDPOINT="https://<cluster name>.<azure region>.kusto.windows.net"
    export KUSTO_DB="name of the database"
    ```

1. Build and run:

    ```console
    mvn clean package
    java -jar target/adx-java-ingest-jar-with-dependencies.jar
    ```

    The output will be similar to:

    ```console
    Table dropped
    Table created
    Mapping created
    Waiting for ingestion to complete...
    ```

Wait a few minutes for the ingestion process to complete. After successful completion, you'll see the following log message: `Ingestion completed successfully`. You can exit the program at this point and move to the next step without impacting the ingestion process, which has already been queued.

## Validate

Wait five to 10 minutes for the queued ingestion to schedule the ingestion process and load data into Azure Data Explorer.

1. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com) and connect to your cluster.
1. Run the following command to get the count of records in the `StormEvents` table:

    ```kusto
    StormEvents | count
    ```

## Troubleshoot

1. To see ingestion failures in the last four hours, run the following command on your database:

    ```kusto
    .show ingestion failures
    | where FailedOn > ago(4h) and Database == "<DatabaseName>"
    ```

1. To view the status of all ingestion operations in the last four hours, run the following command:

    ```kusto
    .show operations
    | where StartedOn > ago(4h) and Database == "<DatabaseName>" and Operation == "DataIngestPull"
    | summarize arg_max(LastUpdatedOn, *) by OperationId
    ```

## Clean up resources

If you don't plan to use the resources you have created, run the following command in your database to drop the `StormEvents` table.

```kusto
.drop table StormEvents
```

## Next steps

[Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)