---
title: Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)
description: Learn how to ingest (load) data into Azure Data Explorer from Cosmos DB.
ms.reviewer: vplauzon
ms.topic: how-to
ms.date: 12/06/2022
---

# Ingest data from Azure Cosmos DB into Azure Data Explorer (Preview)

Azure Data Explorer supports [data ingestion](ingest-data-overview.md) from [Azure Cosmos DB for NoSql](/azure/cosmos-db/nosql/) using a [change feed](/azure/cosmos-db/change-feed). The Cosmos DB change feed data connection is an ingestion pipeline that listens to your Cosmos DB change feed and ingests the data into your cluster. The change feed listens for new and updated documents but does not log deletes.

Each data connection listens to a specific Cosmos DB container and ingests data into a specified table. The ingestion method supports streaming ingestion (when enabled) and batch ingestion.

In this article, you'll learn how to set up a Cosmos DB change feed data connection to ingest data into Azure Data Explorer with System Managed Identity. Use the following steps to set up a connector.

Step 1: [Choose an Azure Data Explorer table and configure if its table mapping](#step-1-choose-an-azure-data-explorer-table-and-configure-if-its-table-mapping)

Step 2: [Configure Managed Identity Policy](#step-2-configure-managed-identity-policy)

Step 3: [Configure Cosmos DB access](#step-3-configure-cosmos-db-access)

Step 4: [Create a Cosmos DB data connection](#step-4-create-a-cosmos-db-data-connection)

## Prerequisites

- An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/)
- A [cluster and database](create-cluster-database-portal.md)
- A container from a [Cosmos DB account for NoSQL](/azure/cosmos-db/nosql/)

## Step 1: Choose an Azure Data Explorer table and configure if its table mapping

1. In the Azure Data Explorer web UI, from the left navigation menu select **Query**, and then select the database where you want to create the table.

1. Run the following command to create a table called *TestTable*.

    ```kusto
    .create table TestTable(Id:string, Name:string, _ts:long, _timestamp:datetime)
    ```

1. Run the following command to create the table mapping.

    The command maps custom properties from a Cosmos DB JSON document to columns in the *TestTable* table, as follows:

    | Cosmos DB property | Table column | Transformation |
    |--|--|--|
    | id | Id | None |
    | name | Name | None |
    | _ts | _ts | None |
    | _ts | _timestamp | Uses `DateTimeFromUnixSeconds` to [transform](kusto/management/mappings.md) **\_ts** ([UNIX seconds](https://wikipedia.org/wiki/Unix_time)) to **_timestamp** (`datetime`)) |

    > [!NOTE]
    > We recommend using the following timestamp columns:
    >
    > - **_ts**: Use this column to reconcile data with Cosmos DB.
    > - **_timestamp**:  Use this column to run efficient time filters in your Kusto queries. For more information, see [Query best practice](/azure/data-explorer/kusto/query/best-practices).

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

## Step 2: Configure Managed Identity Policy

> [!NOTE]
> Skip this step if you are provisioning the data connection using the Azure portal, as it's automatically done as part of provisioning.

The Cosmos DB data connector leverages [managed identity](/azure/data-explorer/managed-identities-overview) authentication. To configure a System Managed Identity for your Cosmos DB connection:

1. In the Azure Data Explorer web UI, select **Query** from the left navigation menu, and then select the cluster or database for the data connection.

1. Run the following command to configure a [managed identity policy](/azure/data-explorer/kusto/management/managed-identity-policy) allowing the System Managed Identity to authenticate [data connections](/azure/data-explorer/kusto/management/managed-identity-policy#managed-identity-usages). This allows the System Managed Identity to be used in data connections.

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

## Step 3: Configure Cosmos DB access

> [!NOTE]
> Skip this step if you are provisioning the data connection using the Azure portal, as it's automatically done as part of provisioning.

For the connector to work, you must grant it permission to access your CosmosDB account. Providing the connector access to your CosmosDB allows it to access and retrieve data from your database.

To grant access, you'll need your cluster's principal ID. You can find your cluster's principal ID in the Azure portal. For more information, see [Configure managed identities for your cluster](configure-managed-identities-cluster.md#add-a-system-assigned-identity).

> [!NOTE]
>
> - The following steps assign the [Cosmos DB Built-in Data Reader](/azure/cosmos-db/how-to-setup-rbac#built-in-role-definitions) to the principal ID as it contains the [Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/readChangeFeed and the Microsoft.DocumentDB/databaseAccounts/readMetadata](/azure/cosmos-db/how-to-setup-rbac#permission-model) action required for the connection. If you need more granular control of your permissions, you can define a custom role with only the required action and assign it to the principal ID.
> - You can't assign the **Cosmos DB Built-in Data Reader** role using the Azure portal *Role Assignment* feature.

### [Azure CLI](#tab/portal)

To grant access using the Azure CLI, run the CLI command, using information in the following table to replace placeholders with appropriate values:

```azurecli
az cosmosdb sql role assignment create --account-name <CosmosDbAccountName> --resource-group <CosmosDbResourceGroup> --role-definition-id 00000000-0000-0000-0000-000000000001 --principal-id <ClusterPrincipalId> --scope "/"
```

| Placeholder | Description |
|--|--|
| **\<CosmosDBAccountName>** | The name of your Cosmos DB account. |
| **\<CosmosDBResourceGroup>** | The name of the resource group that contains your Cosmos DB account. |
| **\<ClusterPrincipalId>** | The principle ID of your cluster. You can find your cluster's principle ID in the Azure portal. For more information, see [Configure managed identities for your cluster](configure-managed-identities-cluster.md#add-a-system-assigned-identity). |

### [ARM Template](#tab/arm)

To grant access using an Azure Resource Manager (ARM) template, deploy the following template in the Cosmos DB account resource group:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "clusterPrincipalId": {
            "type": "string",
            "metadata": {
                "description": "The principle ID of your cluster."
            }
        },
        "cosmosDbAccount": {
            "type": "string",
            "metadata": {
                "description": "The name of your Cosmos DB account."
            }
        }
    },
    "variables": {
        "cosmosDataReader": "00000000-0000-0000-0000-000000000001",
        "roleDefinitionId": "[format('/subscriptions/{0}/resourceGroups/{1}/providers/Microsoft.DocumentDB/databaseAccounts/{2}/sqlRoleDefinitions/{3}', subscription().subscriptionId, resourceGroup().name, parameters('cosmosDbAccount'), variables('cosmosDataReader'))]"
    },
    "resources": [
        {
            "type": "Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments",
            "apiVersion": "2022-08-15",
            "name": "[concat(parameters('cosmosDbAccount'), '/', guid(parameters('clusterPrincipalId'), parameters('cosmosDbAccount')))]",
            "properties": {
                "principalId": "[parameters('clusterPrincipalId')]",
                "roleDefinitionId": "[variables('roleDefinitionId')]",
                "scope": "[resourceId('Microsoft.DocumentDB/databaseAccounts', parameters('cosmosDbAccount'))]"
            }
        }
    ]
}
```

---

## Step 4: Create a Cosmos DB data connection

You can use the following methods to create the data connector:

### [Azure Portal](#tab/portal)

1. In the Azure portal, go to your cluster overview page, and then select the **Getting started** tab.

1. On the **Data ingestion** tile, select **Create data connection** > **Cosmos DB**.

    :::image type="content" source="media/ingest-data-cosmos-db/create-data-connection.png" alt-text="Screenshot of the Getting started tab, showing the Create CosmosDB data connection option.":::

1. In the CosmosDB **Create data connection** pane, fill out the form with the information in the table:

    :::image type="content" source="media/ingest-data-cosmos-db/fill-fields.png" alt-text="Screenshot of the data connection pane, showing the form fields with values.":::

    | Field | Description |
    |--|--|
    | **Database name** | Choose the Azure Data Explorer database into which you want to ingest data. |
    | **Data connection name** | Specify a name for the data connection. |
    | **Subscription** | Select the subscription that contains your Cosmos DB NoSQL account. |
    | **Cosmos DB account** | Choose the Cosmos DB account from which you want to ingest data. |
    | **SQL database** | Choose the Cosmos DB database from which you want to ingest data. |
    | **SQL container** | Choose the Cosmos DB container from which you want to ingest data. |
    | **Table name** | Specify the Azure Data Explorer [table name](#step-1-choose-an-azure-data-explorer-table-and-configure-if-its-table-mapping) to which you want to ingest data. |
    | **Mapping name** | Specify the [mapping name](#step-1-choose-an-azure-data-explorer-table-and-configure-if-its-table-mapping) to use for the data connection. |

1. Optionally, under the **Avanced settings** section, do the following:
    1. Specify the **Event retrieval start date**. This is the time from which the connector will start ingesting data. If you don't specify a time, the connector will start ingesting data from the time you create the data connection. The recommended date format is the ISO 8601 UTC standard, specified as follows: `yyyy-MM-ddTHH:mm:ss.fffffffZ`.
    1. Select **User-assigned** and then select the identity. By Default, the **System-assigned** managed identity is used by the connection. If required, you can use a **User-assigned** identity.

        :::image type="content" source="media/ingest-data-cosmos-db/advanced-settings.png" alt-text="Screenshot of the data connection pane, showing the Advance settings.":::

1. Select **Create** to crate the data connection.

### [ARM Template](#tab/arm)

The following is an example ARM template for adding a Cosmos DB data connection. You can use the example as basis for creating your own data connection template and then [deploy it in the Azure portal](/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal#edit-and-deploy-the-template).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "kustoClusterName": {
            "type": "string",
            "metadata": {
                "description": "Kusto Cluster name"
            }
        },
        "kustoDbName": {
            "type": "string",
            "metadata": {
                "description": "Kusto Database name"
            }
        },
        "kustoConnectionName": {
            "type": "string",
            "metadata": {
                "description": "Kusto Database connection name"
            }
        },
        "kustoLocation": {
            "type": "string",
            "metadata": {
                "description": "Location (Azure Region) of the Kusto cluster"
            }
        },
        "kustoTable": {
            "type": "string",
            "metadata": {
                "description": "Kusto Table name where to ingest data"
            }
        },
        "kustoMappingRuleName": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "Mapping name of the Kusto Table (if omitted, default mapping is applied)"
            }
        },
        "managedIdentityResourceId": {
            "type": "string",
            "metadata": {
                "description": "ARM resource ID of the managed identity (either the cluster resource ID for system identity or resource ID of the user managed identity)"
            }
        },
        "cosmosDbAccountResourceId": {
            "type": "string",
            "metadata": {
                "description": "ARM resource ID of Cosoms DB account"
            }
        },
        "cosmosDbDatabase": {
            "type": "string",
            "metadata": {
                "description": "Cosmos DB Database name"
            }
        },
        "cosmosDbContainer": {
            "type": "string",
            "metadata": {
                "description": "Cosmos DB container name"
            }
        },
        "retrievalStartDate": {
            "type": "string",
            "defaultValue": "",
            "metadata": {
                "description": "Date-time at which to start the data retrieval ; will default to 'now' if not provided.  Recommended date format is yyyy-MM-ddTHH:mm:ss.fffffffZ, i.e. ISO 8601 UTC standard."
            }
        }
    },
    "variables": {
    },
    "resources": [
        {
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
        }
    ]
}
```

## Test the data connection

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
> Azure Data Explorer has an aggregation (batching) policy for data ingestion designed to optimize the ingestion process. The default batching policy is configured to seal a batch once one of the following conditions is true for the batch: a maximum delay time of 5 minutes, total size of one GB, or 1000 blobs. Therefore, you may experience a latency. For more information, see [batching policy](kusto/management/batchingpolicy.md). To reduce latency, configure your table to support streaming. See [streaming policy](kusto/management/streamingingestionpolicy.md).

## Next steps
