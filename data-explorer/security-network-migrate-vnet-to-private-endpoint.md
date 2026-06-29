---
title: Migrate a Virtual Network Injected Cluster to Private Endpoints
description: Learn how to migrate a Virtual Network injected Azure Data Explorer cluster to private endpoints.
ms.reviewer: cosh, gunjand
ms.topic: how-to
ms.date: 03/15/2026
ms.custom: sfi-image-nochange
---

# Migrate a Virtual Network injected cluster to private endpoints

> [!WARNING]
> By 1 February 2025, Azure Data Explorer retired Virtual Network Injection.

This article describes how to migrate a Microsoft Azure Virtual Network injected Azure Data Explorer cluster to an Azure Private Endpoints network security model.

The migration process takes several minutes. The migration creates a new cluster for the engine and data management services, which reside in a virtual network managed by Microsoft. The connection switches to the newly created services. This process results in minimal downtime for querying the cluster.

After the migration, you can still connect to your cluster by using the `private-[clustername].[geo-region].kusto.windows.net` (engine) and `ingest-private-[clustername].[geo-region].kusto.windows.net`\\`private-ingest-[clustername].[geo-region].kusto.windows.net` (data management) FQDNs. Nevertheless, move to the regular cluster endpoints that aren't prefixed with `private`.

## Prerequisites

- You have an existing Azure Data Explorer cluster that uses Virtual Network injection and you want to migrate it. For more information, see [Find clusters that use Virtual Network injection](#find-clusters-that-use-virtual-network-injection).
- You must have at least [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor) permissions to manage the cluster.
- You must have at least [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor) permissions to manage the Virtual Network where the cluster is located.
- You must have at least [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor) permissions to manage the Private IP attached to your cluster.
- For other resources, such as Azure Storage or Event Hubs, you must have at least Owner permissions.
- (Optional) You have a virtual network and a subnet where you want to create the private endpoint for the Azure Data Explorer cluster.
- (Optional) You have the necessary permissions to establish and oversee private endpoints and private DNS zones within your subscription and resource group.

> [!TIP]
> Alternatively, while performing the migration, you can temporarily have at least Contributor permissions on the resource group containing your cluster.

## Find clusters that use Virtual Network injection

You can use Azure Resource Graph to determine which clusters in your subscription use Virtual Network injection by exploring your Azure resources by using the Kusto Query Language (KQL).

### [Azure Resource Graph](#tab/arg)

1. Go to the Resource Graph Explorer in the [Azure portal](https://portal.azure.com/).
1. Copy and paste the following query. Then select **Run query** to list all clusters that use Virtual Network injection:

    The query filters the resources to only include clusters (`microsoft.kusto/clusters`) where the `virtualNetworkConfiguration` property state is set to `Enabled`, indicating that the cluster uses Virtual Network injection.

    ```kusto
    resources 
    | where type == 'microsoft.kusto/clusters' 
    | where properties.virtualNetworkConfiguration.state == 'Enabled' 
    | project name, resourceGroup, subscriptionId, location
    ```

### [Azure CLI](#tab/cli)

You can also use the Azure CLI to run the same query. First, ensure you have the [Azure CLI installed](/cli/azure/install-azure-cli) and are [signed in](/cli/azure/authenticate-azure-cli) to your Azure account.

Run the following Azure CLI command to execute the query:

```azurecli
az graph query -q "resources | where type == 'microsoft.kusto/clusters' | where properties.virtualNetworkConfiguration.state == 'Enabled' | project name, resourceGroup, subscriptionId, location"
```

---

## Prepare to migrate

Before you start the migration process, configure your cluster infrastructure to align with the Azure Private Endpoints network security model. You can configure this model after migration, but it can cause service disruption.

The following steps ensure that post-migration clients in the virtual network can connect to the cluster and that the cluster can connect to other services. These steps are crucial when you use firewalls for [Azure Storage](/azure/storage/common/storage-network-security) or [Azure Event Hubs](/azure/event-hubs/event-hubs-ip-filtering). For example, if you used Service Endpoints for Azure Storage and Azure Event Hubs namespace, migrating the cluster out of the virtual network disrupts connections to these services. To restore connectivity, you need to set up managed private endpoints for Azure Data Explorer.

To prepare your cluster for migration:

1. In the Azure portal, go to the **Azure Data Explorer** cluster that you want to migrate.

1. From the left menu, select **Networking**.

   :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-overview.png" lightbox="./media/security-network-migrate/vnet-injection-migration-overview.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters.":::

1. To connect to your cluster even if you set [public access](security-network-restrict-public-access.md) to `Disabled`, select the **Private Endpoints connections** tab and [create a private endpoint](security-network-private-endpoint-create.md). Make sure that you choose a different subnet than the one you used for your Azure Data Explorer cluster with Azure Virtual Network integration. Otherwise, the private endpoint deployment fails.

    :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-pe.png" lightbox="./media/security-network-migrate/vnet-injection-migration-pe.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Tab for private endpoints selected.":::

    > [!NOTE]
    > This configuration takes effect only after the migration of your cluster.

1. To allow your cluster to connect to other network secured services, select the **Managed private endpoints** tab and [create a managed private endpoint](security-network-managed-private-endpoint-create.md).

    :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-mpe.png" lightbox="./media/security-network-migrate/vnet-injection-migration-mpe.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Tab for managed private endpoints selected.":::

    > [!NOTE]
    > This configuration takes effect only after the migration of your cluster.

1. To restrict outbound access, select the **Restrict outbound access** tab and see the documentation for how to [Restrict outbound access](security-network-restrict-outbound-access.md). These restrictions take immediate effect.

    :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-roa.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Tab for restricted outbound access selected.":::

> [!WARNING]
> If your cluster can't connect to essential services for ingestion and external tables, it risks data loss. Also, queries that call out to other network-protected services might stop working.

> [!WARNING]
> You must perform the migration step within a few hours of completing the preparation steps. If you delay the migration, the service might malfunction.

## Migrate your cluster

### [Azure portal](#tab/portal)

To migrate your cluster from the Azure portal:

1. Go to the **Azure Data Explorer** cluster you want to migrate.

1. From the left menu, select **Networking**.

   :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-overview.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters.":::

1. Select the **Migrate** button.

   :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-migrate.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Migration tab is selected.":::

1. **Wait** until the migration finishes.

### [ARM template](#tab/arm)

To migrate your cluster by modifying the ARM template:

1. Locate the [**VirtualNetworkConfiguration**](/azure/templates/microsoft.kusto/clusters?pivots=deployment-language-arm-template#virtualnetworkconfiguration-1) in the ARM template of your cluster.

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

1. [**Deploy**](/azure/azure-resource-manager/templates/deployment-tutorial-local-template?tabs=azure-powershell) the ARM template.

### [Python script](#tab/python)

You can use a Python script to automate the migration of multiple clusters. Use the script [migrateAzure Data Explorerclusters.py](https://github.com/Azure/azure-kusto-vnet-migration/blob/main/python/migrateADXclusters.py) in the [Azure Kusto Virtual Network Migration GitHub repository](https://github.com/Azure/azure-kusto-vnet-migration).

The [README](https://github.com/Azure/azure-kusto-vnet-migration/blob/main/python/README.md) file in the same repository provides detailed steps on how to use this script. For instructions on how to clone the repository, refer to the [README](https://github.com/Azure/azure-kusto-vnet-migration/blob/main/python/README.md). Install the required Python packages, and run the script with the necessary configuration.

This script migrates the specified clusters in one go, saving you the time and effort of migrating them individually.

---

## Verify successful migration

After migrating to private endpoints, perform the following checks to verify the migration was successful:

1. If you created new private endpoints, check that they're working as expected. If needed, refer to the [troubleshooting guide](security-network-private-endpoint-troubleshoot.md).

1. Check that ingestion is working properly by using the [.show ingestion failures command](/kusto/management/ingestion-failures?view=azure-data-explorer&preserve-view=true) or refer to the guidance in [Monitor queued ingestion with metrics](monitor-queued-ingestion.md). This verification is especially relevant if you need to connect to network secured services for ingestion with services like [Azure Event Hubs](ingest-data-event-hub-overview.md).

## Rollback

To roll back your migration to the previous Virtual Network injected configuration by modifying the ARM template:

1. Locate the [**VirtualNetworkConfiguration**](/azure/templates/microsoft.kusto/clusters?pivots=deployment-language-arm-template#virtualnetworkconfiguration-1) in the ARM template of your cluster.

	```json
	"virtualNetworkConfiguration": {
		"state": "Disabled",
		"subnetId": "[concat(parameters('virtualNetworks_Test_vnet_externalid'), '/subnets/newsubnet')]",
        "enginePublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3engine_externalid')]",
        "dataManagementPublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3dm_externalid')]"
	},
	```

1. Replace **"state": "Disabled"** with **"state": "Enabled"**. Verify that the other properties remain unchanged.

	```json
	"virtualNetworkConfiguration": {
		"state": "Enabled",
		"subnetId": "[concat(parameters('virtualNetworks_Test_vnet_externalid'), '/subnets/newsubnet')]",
        "enginePublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3engine_externalid')]",
        "dataManagementPublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3dm_externalid')]"
	},
	```

1. [**Deploy**](/azure/azure-resource-manager/templates/deployment-tutorial-local-template?tabs=azure-powershell) the ARM template to apply the changes.

This change restores your cluster to the previous Virtual Network injected configuration.

## Related content

- [Create a Private Endpoints for Azure Data Explorer](security-network-private-endpoint-create.md)
- [Create a Managed Private Endpoints for Azure Data Explorer](security-network-managed-private-endpoint-create.md)
- [How to restrict public access to Azure Data Explorer](security-network-restrict-public-access.md)
- [How to restrict outbound access from Azure Data Explorer](security-network-restrict-outbound-access.md)
