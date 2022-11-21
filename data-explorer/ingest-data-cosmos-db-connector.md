---
title: Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)
description: Learn how to ingest (load) data into Azure Data Explorer from Cosmos DB.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 11/21/2022
---

# Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)

Azure Data Explorer supports [data ingestion](ingest-data-overview.md) from [Azure Cosmos DB for NoSql](/azure/cosmos-db/nosql/) using a [change feed](/azure/cosmos-db/change-feed). The Cosmos DB change feed data connection is an ingestion pipeline that listens to your Cosmos DB change feed and ingests the data into your cluster. The change feed listens for new and updated documents but does not log deletes.

Each data connection listens to a specific Cosmos DB container and ingests data into a specified table. The ingestion method supports streaming ingestion (when enabled) and batch ingestion.

In this article, you'll learn how to set up a Cosmos DB change feed data connection to ingest data into Azure Data Explorer. use the following steps to set up a connector.

Step 1: [Choose an Azure Data Explorer table and configure if its table mapping](#step-1-choose-an-azure-data-explorer-table-and-configure-if-its-table-mapping)

Step 2: [Configure access to read from Cosmos DB using managed identities](#step-2-configure-access-to-read-from-cosmos-db-using-managed-identities)

Step 3: Create a Cosmos DB change feed data connection

//VP:: The rest of the topics we'll move to another article and use them as next steps
//Shlomo:  If we do that (which sounds like a good idea), I would suggest to push the update policy into the other article as well.  This way we could keep this article as "the simplest use case".
//Shlomo:  something like that?  https://learn.microsoft.com/azure/data-explorer/ingest-data-event-hub-overview

## Prerequisites

//VP:: What are the prereqs?

- An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
- An existing or new [cluster and database](create-cluster-database-portal.md).
- An existing container from a [Cosmos DB account for NoSql](/azure/cosmos-db/nosql/)

## Step 1: Choose an Azure Data Explorer table and configure if its table mapping

//Shlomo:  https://learn.microsoft.com/azure/data-explorer/ingest-data-event-hub#create-a-target-table-in-azure-data-explorer goes with screen shots to show how to execute a command.  I don't know if that is necessary?
// VP: Not required, though good if it's complex. I think these steps are pretty straightforward.

1. In the Azure Data Explorer web UI, select **Query** from the left navigation menu, and then select the database where you want the table to be created.

1. In the query window, select an existing table for ingestion (**id**, **name**, **timestamp**, **age**) or create one using the following command.

    > [!NOTE]
    >
    > - Replace '\<MyTable>' with the name of the table you want to create.
    > - The table name must be unique within the database.

    ```kusto
    .create table <MyTable> (id: int, name: string, timestamp: int, age: datetime)
    ```

1. Run the following command to create the table mapping.

    The command maps custom properties from a Cosmos DB JSON document to columns in your Azure Data Explorer table, as follows:

    | Cosmos DB property | Table column | Transformation |
    |--|--|--|
    | Name | name | None |
    | Id | id | None |
    | _ts | timestamp | None |
    | _ts | age | Uses `DateTimeFromUnixSeconds` to transform **\_ts** ([UNIX seconds](https://wikipedia.org/wiki/Unix_time)) to **age** (`datetime`)) |

    > [!NOTE]
    > We recommend having two timestamp columns, as follows:
    >
    > - **timestamp**: Use this column to reconcile data with Cosmos DB.
    > - **age**:  Use this column to run efficient time filters in your Kusto queries. For more information, see [Query best practice](/azure/data-explorer/kusto/query/best-practices).

    > [!NOTE]
    > Replace **\<MyTable>** with the name of the table you want to create.

    ~~~kusto
    .create table <MyTable> ingestion json mapping "DocumentMapping"
    ```
    [
        {"column":"Id","path":"$.id"},
        {"column":"Name","path":"$.name"},
        {"column":"_ts","path":"$.timestamp"},
        {"column":"_ts","path":"$.age", "transform":"DateTimeFromUnixSeconds"}
    ]
    ```
    ~~~

## Step 2: Configure access to read from Cosmos DB using managed identities

The Cosmos DB data connector only supports [managed identity](/azure/data-explorer/managed-identities-overview) authentication.

> [!NOTE]
> The role configured in the following steps is the [Cosmos DB Built-in Data Reader](/azure/cosmos-db/how-to-setup-rbac#built-in-role-definitions) as it contains the [Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed](/azure/cosmos-db/how-to-setup-rbac#permission-model) action required for the connection. However, if you need more granular control of your permissions, you can define a custom role with only the required action and assign it to the managed identity.

To configure a System Managed Identity for you Cosmos DB connection:

1. In the Azure Data Explorer web UI, select **Query** from the left navigation menu, and then select the cluster or database for the data connection.

1. Run the following command to configure a [managed identity policy](/azure/data-explorer/kusto/management/managed-identity-policy) that allows the System Managed Identity to authenticate [data connections](/azure/data-explorer/kusto/management/managed-identity-policy#managed-identity-usages). This allows the System Managed Identity to be used in data connections.

    > [!NOTE]
    > Skip this step if you use the Azure portal to create the data connection because this configuration is done automatically.

    ~~~kql
    .alter database db policy managed_identity
    ```
    [
    {
        "ObjectId": "system",
        "AllowedUsages": "DataConnection"
    }
    ]
    ```
    ~~~

1. Run the following command to grant the managed identity permissions to access to your Cosmos DB. Replace the placeholders with the appropriate values as described in the table.

    > [!NOTE]
    >
    > This step can't be run in the Azure portal because the Cosmos DB role isn't listed as an Azure role.

    | Placeholder | Description |
    |--|--|
    | **\<CosmosDBAccountName>** | The name of your Cosmos DB account. |
    | **\<CosmosDBResourceGroup>** | The name of the resource group that contains your Cosmos DB account. |
    | **\<ClusterPrincipalId>** | The principle ID of your cluster. You can find your cluster's principle ID in the Azure portal. For more information, see [Configure managed identities for your cluster](configure-managed-identities-cluster.md#add-a-system-assigned-identity). |

### [Azure CLI](#tab/azurecli)

```azurecli
az cosmosdb sql role assignment create --account-name <CosmosDbAccountName> --resource-group <CosmosDbResourceGroup> --role-definition-id 00000000-0000-0000-0000-000000000001 --principal-id <ClusterPrincipalId> --scope "/"
```

### [PowerShell](#tab/powershell)

```powershell
TBD
```

---

## Step 3: Create a Cosmos DB change feed data connection

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

## Next steps
