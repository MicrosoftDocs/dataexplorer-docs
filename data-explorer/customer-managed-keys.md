---
title: Configure customer-managed-keys
description: This article describes how to configure customer-managed keys encryption on your data in Azure Data Explorer.
ms.reviewer: astauben
ms.topic: how-to
ms.custom:
ms.date: 05/10/2023
---

# Configure customer-managed keys

Azure Data Explorer encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For extra control over encryption keys, you can supply customer-managed keys to use for data encryption.

Customer-managed keys must be stored in an [Azure Key Vault](/azure/key-vault/key-vault-overview). You can create your own keys and store them in a key vault, or you can use an Azure Key Vault API to generate keys. The Azure Data Explorer cluster and the key vault must be in the same region, but they can be in different subscriptions. For a detailed explanation on customer-managed keys, see [customer-managed keys with Azure Key Vault](/azure/storage/common/storage-service-encryption).

This article shows you how to configure customer-managed keys.

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/customer-managed-keys).

## Configure Azure Key Vault

To configure customer-managed keys with Azure Data Explorer, you must [set two properties on the key vault](/azure/key-vault/key-vault-ovw-soft-delete): **Soft Delete** and **Do Not Purge**. These properties aren't enabled by default. To enable these properties, perform **Enabling soft-delete** and **Enabling Purge Protection** in [PowerShell](/azure/key-vault/key-vault-soft-delete-powershell) or [Azure CLI](/azure/key-vault/key-vault-soft-delete-cli) on a new or existing key vault. Only RSA keys of size 2048 are supported. For more information about keys, see [Key Vault keys](/azure/key-vault/about-keys-secrets-and-certificates#key-vault-keys).

> [!NOTE]
> Data encryption using customer managed keys is not supported on [leader and follower clusters](follower.md).

## Assign a managed identity to the cluster

To enable customer-managed keys for your cluster, first assign either a system-assigned or user-assigned managed identity to the cluster. You'll use this managed identity to grant the cluster permissions to access the key vault. To configure managed identities, see [managed identities](configure-managed-identities-cluster.md).

## Enable encryption with customer-managed keys

### [Portal](#tab/portal)

The following steps explain how to enable customer-managed keys encryption using the Azure portal. By default, Azure Data Explorer encryption uses Microsoft-managed keys. Configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

1. In the [Azure portal](https://portal.azure.com/), go to your [Azure Data Explorer cluster](create-cluster-and-database.md#create-a-cluster) resource.
1. Select **Settings** > **Encryption** in left pane of portal.
1. In the **Encryption** pane, select **On** for the **Customer-managed key** setting.
1. Select **Select Key**.

    :::image type="content" source="media/customer-managed-keys-portal/customer-managed-key-encryption-setting.png" alt-text="Screenshot showing configure customer-managed keys.":::

1. In the **Select key from Azure Key Vault** window, select an existing **Key vault** from the dropdown list. If you select **Create new** to [create a new Key Vault](/azure/key-vault/quick-create-portal#create-a-vault), you'll be routed to the **Create Key Vault** screen.

1. Select **Key**.
1. Version:
    * To ensure that this key always uses the latest key version, select the **Always use current key version** checkbox.
    * Otherwise, select **Version**.
1. Select **Select**.

    :::image type="content" source="media/customer-managed-keys-portal/customer-managed-key-key-vault.png" alt-text="Screenshot showing the Select key from Azure Key Vault.":::

1. Under **Identity type**, select **System Assigned** or **User Assigned**.
1. If you select **User Assigned**, pick a user assigned identity from the dropdown.

    :::image type="content" source="media/customer-managed-keys-portal/customer-managed-key-select-user-type.png" alt-text="Screenshot showing the option to select a managed identity type.":::

1. In the **Encryption** pane that now contains your key, select **Save**. When CMK creation succeeds, you'll see a success message in **Notifications**.

    :::image type="content" source="media/customer-managed-keys-portal/customer-managed-key-before-save.png" alt-text="Screenshot showing option to save a customer-managed key.":::

If you select system assigned identity when enabling customer-managed keys for your Azure Data Explorer cluster, you'll create a system assigned identity for the cluster if one doesn't exist. In addition, you'll be providing the required get, wrapKey, and unwrapKey permissions to your Azure Data Explorer cluster on the selected Key Vault and get the Key Vault properties.

> [!NOTE]
> Select **Off** to remove the customer-managed key after it has been created.

### [C#](#tab/csharp)

The following sections explain how to configure customer-managed keys encryption using the Azure Data Explorer C# client.

### Install packages

* Install the [Azure Data Explorer (Kusto) NuGet package](https://www.nuget.org/packages/Azure.ResourceManager.Kusto/).
* Install the [Azure.Identity NuGet package](https://www.nuget.org/packages/Azure.Identity/) for authentication with Microsoft Entra ID.

### Authentication

To run the examples in this article, [create a Microsoft Entra application](/azure/active-directory/develop/howto-create-service-principal-portal) and service principal that can access resources. You can add role assignment at the subscription scope and get the required `Microsoft Entra Directory (tenant) ID`, `Application ID`, and `Application Secret`.

The following code snippet demonstrates how to use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire a Microsoft Entra application token to access your cluster. For the flow to succeed, the application must be registered with Microsoft Entra ID and you must have the credentials for application authentication, such as a Microsoft Entra ID-issued application key or a Microsoft Entra registered X.509v2 certificate.

### Configure customer managed keys

By default, Azure Data Explorer encryption uses Microsoft-managed keys. Configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

1. Update your cluster by using the following code:

    ```csharp
    var tenantId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Azure AD Directory (tenant) ID
    var clientId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx"; // Application ID
    var clientSecret = "PlaceholderClientSecret"; // Application secret
    var subscriptionId = "xxxxxxxx-xxxxx-xxxx-xxxx-xxxxxxxxx";
    var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
    var resourceManagementClient = new ArmClient(credentials, subscriptionId);
    var resourceGroupName = "testrg";
    var clusterName = "mykustocluster";
    var subscription = await resourceManagementClient.GetDefaultSubscriptionAsync();
    var resourceGroup = (await subscription.GetResourceGroupAsync(resourceGroupName)).Value;
    var clusters = resourceGroup.GetKustoClusters();
    var cluster = (await clusters.GetAsync(clusterName)).Value;
    var clusterPatch = new KustoClusterPatch(cluster.Data.Location)
    {
        KeyVaultProperties = new KustoKeyVaultProperties
        {
            KeyName = "<keyName>",
            KeyVersion = "<keyVersion>", // Optional, leave as NULL for the latest version of the key.
            KeyVaultUri = new Uri("https://<keyVaultName>.vault.azure.net/"),
            UserIdentity = "/subscriptions/<identitySubscriptionId>/resourcegroups/<identityResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName>" // Use NULL if you want to use system assigned identity.
        }
    };
    await cluster.UpdateAsync(WaitUntil.Completed, clusterPatch);
    ```

1. Run the following command to check if your cluster was successfully updated:

    ```csharp
    var clusterData = (await resourceGroup.GetKustoClusterAsync(clusterName)).Value.Data;
    ```

    If the result contains `ProvisioningState` with the `Succeeded` value, then your cluster was successfully updated.

### [Azure CLI](#tab/azcli)

The following steps explain how to enable customer-managed keys encryption using Azure CLI client. By default, Azure Data Explorer encryption uses Microsoft-managed keys. Configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

1. Run the following command to sign in to Azure:

    ```azurecli-interactive
    az login
    ```

1. Set the subscription where your cluster is registered. Replace *MyAzureSub* with the name of the Azure subscription that you want to use.

    ```azurecli-interactive
    az account set --subscription MyAzureSub
    ```

1. Run the following command to set the new key with the cluster's system assigned identity

    ```azurecli-interactive
    az kusto cluster update --cluster-name "mytestcluster" --resource-group "mytestrg" --key-vault-properties key-name="<key-name>" key-version="<key-version>" key-vault-uri="<key-vault-uri>"
    ```

    Alternatively, set the new key with a user assigned identity.

    ```azurecli-interactive
    az kusto cluster update --cluster-name "mytestcluster" --resource-group "mytestrg" --key-vault-properties key-name="<key-name>" key-version="<key-version>" key-vault-uri="<key-vault-uri>" key-user-identity="<user-identity-resource-id>"
    ```

1. Run the following command and check the 'keyVaultProperties' property to verify the cluster updated successfully.

    ```azurecli-interactive
    az kusto cluster show --cluster-name "mytestcluster" --resource-group "mytestrg"
    ```

### [PowerShell](#tab/powershell)

The following steps explain how to enable customer-managed keys encryption using PowerShell. By default, Azure Data Explorer encryption uses Microsoft-managed keys. Configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

1. Run the following command to sign in to Azure:

    ```azurepowershell-interactive
    Connect-AzAccount
    ```

1. Set the subscription where your cluster is registered.

    ```azurepowershell-interactive
    Set-AzContext -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    ```

1. Run the following command to set the new key using a system assigned identity.

    ```azurepowershell-interactive
    Update-AzKustoCluster -ResourceGroupName "mytestrg" -Name "mytestcluster" -KeyVaultPropertyKeyName "<key-name>" -KeyVaultPropertyKeyVaultUri "<key-vault-uri>" -KeyVaultPropertyKeyVersion "<key-version>"
    ```

    Alternatively, set the new key using a user assigned identity.

    ```azurepowershell-interactive
    Update-AzKustoCluster -ResourceGroupName "mytestrg" -Name "mytestcluster" -KeyVaultPropertyKeyName "<key-name>" -KeyVaultPropertyKeyVaultUri "<key-vault-uri>" -KeyVaultPropertyKeyVersion "<key-version>" -KeyVaultPropertyUserIdentity "user-assigned-identity-resource-id"
    ```

1. Run the following command and check the 'KeyVaultProperty...' properties to verify the cluster updated successfully.

    ```azurepowershell-interactive
    Get-AzKustoCluster -Name "mytestcluster" -ResourceGroupName "mytestrg" | Format-List
    ```

### [ARM template](#tab/arm)

The following steps explain how to configure customer-managed keys using Azure Resource Manager templates. By default, Azure Data Explorer encryption uses Microsoft-managed keys. In this step, configure your Azure Data Explorer cluster to use customer-managed keys and specify the key to associate with the cluster.

If you'd like to use a system assigned identity to access the key vault, leave `userIdentity` empty. Otherwise, set the identity's resource ID.

You can deploy the Azure Resource Manager template by using the Azure portal or using PowerShell.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "clusterName": {
      "type": "string",
      "defaultValue": "[concat('kusto', uniqueString(resourceGroup().id))]",
      "metadata": {
        "description": "Name of the cluster to create"
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
      "name": "[parameters('clusterName')]",
      "type": "Microsoft.Kusto/clusters",
      "sku": {
        "name": "Standard_E8ads_v5",
        "tier": "Standard",
        "capacity": 2
      },
      "apiVersion": "2019-09-07",
      "location": "[parameters('location')]",
      "properties": {
        "keyVaultProperties": {
          "keyVaultUri": "<keyVaultUri>",
          "keyName": "<keyName>",
          "keyVersion": "<keyVersion>",
          "userIdentity": "<userIdentity>"
        }
      }
    }
  ]
}
```

---

## Update the key version

When you create a new version of a key, you'll need to update the cluster to use the new version. First, call `Get-AzKeyVaultKey` to get the latest version of the key. Then update the cluster's key vault properties to use the new version of the key, as shown in [Enable encryption with customer-managed keys](#enable-encryption-with-customer-managed-keys).

## Next steps

* [Secure Azure Data Explorer clusters in Azure](security.md)
* [Configure managed identities for your Azure Data Explorer cluster](configure-managed-identities-cluster.md)
* [Secure your cluster using Disk Encryption in Azure Data Explorer](cluster-encryption-disk.md)
