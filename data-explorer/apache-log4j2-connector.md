---
title: Ingest data in Azure Data Explorer using the Apache Log4J 2 connector
description: Learn how to use the Apache Log4J 2 connector in Azure Data Explorer.
ms.date: 03/02/2023
ms.topic: how-to
ms.reviewer: ramacg
---
# Ingest data with the Log4j 2 connector

Log4j is a popular logging framework for Java applications maintained by the Apache Foundation. Log4j allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. Apache Log4J 2 sink for Azure Data Explorer allows you to easily stream your log data to Azure Data Explorer, where you can analyze, visualize, and alert on your logs in real time. 

In this article, we'll use a sample log generator app to demonstrate how to configure and run the Log4j 2 connector.

## Prerequisites

* [Apache Maven](https://maven.apache.org/)
* Azure Data Explorer [cluster and database](create-cluster-database-portal.md)

## Create an AAD App registration and grant it ingestor permissions

In order to ingest data using the Log4j 2 connector, you need to create and register an Azure AD service principal and then authorize this principal to ingest data an Azure Data Explorer database.

1. Follow steps 1-7 in [Create an Azure Active Directory application registration in Azure Data Explorer](provision-azure-ad-app.md) to create an Azure AD app. Save the following values to be be used in later steps.
    * Application (client) ID
    * Directory (tenant) ID
    * Client secret key value
1. Connect to your cluster and browse to your database in the query tab of the [web UI](https://dataexplorer.azure.com/). For more information, see [Add clusters](web-query-data.md#add-clusters).
1. Grant the app [database ingestor](kusto/management/access-control/role-based-access-control.md) role using the following management command. For more information, see [Manage permissions with management commands](manage-database-permissions.md#manage-permissions-with-management-commands).

    ```kusto
    .add database DatabaseName ingestors ('aadapp=12345-abcd-12a3-b123-ccdd12345a1b') 'Azure Data Explorer App Registration'
    ```
    
    * Instead of the placeholder *DatabaseName*, enter the name of your database.
    * Instead of the placeholder application ID, use the application ID that was saved in a previous step.

    > [!NOTE]
    > The last parameter is a string that shows up as notes when you query the roles associated with a database.

## Create table and mapping

Now that you've given permissions to the connector to ingest data in your database, you need to create a table with data columns that correspond to the incoming data.

1. Run the following [table creation command](kusto/management/create-table-command.md) in your query editor:

    ```kusto
    .create table log4jTest (timenanos:long,timemillis:long,level:string,threadid:string,threadname:string,threadpriority:int,formattedmessage:string,loggerfqcn:string,loggername:string,marker:string,thrownproxy:string,source:string,contextmap:string,contextstack:string)
    ```

    In this example, the table name is *Log4jTest*. Note that the table name is referenced later in the configuration file.

1. Run the following [ingestion mapping command](kusto/management/create-ingestion-mapping-command.md) in your query editor:

    ```kusto
    .create table log4jTest ingestion csv mapping 'log4jCsvTestMapping' '[{"Name":"timenanos","DataType":"","Ordinal":"0","ConstValue":null},{"Name":"timemillis","DataType":"","Ordinal":"1","ConstValue":null},{"Name":"level","DataType":"","Ordinal":"2","ConstValue":null},{"Name":"threadid","DataType":"","Ordinal":"3","ConstValue":null},{"Name":"threadname","DataType":"","Ordinal":"4","ConstValue":null},{"Name":"threadpriority","DataType":"","Ordinal":"5","ConstValue":null},{"Name":"formattedmessage","DataType":"","Ordinal":"6","ConstValue":null},{"Name":"loggerfqcn","DataType":"","Ordinal":"7","ConstValue":null},{"Name":"loggername","DataType":"","Ordinal":"8","ConstValue":null},{"Name":"marker","DataType":"","Ordinal":"9","ConstValue":null},{"Name":"thrownproxy","DataType":"","Ordinal":"10","ConstValue":null},{"Name":"source","DataType":"","Ordinal":"11","ConstValue":null},{"Name":"contextmap","DataType":"","Ordinal":"12","ConstValue":null},{"Name":"contextstack","DataType":"","Ordinal":"13","ConstValue":null}]'
    ```

     In this example, the ingestion mapping is named *log4jCsvTestMapping*. This ingestion mapping name is referenced later in the configuration file.

## Clone the Log4j2-Azure Data Explorer connector git repo

Clone the Log4j2-Azure Data Explorer [git repo](https://github.com/Azure/azure-kusto-log4j). 

```git bash
git clone https://github.com/Azure/azure-kusto-log4j.git
```

The Log4j2-Azure Data Explorer connector uses a custom strategy to be used in the *RollingFileAppender*. Logs are written into the rolling file to prevent any data loss arising out of network failure while connecting to the Azure Data Explorer cluster. The data is stored in a rolling file and then flushed to the Azure Data Explorer cluster.

## Configure attributes of KustoStrategy

In the sample project included in the git repo, the default configuration format is log4j2.xml. It's located under the file path: \azure-kusto-log4j\samples\src\main\resources\log4j2.xml

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

> [!NOTE]
> The table name `log4jTest` and mapping name `log4CsvTestMapping` were created in the [above steps](#create-table-and-mapping).

The configuration file references the following environmental variables:

| Variable | Description |
|---|---|
| LOG4J2_ADX_DB_NAME | Database name. Defined in [Prerequisites](#prerequisites)
| LOG4J2_ADX_TENANT_ID | Tenant ID. Created in [Create an AAD App registration and grant it ingestor permissions](#create-an-aad-app-registration-and-grant-it-ingestor-permissions)
| LOG4J2_ADX_INGEST_CLUSTER_URL | Cluster ingestion URI of the format *https://ingest-cluster.kusto.windows.net* where *cluster* should be replaced with your cluster name.
| LOG4J2_ADX_APP_ID | App ID. Created in [Create an AAD App registration and grant it ingestor permissions](#create-an-aad-app-registration-and-grant-it-ingestor-permissions).
| LOG4J2_ADX_APP_KEY | App key value. Created in [Create an AAD App registration and grant it ingestor permissions](#create-an-aad-app-registration-and-grant-it-ingestor-permissions).

### Set environmental variables

Set the environmental variables using the following commands:

#### [Windows](#tab/windows)

```powershell
$env:LOG4J2_ADX_DB_NAME="<db-name>"
$env:LOG4J2_ADX_TENANT_ID="<tenant-id>"                   
$env:LOG4J2_ADX_INGEST_CLUSTER_URL="https://ingest-<cluster>.kusto.windows.net"
$env:LOG4J2_ADX_APP_ID="<app-id>"
$env:LOG4J2_ADX_APP_KEY="<app-key>" 
```

#### [Mac/Linux](#tab/linux)

```sh
export LOG4J2_ADX_DB_NAME="<db-name>"
export LOG4J2_ADX_TENANT_ID="<tenant-id>"
export LOG4J2_ADX_INGEST_CLUSTER_URL="https://ingest-<cluster>.kusto.windows.net"
export LOG4J2_ADX_APP_ID="<app-id>"
export LOG4J2_ADX_APP_KEY="<app-key>"
```

---

## Run the sample app

Within your terminal, navigate to the samples folder of the cloned repo.

```Maven
mvn compile exec:java -Dexec.mainClass="org.example.KustoLog4JSampleApp" 
```

## Explore the ingested data with query

The ingested log data can be verified by counting the number of records in the table. In this example, the table name is log4jTest.

```kusto
log4jTest 
| count
```

```kusto
log4jTest 
| take 10
```

The output of the above KQL query should fetch records as per the screenshot attached below.

## See also

* [Data connectors overview](connector-overview.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)