---
title: Kusto REST API Authentication - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto REST API Authentication in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto REST API Authentication



When working with the REST API it is the client responsibility to provide authentication evidence using the standard HTTP `Authorization` header.

Kusto supports AAD authentication for users and applications.
When authenticating via AAD, the authorization method is `Bearer` and the value is the token retrieved from the AAD service.
The token request to AAD should request access for `https://<Your Kusto cluster URL>` resource, and the request should be made against the AAD endpoint at `https://login.microsoftonline.com/<your AAD tenant name or ID>/`, or, in case of user authentication, against `https://login.microsoftonline.com/common/`.

For complete documentation on Kusto Authentication refer to [Kusto Authentication overview](../../management/access-control/index.md) and [Kusto Guide to AAD Authentication](../../management/access-control/how-to-authenticate-with-aad.md)

