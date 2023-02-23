---
title: Ingest data in Azure Data Explorer using the Apache Log4J 2 connector
description: Learn how to use the Apache Log4J 2 connector in Azure Data Explorer.
ms.date: 02/20/2023
ms.topic: tutorial
ms.reviewer: ramacg
---
# Log4j 2 connector

Log4j is a popular logging framework for Java applications maintained by the Apache Foundation. Log4j allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern. Apache Log4J 2 sink for Azure Data Explorer allows you to easily stream your log data to Azure Data Explorer, where you can analyze, visualize, and alert on your logs in real time. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an AAD App registration
> * Create a table and table mapping
> * Clone the Log4j2-Azure Data Explorer connector repo
> * Configure the log4J configuration file
> * Run the sample app
> * Explore ingested data

## Prerequisites

* cluster and database

## Create AAD App registration

[Create an Azure Active Directory application registration in Azure Data Explorer](provision-azure-ad-app.md)

Grant it database ingestor role
Save app key and application ID

## Create table

```kusto
.create table log4jTest (timenanos:long,timemillis:long,level:string,threadid:string,threadname:string,threadpriority:int,formattedmessage:string,loggerfqcn:string,loggername:string,marker:string,thrownproxy:string,source:string,contextmap:string,contextstack:string)
```

## Create table mapping

```kusto
.create table log4jTest ingestion csv mapping 'log4jCsvTestMapping' '[{"Name":"timenanos","DataType":"","Ordinal":"0","ConstValue":null},{"Name":"timemillis","DataType":"","Ordinal":"1","ConstValue":null},{"Name":"level","DataType":"","Ordinal":"2","ConstValue":null},{"Name":"threadid","DataType":"","Ordinal":"3","ConstValue":null},{"Name":"threadname","DataType":"","Ordinal":"4","ConstValue":null},{"Name":"threadpriority","DataType":"","Ordinal":"5","ConstValue":null},{"Name":"formattedmessage","DataType":"","Ordinal":"6","ConstValue":null},{"Name":"loggerfqcn","DataType":"","Ordinal":"7","ConstValue":null},{"Name":"loggername","DataType":"","Ordinal":"8","ConstValue":null},{"Name":"marker","DataType":"","Ordinal":"9","ConstValue":null},{"Name":"thrownproxy","DataType":"","Ordinal":"10","ConstValue":null},{"Name":"source","DataType":"","Ordinal":"11","ConstValue":null},{"Name":"contextmap","DataType":"","Ordinal":"12","ConstValue":null},{"Name":"contextstack","DataType":"","Ordinal":"13","ConstValue":null}]'
```

## Clone the Log4j2-Azure Data Explorer connector git repo

```git bash
git clone https://github.com/Azure/azure-kusto-log4j.git
cd samples
```

The Log4j2-Azure Data Explorer connector uses a custom strategy to be used in the RollingFileAppender. Logs are written into the rolling file to prevent any data loss arising out of network failure while connecting to the Azure Data Explorer cluster. The data is stored in a rolling file and then flushed to the Azure Data Explorer cluster.

## Configure the log4J configuration file


Log4J supports various formats for its configuration

XML
JSON
PROPERTIES
YAML

In the sample project included in the git repo, the default format is log4j2.xml. The following attributes of KustoStrategy need to be configured.

``` 
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

Execute the following command and the application starts running. After running, we can see the logs getting ingested into ADX cluster.

## Run the sample app

```
cd samples
mvn compile exec:java -Dexec.mainClass="org.example.KustoLog4JSampleApp" 
                      -DLOG4J2_ADX_DB_NAME="ADX-database-name" 
                      -DLOG4J2_ADX_TENANT_ID="tenant-id" 
                      -DLOG4J2_ADX_INGEST_CLUSTER_URL="ADX-ingest-url" 
                      -DLOG4J2_ADX_APP_ID="appId" 
                      -DLOG4J2_ADX_APP_KEY="appKey"
```

The ingested log data can be verified by querying the created log table(log4jTest in our case) by using the following KQL command

## Explore the ingested data with query

```kusto
log4jTest 
| take 10
```

The output of the above KQL query should fetch records as per the screenshot attached below.

## Clean up resources

## Next steps