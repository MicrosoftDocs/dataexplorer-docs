---
title:  Authentication over HTTPS
description: This article describes Authentication over HTTPS in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/28/2023
---
# Authentication over HTTPS

To interact with your cluster over HTTPS, the principal making the request
must authenticate by using the HTTP `Authorization` request header.

## Syntax

`Authorization:` `Bearer` *AccessToken*

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *AccessToken*| string | &check; | A Microsoft Entra access token for the service.|

## Get an access token

There are many different methods to get a Microsoft Entra access token. To learn more, see [user authentication](../../access-control/how-to-authenticate-with-aad.md#user-authentication) and [application authentication](../../access-control/how-to-authenticate-with-aad.md#application-authentication).

### Get an access token for a user principal using the Azure CLI

The following steps return an access token for the user principal making the request. Make sure the user principal has access to the resource you plan to access. For more information, see [role-based access control](../../access-control/role-based-access-control.md).

1. Sign in to the Azure CLI.

      ```azurecli
      az login --output table
      ```

1. Find the row where the column `Default` is `true`. Confirm that the subscription in that row is the subscription for which you want to create your Microsoft Entra access token. To find subscription information, see [get subscription and tenant IDs in the Azure portal](/azure/azure-portal/get-subscription-tenant-id). If you need to switch to a different subscription, run one of the following commands.

      ```azurecli
      az account set --subscription <SUBSCRIPTION_ID>
      ```

      ```azurecli
      az account set --name "<SUBSCRIPTION_NAME>"
      ```

1. Run the following command to get the access token.

      ```azurecli
      az account get-access-token \
        --resource "https://api.kusto.windows.net" \
        --query "accessToken"
      ```

### Get an access token for a service principal using the Azure CLI

Microsoft Entra service principals represent applications or services that need access to resources, usually in non-interactive scenarios such as API calls. The following steps guide you through creating a service principal and getting a bearer token for this principal.

1. Sign in to the Azure CLI.

      ```azurecli
      az login --output table
      ```

1. Find the row where the column `Default` is `true`. Confirm that the subscription in that row is the subscription under which you want to create the service principal. To find subscription information, see [get subscription and tenant IDs in the Azure portal](/azure/azure-portal/get-subscription-tenant-id). If you need to switch to a different subscription, run one of the following commands.

      ```azurecli
      az account set --subscription <SUBSCRIPTION_ID>
      ```

      ```azurecli
      az account set --name "<SUBSCRIPTION_NAME>"
      ```

1. Create a service principal. This following command creates a Microsoft Entra service principal and returns the `appId`, `displayName`, `password`, and `tenantId` for the service principal.

      ```azurecli
      az ad sp create-for-rbac -n <SERVICE_PRINCIPAL_NAME> 
      ```

1. Grant the application principal access to your database. For example, in the context of your database, use the following command to add the principal as a user.

      ```kusto
      .add database <DATABASE> users ('aadapp=<appId>;<tenantId>')
      ```

      To learn about the different roles and how to assign them, see [security roles management](../../management/security-roles.md).

1. Send an HTTP request to request an access token. Replace `<tenantId>`, `<appId>`, and `<password>` with the values obtained from the previous command. This request returns a JSON object containing the access token, which you can use as the value for the `Authorization` header in your requests.

      ```azurecli
      curl -X POST https://login.microsoftonline.com/<tenantId>/oauth2/token \
        -F grant_type=client_credentials \
        -F client_id=<appId> \
        -F client_secret=<password> \
        -F resource=https://api.kusto.windows.net
      ```

## See also

* [Authentication overview](../../access-control/index.md)
* To learn how to perform On-behalf-of (OBO) authentication or Single Page Application (SPA) authentication, see [How to authenticate with Microsoft Authentication Library (MSAL)](authenticate-with-msal.md).
