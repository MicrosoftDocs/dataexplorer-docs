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
    > The last parameter is a string that shows up as notes when you query the roles associated with a database. For more information, see [View existing security roles](kusto/management/manage-database-security-roles.md#view-existing-security-roles).

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

## Clone the git repo

Clone the Serilog sink's [git repo](https://github.com/Azure/serilog-sinks-azuredataexplorer) using the following git command:

```bash
git clone https://github.com/Azure/serilog-sinks-azuredataexplorer
```

### Set environmental variables

Set the following environmental variables.

| Variable | Description |
|---|---|
| *IngestionEndPointUri* | The ingest URI for your cluster in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. |
| *DatabaseName* | The case-sensitive name of the target database. |
| *TableName* | The case-sensitive name of an existing target table. For example, **SerilogTest** is the name of the table created in [Create table and mapping](#create-table-and-mapping). |
| *AppId* | Application client ID required for authentication. You saved this value in [Create an Azure AD App registration](#create-an-azure-ad-app-registration). |
| *AppKey* | Application key required for authentication. You saved this value in [Create an Azure AD App registration](#create-an-azure-ad-app-registration). |
| *Tenant* | The ID of the tenant in which the application is registered. You saved this value in [Create an Azure AD App registration](#create-an-azure-ad-app-registration). |
| *BufferBaseFileName* | The base file name for the buffer file. Set this value if you require your logs to be durable against loss resulting connection failures to your cluster. For example, `C:/Temp/Serilog` |

You can set the environment variables manually or using the following commands:

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

## Build the connector

Within your terminal, navigate to the root folder of the cloned repo and run the following `dotnet` command:

```powershell
dotnet build src
```

## Run the sample app

Within your terminal, navigate to the samples folder of the cloned repo and run the following `dotnet` command:

```powershell
dotnet build run
```

## Explore the ingested data

You can explore the ingested data with a quick query in the [web UI](https://dataexplorer.azure.com/).

Copy the following query and run it in the context of your target database.

```kusto
SerilogTest
| take 10
```

**Output:**

Your output should look similar to the following table:

:::image type="content" source="media/serilog-connector/take-10-results.png" alt-text="Screenshot of table with take 10 function and results.":::

## See also

* [Data connectors overview](connector-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)
