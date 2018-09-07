---
title: Kusto REST API Authentication - Azure Kusto | Microsoft Docs
description: This article describes Kusto REST API Authentication in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto REST API Authentication

When working with the REST API it is the client responsibility to provide authentication evidence using the standard HTTP `Authorization` header.

Kusto supports a number of authentication methods:
**basicauth** (in which Kusto service holds a small database of user name/user password pairs),
**AAD** (in which authentication is done by Azure Active Directory for either a user or an application), **dSTS** (which uses MSFT WS-Federation)
and **none** (which is not available to production deployments).

Basic authentication is considered non-secure and should be avoided.
Interactive scenarios may utilize AAD/dSTS User authentication and non-interactive scenarios should use AAD App authentication.

When authenticating via AAD inside the Microsoft tenant, the authorization method is `Bearer` and the value is the token retrieved from the AAD service.
The token request to AAD should request access for `https://<Your Kusto cluster URL>` resource, and the request
should be made against the AAD production endpoint at `https://login.windows.net/microsoft.com/`.

When authenticating via basicauth, the `Authorization` header should be set using the `Basic` authorization method in the following way:

1. The username and password are combines with a single colon (`:`) 
2. The resulting string is encoded using the RFC2045-MIME variant of Base64,
   except not limited to 76 characters per line.
3. The authorization method and a space (`Basic `) is then put before the
   encoded string.

For example, if the user agent uses `Aladdin` as the username and `OpenSeasame`
as the password then the HTTP header would be:

```
Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l
```

For full documentation on Kusto Authentication refer to [Kusto Security and Compliance](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/security.html) and [Kusto Guide to AAD Authentication](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/programmatic-aad-authentication.html)