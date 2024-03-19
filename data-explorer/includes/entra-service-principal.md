---
ms.topic: include
ms.date: 02/05/2024
---
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
      "appId": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn",
      "displayName": "my-service-principal",
      "name": "my-service-principal",
      "password": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn",
      "tenant": "1234abcd-e5f6-g7h8-i9j0-1234kl5678mn"
    }
    ```

You've created your Microsoft Entra application and service principal.
