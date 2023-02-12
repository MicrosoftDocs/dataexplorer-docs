---
title: Authentication over HTTPS - Azure Data Explorer
description: This article describes Authentication over HTTPS in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/12/2023
---
# Authentication over HTTPS

When sending requests to the service over HTTPS, the principal making the request
must authenticate by using the HTTP `Authorization` request header.

## Syntax

`Authorization:` `Bearer` *AuthToken*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *AuthToken*| string | &check; | An Azure Active Directory (Azure AD) access token for the service.|

## How to get an access token

To get an access token, the client must communicate with the Azure AD service.

The method used will depend on whether you want to authenticate a user principal or authenticate an application principal. To learn more, see [user authentication](../../management/access-control/how-to-authenticate-with-aad.md#user-authentication) and [application authentication](../../management/access-control/how-to-authenticate-with-aad.md#application-authentication).

The following steps will take you through how to use the Azure CLI to create an application principal and authenticate this principal when sending a REST API request.

1. Login to the Azure CLI.

      ```dotnetcli
      az login
      ```

1. Set your default subscription.

      ```dotnetcli
      az account set  --subscription <SUBSCRIPTION_ID>
      ```

1. Create a service principal.

      ```dotnetcli
      az ad sp create-for-rbac -n <SERVICE_PRINCIPAL_NAME> 
      ```

  This will create an Azure Active Directory Service Principal and return the `appId`, `displayName`, `password`, and `tenantId` for the service principal.

1. Grant the application principal access to your database. For example, in the context of your database, use the following command to add the principal as a user.

      ```kusto
      .add database <DATABASE> users ('aadapp=<appId>;<tenantId>')
      ```

      To learn about the different roles and how to assign them, see [security roles management](../../management/security-roles.md).

1. Send an HTTP request with the the service principal credentials to get a Bearer token. Replace `<tenantId>`, `<appId>`, and `<password>` with the values obtained from the `az ad sp create-for-rbac` command. This will return a JSON object containing the access token, which you can use as the value for the `Authorization` header in your requests to Azure Data Explorer.

      ```dotnetcli
      curl -X POST https://login.microsoftonline.com/<tenantId>/oauth2/token \
        -F grant_type=client_credentials \
        -F client_id=<appId> \
        -F client_secret=<password> \
        -F resource=https://api.kusto.windows.net
      ```

## See also

* [Authentication overview](../../management/access-control/index.md)
* [Guide to Azure AD authentication](../../management/access-control/how-to-authenticate-with-aad.md)
