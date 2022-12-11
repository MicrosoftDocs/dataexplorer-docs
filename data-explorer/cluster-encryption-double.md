---
title: Enable infrastructure encryption (double encryption) during cluster creation in Azure Data Explorer
description: This article describes how to enable infrastructure encryption (double encryption) during cluster creation in Azure Data Explorer.
ms.reviewer: toleibov
ms.topic: how-to
ms.date: 04/12/2022
---

# Enable double encryption for your cluster in Azure Data Explorer

When you create a cluster, data is [automatically encrypted](/azure/storage/common/storage-service-encryption) at the service level. For greater data security, you can additionally enable [double encryption](/azure/storage/common/infrastructure-encryption-enable).

When double encryption is enabled, data in the storage account is encrypted twice, using two different algorithms.

> [!IMPORTANT]
>
> * Enabling double encryption is only possible during cluster creation.
> * Once infrastructure encryption is enabled on your cluster, you **can't** disable it.

## [Azure portal](#tab/portal)

1. [Create an Azure Data Explorer cluster](create-cluster-database-portal.md#create-a-cluster)
1. In the **Security** tab > **Enable Double Encryption**, select **On**. To remove the double encryption, select **Off**.
1. Select **Next:Network>** or **Review + create** to create the cluster.

    :::image type="content" source="media/double-encryption/double-encryption-portal.png" alt-text="Screenshot of security tab, showing double encryption being enabled on a new cluster.":::

## [C#](#tab/c-sharp)

You can enable infrastructure encryption during cluster creation using C#.

## Prerequisites

Set up a managed identity using the Azure Data Explorer C# client:

* Install the [Azure Data Explorer NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Management.Kusto/).
* Install the [Microsoft.IdentityModel.Clients.ActiveDirectory NuGet package](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/) for authentication.
* [Create an Azure Active Directory application](/azure/active-directory/develop/howto-create-service-principal-portal) and service principal that can access resources. You add role assignment at the subscription scope and get the required `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

## Create your cluster

1. Create your cluster using the `enableDoubleEncryption` property:

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
    var location = "East US";
    var skuName = "Standard_E8ads_v5";
    var tier = "Standard";
    var capacity = 5;
    var sku = new AzureSku(skuName, tier, capacity);
    var enableDoubleEncryption = true;
    var cluster = new Cluster(location, sku, enableDoubleEncryption: enableDoubleEncryption);
    await kustoManagementClient.Clusters.CreateOrUpdateAsync(resourceGroupName, clusterName, cluster);
    ```

1. Run the following command to check if your cluster was successfully created:

    ```csharp
    kustoManagementClient.Clusters.Get(resourceGroupName, clusterName);
    ```

    If the result contains `ProvisioningState` with the `Succeeded` value, then the cluster was created successfully.

## [ARM template](#tab/arm)

You can enable infrastructure encryption during cluster creation using Azure Resource Manager.

An Azure Resource Manager template can be used to automate deployment of your Azure resources. To learn more about deploying to Azure Data Explorer, see [Create an Azure Data Explorer cluster and database by using an Azure Resource Manager template](create-cluster-database-resource-manager.md).

## Add a system-assigned identity using an Azure Resource Manager template

Add the 'EnableDoubleEncryption' type to tell Azure to enable infrastructure encryption (double encryption) for your cluster.

```json
{
    "apiVersion": "2020-06-14",
    "type": "Microsoft.Kusto/clusters",
    "name": "[variables('clusterName')]",
    "location": "[resourceGroup().location]",
    "properties": {
        "trustedExternalTenants": [],
        "virtualNetworkConfiguration": null,
        "optimizedAutoscale": null,
        "enableDiskEncryption": false,
        "enableStreamingIngest": false,
        "enableDoubleEncryption": true,
    }
}
```

---

## Considerations

The following considerations apply to the encryption of [selected volumes](kusto/concepts/sandboxes-in-non-modern-skus.md#virtual-machine-sizes):

* Performance impact of up to a single digit
* Can't be used with sandboxes

## Next steps

* [Enable disk encryption for your cluster](cluster-encryption-disk.md)
* [Check cluster health](check-cluster-health.md)
