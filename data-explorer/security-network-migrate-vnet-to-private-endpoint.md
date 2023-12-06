---
title: Migrate a Virtual Network injected cluster to private endpoints
description: Learn how to migrate a Virtual Network injected Azure Data Explorer cluster to private endpoints.
ms.reviewer: cosh, gunjand
ms.topic: how-to
ms.date: 11/28/2023
---

# Migrate a Virtual Network injected cluster to private endpoints (Preview)

This article describes the migration of a Microsoft Azure Virtual Network injected Azure Data Explorer cluster to an Azure Private Endpoints network security model. For a detailed comparison, see [Private endpoint vs. virtual network injection](security-network-overview.md#private-endpoint-vs-virtual-network-injection).

The process of the migration takes several minutes. The migration creates a new cluster for the engine and data management services, which reside in a virtual network managed by Microsoft. The connection is switched to the newly created services for you. This process results in a minimal downtime for querying the cluster.

Following the migration, you can still connect to your cluster using the `private-[clustername].[geo-region].kusto.windows.net` (engine) and `ingest-private-[clustername].[geo-region].kusto.windows.net`\\`private-ingest-[clustername].[geo-region].kusto.windows.net` (data management) FQDNs. Nevertheless, we recommend moving to the regular cluster endpoints that aren't prefixed with `private`.

## Prerequisites

- You have an existing Azure Data Explorer cluster that uses Virtual Network injection and you want to migrate it.
- (Optional) You have a virtual network and a subnet where you want to create the private endpoint for the Azure Data Explorer cluster.
- You have the necessary permissions to establish and oversee private endpoints and private DNS zones within your subscription and resource group. For the Azure Data Explorer cluster, Contributor access is required, while other resources like Azure Storage or Event Hubs require Owner permissions.

## Prepare to migrate

We recommend configuring your cluster infrastructure in alignment with the Azure Private Endpoints network security model before initiating the migration process. While it's possible to perform this configuration post-migration, doing so can result in a service disruption.

The following steps ensure that post-migration clients in the virtual network can connect to the cluster and that the cluster can connect to other services. When firewalls for [Azure Storage](/azure/storage/common/storage-network-security) or [Azure Event Hubs](/azure/event-hubs/event-hubs-ip-filtering) are employed, these steps are crucial. For instance, if Service Endpoints were used for Azure Storage and Azure Event Hubs namespace, migrating the cluster out of the virtual network disrupts connections to these services. To restore connectivity, you need to set up managed private endpoints for Azure Data Explorer.

To prepare your cluster for migration:

1. In the Azure portal, go to the **Azure Data Explorer** cluster you'd like to migrate.

1. From the left menu, select **Networking**.

   :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-overview.png" lightbox="./media/security-network-migrate/vnet-injection-migration-overview.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters.":::

1. In order to connect to your cluster even if the [public access](security-network-restrict-public-access.md) was set to `Disabled`, select the **Private Endpoints connections** tab and [create a private endpoint](security-network-private-endpoint-create.md).

    :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-pe.png" lightbox="./media/security-network-migrate/vnet-injection-migration-pe.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Tab for private endpoints selected.":::

    > [!NOTE]
    > This configuration will take effect only after the migration of your your cluster.

1. In order to allow your cluster to connect to other network secured services, select the **Managed private endpoints tab** and [create a managed private endpoint](security-network-managed-private-endpoint-create.md).

    :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-mpe.png" lightbox="./media/security-network-migrate/vnet-injection-migration-mpe.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Tab for managed private endpoints selected.":::

    > [!NOTE]
    > This configuration will take effect only after the migration of your your cluster.

1. To restrict outbound access, select the **Restrict outbound access** tab and see the documentation for how to [Restrict outbound access](security-network-restrict-outbound-access.md). These restrictions take immediate effect.

    :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-roa.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Tab for restricted outbound access selected.":::

> [!WARNING]
> Failure of your cluster to connect to essential services for ingestion and external tables poses a risk of data loss. Additionally, queries calling out to other network-protected services may cease to function.

## Migrate your cluster

### [Azure portal](#tab/portal)

To migrate your cluster from the Azure portal:

1. Go to the **Azure Data Explorer** cluster you would like to migrate.

1. From the left menu, select **Networking**.

   :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-overview.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters.":::

1. Select on the **Migrate** button.

   :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-migrate.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Migration tab is selected.":::

1. **Wait** until the migration finishes.

### [ARM template](#tab/arm)

To migrate your cluster by modifying the ARM template:

1. Locate the [**VirtualNetworkConfiguration**](/azure/templates/microsoft.kusto/clusters?pivots=deployment-language-arm-template#virtualnetworkconfiguration-1) in the ARM template of your cluster

   ```json
   "virtualNetworkConfiguration": {
       "state": "Enabled",
       "subnetId": "[concat(parameters('virtualNetworks_Test_vnet_externalid'), '/subnets/newsubnet')]",
       "enginePublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3engine_externalid')]",
       "dataManagementPublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3dm_externalid')]"
    },
   ```

1. Replace **"state": "Enabled"** with **"state": "Disabled"**. Don't modify the other properties.

   ```json
   "virtualNetworkConfiguration": {
       "state": "Disabled",
       "subnetId": "[concat(parameters('virtualNetworks_Test_vnet_externalid'), '/subnets/newsubnet')]",
       "enginePublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3engine_externalid')]",
       "dataManagementPublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3dm_externalid')]"
    },
   ```

1. [**Deploy**](/azure/azure-resource-manager/templates/deployment-tutorial-local-template?tabs=azure-powershell) the ARM template

### [Python script](#tab/python)

You can use a Python script to automate the migration of multiple your clusters. The script [migrateAzure Data Explorerclusters.py](https://github.com/Azure/azure-kusto-vnet-migration/blob/main/python/migrateADXclusters.py) available in the [Azure Kusto Virtual Network Migration GitHub repository](https://github.com/Azure/azure-kusto-vnet-migration) can be used for this purpose.

Detailed steps on how to use this script are provided in the [README](https://github.com/Azure/azure-kusto-vnet-migration/blob/main/python/README.md) file in the same repository. For instructions on how to clone the repository, refer to the [README](https://github.com/Azure/azure-kusto-vnet-migration/blob/main/python/README.md). Install the required Python packages, and run the script with the necessary configuration.

This script migrates the specified clusters in one go, saving you the time and effort of migrating them individually.

---

## Verify successful migration

After migrating to private endpoints, perform the following checks to verify the migration was successful:

1. If you created new private endpoints, check that they are working as expected. If needed, refer to the [troubleshooting guide](security-network-private-endpoint-troubleshoot.md).

1. Check that ingestion is working properly with the [.show ingestion failures command](kusto/management/ingestionfailures.md) or refer to the guidance in [Monitor queued ingestion with metrics](/azure/data-explorer/monitor-queued-ingestion). This verification is especially relevant if you need to connect to network secured services for ingestion with services like [Azure Event Hubs](ingest-data-event-hub.md).

## Related content

- [Create a Private Endpoints for Azure Data Explorer](security-network-private-endpoint-create.md)
- [Create a Managed Private Endpoints for Azure Data Explorer](security-network-managed-private-endpoint-create.md)
- [How to restrict public access to Azure Data Explorer](security-network-restrict-public-access.md)
- [How to restrict outbound access from Azure Data Explorer](security-network-restrict-outbound-access.md)
