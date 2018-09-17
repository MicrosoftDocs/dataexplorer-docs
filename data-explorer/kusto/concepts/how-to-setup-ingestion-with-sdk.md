---
title: How-To -  Set up Batched (queued) Ingestion with Kusto .NET SDK - Azure Kusto | Microsoft Docs
description: This article describes How-To -  Set up Batched (queued) Ingestion with Kusto .NET SDK in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# How-To: Set up Batched (queued) Ingestion with Kusto .NET SDK

This example demonstrates how to ingest data to Kusto using the **queued ingestion** method.
In this walkthrough, we will be using the [Kusto.Ingest client library](../api/netfx/about-kusto-ingest.md);
Specifically, queued ingestion is done using the [KustoQueuedIngestClient](../api/netfx/kusto-ingest-client-reference.md#class-kustoqueuedingestclient).

## Prerequisites
* Please make sure you install [Kusto Web Explorer](http://aka.ms/nkwe) or [Kusto Explorer](http://aka.ms/Kusto.Explorer)

## Step 1: Create database and table
* The first step is to create a database for your ingestion experiments on your cluster. This can be done via [Azure Portal](https://portal.azure.com)

* Next you should create the table for your data. Please see the documentation on [Create Table command](../management/tables.md#create-table).
This operation can be performed either with [Kusto Web Explorer](http://aka.ms/nkwe) or [Kusto Explorer](http://aka.ms/Kusto.Explorer)

## Step 2: Set up user/app access
* Now that you succeeded and you now have created table `Table001` in your DB `TestDB001` (names are just an example) on your cluster,
  it's time to decide what AuthN type you’d like to work with – AAD User (interactive) or Application.
  For the matter of early experiments and small volumes, User AuthN would do. If you have created the database yourself, you already have sufficient privileges to create tables and ingest data to it.

* If you need help setting up App AuthN for unattended access, you should either create a new AAD App or reuse an existing one in case you have it.
  Detailed documentation on Kusto AAD Authentication can be found in [Kusto Guide to AAD Authentication](../management/access-control/how-to-authenticate-with-aad.md).

* If you have provisioned an AAD app for unattended ingestion, you now need to grant this application `ingestor` permission on the database or the table you are planning to ingest data into.
    Add one or more `ingestor` principals:
    ```kusto
  .add database <DB> ingestors  (Principal ,...) ['Description']
  .add table <Table> ingestors  (Principal ,...) ['Description']
  ```

## Step 3: Get Kusto.Ingest package
* Download the latest version of Kusto [.NET SDK](../api/netfx/about-the-sdk.md)

## Step 4: Write your own ingestion code
* Now that we have everything prepared, it’s time to create your ingest client and try to actually get some data to the table.
  The following code snippets demonstrate ungesting using AAD App authentication (top) and AAD user authentication, which will present a pop-up (bottom)

```csharp
string dbName = "TestDB001";
string tableName = "Table001";

// Create a connection string pointing at the ingestion service
var kcsbDM = new KustoConnectionStringBuilder(@"https://ingest-<your cluster name>.kusto.windows.net:443") { FederatedSecurity = true, ApplicationClientId = <AppId>, ApplicationKey = <Secret> };
// Create the ingest client
using (var ingestClient = new KustoQueuedIngestClient(kustoDMConnectionString: kcsbDM))
{
    // Define basic ingestion properties
    var ingestProps = new KustoQueuedIngestionProperties(dbName, tableName);
    // Issue an ingest command
    ingestClient.IngestFromXXX(…, ingestProps);
}
```

## Step 5: Query your data
* Now that we have everything prepared, it’s time to create your ingest client and try to actually get some data to the table.
  The following code snippets demonstrate ungesting using AAD App authentication (top) and AAD user authentication, which will present a pop-up (bottom)

```csharp
string dbName = "TestDB001";
string tableName = "Table001";

// Create a connection string pointing at the Kusto resource
var kcsbDM = new KustoConnectionStringBuilder(@"https://<your cluster name>.kusto.windows.net:443") { FederatedSecurity = true };
// Create the query client
using (var queryClient = KustoClientFactory.CreateCslQueryProvider(kcsb))
{
    // Run query and get the results (count the number of rows)
    var results = queryClient.ExecuteQuery(dbName, $"{tableName} | count", null);
}
```

## Appendix
* [Full documentation on Microsoft.Azure.Kusto.Ingest library](../api/netfx/about-kusto-ingest.md)
* [Full documentation on Microsoft.Azure.Kusto.Data library](../api/netfx/about-kusto-data.md)
* [Ingestion best practices](../api/netfx/kusto-ingest-best-practices.md)