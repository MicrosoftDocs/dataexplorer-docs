---
title: 'Create an Azure Data Explorer cluster & DB with Azure CLI'
description: Learn how to create an Azure Data Explorer cluster and database by using the Azure CLI
ms.reviewer: radennis
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 09/06/2022
---

# Create an Azure Data Explorer cluster and database by using Azure CLI

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

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. In this article, you create a cluster and a database by using Azure CLI.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).

[!INCLUDE [cloud-shell-try-it.md](includes/cloud-shell-try-it.md)]

## Configure the CLI parameters

If you choose to install and use the Azure CLI locally, this article requires the Azure CLI version 2.0.4 or later. Run `az --version` to check your version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

The following steps aren't required if you're running commands in Azure Cloud Shell. If you're running the CLI locally, follow these steps to sign in to Azure, and to set your current subscription:

1. Install extension to use the latest Kusto CLI version:

    ```azurecli-interactive
    az extension add -n kusto
    ```

1. Run the following command to sign in to Azure:

    ```azurecli-interactive
    az login
    ```

1. Set the subscription where you want your cluster to be created. Replace `MyAzureSub` with the name of the Azure subscription that you want to use:

    ```azurecli-interactive
    az account set --subscription MyAzureSub
    ```

1. Set the resource group where you want your cluster to be created. Replace `testrg` with the name of the resource group that you want to use:

    ```azurecli-interactive
    az group create --name testrg --location westus
    ```

## Create the Azure Data Explorer cluster

1. Create your cluster by using the following command:

    ```azurecli-interactive
    az kusto cluster create --cluster-name azureclitest --sku name="Standard_E8ads_v5" tier="Standard" --resource-group testrg --location westus
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | name | *azureclitest* | The desired name of your cluster.|
   | sku | *Standard_E8ads_v5* | The SKU that will be used for your cluster. Parameters: *name* -  The SKU name. *tier* - The SKU tier. |
   | resource-group | *testrg* | The resource group name where the cluster will be created. |
   | location | *westus* | The location where the cluster will be created. |

    There are other optional parameters that you can use, such as the capacity of the cluster.

1. Run the following command to check whether your cluster was successfully created:

    ```azurecli-interactive
    az kusto cluster show --cluster-name azureclitest --resource-group testrg
    ```

If the result contains `provisioningState` with the `Succeeded` value, then the cluster was successfully created.

## Create the database in the Azure Data Explorer cluster

1. Create your database by using the following command:

    ```azurecli-interactive
    az kusto database create --cluster-name azureclitest --database-name clidatabase --resource-group testrg --read-write-database soft-delete-period=P365D hot-cache-period=P31D location=westus
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | cluster-name | *azureclitest* | The name of your cluster where the database will be created.|
   | database-name | *clidatabase* | The name of your database.|
   | resource-group | *testrg* | The resource group name where the cluster will be created. |
   | read-write-database | *P365D* *P31D* *westus* | The database type. Parameters: *soft-delete-period* - Signifies the amount of time the data will be kept available to query. See [retention policy](kusto/management/retentionpolicy.md) for more information. *hot-cache-period* - Signifies the amount of time the data will be kept in cache. See [cache policy](kusto/management/cachepolicy.md) for more information. *location* -The location where the database will be created. |

1. Run the following command to see the database that you created:

    ```azurecli-interactive
    az kusto database show --database-name clidatabase --resource-group testrg --cluster-name azureclitest
    ```

You now have a cluster and a database.

## Clean up resources

* If you plan to follow our other articles, keep the resources you created.
* To clean up resources, delete the cluster. When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

    ```azurecli-interactive
    az kusto cluster delete --cluster-name azureclitest --resource-group testrg
    ```

## Next steps

* [Ingest data using the Azure Data Explorer Python library](python-ingest-data.md)
