---
title: Ingest data with Fluent Bit into Azure Data Explorer
description: Learn how to ingest (load) data into Azure Data Explorer from Fluent Bit.
ms.reviewer: ramacg
ms.topic: how-to
ms.date: 10/04/2023
---

# Ingest data with Fluent Bit into Azure Data Explorer

[Fluent Bit](https://fluentbit.io/) is an open-source agent that collects logs, metrics, and traces from various sources. It allows you to filter, modify, and aggregate event data before sending it to storage. Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. This article guides you through the process of using Fluent Bit to send data to Azure Data Explorer. 

In this article, you'll learn how to:

> [!div class="checklist"]
>
> * [Create an Azure Data Explorer table to store your logs](#create-an-azure-data-explorer-table-to-store-your-logs)
> * [Register an Azure AD app with permissions to ingest data](#register-an-azure-ad-app-with-permissions-to-ingest-data)
> * [Configure Fluent Bit to send logs to your table](#configure-fluent-bit-to-send-logs-to-your-table)
> * [Query your logs in Azure Data Explorer](#query-your-logs-in-azure-data-explorer)

For a complete list of data connectors, see [Data connectors overview](connector-overview.md).

## Prerequisites

* [Fluent Bit](https://docs.fluentbit.io/manual/installation/getting-started-with-fluent-bit).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Create an Azure Data Explorer table to store your logs

Fluent Bit forwards logs to Azure Data Explorer in JSON format with three properties: `log` ([dynamic](kusto/query/scalar-data-types/dynamic.md)), `tag` ([string](kusto/query/scalar-data-types/string.md)), and `timestamp` ([datetime](kusto/query/scalar-data-types/datetime.md)).

You can create a table with columns for each of these properties, or if you have knowledge of your log structure, you can create a customized table by mapping log properties to specific columns. Select the relevant tab.

### [Default schema](#tab/default)

To create a table for incoming logs from Fluent Bit:

1. Select the database where you'd like to create the table.

1. Run the following command:

    ```kusto
    .create table FluentBitLogs (log:dynamic, tag:string, timestamp:datetime)
    ```

    Azure Data Explorer will automatically map the incoming JSON properties into the correct column. For more information, see [.create table command](kusto/management/create-table-command.md).
    
### [Custom schema](#tab/custom)

To create a table for incoming structured logs from Fluent Bit:

1. Select the database where you'd like to create the table.

1. Run the [.create table command](kusto/management/create-table-command.md). For example, if your logs contain three fields named `myString`, `myInteger`, and `myDynamic`, you can create a table with the following schema:

    ```kusto
    .create table FluentBitLogs (myString:string, myInteger:int, myDynamic: dynamic, timestamp:datetime)
    ```

1. Create a [JSON mapping](kusto/management/mappings.md) to map log properties to the appropriate columns. The following ingestion mapping creates a mapping based on the example in the previous step:

    ```kusto
    .create-or-alter table FluentBitLogs ingestion json mapping "LogMapping" 
        ```[
        {"column" : "myString", "datatype" : "string", "Properties":{"Path":"$.log.myString"}},
        {"column" : "myInteger", "datatype" : "int", "Properties":{"Path":"$.log.myInteger"}}, 
        {"column" : "myDynamic", "datatype" : "dynamic", "Properties":{"Path":"$.log.myInteger"}}, 
        {"column" : "timestamp", "datatype" : "datetime", "Properties":{"Path":"$.timestamp"}} 
        ]```
    ```

---

## Register an Azure AD app with permissions to ingest data

Azure Active Directory (Azure AD) application authentication is used for applications that need to access Azure Data Explorer without a user present. To ingest data using Fluent Bit, you need to create and register an Azure AD application principal, and then authorize this principal to ingest data into your Azure Data Explorer table.

1. Follow steps 1-7 in [Create an Azure AD application](provision-azure-ad-app.md#create-azure-ad-application-registration).

1. Save the **Application (client) ID**, **Directory (tenant) ID**, and client secret key **value** for use in the following steps.

1. In the database where you created your table, run the following command, replacing `<MyDatabase>` with the name of the database:

    ```kusto
    .add database MyDatabase ingestors ('aadapp=<Application (client) ID>;<Directory (tenant) ID>' 'Fluent Bit application)
    ```

    This command grants the application permissions to ingest data into your table. For more information, see [role-based access control](kusto/access-control/role-based-access-control.md).

## Configure Fluent Bit to send logs to your table

To configure Fluent Bit to send logs to your table:

1. Create a Fluent Bit [configuration file](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/configuration-file) with the following content:

    ```txt
    [OUTPUT]
        Match *
        Name azure_kusto
        Tenant_Id <Directory (tenant) ID>
        Client_Id <Application (client) ID>
        Client_Secret <Client secret key value>
        Ingestion_Endpoint https://ingest-<cluster>.<region>.kusto.windows.net
        Database_Name <MyDatabase>
        Table_Name <MyTable>
        Ingestion_Mapping_Reference <MyMapping>
    ```

1. Replace variables surrounded by angle brackets with the relevant values:
   
   * For `Tenant_Id`, `Client_Id`, and `Client_Secret`, use the values from the [Create an Azure AD application for ingestion](#register-an-azure-ad-app-with-permissions-to-ingest-data) step.
  
   * For the `Ingestion_Endpoint`, use the **Data Ingestion URI** found in the [Azure portal](https://ms.portal.azure.com/) under your cluster overview.
  
   * For the `Database_Name`, `Table_Name`, and `Ingestion_Mapping_Reference`, use the values from the [Create an Azure Data Explorer table](#create-an-azure-data-explorer-table-to-store-your-logs) step. If you didn't create an ingestion mapping, remove the `Ingestion_Mapping_Reference` property from the configuration file.

## Query your logs in Azure Data Explorer

Once the configuration is complete, your logs are sent to your Azure Data Explorer table.

1. To verify that logs have been ingested into the table, run the following query:

    ```Kusto
    FluentBitLogs
    | count
    ```

1. To view a sample of log data, run the following query:

    ```Kusto
    FluentBitLogs
    | take 100
    ```

## Next step

> [!div class="nextstepaction"]
> [Write queries](kusto/query/tutorials/learn-common-operators.md)
