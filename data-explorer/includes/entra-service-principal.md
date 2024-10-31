---
ms.topic: include
ms.date: 02/05/2024
---

<!-- //TODO remove this and redirect all links to the entra ID app doc in kusto -->

1. Sign in to your Azure subscription via Azure CLI. Then authenticate in the browser.

   ```azurecli-interactive
   az login
   ```

1. Choose the subscription to host the principal. This step is needed when you have multiple subscriptions.

   ```azurecli-interactive
   az account set --subscription YOUR_SUBSCRIPTION_GUID
   ```

1. Create the service principal. In this example, the service principal is called `my-service-principal`.

   ```azurecli-interactive
   az ad sp create-for-rbac -n "my-service-principal" --role Contributor --scopes /subscriptions/{SubID}
   ```

1. From the returned JSON data, copy the `appId`, `password`, and `tenant` for future use.

    ```json
    {
      "appId": "00001111-aaaa-2222-bbbb-3333cccc4444",
      "displayName": "my-service-principal",
      "name": "my-service-principal",
      "password": "00001111-aaaa-2222-bbbb-3333cccc4444",
      "tenant": "00001111-aaaa-2222-bbbb-3333cccc4444"
    }
    ```

You've created your Microsoft Entra application and service principal.
