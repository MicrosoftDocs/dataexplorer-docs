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
> * [Verify that data is ingested into Azure Data Explorer](#verify-that-data-is-ingested-into-azure-data-explorer)

For a complete list of data connectors, see [Data connectors overview](connector-overview.md).

## Prerequisites

* [Fluent Bit](https://docs.fluentbit.io/manual/installation/getting-started-with-fluent-bit).
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).

## Create an Azure Data Explorer table to store your logs

Fluent Bit forwards logs to Azure Data Explorer in JSON format with three properties: `log` ([dynamic](kusto/query/scalar-data-types/dynamic.md)), `tag` ([string](kusto/query/scalar-data-types/string.md)), and `timestamp` ([datetime](kusto/query/scalar-data-types/datetime.md)).

You can create a table with columns for each of these properties. Alternatively, if you have structured logs, you can create a table with log properties mapped to custom columns. To learn more, select the relevant tab.

### [Default schema](#tab/default)

To create a table for incoming logs from Fluent Bit:

1. Select the database where you'd like to create the table.

1. Run the following [.create table command](kusto/management/create-table-command.md):

    ```kusto
    .create table FluentBitLogs (log:dynamic, tag:string, timestamp:datetime)
    ```

    Azure Data Explorer automatically maps incoming JSON properties into the correct column.
    
### [Custom schema](#tab/custom)

To create a table for incoming structured logs from Fluent Bit:

1. Select the database where you'd like to create the table.

1. Run the [.create table command](kusto/management/create-table-command.md). For example, if your logs contain three fields named `myString`, `myInteger`, and `myDynamic`, you can create a table with the following schema:

    ```kusto
    .create table FluentBitLogs (myString:string, myInteger:int, myDynamic: dynamic, timestamp:datetime)
    ```

1. Create a [JSON mapping](kusto/management/mappings.md) to map log properties to the appropriate columns. The following command creates a mapping based on the example in the previous step:

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

Azure Active Directory (Azure AD) application authentication is used for applications that need to access Azure Data Explorer without a user present. To ingest data using Fluent Bit, you need to create and register an Azure AD service principal, and then authorize this principal to ingest data into your Azure Data Explorer table.

1. Follow steps 1-7 in [Create an Azure AD application registration](provision-azure-ad-app.md#create-azure-ad-application-registration).

1. Save the **Application (client) ID**, **Directory (tenant) ID**, and client secret key **value** for use in the following steps.

1. Run the following command, replacing `<MyDatabase>` with the name of the database:

    ```kusto
    .add database MyDatabase ingestors ('aadapp=<Application (client) ID>;<Directory (tenant) ID>' 'Fluent Bit application)
    ```

    This command grants the application permissions to ingest data into your table. For more information, see [role-based access control](kusto/access-control/role-based-access-control.md).

## Configure Fluent Bit to send logs to your table

To configure Fluent Bit to send logs to your Azure Data Explorer table, create a [classic mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/classic-mode/configuration-file) or [YAML mode](https://docs.fluentbit.io/manual/administration/configuring-fluent-bit/yaml/configuration-file) configuration file with the following output properties:

|Field|Description|
|--|--|
|Name|`azure_kusto`|
|Tenant_Id|**Directory (tenant) ID** from the [Register an Azure AD app with permissions to ingest data](#register-an-azure-ad-app-with-permissions-to-ingest-data) step.|
|Client_Id|**Application (client) ID** from the [Register an Azure AD app with permissions to ingest data](#register-an-azure-ad-app-with-permissions-to-ingest-data) step.|
|Client_Secret|The client secret key value from the [Register an Azure AD app with permissions to ingest data](#register-an-azure-ad-app-with-permissions-to-ingest-data) step.|
|Ingestion_Endpoint|Use the **Data Ingestion URI** found in the [Azure portal](https://ms.portal.azure.com/) under your cluster overview.|
|Database_Name|The name of the database that contains your logs table.|
|Table_Name|The name of the table from the [Create an Azure Data Explorer table](#create-an-azure-data-explorer-table-to-store-your-logs) step.|
|Ingestion_Mapping_Reference| The name of the ingestion mapping from the [Create an Azure Data Explorer table](#create-an-azure-data-explorer-table-to-store-your-logs) step. If you didn't create an ingestion mapping, remove the property from the configuration file.|

## Verify that data is ingested into Azure Data Explorer

Once the configuration is complete, logs should arrive in your Azure Data Explorer table.

1. To verify that logs have been ingested, run the following query:

    ```Kusto
    FluentBitLogs
    | count
    ```

1. To view a sample of log data, run the following query:

    ```Kusto
    FluentBitLogs
    | take 100
    ```

## Related content

* [Write queries](kusto/query/tutorials/learn-common-operators.md)
