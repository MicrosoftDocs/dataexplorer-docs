---
title: Azure Active Directory authentication - Azure Data Explorer
description: This article describes Azure Active Directory authentication in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/06/2022
---
# Azure Active Directory authentication

Azure Active Directory (Azure AD) is a multitenant cloud directory service. It's capable of authenticating security principals or federating with other identity providers, such as Microsoft Active Directory.

Azure AD allows applications of various kinds to uniformly authenticate and use Azure Data Explorer services.

Azure AD supports several authentication scenarios. If a user is present, authenticate the user to Azure AD by using interactive authentication. In some cases, you might want a service to use Kusto even when no user is present. In such cases, authenticate the application by using an application secret, or any other supported method, as described in [Application authentication](#application-authentication).

The following methods of authentication are supported by Azure Data Explorer, including through its .NET libraries:

* Interactive user authentication. This mode features signing in through the user interface.
* User authentication with an existing Azure AD token, previously issued for Kusto.
* Application authentication with AppID and a shared secret.
* Application authentication with Azure managed identity.
* Application authentication with an X.509v2 certificate locally installed, or a certificate provided inline.
* Application authentication with an existing Azure AD token, previously issued for Kusto.
* User or application authentication with an Azure AD token issued for another resource. In this case, a trust relationship must exist between that resource and Azure Data Explorer.

For guidance and examples, see the [connection strings](../api/connection-strings/kusto.md) reference.

## User authentication

User authentication happens when the user presents credentials to Azure AD or to some identity provider that federates with Azure AD, such as Active Directory Federation Services (AD FS). The user gets back a security token. That token can be presented to the Azure Data Explorer service. Azure Data Explorer determines whether the token is valid, whether the token is issued by a trusted issuer, and what security claims the token contains.

On the client side, Azure Data Explorer supports both interactive and unattended authentication, by using the [MSAL (Microsoft Authentication Library)](/azure/active-directory/develop/msal-overview). Token-based authentication is also supported. With this kind of authentication, an application that is using Azure Data Explorer obtains a valid user token, and can then access Azure Data Explorer. If an application obtains a valid user token for some other resource, there must be a trust relationship between that resource and Azure Data Explorer.

## Application authentication

When requests aren't associated with a specific user, or there's no user available to enter
credentials, you can use the Azure AD application authentication process instead. The application authenticates to Azure AD (or to the federated identity provider) by presenting some secret information. The following scenarios for application authentication are supported by the various Kusto clients:

* By using an X.509v2 certificate installed locally.
* By using an X.509v2 certificate given to the client library as a byte stream.
* By using an Azure AD application ID and an associated application key. (This is the equivalent of username/password authentication for applications.)
* By using an Azure managed identity, associated with the service communicating with Azure Data Explorer.
* By using a previously obtained, valid Azure AD token (issued to Kusto).
* By using a previously obtained, valid Azure AD token (issued to some other resource). In this case, there must be a trust relationship between that resource and Kusto.

## Azure AD server application permissions

Generally, an Azure AD service application can define multiple permissions, such as read-only or read-write. The Azure AD client application can decide which permissions it needs when it requests an authorization token. As part of acquiring the token, the user is asked to authorize the Azure AD client application to act on the user's behalf, with authorization to have these permissions. If the user approves, these permissions are listed in the scope claim of the token issued to the Azure AD client application.

The Azure AD client application is configured to request the **Access Kusto** permission from the user. Note that Azure AD refers to the user as the *resource owner*.

## Kusto client SDK as an Azure AD client application

When the Kusto client library invokes [MSAL](/azure/active-directory/develop/msal-overview) to acquire a token for communicating with Kusto, it provides the following information:

- The Azure AD authority URI (`https://login.microsoftonline.com` in the global Azure), and the Azure AD tenant, as received from the caller.
- The Azure AD client application ID.
- For application authentication, the Azure AD client application credential (a secret or certificate).
- For user authentication, the Azure AD client application `ReplyUrl` (the URL to which Azure AD redirects, after authentication completes successfully). MSAL then captures this redirect and extracts the authorization code from it.
- The cluster URI (typically `https://cluster.region.kusto.windows.net` in the global Azure).

The token returned by MSAL to the Kusto client library has the Azure Data Explorer service as the audience.

## Authenticate programmatically

The following articles explain how to authenticate to Kusto with Azure AD programmatically:

* [How to provision an Azure AD application](../../provision-azure-ad-app.md)
* [How to perform Azure AD authentication](how-to-authenticate-with-aad.md)
