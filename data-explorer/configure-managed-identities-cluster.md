---
title: Configure managed identities for your Azure Data Explorer cluster
description: Learn how to configure managed identities for Azure Data Explorer cluster.
ms.reviewer: itsagui
ms.topic: how-to
ms.date: 11/03/2025
ms.custom: sfi-image-nochange
---
# Configure managed identities for your Azure Data Explorer cluster

A [managed identity from Microsoft Entra ID](/azure/active-directory/managed-identities-azure-resources/overview) allows your cluster to access other Microsoft Entra protected resources such as Azure Key Vault. The Azure platform manages the identity and doesn't require you to provision or rotate any secrets.

This article shows you how to add and remove managed identities on your cluster. For more information on managed identities, see [Managed identities overview](managed-identities-overview.md).

> [!NOTE]
> Managed identities for Azure Data Explorer don't behave as expected if you migrate your Azure Data Explorer cluster across subscriptions or tenants. The app needs to obtain a new identity, which you can get by [removing a system-assigned identity](#remove-a-system-assigned-identity) and then [adding a system-assigned identity](#add-a-system-assigned-identity). You also need to update the access policies of downstream resources to use the new identity.

> For code samples based on previous SDK versions, see the [archived article](/previous-versions/azure/data-explorer/configure-managed-identities-cluster).

## Types of managed identities

You can grant your Azure Data Explorer cluster two types of identities:

* **System-assigned identity**: Tied to your cluster and deleted if you delete the resource. A cluster can only have one system-assigned identity.

* **User-assigned identity**: A standalone Azure resource that you can assign to your cluster. A cluster can have multiple user-assigned identities.

## Add a system-assigned identity

Assign a system-assigned identity that's tied to your cluster and deleted if you delete the cluster. A cluster can only have one system-assigned identity. When you create a cluster with a system-assigned identity, you need to set an additional property on the cluster. Add the system-assigned identity by using the Azure portal, C#, or Resource Manager template as detailed in the following sections.

# [Azure portal](#tab/portal)

### Add a system-assigned identity by using the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

#### New Azure Data Explorer cluster

1. [Create an Azure Data Explorer cluster](create-cluster-and-database.md#create-a-cluster) 
1. In the **Security** tab, under **System assigned identity**, select **On**. To remove the system assigned identity, select **Off**.
1. Select **Next : Tags >** or **Review + create** to create the cluster.

    ![Add system assigned identity to new cluster.](media/managed-identities/system-assigned-identity-new-cluster.png)

#### Existing Azure Data Explorer cluster

1. Open an existing Azure Data Explorer cluster.
1. Select **Settings** > **Identity** in the left pane of the portal.
1. In the **Identity** pane, under the **System assigned** tab:
   1. Move the **Status** slider to **On**.
   1. Select **Save**.
   1. In the pop-up window, select **Yes**.

    ![Add system assigned identity.](media/managed-identities/turn-system-assigned-identity-on.png)

1. After a few minutes, the screen shows:
    * **Object ID** - Used for customer-managed keys
    * **Permissions** - Select relevant role assignments

    ![System assigned identity on.](media/managed-identities/system-assigned-identity-on.png)

# [C#](#tab/c-sharp)

### Add a system-assigned identity using C#

#### Prerequisites

To set up a managed identity using the Azure Data Explorer C# client:

* Install the [Azure Data Explorer NuGet package](https://www.nuget.org/packages/Azure.ResourceManager.Kusto/).
* Install the [Azure.Identity NuGet package](https://www.nuget.org/packages/Azure.Identity/) for authentication.
* [Create a Microsoft Entra application](/azure/active-directory/develop/howto-create-service-principal-portal) and service principal that can access resources. You add role assignment at the subscription scope and get the required `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

#### Create or update your cluster

1. Create or update your cluster by using the `Identity` property:

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
    var clusterData = new KustoClusterData(
        location: AzureLocation.CentralUS,
        sku: new KustoSku(KustoSkuName.StandardE8adsV5, KustoSkuTier.Standard) { Capacity = 5 }
    ) { Identity = new ManagedServiceIdentity(ManagedServiceIdentityType.SystemAssigned) };
    await clusters.CreateOrUpdateAsync(WaitUntil.Completed, clusterName, clusterData);
    ```

1. Run the following command to check if you successfully created or updated your cluster with an identity:

    ```csharp
    clusterData = (await clusters.GetAsync(clusterName)).Value.Data;
    ```

    If the result contains `ProvisioningState` with the `Succeeded` value, then the cluster was created or updated, and has the following properties:

    ```csharp
    var principalGuid = clusterData.Identity.PrincipalId.GetValueOrDefault();
    var tenantGuid = clusterData.Identity.TenantId.GetValueOrDefault();
    ```

    `PrincipalId` and `TenantId` are replaced with GUIDs. The `TenantId` property identifies the Microsoft Entra tenant to which the identity belongs. The `PrincipalId` is a unique identifier for the cluster's new identity. Within Microsoft Entra ID, the service principal has the same name that you gave to your App Service or Azure Functions instance.

# [Resource Manager template](#tab/arm)

### Add a system-assigned identity by using an Azure Resource Manager template

You can use an Azure Resource Manager template to automate deployment of your Azure resources. To learn more about deploying to Azure Data Explorer, see [Create an Azure Data Explorer cluster and database by using an Azure Resource Manager template](create-cluster-database.md?tabs=arm).

When you add the system-assigned type, you tell Azure to create and manage the identity for your cluster. You can create any resource of type `Microsoft.Kusto/clusters` with an identity by including the following property in the resource definition:

```json
{
   "identity": {
      "type": "SystemAssigned"
   }
}
```

For example:

```json
{
   "identity": {
      "type": "SystemAssigned",
      "tenantId": "<TENANTID>",
      "principalId": "<PRINCIPALID>"
   }
}
```

> [!NOTE]
> A cluster can have both system-assigned and user-assigned identities at the same time. The `type` property would be `SystemAssigned,UserAssigned`

When you create the cluster, it has the following additional properties:

```json
{
    "identity": {
        "type": "SystemAssigned",
        "tenantId": "<TENANTID>",
        "principalId": "<PRINCIPALID>"
    }
}
```

`<TENANTID>` and `<PRINCIPALID>` are replaced with GUIDs. The `TenantId` property identifies the Microsoft Entra tenant to which the identity belongs. The `PrincipalId` is a unique identifier for the cluster's new identity. Within Microsoft Entra ID, the service principal has the same name that you gave to your App Service or Azure Functions instance.

---

## Remove a system-assigned identity

When you remove a system-assigned identity, you also delete it from Microsoft Entra ID. System-assigned identities are also automatically removed from Microsoft Entra ID when you delete the cluster resource. You can remove a system-assigned identity by disabling the feature. Use the Azure portal, C#, or Resource Manager template to remove the system-assigned identity as detailed in the following section.

# [Azure portal](#tab/portal)

### Remove a system-assigned identity by using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Settings** > **Identity** in the left pane of the portal.
1. In the **Identity** pane, under the **System assigned** tab:
    1. Move the **Status** slider to **Off**.
    1. Select **Save**.
    1. In the pop-up window, select **Yes** to disable the system-assigned identity. The **Identity** pane reverts to the same condition as before the addition of the system-assigned identity.

    ![System assigned identity off.](media/managed-identities/system-assigned-identity.png)

# [C#](#tab/c-sharp)

### Remove a system-assigned identity by using C#

Run the following code to remove the system-assigned identity:

```csharp
var cluster = (await clusters.GetAsync(clusterName)).Value;
var clusterPatch = new KustoClusterPatch(clusterData.Location)
{
    Identity = new ManagedServiceIdentity(ManagedServiceIdentityType.None)
};
await cluster.UpdateAsync(WaitUntil.Completed, clusterPatch);
```

# [Resource Manager template](#tab/arm)

### Remove a system-assigned identity by using an Azure Resource Manager template

Run the following code to remove the system-assigned identity:

```json
{
   "identity": {
      "type": "None"
   }
}
```

> [!NOTE]
> If the cluster has both system-assigned and user-assigned identities at the same time, after you remove the system-assigned identity, the `type` property is `UserAssigned`.

---

## Add a user-assigned identity

Assign a user-assigned managed identity to your cluster. A cluster can have more than one user-assigned identity. To create a cluster with a user-assigned identity, you need to set an additional property on the cluster. Add the user-assigned identity by using the Azure portal, C#, or Resource Manager template as detailed in the following sections.

# [Azure portal](#tab/portal)

### Add a user-assigned identity by using the Azure portal

[!INCLUDE [user-assigned-identity](includes/user-assigned-identity.md)]

# [C#](#tab/c-sharp)

### Add a user-assigned identity using C#

#### Prerequisites

To set up a managed identity using the Azure Data Explorer C# client:

* Install the [Azure Data Explorer NuGet package](https://www.nuget.org/packages/Azure.ResourceManager.Kusto/).
* Install the [Azure.Identity NuGet package](https://www.nuget.org/packages/Azure.Identity/) for authentication.
* [Create a Microsoft Entra application](/azure/active-directory/develop/howto-create-service-principal-portal) and service principal that can access resources. You add role assignment at the subscription scope and get the required `Directory (tenant) ID`, `Application ID`, and `Client Secret`.

#### Create or update your cluster

1. Create or update your cluster by using the `Identity` property:

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
    var userIdentityResourceId = new ResourceIdentifier($"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName>");
    var clusterData = new KustoClusterData(
        location: AzureLocation.CentralUS,
        sku: new KustoSku(KustoSkuName.StandardE8adsV5, KustoSkuTier.Standard) { Capacity = 5 }
    )
    {
        Identity = new ManagedServiceIdentity(ManagedServiceIdentityType.UserAssigned)
        {
            UserAssignedIdentities = { { userIdentityResourceId, new UserAssignedIdentity() } }
        }
    };
    await clusters.CreateOrUpdateAsync(WaitUntil.Completed, clusterName, clusterData);
    ```

1. Run the following command to check if you successfully created or updated your cluster with an identity:

    ```csharp
    clusterData = (await clusters.GetAsync(clusterName)).Value.Data;
    ```

    If the result contains `ProvisioningState` with the `Succeeded` value, then the cluster was created or updated, and has the following properties:

    ```csharp
    var userIdentity = clusterData.Identity.UserAssignedIdentities[userIdentityResourceId];
    var principalGuid = userIdentity.PrincipalId.GetValueOrDefault();
    var clientGuid = userIdentity.ClientId.GetValueOrDefault();
    ```

    The `PrincipalId` is a unique identifier for the identity that Microsoft Entra administration uses. The `ClientId` is a unique identifier for the application's new identity that's used for specifying which identity to use during runtime calls.

# [Resource Manager template](#tab/arm)

### Add a user-assigned identity by using an Azure Resource Manager template

You can use an Azure Resource Manager template to automate deployment of your Azure resources. To learn more about deploying to Azure Data Explorer, see [Create an Azure Data Explorer cluster and database by using an Azure Resource Manager template](create-cluster-database.md?tabs=arm).

You can create any resource of type `Microsoft.Kusto/clusters` with a user-assigned identity by including the following property in the resource definition. Replace `<RESOURCEID>` with the resource ID of the desired identity:

```json
{
   "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
         "<RESOURCEID>": {}
      }
   }
}
```

For example:

```json
{
    "apiVersion": "2019-09-07",
    "type": "Microsoft.Kusto/clusters",
    "name": "[variables('clusterName')]",
    "location": "[resourceGroup().location]",
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('identityName'))]": {}
        }
    },
    "dependsOn": [
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', variables('identityName'))]"
    ]
}
```

When you create the cluster, it has the following additional properties:

```json
{
   "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
         "<RESOURCEID>": {
            "principalId": "<PRINCIPALID>",
            "clientId": "<CLIENTID>"
         }
      }
   }
}
```

The `PrincipalId` is a unique identifier for the identity that Microsoft Entra administration uses. The `ClientId` is a unique identifier for the application's new identity that's used for specifying which identity to use during runtime calls.

> [!NOTE]
> A cluster can have both system-assigned and user-assigned identities at the same time. In this case, set the `type` property to `SystemAssigned,UserAssigned`.

---

## Remove a user-assigned managed identity from a cluster

Remove the user-assigned identity by using the Azure portal, C#, or Resource Manager template as detailed in the following section.

# [Azure portal](#tab/portal)

### Remove a user-assigned managed identity by using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Settings** > **Identity** in the left pane of the portal.
1. Select the **User assigned** tab.
1. Search for the identity you created earlier and select it. Select **Remove**.

    ![Remove user assigned identity.](media/managed-identities/user-assigned-identity-remove.png)

1. In the pop-up window, select **Yes** to remove the user-assigned identity. The **Identity** pane reverts to the same condition as before the addition of the user-assigned identity.

# [C#](#tab/c-sharp)

### Remove a user-assigned identity by using C#

Run the following code to remove the user-assigned identity:

```csharp
var cluster = (await clusters.GetAsync(clusterName)).Value;
var clusterUpdate = new KustoClusterPatch(clusterData.Location)
{
    Identity = new ManagedServiceIdentity(ManagedServiceIdentityType.UserAssigned)
    {
        UserAssignedIdentities = { { userIdentityResourceId, null } }
    }
};
await cluster.UpdateAsync(WaitUntil.Completed, clusterUpdate);
```

# [Resource Manager template](#tab/arm)

### Remove a user-assigned identity by using an Azure Resource Manager template

Run the following code to remove the user-assigned identity:

```json
{
   "identity": {
      "type": "UserAssigned",
      "userAssignedIdentities": {
         "<RESOURCEID>": null
      }
   }
}
```

> [!NOTE]
>
> * Set the values of identities to null to remove them. This action doesn't affect other existing identities.
> * Set the `type` property to `None` to remove all user-assigned identities.
> * If the cluster has both system-assigned and user-assigned identities, set the `type` property to `SystemAssigned,UserAssigned` with the identities to remove, or set it to `SystemAssigned` to remove all user-assigned identities.

---

## Related content

* [Secure Azure Data Explorer clusters in Azure](security.md)
* [Secure your cluster using Disk Encryption](cluster-encryption-disk.md) by enabling encryption at rest.
* [Configure customer-managed-keys using C#](customer-managed-keys.md?tabs=csharp)
* [Configure customer-managed-keys using the Azure Resource Manager template](customer-managed-keys.md?tabs=arm)
