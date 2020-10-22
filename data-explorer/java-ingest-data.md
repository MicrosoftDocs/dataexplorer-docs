---
title: 'Ingest data with Azure Data Explorer Java SDK'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer using Java SDK.
author: abhirockzz
ms.author: abhishgu
ms.service: data-explorer
ms.topic: how-to
ms.date: 09/07/2020

# Customer intent: As a Java developer, I want to ingest data into Azure Data Explorer so that I can query data to include in my apps.
---

# Ingest data using the Azure Data Explorer Java SDK 

> [!div class="op_single_selector"]
> * [.NET](net-sdk-ingest-data.md)
> * [Python](python-ingest-data.md)
> * [Node](node-ingest-data.md)
> * [Go](go-ingest-data.md)
> * [Java](java-ingest-data.md)

In this article, you ingest data using the Azure Data Explorer Java library. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. The [Java client library](kusto/api/java/kusto-java-client-library.md) can be used to ingest, issue control commands, and query data in Azure Data Explorer clusters.

First, create a table and a data mapping in a test cluster. Then queue an ingestion from blob storage to the cluster using the Java SDK, and validate the results.

## Prerequisites

* A [free Azure account](https://azure.microsoft.com/free/).
* Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* Install JDK (version 1.8 or later).
* Install [Maven](https://maven.apache.org/download.cgi).
* Create an [Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* Create an [App Registration and grant it permissions to the database](provision-azure-ad-app.md). Save the client ID and client secret to be used later in the tutorial.

## Review the code

This section is optional. Review the following code snippets to learn how the code works. To skip this section, go to [run the application](#run-the-application).

### Authentication

The program uses Azure Active Directory authentication credentials. A `com.microsoft.azure.kusto.data.Client`, used for query and management operations, is created using a `ConnectionStringBuilder`:

```java
static Client getClient() throws Exception {
    ConnectionStringBuilder csb = ConnectionStringBuilder.createWithAadApplicationCredentials(endpoint, clientID, clientSecret, tenantID);
    return ClientFactory.createClient(csb);
}
```

A `com.microsoft.azure.kusto.ingest.IngestClient` is created similarly and used to queue data ingestion into Azure Data Explorer:

```java
static IngestClient getIngestionClient() throws Exception {
    String ingestionEndpoint = "https://ingest-" + URI.create(endpoint).getHost();
    ConnectionStringBuilder csb = ConnectionStringBuilder.createWithAadApplicationCredentials(ingestionEndpoint, clientID, clientSecret);
    return IngestClientFactory.createClient(csb);
}
```

### Management commands

[Control commands](kusto/management/commands.md), such as [`.drop`](kusto/management/drop-function.md), [`.create`](kusto/management/create-function.md), are executed by calling `execute` on a `com.microsoft.azure.kusto.data.Client` object.

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

### Data Ingestion

Ingestion is queued using a file from an existing Azure Blob Storage container. A `BlobSourceInfo` is used to specify the Blob Storage path. `IngestionProperties` define information such as table, database, mapping name, and data type. In this example, the data type is `CSV`.

```java
    ...
    static final String blobPathFormat = "https://%s.blob.core.windows.net/%s/%s%s";
    static final String blobStorageAccountName = "kustosamplefiles";
    static final String blobStorageContainer = "samplefiles";
    static final String fileName = "StormEvents.csv";
    static final String blobStorageToken = "??st=2018-08-31T22%3A02%3A25Z&se=2020-09-01T22%3A02%3A00Z&sp=r&sv=2018-03-28&sr=b&sig=LQIbomcKI8Ooz425hWtjeq6d61uEaq21UVX7YrM61N4%3D";
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

The ingestion process is started in a different thread while the `main` thread is blocked waiting for it to complete (using a [CountdownLatch](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CountDownLatch.html)). The ingestion API (`IngestClient#ingestFromBlob`) isn't asynchronous, so a `while` loop is used to poll the current status every 5 secs and wait for the ingestion status to go from `Pending` to a different status. Ideally, the final status is `Succeeded`, but it could be `Failed`, or `PartiallySucceeded`.

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
> This simple example and does not represent the exact semantics of how to handle ingestion asynchronously for different applications. For example, you could use a [`CompletableFuture`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) to create a pipeline defining what you want to do after the ingestion has completed, such as query the table, or handle exceptions that were reported to the `IngestionStatus`.

## Run the application

When you run the sample code, the following actions are performed:

   1. **Drop table**: `StormEvents` table is dropped (if it exists).
   1. **Table creation**: `StormEvents` table is created.
   1. **Mapping creation**: `StormEvents_CSV_Mapping` mapping is created.
   1. **File ingestion**: A CSV file (in Azure Blob Storage) is queued for ingestion.

Sample code as seen in this snippet from `App.java`:

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

1. Clone the sample code from GitHub:

    ```console
    git clone https://github.com/Azure-Samples/azure-data-explorer-java-sdk-ingest.git
    cd azure-data-explorer-java-sdk-ingest
    ```

1. Set the service principal information with the cluster endpoint and the database name in the form of environment variables that will be used by the program:

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

    It might take a few minutes for the ingestion process to complete and you should see a log message `Ingestion completed successfully` once that happens. You can exit the program at this point and move to the next step. It won't impact the ingestion process, since it has already been queued.

## Validate

Wait for five to 10 minutes for the queued ingestion to schedule the ingestion process and load the data into Azure Data Explorer. 

1. Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com) and connect to your cluster. 
1. Run the following command to get the count of records in the `StormEvents` table.
    
    ```kusto
    StormEvents | count
    ```

## Troubleshoot

1. Run the following command in your database to see if there were any ingestion failures in the last four hours. Replace the database name before running.

    ```kusto
    .show ingestion failures
    | where FailedOn > ago(4h) and Database == "<DatabaseName>"
    ```

1. Run the following command to view the status of all ingestion operations in the last four hours. Replace the database name before running.

    ```kusto
    .show operations
    | where StartedOn > ago(4h) and Database == "<DatabaseName>" and Operation == "DataIngestPull"
    | summarize arg_max(LastUpdatedOn, *) by OperationId
    ```

## Clean up resources

If you don't plan to use the resources you have just created, run the following command in your database to drop the `StormEvents` table.

```kusto
.drop table StormEvents
```

## Next steps

[Write queries](write-queries.md)
