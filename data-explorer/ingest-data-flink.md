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

## Install the Azure Data Explorer Flink connector

## Configure the connector to send data to Azure Data Explorer

## Verify that data is ingested into Azure Data Explorer

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
