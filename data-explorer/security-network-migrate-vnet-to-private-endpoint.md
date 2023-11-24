---
title: Migrate virtual network injected Azure Data Explorer cluster
description: In this article, you'll learn how to migrate virtual network injected Azure Data Explorer cluster.
ms.reviewer: gunjand
ms.topic: how-to
ms.date: 11/24/2023
---

# Migrate Virtual Network injected Azure Data Explorer cluster (Preview)

This article describes the migration of a Virtual Network (VNet) injected Azure Data Explorer (ADX) to a network security based on Azure Private Endpoints. A detailed comparison can be found in the network security [overview](security-network-overview.md#comparison-and-recommendation) documentation.

The process of the migration will take several minutes. During the process of migration the service creates a new cluster for the engine and the data management services which reside in a virtual network which is managed by Microsoft on behalf of our customers. Once that process was finished, the connection will be switched to the newly created services for you. This results in a minimal downtime for querying the cluster.

After the migration was completed, you will still be able to connect to the cluster using the `private-[clustername].[geo-region].kusto.windows.net` (engine) and `ingest-private-[clustername].[geo-region].kusto.windows.net`\\`private-ingest-[clustername].[geo-region].kusto.windows.net` (data management) FQDNs. Nevertheless, it's recommended to move to the regular cluster endpoints which don't contain the word "private".

## Prerequisites

- You have an existing ADX cluster that uses VNet injection and you want to migrate it.
- (Optional) You have a virtual network and a subnet where you want to create the private endpoint for the ADX cluster.
- You have the required permissions to create and manage private endpoints and private DNS zones in your subscription and resource group.

## (Optional) Steps before the migration

This step is considered optional because you can make the required configuration after the migration of the cluster. Nevertheless, it's recommended to it upfront in order to limit a potential service disruption.

Once the ADX cluster was migrated from the Virtual Network you need to ensure that clients which reside in the virtual network are able to connect to the cluster. Additionally you need to ensure that the ADX cluster is able to connect to other services. The latter point is important in scenarios, where firewalls for [Azure Storage](/azure/storage/common/storage-network-security) or [Azure Event Hubs](/azure/event-hubs/event-hubs-ip-filtering) were used. A classic example is: You were using Service Endpoints for your Azure Storage and Azure Event Hub Namespace. Once you migrated your ADX cluster out of the virtual network, it will not be able to connect to those services because the ADX compute components are not any longer in the virtual network, which was whitelisted for the service endpoints of Azure Storage and Azure Event Hub. To allow ADX to connect to them you need to setup [Managed Private Endpoints](security-network-managed-private-endpoint-create.md).

> [!WARNING]
> You need to ensure that the ADX cluster is able to establish a connection to services which are required for ingestion and/or external tables. Otherwise, you are risking data loss or queries which are making callouts to other network protected services might stop functioning.

Please follow those steps to get to the configuration in the Azure Portal:

1. Go to the **Azure Data Explorer** cluster you would like to migrate.

1. From the left menu, select **Networking**.

   :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-overview.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters.":::

The configuration of the following sections can be found on the individual tabs.

### Creating Private Endpoints

> [!NOTE]
> This configuration will take effect only after the migration of your ADX cluster

The creation of a private endpoint allows you to connect to your ADX cluster even if the [public access](security-network-restrict-public-access.md) was set to "Disabled". To create a private endpoint follow the regular [documentation](security-network-private-endpoint-create.md#create-a-private-endpoint).

:::image type="content" source="./media/security-network-migrate/vnet-injection-migration-pe.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Tab for private endpoints selected.":::

### Creating Managed Private Endpoints

> [!NOTE]
> This configuration will take effect only after the migration of your ADX cluster

The creation of managed private endpoint allows your ADX cluster to connect to other network secured services. To create managed private endpoints follow the regular [documentation](security-network-managed-private-endpoint-create.md).

:::image type="content" source="./media/security-network-migrate/vnet-injection-migration-mpe.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Tab for managed private endpoints selected.":::

### Restricting outbound access

The configuration of restricted outbound access can be configured by following the regular [documentation](security-network-restrict-outbound-access.md). It will take immediate effect even before the migration was executed.

:::image type="content" source="./media/security-network-migrate/vnet-injection-migration-roa.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Tab for restricted outbound access selected.":::

## Migration using the Azure Portal

Please follow those steps to get to the migrate the ADX cluster in the Azure Portal:

1. Go to the **Azure Data Explorer** cluster you would like to migrate.

1. From the left menu, select **Networking**.

   :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-overview.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters.":::

1. Click on the **Migrate** button.

   :::image type="content" source="./media/security-network-migrate/vnet-injection-migration-migrate.png" alt-text="Screenshot of the Networking option in the Azure portal for virtual network injected clusters. Migration tab is selected.":::

1. **Wait** until the migration finishes.

## Migration by modifying the ARM Template

1. Locate the [**VirtualNetworkConfiguration**](/azure/templates/microsoft.kusto/clusters?pivots=deployment-language-arm-template#virtualnetworkconfiguration-1) in the ARM template of your ADX cluster

   ```json
   "virtualNetworkConfiguration": {
       "state": "Enabled",
       "subnetId": "[concat(parameters('virtualNetworks_Test_vnet_externalid'), '/subnets/newsubnet')]",
       "enginePublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3engine_externalid')]",
       "dataManagementPublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3dm_externalid')]"
    },
   ```

1. Replace **"state": "Enabled"** with **"state": "Disabled"**. Don't modify the other properties ("subnetId", "enginePublicIpId", "dataManagementPublicIpId").

   ```json
   "virtualNetworkConfiguration": {
       "state": "Disabled",
       "subnetId": "[concat(parameters('virtualNetworks_Test_vnet_externalid'), '/subnets/newsubnet')]",
       "enginePublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3engine_externalid')]",
       "dataManagementPublicIpId": "[parameters('publicIPAddresses_vnetclusterwestus3dm_externalid')]"
    },
   ```

1. [**Deploy**](/azure/azure-resource-manager/templates/deployment-tutorial-local-template?tabs=azure-powershell) the ARM template

## Migration using the code

You can use a Python script to automate the migration of multiple ADX clusters. The script [migrateADXclusters.py](https://github.com/Azure/azure-kusto-vnet-migration/blob/main/python/migrateADXclusters.py) available in the [Azure Kusto VNet Migration GitHub repository](https://github.com/Azure/azure-kusto-vnet-migration) can be used for this purpose.

Detailed steps on how to use this script are provided in the [README](https://github.com/Azure/azure-kusto-vnet-migration/blob/main/python/README.md) file in the same repository. Please refer to the [README](https://github.com/Azure/azure-kusto-vnet-migration/blob/main/python/README.md) for instructions on how to clone the repository, install the required Python packages, and run the script with the necessary configuration.

This script will migrate the specified ADX clusters in one go, saving you the time and effort of migrating them individually.

## (Optional) Validation

After migrating to private endpoints, it's important to validate that everything is working as expected.

1. Check the private endpoints: Refer to the [troubleshooting guide](security-network-private-endpoint-troubleshoot.md) in case you created private endpoints.

1. Verify ingestion: This is relevant in case you need to connect to network secured services for ingestion like [Azure Event Hubs](ingest-data-event-hub.md). Check if the ingestion is working properly using the [Insights](/azure/data-explorer/monitor-queued-ingestion) or the [command](kusto/management/ingestionfailures.md) to show ingestion failures.

## Next steps

- [Create a Private Endpoints for Azure Data Explorer](security-network-private-endpoint-create.md)
- [Create a Managed Private Endpoints for Azure Data Explorer](security-network-managed-private-endpoint-create.md)
- [How to restrict public access to Azure Data Explorer](security-network-restrict-public-access.md)
- [How to restrict outbound access from Azure Data Explorer](security-network-restrict-outbound-access.md)
