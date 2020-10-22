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

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. It provides a [Java client library](kusto/api/java/kusto-java-client-library.md) for interacting with the Azure Data Explorer service that can be used to ingest, issue control commands and query data in Azure Data Explorer clusters.

In this article, you first create a table and a data mapping in a test cluster. You then queue an ingestion from blob storage to the cluster using the Java SDK and validate the results. 

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* Install JDK (version 1.8 or later)
* Install [Maven](https://maven.apache.org/download.cgi)
* Create an [Azure Data Explorer cluster and database](create-cluster-database-portal.md).
* Create an [App Registration and grant it permissions to the database](provision-azure-ad-app.md) - save the client ID and client secret to be used later in the tutorial

## Review the code

This section is optional. If you're interested to learn how the code works, you can review the following code snippets. Otherwise, you can skip ahead to [Run the application](#run-the-application).

### Authentication

The program uses Azure Active Directory authentication credentials. A `com.microsoft.azure.kusto.data.Client` (used for query and management operations) is created using a `ConnectionStringBuilder`:

```java
static Client getClient() throws Exception {
    ConnectionStringBuilder csb = ConnectionStringBuilder.createWithAadApplicationCredentials(endpoint, clientID, clientSecret, tenantID);
    return ClientFactory.createClient(csb);
}
```

The same is the case with an `com.microsoft.azure.kusto.ingest.IngestClient` that is used to queue data ingestion process into Azure Data Explorer:

```java
static IngestClient getIngestionClient() throws Exception {
    String ingestionEndpoint = "https://ingest-" + URI.create(endpoint).getHost();
    ConnectionStringBuilder csb = ConnectionStringBuilder.createWithAadApplicationCredentials(ingestionEndpoint, clientID, clientSecret);
    return IngestClientFactory.createClient(csb);
}
```

### Management commands: drop table, create table, create mapping

The management (control) commands such as `.drop`, `.create` etc. are executed by calling `execute` method on a `com.microsoft.azure.kusto.data.Client` object. Here is an example of how the `StormEvents` table is created:

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

An ingestion is queued using a file from an existing Azure Blob Storage container. A `BlobSourceInfo` is used to specify the Blob Storage path and `IngestionProperties` defines the basic information such as table, database, mapping name and data type (`CSV` in this case).

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

The ingestion process is started in a different thread while the `main` thread is blocked waiting for it to complete (using a [CountdownLatch](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CountDownLatch.html)). The ingestion API (`IngestClient#ingestFromBlob`) is not asynchronous, hence a `while` loop is used to poll the current status (every 5 secs) and wait for it to transition from `Pending` status (ideally to `Succeeded`, but it could be `Failed` or `PartiallySucceeded` as well).

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
> This was just a simple example and the exact semantics of how to handle ingestion asynchronously may vary for the application. For example, you could use a [`CompletableFuture`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CompletableFuture.html) to create a pipeline defining what you want to do after the ingestion has completed, such as querying the table, or handle exceptions that were reported to the IngestionStatus.

## Run the application

When you run the sample code, the following actions are performed:
    1. **Drop table**: `StormEvents` table is dropped (if it exists).
    1. **Table creation**: `StormEvents` table is created.
    1. **Mapping creation**: `StormEvents_CSV_Mapping` mapping is created.
    1. **File ingestion**: A CSV file (in Azure Blob Storage) is queued for ingestion.

The sample code as seen in this snippet from `App.java`: 

```java
public static void main(final String[] args) throws Exception {
    dropTable(database);
    createTable(database);
    createMapping(database);
    ingestFile(database);
}
```

> [!TIP]
> To try different combinations of operations, you can uncomment/comment the respective methods in `App.java`.

1. Clone the sample code from GitHub:

    ```console
    git clone https://github.com/Azure-Samples/azure-data-explorer-java-sdk-ingest.git
    cd azure-data-explorer-java-sdk-ingest
    ```



2. Set the service principal information with the cluster endpoint and the database name in the form of environment variables that will be used by the program:

    ```console
    export AZURE_SP_CLIENT_ID="<replace with appID>"
    export AZURE_SP_CLIENT_SECRET="<replace with password>"
    export KUSTO_ENDPOINT="https://<cluster name>.<azure region>.kusto.windows.net"
    export KUSTO_DB="name of the database"
    ```

3. Build and run:

    ```console
    mvn clean package
    java -jar target/adx-java-ingest-jar-with-dependencies.jar
    ```

    You'll get a similar output:

    ```console
    Table dropped
    Table created
    Mapping created
    Waiting for ingestion to complete...
    ```
    
    It might take a few minutes for the ingestion process to complete and you should see a log message `Ingestion completed successfully` once that happens. You can exit the program at this point and move to the next step. It will not impact the ingestion process, since it has already been queued.

## Validate

Wait for 5 to 10 minutes for the queued ingestion to schedule the ingestion process and load the data into Azure Data Explorer. 

Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com) and connect to your cluster. Then run the following command to get the count of records in the `StormEvents` table.

    ```kusto
    StormEvents | count
    ```

## Troubleshoot

1. Run the following command in your database to see if there were any ingestion failures in the last four hours. Replace the database name before running.

    ```kusto
    .show ingestion failures
    | where FailedOn > ago(4h) and Database == "<DatabaseName>"
    ```

2. Run the following command to view the status of all ingestion operations in the last four hours. Replace the database name before running.

    ```kusto
    .show operations
    | where StartedOn > ago(4h) and Database == "<DatabaseName>" and Operation == "DataIngestPull"
    | summarize arg_max(LastUpdatedOn, *) by OperationId
    ```

## Clean up resources

If you plan to follow our other articles, keep the resources you created. If not, run the following command in your database to drop the `StormEvents` table.

```kusto
.drop table StormEvents
```

## Next steps

[Write queries](write-queries.md)
