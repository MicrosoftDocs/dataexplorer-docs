---
title: Ingest data with Apache Flink into Azure Data Explorer
description: Learn how to ingest data with Apache Flink into Azure Data Explorer.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 11/05/2023
---

# Ingest data with Apache Flink into Azure Data Explorer

[!INCLUDE [real-time-analytics-connectors-note](includes/real-time-analytics-connectors-note.md)]

[Apache Flink](https://flink.apache.org/) is a framework and distributed processing engine for stateful computations over unbounded and bounded data streams. Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data.

The Azure Data Explorer connector for Flink is an [open source project](https://github.com/Azure/flink-connector-kusto/tree/main) that can run on any Flink cluster. It implements data sink for moving data across Azure Data Explorer and Flink clusters. Using Azure Data Explorer and Apache Flink, you can build fast and scalable applications targeting data driven scenarios. For example, machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics. With the connector, Azure Data Explorer becomes a valid data store for standard Flink sink operations.

In this article, you learn how to use the Azure Data Explorer Flink connector to send data from Flink to a table in your Azure Data Explorer cluster. You create a table and data mapping, direct Flink to send data into the table, and then validate the results.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* An Apache Flink cluster. [Create a cluster](/azure/hdinsight-aks/flink/flink-create-cluster-portal).
* An Azure Data Explorer table and optional [ingestion mapping](kusto/management/mappings.md). [Create a table](create-table-wizard.md).
* [Maven 3.x](https://maven.apache.org/download.cgi)

## Get the Flink connector

For Flink projects that use Maven to manage dependencies, integrate the [Flink Connector Core Sink For Azure Data Explorer](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/flink-connector-kusto) by adding it as a dependency:

```java
<dependency>
    <groupId>com.microsoft.azure.kusto</groupId>
    <artifactId>flink-connector-kusto</artifactId>
    <version>1.0.0</version>
</dependency>
```

For projects that don't use Maven to manage dependencies, clone the [repository for the Azure Data Explorer Connector for Apache Flink](https://github.com/Azure/flink-connector-kusto/tree/main) and build it locally. This approach allows you to manually add the connector to your local Maven repository using the command `mvn clean install -DskipTests`.

## Authenticate to Azure Data Explorer

Authenticate from Flink to your Azure Data Explorer cluster with either a Microsoft Entra ID application or a managed identity.

### [Application](#tab/application)

To use application authentication:

1. In the Azure portal, [create a Microsoft Entra application registration](provision-entra-id-app.md). Alternatively, you can [programatically create a Microsoft Entra service principal](provision-entra-id-app.md#programatically-create-a-microsoft-entra-service-principal). Save the application ID, application key, and tenant ID. 

1. Grant the application user permissions on the target Azure Data Explorer database:

    ```kusto
    // Grant database user permissions
    .add database <MyDatabase> users ('aadapp=<Application ID>;<Tenant ID>')
    ```

    For more information, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).

1. Grant the application permissions on the target Azure Data Explorer table. The required table permissions depend on the method used to write data from the Flink data stream. For [SinkV2](#sinkv2), ingestor permissions are required. For [WriteAheadSink](#writeaheadsink), admin permissions are required.

    ```kusto
    // Grant table ingestor permissions (SinkV2)
    .add table <MyTable> ingestors ('aadapp=<Application ID>;<Tenant ID>')

    // Grant table admin permissions (WriteAheadSink)
    .add table <MyTable> admins ('aadapp=<Application ID>;<Tenant ID>')
    ```

    For more information, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).

### Usage

To authenticate from Flink to Azure Data Explorer with your application:

```java
KustoConnectionOptions kustoConnectionOptions = KustoConnectionOptions.builder()
  .setAppId("<Application ID>")
  .setAppKey("<Application key>")
  .setTenantId("<Tenant ID>")
  .setClusterUrl("<Cluster URI>").build();
```

### [Managed Identity](#tab/managed-identity)

To use managed identity authentication:

1. Add a [system-assigned](configure-managed-identities-cluster.md#add-a-system-assigned-identity) or [user-assigned](configure-managed-identities-cluster.md#add-a-user-assigned-identity) managed identity to your cluster. Save the **Object ID**.

1. Grant the managed identity user permissions on the target Azure Data Explorer database:

    ```kusto
    // Grant database user permissions
    .add database <MyDatabase> users ('aadapp=<Object ID>;<Tenant ID>')
    ```

    For more information, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).

1. Grant the managed identity permissions on the target Azure Data Explorer table. The required table permissions depend on the method used to write data from the Flink data stream. For [SinkV2](#sinkv2), ingestor permissions are required. For [WriteAheadSink](#writeaheadsink), admin permissions are required.

    ```kusto
    // Grant table ingestor permissions (SinkV2)
    .add table <MyTable> ingestors ('aadapp=<Object ID>;<Tenant ID>')

    // Grant table admin permissions (WriteAheadSink)
    .add table <MyTable> admins ('aadapp=<Object ID>;<Tenant ID>')
    ```

    For more information, see [Kusto role-based access control](kusto/access-control/role-based-access-control.md).

### Usage

To authenticate from Flink to Azure Data Explorer with your managed identity:

```java
KustoConnectionOptions kustoConnectionOptions = KustoConnectionOptions.builder()
  .setManagedIdentityAppId("<Object ID>")
  .setClusterUrl("<Cluster URI>").build();
```

---

## Write data from Flink to Azure Data Explorer

To write data from Flink to Azure Data Explorer:

1. Import the required options:

    ```java
    import com.microsoft.azure.flink.config.KustoConnectionOptions;
    import com.microsoft.azure.flink.config.KustoWriteOptions;
    ```

1. Authenticate with one of the methods described in [Authenticate to Azure Data Explorer](#authenticate-to-azure-data-explorer). For example, application authentication:

    ```java
    KustoConnectionOptions kustoConnectionOptions = KustoConnectionOptions.builder()
    .setAppId("<Application ID>")
    .setAppKey("<Application key>")
    .setTenantId("<Tenant ID>")
    .setClusterUrl("<Cluster URI>").build();
    ```

1. Configure the sink parameters such as database and table:

    ```java
    KustoWriteOptions kustoWriteOptions = KustoWriteOptions.builder()
        .withDatabase("<Database name>").withTable("<Table name>").build();
    ```

    You can add more options, as described in the following table:

    | Option                | Description                                            | Default Value   |
    |-----------------------|--------------------------------------------------------|------------------|
    | IngestionMappingRef   | References an existing Kusto ingestion mapping.      |           |
    | FlushImmediately      | Not recommended. Flushes data to ADX/Kusto immediately, may cause performance issues.  |
    | BatchIntervalMs       | Controls how often data is flushed to ADX/Kusto.     | 30 seconds     |
    | BatchSize             | Sets the batch size for buffering records before flushing to ADX/Kusto. | 1000 records |
    | ClientBatchSizeLimit  | Specifies the size in MB of aggregated data before ingestion to ADX/Kusto. | 300 MB |
    | PollForIngestionStatus | If true, the connector polls for ingestion status after data flush. | false |
    | DeliveryGuarantee     | Determines delivery guarantee semantics, defaults to AT_LEAST_ONCE. Even when EXACTLY_ONCE is specified, there can be scenarios os duplicates in the sink. To achieve exactly-once semantics, use WriteAheadSink. | AT_LEAST_ONCE |

1. Write streaming data with one of the following methods:

   * **SinkV2**: This is a stateless option that flushes data on checkpoint, ensuring at least once consistency. We recommend this option for high-volume data ingestion.
   * **WriteAheadSink**: This method emits data to a KustoSink. It's integrated with Flink's checkpointing system and offers exactly-once guarantees. Data is stored in an AbstractStateBackend and committed only after a checkpoint is completed.

    The following example uses SinkV2. To use WriteAheadSink, use the `buildWriteAheadSink` method instead of `build`:

    ```java
    KustoWriteSink.builder().setWriteOptions(kustoWriteOptions)
        .setConnectionOptions(kustoConnectionOptions).build("<Flink source datastream>" /*Flink source data stream, example messages de-queued from Kafka*/
        , 2 /*Parallelism to use*/);
    ```

Altogether, the code should look something like this:

```java
import com.microsoft.azure.flink.config.KustoConnectionOptions;
import com.microsoft.azure.flink.config.KustoWriteOptions;

KustoConnectionOptions kustoConnectionOptions = KustoConnectionOptions.builder()
.setAppId("<Application ID>")
.setAppKey("<Application key>")
.setTenantId("<Tenant ID>")
.setClusterUrl("<Cluster URI>").build();

KustoWriteOptions kustoWriteOptions = KustoWriteOptions.builder()
    .withDatabase("<Database name>").withTable("<Table name>").build();

KustoWriteSink.builder().setWriteOptions(kustoWriteOptions)
    .setConnectionOptions(kustoConnectionOptions).build("<Flink source datastream>" /*Flink source data stream, example messages de-queued from Kafka*/
    , 2 /*Parallelism to use*/);
```

## Verify that data is ingested into Azure Data Explorer

Once the connection is configured, data is sent to your Azure Data Explorer table. You can verify that the data is ingested by running a query in the [web UI query editor](web-ui-query-overview.md#write-and-run-queries).

1. Run the following query to verify that data is ingested into the table:

    ```Kusto
    <TableName>
    | count
    ```

1. Run the following query to view the data:

    ```Kusto
    <TableName>
    | take 100
    ```

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
