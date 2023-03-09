---
title: Ingest data in Azure Data Explorer using the Apache Log4J2 connector
description: Learn how to use the Apache Log4J2 connector in Azure Data Explorer.
ms.date: 03/09/2023
ms.topic: how-to
ms.reviewer: ramacg
---
# Ingest data with the Apache Log4J2 connector

Log4j is a popular logging framework for Java applications maintained by the Apache Foundation. Log4J allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. The Apache Log4J2 sink for Azure Data Explorer streams your log data to Azure Data Explorer, where you can analyze and visualize your logs in real time. 

In this article, you'll use a sample log generator app to show how to configure and use the Log4J2 connector. 

For a complete list of data connectors, see [Data connectors overview](connector-overview.md).

## Prerequisites

* [Apache Maven](https://maven.apache.org/)
* An Azure Data Explorer [cluster and database](create-cluster-database-portal.md)

## Create an Azure AD App registration

Azure Active Directory (Azure AD) application authentication is used for applications that need to access Azure Data Explorer without a user present. To ingest data using the Log4J2 connector, you need to create and register an Azure AD service principal, and then authorize this principal to ingest data an Azure Data Explorer database.

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
    > The last parameter is a string that shows up as notes when you query the roles associated with a database. For more information, see [manage database roles](/kusto/management/manage-database-security-roles.md).

## Create table and mapping

Now that you've given permissions to the connector to ingest data, you need to create a target table for the incoming data. In this example, you use a table mapping that corresponds to the data sent from the sample app.

1. Run the following [table creation command](kusto/management/create-table-command.md) in your query editor:

    ```kusto
    .create table log4jTest (timenanos:long,timemillis:long,level:string,threadid:string,threadname:string,threadpriority:int,formattedmessage:string,loggerfqcn:string,loggername:string,marker:string,thrownproxy:string,source:string,contextmap:string,contextstack:string)
    ```

    In this example, the table name is *Log4jTest*. This table name is referenced later in the configuration file.

1. Run the following [ingestion mapping command](kusto/management/create-ingestion-mapping-command.md) in your query editor:

    ```kusto
    .create table log4jTest ingestion csv mapping 'log4jCsvTestMapping' '[{"Name":"timenanos","DataType":"","Ordinal":"0","ConstValue":null},{"Name":"timemillis","DataType":"","Ordinal":"1","ConstValue":null},{"Name":"level","DataType":"","Ordinal":"2","ConstValue":null},{"Name":"threadid","DataType":"","Ordinal":"3","ConstValue":null},{"Name":"threadname","DataType":"","Ordinal":"4","ConstValue":null},{"Name":"threadpriority","DataType":"","Ordinal":"5","ConstValue":null},{"Name":"formattedmessage","DataType":"","Ordinal":"6","ConstValue":null},{"Name":"loggerfqcn","DataType":"","Ordinal":"7","ConstValue":null},{"Name":"loggername","DataType":"","Ordinal":"8","ConstValue":null},{"Name":"marker","DataType":"","Ordinal":"9","ConstValue":null},{"Name":"thrownproxy","DataType":"","Ordinal":"10","ConstValue":null},{"Name":"source","DataType":"","Ordinal":"11","ConstValue":null},{"Name":"contextmap","DataType":"","Ordinal":"12","ConstValue":null},{"Name":"contextstack","DataType":"","Ordinal":"13","ConstValue":null}]'
    ```

     In this example, the ingestion mapping is named *log4jCsvTestMapping*. This ingestion mapping name is referenced later in the configuration file.

## Clone the Log4J2-Azure Data Explorer connector git repo

Clone the Log4J2-Azure Data Explorer [git repo](https://github.com/Azure/azure-kusto-log4j) using the following git command:

```bash
git clone https://github.com/Azure/azure-kusto-log4j.git
```

## Configure attributes of KustoStrategy

The Log4J2-Azure Data Explorer connector uses a custom strategy that's used in the *RollingFileAppender*. Logs are written into the rolling file to prevent any data loss arising out of network failure while connecting to the Azure Data Explorer cluster. The data is stored in a rolling file and then flushed to the Azure Data Explorer cluster.

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
> The table name `log4jTest` and mapping name `log4CsvTestMapping` were [created](#create-table-and-mapping) for the example ingestion. If you use different table and mapping names, replace these values and save the configuration file.

The configuration file references the following environmental variables:

| Variable | Description |
|---|---|
| LOG4J2_ADX_DB_NAME | The case-sensitive name of the target database. Defined in [Prerequisites](#prerequisites)
| LOG4J2_ADX_TENANT_ID | The tenant information specified as the domain name or tenant ID. Created in [Create an Azure AD App registration](#create-an-azure-ad-app-registration).
| LOG4J2_ADX_INGEST_CLUSTER_URL | The cluster ingestion URI in the format *https://ingest-\<cluster>.\<region>.kusto.windows.net*.
| LOG4J2_ADX_APP_ID | The ID for the application with permissions to ingest data. Created in [Create an Azure AD App registration](#create-an-azure-ad-app-registration).
| LOG4J2_ADX_APP_KEY | The application key value for the specified application ID. Created in [Create an Azure AD App registration](#create-an-azure-ad-app-registration).

### Set environmental variables

Set the environmental variables manually or using the following commands:

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

In your terminal, navigate to the samples folder of the cloned repo and run the following Apache Maven command:

```bash
mvn compile exec:java -Dexec.mainClass="org.example.KustoLog4JSampleApp" 
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