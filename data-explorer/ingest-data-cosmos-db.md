---
title: Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)
description: Learn how to ingest (load) data into Azure Data Explorer from Cosmos DB.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 21/11/2022
---

# Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)

Azure Data Explorer supports [data ingestion](ingest-data-overview.md) from Azure Cosmos DB using a [change feed](/azure/cosmos-db/change-feed). The Cosmos DB change feed data connection is an ingestion pipeline that listens to your Cosmos DB change feed and ingests the data into your cluster. The change feed listens for new and updated documents but does not log deletes.

Each data connection listens to a specific Cosmos DB container and ingests data into a specified table. The ingestion method defaults to using streaming ingestion when enabled, otherwise it falls back to using queued ingestion.

## Prerequisites

// What are the prereqs?

## Create a data connection

// Where are the How-to steps ... i.e. where does the customer set up the connection?
// Probably move this down

> [!IMPORTANT]
> The data connection creates a container under the Cosmos DB database with the name *adx-connection-lease-DATA_CONNECTION_NAME*, where *DATA_CONNECTION_NAME* is the name identifying the data connection. This container is required for the proper functioning of the data connection and must not be modified.

### Data connection properties

The following table describes the properties for a data connection:

| Property Name | Description |
|---|---|
| *Connection name* | The name to identify this data connection |
| *Database* | The case-sensitive name of the existing target database |
| *Table* | The case-sensitive name of the existing target table |
| *Ingestion mapping reference* | Optional. Name of the existing [ingestion mapping](kusto/management/create-ingestion-mapping-command.md) to be used |
| *Cosmos DB subscription ID* | The subscription ID of the Cosmos DB account |
| *Cosmos DB resource group* | The resource group of the Cosmos DB account used to create the data connection |
| *Cosmos DB account endpoint* | The Cosmos DB account endpoint. For example, `https://contoso.documents.azure.com:443/` |
| *Cosmos DB database* | The name of the source database in the Cosmos DB account. |
| *Cosmos DB container* | The name of the source container in the Cosmos DB account. |
| *Start time* | Optional. If defined, the data connection retrieves Cosmos DB documents created or updated after the specified retrieval start date. |

## Permissions

The data connection uses your cluster's system-assigned managed identity for access to read from the Cosmos DB.

Use the following steps to grant the identity access to the Cosmos DB account:

1. In the Azure portal, browse to your Cosmos DB account.
1. In the left menu, select **Access control (IAM)** > **Add role assignments**.
1. Select **DocumentDB Account Contributor** and then select **Next**.
1. Under **Assign access to**, select **Managed identity**.
1. Under **Members**, select **Select members**.
1. In the **Select managed identity** pane, select your cluster's managed identity and the select **Select**.
1. Select **Review + assign** to complete the assignment.

## Table and Mapping

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

There are different ingestion options:

1. Ingest all the first level fields - by creating table using the command and ingest it without specifying mapping:

    ```Kusto
    .create-merge table CosmosChangeFeed1 (['id']:string, creationTime:datetime, ['_rid']:string, ['_self']:string, ['_etag']:string, ['_attachments']:string, ['_ts']:long)
    ```

1. Ingest only part of the fields - by creating  table and mapping with the commands:

    ```Kusto
    // Table
    .create-merge table CosmosChangeFeed2 (id:string , creationTime:datetime)

    // Mapping
    .create-or-alter table CosmosChangeFeed2 ingestion json mapping "CosmosChangeFeedMapping"
    '['
    '    { "column" : "id", "Properties":{"Path":"$.id"}},'
    '    { "column" : "creationTime", "Properties":{"Path":"$.creationTime"}}'
    ']'
    ```

1. Ingest the full item to a single dynamic column - by creating  table and mapping with the commands:

    ```Kusto
    // Table
    .create table CosmosChangeFeed3(Doc:dynamic)

    // Mapping
    .create-or-alter table CosmosChangeFeed1 ingestion json mapping "CosmosChangeFeedDynamicMapping"
    '['
    '    { "Column" : "Doc", "Properties":{"Path":"$"}}
    ']'
    ```

## Mapping Timestamp

Cosmos DB SQL API has a special property `_ts` for the timestamp of the last change on a document.  The timestamp is expressed in [UNIX seconds](https://en.wikipedia.org/wiki/Unix_time).

It makes sense to land that property in a `long` column in Kusto.  It is useful to have the "original" timestamp (in UNIX seconds) for comparison with original documents in Cosmos DB containers.

An [important Kusto optimisation](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/best-practices) (time filter) is based on the [`datetime` Kusto type](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/scalar-data-types/datetime).  In order for time filters to be effective on large datasets (multiple GBs of ingested data), you need to filter on a `datetime` column.

You can map the `_ts` to a `datetime` column using the `DateTimeFromUnixSeconds` [mapping transformation](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/management/mappings#mapping-transformations).

We recommend using the column name `_timestamp` for the Kusto column having `_ts` mapped as `datetime` because that name isn't used by Cosmos DB nor Kusto (see [naming conventions to avoid collisions in Kusto](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/schema-entities/entity-names#naming-your-entities-to-avoid-collisions-with-kusto-language-keywords)).

## Beyond Data Mapping with Update Policies

Kusto Data Mapping can only do straightforward mapping.  For more complicated one, you can use [Update Policies](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/management/updatepolicy).

Here are a couple of examples:

* You might want to filter-out documents (e.g. removing some document types) ; this can be achieved by putting a where-clause in an update policy
* Flattening an array can be accomplish by using [mv-expand operator](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/management/alter-table-update-policy-command) on the array

## Handling deleted documents

Deleted documents aren't relayed to the ingestion pipeline as the change feed only expose new and updated documents.

There are two alternatives to consider to handle deleted documents in Kusto:

1.  Soft delete corresponding table rows using [.delete command](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/concepts/data-soft-delete).
1.  Use a [soft marker](https://docs.microsoft.com/en-us/azure/cosmos-db/change-feed#change-feed-and-different-operations) to mark a Cosmos DB document as deleted

The first alternative requires that each delete done in Cosmos DB is match with a .delete command issued to Kusto.  This alternative doesn't scale to many deletes per second in Kusto.  A workaround could be to issue .delete to delete many rows at once.

## Latest version of each document

The target table will contain every documents created and updated in the corresponding Cosmos DB Container.  Each time a document is updated, a new row will be ingested in the target table.

For the examples of this section, we will assume the data mapping was done so there is an `id` column and a `_ts` column corresponding to the `id` and `_ts` properties in Cosmos DB documents.

In order to view only the latest version of each document, you could write the following query, leveraging [arg_max](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/arg-max-aggfunction):

```kusto
CosmosChangeFeed1
| summarize arg_max(_ts, *) by id
```

This queries the latest version of each document.

In the case where we have a [soft marker](https://docs.microsoft.com/en-us/azure/cosmos-db/change-feed#change-feed-and-different-operations) `IsDeleted` on documents we could obtain the latest version of documents, excluding deleted documents with:

```kusto
CosmosChangeFeed1
| summarize arg_max(_ts, *) by id
| where not(IsDeleted)
```

You can also materialize the result of that query using a [materialized view](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/management/materialized-views/materialized-view-overview):

```kusto
.create materialized-view LatestDocuments on table CosmosChangeFeed1
{
    CosmosChangeFeed1
    | summarize arg_max(_ts, *) by id
}
```

To take into account an `IsDeleted` soft marker, it isn't possible to do so in a materialized view today.  For this we would need a query on top of the materialized view.  For instance:

```kusto
LatestDocuments
| where not(IsDeleted)
```

This can be encapsulated in a [stored function](https://docs.microsoft.com/en-us/azure/data-explorer/kusto/query/schema-entities/stored-functions).

