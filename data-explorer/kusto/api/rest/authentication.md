---
title: Authentication over HTTPS - Azure Data Explorer | Microsoft Docs
description: This article describes Authentication over HTTPS in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/30/2019
---
# Authentication over HTTPS

When using HTTPS, the service supports the standard HTTP `Authorization` header
for performing authentication.

The supported HTTP authentication methods are:

* **Azure Active Directory**, via the `bearer` method.

When authenticating using Azure AD, the `Authorization` header has
the format:

```txt
Authorization: bearer TOKEN
```

Where `TOKEN` is the access token that the caller acquires by communicating with
the Azure AD service. The token has the following properties:

* The resource is the service URI (e.g., `https://help.kusto.windows.net`)
* The Azure AD service endpoint is
  `https://login.microsoftonline.com/TENANT/`

Where `TENANT` is the Azure AD tenant ID or name. 
For example, services that are created under the Microsoft tenant can use
`https://login.microsoftonline.com/microsoft.com/`. 
Alternatively, for user authentication only, the request can be made to
`https://login.microsoftonline.com/common/`.

> [!NOTE]
> The Azure AD service endpoint changes when it runs in national clouds.
> To change the endpoint, set an environment variable `AadAuthorityUri` to the required URI.

For more informaton, see the [authentication overview](../../management/access-control/index.md)
and the [guide to Azure AD authentication](../../management/access-control/how-to-authenticate-with-aad.md).
