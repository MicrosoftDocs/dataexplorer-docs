---
title: 'Create an Azure Data Explorer cluster and database'
description: Learn how to create an Azure Data Explorer cluster and database.
ms.reviewer: lugoldbe
ms.topic: how-to
ms.custom: devx-track-azurepowershell
ms.date: 05/17/2023
---

# Create an Azure Data Explorer cluster and database

Azure Data Explorer is a fast, fully managed data analytics service for real-time analysis on large volumes of data streaming from applications, websites, IoT devices, and more. To use Azure Data Explorer, you first create a cluster, and create one or more databases in that cluster. Then, you can ingest (load) data into a database and run queries against it.

In this article, you'll learn how to create a cluster and a database using either C#, Python, Go, the Azure CLI, PowerShell, or an Azure Resource Manager (ARM) template. To learn how to create a cluster and database using the Azure portal, see [Quickstart: Create an Azure Data Explorer cluster and database](create-cluster-and-database.md).

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/create-cluster-database).

## Prerequisites

Prerequisites by method of cluster and database creation:

### [C#](#tab/csharp)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [Visual Studio 2022 Community Edition](https://www.visualstudio.com/downloads/). Turn on **Azure development** during the Visual Studio setup.
* Install the [Microsoft.Azure.Management.Kusto NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* [A Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

### [Python](#tab/python)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* [Python 3.4+](https://www.python.org/downloads/).
* Install the [azure-common](https://pypi.org/project/azure-common/) and [azure-mgmt-kusto](https://pypi.org/project/azure-mgmt-kusto/) packages.
* [A Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

### [Go](#tab/go)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* Install [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* Install an appropriate version of [Go](https://golang.org/). For supported versions, see [Azure Kusto Module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/kusto/armkusto).
* [A Microsoft Entra application and service principal that can access resources](/azure/active-directory/develop/howto-create-service-principal-portal). Save the **Directory (tenant) ID**, **Application ID**, and **Client Secret**.

### [Azure CLI](#tab/azcli)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* You can use [Azure Cloud Shell](https://shell.azure.com) to run the code in this article without having to install anything on your local environment.
* If you choose to install and use the Azure CLI locally, follow the steps in [Configure parameters](#configure-the-cli-parameters). This article requires the Azure CLI version 2.0.4 or later. Run `az --version` to check your version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

### Configure the CLI parameters

The following steps aren't required if you're running commands in Azure Cloud Shell. If you're running the CLI locally, follow these steps to set up the environment:

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

### [PowerShell](#tab/powershell)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).
* You can use [Azure Cloud Shell](https://shell.azure.com) to run the code in this article without having to install anything on your local environment.
* If you choose to install and use [PowerShell](/powershell/scripting/install/installing-powershell-on-windows) locally, follow the steps in [Configure parameters](#configure-parameters).

### Configure parameters

The following steps aren't required if you're running commands in Azure Cloud Shell. If you're running the CLI locally, follow these steps to set up the environment:

1. Run the following command to sign in to Azure:

    ```azurepowershell-interactive
    Connect-AzAccount
    ```

1. Set the subscription where you want your cluster to be created:

    ```azurepowershell-interactive
     Set-AzContext -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ```

1. When running Azure CLI locally or in the Azure Cloud Shell, you need to install the `Az.Kusto` module on your device:

    ```azurepowershell-interactive
     Install-Module -Name Az.Kusto
    ```

### [ARM template](#tab/arm)

* An Azure subscription. Create a [free Azure account](https://azure.microsoft.com/free/).

---

## Create an Azure Data Explorer cluster

This section guides you through the process of creating an Azure Data Explorer cluster. Choose the relevant tab for your preferred method to create the cluster.

### [C#](#tab/csharp)

1. Create your cluster by using the following code:

    ```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; //Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; //Application ID
    var clientSecret = "PlaceholderClientSecret"; //Client Secret
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
    var resourceManagementClient = new ArmClient(credentials, subscriptionId);
    var resourceGroupName = "testrg";
    var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
    var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
    var clusters = resourceGroup.GetKustoClusters();    
    var clusterName = "mykustocluster";
    var skuName = KustoSkuName.StandardE8adsV5;
    var skuTier = KustoSkuTier.Standard;
    var capacity = 5;
    var clusterData = new KustoClusterData(
        location: AzureLocation.CentralUS,
        sku: new KustoSku(skuName, skuTier) { Capacity = capacity }
    );
    await clusters.CreateOrUpdateAsync(WaitUntil.Completed, clusterName, clusterData);
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
    clusterData = (await clusters.GetAsync(clusterName)).Value.Data;
    ```

1. Confirm the successful creation of the cluster by verifying the result contains `provisioningState` as `Succeeded`.

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

1. Confirm the successful creation of the cluster by verifying the result contains `provisioningState` as `Succeeded`.

### [Go](#tab/go)

The following code shows how to create a cluster. To clone the code repository, see [Manage an Azure Data Explorer cluster using Azure Go SDK](https://github.com/Azure-Samples/azure-data-explorer-go-cluster-management/tree/main).

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

1. Run the following code to create the cluster:

    ```golang
    import (
     "context"
     "log"
     "os"
     "strconv"
    
     "github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
     "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
     "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/kusto/armkusto"
     "github.com/olekukonko/tablewriter"
    )
    
    const (
     subscriptionEnvVar      = "AZURE_SUBSCRIPTION_ID"
     resourceGroupEnvVar     = "AZURE_RESOURCE_GROUP"
     locationEnvVar          = "AZURE_LOCATION"
     clusterNamePrefixEnvVar = "CLUSTER_NAME_PREFIX"
     dbNamePrefixEnvVar      = "DATABASE_NAME_PREFIX"
    
     clusterName  = "ADXTestCluster"
     databaseName = "ADXTestDB"
    )
    
    func init() {
     subscription = os.Getenv(subscriptionEnvVar)
     if subscription == "" {
      log.Fatalf("missing environment variable %s", subscriptionEnvVar)
     }
    
     rgName = os.Getenv(resourceGroupEnvVar)
     if rgName == "" {
      log.Fatalf("missing environment variable %s", resourceGroupEnvVar)
     }
    
     location = os.Getenv(locationEnvVar)
     if location == "" {
      log.Fatalf("missing environment variable %s", locationEnvVar)
     }
    
     clusterNamePrefix = os.Getenv(clusterNamePrefixEnvVar)
     if clusterNamePrefix == "" {
      log.Fatalf("missing environment variable %s", clusterNamePrefixEnvVar)
     }
    
     dbNamePrefix = os.Getenv(dbNamePrefixEnvVar)
     if dbNamePrefix == "" {
      log.Fatalf("missing environment variable %s", dbNamePrefixEnvVar)
     }
    }
    
    func getClustersClient(subscription string) *armkusto.ClustersClient {
     cred, err := azidentity.NewDefaultAzureCredential(nil)
     if err != nil {
      log.Fatal(err)
     }
    
     client, err := armkusto.NewClustersClient(subscription, cred, nil)
     if err != nil {
      log.Fatal(err)
     }
    
     return client
    }
    
    // 1 instance, Basic tier with compute type Dev(No SLA)_Standard_D11_v2
    func createCluster(sub, name, location, rgName string) {
     ctx := context.Background()
    
     numInstances := int32(1)
     client := getClustersClient(sub)
     result, err := client.BeginCreateOrUpdate(
      ctx,
      rgName,
      name,
      armkusto.Cluster{
       Location: &location,
       SKU: &armkusto.AzureSKU{
        Name:     to.Ptr(armkusto.AzureSKUNameDevNoSLAStandardD11V2),
        Capacity: &numInstances,
        Tier:     to.Ptr(armkusto.AzureSKUTierBasic),
       },
      },
      nil,
     )
     if err != nil {
      log.Fatal("failed to start cluster creation ", err)
     }
    
     log.Printf("waiting for cluster creation to complete - %s\n", name)
     r, err := result.PollUntilDone(ctx, nil)
     if err != nil {
      log.Fatal(err)
     }
    
     log.Printf("created cluster %s\n", *r.Name)
    }
    
    createCluster(subscription, clusterNamePrefix+clusterName, location, rgName)
    ```

1. List the clusters to ensure successful creation:

    ```golang
    func listClusters(sub, rgName string) {
     log.Printf("listing clusters in resource group %s\n", rgName)
     ctx := context.Background()
    
     result := getClustersClient(sub).NewListByResourceGroupPager(rgName, nil)
    
     data := [][]string{}
    
     for result.More() {
      temp, err := result.NextPage(ctx)
      if err != nil {
       log.Fatal(err)
      }
      for _, c := range temp.Value {
       data = append(data, []string{*c.Name, string(*c.Properties.State), *c.Location, strconv.Itoa(int(*c.SKU.Capacity)), *c.Properties.URI})
      }
     }
    
     table := tablewriter.NewWriter(os.Stdout)
     table.SetHeader([]string{"Name", "State", "Location", "Instances", "URI"})
    
     for _, v := range data {
      table.Append(v)
     }
     table.Render()
    }
    
    listClusters(subscription, rgName)
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

1. Confirm the successful creation of the cluster by verifying the result contains `provisioningState` as `Succeeded`.

### [PowerShell](#tab/powershell)

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

1. Confirm the successful creation of the cluster by verifying the result contains `provisioningState` as `Succeeded`.

### [ARM template](#tab/arm)

To learn how to deploy the following ARM template using PowerShell, see [Use the ARM template](#use-the-arm-template). Alternatively, you can [deploy the template in the Azure portal](/samples/azure/azure-quickstart-templates/kusto-cluster-database/) by selecting **Deploy to Azure**.

### ARM template

You can use this template for your own deployments, or customize it to meet your requirements. For the JSON syntax and properties to use in a template, see [Microsoft.Kusto resource types](/azure/templates/microsoft.kusto/allversions).

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

The following steps explain how to deploy the ARM template using PowerShell.

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

### [C#](#tab/csharp)

1. Create your database by using the following code:

    ```csharp
    var cluster = (await clusters.GetAsync(clusterName)).Value;
    var databases = cluster.GetKustoDatabases();
    var databaseName = "mykustodatabase";
    var softDeletePeriod = TimeSpan.FromDays(3650);
    var hotCachePeriod = TimeSpan.FromDays(3650);
    var databaseData = new KustoReadWriteDatabase
    {
        Location = clusterData.Location, SoftDeletePeriod = softDeletePeriod, HotCachePeriod = hotCachePeriod
    };
    await databases.CreateOrUpdateAsync(WaitUntil.Completed, databaseName, databaseData);
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
    databaseData = (await databases.GetAsync(databaseName)).Value.Data as KustoReadWriteDatabase;
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

The following code shows how to create a database. The package imports and environment variable initiation is the same as in the previous section. To clone the code repository, see [Manage an Azure Data Explorer cluster using Azure Go SDK](https://github.com/Azure-Samples/azure-data-explorer-go-cluster-management/tree/main).

1. Run the following code to create the database:

    ```golang
    func createDatabase(sub, rgName, clusterName, location, dbName string) {
     ctx := context.Background()
    
     client := getDBClient(sub)
     future, err := client.BeginCreateOrUpdate(ctx, rgName, clusterName, dbName, &armkusto.ReadWriteDatabase{Kind: to.Ptr(armkusto.KindReadWrite), Location: &location}, nil)
    
     if err != nil {
      log.Fatal("failed to start database creation ", err)
     }
    
     log.Printf("waiting for database creation to complete - %s\n", dbName)
     resp, err := future.PollUntilDone(ctx, nil)
     if err != nil {
      log.Fatal(err)
     }
    
     kdb := resp.GetDatabase()
     log.Printf("created DB %s with ID %s and type %s\n", *kdb.Name, *kdb.ID, *kdb.Type)
    }
    
    createDatabase(subscription, rgName, clusterNamePrefix+clusterName, location, dbNamePrefix+databaseName)
    ```

1. List the databases to ensure successful creation:

    ```golang
    func listDatabases(sub, rgName, clusterName string) {
     log.Printf("listing databases in cluster %s\n", clusterName)
    
     ctx := context.Background()
     result := getDBClient(sub).NewListByClusterPager(rgName, clusterName, nil)
    
     data := [][]string{}
    
     for result.More() {
      temp, err := result.NextPage(ctx)
      if err != nil {
       log.Fatal(err)
      }
      for _, db := range temp.Value {
       if *db.GetDatabase().Kind == armkusto.KindReadWrite {
        data = append(data, []string{*db.GetDatabase().Name, string(*db.GetDatabase().Kind), *db.GetDatabase().Location, *db.GetDatabase().Type})
       }
      }
     }
    
     table := tablewriter.NewWriter(os.Stdout)
     table.SetHeader([]string{"Name", "State", "Location", "Type"})
    
     for _, v := range data {
      table.Append(v)
     }
     table.Render()
    }
    
    listDatabases(subscription, rgName, clusterNamePrefix+clusterName)
    ```

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
   | read-write-database | *P365D* *P31D* *westus* | The database type. Parameters: *soft-delete-period* - Signifies the amount of time the data will be kept available to query. See [retention policy](kusto/management/retentionpolicy.md) for more information. *hot-cache-period* - Signifies the amount of time the data will be kept in cache. See [cache policy](kusto/management/cache-policy.md) for more information. *location* -The location where the database will be created. |

1. Run the following command to see the database that you created:

    ```azurecli-interactive
    az kusto database show --database-name clidatabase --resource-group testrg --cluster-name azureclitest
    ```

### [PowerShell](#tab/powershell)

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

## Next step

> [!div class="nextstepaction"]
> [Create a table](create-table-wizard.md)
