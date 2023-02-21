---
title: Ingest data in Azure Data Explorer using the Apache Log4J 2 connector
description: Learn how to use the Apache Log4J 2 connector in Azure Data Explorer.
ms.date: 02/20/2023
ms.topic: how-to
ms.reviewer: ramacg
---
## Log4j 2 connector

Log4j is a popular logging framework for Java applications maintained by the Apache Foundation. Log4j allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern.

Apache Log4J 2 sink for Azure Data Explorer allows you to easily stream your log data to Azure Data Explorer, where you can analyze, visualize, and alert on your logs in real time. Log4j2 is widely used as logging tool. Kusto implementation is used in conjunction with RollingFileAppender with KustoStrategy. The key reason for using a strategy is to have redundancy in storage of logs and re-transmit the log files. To provide data transmission redundancy, the rolled over log files are transmitted to Kusto. Transmission of the files are attempted 3 times with a configured time window.

## Prerequisites

## Create cluster and database

## Create AAD App registration

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

 
The architecture of log4j2 consists of the following components:

- Configuration: This component is responsible for reading the configuration file and setting up the logging system based on the specified parameters.
- Loggers: These components generate log messages and send them to the appenders for further processing.
- Appenders: These are the components that receive the log messages from the loggers and write them to a specific destination, such as a file, console, or database.
- Filters: These components determine whether a log message should be processed or discarded based on specified criteria.
- Layouts: These components are responsible for formatting the log messages in a specific way before they are written to the destination.
- Plugins: These components allow the system to be extended with additional functionality, such as custom appenders or filters.


One of the options for storing log data is to send it to a managed data analytics service, such as Azure Data Explorer (ADX). 

In the Log4j2-ADX connector, we have created a custom strategy (i.e. KustoStrategy) to be used in the RollingFileAppender which can be configured to connect to the ADX cluster. We write the logs into the rolling file to prevent any data loss arising out of network failure while connecting to the ADX cluster. The data will be safely stored in a rolling file and then flushed to the ADX cluster.

Setting up our Log4J ADX Demo Application
Log4j2-ADX connector provides a demo/sample application that can be used to quickly get started with producing logs that can be ingested into the ADX cluster. 

1. Create Azure Data Explorer cluster and database from here
1. Create Azure Active Directory App registration and grant it permissions to the database from here (don't forget to save the app key and the application ID for later)
1. Create a table in Azure Data Explorer which will be used to store log data. For example, we have created a table with the name "log4jTest".


Create a mapping for the table created in Azure Data Explorer. For example, I have created a csv mapping with the name "log4jCsvTestMapping".


Clone the Log4j2-ADX connector git repo
```git bash
git clone https://github.com/Azure/azure-kusto-log4j.git
cd samples
```

Configuring log4J configuration file.
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

```kusto
log4jTest 
| take 10
```

The output of the above KQL query should fetch records as per the screenshot attached below.

 