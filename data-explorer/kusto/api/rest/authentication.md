---
title: Authentication over HTTPS - Azure Data Explorer
description: This article describes Authentication over HTTPS in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/30/2019
---
# Authentication over HTTPS

When sending requests to the service over HTTPS, the principal making the request
must authenticate by using the HTTP `Authorization` request header.

**Syntax**

`Authorization:` *AuthScheme* *AuthParameters*

Where:

* *AuthScheme*: Should be set to `bearer`.

* *AuthParameters*: Should be set to an Azure Active Directory (Azure AD)
  access token for the service.

**Description**

To obtain a valid Azure AD access token, the client must communicate with the
Azure AD service. See the following topics for more information:

* [Authentication overview](../../management/access-control/index.md)
* [Guide to Azure AD authentication](../../management/access-control/how-to-authenticate-with-aad.md).
