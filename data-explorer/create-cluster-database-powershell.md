---
title: 'Create an Azure Data Explorer cluster and database using PowerShell'
description: Learn how to create an Azure Data Explorer cluster and database by using PowerShell
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 09/05/2022
---


# Create an Azure Data Explorer cluster and database by using PowerShell

> [!div class="op_single_selector"]
>
> * [Web UI free cluster](start-for-free-web-ui.md)
> * [Portal](create-cluster-database-portal.md)
> * [CLI](create-cluster-database-cli.md)
> * [PowerShell](create-cluster-database-powershell.md)
> * [C#](create-cluster-database-csharp.md)
> * [Python](create-cluster-database-python.md)
> * [Go](create-cluster-database-go.md)
> * [ARM template](create-cluster-database-resource-manager.md)  

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. In this article, you create a cluster and a database by using PowerShell. You can run PowerShell cmdlets and scripts on Windows, Linux, or in [Azure Cloud Shell](/azure/cloud-shell/overview) with [Az.Kusto](/powershell/module/az.kusto/#kusto) to create and configure Azure Data Explorer clusters and databases.

## Prerequisites

[!INCLUDE [updated-for-az](includes/updated-for-az.md)]

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).

[!INCLUDE [cloud-shell-try-it.md](includes/cloud-shell-try-it.md)]

* If you choose to install and use the Azure CLI locally, this article requires the Azure CLI version 2.0.4 or later. Run `az --version` to check your version. To install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

* For assignment of database reader or database administrator role, see assigning [security roles](kusto/management/security-roles.md).

## Configure parameters

The following steps aren't required if you're running commands in Azure Cloud Shell. If you're running the CLI locally, follow steps 1 and 2 to sign in to Azure and to set your current subscription:

1. Run the following command to sign in to Azure:

    ```azurepowershell-interactive
    Connect-AzAccount
    ```

1. Set the subscription where you want your cluster to be created:

    ```azurepowershell-interactive
     Set-AzContext -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ```

1. When running Azure CLI locally or in the Azure Cloud Shell, you need to install the Az.Kusto module on your device:

    ```azurepowershell-interactive
     Install-Module -Name Az.Kusto
    ```

## Create the Azure Data Explorer cluster

1. Create your cluster by using the following command:

    ```azurepowershell-interactive
     New-AzKustoCluster -ResourceGroupName testrg -Name mykustocluster -Location westus2 -SkuTier Standard -SkuCapacity 2 -SkuName 'Standard_E8ads_v5'
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | Name | *mykustocluster* | The desired name of your cluster.|
   | Sku | *Standard_E8ads_v5* | The SKU that will be used for your cluster. |
   | ResourceGroupName | *testrg* | The resource group name where the cluster will be created. |

    There are other optional parameters that you can use, such as the capacity of the cluster.

1. Run the following command to check whether your cluster was successfully created:

    ```azurepowershell-interactive
    Get-AzKustoCluster -Name mykustocluster -ResourceGroupName testrg
    ```

If the result contains `provisioningState` with the `Succeeded` value, then the cluster was successfully created.

## Create the database in the Azure Data Explorer cluster

1. Create your database by using the following command:

    ```azurepowershell-interactive
    New-AzKustoDatabase -ResourceGroupName testrg -ClusterName mykustocluster -Name mykustodatabase -SoftDeletePeriod 3650:00:00:00 -HotCachePeriod 3650:00:00:00
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | ClusterName | *mykustocluster* | The name of your cluster where the database will be created.|
   | Name | *mykustodatabase* | The name of your database.|
   | ResourceGroupName | *testrg* | The resource group name where the cluster will be created. |
   | SoftDeletePeriod | *3650:00:00:00* | The amount of time that data will be kept available to query. |
   | HotCachePeriod | *3650:00:00:00* | The amount of time that data will be kept in cache. |

1. Run the following command to see the database that you created:

    ```azurepowershell-interactive
    Get-AzKustoDatabase -ClusterName mykustocluster -ResourceGroupName testrg -Name mykustodatabase
    ```

You now have a cluster and a database.

## Clean up resources

* If you plan to follow our other articles, keep the resources you created.
* To clean up resources, delete the cluster. When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

    ```azurepowershell-interactive
    Remove-AzKustoCluster -ResourceGroupName testrg -Name mykustocluster
    ```

## Next steps

* [Additional Az.Kusto commands](/powershell/module/az.kusto/#kusto)
* [Ingest data using the Azure Data Explorer .NET Standard SDK (Preview)](./net-sdk-ingest-data.md)
