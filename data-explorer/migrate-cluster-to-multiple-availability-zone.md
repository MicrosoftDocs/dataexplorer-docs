---
title: Migrate your cluster to support multiple availability zones (Preview)
description: This guide teaches you how to migrate your cluster to support multiple availability zones.
ms.reviewer: iriskaminer
ms.date: 12/18/2023
ms.topic: how-to
---
# Migrate your cluster to support multiple availability zones (Preview)

Many Azure regions provide availability zones, which are separated groups of datacenters within a region. Availability zones are close enough to have low-latency connections to other availability zones. They're connected by a high-performance network with a round-trip latency of less than 2 ms. However, availability zones are far enough apart to reduce the likelihood that more than one will be affected by local outages or weather. Availability zones have independent power, cooling, and networking infrastructure. They're designed so that if one zone experiences an outage, then regional services, capacity, and high availability are supported by the remaining zones. For more information, see [Azure Availability Zones](/azure/availability-zones/az-overview).

Azure Data Explorer clusters can be configured to use availability zones in supported regions. By using availability zones, a cluster can better withstand the failure of a single datacenter in a region to support [business continuity](business-continuity-overview.md) scenarios.

incur any additional costs

You can configure availability zones when creating a cluster [in the Azure portal](create-cluster-and-database.md#create-a-cluster) or [programmatically](create-cluster-database.md) using one of the following methods:

- REST API
- C# SDK
- Python SDK
- PowerShell
- ARM Template

> [!IMPORTANT]
>
> - Migration to multiple availability zones is not available in regions where storage conversion to Zone-redundant storage (ZRS) is not supported. For list of non supported regions, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration#region).
> - Once a cluster is configured with availability zones, you can't change the cluster to not use availability zones.
> - Multiple zones aren't supported in all regions. Therefore, clusters located in these regions can't be set up to use availability zones.
> - Using availability zones incurs additional costs.

> [!NOTE]
>
> - Before you proceed, make sure you familiar with the [migration process and considerations](#migration-process).
> - You can also use these steps to change the zones of an existing cluster that uses availability zones.

In this article, you learn about:

> [!div class="checklist"]
>
> - How to [configure your cluster to support availability zones](#configure-your-cluster-to-support-availability-zones)
> - The [architecture of clusters with availability zones](#architecture-of-clusters-with-availability-zones)
> - The [migration process and considerations](#migration-process)

## Prerequisites

- For migrating a cluster to support availability zones, you need a cluster that was deployed without any availability zones.

- For changing the zones of a cluster, you need a cluster that is configured with availability zones.

- For REST API, familiarize yourself with [Manage Azure resources by using the REST API](/azure/azure-resource-manager/management/manage-resources-rest).
- For other programmatic methods, see [Prerequisites](create-cluster-database.md#prerequisites).

## Get the list of availability zones for your cluster's region

You can get a list of availability zones for a region by using the following Azure CLI command:

```azurecli
az account list-locations --query "[?name=='{regionName}']"
```

For example, the following command gets the list of availability zones for the `westeurope` region:

```azurecli
az account list-locations --query "[?name=='{westeurope}']"
```

The availability zones are listed in the `availabilityZoneMappings` property.

```json
[
  {
    "availabilityZoneMappings": [
      {
        "logicalZone": "1",
        "physicalZone": "westeurope-az3"
      },
      {
        "logicalZone": "2",
        "physicalZone": "westeurope-az1"
      },
      {
        "logicalZone": "3",
        "physicalZone": "westeurope-az2"
      }
    ],

    ...

    "name": "westeurope",
    "regionalDisplayName": "(Europe) West Europe",
    "type": "Region"
  }
]
```

## Configure your cluster to support availability zones

To add availability zones to an existing cluster, you must update the cluster `zones` attribute with a list of the target availability zones. Follow the instructions for your preferred method, using the information in the following table:

| Parameter | Value |
| --- | --- |
| `subscriptionId` | The subscription ID of the cluster |
| `resourceGroupName` | The resource group name of the cluster |
| `clusterName` | The name of the cluster |
| `apiVersion` | `2023-05-02` or later |

> [!IMPORTANT]
> Changing the availability zones for an existing cluster only changes the availability zones for the compute. The persistent storage is not changed.

### [REST API](#tab/rest-api)

Follow the instructions on how to [deploy a template](/azure/azure-resource-manager/management/manage-resources-rest?tabs=azure-cli#deploy-a-template).

1. Make the REST API call to the following endpoint where you replace the parameters with your values:

    ```http
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Kusto/clusters/{clusterName}?api-version={apiVersion}
    ```

1. Specify your availability zones in the request body. For example, to configure the cluster to use availability zones 1, 2, and 3, set the body as follows:

    ```json
    { "zones": [ "{zone1}", "{zone2}", "{zone3}" ] }
    ```

### [C\#](#tab/csharp)

1. If you don't have the Azure.Identity and Azure.ResourceManager.Kusto libraries installed, use the following commands to install them:

    ```powershell
    dotnet add package Azure.Identity
    dotnet add package Azure.ResourceManager.Kusto
    ```

1. In your application, add the following code:

    ```json
    "zones": [ "{zone1}", "{zone2}", "{zone3}" ]
    ```

    For example, to set you zones to 1, 2, and 3, in the North Europe region, use the following code:

    :::code language="csharp" source="samples/migrate-cluster-to-multiple-availability-zone/configure-zones.cs" highlight="20-24":::

1. Run your application.

### [Python](#tab/python)

1. In your application, add the following code:

    ```json
    "zones": [ "{zone1}", "{zone2}", "{zone3}" ]
    ```

    For example, to set you zones to 1, 2, and 3, in the North Europe region, use the following code:

    :::code language="python" source="samples/migrate-cluster-to-multiple-availability-zone/configure-zones.py" highlight="12":::

1. Run your application.

### [PowerShell](#tab/powershell)

You can use the following Powershell command to configure your cluster to use availability zones. Make sure you have [installed the Kusto tools libraries](kusto/api/powershell/powershell.md#get-the-libraries) and replace the parameters with your values.

```powershell
Update-AzKustoCluster -SubscriptionId {subscriptionId} -ResourceGroupName {resourceGroupName} -Name {clusterName} -Zone "{zone1}", "{zone2}", "{zone3}"
```

### [ARM Template](#tab/arm)

1. In your ARM template, add the following property to the `Microsoft.Kusto/clusters` resource:

    ```json
    "zones": [ "{zone1}", "{zone2}", "{zone3}" ]
    ```

    For example, to set you zones to 1, 2, and 3, in the North Europe region, use the following template:

    :::code language="json" source="samples/migrate-cluster-to-multiple-availability-zone/configure-zones.json" highlight="22":::

1. Deploy the ARM template. For more information, see [Deploy resources with ARM templates and Azure CLI](/azure/azure-resource-manager/management/manage-resources-rest#deploy-a-template).

---

During the migration, the following message appears in the Azure portal, on the cluster's overview page. The message is removed after the migration completes.

> Zonality change for the storage of this cluster is in progress. Update time may vary depending on the amount of data.

## Architecture of clusters with availability zones

When availability zones are configured, a cluster's resources are deployed as follows:

- **Compute layer**: Azure Data Explorer is a distributed computing platform that has two or more nodes. If availability zones are configured, compute nodes are distributed across the defined availability zone for maximum intra-region resiliency. A zone failure might degrade cluster performance, until the failed compute resources are redeployed in the surviving zones. We recommended configuring the maximum available zones in a region.

    > [!NOTE]
    >
    > - In some cases, due to compute capacity limitations, only partial availability zones will be available for the compute layer.
    > - A cluster's compute layer implements a best effort approach to evenly spread instances across selected zones.

- **Persistent storage layer**: Clusters use Azure Storage as its durable persistence layer. If availability zones are configured, [ZRS](/azure/storage/common/storage-redundancy#zone-redundant-storage) is enabled, placing storage replicas across all three availability zones for maximum intra-region resiliency.

    > [!NOTE]
    >
    > - ZRS incurs an additional cost.
    > - When availability zones aren't configured, storage resources are deployed with the default setting of [Locally Redundant Storage (LRS)](/azure/storage/common/storage-redundancy#locally-redundant-storage), placing all 3 replicas is a single zone.

## Migration process

When an existing cluster that was deployed without any availability zones is configured to support availability zones, the following steps take place as part of the migration process:

- Compute is distributed in the defined availability zones

    The process of redistributing compute resources involves a preparation stage in which the zonal Compute resources cache is warmed. During the preparation stage, the existing cluster's compute resources continue to function, ensuring uninterrupted service. This preparation phase can take up to tens of minutes. The transition to the new compute resources only occurs once it's fully prepared and operational. This parallel processing approach ensures a relatively seamless experience, with only minimal service disruption during the switchover process, typically lasting between one to three minutes. However, it's important to note that query performance might be affected during the SKU migration. The degree of impact can vary depending on specific usage patterns.

- Historical persistent storage data is migrated to ZRS

    The migration process is dependent on the regional support for the transition from LRS to ZRS storage, as well as the available storage accounts capacity in the selected zones. The transfer of historical data can be a time-consuming process, potentially taking several hours or even extending over to weeks.

- All new data is written to ZRS

    After the request for migration to availability zones is initiated, all new data is replicated and stored in the ZRS configuration.

    > [!NOTE]
    >
    > - Following the migration request, there might be a delay of up to several minutes before all new data begins to be written in the ZRS configuration.
    > - If a cluster has streaming ingestion, then the recycling of new data to be written as ZRS data, can take up to 30 days.

### Considerations

The request for migration to availability zones might not be successful due to capacity constraints. For a successful migration, there must be sufficient compute and storage capacity to support the migration. If there are capacity limitations, you'll get an error message indicating the issue.

## See also

- [Business continuity and disaster recovery overview](business-continuity-overview.md)