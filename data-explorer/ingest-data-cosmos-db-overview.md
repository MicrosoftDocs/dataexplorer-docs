---
title: Azure Cosmos DB data connection (Preview)
description: Learn about the Azure Cosmos DB connection.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 11/10/2022
---

# Azure Cosmos DB data connection (Preview)

[Azure Cosmos DB NoSql](/azure/cosmos-db/nosql/) is a fully managed NoSQL and relational database for modern app development.

The Cosmos DB ingestion pipeline transfers Cosmos DB change feed events to Azure Data Explorer.

In this article, we will look at some details about this data connection.

For general information about data ingestion in Azure Data Explorer, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).  See [Ingest data from Azure Cosmos DB into Azure Data Explorer](ingest-data-cosmos-db.md) to learn how to setup a Cosmos DB data connection step by step.

## Data Mapping

You should create a target kusto table and a mapping that suits the schema in the source Cosmos DB container.
For example, if an item in the Cosmos DB container has the following structure:

```json
{
    "id": "17313a67-362b-494f-b948-e2a8e95e237e",
    "creationTime": "2022-04-28T07:36:49.5434296Z",
    "_rid": "pL0MAJ0Plo0CAAAAAAAAAA==",
    "_self": "dbs/pL0MAA==/colls/pL0MAJ0Plo0=/docs/pL0MAJ0Plo0CAAAAAAAAAA==/",
    "_etag": "\"000037fc-0000-0700-0000-626a44110000\"",
    "_attachments": "attachments/",
    "_ts": 1651131409
}
```

//VP:: When is this performed? Is it part of the connection setup?
// Before or after the connection is created?

There are different ingestion options:

1. Control how fields get mapped with an explicite ingestion mapping:

    ````Kusto
    // Table
    .create table TestTable1(Id:string, Name:string, _ts:long, _timestamp:datetime)

    // Mapping
    .create table TestTable ingestion json mapping "DocumentMapping"
    ```
    [
        {"column":"Id","path":"$.id"},
        {"column":"Name","path":"$.name"},
        {"column":"_ts","path":"$._ts"},
        {"column":"_timestamp","path":"$._ts", "transform":"DateTimeFromUnixSeconds"}
    ]
    ```
    ````

1. Ingest first level fields by leveraging the [identity mapping](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/management/mappings#identity-mapping):

    ````Kusto
    // Table
    .create table TestTable2(id:string, name:string, _ts:long)
    ````

1. Ingest the full item to a single dynamic column:

    ````Kusto
    // Table
    .create table TestTable3(Doc:dynamic)

    // Mapping
    .create table TestTable ingestion json mapping "DocumentMapping"
    ```
    [
        { "Column" : "Doc", "Properties":{"Path":"$"}}
    ]
    ```
    ````

We recommend the first alternative.  Specifically, we recommend to map the `_ts` property in Cosmos DB to a `datetime` column in Kusto, so you can run efficient time filters in your Kusto queries. For more information, see [Query best practice](/azure/data-explorer/kusto/query/best-practices).

## Beyond Data Mapping with Update Policies

JSON Data Mapping can map different properties from a Cosmos DB JSON document to a Kusto table.  For more complicated one, you can use [Update Policies](kusto/management/updatepolicy.md).

Here are a couple of examples:

* Your documents might contain an array that would be easier to query if they got flattened in multiple rows using [mv-expand operator](kusto/management/alter-table-update-policy-command.md)
* You might want to filter-out documents (e.g. removing some document types) ; this can be achieved by putting a where-clause in an update policy
* You might have complicated logic that can't be represented in a data mapping

See [Update policy overview](kusto/management/alter-table-update-policy-command.md) for details on how to author and manage an update policy.

## Handling deleted documents

Deleted documents aren't relayed to the ingestion pipeline as the change feed only expose new and updated documents.

There are two alternatives to consider to handle deleted documents in Kusto:

1. Use a [soft marker](/azure/cosmos-db/change-feed#change-feed-and-different-operations) to mark a Cosmos DB document as deleted.  You can then simply filter them out in Kusto.
1. Soft delete corresponding table rows using [.delete command](kusto/concepts/data-soft-delete.md).

We strongly recommend the first alternative.  The second alternative requires each delete done in Cosmos DB to be "replayed" as a .delete command issued to Kusto.  This would typically be done by the same application deleting the Cosmos DB documents.  Beyond the software complexity, this alternative doesn't scale to many deletes per second in Kusto.  A workaround could be to issue .delete to delete many rows at once.

## Latest version of each document

The table ingesting the change feed will contain every documents created and updated in the corresponding Cosmos DB Container.  Each time a document is updated, a new row will be ingested in the target table.

A typical requirement is to query only the latest version of each document.  This essentially corresponds to querying the "current state" of the Cosmos DB container.  There are a few ways to accomplish that.

### Query latest version

This approach computes the latest version of each document at query time.

For the examples of this section, we will assume the data mapping was done so there is an `Id` column and a `_ts` column corresponding to the `id` and `_ts` properties in Cosmos DB documents.

Leveraging [arg_max](kusto/query/arg-max-aggfunction.md), you could write:

```kusto
TestTable
| summarize arg_max(_ts, *) by Id
```

This returns only the latest version of each document.

In the case where we have a [soft marker](/azure/cosmos-db/change-feed#change-feed-and-different-operations) `IsDeleted` on documents we could obtain the latest version of documents, excluding deleted documents with:

```kusto
TestTable
| summarize arg_max(_ts, *) by Id
| where not(IsDeleted)
```

### Materialized view

You can also materialize the result of that query using a [materialized view](kusto/management/materialized-views/materialized-view-overview.md):

```kusto
.create materialized-view LatestDocuments on table TestTable
{
    CosmosChangeFeed1
    | summarize arg_max(_ts, *) by Id
}
```

To take into account an `IsDeleted` soft marker, it isn't possible to do so in a materialized view.  You would need to query on top of the materialized view.  For instance:

```kusto
LatestDocuments
| where not(IsDeleted)
```

This can be encapsulated in a [stored function](kusto/query/schema-entities/stored-functions.md):

```kusto
.create function LatestDocumentsDeletedRemoved(){
    LatestDocuments
    | where not(IsDeleted)
}
```

which can then be used in queries, for instance:

```kusto
LatestDocumentsDeletedRemoved
| summarize sum(Salary) by Area
```

Since parameterless functions do not require parenthesis upon invocation.

## Change feed limitations

Cosmos DB change feed exposes a full copy of a document when the document is created or updated and has the following limitations:

*   It doesn't expose *deletion* events
*   It only exposes the *latest* update of a document

The first limitation is straight forward and is addressed in [this section](#handling-deleted-documents).

The second limitation is more subtle.  Let's consider the following changes happening in a Cosmos DB container.  We will just consider the changes happening to a custom property `foo` inside documents.

Document ID|Property `foo`|Event|Document Timestamp (`_ts`)
-|-|-|-
A|Red|Creation|10
B|Blue|Creation|20
A|Orange|Update|30
A|Pink|Update|40
B|Violet|Update|50
A|Carmine|Update|60
B|NeonBlue|Update|70

In practice, Azure Data Explorer polls the change feed API at regular interval (typically few seconds).  If changes happened in the container between calls, those changes are returned, **but only the latest version of change per document**.

To illustrate this, let's consider a sequences of API calls at timestamps `{15, 35, 65, 75}`.  This would yield the following events:

API Call Timestamp|Document ID|Property `foo`|Document Timestamp (`_ts`)
-|-|-|-
15|A|Red|10
35|B|Blue|20
35|A|Orange|30
65|B|Violet|50
65|A|Carmine|60
75|B|NeonBlue|70

You can observe that the update event at timestamp 40 isn't observed by the sequence of change feed API call.  This is because the API call done at timestamp 65 reads the latest version of document changes at that point in time and the document A was changed at timestamp 40 (`foo=Pink`) and timestamp 60 (`foo=Carmine`):  only the latest version of those changes is observed.

For this reason, Azure Data Explorer cannot guarantee to capture **all changes**.  If the data connection service is down for a few minutes, it might miss updates and even if the service is up, if the frequency of changes is higher than the API polling frequency's, it might miss some updates.

That being said, the latest state of each document is eventually captured.

This data connection cannot guarantee to replicate all changes happening in the container (e.g. as a journal log), but capture most changes in general.

