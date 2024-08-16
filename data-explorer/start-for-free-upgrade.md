---
title: Upgrade a free Azure Data Explorer cluster.
description: This article you'll learn how to upgrade a free cluster to into your data using your free cluster.
ms.reviewer: gabil
ms.topic: how-to
ms.date: 09/12/2022
---

# Upgrade a free Azure Data Explorer cluster

Upgrading your free cluster to a full cluster allows you to use [all the features](start-for-free.md#feature-comparison) provided by Azure Data Explorer. Additionally, the free cluster storage size limitation is removed giving you more capacity for growing your data.

## Prerequisites

- A [free Azure Data Explorer cluster](start-for-free-web-ui.md)
- An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/)
- [Contributor](/azure/role-based-access-control/built-in-roles#contributor) permissions or greater in the Azure subscription

> [!NOTE]
> The status of ingestion operations started before the upgrade may not be available after the upgrade. Hence, we highly recommend that you complete all ingestion operations before upgrading your cluster. For more information, see [Ingestion status](kusto/api/netfx/kusto-ingest-client-status.md).

## Upgrade to a full Azure cluster

Use the following steps to upgrade your free cluster to a full cluster. If you're using a Microsoft account (MSA), you must use the step to add a user with a valid Azure subscription before you can upgrade.

> [!NOTE]
> Once the migration has started and until it's completed, you can't delete the cluster and you can't create or delete new databases.
>
> In the last phase of the migration, when data is copied to the new cluster, queries continue to work as normal. No new data is ingested, but data can still be queued for ingestion and shortly after the migration is complete, the data is ingested into the new cluster.
>
> If you don't have Event Hubs owner permission on the cluster, the [ingest from Event Hubs data connection](start-for-free-event-hubs.md) will not migrated to the new cluster. You can create a new data connection to Event Hubs on the new cluster.

1. Go to [My Cluster](https://aka.ms/kustofree) and select **Upgrade to Azure cluster**.

    :::image type="content" source="media/start-for-free-upgrade/start-for-free-upgrade-cluster.png" alt-text="Screenshot of My Cluster page, showing the Upgrade to Azure cluster option." lightbox="media/start-for-free-upgrade/start-for-free-upgrade-cluster.png":::

1. In the "Upgrade cluster" dialog, fill out the cluster details using the following information:

    | Setting | Suggested value | Description |
    |--|--|--|
    | Cluster name | A unique cluster name | Choose a unique name that identifies your cluster. The domain suffix *\[region\].kusto.windows.net* is appended to the cluster name. The name can contain only lowercase letters and numbers and must be between 4 to 22 characters. |
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster. |
    | Resource group | Your resource group | Use an existing resource group or create a new resource group. |
    | Cluster region | Your region | Select the region that best meets your requirements. |
    | Availability Zones | Yes | Use availability zones in the same region (optional). [Azure Availability Zones](/azure/availability-zones/az-overview) are unique physical locations within the same Azure region. They protect an Azure Data Explorer cluster from loss of data. The cluster nodes are created, by default, in the same data center. When you enable availability zones, you can eliminate a single point of failure and ensure high availability. **Deployment to availability zones is possible only when creating the cluster, and can't be modified later.** |

1. If necessary, select **Add user** and sign in using the user with the subscription you want to use. Use this step if your free cluster uses an MSA, or you want to use a different user. The Azure cluster is created in the selected subscription of the user you add.

    :::image type="content" source="media/start-for-free-upgrade/start-for-free-upgrade-cluster-details.png" alt-text="Screenshot of the upgrade cluster pane, showing the add user options.":::

1. Select **Upgrade** to start the upgrade process. The process performs the following actions:
    1. Creates a new Azure cluster using the provided cluster details. The free cluster query and ingestion URIs are transferred to the new Azure cluster to make sure all business logic continue to work.
    1. Copies the data from the free cluster to the full Azure cluster.
    1. Deletes the free cluster.

    Once the upgrade is complete, your new cluster is ready to use. Existing ingestions will continue, queries will be available using all of the supported tools, and you can create a new free cluster.

## Related content

- [Network security for Azure Data Explorer](security-network-overview.md)
- [What is the ingestion wizard?](./ingest-data-wizard.md)
- [Visualize data with dashboards](azure-data-explorer-dashboards.md)
- [Monitor your cluster with metrics](using-metrics.md)