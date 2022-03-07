---
title: Azure Active Directory authentication - Azure Data Explorer
description: This article describes Azure Active Directory Authentication in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/06/2022
---
# Azure Active Directory Authentication

Azure Active Directory (Azure AD) is Azure preferred multi-tenant cloud directory service.
It's capable of authenticating security principals or federating with other identity providers,
such as Microsoft Active Directory.

Azure AD allows applications of various kinds to uniformly authenticate and use Azure Data Explorer services.

Azure AD supports several authentication scenarios.
If a user is present, authenticate the user to Azure AD using interactive authentication.
In some cases, one wants a service to use Kusto even when no user is interactively
present. In such cases, authenticate the application by using an application secret or any other supported method, as described in [Application Authentication](#application-authentication).

The following methods of authentication are supported by Azure Data Explorer,
including through its .NET libraries:

* Interactive user authentication - this mode requires interactivity, as if needed, logon UI will pop up
* User authentication with an existing Azure AD token previously issued for Kusto
* Application authentication with AppID and shared secret
* Application authentication with Azure Managed Identity
* Application authentication with locally installed X.509v2 certificate or certificate provided inline
* Application authentication with an existing Azure AD token previously issued for Kusto
* User or Application authentication with an Azure AD token issued for another resource, provided trust exists between that resource and Azure Data Explorer

For guidance and examples, see the [connection strings](../../api/connection-strings/kusto.md) reference .

## User authentication

User authentication happens when the user presents credentials to Azure AD or to some identity provider
that federates with Azure AD, such as Active Directory Federation Services (AD FS), and gets back a security token. That token can be presented to the
Azure Data Explorer service. Azure Data Explorer doesn't care how the security token was obtained, it cares about
whether the token is valid, issued by a trusted issuer, and what security claims it contains.

On the client side, Azure Data Explorer supports both interactive and unattended authentication, utilizing [MSAL (Microsoft Authentication Library)](/azure/active-directory/develop/msal-overview). Token-based authentication, where an application using Azure Data Explorer obtains a valid user token and utilizes it to access Azure Data Explorer, is supported as well.
Scenarios where an application using Azure Data Explorer obtains a valid user token for some other resource, if there's a trust relationship between that resource and Azure Data Explorer are also supported.

For details on how to use the client libraries and authenticate using Azure AD to Azure Data Explorer, see [connection strings](../../api/connection-strings/kusto.md).

## Application authentication

When requests aren't associated with a specific user, or there's no user available to enter
credentials, the Azure AD application authentication flow may be used. In this flow, the application
authenticates to Azure AD (or the federated IdP) by presenting some secret information. The following
scenarios are supported by the various Kusto clients:

* Application authentication using an X.509v2 certificate installed locally.
* Application authentication using an X.509v2 certificate given to the client library as a byte stream.
* Application authentication using an Azure AD application ID and an associated application key.
  (the equivalent of username/password authentication for applications).
* Application authentication using an Azure Managed Identity associated with the service communicating with Azure Data Explorer.
* Application authentication using a previously obtained valid Azure AD token (issued to Kusto).
* Application authentication using a previously obtained valid Azure AD token issued to some other resource,
  provided that there's a trust relationship between that resource and Kusto.

## Azure AD Server Application Permissions

Generally, an Azure AD Service Application can define multiple
permissions, for example, read-only or read-write, and the Azure AD
client application may decide which permissions it needs when it requests an
authorization token. As part of token acquisition, the user will be requested to authorize the Azure AD client application to act on the user's behalf with
authorization to have these permissions. Should the user approve, these
permissions will be listed in the scope claim of the token issued
to the Azure AD client application.

The Azure AD client application is configured to request the "Access Kusto" permission
from the user, which Azure AD refers to as "the resource owner".

## Kusto Client SDK as an Azure AD Client Application

When the Kusto client library invokes [MSAL (Microsoft Authentication Library)](/azure/active-directory/develop/msal-overview)
to acquire a token for communicating with Kusto, it provides the following information:

1. Azure AD authority URI (`https://login.microsoftonline.com` in the global Azure) and the Azure AD Tenant, as received from the caller
2. Azure AD Client Application ID
3. For application authentication - Azure AD Client Application credential (secret or certificate)
4. For User authentication - Azure AD Client Application ReplyUrl (the URL that the Azure AD service will redirect-to after authentication completes successfully.
   MSAL then captures this redirect and extracts the authorization code from it)
5. The cluster URI (typically `https://cluster.region.kusto.windows.net` in the global Azure)

The token returned by MSAL to the Kusto Client Library has the Azure Data Explorer Service as the audience.

## Authenticating with Azure AD Programmatically

The following articles explain how to programmatically authenticate to Kusto with Azure AD:

* [How to provision an Azure AD Application](../../../provision-azure-ad-app.md)
* [How to perform Azure AD Authentication](how-to-authenticate-with-aad.md)
