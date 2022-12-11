---
title: Azure Cosmos DB data connection (Preview)
description: Learn about the Azure Cosmos DB connection.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 12/11/2022
---

# Azure Cosmos DB data optional configuration (Preview)

In this article, you'll learn how to transform data as it's ingested, ingest deleted documents, and get the latest version of ingested documents.

## Transform data with update policies

You can use [table mapping](/azure/data-explorer/ingest-data-cosmos-db-overview.md#data-mapping) to map fields from a Cosmos DB JSON document to your table columns.

[Update policies](kusto/management/updatepolicy.md) are a way to transform data as it's ingested into your table. They are written in Kusto Query Language and are run on the ingestion pipeline. They can be used to transform data from a Cosmos DB change feed ingestion in scenarios such as the following:

- Your documents contain arrays that would be easier to query if they were transformed in multiple rows using the [`mv-expand`](kusto/management/alter-table-update-policy-command.md) operator.
- You want to filter out documents. For example, you can filter out documents by type using the [`where`](kusto/query/whereoperator.md) operator.
- You have complex logic that can't be represented in a table mapping

For information on how to create and manage update policies, see [Update policy overview](kusto/management/alter-table-update-policy-command.md).

## Change feed considerations

The Cosmos DB change feed exposes a full copy of a document when the document is created or updated. However, there are two considerations to keep in mind:

- The change feed doesn't expose *deletion* events. For information on how to handle deleted documents, see [Ingest deleted documents](#ingest-deleted-documents).
- The change feed only exposes the *latest* update of a document.

To understand the ramification of the second consideration, examine the following scenario:

A Cosmos DB container contains documents *A* and *B*. The changes to a property called **foo** are shown in the following table:

| Document ID | Property **foo** | Event | Document timestamp (**_ts**) |
|---|---|---|---|
| A | Red | Creation | 10 |
| B | Blue | Creation | 20 |
| A | Orange | Update | 30 |
| **A** | **Pink** | **Update** | **40** |
| B | Violet | Update | 50 |
| A | Carmine | Update | 50 |
| B | NeonBlue | Update | 70 |

The change feed API is polled by the data connector at regular intervals, typically every few seconds. Each poll contains changes that occurred in the container between calls, *but only the latest version of change per document*.

To illustrate the issue, consider a sequences of API calls with timestamps *15*, *35*, *55*, and *75* as shown in the following table:

| API Call Timestamp | Document ID | Property **foo** | Document timestamp (**_ts**) |
|---|---|---|---|
| 15 | A | Red | 10 |
| 35 | B | Blue | 20 |
| 35 | A | Orange | 30 |
| 55 | B | Violet | 50 |
| 55 | A | Carmine | 60 |
| 75 | B | NeonBlue | 70 |

Comparing the API results to the list of changes made in the Cosmos DB document, you'll notice that they don't match. The update event to document *A*, highlighted in the change table at timestamp 40, doesn't appear in the results of the API call.

To understand why the event does not appear, we'll examine the changes to document *A* between the API calls at timestamps 35 and 55. Between these two calls, document *A* changed twice, as follows:

| Document ID | Property **foo** | Event | Document timestamp (**_ts**) |
|---|---|---|---|
| A | Pink | Update | 40 |
| A | Carmine | Update | 50 |

When the API call at timestamp 55 is made, the change feed API returns the latest version of the document. In this case, the latest version of document *A* is the update at timestamp 50, which is the update to property **foo** from *Pink* to *Carmine*.

Because of this scenario, the data connector may miss some intermediate document changes. For example, some events may be missed if the data connection service is down for a few minutes, or if the frequency of document changes is higher than the API polling frequency. However, the latest state of each document is captured.

## Ingest deleted documents

The Cosmos DB change feed only includes new and updated documents.

//VP: How do you know what to delete?

There are two alternatives to consider to handle deleted documents in Kusto:

1. Use a [soft marker](/azure/cosmos-db/change-feed#change-feed-and-different-operations) to mark a Cosmos DB document as deleted.  You can then simply filter them out in Kusto.
1. Soft delete corresponding table rows using [.delete command](kusto/concepts/data-soft-delete.md).

We strongly recommend the first alternative.  The second alternative requires each delete done in Cosmos DB to be "replayed" as a .delete command issued to Kusto.  This would typically be done by the same application deleting the Cosmos DB documents.  Beyond the software complexity, this alternative doesn't scale to many deletes per second in Kusto.  A workaround could be to issue .delete to delete many rows at once.

## Get the latest versions of documents

Every time a document update is ingested from the change feed, a new row is added in the target table. Over time, the table builds up a history of every document in the corresponding Cosmos DB container. A typical requirement is to query the latest version of a document, corresponds to getting the *current state* of the Cosmos DB container.

You can use the following ways to query the *current state* from your table:

- [Run a query to get the latest versions of documents](#run-a-query-to-get-the-latest-versions-of-documents)
- [Create a materialized view of the latest versions of documents](#create-a-materialized-view-of-the-latest-versions-of-documents)

In the examples, you'll get the latest versions of document by summarizing the table by the **Id** column, using the [arg_max](kusto/query/arg-max-aggfunction.md) function on the **_ts** column to only show the rows with the most recent timestamps.

### Run a query to get the latest versions of documents

Run the following query to get the latest versions of documents:

```kusto
TestTable
| summarize arg_max(_ts, *) by Id
```

If you used soft markers to mark deleted documents, you can filter them out with the following query:

```kusto
TestTable
| summarize arg_max(_ts, *) by Id
| where not(IsDeleted)
```

### Create a materialized view of the latest versions of documents

Running a query manually to get the latest versions of documents may be inefficient if you need to do this often. You can materialize the result of a query using a [materialized view](kusto/management/materialized-views/materialized-view-overview.md), which usually gives you query performance improvements, freshness of data, and reduced cost.

Run the following command to create a materialized view of the latest versions of documents:

```kusto
.create materialized-view LatestDocuments on table TestTable
{
    CosmosChangeFeed1
    | summarize arg_max(_ts, *) by Id
}
```

In a materialized view, you can't filter our soft markers as part of its query. Therefore, to remove deleted documents indicated by soft markers, query the materialized view and filter the results, as follows:

```kusto
LatestDocuments
| where not(IsDeleted)
```

Optionally, you can encapsulated the filtered query in a [stored function](kusto/query/schema-entities/stored-functions.md) and call it to get the latest filtered results, as follows:

```kusto
.create function LatestDocumentsDeletedRemoved(){
    LatestDocuments
    | where not(IsDeleted)
}

LatestDocumentsDeletedRemoved
| summarize sum(Salary) by Area
```

## Next steps
