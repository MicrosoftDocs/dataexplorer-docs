---
title: Ingest data from Azure Cosmos DB into Azure Data Explorer
description: Learn how to ingest (load) data into Azure Data Explorer from Cosmos DB.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 06/15/2023
---

# Ingest data from Azure Cosmos DB into Azure Data Explorer

[!INCLUDE [real-time-analytics-connectors-note](includes/real-time-analytics-connectors-note.md)]

Azure Data Explorer supports [data ingestion](ingest-data-overview.md) from [Azure Cosmos DB for NoSql](/azure/cosmos-db/nosql/) using a [change feed](/azure/cosmos-db/change-feed). The Cosmos DB change feed data connection is an ingestion pipeline that listens to your Cosmos DB change feed and ingests the data into your Data Explorer table. The change feed listens for new and updated documents but doesn't log deletes. For general information about data ingestion in Azure Data Explorer, see [Azure Data Explorer data ingestion overview](ingest-data-overview.md).

Each data connection listens to a specific Cosmos DB container and ingests data into a specified table (more than one connection can ingest in a single table). The ingestion method supports streaming ingestion (when enabled) and queued ingestion.

In this article, you'll learn how to set up a Cosmos DB change feed data connection to ingest data into Azure Data Explorer with System Managed Identity. Review the [considerations](#considerations) before you start.

Use the following steps to set up a connector:

Step 1: [Choose an Azure Data Explorer table and configure its table mapping](#step-1-choose-an-azure-data-explorer-table-and-configure-its-table-mapping)

Step 2: [Create a Cosmos DB data connection](#step-2-create-a-cosmos-db-data-connection)

Step 3: [Test the data connection](#step-3-test-the-data-connection)

## Prerequisites

- An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
- An Azure Data Explorer cluster and database. [Create a cluster and database](create-cluster-and-database.md).
- A container from a [Cosmos DB account for NoSQL](/azure/cosmos-db/nosql/).
- If your Cosmos DB account blocks network access, for example by using a [private endpoint](/azure/cosmos-db/how-to-configure-private-endpoints), you must [create a managed private endpoint](security-network-managed-private-endpoint-create.md) to the Cosmos DB account. This is required for your cluster to invoke the change feed API.

## Step 1: Choose an Azure Data Explorer table and configure its table mapping

Before you create a data connection, create a table where you'll store the ingested data and apply a mapping that matches schema in the source Cosmos DB container. If your scenario requires more than a simple mapping of fields, you can use [update policies to transform and map data](#transform-and-map-data-with-update-policies) ingested from your change feed.

The following shows a sample schema of an item in the Cosmos DB container:

```json
{
    "id": "17313a67-362b-494f-b948-e2a8e95e237e",
    "name": "Cousteau",
    "_rid": "pL0MAJ0Plo0CAAAAAAAAAA==",
    "_self": "dbs/pL0MAA==/colls/pL0MAJ0Plo0=/docs/pL0MAJ0Plo0CAAAAAAAAAA==/",
    "_etag": "\"000037fc-0000-0700-0000-626a44110000\"",
    "_attachments": "attachments/",
    "_ts": 1651131409
}
```

Use the following steps to create a table and apply a table mapping:

1. In the Azure Data Explorer web UI, from the left navigation menu select **Query**, and then select the database where you want to create the table.

1. Run the following command to create a table called *TestTable*.

    ```kusto
    .create table TestTable(Id:string, Name:string, _ts:long, _timestamp:datetime)
    ```

1. Run the following command to create the table mapping.

    The command maps custom properties from a Cosmos DB JSON document to columns in the *TestTable* table, as follows:

    | Cosmos DB property | Table column | Transformation |
    |--|--|--|
    | **id** | Id | None |
    | **name** | Name | None |
    | **_ts** | _ts | None |
    | **_ts** | _timestamp | Uses `DateTimeFromUnixSeconds` to [transform](kusto/management/mappings.md) **\_ts** ([UNIX seconds](https://wikipedia.org/wiki/Unix_time)) to **_timestamp** (`datetime`)) |

    > [!NOTE]
    > We recommend using the following timestamp columns:
    >
    > - **_ts**: Use this column to reconcile data with Cosmos DB.
    > - **_timestamp**:  Use this column to run efficient time filters in your Kusto queries. For more information, see [Query best practice](./kusto/query/best-practices.md).

    ~~~kusto
    .create table TestTable ingestion json mapping "DocumentMapping"
    ```
    [
        {"column":"Id","path":"$.id"},
        {"column":"Name","path":"$.name"},
        {"column":"_ts","path":"$._ts"},
        {"column":"_timestamp","path":"$._ts", "transform":"DateTimeFromUnixSeconds"}
    ]
    ```
    ~~~

### Transform and map data with update policies

If your scenario requires more than a simple mapping of fields, you can use update policies to transform and map data ingested from your change feed.

[Update policies](kusto/management/update-policy.md) are a way to transform data as it's ingested into your table. They're written in Kusto Query Language and are run on the ingestion pipeline. They can be used to transform data from a Cosmos DB change feed ingestion, such as in the following scenarios:

- Your documents contain arrays that would be easier to query if they're transformed in multiple rows using the [`mv-expand`](kusto/management/alter-table-update-policy-command.md) operator.
- You want to filter out documents. For example, you can filter out documents by type using the [`where`](kusto/query/where-operator.md) operator.
- You have complex logic that can't be represented in a table mapping.

For information on how to create and manage update policies, see [Update policy overview](kusto/management/alter-table-update-policy-command.md).

## Step 2: Create a Cosmos DB data connection

You can use the following methods to create the data connector:

### [Azure portal](#tab/portal)

1. In the Azure portal, go to your cluster overview page, and then select the **Getting started** tab.

1. On the **Data ingestion** tile, select **Create data connection** > **Cosmos DB**.

    :::image type="content" source="media/ingest-data-cosmos-db/create-data-connection.png" alt-text="Screenshot of the Getting started tab, showing the Create Cosmos DB data connection option.":::

1. In the Cosmos DB **Create data connection** pane, fill out the form with the information in the table:

    :::image type="content" source="media/ingest-data-cosmos-db/fill-fields.png" alt-text="Screenshot of the data connection pane, showing the form fields with values.":::

    | Field | Description |
    |--|--|
    | **Database name** | Choose the Azure Data Explorer database into which you want to ingest data. |
    | **Data connection name** | Specify a name for the data connection. |
    | **Subscription** | Select the subscription that contains your Cosmos DB NoSQL account. |
    | **Cosmos DB account** | Choose the Cosmos DB account from which you want to ingest data. |
    | **SQL database** | Choose the Cosmos DB database from which you want to ingest data. |
    | **SQL container** | Choose the Cosmos DB container from which you want to ingest data. |
    | **Table name** | Specify the Azure Data Explorer [table name](#step-1-choose-an-azure-data-explorer-table-and-configure-its-table-mapping) to which you want to ingest data. |
    | **Mapping name** | Optionally, specify the [mapping name](#step-1-choose-an-azure-data-explorer-table-and-configure-its-table-mapping) to use for the data connection. |

1. Optionally, under the **Advanced settings** section, do the following:
    1. Specify the **Event retrieval start date**. This is the time from which the connector will start ingesting data. If you don't specify a time, the connector will start ingesting data from the time you create the data connection. The recommended date format is the ISO 8601 UTC standard, specified as follows: `yyyy-MM-ddTHH:mm:ss.fffffffZ`.
    1. Select **User-assigned** and then select the identity. By Default, the **System-assigned** managed identity is used by the connection. If necessary, you can use a **User-assigned** identity.

        :::image type="content" source="media/ingest-data-cosmos-db/advanced-settings.png" alt-text="Screenshot of the data connection pane, showing the Advance settings.":::

1. Select **Create** to crate the data connection.

### [ARM template](#tab/arm)

Use the following sample ARM template as the basis for creating your own data connection template, and then [deploy it in the Azure portal](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal#edit-and-deploy-the-template).

To configure your Cosmos DB connection:

1. Configure a [System Managed Identity](managed-identities-overview.md) for your Cosmos DB connection authentication.

    1. In the Azure Data Explorer web UI, select **Query** from the left navigation menu, and then select the cluster or database for the data connection.

1. Grant the data connection permission to access your Cosmos DB account. Providing the data connection access to your Cosmos DB allows it to access and retrieve data from your database. You'll need your cluster's principal ID, which you can find in the Azure portal. For more information, see [Configure managed identities for your cluster](configure-managed-identities-cluster.md#add-a-system-assigned-identity).

    > [!NOTE]
    >
    > - The following steps assign these roles to the principal ID:
    >   - [Cosmos DB Built-in Data Reader](/azure/cosmos-db/how-to-setup-rbac#built-in-role-definitions)
    >     - You can't assign the **Cosmos DB Built-in Data Reader** role using the Azure portal *Role Assignment* feature.
    >   - [Cosmos DB Account Reader Role](/azure/role-based-access-control/built-in-roles)

    Use one of the following options to grant access to your Cosmos DB account:

    - **Grant access using the Azure CLI**: Run the CLI command, using information in the following table to replace placeholders with appropriate values:

        ```azurecli
        az cosmosdb sql role assignment create --account-name <CosmosDbAccountName> --resource-group <CosmosDbResourceGroup> --role-definition-id 00000000-0000-0000-0000-000000000001 --principal-id <ClusterPrincipalId> --scope "/"

        az role assignment create --role fbdf93bf-df7d-467e-a4d2-9458aa1360c8 --assignee <ClusterPrincipalId> --scope <CosmosDBAccountResourceId>
        ```

        | Placeholder | Description |
        |--|--|
        | **\<CosmosDBAccountName>** | The name of your Cosmos DB account. |
        | **\<CosmosDBResourceGroup>** | The name of the resource group that contains your Cosmos DB account. |
        | **\<CosmosDBAccountResourceId>** | The Azure resource ID (starting with `subscriptions/`) of your Cosmos DB account. |
        | **\<ClusterPrincipalId>** | The principal ID of the managed identity assigned to your cluster. You can find your cluster's principle ID in the Azure portal. For more information, see [Configure managed identities for your cluster](configure-managed-identities-cluster.md#add-a-system-assigned-identity). |

    - **Grant access using an ARM Template**: Deploy the following template in the Cosmos DB account resource group:

        ```json
        {
            "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
                "clusterPrincipalId": {
                    "type": "string",
                    "metadata": { "description": "The principle ID of your cluster." }
                },
                "cosmosDbAccount": {
                    "type": "string",
                    "metadata": { "description": "The name of your Cosmos DB account." }
                },
                "cosmosDbAccountResourceId": {
                    "type": "string",
                    "metadata": { "description": "The resource ID of your Cosmos DB account." }
                }
            },
            "variables": {
                "cosmosDataReader": "00000000-0000-0000-0000-000000000001",
                "dataRoleDefinitionId": "[format('/subscriptions/{0}/resourceGroups/{1}/providers/Microsoft.DocumentDB/databaseAccounts/{2}/sqlRoleDefinitions/{3}', subscription().subscriptionId, resourceGroup().name, parameters('cosmosDbAccount'), variables('cosmosDataReader'))]",
                "roleAssignmentId": "[guid(parameters('cosmosDbAccountResourceId'), parameters('clusterPrincipalId'))]",
                "rbacRoleDefinitionId": "[format('/subscriptions/{0}/providers/Microsoft.Authorization/roleDefinitions/{1}', subscription().subscriptionId, 'fbdf93bf-df7d-467e-a4d2-9458aa1360c8')]"
            },
            "resources": [
                {
                    "type": "Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments",
                    "apiVersion": "2022-08-15",
                    "name": "[concat(parameters('cosmosDbAccount'), '/', guid(parameters('clusterPrincipalId'), parameters('cosmosDbAccount')))]",
                    "properties": {
                        "principalId": "[parameters('clusterPrincipalId')]",
                        "roleDefinitionId": "[variables('dataRoleDefinitionId')]",
                        "scope": "[resourceId('Microsoft.DocumentDB/databaseAccounts', parameters('cosmosDbAccount'))]"
                    }
                },
                {
                    "type": "Microsoft.Authorization/roleAssignments",
                    "apiVersion": "2022-04-01",
                    "name": "[variables('roleAssignmentId')]",
                    "scope": "[format('Microsoft.DocumentDb/databaseAccounts/{0}', parameters('cosmosDbAccount'))]",
                    "properties": {
                        "description": "Giving RBAC reader on Cosmos DB",
                        "principalId": "[parameters('clusterPrincipalId')]",
                        "principalType": "ServicePrincipal",
                        "roleDefinitionId": "[variables('rbacRoleDefinitionId')]"
                    }
                }
            ]
        }
        ```

1. Deploy the following ARM template to create a Cosmos DB data connection. Replace the placeholders with appropriate values.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "kustoClusterName": {
          "type": "string",
          "metadata": { "description": "Kusto Cluster name" }
        },
        "kustoDbName": {
          "type": "string",
          "metadata": { "description": "Kusto Database name" }
        },
        "kustoConnectionName": {
          "type": "string",
          "metadata": { "description": "Kusto Database connection name" }
        },
        "kustoLocation": {
          "type": "string",
          "metadata": { "description": "Location (Azure Region) of the Kusto cluster" }
        },
        "kustoTable": {
          "type": "string",
          "metadata": { "description": "Kusto Table name where to ingest data" }
        },
        "kustoMappingRuleName": {
          "type": "string",
          "defaultValue": "",
          "metadata": { "description": "Mapping name of the Kusto Table (if omitted, default mapping is applied)" }
        },
        "managedIdentityResourceId": {
          "type": "string",
          "metadata": { "description": "ARM resource ID of the managed identity (cluster resource ID for system or user identity)" }
        },
        "cosmosDbAccountResourceId": {
          "type": "string",
          "metadata": { "description": "ARM resource ID of Cosoms DB account" }
        },
        "cosmosDbDatabase": {
          "type": "string",
          "metadata": { "description": "Cosmos DB Database name" }
        },
        "cosmosDbContainer": {
          "type": "string",
          "metadata": { "description": "Cosmos DB container name" }
        },
        "retrievalStartDate": {
          "type": "string",
          "defaultValue": "",
          "metadata": { "description": "Date-time at which to start the data retrieval; default: 'now' if not provided. Recommended format: yyyy-MM-ddTHH:mm:ss.fffffffZ" }
        }
      },
      "variables": { },
      "resources": [{
        "type": "Microsoft.Kusto/Clusters/Databases/DataConnections",
        "apiVersion": "2022-11-11",
        "name": "[concat(parameters('kustoClusterName'), '/', parameters('kustoDbName'), '/', parameters('kustoConnectionName'))]",
        "location": "[parameters('kustoLocation')]",
        "kind": "CosmosDb",
        "properties": {
          "tableName": "[parameters('kustoTable')]",
          "mappingRuleName": "[parameters('kustoMappingRuleName')]",
          "managedIdentityResourceId": "[parameters('managedIdentityResourceId')]",
          "cosmosDbAccountResourceId": "[parameters('cosmosDbAccountResourceId')]",
          "cosmosDbDatabase": "[parameters('cosmosDbDatabase')]",
          "cosmosDbContainer": "[parameters('cosmosDbContainer')]",
          "retrievalStartDate": "[parameters('retrievalStartDate')]"
        }
      }]
    }
    ```

---

## Step 3: Test the data connection

1. In the Cosmos DB container, insert the following document:

    ```json
    {
        "name":"Cousteau"
    }
    ```

1. In the Azure Data Explorer web UI, run the following query:

    ```kusto
    TestTable
    ```

    The result set should look like the following image:

    :::image type="content" source="media/ingest-data-cosmos-db/test-result.png" alt-text="Screenshot of the results pane, showing the ingested document.":::

> [!NOTE]
>
> Azure Data Explorer has an aggregation (batching) policy for queued data ingestion designed to optimize the ingestion process. The default batching policy is configured to seal a batch once one of the following conditions is true for the batch: a maximum delay time of 5 minutes, total size of one GB, or 1000 blobs. Therefore, you may experience a latency. For more information, see [batching policy](kusto/management/batching-policy.md). To reduce latency, configure your table to support streaming. See [streaming policy](kusto/management/streaming-ingestion-policy.md).

## Considerations

The following considerations apply to the Cosmos DB change feed:

- The change feed doesn't expose *deletion* events.

    The Cosmos DB change feed only includes new and updated documents. If you need to know about deleted documents, you can configure your feed use a [soft marker](/azure/cosmos-db/change-feed#change-feed-and-different-operations) to mark a Cosmos DB document as deleted. A property is added to update events that indicate whether a document has been deleted. You can then use the `where` operator in your queries to filter them out.

    For example, if you map the deleted property to a table column called **IsDeleted**, you can filter out deleted documents with the following query:

    ```kusto
    TestTable
    | where not(IsDeleted)
    ```

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

    To illustrate the issue, consider a sequence of API calls with timestamps *15*, *35*, *55*, and *75* as shown in the following table:

    | API Call Timestamp | Document ID | Property **foo** | Document timestamp (**_ts**) |
    |---|---|---|---|
    | 15 | A | Red | 10 |
    | 35 | B | Blue | 20 |
    | 35 | A | Orange | 30 |
    | 55 | B | Violet | 50 |
    | 55 | A | Carmine | 60 |
    | 75 | B | NeonBlue | 70 |

    Comparing the API results to the list of changes made in the Cosmos DB document, you'll notice that they don't match. The update event to document *A*, highlighted in the change table at timestamp 40, doesn't appear in the results of the API call.

    To understand why the event doesn't appear, we'll examine the changes to document *A* between the API calls at timestamps 35 and 55. Between these two calls, document *A* changed twice, as follows:

    | Document ID | Property **foo** | Event | Document timestamp (**_ts**) |
    |---|---|---|---|
    | A | Pink | Update | 40 |
    | A | Carmine | Update | 50 |

    When the API call at timestamp 55 is made, the change feed API returns the latest version of the document. In this case, the latest version of document *A* is the update at timestamp 50, which is the update to property **foo** from *Pink* to *Carmine*.

    Because of this scenario, the data connector may miss some intermediate document changes. For example, some events may be missed if the data connection service is down for a few minutes, or if the frequency of document changes is higher than the API polling frequency. However, the latest state of each document is captured.

- Deleting and recreating a Cosmos DB container isn't supported

    Azure Data Explorer keeps track of the change feed by checkpointing the "position" it is at in the feed.  This is done using continuation token on each physical partitions of the container.  When a container is deleted/recreated, those continuation token are invalid and aren't reset:  you must delete and recreate the data connection.

## Estimate cost

How much does using the Cosmos DB data connection impact your Cosmos DB container's [Request Units (RUs)](/azure/cosmos-db/request-units) usage?

The connector invokes the Cosmos DB Change Feed API on each physical partition of your container, to up to once a second. The following costs are associated with these invocations:

| Cost | Description |
| -- | -- |
| Fixed costs | Fixed costs are about 2 RUs per physical partition every second. |
| Variable costs | Variable costs are about 2% of the RUs used to write documents, though this may vary depending on your scenario. For example, if you write 100 documents to a Cosmos DB container, the cost of writing those documents is 1,000 RUs. The corresponding cost for using the connector to read those document is about 2% the cost to write them, approximately 20 RUs. |

## Related content

* [Get latest versions of Azure Cosmos DB documents](ingest-data-cosmos-db-queries.md)
* [Kusto Query Language (KQL) overview](kusto/query/index.md)
