---
title: Azure Active Directory authentication - Azure Data Explorer
description: This article describes Azure Active Directory authentication in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/10/2023
---
# Azure Active Directory authentication

[Azure Active Directory (Azure AD)](/azure/active-directory/fundamentals/active-directory-whatis) is a cloud-based identity and access management service. Azure AD can authenticate security principals or federate with other identity providers, such as Active Directory Federation Services (AD FS).

Azure AD supports both user and application authentication. [User authentication](#user-authentication) is used to verify the identity of human principals and can be carried out interactively, where a human user provides credentials, or programmatically using a token. [Application authentication](#application-authentication) is used to authenticate services and applications that need to run and access resources without human intervention.

## User authentication

User authentication happens when the user presents credentials to Azure AD or an identity provider that federates with Azure AD, such as Active Directory Federation Services (AD FS). The user gets back a security token that can be presented to the Azure Data Explorer service. Azure Data Explorer determines whether the token is valid, whether the token is issued by a trusted issuer, and what security claims the token contains.

Azure Data Explorer supports the following methods of user authentication, including through the [client libraries](../api/client-libraries.md):

* Interactive user authentication with sign-in through the user interface.
* User authentication with an Azure AD token issued for Azure Data Explorer.
* User authentication with an Azure AD token issued for another resource. In this case, a trust relationship must exist between that resource and Azure Data Explorer.

### Application authentication

Application authentication is needed when requests are not associated with a specific user or when no user is available to provide credentials. In this case, the application authenticates to Azure AD or the federated IdP by presenting secret information.

Azure Data Explorer supports the following methods of application authentication, including through the [client libraries](../api/client-libraries.md):

* Application authentication with an Azure managed identity.
* Application authentication with an X.509v2 certificate installed locally.
* Application authentication with an X.509v2 certificate given to the client library as a byte stream.
* Application authentication with an Azure AD application ID and an Azure AD application key. The application ID and application key are like a username and password.
* Application authentication with a previously obtained valid Azure AD token, issued to Azure Data Explorer.
* Application authentication with an Azure AD token issued for another resource. In this case, a trust relationship must exist between that resource and Azure Data Explorer.

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
