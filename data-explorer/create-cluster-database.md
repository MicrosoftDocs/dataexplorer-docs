---
title: 'Create an Azure Data Explorer cluster and database'
description: Learn how to create an Azure Data Explorer cluster and database.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 05/04/2023
---

# Create an Azure Data Explorer cluster and database

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. In this article, you'll learn how to create a cluster and a database using either the Azure portal, C#, Python, Go, the Azure CLI, Powershell, or an Azure Resource Manager (ARM) template.

>[!TIP]
> You can also [create a free cluster](start-for-free-web-ui.md) with only a Microsoft account or an Azure Active Directory user identity.

## Prerequisites

The prerequisite steps depend on the method you plan to use to create your cluster. Choose the relevant tab to get started.

### [Portal](#tab/portal)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Sign in to the [Azure portal](https://portal.azure.com/).

### [C#](#tab/csharp)

* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/). Turn on **Azure development** during the Visual Studio setup.
* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Install the [Microsoft.Azure.Management.Kusto NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* [An Azure AD Application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Get values for **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

### [Python](#tab/python)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [Python 3.4+](https://www.python.org/downloads/).
* Install the [azure-common](https://pypi.org/project/azure-common/) and [azure-mgmt-kusto](https://pypi.org/project/azure-mgmt-kusto/) packages.
* [An Azure AD Application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Get values for **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

### [Go](#tab/go)

### [Azure CLI](#tab/azcli)

### [Powershell](#tab/powershell)

### [ARM template](#tab/arm)

## Create an Azure Data Explorer cluster

In this section, you'll create an Azure Data Explorer cluster that can contain databases and tables.

### [Portal](#tab/portal)

The following steps outline how to create an Azure Data Explorer cluster with a defined set of compute and storage resources in an Azure resource group.

1. Select the **+ Create a resource** button in the upper-left corner of the portal.

    :::image type="content" source="media/create-cluster-database-portal/create-resource.png" alt-text="Screenshot of the Create a resource button.":::

1. Search for "Azure Data Explorer".

    :::image type="content" source="media/create-cluster-database-portal/search-resources.png" alt-text="Search Azure Data Explorer":::

1. Under **Azure Data Explorer**, select **Create**.

    :::image type="content" source="media/create-cluster-database-portal/create-click.png" alt-text="Screenshot of the Create a cluster window":::

1. Fill out the basic cluster details with the following information.

    :::image type="content" source="media/create-cluster-database-portal/create-cluster-form.png" alt-text="Screenshot of the Azure portal create Azure Data Explorer cluster form.":::

    **Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Subscription | Your subscription | Select the Azure subscription that you want to use for your cluster.|
    | Resource group | Your resource group | Use an existing resource group or create a new resource group. |
    | Cluster name | A unique cluster name | Choose a unique name that identifies your cluster. The domain name *[region].kusto.windows.net* is appended to the cluster name you provide. The name can contain only lowercase letters and numbers. It must contain from 4 to 22 characters.
    | Region | *West US* or *West US 2* | Select *West US* or *West US 2* (if using availability zones) for this quickstart. For a production system, select the region that best meets your needs.
    | Workload | *Dev/Test* | Select *Dev/Test* for this quickstart. For a production system, select the specification that best meets your needs.
    | Compute specifications | *Dev(No SLA)_Standard_E2a_v4* | Select *Dev(No SLA)_Standard_E2a_v4* for this quickstart. For a production system, select the specification that best meets your needs.
    | Availability zones | On | Turning on this feature will distribute the cluster storage and compute resources across multiple physical zones within a region for added protection and availability. By default, this feature is turned on if zones are supported in the region. If less than 3 zones are available for the compute instances, the portal will display the number of supported zones. Note that deployment to availability zones is possible only when creating the cluster, and can't be modified later. Read more about [Azure Availability Zones](/azure/availability-zones/az-overview).|

1. Select **Review + create** to review your cluster details, and on the next screen select **Create** to provision the cluster. Provisioning typically takes about 10 minutes.

1. When the deployment is complete, select **Go to resource**.

    :::image type="content" source="media/create-cluster-database-portal/notification-resource.png" alt-text="Screenshot of the Go to resource button.":::

> [!NOTE]
>
> If the deployment fails with the error "SubscriptionNotRegistered", retry the operation.
>
> Deployment fails when the resource provider isn't registered on the subscription described in [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types). When the deployment fails, the resource provider registers itself on the subscription, and the retry can then succeed.

### [C#](#tab/csharp)

1. Create your cluster by using the following code:

    ```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";//Application ID
    var clientSecret = "PlaceholderClientSecret";//Client Secret
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var authenticationContext = new AuthenticationContext($"https://login.windows.net/{tenantId}");
    var credential = new ClientCredential(clientId, clientSecret);
    var result = await authenticationContext.AcquireTokenAsync(resource: "https://management.core.windows.net/", clientCredential: credential);

    var credentials = new TokenCredentials(result.AccessToken, result.AccessTokenType);

    var kustoManagementClient = new KustoManagementClient(credentials)
    {
        SubscriptionId = subscriptionId
    };

    var resourceGroupName = "testrg";
    var clusterName = "mykustocluster";
    var location = "Central US";
    var skuName = "Standard_E8ads_v5";
    var tier = "Standard";
    var capacity = 5;
    var sku = new AzureSku(skuName, tier, capacity);
    var cluster = new Cluster(location, sku);
    await kustoManagementClient.Clusters.CreateOrUpdateAsync(resourceGroupName, clusterName, cluster);
    ```

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | clusterName | *mykustocluster* | The desired name of your cluster.|
   | skuName | *Standard_E8ads_v5* | The SKU that will be used for your cluster. |
   | tier | *Standard* | The SKU tier. |
   | capacity | *number* | The number of instances of the cluster. |
   | resourceGroupName | *testrg* | The resource group name where the cluster will be created. |

    > [!NOTE]
    > **Create a cluster** is a long running operation, so it's highly recommended to use CreateOrUpdateAsync, instead of CreateOrUpdate.

1. Run the following command to check whether your cluster was successfully created:

    ```csharp
    kustoManagementClient.Clusters.Get(resourceGroupName, clusterName);
    ```

1. Confirm successful creation of the cluster. The creation succeeded if the result contains `ProvisioningState` with the `Succeeded` value.

### [Python](#tab/python)


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

1. Confirm successful creation of the cluster. The creation succeeded if the result contains `ProvisioningState` with the `Succeeded` value.

### [Go](#tab/go)

### [Azure CLI](#tab/azcli)

### [Powershell](#tab/powershell)

### [ARM template](#tab/arm)

## Create an Azure Data Explorer database

In this section, you'll create a database within the cluster created in the previous section.

### [Portal](#tab/portal)

1. On the **Overview** tab, select **Create database**.

    :::image type="content" source="media/create-cluster-database-portal/database-creation.png" alt-text="Screenshot of the Create a database window.":::

1. Fill out the form with the following information.

    |**Setting** | **Suggested value** | **Field description**
    |---|---|---|
    | Admin | *Default selected* | The admin field is disabled. New admins can be added after database creation. |
    | Database name | *TestDatabase* | The name of database to create. The name must be unique within the cluster. |
    | Retention period | *365* | The number of days that data is guaranteed to be kept available for querying. The period is measured from the time data is ingested. |
    | Cache period | *31* | The number of days to keep frequently queried data available in SSD storage or RAM to optimize querying. |

    :::image type="content" source="media/create-cluster-database-portal/create-test-database.png" alt-text="Create database form.":::

1. Select **Create** to create the database. Creation typically takes less than a minute. When the process is complete, you're back on the cluster **Overview** tab.

### [C#](#tab/csharp)

1. Create your database by using the following code:

    ```csharp
    var hotCachePeriod = new TimeSpan(3650, 0, 0, 0);
    var softDeletePeriod = new TimeSpan(3650, 0, 0, 0);
    var databaseName = "mykustodatabase";
    var database = new ReadWriteDatabase(location: location, softDeletePeriod: softDeletePeriod, hotCachePeriod: hotCachePeriod);

    await kustoManagementClient.Databases.CreateOrUpdateAsync(resourceGroupName, clusterName, databaseName, database);
    ```

    > [!NOTE]
    > If you are using C# version 2.0.0 or below, use Database instead of ReadWriteDatabase.

   |**Setting** | **Suggested value** | **Field description**|
   |---|---|---|
   | clusterName | *mykustocluster* | The name of your cluster where the database will be created.|
   | databaseName | *mykustodatabase* | The name of your database.|
   | resourceGroupName | *testrg* | The resource group name where the cluster will be created. |
   | softDeletePeriod | *3650:00:00:00* | The amount of time that data will be kept available to query. |
   | hotCachePeriod | *3650:00:00:00* | The amount of time that data will be kept in cache. |

2. Run the following command to see the database that you created:

    ```csharp
    kustoManagementClient.Databases.Get(resourceGroupName, clusterName, databaseName) as ReadWriteDatabase;
    ```

### [Python](#tab/python)

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

### [Go](#tab/go)

### [Azure CLI](#tab/azcli)

### [Powershell](#tab/powershell)

### [ARM template](#tab/arm)

## Clean up resources

If you plan to follow other quickstarts and tutorials, keep the resources you created. Otherwise, delete the resources to avoid incurring costs.

### [Portal](#tab/portal)

1. In the Azure portal, select **Resource groups** on the far left, and then select the resource group that contains your Data Explorer cluster.

1. Select **Delete resource group** to delete the entire resource group. If using an existing resource group, you can choose to only delete the Data Explorer cluster.

### [C#](#tab/csharp)

When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

```csharp
kustoManagementClient.Clusters.Delete(resourceGroupName, clusterName);
```

### [Python](#tab/python)

When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

```Python
cluster_operations.delete(resource_group_name = resource_group_name, cluster_name = cluster_name)
```

### [Go](#tab/go)

### [Azure CLI](#tab/azcli)

### [Powershell](#tab/powershell)

### [ARM template](#tab/arm)

## Next steps
