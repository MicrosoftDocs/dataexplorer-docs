---
title: Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)
description: Learn how to ingest (load) data into Azure Data Explorer from Cosmos DB.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 11/08/2022
---

# Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)

Azure Data Explorer supports [data ingestion](ingest-data-overview.md) from [Azure Cosmos DB for NoSql](/azure/cosmos-db/nosql/) using a [change feed](/azure/cosmos-db/change-feed). The Cosmos DB change feed data connection is an ingestion pipeline that listens to your Cosmos DB change feed and ingests the data into your cluster. The change feed listens for new and updated documents but does not log deletes.

Each data connection listens to a specific Cosmos DB container and ingests data into a specified table. The ingestion method supports streaming ingestion (when enabled) and batch ingestion.

In the article, you'll learn how to set up a Cosmos DB change feed data connection and ingest data into Azure Data Explorer. Follow the steps below to set up a connector.

Step 1: Choose or create an Azure Data Explorer table to ingest data into

Step 2: Configure table mapping

Step 3: Configure access to read from Cosmos DB using managed identities

Step 4: Create a Cosmos DB change feed data connection

//VP:: The rest of the topics we'll move to another article and use them as next steps
//Shlomo:  If we do that (which sounds like a good idea), I would suggest to push the update policy into the other article as well.  This way we could keep this article as "the simplest use case".
//Shlomo:  something like that?  https://learn.microsoft.com/en-us/azure/data-explorer/ingest-data-event-hub-overview

## Prerequisites

//VP:: What are the prereqs?

- An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
- An existing or new [cluster and database](create-cluster-database-portal.md).
- An existing container from a [Cosmos DB account for NoSql](/azure/cosmos-db/nosql/)

## Step 1: Choose or create an Azure Data Explorer table

//Shlomo:  https://learn.microsoft.com/en-us/azure/data-explorer/ingest-data-event-hub#create-a-target-table-in-azure-data-explorer goes with screen shots to show how to execute a command.  I don't know if that is necessary?

Execute the following KQL command in the context of the database you want to create a table:

```kql
.create table TestTable (Name:string, Id:string, _ts:long, _timestamp:datetime) 
```

## Step 2: Configure table mapping

Execute the following KQL command in the context of the same database you created the table:

````kql
.create table TestTable ingestion json mapping "DocumentMapping"
```
[
    {"column":"Name","path":"$.Name"},
    {"column":"Id","path":"$.id"},
    {"column":"_ts","path":"$._ts"},
    {"column":"_timestamp","path":"$._ts", "transform":"DateTimeFromUnixSeconds"}
]
```
````

Here we map a custom property `Name` from a Cosmos DB JSON document to the column `Name` in our Kusto Table.  We then map the mandatory Cosmos DB JSON properties `id` and `_ts` to the table's column `Id` and `_ts`.  Finally we map the Cosmos DB JSON properties `_ts` (again) to the table's column `_timestamp`.  Since `_timestamp` is of type `datetime` while `_ts` is expressed in [UNIX seconds](https://en.wikipedia.org/wiki/Unix_time), we apply a transformation.

> [!NOTE]
> 
> We recommend to have a `datetime` column corresponding to the transform of `_ts` in Cosmos DB to enable efficient time filters (see [Query best practice](/azure/data-explorer/kusto/query/best-practices)).  Keeping the `_ts` column often makes sense to reconciliate data with Cosmos DB.

## Step 3: Configure access to read from Cosmos DB using managed identities

Cosmos DB Data Connection supports only [Managed Identities](/azure/data-explorer/managed-identities-overview) authentication (it doesn't support Cosmos DB access keys authentication).

For a managed identity to be used by a Cosmos DB connection you need to do two sub steps:

1.  Allow the managed identity to be used with [DataConnection](/azure/data-explorer/kusto/management/managed-identity-policy#managed-identity-usages) with a [Managed Identity Policy](/azure/data-explorer/kusto/management/managed-identity-policy)
2.  Give the managed identity RBAC permission to access Cosmos DB

> [!Note]
> If you use the Portal to create the data connection, those two sub steps are done automatically.

In this article, you will use the *system* managed identity (as opposed to a user system identity).

For the first sub step, execute the following command:

````kql
.alter database db policy managed_identity
```
[
  {
    "ObjectId": "system",
    "AllowedUsages": "DataConnection"
  }
]
```
````

This allows the *system* managed identity to be used in data connections.

For the second sub step, you can't do that in the Azure Portal since the Cosmos DB role isn't exposed as an Azure role.

Using Azure CLI:

```
az cosmosdb sql role assignment create --account-name <cosmos db account name> --resource-group <cosmos db resource group> --role-definition-id 00000000-0000-0000-0000-000000000001 --principal-id <ADX cluster principal id> --scope "/"
```

Using PowerShell:

```
TBD
```

Your ADX cluster principal id can be found [on the Azure portal](/azure/data-explorer/configure-managed-identities-cluster#add-a-system-assigned-identity).

> [!Note]
> The role used here is [Cosmos DB Built-in Data Reader](https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-setup-rbac#built-in-role-definitions).  Technically, only the action [Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed](https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-setup-rbac#permission-model) is required, so it is possible to define a custom role with only that action and assign it to the managed identity.

Step 4: Create a Cosmos DB change feed data connection

//Shlomo:  content is coming, neither options are available to me at this very moment.  It would be nice to have a 2 pane setup, although the panes will contain more than code (e.g. the Azure Portal will contain screen shots)

Azure Portal:  TBD
ARM Template:  TBD

Following content will roll up in either or both of those...

// PART OF CREATE CONNECTION

The following table describes the properties for a data connection:

| Property Name | Description |
|---|---|
| *Connection name* | The name to identify this data connection. |
| *Database* | The case-sensitive name of the existing target database. |
| *Table* | The case-sensitive name of the existing target table |
| *Ingestion mapping reference* | Optional. The name of the existing [ingestion mapping](kusto/management/create-ingestion-mapping-command.md) to use. |
| *Cosmos DB subscription ID* | The subscription ID of the Cosmos DB account. |
| *Cosmos DB resource group* | The resource group of the Cosmos DB account used to create the data connection. |
| *Cosmos DB account endpoint* | The Cosmos DB account endpoint. For example, `https://contoso.documents.azure.com:443/` |
| *Cosmos DB database* | The name of the source database in the Cosmos DB account. |
| *Cosmos DB container* | The name of the source container in the Cosmos DB account. |
| *Start time* | Optional. If defined, the data connection retrieves Cosmos DB documents created or updated after the specified retrieval start date. |

## Testing data connection

Let's insert a document in the Cosmos DB container.

In the Azure portal, select...

**SCREENSHOT of Cosmos DB doc insert**

Now, let's query the table in Kusto:

```kql
TestTable
```

The result set should look like the following image:

**SCREENSHOT of result in Kusto**

> [!NOTE]
>
> * Azure Data Explorer has an aggregation (batching) policy for data ingestion, designed to optimize the ingestion process. The default batching policy is configured to seal a batch once one of the following conditions is true for the batch: a maximum delay time of 5 minutes, total size of 1G, or 1000 blobs. Therefore, you may experience a latency. For more information, see [batching policy](kusto/management/batchingpolicy.md).
> * To reduce response time lag, configure your table to support streaming. See [streaming policy](kusto/management/streamingingestionpolicy.md).

## Data Mapping

//VP:: Why do I need a mapping if it's specified in the connector?

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

There are different ingestion options: // data mapping

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
    .create-merge table CosmosChangeFeed3(Doc:dynamic)

    // Mapping
    .create-or-alter table CosmosChangeFeed1 ingestion json mapping "CosmosChangeFeedDynamicMapping"
    '['
    '    { "Column" : "Doc", "Properties":{"Path":"$"}}
    ']'
    ```

## Beyond Data Mapping with Update Policies

//VP:: Is this done before or after the connection is created?

Kusto Data Mapping can only do straightforward mapping.  For more complicated one, you can use [Update Policies](kusto/management/updatepolicy.md).

Here are a couple of examples:

- You might want to filter-out documents (e.g. removing some document types) ; this can be achieved by putting a where-clause in an update policy
- Flattening an array can be accomplish by using [mv-expand operator](kusto/management/alter-table-update-policy-command.md) on the array

## Handling deleted documents

Deleted documents aren't relayed to the ingestion pipeline as the change feed only expose new and updated documents.

There are two alternatives to consider to handle deleted documents in Kusto:

//VP:: Where is this applied? Is this part of the mapping file? Update policy? How does it know which to delete?

1. Soft delete corresponding table rows using [.delete command](kusto/concepts/data-soft-delete.md).
1. Use a [soft marker](/azure/cosmos-db/change-feed#change-feed-and-different-operations) to mark a Cosmos DB document as deleted

The first alternative requires that each delete done in Cosmos DB is match with a .delete command issued to Kusto.  This alternative doesn't scale to many deletes per second in Kusto.  A workaround could be to issue .delete to delete many rows at once.

## Latest version of each document

//VP::So this is around querying the data for the latest version of each document?

The target table will contain every documents created and updated in the corresponding Cosmos DB Container.  Each time a document is updated, a new row will be ingested in the target table.

For the examples of this section, we will assume the data mapping was done so there is an `id` column and a `_ts` column corresponding to the `id` and `_ts` properties in Cosmos DB documents.

In order to view only the latest version of each document, you could write the following query, leveraging [arg_max](kusto/query/arg-max-aggfunction.md):

```kusto
CosmosChangeFeed1
| summarize arg_max(_ts, *) by id
```

This queries the latest version of each document.

In the case where we have a [soft marker](/azure/cosmos-db/change-feed#change-feed-and-different-operations) `IsDeleted` on documents we could obtain the latest version of documents, excluding deleted documents with:

```kusto
CosmosChangeFeed1
| summarize arg_max(_ts, *) by id
| where not(IsDeleted)
```

You can also materialize the result of that query using a [materialized view](kusto/management/materialized-views/materialized-view-overview.md):

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

This can be encapsulated in a [stored function](kusto/query/schema-entities/stored-functions.md).
