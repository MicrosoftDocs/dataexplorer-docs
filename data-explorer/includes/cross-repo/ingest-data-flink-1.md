---
ms.topic: include
ms.date: 02/15/2024
---

[Apache Flink](https://flink.apache.org/) is a framework and distributed processing engine for stateful computations over unbounded and bounded data streams.

The Flink connector is an [open source project](https://github.com/Azure/flink-connector-kusto/tree/main) that can run on any Flink cluster. It implements data sink for moving data from a Flink cluster. Using the connector to Apache Flink, you can build fast and scalable applications targeting data driven scenarios, for example, machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics.

In this article, you learn how to use the Flink connector to send data from Flink to your table. You create a table and data mapping, direct Flink to send data into the table, and then validate the results.

## Prerequisites

* An Azure Data Explorer cluster and database. [Create a cluster and database](/azure/data-explorer/create-cluster-and-database) **or** a [KQL database in Real-Time Analytics in Microsoft Fabric](/fabric/real-time-analytics/create-database).
* A target table in your database. See [Create a table in Azure Data Explorer](/azure/data-explorer/create-table-wizard) or [Create a table in Real-Time Analytics](/fabric/real-time-analytics/create-empty-table)
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