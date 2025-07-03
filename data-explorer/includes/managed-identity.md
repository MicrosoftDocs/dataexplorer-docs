---
ms.topic: include
ms.date: 01/09/2025
---

<!-- //TODO create managed identity article in kusto -->

1. Sign in to your Azure subscription via Azure CLI. Then authenticate in the browser.

   ```azurecli-interactive
   az login
   ```

1. Choose the subscription to host the managed identity. This step is needed when you have multiple subscriptions.

   ```azurecli-interactive
   az account set --subscription YOUR_SUBSCRIPTION_GUID
   ```

1. Create a user assigned managed identity. In this example, the managed identity is called `my-managed-identity`.

   ```azurecli-interactive
   az identity create --name "my-managed-identity" --resource-group "my-resource-group"
   ```

1. Assign the Contributor role for the subscription scope to the managed identity. In this example, the managed identity is called `my-managed-identity`.

   ```azurecli-interactive
   az role assignment create --role "Contributor" --assignee "<clientId>" --scope /subscriptions/YOUR_SUBSCRIPTION_GUID
   ```

1. From the returned JSON data, copy the `clientId` for future use. The JSON has the following format:

    ```json
    {
      "clientId": "00001111-aaaa-2222-bbbb-3333cccc4444",
      "id": "/subscriptions/00001111-aaaa-2222-bbbb-3333cccc4444/resourceGroups/my-resource-group/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-managed-identity",
      "location": "eastus",
      "name": "my-managed-identity",
      "principalId": "00001111-aaaa-2222-bbbb-3333cccc4444",
      "resourceGroup": "my-resource-group",
      "tags": {},
      "tenantId": "00001111-aaaa-2222-bbbb-3333cccc4444",
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
    }
    ```

You've created your user-assigned managed identity.
