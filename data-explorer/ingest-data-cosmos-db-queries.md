---
title: Get latest versions of Azure Cosmos DB documents (Preview) - Azure Data Explorer
description: Learn about how to get latest versions of Azure Cosmos DB documents in Azure Data Explorer.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 12/13/2022
---

# Get latest versions of Azure Cosmos DB documents (Preview)

In this article, you'll learn how to get the latest version of ingested documents.

## Get the latest versions of documents

Every time a document update is ingested from the change feed, a new row is added in the target table. Over time, the table builds up a history of every document in the corresponding Cosmos DB container. A typical requirement is to query the latest version of a document, corresponds to getting the *current state* of the Cosmos DB container.

You can use the following ways to query the *current state* from your table:

- [Run a query to get the latest versions of documents](#run-a-query-to-get-the-latest-versions-of-documents)
- [Create a materialized view of the latest versions of documents](#create-a-materialized-view-of-the-latest-versions-of-documents)

In the examples, you'll get the latest versions of document by summarizing the table by the **Id** column, using the [arg_max](kusto/query/arg-max-aggfunction.md) function on the `_timestamp` column to only show the rows with the most recent timestamps.

Here we assume you have mapped the `_timestamp` column to the Cosmos DB native `_ts` with a `DateTimeFromUnixSeconds` in order to get the timestamp in `datetime` format (as we did [here](ingest-data-cosmos-db-connection#step-1-choose-an-azure-data-explorer-table-and-configure-its-table-mapping)).  This makes the query / materialized view more performant.  If you haven't, it would still work on a long `_ts` column but will be less efficient.

### Run a query to get the latest versions of documents

Run the following query to get the latest versions of documents:

```kusto
TestTable
| summarize arg_max(_timestamp, *) by Id
```

If you used soft markers to mark deleted documents, you can filter them out with the following query:

```kusto
TestTable
| summarize arg_max(_timestamp, *) by Id
| where not(IsDeleted)
```

### Create a materialized view of the latest versions of documents

If your Cosmos DB container has a lot of updates, the query to get the latest versions of documents can be slow. [Materialized views](kusto/management/materialized-views/materialized-view-overview.md) usually have better performance than a query if there are a lot of updates. If the query is frequently run, using a materialized view can be beneficial and save cost.

Run the following command to create a materialized view of the latest versions of documents:

```kusto
.create materialized-view LatestDocuments on table TestTable
{
    CosmosChangeFeed1
    | summarize arg_max(_timestamp, *) by Id
}
```

In a materialized view, you can't filter our soft markers as part of its query. Therefore, to remove deleted documents indicated by soft markers, query the materialized view and filter the results, as follows:

```kusto
LatestDocuments
| where not(IsDeleted)
```

Optionally, encapsulate the filtered query in a [stored function](kusto/query/schema-entities/stored-functions.md) and call it to get the latest filtered results, as follows:

```kusto
.create function LatestDocumentsDeletedRemoved(){
    LatestDocuments
    | where not(IsDeleted)
}

LatestDocumentsDeletedRemoved
| summarize sum(Salary) by Area
```

## Next steps

- [Kusto Query Language (KQL) overview](kusto/query/index.md)
