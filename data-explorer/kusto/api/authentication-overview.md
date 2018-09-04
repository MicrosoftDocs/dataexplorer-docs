---
title: Kusto Authentication Overview - Azure Kusto | Microsoft Docs
description: This article describes Kusto Authentication Overview in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto Authentication Overview

Kusto supports a number of authentication methods:

1. **Azure Active Directory (AAD) authentication**<br>
This is the primary method of authentication. AAD supports both user (interactive)
and application authentication: the security principal authenticates to AAD,
gets back a security token, and presents this token to Kusto for validation

2. **dSTS authentication**<br>
This is an alternative means for authenticating users and applications(dSTS does not supports
application authentication). It is specific to Microsoft.

3. **Credentials (username/password) authentication**<br>
For scenarios in which AAD and dSTS authentication cannot be used,
one can define username/password pairs in Kusto itself and have
users or applications present these credentials for authentication.
This method does not depend on any external service, but because credentials
are presented it should only be used as a last resort

4. **No authentication**<br>
This mode is used primarily for development, or when hosting Kusto as a library.
Public Kusto deployments do not use this mode (and it is disabled)

When using the REST API, authentication is performed using the standard HTTP
`Authorization` header. When using any of the Kusto .NET libraries, authentication
is controlled by specifying the authentication method and parameters in the
[Kusto Connection String](https://kusdoc2.azurewebsites.net/docs/concepts/kusto-connection-strings.html), or by setting properties on the
[Client Request Properties](request-properties.md) object.

## AAD Authentication

The preferred authentication method in Kusto is to authenticate using Azure Active Directory (AAD)
as either the identity provide (IdP) or as the identity federation service.
This allows application of various kinds (web application, Windows desktop application, Universal applications,
mobile applications, etc.) to uniformly authenticate and use Kusto services.

AAD supports a number of authentication scenarios.
If there is a user present during the authentication,
one should authenticate the user to AAD by AAD User Authentication.
In some cases, one wants a service to use Kusto even when no user is interactively
present. In such cases, one should authenticate the application through the use
of an application secret, as described in AAD Application Authentication.

The following methods of authentication are supported by Kusto in general,
including through its .NET libraries:

* Interactive user authentication - this mode requires interactivity, as if needed, logon UI will pop up
* User authentication with an existing AAD token previously issued for Kusto
* Application authentication with AppID and shared secret
* Application authentication with locally installed X.509v2 certificate or certificate provided inline
* Application authentication with an existing AAD token previously issued for Kusto
* User or Application authentication with an AAD token issued for another resource, provided trust exists between that resource and Kusto

Please use the [Kusto Connection Strings](https://kusdoc2.azurewebsites.net/docs/concepts/kusto-connection-strings.html) reference for guidance and examples.