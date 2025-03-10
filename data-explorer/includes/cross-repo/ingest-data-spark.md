---
ms.topic: include
ms.date: 03/09/2025
---
## How to build the Spark connector

Starting version 2.3.0 we introduce new artifact Ids replacing spark-kusto-connector: [kusto-spark_3.0_2.12](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-spark_3.0_2.12/2.3.0) targeting Spark 3.x and Scala 2.12.

> [!NOTE]
> Versions prior to 2.5.1 do not work anymore for ingest to an existing table, please update to a later version.
> This step is optional. If you are using pre-built libraries, for example, Maven, see [Spark cluster setup](#spark-cluster-setup).

### Build prerequisites

1. Refer to [this source](https://github.com/Azure/azure-kusto-spark) for building the Spark Connector.

1. For Scala/Java applications using Maven project definitions, link your application with the latest artifact. Find the latest artifact on [Maven Central](https://search.maven.org/artifact/com.microsoft.azure.kusto/kusto-spark_3.0_2.12).

    ```xml
    For more information, see [https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-spark_3.0_2.12](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-spark_3.0_2.12).

1. If you aren't using prebuilt libraries, you need to install the libraries listed in [dependencies](https://github.com/Azure/azure-kusto-spark#dependencies) including the following [Kusto Java SDK](/azure/data-explorer/kusto/api/java/kusto-java-client-library) libraries. To find the right version to install, [look in the relevant release's pom](https://github.com/Azure/azure-kusto-spark/releases):
    * [Kusto Data Client](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-data)
    * [Kusto Ingest Client](https://mvnrepository.com/artifact/com.microsoft.azure.kusto/kusto-ingest)

    1. To build jar and run all tests:
    
        ```Maven
        mvn clean package -DskipTests
        ```
    
    1. To build jar, run all tests, and install jar to your local Maven repository:

        ```Maven
        mvn clean install -DskipTests
        ```
        
For more information, see [connector usage](https://github.com/Azure/azure-kusto-spark#usage).

## Spark cluster setup

> [!NOTE]
> It's recommended to use the latest Kusto Spark connector release when performing the following steps.

1. Configure the following Spark cluster settings, based on Azure Databricks cluster Spark 3.0.1 and Scala 2.12:

    ![Databricks cluster settings.](/azure/data-explorer/includes/media/ingest-data-spark/databricks-cluster.png)

1. Install the latest spark-kusto-connector library from Maven:

    ![Import libraries.](/azure/data-explorer/includes/media/ingest-data-spark/db-libraries-view.png)
    ![Select Spark-Kusto-Connector.](/azure/data-explorer/includes/media/ingest-data-spark/db-dependencies.png)

1. Verify that all required libraries are installed:

    ![Verify libraries installed.](/azure/data-explorer/includes/media/ingest-data-spark/db-libraries-view.png)

1. For installation using a JAR file, verify that other dependencies were installed:

    ![Add dependencies.](/azure/data-explorer/includes/media/ingest-data-spark/db-not-maven.png)

## Authentication

Kusto Spark connector enables you to authenticate with Microsoft Entra ID using one of the following methods:

* An [Microsoft Entra application](#microsoft-entra-application-authentication)
* An [Microsoft Entra access token](https://github.com/Azure/azure-kusto-spark/blob/master/docs/Authentication.md#direct-authentication-with-access-token)
* [Device authentication](https://github.com/Azure/azure-kusto-spark/blob/master/docs/Authentication.md#device-authentication) (for nonproduction scenarios)
* An [Azure Key Vault](https://github.com/Azure/azure-kusto-spark/blob/master/docs/Authentication.md#key-vault)
    To access the Key Vault resource, install the azure-keyvault package and provide application credentials.

### Microsoft Entra application authentication

Microsoft Entra application authentication is the simplest and most common authentication method and is recommended for the Kusto Spark connector.

[!INCLUDE [entra-service-principal](../entra-service-principal.md)]

The Spark connector uses the following Entra app properties for authentication:

| Properties | Option String | Description |
|--|--|--|
| **KUSTO_AAD_APP_ID** | kustoAadAppId | Microsoft Entra application (client) identifier. |
| **KUSTO_AAD_AUTHORITY_ID** | kustoAadAuthorityID | Microsoft Entra authentication authority. Microsoft Entra Directory (tenant) ID. Optional - defaults to microsoft.com. For more information, see [Microsoft Entra authority](/azure/active-directory/develop/msal-client-application-configuration#authority). |
| **KUSTO_AAD_APP_SECRET** | kustoAadAppSecret | Microsoft Entra application key for the client. |
| **KUSTO_ACCESS_TOKEN** | kustoAccessToken | If you already have an accessToken that is created with access to Kusto, that can be used passed to the connector as well for authentication.

> [!NOTE]
> Older API versions (less than 2.0.0) have the following naming: "kustoAADClientID", "kustoClientAADClientPassword", "kustoAADAuthorityID"

### Kusto privileges

Grant the following privileges on the kusto side based on the Spark operation you wish to perform.

| Spark operation                                                    | Privileges |
| ------------------------------------------------------------------ | ---------- |
| Read - Single Mode                                                 | Reader     |
| Read – Force Distributed Mode                                      | Reader     |
| Write – Queued Mode with CreateTableIfNotExist table create option | Admin      |
| Write – Queued Mode with FailIfNotExist table create option        | Ingestor   |
| Write – TransactionalMode                                          | Admin      |

For more information on principal roles, see [role-based access control](/azure/data-explorer/kusto/access-control/role-based-access-control). For managing security roles, see [security roles management](/azure/data-explorer/kusto/management/security-roles).

## Spark sink: writing to Kusto

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

1. Write Spark DataFrame to Kusto cluster as batch:

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
    
    // Optional, for any extra options:
    val conf: Map[String, String] = Map()

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
    
    // As an alternative to adding .option by .option, you can provide a map:
    val conf: Map[String, String] = Map(
      KustoSinkOptions.KUSTO_CLUSTER -> cluster,
      KustoSinkOptions.KUSTO_TABLE -> table,
      KustoSinkOptions.KUSTO_DATABASE -> database,
      KustoSourceOptions.KUSTO_ACCESS_TOKEN -> accessToken)
     
    // Write to a Kusto table from a streaming source
    val kustoQ = df
      .writeStream
      .format("com.microsoft.kusto.spark.datasink.KustoSinkProvider")
      .options(conf)
      .trigger(Trigger.ProcessingTime(TimeUnit.SECONDS.toMillis(10))) // Sync this with the ingestionBatching policy of the database
      .start()
    ```

## Spark source: reading from Kusto

1. When reading [small amounts of data](/azure/data-explorer/kusto/concepts/querylimits), define the data query:

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

1. Optional: If **you** provide the transient blob storage (and not Kusto) the blobs are created under the caller's responsibility. This includes provisioning the storage, rotating access keys, and deleting transient artifacts.
    The KustoBlobStorageUtils module contains helper functions for deleting blobs based on either account and container coordinates and account credentials, or a full SAS URL with write, read, and list permissions. When the corresponding RDD is no longer needed, each transaction stores transient blob artifacts in a separate directory. This directory is captured as part of read-transaction information logs reported on the Spark Driver node.

    ```scala
    // Use either container/account-key/account name, or container SaS
    val container = dbutils.secrets.get(scope = "KustoDemos", key = "blobContainer")
    val storageAccountKey = dbutils.secrets.get(scope = "KustoDemos", key = "blobStorageAccountKey")
    val storageAccountName = dbutils.secrets.get(scope = "KustoDemos", key = "blobStorageAccountName")
    // val storageSas = dbutils.secrets.get(scope = "KustoDemos", key = "blobStorageSasUrl")
    ```

    In the example above, the Key Vault isn't accessed using the connector interface; a simpler method of using the Databricks secrets is used.

1. Read from Kusto.

    * If **you** provide the transient blob storage, read from Kusto as follows:

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

    * If **Kusto** provides the transient blob storage, read from Kusto as follows:

        ```scala
        val conf3 = Map(
          KustoSourceOptions.KUSTO_AAD_CLIENT_ID -> appId,
          KustoSourceOptions.KUSTO_AAD_CLIENT_PASSWORD -> appKey)
        val df2 = spark.read.kusto(cluster, database, "ReallyBigTable", conf3)
        
        val dfFiltered = df2
          .where(df2.col("ColA").startsWith("row-2"))
          .filter("ColB > 12")
          .filter("ColB <= 21")
          .select("ColA")
        
        display(dfFiltered)
        ```