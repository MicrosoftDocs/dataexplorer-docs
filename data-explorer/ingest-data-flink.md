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

## Authentication

Authenticate from Flink to your Azure Data Explorer cluster with either a Microsoft Entra ID application or a managed identity.

### [Application](#tab/application)

To use application authentication:

1. In the Azure portal, [create a Microsoft Entra application registration](provision-entra-id-app.md). Alternatively, you can [programatically create a Microsoft Entra service principal](provision-entra-id-app.md#programatically-create-a-microsoft-entra-service-principal). Save the application ID, application key, and tenant ID. 

2. Within Azure Data Explorer, grant the application *at least* database user with table ingestor permissions:

    ```kusto
    // Grant database user permissions
    .add database <MyDatabase> users ('aadapp=<Application ID>;<Tenant ID>')

    // Grant table ingestor permissions
    .add table <MyTable> ingestors ('aadapp=<Application ID>;<Tenant ID>')
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

2. Within Azure Data Explorer, grant the managed identity *at least* database user with table ingestor permissions:

    ```kusto
    // Grant database user permissions
    .add database <MyDatabase> users ('aadapp=<Object ID>;<Tenant ID>')

    // Grant table ingestor permissions
    .add table <MyTable> ingestors ('aadapp=<Object ID>;<Tenant ID>')
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

## Grant permissions to your database

Grant the following privileges on an Azure Data Explorer cluster:

For reading (data source), the Microsoft Entra identity must have viewer privileges on the target database, or admin privileges on the target table.
For writing (data sink), the Microsoft Entra identity must have ingestor privileges on the target database. It must also have user privileges on the target database to create new tables. If the target table already exists, you must configure admin privileges on the target table.
For more information on Azure Data Explorer principal roles, see role-based access control. For managing security roles, see security roles management.


## Verify that data is ingested into Azure Data Explorer

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
