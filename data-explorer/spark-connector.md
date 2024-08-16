---
title: Use the Azure Data Explorer connector for Apache Spark to move data between Azure Data Explorer and Spark clusters.
description: This topic shows you how to move data between Azure Data Explorer and Apache Spark clusters.
ms.reviewer: ohbitton
ms.topic: how-to
ms.date: 04/19/2021
---

# Azure Data Explorer Connector for Apache Spark

[Apache Spark](https://spark.apache.org/) is a unified analytics engine for large-scale data processing. Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data.

The Kusto connector for Spark is an [open source project](https://github.com/Azure/azure-kusto-spark) that can run on any Spark cluster. It implements data source and data sink for moving data across Azure Data Explorer and Spark clusters. Using Azure Data Explorer and Apache Spark, you can build fast and scalable applications targeting data driven scenarios. For example, machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics. With the connector, Azure Data Explorer becomes a valid data store for standard Spark source and sink operations, such as write, read, and writeStream.

You can write to Azure Data Explorer via queued ingestion or streaming ingestion. Reading from Azure Data Explorer supports column pruning and predicate pushdown, which filters the data in Azure Data Explorer, reducing the volume of transferred data.

> [!NOTE]
> For information about working with the Synapse Spark connector for Azure Data Explorer, see [Connect to Azure Data Explorer using Apache Spark for Azure Synapse Analytics](/azure/synapse-analytics/quickstart-connect-azure-data-explorer).

This topic describes how to install and configure the Azure Data Explorer Spark connector and move data between Azure Data Explorer and Apache Spark clusters.

> [!NOTE]
> Although some of the examples below refer to an [Azure Databricks](/azure/databricks/) Spark cluster, Azure Data Explorer Spark connector does not take direct dependencies on Databricks or any other Spark distribution.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* A Spark cluster
* Install connector library:
    * Pre-built libraries for [Spark 2.4+Scala 2.11 or Spark 3+scala 2.12](https://github.com/Azure/azure-kusto-spark/releases) 
    * [Maven repo](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/spark-kusto-connector)
* [Maven 3.x](https://maven.apache.org/download.cgi) installed

> [!TIP]
> Spark 2.3.x versions are also supported, but may require some changes in pom.xml dependencies.

[!INCLUDE [ingest-data-spark](includes/cross-repo/ingest-data-spark.md)]

## Related content

* [Kusto Spark Connector GitHub repository](https://github.com/Azure/azure-kusto-spark/tree/master/docs)
* See the [sample code for Scala and Python](https://github.com/Azure/azure-kusto-spark/tree/master/samples/src/main)
