---
title: Azure Active Directory (Azure AD) authentication - Azure Data Explorer
description: This article describes Azure Active Directory (Azure AD) Authentication in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.custom: has-adal-ref
ms.date: 12/27/2021
---
# Azure Active Directory (Azure AD) Authentication

Azure Active Directory is Azure's preferred multi-tenant cloud directory service,
capable of authenticating security principals or federating with other identity providers,
such as Microsoft's Active Directory.

Azure AD allows applications of various kinds (web application, Windows desktop application, Universal applications, mobile applications, and more) to uniformly authenticate and use Azure Data Explorer services.

Azure AD supports a number of authentication scenarios.
If there is a user present during the authentication, one should authenticate the user to Azure AD using Azure AD User Authentication.
In some cases, you want a service to use Azure Data Explorer, even when no user is interactively
present. In such cases, you should authenticate the application through the use of an application secret, as described in Azure AD Application Authentication.

The following methods of authentication are supported by Azure Data Explorer in general, including through its .NET libraries:

* Interactive user authentication - this mode requires interactivity, as if needed, logon UI will pop up
* User authentication with an existing Azure AD token previously issued for Azure Data Explorer
* Application authentication with AppID and shared secret
* Application authentication with locally installed X.509v2 certificate or certificate provided inline
* Application authentication with an existing Azure AD token previously issued for Azure Data Explorer
* User or application authentication with an Azure AD token issued for another resource, provided trust exists between that resource and Azure Data Explorer

For guidance and examples, see [connection strings](../../api/connection-strings/kusto.md).

## User authentication

User authentication happens when the user presents credentials to Azure AD (or to some identity provide that federates with Azure AD, such as Active Directory Federation Services), and gets back a security token that can be presented to the Azure Data Explorer service. The service doesn't care how the security token was obtained, it cares about whether the token is valid and what information is put there by Azure AD (or the federated IdP).

On the client side, Azure Data Explorer supports both interactive authentication, where [MSAL (Microsoft Authentication Library)](/azure/active-directory/develop/msal-overview) or similar code requests the user to enter credentials and token-based authentication, where an application using Azure Data Explorer obtains a valid user token and utilizes it to access Azure Data Explorer.
Additionally, scenarios in which an application using Azure Data Explorer obtains a valid user token for some other service, provided there's a trust relationship between that resource and Azure Data Explorer is also supported

For details on how to use the Azure Data Explorer client libraries and authenticate by using Azure AD, see [connection strings](../../api/connection-strings/kusto.md).

## Application authentication

When requests are not associated with a specific user, or there's no user available to enter
credentials, the Azure AD application authentication flow may be used. In this flow, the application
authenticates to Azure AD (or the federated IdP) by presenting some secret information. The following
scenarios are supported by the various Azure Data Explorer clients:

* Application authentication using an X.509v2 certificate installed locally.
* Application authentication using an X.509v2 certificate given to the client library as a byte stream.
* Application authentication using an Azure AD application ID and an Azure AD application key
  (the equivalent of username/password authentication for applications).
* Application authentication using a previously-obtained valid Azure AD token (issued to Azure Data Explorer).
* Application authentication using a previously-obtained valid Azure AD token issued to some other resource,
  provided that there's a trust relationship between that resource and Azure Data Explorer.

## Azure AD Server Application Permissions

Generally, an Azure AD Server Application can define multiple permissions (e.g., read-only permission and a read-writer permission) and the Azure AD client application may decide which permissions it needs when it requests an authorization token. As part of token acquisition, the user will be asked to authorize the Azure AD client application to be act on the user's behalf with
authorization to have these permissions. Should the user approve, these permissions will be listed in the scope claim of the token that is issued to the Azure AD client application.

The Azure AD client application is configured to request the "Access Kusto" permission
from the user (which Azure AD calls "the resource owner").

## Azure Data Explorer SDK as an Azure AD Client Application

When the client libraries invoke MSAL (Microsoft Authentication Library) to acquire a token for communicating with Azure Data Explorer, it provides the following information:

1. The Azure AD Tenant, as received from the caller
2. The Azure AD Client Application ID
3. The Azure AD Client Resource ID
4. The Azure AD ReplyUrl (the URL that the Azure AD service will redirect-to after authentication completes successfully;
   MSAL then captures this redirect and extracts the authorization code from it).
5. The Cluster URI ('https://Cluster-and-region.kusto.windows.net').

The token returned to the SDK from a call to MSAL has the Azure Data Explorer service application
as the audience, and the "Access Kusto" permission as the scope.

## Authenticating with Azure AD Programmatically

The following articles explain how to programmatically authenticate to Azure Data Explorer with Azure AD:

* [How to provision an Azure AD Application](../../../provision-azure-ad-app.md)
* [How to perform Azure AD Authentication](how-to-authenticate-with-aad.md)
