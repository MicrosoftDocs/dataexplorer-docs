---
title: Azure Active Directory authentication - Azure Data Explorer
description: This article describes Azure Active Directory authentication in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/10/2023
---
# Azure Active Directory authentication

[Azure Active Directory (Azure AD)](/azure/active-directory/fundamentals/active-directory-whatis) is a cloud-based identity and access management service. Azure AD can authenticate security principals or federate with other identity providers, such as Active Directory Federation Services (AD FS). We recommend authenticating through Azure Active Directory (Azure AD) service to access Azure Data Explorer, since doing so ensures Azure Data Explorer won't have access to the principal's directory credentials.

We recommend using one of the [Kusto client libraries](../api/client-libraries.md) to access the Azure Data Explorer service programmatically. To access Azure Data Explorer, the client must authenticate to Azure AD in a two-step process. Firstly, the client requests an Azure AD token. Then, the client issues requests to Azure Data Explorer, providing the access token acquired in the first step as proof of identity. All authorization checks are performed using this identity.

There are three main authentication scenarios:

* [User authentication](#user-authentication): where an interactive application prompts the user for their credentials.
* [Application authentication](#application-authentication): where an application authenticates itself using configured credentials.
* [On-behalf-of authentication](#on-behlaf-of-authentication): where an application gets an Azure AD access token from another application and uses it to access Azure Data Explorer.

## How-to specify the Azure AD resource ID

To get an access token from Azure AD, the client must specify the resource for which the token is issued. The resource for an Azure Data Explorer endpoint is the URI of the endpoint without port information and path. For example, `https://help.kusto.windows.net`.

Alternatively, clients may request an access token with a cloud-static resource ID, such as `https://kusto.kusto.windows.net` for public cloud services. Clients doing so must make sure that they only send this access token to an Azure Data Explorer service endpoint, based on the host name suffix, in this case `kusto.windows.net`. Sending the access token to untrusted service endpoints might result in token leakage, allowing the receiving service to perform operations on any Azure Data Explorer service endpoint to which the principal has access.

## How-to specify the Azure AD tenant ID

Azure AD is a multi-tenant service, and every organization can create an object called **directory** in Azure AD. The directory object holds security-related objects such as user accounts, applications, and groups. Azure AD often refers to the directory as a **tenant**. Azure AD tenants are identified by a GUID, or the **tenant ID**. In many cases, the domain name of the organization can identity the Azure AD tenant.

For example, an organization called "Contoso" might have the tenant ID `12345678-a123-4567-b890-123a456b789c` and the domain name `contoso.com`.

## How-to specify the Azure AD authority endpoint

Azure AD has many endpoints for authentication. The Azure AD service endpoint used for authentication is also called the Azure AD authority URL or simply Azure AD authority.

To authenticate a principal, you need to know their Azure AD directory. If you know the directory, then the Azure AD authority is `https://login.microsoftonline.com/{tenantId}` where `{tenantId}` is either the tenant ID or domain name. If you don't know the directory, then use the "common" Azure AD authority by replacing `{tenantId}` with `common`.

> [!NOTE]
> The Azure AD service endpoint changes in national clouds. When working with an Azure Data Explorer
> service deployed in a national cloud, set the corresponding national cloud Azure AD service endpoint.
> To change the endpoint, set an environment variable `AadAuthorityUri` to the required URI.

## The Azure AD local token cache

With [Kusto client libraries](../api/client-libraries.md), Azure AD tokens are stored in a local token cache on the user's machine to reduce the number of times they're prompted for credentials. The cache file is **%APPDATA%\Kusto\userTokenCache.data** and can only be accessed by the signed-in user. However, the cache doesn't completely eliminate the need for interactive prompts, and users can't predict when they'll be prompted. Therefore, non-interactive logins can't be supported if using a user account to access Azure Data Explorer.

## User authentication

User authentication happens when the user presents credentials to Azure AD or an identity provider that federates with Azure AD, such as Active Directory Federation Services (AD FS). The user gets back a security token that can be presented to the Azure Data Explorer service. Azure Data Explorer determines whether the token is valid, whether the token is issued by a trusted issuer, and what security claims the token contains.

Azure Data Explorer supports the following methods of user authentication, including through the [Kusto client libraries](../api/client-libraries.md):

* Interactive user authentication with sign-in through the user interface.
* User authentication with an Azure AD token issued for Azure Data Explorer.
* User authentication with an Azure AD token issued for another resource. In this case, a trust relationship must exist between that resource and Azure Data Explorer.

### Example of user authentication

The following example uses [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to get an Azure AD user token to access Azure Data Explorer in a way that launches the interactive sign-in UI:

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
// Create a public authentication client for Azure AD:
var authClient = PublicClientApplicationBuilder.Create("<appId>")
    .WithAuthority($"https://login.microsoftonline.com/<appTenant>")
    .WithRedirectUri("<appRedirectUri>")
    .Build();
// Acquire user token for the interactive user for Azure Data Explorer:
var result = authClient.AcquireTokenInteractive(
    new[] { $"{kustoUri}/.default" } // Define scopes for accessing Azure Data Explorer cluster
).ExecuteAsync().Result;
// Extract Bearer access token 
var bearerToken = result.AccessToken;
// Create an HTTP request and set the Authorization header on your request:
var request = WebRequest.Create(new Uri(kustoUri));
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

### Application authentication

Application authentication is needed when requests aren't associated with a specific user or when no user is available to provide credentials. In this case, the application authenticates to Azure AD or the federated IdP by presenting secret information.

Azure Data Explorer supports the following methods of application authentication, including through the [Kusto client libraries](../api/client-libraries.md):

* Application authentication with an Azure managed identity.
* Application authentication with an X.509v2 certificate installed locally.
* Application authentication with an X.509v2 certificate given to the client library as a byte stream.
* Application authentication with an Azure AD application ID and an Azure AD application key. The application ID and application key are like a username and password.
* Application authentication with a previously obtained valid Azure AD token, issued to Azure Data Explorer.
* Application authentication with an Azure AD token issued for another resource. In this case, a trust relationship must exist between that resource and Azure Data Explorer.

### Example of application authentication

The following example uses [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to get an Azure AD application token to access Azure Data Explorer. In this flow no prompt is presented, and
the application must be registered with Azure AD and equipped with credentials needed to perform application authentication, such as an app key issued by Azure AD, or an X509v2 certificate that has been pre-registered with Azure AD.

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";
// Create a confidential authentication client for Azure AD:
var authClient = ConfidentialClientApplicationBuilder.Create("<appId>")
    .WithAuthority($"https://login.microsoftonline.com/<appTenant>")
    .WithClientSecret("<appKey>") // can be replaced by .WithCertificate to authenticate with an X.509 certificate
    .Build();
// Acquire aplpication token for Azure Data Explorer:
var result = authClient.AcquireTokenForClient(
    new[] { $"{kustoUri}/.default" } // Define scopes for accessing Azure Data Explorer cluster
).ExecuteAsync().Result;
// Extract Bearer access token 
var bearerToken = result.AccessToken;
// Create an HTTP request and set the Authorization header on your request:
var request = WebRequest.Create(new Uri(kustoUri));
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

## Azure AD permissions

In Azure AD, a service application can have different permissions, and the client application can decide which permissions it needs. When the client requests an authorization token, the user is prompted to authorize the application to act on their behalf with those permissions. If approved, these permissions are listed in the scope claim of the token issued to the client application.

For Azure Data Explorer, the Azure AD client application is configured to request the "Access Kusto" permission from the user, who is also referred to as the "resource owner".

## Microsoft Authentication Library (MSAL)

The Kusto [Kusto client libraries](../api/client-libraries.md) use [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire Azure AD tokens for communicating with Azure Data Explorer. In this situation the Kusto client library is the Azure AD client application, as described in the previous section. Throughout the process of acquiring a token, the Kusto client libraries provide the following information:

- The Azure AD authority URI (`https://login.microsoftonline.com` in the global Azure), and the Azure AD tenant, as received from the caller.
- The Azure AD client application ID.
- For application authentication, the Azure AD client application credential (a secret or certificate).
- For user authentication, the Azure AD client application `ReplyUrl` (the URL to which Azure AD redirects, after authentication completes successfully). MSAL then captures this redirect and extracts the authorization code from it.
- The cluster URI (typically `https://cluster.region.kusto.windows.net` in the global Azure).

The token returned by MSAL to the Kusto client library has the Azure Data Explorer service as the audience.

