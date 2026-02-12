---
title: Automatic stop of inactive clusters in Azure Data Explorer
description: Learn when your cluster is due to stop running using the Automatic stop feature, and how to enable/disable the Automatic stop.
ms.reviewer: orhasban
ms.topic: how-to
ms.date: 12/08/2025
---
# Configure automatic stop of inactive Azure Data Explorer clusters

Azure Data Explorer clusters that are *inactive* for a specified time interval stop automatically. Inactivity means clusters with no data ingestion or queries in the past 5 days. The interval is fixed at 5 days and can't be changed.

Cluster behavior doesn't resume automatically. Restart the cluster manually.

> [!NOTE]
> The following cluster types aren't stopped automatically: </br>
>
> * Leader clusters. For more information, see [follower databases](follower.md).
> * Clusters deployed in a Virtual Network
> * [Start-for-free](start-for-free.md) clusters
> * Clusters where the [Auto-Stop setting](auto-stop-clusters.md#configure-auto-stop-while-creating-a-new-cluster) is turned off

## Manage automatic stop behavior on your cluster

Azure Data Explorer clusters are created by default with the cluster property `enableAutoStop = true`. You can set or change this property during or after cluster creation.

[Azure portal](#configure-auto-stop-while-creating-a-new-cluster)

* [ARM Templates](/azure/templates/microsoft.kusto/clusters?tabs=json#trustedexternaltenant-object)
* [Azure CLI](/cli/azure/kusto/cluster#az-kusto-cluster-update-optional-parameters)
* [PowerShell](/powershell/module/az.kusto/new-azkustocluster)
* [Azure Resource Explorer](https://resources.azure.com/)

Learn more in [Azure Data Explorer cluster request body](/rest/api/azurerekusto/clusters/createorupdate#request-body).

## Configure auto-stop while creating a new cluster

1. In the Azure portal, follow the steps in [create an Azure Data Explorer cluster and database](create-cluster-and-database.md).
1. In the **Configurations** tab, select **Auto-Stop cluster** > **On**.

  :::image type="content" source="media/auto-stop-clusters/auto-stop-cluster-creation.png" alt-text="Screenshot of auto-stop configuration." :::

## Modify settings on an existing cluster

To enable or disable Auto-Stop cluster after the cluster is created:

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Go to your Azure Data Explorer cluster.
1. In **Settings**, select **Configurations**.
1. In the **Configurations** pane, select **On** or **Off** to enable or disable **Auto-Stop cluster**.
1. Select **Save**.

:::image type="content" source="media/auto-stop-clusters/auto-stop-cluster-update.png" alt-text="Screenshot of auto-stop configuration in the Azure portal.":::

## Verify auto-stop using the activity log

When a cluster is automatically stopped, an Activity log is sent. To verify when and how the cluster was stopped, use the following steps:

1. Sign into the [Azure portal](https://ms.portal.azure.com/).
1. Browse to Azure Data Explorer cluster.
1. In the left pane, select **Activity log**.
1. Select a timespan.
1. Under **Operation name**, find **Stop Clusters**.

:::image type="content" source="media/auto-stop-clusters/auto-stop-cluster-activity-log.png" alt-text="Screenshot of the activity log.":::

## Examples

### REST example

Update the cluster with this operation:

```http
PATCH https://management.azure.com/subscriptions/12345678-1234-1234-1234-123456789098/resourceGroups/kustorgtest/providers/Microsoft.Kusto/clusters/kustoclustertest?api-version=2021-08-27
```

#### Request body to disable auto-stop

```json
{
    "properties": { 
        "enableAutoStop": false 
    }
}
```

#### Request body to enable auto-stop

```json
{
      "properties": {
        "enableAutoStop": true
    }
}
```
