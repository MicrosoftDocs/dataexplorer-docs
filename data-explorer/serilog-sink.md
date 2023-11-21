---
title: Ingest data with the Serilog sink into Azure Data Explorer
description: Learn how to use the Azure Data Explorer Serilog sink to ingest data into your cluster.
ms.date: 03/15/2023
ms.topic: how-to
ms.reviewer: ramacg
---
# Ingest data with the Serilog sink into Azure Data Explorer

[!INCLUDE [real-time-analytics-connectors-note](includes/real-time-analytics-connectors-note.md)]

Serilog is a popular logging framework for .NET applications. Serilog allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. The Serilog sink, also known as an appender, for Azure Data Explorer streams your log data to Azure Data Explorer, where you can analyze and visualize your logs in real time.

In this article, you'll learn how to:

> [!div class="checklist"]
>
> * [Set up your environment](#set-up-your-environment)
> * [Add the Serilog sink to your app](#add-the-serilog-sink-to-your-app)
> * [Run the sample app](#run-the-sample-app)

For a complete list of data connectors, see [Data connectors overview](connector-overview.md).

## Prerequisites

* .NET SDK 6.0 or later
* An Azure Data Explorer [cluster and database](create-cluster-and-database.md)

## Set up your environment

In this section, you'll prepare your environment to use the Serilog sink.

### Install the package

Add the [Serilog.Sinks.AzureDataExplorer](https://www.nuget.org/packages/serilog.sinks.azuredataexplorer) NuGet package. Use the Install-Package command specifying the name of the NuGet package.

```powershell
Install-Package Serilog.Sinks.AzureDataExplorer
```

<a name='create-an-azure-ad-app-registration'></a>

### Create a Microsoft Entra app registration

Microsoft Entra application authentication is used for applications that need to access Azure Data Explorer without a user present. To ingest data using the Serilog connector, you need to create and register a Microsoft Entra service principal, and then authorize this principal to ingest data an Azure Data Explorer database.

1. Using your Azure Data Explorer cluster, follow steps 1-7 in [Create a Microsoft Entra application registration in Azure Data Explorer](provision-azure-ad-app.md).
1. Save the following values to be used in later steps:
    * Application (client) ID
    * Directory (tenant) ID
    * Client secret key value

<a name='grant-the-azure-ad-app-permissions'></a>

### Grant the Microsoft Entra app permissions

1. In the query tab of the [web UI](https://dataexplorer.azure.com/), connect to your cluster. For more information on how to connect, see [Add clusters](web-query-data.md#add-clusters).
1. Browse to the database in which you want to ingest data.
1. Run the following management command, replacing the placeholders. Replace *DatabaseName* with the name of the target database and *ApplicationID* with the previously saved value. This command grants the app the [database ingestor](kusto/access-control/role-based-access-control.md) role. For more information, see [Manage database security roles](kusto/management/manage-database-security-roles.md).

    ```kusto
    .add database <DatabaseName> ingestors ('aadapp=<ApplicationID>') 'Azure Data Explorer App Registration'
    ```

    > [!NOTE]
    > The last parameter is a string that shows up as notes when you query the roles associated with a database. For more information, see [View existing security roles](kusto/management/manage-database-security-roles.md#show-existing-security-roles).

### Create a table and ingestion mapping

Create a target table for the incoming data, mapping the ingested data columns to the columns in the target table. In the following steps, the table schema and mapping correspond to the data sent from the sample app.

1. In your query editor, run the following [table creation command](kusto/management/create-table-command.md), replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    .create table <TableName> (Timestamp: datetime, Level: string, Message: string, Exception: string, Properties: dynamic, Position: dynamic, Elapsed: int)
    ```

1. Run the following [ingestion mapping command](kusto/management/create-ingestion-mapping-command.md), replacing the placeholders *TableName* with the target table name and *TableNameMapping* with the name of the ingestion mapping:

    ```kusto
    .create table <TableName> ingestion csv mapping '<TableNameMapping>' '[{"Name":"Timestamp","DataType":"","Ordinal":"0","ConstValue":null},{"Name":"Level","DataType":"","Ordinal":"1","ConstValue":null},{"Name":"Message","DataType":"","Ordinal":"2","ConstValue":null},{"Name":"Exception","DataType":"","Ordinal":"3","ConstValue":null},{"Name":"Properties","DataType":"","Ordinal":"4","ConstValue":null},{"Name":"Position","DataType":"","Ordinal":"5","ConstValue":null},{"Name":"Elapsed","DataType":"","Ordinal":"6","ConstValue":null}]'
    ```

## Add the Serilog sink to your app

Use the following steps to:

* Add the Serilog sink to your app
* Configure the variables used by the sink
* Build and run the app

1. Add the following code to your app:

    ```csharp
    using Serilog.Sinks.AzureDataExplorer;
    ```

1. Configure the Serilog sink, replacing placeholders using the information in the table that follows:

    ```csharp
    var log = new LoggerConfiguration()
    .WriteTo.AzureDataExplorer(new AzureDataExplorerSinkOptions
    {
        IngestionEndpointUri = "<cluster>",
        DatabaseName = "<MyDatabase>",
        TableName = "<MyTable>",
        BufferBaseFileName = "<BufferBaseFileName>"
    })
    .CreateLogger();
    ```

    | Variable | Description |
    |---|---|
    | *IngestionEndPointUri* | The ingest URI for your cluster in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. |
    | *DatabaseName* | The case-sensitive name of the target database. |
    | *TableName* | The case-sensitive name of an existing target table. For example, **SerilogTest** is the name of the table created in [Create a table and ingestion mapping](#create-a-table-and-ingestion-mapping). |
    | *AppId* | The application client ID required for authentication. You saved this value in [Create a Microsoft Entra App registration](#create-an-azure-ad-app-registration). |
    | *AppKey* | The application key required for authentication. You saved this value in [Create a Microsoft Entra App registration](#create-an-azure-ad-app-registration). |
    | *Tenant* | The ID of the tenant in which the application is registered. You saved this value in [Create a Microsoft Entra App registration](#create-an-azure-ad-app-registration). |
    | *BufferBaseFileName* | Optional base file name for the buffer file. Set this value if you require your logs to be durable against loss resulting connection failures to your cluster. For example, `C:/Temp/Serilog`. |

    For more options, see [Sink Options](https://github.com/Azure/serilog-sinks-azuredataexplorer#options).

1. Send data to Azure Data Explorer using the Serilog sink. For example:

    ```csharp
    log.Verbose("Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    log.Information("Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    log.Warning("Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    log.Error(new Exception(), "Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    log.Debug("Processed {@Position} in {Elapsed:000} ms. ", position, elapsedMs);
    ```

1. Build and run the app. For example, if you are using Visual Studio, press F5.

1. Verify that the data is in your cluster. In the [web UI](https://dataexplorer.azure.com/), run the following query replacing the placeholder with the name of the table that used earlier:

    ```kusto
    <TableName>
    | take 10
    ```

## Run the sample app

Use the sample log generator app as an example showing how to configure and use the Serilog sink.

1. Clone the Serilog sink's [git repo](https://github.com/Azure/serilog-sinks-azuredataexplorer) using the following git command:

    ```powershell
    git clone https://github.com/Azure/serilog-sinks-azuredataexplorer
    ```

1. Set the following environmental variables to configure the Serilog sink:

    | Variable | Description |
    |---|---|
    | *IngestionEndPointUri* | The ingest URI for your cluster in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. |
    | *DatabaseName* | The case-sensitive name of the target database. |
    | *TableName* | The case-sensitive name of an existing target table. For example, **SerilogTest** is the name of the table created in [Create a table and ingestion mapping](#create-a-table-and-ingestion-mapping). |
    | *AppId* | Application client ID required for authentication. You saved this value in [Create a Microsoft Entra App registration](#create-an-azure-ad-app-registration). |
    | *AppKey* | Application key required for authentication. You saved this value in [Create a Microsoft Entra App registration](#create-an-azure-ad-app-registration). |
    | *Tenant* | The ID of the tenant in which the application is registered. You saved this value in [Create a Microsoft Entra App registration](#create-an-azure-ad-app-registration). |
    | *BufferBaseFileName* | The base file name for the buffer file. Set this value if you require your logs to be durable against loss resulting connection failures to your cluster. For example, `C:/Temp/Serilog` |

    You can set the environment variables manually or using the following commands:

    ### [Windows](#tab/windows)

    ```powershell
    $env:ingestionURI="<ingestionURI>"
    $env:appId="<appId>"
    $env:appKey="<appKey>"
    $env:tenant="<tenant>"
    $env:databaseName="<databaseName>"
    $env:tableName="<tableName>"
    ```

    ### [Mac/Linux](#tab/linux)

    ```bash
    export ingestionURI="<ingestionURI>"
    export appId="<appId>"
    export appKey="<appKey>"
    export tenant="<tenant>"
    export databaseName="<databaseName>"
    export tableName="<tableName>"
    ```

    ---

1. In your terminal, navigate to the root folder of the cloned repo and run the following .NET command to build the app:

    ```powershell
    dotnet build src
    ```

1. In your terminal, navigate to the samples folder and run the following .NET command to run the app:

    ```powershell
    dotnet build run
    ```

1. In the [web UI](https://dataexplorer.azure.com/), select the target database, and run the following query to explore the ingested data, replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    <TableName>
    | take 10
    ```

    Your output should look similar to the following image:

    :::image type="content" lightbox="media/serilog-connector/take-10-results.png" source="media/serilog-connector/take-10-results.png" alt-text="Screenshot of table with take 10 function and results.":::

## Related content

* [Data connectors overview](connector-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)
