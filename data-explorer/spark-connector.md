---
title: Use the Azure Data Explorer connector for Apache Spark to move data between Azure Data Explorer and Spark clusters.
description: This topic shows you how to move data between Azure Data Explorer and Apache Spark clusters.
author: orspod
ms.author: orspodek
ms.reviewer: maraheja
ms.service: data-explorer
ms.topic: conceptual
ms.date: 7/29/2020
---

# Azure Data Explorer Connector for Apache Spark

[Apache Spark](https://spark.apache.org/) is a unified analytics engine for large-scale data processing. Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data. 

The Azure Data Explorer connector for Spark is an [open source project](https://github.com/Azure/azure-kusto-spark) that can run on any Spark cluster. It implements data source and data sink for moving data across Azure Data Explorer and Spark clusters. Using Azure Data Explorer and Apache Spark, you can build fast and scalable applications targeting data driven scenarios. For example, machine learning (ML), Extract-Transform-Load (ETL), and Log Analytics. With the connector, Azure Data Explorer becomes a valid data store for standard Spark source and sink operations, such as write, read, and writeStream.

You can write to Azure Data Explorer in either batch or streaming mode. Reading from Azure Data Explorer supports column pruning and predicate pushdown, which filters the data in Azure Data Explorer, reducing the volume of transferred data.

This topic describes how to install and configure the Azure Data Explorer Spark connector and move data between Azure Data Explorer and Apache Spark clusters.

> [!NOTE]
> Although some of the examples below refer to an [Azure Databricks](https://docs.azuredatabricks.net/) Spark cluster, Azure Data Explorer Spark connector does not take direct dependencies on Databricks or any other Spark distribution.

## Prerequisites

* [Create an Azure Data Explorer cluster and database](create-cluster-database-portal.md) 
* Create a Spark cluster
* Install Azure Data Explorer connector library:
    * Pre-built libraries for [Spark 2.4, Scala 2.11](https://github.com/Azure/azure-kusto-spark/releases) 
    * [Maven repo](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/spark-kusto-connector)
* [Maven 3.x](https://maven.apache.org/download.cgi) installed

> [!TIP]
> 2.3.x versions are also supported, but may require some changes in pom.xml dependencies.

## How to build the Spark connector

> [!NOTE]
> This step is optional. If you are using pre-built libraries go to [Spark cluster setup](#spark-cluster-setup).

### Build prerequisites

1. Install the libraries listed in [dependencies](https://github.com/Azure/azure-kusto-spark#dependencies) including the following [Kusto Java SDK](kusto/api/java/kusto-java-client-library.md) libraries:
    * [Kusto Data Client](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-data)
    * [Kusto Ingest Client](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-ingest)

1. Refer to [this source](https://github.com/Azure/azure-kusto-spark) for building the Spark Connector.

1. For Scala/Java applications using Maven project definitions, link your application with the following artifact (latest version may differ):
    
    ```Maven
       <dependency>
         <groupId>com.microsoft.azure</groupId>
         <artifactId>spark-kusto-connector</artifactId>
         <version>1.1.0</version>
       </dependency>
    ```

### Build commands

To build jar and run all tests:

```
mvn clean package
```

To build jar, run all tests, and install jar to your local Maven repository:

```
mvn clean install
```

For more information, see [connector usage](https://github.com/Azure/azure-kusto-spark#usage).

## Spark cluster setup

> [!NOTE]
> It's recommended to use the latest Azure Data Explorer Spark connector release when performing the following steps.

1. Configure the following Spark cluster settings, based on Azure Databricks cluster using Spark 2.4.4 and Scala 2.11:

    ![Databricks cluster settings](media/spark-connector/databricks-cluster.png)
    
1. Install the latest spark-kusto-connector library from Maven:
    
    ![Import libraries](media/spark-connector/db-libraries-view.png)
    ![Select Spark-Kusto-Connector](media/spark-connector/db-dependencies.png)

1. Verify that all required libraries are installed:

    ![Verify libraries installed](media/spark-connector/db-libraries-view.png)

1. For installation using a JAR file, verify that additional dependencies were installed:

    ![Add dependencies](media/spark-connector/db-not-maven.png)

## Authentication

Azure Data Explorer Spark connector enables you to authenticate with Azure Active Directory (Azure AD) using one of the following methods:
* An [Azure AD application](#azure-ad-application-authentication)
* An [Azure AD access token](https://github.com/Azure/azure-kusto-spark/blob/master/docs/Authentication.md#direct-authentication-with-access-token)
* [Device authentication](https://github.com/Azure/azure-kusto-spark/blob/master/docs/Authentication.md#device-authentication) (for non-production scenarios)
* An [Azure Key Vault](https://github.com/Azure/azure-kusto-spark/blob/master/docs/Authentication.md#key-vault) 
    To access the Key Vault resource, install the azure-keyvault package and provide application credentials.

### Azure AD application authentication

Azure AD application authentication is the simplest and most common authentication method and is recommended for the Azure Data Explorer Spark connector.

|Properties  |Option String  |Description  |
|---------|---------|---------|
|**KUSTO_AAD_APP_ID**     |kustoAadAppId     |   Azure AD application (client) identifier.      |
|**KUSTO_AAD_AUTHORITY_ID**     |kustoAadAuthorityID     |  Azure AD authentication authority. Azure AD Directory (tenant) ID.        |
|**KUSTO_AAD_APP_SECRET**    |kustoAadAppSecret     |    Azure AD application key for the client.     |

> [!NOTE]
> Older API versions (less than 2.0.0) have the following naming: "kustoAADClientID", "kustoClientAADClientPassword", "kustoAADAuthorityID"

### Azure Data Explorer privileges

Grant the following privileges on an Azure Data Explorer cluster:

* For reading (data source), the Azure AD identity must have *viewer* privileges on the target database, or *admin* privileges on the target table.
* For writing (data sink), the Azure AD identity must have *ingestor* privileges on the target database. It must also have *user* privileges on the target database to create new tables. If the target table already exists, you must configure *admin* privileges on the target table.
 
For more information on Azure Data Explorer principal roles, see [role-based authorization](kusto/management/access-control/role-based-authorization.md). For managing security roles, see [security roles management](kusto/management/security-roles.md).

## Spark sink: writing to Azure Data Explorer

1. Set up sink parameters:

     ```scala
    val KustoSparkTestAppId = dbutils.secrets.get(scope = "KustoDemos", key = "KustoSparkTestAppId")
    val KustoSparkTestAppKey = dbutils.secrets.get(scope = "KustoDemos", key = "KustoSparkTestAppKey")
 
    val appId = KustoSparkTestAppId
    val appKey = KustoSparkTestAppKey
    val authorityId = "72f988bf-86f1-41af-91ab-2d7cd011db47" // Optional - defaults to microsoft.com
    val cluster = "Sparktest.eastus2"
    val database = "TestDb"
    val table = "StringAndIntTable"
    ```

1. Write Spark DataFrame to Azure Data Explorer cluster as batch:

    ```scala
    import com.microsoft.kusto.spark.datasink.KustoSinkOptions
    import org.apache.spark.sql.{SaveMode, SparkSession}

    df.write
      .format("com.microsoft.kusto.spark.datasource")
      .option(KustoSinkOptions.KUSTO_CLUSTER, cluster)
      .option(KustoSinkOptions.KUSTO_DATABASE, database)
      .option(KustoSinkOptions.KUSTO_TABLE, "Demo3_spark")
      .option(KustoSinkOptions.KUSTO_AAD_APP_ID, appId)
      .option(KustoSinkOptions.KUSTO_AAD_APP_SECRET, appKey)
      .option(KustoSinkOptions.KUSTO_AAD_AUTHORITY_ID, authorityId)
      .option(KustoSinkOptions.KUSTO_TABLE_CREATE_OPTIONS, "CreateIfNotExist")
      .mode(SaveMode.Append)
      .save()  
    ```
    
   Or use the simplified syntax:
   
    ```scala
         import com.microsoft.kusto.spark.datasink.SparkIngestionProperties
         import com.microsoft.kusto.spark.sql.extension.SparkExtension._
         
         val sparkIngestionProperties = Some(new SparkIngestionProperties()) // Optional, use None if not needed
         df.write.kusto(cluster, database, table, conf, sparkIngestionProperties)
    ```
   
1. Write streaming data:

    ```scala    
    import org.apache.spark.sql.streaming.Trigger
    import java.util.concurrent.TimeUnit
    import java.util.concurrent.TimeUnit
    import org.apache.spark.sql.streaming.Trigger

    // Set up a checkpoint and disable codeGen. 
    spark.conf.set("spark.sql.streaming.checkpointLocation", "/FileStore/temp/checkpoint")
        
    // Write to a Kusto table from a streaming source
    val kustoQ = df
          .writeStream
          .format("com.microsoft.kusto.spark.datasink.KustoSinkProvider")
          .options(conf) 
          .option(KustoSinkOptions.KUSTO_WRITE_ENABLE_ASYNC, "true") // Optional, better for streaming, harder to handle errors
          .trigger(Trigger.ProcessingTime(TimeUnit.SECONDS.toMillis(10))) // Sync this with the ingestionBatching policy of the database
          .start()
    ```

## Spark source: reading from Azure Data Explorer

1. When reading [small amounts of data](kusto/concepts/querylimits.md), define the data query:

    ```scala
    import com.microsoft.kusto.spark.datasource.KustoSourceOptions
    import org.apache.spark.SparkConf
    import org.apache.spark.sql._
    import com.microsoft.azure.kusto.data.ClientRequestProperties

    val query = s"$table | where (ColB % 1000 == 0) | distinct ColA"
    val conf: Map[String, String] = Map(
          KustoSourceOptions.KUSTO_AAD_APP_ID -> appId,
          KustoSourceOptions.KUSTO_AAD_APP_SECRET -> appKey
        )

    val df = spark.read.format("com.microsoft.kusto.spark.datasource").
      options(conf).
      option(KustoSourceOptions.KUSTO_QUERY, query).
      option(KustoSourceOptions.KUSTO_DATABASE, database).
      option(KustoSourceOptions.KUSTO_CLUSTER, cluster).
      load()

    // Simplified syntax flavor
    import com.microsoft.kusto.spark.sql.extension.SparkExtension._
    
    val cpr: Option[ClientRequestProperties] = None // Optional
    val df2 = spark.read.kusto(cluster, database, query, conf, cpr)
    display(df2)
    ```

1. Optional: If **you** provide the transient blob storage (and not Azure Data Explorer) the blobs are created are under the caller's responsibility. This includes provisioning the storage, rotating access keys, and deleting transient artifacts. 
    The KustoBlobStorageUtils module contains helper functions for deleting blobs based on either account and container coordinates and account credentials, or a full SAS URL with write, read and list permissions. When the corresponding RDD is no longer needed, each transaction stores transient blob artifacts in a separate directory. This directory is captured as part of read-transaction information logs reported on the Spark Driver node.

    ```scala
    // Use either container/account-key/account name, or container SaS
    val container = dbutils.secrets.get(scope = "KustoDemos", key = "blobContainer")
    val storageAccountKey = dbutils.secrets.get(scope = "KustoDemos", key = "blobStorageAccountKey")
    val storageAccountName = dbutils.secrets.get(scope = "KustoDemos", key = "blobStorageAccountName")
    // val storageSas = dbutils.secrets.get(scope = "KustoDemos", key = "blobStorageSasUrl")
    ```

    In the example above, the Key Vault isn't accessed using the connector interface; a simpler method of using the Databricks secrets is used.

1. Read from Azure Data Explorer.

    * If **you** provide the transient blob storage, read from Azure Data Explorer as follows:

        ```scala
         val conf3 = Map(
              KustoSourceOptions.KUSTO_AAD_APP_ID -> appId,
              KustoSourceOptions.KUSTO_AAD_APP_SECRET -> appKey
              KustoSourceOptions.KUSTO_BLOB_STORAGE_SAS_URL -> storageSas)
        val df2 = spark.read.kusto(cluster, database, "ReallyBigTable", conf3)
        
        val dfFiltered = df2
          .where(df2.col("ColA").startsWith("row-2"))
          .filter("ColB > 12")
          .filter("ColB <= 21")
          .select("ColA")
        
        display(dfFiltered)
        ```

    * If **Azure Data Explorer** provides the transient blob storage, read from Azure Data Explorer as follows:
    
        ```scala
        val dfFiltered = df2
          .where(df2.col("ColA").startsWith("row-2"))
          .filter("ColB > 12")
          .filter("ColB <= 21")
          .select("ColA")
        
        display(dfFiltered)
        ```

## Next steps

* Learn more about the [Azure Data Explorer Spark Connector](https://github.com/Azure/azure-kusto-spark/tree/master/docs)
* [Sample code for Java and Python](https://github.com/Azure/azure-kusto-spark/tree/master/samples/src/main)
