---
title: Ingest data in Azure Data Explorer using the Apache Log4J 2 connector
description: Learn how to use the Apache Log4J 2 connector in Azure Data Explorer.
ms.date: 01/15/2023
ms.topic: how-to
ms.reviewer: ramacg
---
## 

Apache Log4J 2 sink for Azure Data Explorer allows you to easily stream your log data to Azure Data Explorer, where you can analyze, visualize, and alert on your logs in real time. Log4j2 is widely used as logging tool. Kusto implementation is used in conjunction with RollingFileAppender with KustoStrategy. The key reason for using a strategy is to have redundancy in storage of logs and re-transmit the log files. To provide data transmission redundancy, the rolled over log files are transmitted to Kusto. Transmission of the files are attempted 3 times with a configured time window

## Prerequisites

## Supported authentication methods

## Create tables

## RollingFileAppender

https://logging.apache.org/log4j/2.x/manual/appenders.html#RollingFileAppender

The key parameters for rolling file are as documented in the Rolling file log4j configuration

fileName: The file name where the log files will be written locally. This is a fully qualified path and not a relative path (e.g C:/logs/logs.log)
filePattern: The rolled over file name with pattern. This is a fully qualified path and not a relative path (e.g C: /logs/logs-%d{yyyy-MM-dd-hh-mm-ss}-%i.log)
Configurations for using the Kusto log4j appender is as follows

KustoStrategy

- clusterIngestUrl: Ingest URL. Configured using environment variable LOG4J2_ADX_INGEST_CLUSTER_URL
- appId: Service principal application id. Configured using environment variable LOG4J2_ADX_APP_ID
- appKey: Service principal application secret. Configured using environment variable LOG4J2_ADX_APP_KEY
- appTenant: Tenant for the Service principal. Configured using environment variable LOG4J2_ADX_TENANT_ID
- dbName: Database name. Configured using environment variable LOG4J2_ADX_DB_NAME
- tableName: Table name for ingesting the logs
- logTableMapping: Mapping defined in the database to map the log data
- mappingType: json (or) csv is currently supported. Defaults to csv
- flushImmediately: Boolean indicator to flush the logs immediately. Defaults to false. Note that making this true may cause additional load on the cluster
- proxyUrl: Proxy url in case application is hosted behind a proxy

To attempt retries in case of ingestion failures, retransmission is attempted with the following configuration. 3 retries are attempted to ingest the logs. In the event that the file cannot be ingested it gets moved to the backout directory in the same path defined in fileName

- backOffMinMinutes: Min minutes to back off in the event that ingestion fails
- backOffMaxMinutes: Max minutes to back off in the event that ingestion fails

```
<Configuration status="WARN">
    <Appenders>
        <RollingFile name="ADXRollingFile" fileName="<fileName>"
                     filePattern="<filePattern>">
            <KustoStrategy
                    clusterIngestUrl="${env:LOG4J2_ADX_INGEST_CLUSTER_URL}"
                    appId="${env:LOG4J2_ADX_APP_ID}"
                    appKey="${env:LOG4J2_ADX_APP_KEY}"
                    appTenant="${env:LOG4J2_ADX_TENANT_ID}"
                    dbName="${env:LOG4J2_ADX_DB_NAME}"
                    tableName=""
                    logTableMapping=""
                    mappingType=""
                    flushImmediately=""
                    proxyUrl=""
                    backOffMinMinutes=""
                    backOffMaxMinutes=""
            />
            <CsvLogEventLayout delimiter="," quoteMode="ALL"/>
            <!-- References policies from https://logging.apache.org/log4j/2.x/manual/appenders.html -->
            <Policies>
              <!-- Recommended size is 4 MB -->
                <SizeBasedTriggeringPolicy size="4 MB"/>
              <!-- 
              The interval determines in conjunction with file pattern the time for rollup. If file has pattern
              file-yyyy-MM-dd-hh-mm.log then rollover happens evey 5 minutes (interval below)
              With a date pattern file-yyyy-MM-dd-hh.log with hours as the most specific item, rollover would happen
              every 5 hours 
              -->
                <TimeBasedTriggeringPolicy interval="5" modulate="true"/>
            </Policies>
        </RollingFile>
    </Appenders>
    <Loggers>
        <Root level="debug" additivity="false">
            <AppenderRef ref="ADXRollingFile"/>
        </Root>
    </Loggers>
</Configuration>
```

## How to build

```powershell
$env:LOG4J2_ADX_DB_NAME="<db-name>"
$env:LOG4J2_ADX_TENANT_ID="<tenant-id>"                   
$env:LOG4J2_ADX_INGEST_CLUSTER_URL="https://ingest-<cluster>.kusto.windows.net"
$env:LOG4J2_ADX_APP_ID="<app-id>"
$env:LOG4J2_ADX_APP_KEY="<app-key>" 
```

```powershell
mvn clean compiler:compile compiler:testCompile surefire:test
```

## Maven coordinates

```maven
<dependency>
    <groupId>com.microsoft.azure.kusto</groupId>
    <artifactId>azure-kusto-log4j</artifactId>
    <version>1.0.0</version>
</dependency>
```

The library expects that log4j-core is provided as a dependency in the application. This needs to be included as a dependency, this provides flexibility in using a custom log4j version core library in the application.

```
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>${log4j.version}</version>
</dependency>
```



----

Logging is an essential component of any good software development process. Through logging, we can detect and fix issues, understand the behavior of users, and obtain valuable business insights. However, logging involves many complex problems that we need to solve, and it would be best if we didn’t do it all alone. The best practice often is to employ one of the many logging frameworks that are at your disposal. This will enable you to focus on improving your app and delivering value for your users, while the framework does all the heavy lifting. One such framework is the Apache Log4j 2.

 

What is Log4j?

Log4j is a popular logging framework for Java applications maintained by the Apache Foundation. Log4j allows developers to control which log statements are output with arbitrary granularity based on the logger's name, logger level, and message pattern.

 

Log4j2 is an improvement over its predecessor, Log4j with its main benefits are:

API independent of implementation
Better support for concurrency
Easy to extend by building custom components
The architecture of log4j2 consists of the following components:

Configuration: This component is responsible for reading the configuration file and setting up the logging system based on the specified parameters.

Loggers: These components generate log messages and send them to the appenders for further processing.

Appenders: These are the components that receive the log messages from the loggers and write them to a specific destination, such as a file, console, or database.

Filters: These components determine whether a log message should be processed or discarded based on specified criteria.

Layouts: These components are responsible for formatting the log messages in a specific way before they are written to the destination.

Plugins: These components allow the system to be extended with additional functionality, such as custom appenders or filters.

 

thumbnail image 1 of blog post titled 
	
	
	 
	
	
	
				
		
			
				
						
							Getting started with Apache Log4j and Azure Data Explorer
							
						
					
			
		
	
			
	
	
	
	
	

 Figure 1: Log4J Reference Architecture (source: logging.apache.org)

 

One of the options for storing log data is to send it to a managed data analytics service, such as Azure Data Explorer (ADX). 

In the Log4j2-ADX connector, we have created a custom strategy (i.e. KustoStrategy) to be used in the RollingFileAppender which can be configured to connect to the ADX cluster. We write the logs into the rolling file to prevent any data loss arising out of network failure while connecting to the ADX cluster. The data will be safely stored in a rolling file and then flushed to the ADX cluster.

Setting up our Log4J ADX Demo Application
Log4j2-ADX connector provides a demo/sample application that can be used to quickly get started with producing logs that can be ingested into the ADX cluster. 

1. Create Azure Data Explorer cluster and database from here
1. Create Azure Active Directory App registration and grant it permissions to the database from here (don't forget to save the app key and the application ID for later)
1. Create a table in Azure Data Explorer which will be used to store log data. For example, we have created a table with the name "log4jTest".

```kusto
.create table log4jTest (timenanos:long,timemillis:long,level:string,threadid:string,threadname:string,threadpriority:int,formattedmessage:string,loggerfqcn:string,loggername:string,marker:string,thrownproxy:string,source:string,contextmap:string,contextstack:string)
```

Create a mapping for the table created in Azure Data Explorer. For example, I have created a csv mapping with the name "log4jCsvTestMapping".

```kusto
.create table log4jTest ingestion csv mapping 'log4jCsvTestMapping' '[{"Name":"timenanos","DataType":"","Ordinal":"0","ConstValue":null},{"Name":"timemillis","DataType":"","Ordinal":"1","ConstValue":null},{"Name":"level","DataType":"","Ordinal":"2","ConstValue":null},{"Name":"threadid","DataType":"","Ordinal":"3","ConstValue":null},{"Name":"threadname","DataType":"","Ordinal":"4","ConstValue":null},{"Name":"threadpriority","DataType":"","Ordinal":"5","ConstValue":null},{"Name":"formattedmessage","DataType":"","Ordinal":"6","ConstValue":null},{"Name":"loggerfqcn","DataType":"","Ordinal":"7","ConstValue":null},{"Name":"loggername","DataType":"","Ordinal":"8","ConstValue":null},{"Name":"marker","DataType":"","Ordinal":"9","ConstValue":null},{"Name":"thrownproxy","DataType":"","Ordinal":"10","ConstValue":null},{"Name":"source","DataType":"","Ordinal":"11","ConstValue":null},{"Name":"contextmap","DataType":"","Ordinal":"12","ConstValue":null},{"Name":"contextstack","DataType":"","Ordinal":"13","ConstValue":null}]'
```

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

 