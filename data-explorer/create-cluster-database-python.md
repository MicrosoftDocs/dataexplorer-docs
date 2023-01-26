---
title: 'Create an Azure Data Explorer cluster & DB using Python'
description: Learn how to create an Azure Data Explorer cluster and database by using Python.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 06/03/2019
---

# Create an Azure Data Explorer cluster and database by using Python

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

In this article, you create an Azure Data Explorer cluster and database by using Python. Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, first create a cluster, and create one or more databases in that cluster. Then ingest, or load, data into a database so that you can run queries against it.

## Prerequisites

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [Python 3.4+](https://www.python.org/downloads/).
* [An Azure AD Application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Get values for `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

## Install Python package

To install the Python package for Azure Data Explorer (Kusto), open a command prompt that has Python in its path. Run this command:

```
pip install azure-common
pip install azure-mgmt-kusto
```
## Authentication
For running the examples in this article, we need an Azure AD Application and service principal that can access resources. Check [create an Azure AD application](/azure/active-directory/develop/howto-create-service-principal-portal) to create a free Azure AD Application and add role assignment at the subscription scope. It also shows how to get the `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

## Create the Azure Data Explorer cluster

1. Create your cluster by using the following command:

    ```Python
    from azure.mgmt.kusto import KustoManagementClient
    from azure.mgmt.kusto.models import Cluster, AzureSku
    from azure.common.credentials import ServicePrincipalCredentials

    #Directory (tenant) ID
    tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    #Application ID
    client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    #Client Secret
    client_secret = "xxxxxxxxxxxxxx"
    subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    credentials = ServicePrincipalCredentials(
        client_id=client_id,
        secret=client_secret,
        tenant=tenant_id
    )

    location = 'Central US'
    sku_name = 'Standard_E8ads_v5'
    capacity = 5
    tier = "Standard"
    resource_group_name = 'testrg'
    cluster_name = 'mykustocluster'
    cluster = Cluster(location=location, sku=AzureSku(name=sku_name, capacity=capacity, tier=tier))
    
    kusto_management_client = KustoManagementClient(credentials, subscription_id)

    cluster_operations = kusto_management_client.clusters
    
    poller = cluster_operations.begin_create_or_update(resource_group_name, cluster_name, cluster)
    poller.wait()
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | cluster_name | *mykustocluster* | The desired name of your cluster.|
   | sku_name | *Standard_E8ads_v5* | The SKU that will be used for your cluster. |
   | tier | *Standard* | The SKU tier. |
   | capacity | *number* | The number of instances of the cluster. |
   | resource_group_name | *testrg* | The resource group name where the cluster will be created. |

    > [!NOTE]
    > **Create a cluster** is a long running operation. Method **begin_create_or_update** returns an instance of LROPoller, see [LROPoller class](/python/api/msrest/msrest.polling.lropoller) to get more information.

1. Run the following command to check whether your cluster was successfully created:

    ```Python
    cluster_operations.get(resource_group_name = resource_group_name, cluster_name= cluster_name, custom_headers=None, raw=False)
    ```

If the result contains `provisioningState` with the `Succeeded` value, then the cluster was successfully created.

## Create the database in the Azure Data Explorer cluster

1. Create your database by using the following command:

    ```Python
    from azure.mgmt.kusto import KustoManagementClient
    from azure.common.credentials import ServicePrincipalCredentials
    from azure.mgmt.kusto.models import ReadWriteDatabase
	from datetime import timedelta

    #Directory (tenant) ID
    tenant_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    #Application ID
    client_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    #Client Secret
    client_secret = "xxxxxxxxxxxxxx"
    subscription_id = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"
    credentials = ServicePrincipalCredentials(
        client_id=client_id,
        secret=client_secret,
        tenant=tenant_id
    )
	
    location = 'Central US'
    resource_group_name = 'testrg'
    cluster_name = 'mykustocluster'
    soft_delete_period = timedelta(days=3650)
    hot_cache_period = timedelta(days=3650)
    database_name = "mykustodatabase"

    kusto_management_client = KustoManagementClient(credentials, subscription_id)
    
    database_operations = kusto_management_client.databases
    database = ReadWriteDatabase(location=location,
     					soft_delete_period=soft_delete_period,
     					hot_cache_period=hot_cache_period)
    
    poller = database_operations.begin_create_or_update(resource_group_name = resource_group_name, cluster_name = cluster_name, database_name = database_name, parameters = database)
    poller.wait()
    ```

    > [!NOTE]
    > If you are using Python version 0.4.0 or below, use Database instead of ReadWriteDatabase.

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | cluster_name | *mykustocluster* | The name of your cluster where the database will be created.|
   | database_name | *mykustodatabase* | The name of your database.|
   | resource_group_name | *testrg* | The resource group name where the cluster will be created. |
   | soft_delete_period | *3650 days, 0:00:00* | The amount of time that data will be kept available to query. |
   | hot_cache_period | *3650 days, 0:00:00* | The amount of time that data will be kept in cache. |

1. Run the following command to see the database that you created:

    ```Python
    database_operations.get(resource_group_name = resource_group_name, cluster_name = cluster_name, database_name = database_name)
    ```

You now have a cluster and a database.

## Clean up resources

* If you plan to follow our other articles, keep the resources you created.
* To clean up resources, delete the cluster. When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

    ```Python
    cluster_operations.delete(resource_group_name = resource_group_name, cluster_name = cluster_name)
    ```

## Next steps

* [Ingest data using the Azure Data Explorer Python library](python-ingest-data.md)
