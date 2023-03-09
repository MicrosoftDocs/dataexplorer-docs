---
title: Ingest data in Azure Data Explorer using the Serilog connector
description: Learn how to use the Serilog connector in Azure Data Explorer.
ms.date: 03/02/2023
ms.topic: how-to
ms.reviewer: ramacg
---
# Ingest data with the Serilog connector

Serilog is a popular logging framework for .NET applications. Serilog allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. The Serilog sink for Azure Data Explorer streams your log data to Azure Data Explorer, where you can analyze and visualize your logs in real time.

In this article, you'll use a sample log generator app to show how to configure and use the Serilog connector.

For a complete list of data connectors, see [Data connectors overview](connector-overview.md).

## Prerequisites

* .NET SDK 6.0 or later
* An Azure Data Explorer [cluster and database](create-cluster-database-portal.md)

## Create an Azure AD App registration

Azure Active Directory (Azure AD) application authentication is used for applications that need to access Azure Data Explorer without a user present. To ingest data using the Serilog connector, you need to create and register an Azure AD service principal, and then authorize this principal to ingest data an Azure Data Explorer database.

1. Using your Azure Data Explorer cluster, follow steps 1-7 in [Create an Azure Active Directory application registration in Azure Data Explorer](provision-azure-ad-app.md).
1. Save the following values to be used in later steps:
    * Application (client) ID
    * Directory (tenant) ID
    * Client secret key value

## Grant the Azure AD app permissions

1. In the query tab of the [web UI](https://dataexplorer.azure.com/), connect to your cluster. For more information on how to connect, see [Add clusters](web-query-data.md#add-clusters).
1. Browse to the database in which you want to ingest data.
1. Run the following management command, replacing the placeholders *DatabaseName* and *application ID* with the previously saved values. This command grants the app the [database ingestor](kusto/management/access-control/role-based-access-control.md) role. For more information, see [Manage permissions with management commands](manage-database-permissions.md#manage-permissions-with-management-commands).

    ```kusto
    .add database DatabaseName ingestors ('aadapp=12345-abcd-12a3-b123-ccdd12345a1b') 'Azure Data Explorer App Registration'
    ```

    > [!NOTE]
    > The last parameter is a string that shows up as notes when you query the roles associated with a database. For more information, see [View existing security roles](data-explorer/kusto/management/manage-database-security-roles.md#view-existing-security-roles).

## Create table and mapping

Create a target table for the incoming data, mapping the ingested data columns to the columns in the target table. In the following steps, the table schema and mapping correspond to the data sent from the sample app.

1. In your query editor, run the following [table creation command](kusto/management/create-table-command.md):

    ```kusto
    .create table SerilogTest (Timestamp: datetime, Level: string, Message: string, Exception: string, Properties: dynamic, Position: dynamic, Elapsed: int)
    ```

1. Run the following [ingestion mapping command](kusto/management/create-ingestion-mapping-command.md):

    ```kusto
    .create table SerilogTest ingestion csv mapping 'SerilogTestMapping' '[{"Name":"Timestamp","DataType":"","Ordinal":"0","ConstValue":null},{"Name":"Level","DataType":"","Ordinal":"1","ConstValue":null},{"Name":"Message","DataType":"","Ordinal":"2","ConstValue":null},{"Name":"Exception","DataType":"","Ordinal":"3","ConstValue":null},{"Name":"Properties","DataType":"","Ordinal":"4","ConstValue":null},{"Name":"Position","DataType":"","Ordinal":"5","ConstValue":null},{"Name":"Elapsed","DataType":"","Ordinal":"6","ConstValue":null}]'
    ```

## Clone the Serilog.Sinks.AzureDataExplorer git repo

Clone the Serilog sink's [git repo](https://github.com/Azure/serilog-sinks-azuredataexplorer) using the following git command:

```bash
git clone https://github.com/Azure/serilog-sinks-azuredataexplorer
```

<!-- ## Configure attributes of KustoStrategy

The Serilog sink connector uses a custom strategy that's used in the *RollingFileAppender*. Logs are written into the rolling file to prevent any data loss arising out of network failure while connecting to the Azure Data Explorer cluster. The data is stored in a rolling file and then flushed to the Azure Data Explorer cluster.

In the sample project included in the git repo, the default configuration format is defined in the file log4j2.xml. This configuration file is located under the file path: \azure-kusto-log4j\samples\src\main\resources\log4j2.xml.

The following attributes of KustoStrategy are referenced by the configuration file:

``` xml
<KustoStrategy
   clusterIngestUrl="${env:LOG4J2_ADX_INGEST_CLUSTER_URL}"
   appId="${env:LOG4J2_ADX_APP_ID}"
   appKey="${env:LOG4J2_ADX_APP_KEY}"
   appTenant="${env:LOG4J2_ADX_TENANT_ID}"
   dbName="${env:LOG4J2_ADX_DB_NAME}"
   tableName="log4jTest"
   logTableMapping="log4jCsvTestMapping"
   mappingType="csv"
   flushImmediately="false"
/>
```

> [!IMPORTANT]
> The table name `log4jTest` and mapping name `log4CsvTestMapping` were created in the [above steps](#create-table-and-mapping) for the sample example. If using different table and mapping names, replace these values and save the configuration file.

The configuration file references the following environmental variables:

| Variable | Description |
|---|---|
| LOG4J2_ADX_DB_NAME | Database name. Defined in [Prerequisites](#prerequisites)
| LOG4J2_ADX_TENANT_ID | Tenant ID. Created in [Create an Azure AD App registration](#create-an-azure-ad-app-registration).
| LOG4J2_ADX_INGEST_CLUSTER_URL | Cluster ingestion URI of the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*.
| LOG4J2_ADX_APP_ID | App ID. Created in [Create an Azure AD App registration](#create-an-azure-ad-app-registration).
| LOG4J2_ADX_APP_KEY | App key value. Created in [Create an Azure AD App registration](#create-an-azure-ad-app-registration). -->

### Set environmental variables

Set the following environmental variables manually or using the following commands:

#### [Windows](#tab/windows)

```powershell
$env:ingestionURI="<ingestionURI>"
$env:appId="<appId>"
$env:appKey="<appKey>"
$env:tenant="<tenant>"
$env:databaseName="<databaseName>"
$env:tableName="<tableName>"
```

#### [Mac/Linux](#tab/linux)

```bash
export ingestionURI="<ingestionURI>"
export appId="<appId>"
export appKey="<appKey>"
export tenant="<tenant>"
export databaseName="<databaseName>"
export tableName="<tableName>"
```

---

## Run the sample app

Within your terminal, navigate to the samples folder of the cloned repo and run the following `dotnet` command:

```bash
dotnet build src
```

## Explore the ingested data

You can explore the ingested data with a quick query in the [web UI](https://dataexplorer.azure.com/).

Copy the following query and run it in the context of your target database.

```kusto
log4jTest
| take 10
```

Your output should look similar to the following table:

**Output:**

:::image type="content" source="media/apache-log4j2-connector/take-10-results.png" alt-text="Screenshot of table with take 10 function and results.":::

## See also

* [Data connectors overview](connector-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)