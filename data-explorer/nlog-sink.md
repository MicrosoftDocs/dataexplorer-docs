---
title: Ingest data with the NLog sink into Azure Data Explorer
description: Learn how to use the Azure Data Explorer NLog connector to ingest data into your cluster.
ms.date: 05/09/2023
ms.topic: how-to
ms.reviewer: ramacg
---
# Ingest data with the NLog sink into Azure Data Explorer

[!INCLUDE [real-time-analytics-connectors--note](includes/real-time-analytics-connectors--note.md)]

NLog is a flexible and free logging platform for various .NET platforms, including .NET standard. NLog allows you to write to several targets, such as a database, file, or console. With NLog, you can change the logging configuration on-the-fly. The NLog sink is a target for NLog that allows you to send your log messages to an Azure Data Explorer cluster. The plugin is built on top of the Azure-Kusto-Data library and provides an efficient way to sink your logs to your cluster.

In this article, you'll learn how to:

> [!div class="checklist"]
>
> * [Set up your environment](#set-up-your-environment)
> * [Add the Azure Data Explorer target configuration to your app](#add-the-azure-data-explorer-target-configuration-to-your-app)
> * [Run the sample app](#run-the-sample-app)

For a complete list of data connectors, see [Data connectors overview](connector-overview.md).

## Prerequisites

* .NET SDK 6.0 or later
* An Azure Data Explorer [cluster and database](create-cluster-and-database.md)

## Set up your environment

In this section, you'll prepare your environment to use the NLog connector.

### Install the package

Add the [NLog.Azure.Kusto](https://aka.ms/adx-docs-nlog-nuget) NuGet package. Use the Install-Package command specifying the name of the NuGet package.

```powershell
Install-Package NLog.Azure.Kusto
```

### Create an Azure AD app registration

Azure Active Directory (Azure AD) application authentication is used for applications that need to access Azure Data Explorer without a user present. To ingest data using the NLog connector, you need to create and register an Azure AD service principal, and then authorize this principal to ingest data an Azure Data Explorer database.

1. Using your Azure Data Explorer cluster, follow steps 1-7 in [Create an Azure Active Directory application registration in Azure Data Explorer](provision-azure-ad-app.md).
1. Save the following values to be used in later steps:
    * Application (client) ID
    * Directory (tenant) ID
    * Client secret key value

### Grant the Azure AD app permissions

1. In the query tab of the [web UI](https://dataexplorer.azure.com/), connect to your cluster. For more information on how to connect, see [Add clusters](web-query-data.md#add-clusters).
1. Browse to the database in which you want to ingest data.
1. Run the following management command, replacing the placeholders. Replace *DatabaseName* with the name of the target database and *ApplicationID* with the previously saved value. This command grants the app the [database ingestor](kusto/management/access-control/role-based-access-control.md) role. For more information, see [Manage database security roles](kusto/management/manage-database-security-roles.md).

    ```kusto
    .add database <DatabaseName> ingestors ('aadapp=<ApplicationID>') 'Azure Data Explorer App Registration'
    ```

    > [!NOTE]
    > The last parameter is a string that shows up as notes when you query the roles associated with a database. For more information, see [View existing security roles](kusto/management/manage-database-security-roles.md#show-existing-security-roles).

### Create a table and ingestion mapping

Create a target table for the incoming data.

* In your query editor, run the following [table creation command](kusto/management/create-table-command.md), replacing the placeholder *TableName* with the name of the target table:

    ```kusto
    .create table <TableName> (Timestamp:datetime, Level:string, Message:string, FormattedMessage:dynamic, Exception:string, Properties:dynamic)
    ```

## Add the Azure Data Explorer target configuration to your app

Use the following steps to:

* Add the Azure Data Explorer target configuration
* Build and run the app

1. Add the Azure Data Explorer target in your NLog configuration file.

    ```xml
    <targets>
        <target name="adxtarget" xsi:type="ADXTarget"
        IngestionEndpointUri="<ADX connection string>"
        Database="<ADX database name>"
        TableName="<ADX table name>"
        ApplicationClientId="<AAD App clientId>"
        ApplicationKey="<AAD App key>"
        Authority="<AAD tenant id>"
        />
    </targets>

    ##Rules
    <rules>
        <logger name="*" minlevel="Info" writeTo="adxtarget" />
    </rules>
    ```

    For more options, see [Azure Data Explorer Nlog connector](https://github.com/Azure/azure-kusto-nlog-sink).

1. Send data to Azure Data Explorer using the NLog sink. For example:

    ```csharp
    logger.Info("Processed {@Position} in {Elapsed:000} ms.", position, elapsedMs);
    logger.Error(exceptionObj, "This was exception");
    logger.Debug("Processed {@Position} in {Elapsed:000} ms. ", position, elapsedMs);
    logger.Warn("Processed {@Position} in {Elapsed:000} ms. ", position, elapsedMs);
    ```

1. Build and run the app. For example, if you're using Visual Studio, press F5.

1. Verify that the data is in your cluster. In the [web UI](https://dataexplorer.azure.com/), run the following query replacing the placeholder with the name of the table that used earlier:

    ```kusto
    <TableName>
    | take 10
    ```

## Run the sample app

Use the sample log generator app as an example showing how to configure and use the NLog sink.

1. Clone the NLog sink's [git repo](https://github.com/Azure/azure-kusto-nlog-sink) using the following git command:

    ```powershell
    git clone https://github.com/Azure/azure-kusto-nlog-sink.git
    ```

1. Set the following environmental variables, so that NLog config file can read them right away from environment:

    | Variable | Description |
    |---|---|
    | *INGEST_ENDPOINT* | The ingest URI for your cluster in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*. |
    | *DATABASE* | The case-sensitive name of the target database. |
    | *APP_ID* | Application client ID required for authentication. You saved this value in [Create an Azure AD App registration](#create-an-azure-ad-app-registration). |
    | *APP_KEY* | Application key required for authentication. You saved this value in [Create an Azure AD App registration](#create-an-azure-ad-app-registration). |
    | *AZURE_TENANT_ID* | The ID of the tenant in which the application is registered. You saved this value in [Create an Azure AD App registration](#create-an-azure-ad-app-registration). |

    You can set the environment variables manually or using the following commands:

    #### [Windows](#tab/windows)

    ```powershell
    $env:INGEST_ENDPOINT="<ingestionURI>"
    $env:APP_ID="<appId>"
    $env:APP_KEY="<appKey>"
    $env:AZURE_TENANT_ID="<tenant>"
    $env:DATABASE="<databaseName>"
    ```

    #### [Mac/Linux](#tab/linux)

    ```bash
    export INGEST_ENDPOINT="<ingestionURI>"
    export APP_ID="<appId>"
    export APP_KEY="<appKey>"
    export AZURE_TENANT_ID="<tenant>"
    export DATABASE="<databaseName>"
    ```

    ---

1. Within your terminal, navigate to the root folder of the cloned repo and run the following `dotnet` command to build the app:

    ```powershell
    cd .\NLog.Azure.Kusto.Samples\
    dotnet build
    ```

1. Within your terminal, navigate to the samples folder and run the following `dotnet` command to run the app:

    ```powershell
    dotnet run
    ```

1. In the [web UI](https://dataexplorer.azure.com/), select the target database, and run the following query to explore the ingested data.

    ```kusto
    ADXNLogSample
    | take 10
    ```

    Your output should look similar to the following image:

    :::image type="content" lightbox="media/nlog-connector/take-10-results.png" source="media/nlog-connector/take-10-results.png" alt-text="Screenshot of table with take 10 function and results.":::

## See also

* [Data connectors overview](connector-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)
