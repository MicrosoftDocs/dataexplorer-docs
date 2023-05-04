---
title: 'Create an Azure Data Explorer cluster and database'
description: Learn how to create an Azure Data Explorer cluster and database.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.date: 05/04/2023
---

# Create an Azure Data Explorer cluster and database

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then you ingest (load) data into a database so that you can run queries against it. In this article, you'll learn how to create a cluster and a database using either the Azure portal, C#, Python, Go, the Azure CLI, Powershell, or an [Azure Resource Manager (ARM) template](/azure/azure-resource-manager/management/overview).

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
* [An Azure AD Application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

### [Python](#tab/python)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [Python 3.4+](https://www.python.org/downloads/).
* Install the [azure-common](https://pypi.org/project/azure-common/) and [azure-mgmt-kusto](https://pypi.org/project/azure-mgmt-kusto/) packages.
* [An Azure AD Application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

### [Go](#tab/go)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* Install an appropriate version of [Go](https://golang.org/). For supported versions, see [Azure Kusto Module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/kusto/armkusto).
* [An Azure AD Application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

### [Azure CLI](#tab/azcli)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* You can use [Azure Cloud Shell](https://shell.azure.com) to run the code in this article without having to install anything on your local environment.
* If you choose to install and use the Azure CLI locally, follow the steps in [Configure parameters](#configure-the-cli-parameters). This article requires the Azure CLI version 2.0.4 or later. Run `az --version` to check your version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

### Configure the CLI parameters

The following steps aren't required if you're running commands in Azure Cloud Shell. If you're running the CLI locally, follow these steps sign in to Azure and to set your current subscription:

Follow these steps to configure the CLI parameters:

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

### [Powershell](#tab/powershell)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* You can use [Azure Cloud Shell](https://shell.azure.com) to run the code in this article without having to install anything on your local environment.
* If you choose to install and use [Powershell](/powershell/scripting/install/installing-powershell-on-windows) locally, follow the steps in [Configure parameters](#configure-parameters).

### Configure parameters

The following steps aren't required if you're running commands in Azure Cloud Shell. If you're running the CLI locally, follow these steps to sign in to Azure and to set your current subscription:

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

### [ARM template](#tab/arm)

An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).

---

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

1. Confirm successful creation of the cluster. The creation succeeded if the result contains `provisioningState` with the `Succeeded` value.

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

1. Confirm successful creation of the cluster. The creation succeeded if the result contains `provisioningState` with the `Succeeded` value.

### [Go](#tab/go)

The following steps explain how to use the [sample application to create a cluster and database](https://github.com/Azure-Samples/azure-data-explorer-go-cluster-management/).

1. Clone the sample code from GitHub.

1. Set the required environment variables including service principal information from the [prerequisites](#prerequisites). Enter your subscription ID, resource group, and region where you want to create the cluster.

    ```console
    export AZURE_CLIENT_ID="<enter service principal client ID>"
    export AZURE_CLIENT_SECRET="<enter service principal client secret>"
    export AZURE_TENANT_ID="<enter tenant ID>"

    export SUBSCRIPTION="<enter subscription ID>"
    export RESOURCE_GROUP="<enter resource group name>"
    export LOCATION="<enter azure location e.g. Southeast Asia>"

    export CLUSTER_NAME_PREFIX="<enter prefix (cluster name will be [prefix]-ADXTestCluster)>"
    export DATABASE_NAME_PREFIX="<enter prefix (database name will be [prefix]-ADXTestDB)>"
    ```

    > [!TIP]
    > Use [auth.NewAuthorizerFromCLIWithResource](https://pkg.go.dev/github.com/Azure/go-autorest/autorest/azure/auth?tab=doc#NewAuthorizerFromCLIWithResource) if you have Azure CLI installed and configured for authentication. In that situation, you don't need to create a service principal.

1. Run the program with the following command:

    ```console
    go run main.go
    ```

    When you run the sample code as is, the following actions are performed:

    1. An Azure Data Explorer cluster is created.
    1. All the Azure Data Explorer clusters in the specified resource group are listed.
    1. An Azure Data Explorer database is created as a part of the cluster created earlier.
    1. All the databases in the specified cluster are listed.
    1. The database is deleted.
    1. The cluster is deleted.

    > [!TIP]
    > To try different combinations of operations, you can comment and uncomment the respective functions in `main.go`.

    You'll get an output similar to the following:

    ```console
    waiting for cluster creation to complete - fooADXTestCluster
    created cluster fooADXTestCluster
    listing clusters in resource group <your resource group>
    +-------------------+---------+----------------+-----------+-----------------------------------------------------------+
    |       NAME        |  STATE  |    LOCATION    | INSTANCES |                            URI                           |
    +-------------------+---------+----------------+-----------+-----------------------------------------------------------+
    | fooADXTestCluster | Running | Southeast Asia |         1 | https://fooADXTestCluster.southeastasia.kusto.windows.net |
    +-------------------+---------+----------------+-----------+-----------------------------------------------------------+
    
    waiting for database creation to complete - barADXTestDB
    created DB fooADXTestCluster/barADXTestDB with ID /subscriptions/<your subscription ID>/resourceGroups/<your resource group>/providers/Microsoft.Kusto/Clusters/fooADXTestCluster/Databases/barADXTestDB and type Microsoft.Kusto/Clusters/Databases
    
    listing databases in cluster fooADXTestCluster
    +--------------------------------+-----------+----------------+------------------------------------+
    |              NAME              |   STATE   |    LOCATION    |                TYPE                |
    +--------------------------------+-----------+----------------+------------------------------------+
    | fooADXTestCluster/barADXTestDB | Succeeded | Southeast Asia | Microsoft.Kusto/Clusters/Databases |
    +--------------------------------+-----------+----------------+------------------------------------+
    
    waiting for database deletion to complete - barADXTestDB
    deleted DB barADXTestDB from cluster fooADXTestCluster

    waiting for cluster deletion to complete - fooADXTestCluster
    deleted Azure Data Explorer cluster fooADXTestCluster from resource group <your resource group>
    ```

### [Azure CLI](#tab/azcli)

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

1. Confirm successful creation of the cluster. The creation succeeded if the result contains `provisioningState` with the `Succeeded` value.

### [Powershell](#tab/powershell)

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

1. Confirm successful creation of the cluster. The creation succeeded if the result contains `provisioningState` with the `Succeeded` value.

### [ARM template](#tab/arm)

To learn how to deploy the following ARM template using Powershell, see [Use the ARM template](#use-the-arm-template). Alternatively, you can [deploy the template in the Azure Portal](/samples/azure/azure-quickstart-templates/kusto-cluster-database/) by selecting **Deploy to Azure**.

### ARM template for cluster and database creation

You can use this template for your own deployments, or customize it to meet your requirements. For information about creating templates, see [authoring Azure Resource Manager templates](/azure/azure-resource-manager/resource-group-authoring-templates). For the JSON syntax and properties to use in a template, see [Microsoft.Kusto resource types](/azure/templates/microsoft.kusto/allversions).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "clusters_kustocluster_name": {
            "type": "string",
            "defaultValue": "[concat('kusto', uniqueString(resourceGroup().id))]",
            "metadata": {
                "description": "Name of the cluster to create"
            }
        },
        "databases_kustodb_name": {
            "type": "string",
            "defaultValue": "kustodb",
            "metadata": {
                "description": "Name of the database to create"
            }
        },
        "location": {
            "type": "string",
            "defaultValue": "[resourceGroup().location]",
            "metadata": {
                "description": "Location for all resources."
            }
        }
    },
    "variables": {},
    "resources": [
        {
            "name": "[parameters('clusters_kustocluster_name')]",
            "type": "Microsoft.Kusto/clusters",
            "sku": {
                "name": "Standard_E8ads_v5",
                "tier": "Standard",
                "capacity": 2
            },
            "apiVersion": "2022-12-29",
            "location": "[parameters('location')]",
            "tags": {
                "Created By": "GitHub quickstart template"
            },
            "properties": {
                "trustedExternalTenants": [],
                "optimizedAutoscale": {
                    "version": 1,
                    "isEnabled": true,
                    "minimum": 2,
                    "maximum": 10
                },
                "enableDiskEncryption": false,
                "enableStreamingIngest": false,
                "virtualNetworkConfiguration": {
                    "subnetId": "<subnet resource id>",
                    "enginePublicIpId": "<Engine service's public IP address resource id>",
                    "dataManagementPublicIpId": "<Data management's service public IP address resource id>"
                },
                "keyVaultProperties": {
                    "keyName": "<Key name>",
                    "keyVaultUri": "<Key vault uri>",
                    "userIdentity": "<ResourceId of user assigned managed identity>"
                },
                "enablePurge": false,
                "enableDoubleEncryption": false,
                "engineType": "V3"
            },
            "identity": {
                "type": "SystemAssigned, UserAssigned",
                "userAssignedIdentities": {
                    "<ResourceId of managed identity>": {}
                }
            }
        },
        {
            "name": "[concat(parameters('clusters_kustocluster_name'), '/', parameters('databases_kustodb_name'))]",
            "type": "Microsoft.Kusto/clusters/databases",
            "apiVersion": "2022-12-29",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[resourceId('Microsoft.Kusto/clusters', parameters('clusters_kustocluster_name'))]"
            ],
            "properties": {
                "softDeletePeriodInDays": 365,
                "hotCachePeriodInDays": 31
            }
        }
    ]
}
```

### Use the ARM template

The following steps explain how to deploy the ARM template using Powershell.

1. Open [Azure Cloud Shell](https://shell.azure.com), and follow the instructions to sign in.
1. Select **Copy** to copy the PowerShell script.

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $resourceGroupName = "${projectName}rg"
    $clusterName = "${projectName}cluster"
    $parameters = @{}
    $parameters.Add("clusters_kustocluster_name", $clusterName)
    $templateUri = "https://azure.microsoft.com/resources/templates/kusto-cluster-database/"
    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -TemplateParameterObject $parameters
    Write-Host "Press [ENTER] to continue ..."
    ```

1. Right-click the shell console, and then select **Paste**.

    > [!NOTE]
    > It takes a few minutes to create an Azure Data Explorer cluster and database.

1. To verify the deployment, use the following Azure PowerShell script. If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host).

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"
    
    Install-Module -Name Az.Kusto
    $resourceGroupName = "${projectName}rg"
    $clusterName = "${projectName}cluster"
    
    Get-AzKustoCluster -ResourceGroupName $resourceGroupName -Name $clusterName
    Write-Host "Press [ENTER] to continue ..."
    ```

---

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

The cluster and database are created together with the sample application from the previous section.

### [Azure CLI](#tab/azcli)

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

### [Powershell](#tab/powershell)

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

### [ARM template](#tab/arm)

The cluster and database are created together with the ARM template in the previous section.

---

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

If you didn't delete the cluster programmatically using the sample code, you can do so manually using the Azure CLI with the following command:

```azurecli
az kusto cluster delete --cluster-name <enter name> --resource-group <enter name>
```

### [Azure CLI](#tab/azcli)

When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

```azurecli-interactive
az kusto cluster delete --cluster-name azureclitest --resource-group testrg
```

### [Powershell](#tab/powershell)

When you delete a cluster, it also deletes all the databases in it. Use the following command to delete your cluster:

```azurepowershell-interactive
Remove-AzKustoCluster -ResourceGroupName testrg -Name mykustocluster
```

### [ARM template](#tab/arm)

If the Cloud Shell is still open, you don't need to copy/run the first line (Read-Host).

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter the same project name that you used in the last procedure"
$resourceGroupName = "${projectName}rg"

Remove-AzResourceGroup -ResourceGroupName $resourceGroupName

Write-Host "Press [ENTER] to continue ..."
```

---

## Next steps

* Read the [Azure Data Explorer data ingestion overview](ingest-data-overview.md)
