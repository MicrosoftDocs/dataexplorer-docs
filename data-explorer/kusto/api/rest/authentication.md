---
title: Authentication over HTTPS - Azure Data Explorer | Microsoft Docs
description: This article describes Authentication over HTTPS in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/26/2019
---
# Authentication over HTTPS

When using HTTPS the service supports the standard HTTP `Authorization` header
for performing authentication.

The supported HTTP authentication methods are:

* **Azure Active Directory**, through the `bearer` method.

When authenticating using Azure Active Directory, the `Authorization` header has
the format:

```txt
Authorization: bearer TOKEN
```

Where `TOKEN` is the access token that the caller acquires by communicating with
the Azure Active Directory service, with the following properties:

* The resource is the service URI (e.g., `https://help.kusto.windows.net`).
* The Azure Active Directory service endpoint is
  `https://login.microsoftonline.com/TENANT/`.

Where `TENANT` is the Azure Active Directory tenant ID or name. For example,
services created under the Microsoft tenant can use
`https://login.microsoftonline.com/microsoft.com/`. Alternatively, for user
authentication only, the request can be made to
`https://login.microsoftonline.com/common/` instead.

> [!NOTE]
> The Azure Active Directory service endpoint changes when running in national clouds.

For more details please see the [authentication overview](../../management/access-control/index.md)
and [guide to Azure Active Directory authentication](../../management/access-control/how-to-authenticate-with-aad.md).