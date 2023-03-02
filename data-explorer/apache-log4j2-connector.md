---
title: Ingest data in Azure Data Explorer using the Apache Log4J 2 connector
description: Learn how to use the Apache Log4J 2 connector in Azure Data Explorer.
ms.date: 03/02/2023
ms.topic: how-to
ms.reviewer: ramacg
---
# Ingest data with the Log4j 2 connector

Log4j is a popular logging framework for Java applications maintained by the Apache Foundation. Log4j allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. Apache Log4J 2 sink for Azure Data Explorer allows you to easily stream your log data to Azure Data Explorer, where you can analyze, visualize, and alert on your logs in real time. 

In this article, you'll go through the following steps:

> [!div class="checklist"]
> * Create an AAD App registration and grant it permissions
> * Create a table and table mapping
> * Clone the Log4j2-Azure Data Explorer connector repo
> * Configure environmental variables
> * Run the sample app
> * Explore ingested data

## Prerequisites

* [Apache Maven](https://maven.apache.org/)
* Azure Data Explorer [cluster and database](create-cluster-database-portal.md)

## Create an AAD App registration and grant it ingestor permissions

In order to ingest data using the Log4j 2 connector, you need to create and register an Azure AD service principal and then authorize this principal to ingest data an Azure Data Explorer database.

1. Follow steps 1-7 in [Create an Azure Active Directory application registration in Azure Data Explorer](provision-azure-ad-app.md) to create an Azure AD app. Save the app key and application ID values to be used in later steps.
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

1. Run the following [ingestion mapping command](kusto/management/create-ingestion-mapping-command.md) in your query editor:

    ```kusto
    .create table log4jTest ingestion csv mapping 'log4jCsvTestMapping' '[{"Name":"timenanos","DataType":"","Ordinal":"0","ConstValue":null},{"Name":"timemillis","DataType":"","Ordinal":"1","ConstValue":null},{"Name":"level","DataType":"","Ordinal":"2","ConstValue":null},{"Name":"threadid","DataType":"","Ordinal":"3","ConstValue":null},{"Name":"threadname","DataType":"","Ordinal":"4","ConstValue":null},{"Name":"threadpriority","DataType":"","Ordinal":"5","ConstValue":null},{"Name":"formattedmessage","DataType":"","Ordinal":"6","ConstValue":null},{"Name":"loggerfqcn","DataType":"","Ordinal":"7","ConstValue":null},{"Name":"loggername","DataType":"","Ordinal":"8","ConstValue":null},{"Name":"marker","DataType":"","Ordinal":"9","ConstValue":null},{"Name":"thrownproxy","DataType":"","Ordinal":"10","ConstValue":null},{"Name":"source","DataType":"","Ordinal":"11","ConstValue":null},{"Name":"contextmap","DataType":"","Ordinal":"12","ConstValue":null},{"Name":"contextstack","DataType":"","Ordinal":"13","ConstValue":null}]'
    ```

## Clone the Log4j2-Azure Data Explorer connector git repo


```git bash
git clone https://github.com/Azure/azure-kusto-log4j.git
```

The Log4j2-Azure Data Explorer connector uses a custom strategy to be used in the RollingFileAppender. Logs are written into the rolling file to prevent any data loss arising out of network failure while connecting to the Azure Data Explorer cluster. The data is stored in a rolling file and then flushed to the Azure Data Explorer cluster.

## Configure environmental variables

In the sample project included in the git repo, the default configuration format is log4j2.xml. The following attributes of KustoStrategy are referenced by the configuration file:

``` xml
<KustoStrategy
   clusterIngestUrl="${sys:LOG4J2_ADX_INGEST_CLUSTER_URL}"
   appId="${sys:LOG4J2_ADX_APP_ID}"
   appKey="${sys:LOG4J2_ADX_APP_KEY}"
   appTenant="${sys:LOG4J2_ADX_TENANT_ID}"
   dbName="${sys:LOG4J2_ADX_DB_NAME}"
   tableName="log4jTest"
   logTableMapping="log4jCsvTestMapping"
   mappingType="csv"
   flushImmediately="false"
/>
```

Note: log4jTest is the name of the table and the mapping log4CsvTestMapping we created in the above steps.

### [Windows](#tab/windows)

```powershell
$env:LOG4J2_ADX_DB_NAME="<db-name>"
$env:LOG4J2_ADX_TENANT_ID="<tenant-id>"                   
$env:LOG4J2_ADX_INGEST_CLUSTER_URL="https://ingest-<cluster>.kusto.windows.net"
$env:LOG4J2_ADX_APP_ID="<app-id>"
$env:LOG4J2_ADX_APP_KEY="<app-key>" 
```

### [Mac/Linux](#tab/linux)

```sh
export LOG4J2_ADX_DB_NAME="<db-name>"
export LOG4J2_ADX_TENANT_ID="<tenant-id>"
export LOG4J2_ADX_INGEST_CLUSTER_URL="https://ingest-<cluster>.kusto.windows.net"
export LOG4J2_ADX_APP_ID="<app-id>"
export LOG4J2_ADX_APP_KEY="<app-key>"
```

## Run the sample app

```
cd samples
mvn compile exec:java -Dexec.mainClass="org.example.KustoLog4JSampleApp" 
```

The ingested log data can be verified by querying the created log table(log4jTest in our case) by using the following KQL command

## Explore the ingested data with query

```kusto
log4jTest 
| take 10
```

The output of the above KQL query should fetch records as per the screenshot attached below.

## Clean up resources



## See also

* [Data connectors overview](connector-overview.md)