---
title: 'Ingest data using the Azure Data Explorer Node library'
description: In this article, you learn how to ingest (load) data into Azure Data Explorer using Node.js.
ms.reviewer: mblythe
ms.topic: how-to
ms.date: 09/14/2022

# Customer intent: As a Node.js developer, I want to ingest data into Azure Data Explorer so that I can query data to include in my apps.
---

# Ingest data using the Azure Data Explorer Node library

> [!div class="op_single_selector"]
> * [.NET](net-sdk-ingest-data.md)
> * [Python](python-ingest-data.md)
> * [Node](node-ingest-data.md)
> * [Go](go-ingest-data.md)
> * [Java](java-ingest-data.md)

Azure Data Explorer is a fast and highly scalable data exploration service for log and telemetry data. Azure Data Explorer provides two client libraries for Node: an [ingest library](https://github.com/Azure/azure-kusto-node/tree/master/packages/azure-kusto-ingest) and [a data library](https://github.com/Azure/azure-kusto-node/tree/master/packages/azure-kusto-data). These libraries enable you to ingest (load) data into a cluster and query data from your code. In this article, you first create a table and data mapping in a test cluster. You then queue ingestion to the cluster and validate the results.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
* [Node.js](https://nodejs.org/en/download/) installed on your development computer

## Install the data and ingest libraries

Install *azure-kusto-ingest* and *azure-kusto-data*

```bash
npm i azure-kusto-ingest@^3.3.2 azure-kusto-data@^3.3.2
```

## Add import statements and constants

Import classes from the libraries

```javascript

const { Client: KustoClient, KustoConnectionStringBuilder } =  require('azure-kusto-data');
const {
    IngestClient: KustoIngestClient,
    IngestionProperties,
    IngestionDescriptors,
    DataFormat,
    IngestionMappingKind,
} =  require("azure-kusto-ingest");

```
To authenticate an application, Azure Data Explorer uses your Microsoft Entra tenant ID. To find your tenant ID, follow [Find your Microsoft 365 tenant ID](/onedrive/find-your-office-365-tenant-id).

Set the values for `authorityId`, `kustoUri`, `kustoIngestUri` and `kustoDatabase` before running this code.

```javascript
const cluster = "MyCluster";
const region = "westus";
const authorityId = "microsoft.com";
const kustoUri = `https://${cluster}.${region}.kusto.windows.net`;
const kustoIngestUri = `https://ingest-${cluster}.${region}.kusto.windows.net`;
const kustoDatabase  = "Weather";
```

Now construct the connection string. This example uses device authentication to access the cluster. Check the console output to complete the authentication. You can also use a Microsoft Entra application certificate, application key, and user and password.

You create the destination table and mapping in a later step.

```javascript
const kcsbIngest = KustoConnectionStringBuilder.withAadDeviceAuthentication(kustoIngestUri, authorityId);
const kcsbData = KustoConnectionStringBuilder.withAadDeviceAuthentication(kustoUri, authorityId);
const destTable = "StormEvents";
const destTableMapping = "StormEvents_CSV_Mapping";
```

## Set source file information

Import more classes and set constants for the data source file. This example uses a sample file hosted on Azure Blob Storage. The **StormEvents** sample dataset contains weather-related data from the [National Centers for Environmental Information](https://www.ncei.noaa.gov/).

```javascript
const container = "samplefiles";
const account = "kustosamples";
const sas = "";  // If relevant add SAS token
const filePath = "StormEvents.csv";
const blobPath = `https://${account}.blob.core.windows.net/${container}/${filePath}${sas}`;
```

## Create a table on your test cluster

Create a table that matches the schema of the data in the `StormEvents.csv` file. When this code runs, it returns a message like the following: *To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code XXXXXXXXX to authenticate*. Follow the steps to sign in, then return to run the next code block. Subsequent code blocks that make a connection will require you to sign in again.

```javascript
const kustoClient = new KustoClient(kcsbData);
const createTableCommand = `.create table ${destTable} (StartTime: datetime, EndTime: datetime, EpisodeId: int, EventId: int, State: string, EventType: string, InjuriesDirect: int, InjuriesIndirect: int, DeathsDirect: int, DeathsIndirect: int, DamageProperty: int, DamageCrops: int, Source: string, BeginLocation: string, EndLocation: string, BeginLat: real, BeginLon: real, EndLat: real, EndLon: real, EpisodeNarrative: string, EventNarrative: string, StormSummary: dynamic)`;

const createTableResults = await kustoClient.executeMgmt(kustoDatabase, createTableCommand);
console.log(createTableResults.primaryResults[0].toJSON().data);
```

## Define ingestion mapping

Map incoming CSV data to the column names and data types used when creating the table.

```javascript
const createMappingCommand = `.create table ${destTable} ingestion csv mapping '${destTableMapping}' '[{"Name":"StartTime","datatype":"datetime","Ordinal":0}, {"Name":"EndTime","datatype":"datetime","Ordinal":1},{"Name":"EpisodeId","datatype":"int","Ordinal":2},{"Name":"EventId","datatype":"int","Ordinal":3},{"Name":"State","datatype":"string","Ordinal":4},{"Name":"EventType","datatype":"string","Ordinal":5},{"Name":"InjuriesDirect","datatype":"int","Ordinal":6},{"Name":"InjuriesIndirect","datatype":"int","Ordinal":7},{"Name":"DeathsDirect","datatype":"int","Ordinal":8},{"Name":"DeathsIndirect","datatype":"int","Ordinal":9},{"Name":"DamageProperty","datatype":"int","Ordinal":10},{"Name":"DamageCrops","datatype":"int","Ordinal":11},{"Name":"Source","datatype":"string","Ordinal":12},{"Name":"BeginLocation","datatype":"string","Ordinal":13},{"Name":"EndLocation","datatype":"string","Ordinal":14},{"Name":"BeginLat","datatype":"real","Ordinal":16},{"Name":"BeginLon","datatype":"real","Ordinal":17},{"Name":"EndLat","datatype":"real","Ordinal":18},{"Name":"EndLon","datatype":"real","Ordinal":19},{"Name":"EpisodeNarrative","datatype":"string","Ordinal":20},{"Name":"EventNarrative","datatype":"string","Ordinal":21},{"Name":"StormSummary","datatype":"dynamic","Ordinal":22}]'`;

const mappingCommandResults = await kustoClient.executeMgmt(kustoDatabase, createMappingCommand);
console.log(mappingCommandResults.primaryResults[0].toJSON().data);
```

## Queue a message for ingestion

Queue a message to pull data from blob storage and ingest that data into Azure Data Explorer.

```javascript
const defaultProps  = new IngestionProperties({
    database: kustoDatabase,
    table: destTable,
    format: DataFormat.CSV,
    ingestionMappingReference: destTableMapping,
    ingestionMappingKind: IngestionMappingKind.CSV,
    additionalProperties: {ignoreFirstRecord: true},
});

const ingestClient = new KustoIngestClient(kcsbIngest, defaultProps);
// All ingestion properties are documented here: https://learn.microsoft.com/azure/kusto/management/data-ingest#ingestion-properties

const blobDesc = new BlobDescriptor(blobPath, 10);
try {
	const ingestionResult = await ingestClient.ingestFromBlob(blobDesc, null);
} catch (err) {
	// Handle errors
}
```

## Validate that table contains data

Validate that the data was ingested into the table. Wait for five to ten minutes for the queued ingestion to schedule the ingest and load the data into Azure Data Explorer. Then run the following code to get the count of records in the `StormEvents` table.

```javascript
const query = `${destTable} | count`;

var tableResults = await kustoClient.execute(kustoDatabase, query);
console.log(tableResults.primaryResults[0].toJSON().data);

```

## Run troubleshooting queries

Sign in to [https://dataexplorer.azure.com](https://dataexplorer.azure.com) and connect to your cluster. Run the following command in your database to see if there were any ingestion failures in the last four hours. Replace the database name before running.
    
```Kusto
.show ingestion failures
| where FailedOn > ago(4h) and Database == "<DatabaseName>"
```

Run the following command to view the status of all ingestion operations in the last four hours. Replace the database name before running.

```Kusto
.show operations
| where StartedOn > ago(4h) and Database == "<DatabaseName>" and Operation == "DataIngestPull"
| summarize arg_max(LastUpdatedOn, *) by OperationId
```

## Clean up resources

If you plan to follow our other articles, keep the resources you created. If not, run the following command in your database to clean up the `StormEvents` table.

```Kusto
.drop table StormEvents
```

## Related content

* [Write queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
