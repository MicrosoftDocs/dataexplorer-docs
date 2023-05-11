---
title: Azure Active Directory authentication - Azure Data Explorer
description: This article describes Azure Active Directory authentication in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/11/2023
---
# Authenticate with Azure Active Directory

[Azure Active Directory (Azure AD)](/azure/active-directory/fundamentals/active-directory-whatis) is a cloud-based identity and access management service. Azure AD can authenticate security principals or federate with other identity providers. We recommend using Azure Active Directory (Azure AD) to authenticate to Azure Data Explorer, since doing so ensures Azure Data Explorer won't have access to the principal's directory credentials.

To access Azure Data Explorer programmatically, we recommend using one of the Kusto [client libraries](../api/client-libraries.md). The client must authenticate to Azure AD in a two-step process. Firstly, the client requests an Azure AD token. Then, the client issues requests to Azure Data Explorer, providing the access token acquired in the first step as proof of identity. All authorization checks are performed using this identity.

There are three main authentication scenarios:

* [User authentication](#user-authentication): where an interactive application prompts the user for their credentials.
* [Application authentication](#application-authentication): where an application authenticates itself using configured credentials.
* [On-behalf-of authentication](#on-behalf-of-authentication): where an application gets an Azure AD access token from another application and uses it to access Azure Data Explorer.

## Understanding Azure AD permissions

In Azure AD, a service application can define different types of permissions, like read-only or read-write, that a client application can request when it needs an authorization token. The client application decides which permissions it requires, and when a principal attempts to access a resource through the client application, they're asked to authorize the client application to act on their behalf with the specified permissions. If the principal agrees, the permissions are included in the scope claim of the authorization token that Azure AD issues to the client application.

For Azure Data Explorer, the Azure AD client application is configured to request the "Access Kusto" permission from the user, who is also referred to as the "resource owner".

## Microsoft Authentication Library (MSAL)

The Kusto [client libraries](../api/client-libraries.md) use [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire Azure AD tokens for communicating with Azure Data Explorer. In this situation, the Kusto client library is the Azure AD client application, as described in the previous section. Throughout the process of acquiring a token, the client libraries provide the following information:

* The Azure Data Explorer cluster URI.
* The Azure AD authority URI and tenant.
* The Azure AD client application ID.
* For application authentication: the Azure AD client application credential, which is a secret or certificate.
* For user authentication: the Azure AD client application `ReplyUrl`, or the URL to which Azure AD redirects after authentication completes successfully. MSAL extracts the authorization code from this redirect.

The token returned by MSAL to the Kusto client library has the Azure Data Explorer service as the audience.

## How-to specify an Azure AD resource ID

The client must specify the resource for which the Azure AD token should be issued. The resource for an Azure Data Explorer endpoint is the URI of the endpoint without port information and path. For example, `https://help.kusto.windows.net`.

Alternatively, clients may request an access token with a cloud-static resource ID, such as `https://kusto.kusto.windows.net` for public cloud services. Clients doing so must make sure that they only send this access token to an Azure Data Explorer service endpoint, based on the host name suffix, in this case `kusto.windows.net`. Sending the access token to untrusted service endpoints might result in token leakage, allowing the receiving service to perform operations on any Azure Data Explorer service endpoint to which the principal has access.

## How-to specify an Azure AD tenant ID

Azure AD is a multi-tenant service, and every organization can create an object called **directory** in Azure AD. The directory object holds security-related objects such as user accounts, applications, and groups. Azure AD often refers to the directory as a **tenant**. Azure AD tenants are identified by a GUID, or the **tenant ID**. In many cases, the domain name of the organization can identity the Azure AD tenant.

For example, an organization called "Contoso" might have the tenant ID `12345678-a123-4567-b890-123a456b789c` and the domain name `contoso.com`.

## How-to specify an Azure AD authority endpoint

Azure AD has many endpoints for authentication. The Azure AD service endpoint used for authentication is also called the Azure AD authority URL or simply Azure AD authority.

To authenticate a principal, you need to know their Azure AD directory. If you know the directory, then the Azure AD authority is `https://login.microsoftonline.com/{tenantId}` where `{tenantId}` is either the tenant ID or domain name. If you don't know the directory, then use the "common" Azure AD authority by replacing `{tenantId}` with `common`.

> [!NOTE]
> The Azure AD service endpoint changes in national clouds. When working with an Azure Data Explorer
> service deployed in a national cloud, set the corresponding national cloud Azure AD service endpoint.
> To change the endpoint, set an environment variable `AadAuthorityUri` to the required URI.

## User authentication

User authentication happens when a user presents credentials to Azure AD or an identity provider that federates with Azure AD, such as Active Directory Federation Services (AD FS). The user gets back a security token that can be presented to the Azure Data Explorer service. Azure Data Explorer determines whether the token is valid, whether the token is issued by a trusted issuer, and what security claims the token contains.

Azure Data Explorer supports the following methods of user authentication, including through the Kusto [client libraries](../api/client-libraries.md):

* Interactive user authentication with sign-in through the user interface.
* User authentication with an Azure AD token issued for Azure Data Explorer.
* User authentication with an Azure AD token issued for another resource. In this case, a trust relationship must exist between that resource and Azure Data Explorer.

### Methods of user authentication

The easiest way to access Azure Data Explorer with user authentication is to use the Azure Data Explorer SDK
and set the `Federated Authentication` property of the [Kusto connection string](../api/connection-strings/kusto.md#user-authentication-properties) to `true`. The first time the SDK is used to send a request to the service the user is presented with a sign-in form to enter the Azure AD credentials. Upon successful authentication, the request is sent to Azure Data Explorer.

Applications that don't use a Kusto client library can still use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview). For an example, see [Azure AD and OpenID Connect](https://github.com/AzureADSamples/WebApp-WebAPI-OpenIDConnect-DotNet).

If your application is a front-end application intended to authenticate users for an Azure Data Explorer cluster, the application must be granted delegated permissions on Azure Data Explorer. For more information, see [Configure delegated permissions for the application registration](../../provision-azure-ad-app.md#configure-delegated-permissions-for-the-application-registration).

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

Azure Data Explorer supports the following methods of application authentication, including through the Kusto [client libraries](../api/client-libraries.md):

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

## On-behalf-of authentication

In this scenario, an application is sent an Azure AD access token for an arbitrary resource managed by the application, and the application uses that token to acquire a new Azure AD access token for the Azure Data Explorer resource. Then, the application can access Azure Data Explorer on behalf of the principal indicated by the original Azure AD access token.

This flow is called the [OAuth2 token exchange flow](https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-04). It generally requires multiple configuration steps with Azure AD, and in some cases might require special consent from the administrator of the Azure AD tenant. The following sections describe the steps of the flow.

### Step 1: Establish trust relationship between your application and the Azure Data Explorer service

1. Open the [Azure portal](https://portal.azure.com/) and make sure that you're
   signed-in to the correct tenant (see top/right corner for the identity
   used to sign in to the portal).

2. On the resources pane, select **Azure Active Directory**, then **App registrations**.

3. Locate the application that uses the on-behalf-of flow and open it.

4. Select **API permissions**, then **Add a permission**.

5. Search for the application named **Azure Data Explorer** and select it.

6. Select **user_impersonation / Access Kusto**.

7. Select **Add permission**.

### Step 2: Perform token exchange in your server code

```csharp
// Create a confidential authentication client for Azure AD:
var authClient = ConfidentialClientApplicationBuilder.Create("<appId>")
    .WithAuthority($"https://login.microsoftonline.com/<appTenant>")
    .WithClientSecret("<appKey>") // can be replaced by .WithCertificate to authenticate with an X.509 certificate
    .Build();
// Acquire on-behalf-of user token for the interactive user for Azure Data Explorer based on provided token:
var result = authClient.AcquireTokenOnBehalfOf(
    new[] { "https://<clusterName>.<region>.kusto.windows.net/.default" }, // Define scopes for accessing Azure Data Explorer cluster
    new UserAssertion("<userAccessToken>") // Encode the "original" token that will be used for exchange
).ExecuteAsync().Result;
var accessTokenForAdx = result.AccessToken;
```

### Step 3: Provide the token to the Kusto client library and execute queries

```csharp
// Create KustoConnectionStringBuilder using the previously acquired Azure AD token
var connectionStringBuilder = new KustoConnectionStringBuilder("https://<clusterName>.<region>.kusto.windows.net")
    .WithAadUserTokenAuthentication(accessTokenForAdx);
// Create an ADX query client base on the conneciton string object
using var queryClient = KustoClientFactory.CreateCslQueryProvider(connectionStringBuilder);
// Execute query
var queryResult = await queryClient.ExecuteQueryAsync("<databaseName>", "<query>", null);
```

## Web Client (JavaScript) authentication

To set up authentication for a web client, you need to not only [provision an Azure AD application](../../provision-azure-ad-app.md) but also enable the single-page application (SPA) setting on the application. The SPA setting enables the OAuth authorization code flow to obtain tokens used by [MSAL.js 2.0](https://www.npmjs.com/package/@azure/msal-browser). To configure the app, follow the steps in the MSAL 2.0 [SPA app registration scenario](/azure/active-directory/develop/scenario-spa-app-registration).

When the client is JavaScript code running in the user's browser, the auth code flow is used. The authentication flow consists of two stages:

1. The app is redirected to sign in to Azure AD. Once signed in, Azure AD redirects back to the app with an authorization code in the URI.

1. The app makes a request to the token endpoint to get the access token. The token is valid for 24 hour during which the client can reuse it by acquiring the token silently.

Like in the native client flow, there should be two Azure AD applications (server and client) with a configured relationship between them.

> [!NOTE]
>
> * The ID token is obtained by calling the `PublicClientApplication.loginRedirect()` method, and access tokens are obtained by calling `PublicClientApplication.acquireTokenSilent()`, or `PublicClientApplication.acquireTokenRedirect()` in case silent acquisition failed. MSAL 2.0 also supports `PublicClientApplicationloginPopup()`, but some browser block pop-ups which makes it less useful than a redirect.
> * MSAL 2.0 requires signing in (also known as getting an ID token) before any access token calls are made.

MSAL.js 2.0 has detailed sample apps for different frameworks such as React and Angular. For an example of how to use MSAL.js 2.0 to authenticate to an Azure Data Explorer cluster using a React application, see the [MSAL.js 2.0 React sample](https://github.com/Azure-Samples/ms-identity-javascript-react-spa). For other frameworks, check the MSAL.js 2.0 documentation to find a sample app.

The following is a framework-independent code sample for connecting to the *Help* cluster.

1. Create an instance of the MSAL `PublicClientApplication`:

    ```javascript
    import * as msal from "@azure/msal-browser";

    const msalConfig = {
      auth: {
        clientId: "<AAD client application ID>",
        authority:
          "https://login.microsoftonline.com/<AAD tenant ID>",
      },
    };

    const msalInstance = new msal.PublicClientApplication(msalConfig);
    ```

    > [!IMPORTANT]
    > Make sure your application always calls `handleRedirectPromise()` whenever the page loads. This is because Azure AD adds the authorization code as part of the URI and the `handleRedirectPromise()` function extracts the authorization code from URI and caches it.
    >
    > ```javascript
    > await msalInstance.handleRedirectPromise();
    > ```

1. Add the code to sign in if the MSAL doesn't have any locally cached accounts. Note the use of scopes to redirect to the Azure AD page for providing your app with the permission required to access Azure Data Explorer.

    ```javascript
    const myAccounts = msalInstance.getAllAccounts();

    // If no account is logged in, redirect the user to log in.
    // no need for a return statement here, because the browser will redirect the user to the login page.
    if (myAccounts === undefined || myAccounts.length === 0) {
      try {
        await msalInstance.loginRedirect({
          scopes: ["https://help.kusto.windows.net/.default"],
        });
      } catch (err) {
        console.err(err); // handle error
      }
    }
    ```

1. Add the code to call `msalInstance.acquireTokenSilent()` to get the actual access token required to access the specified Azure Data Explorer cluster. If silent token acquisition fails, call `acquireTokenRedirect()` to get a new token.

    ```javascript
      const account = myAccounts[0];
      const name = account.name;

      window.document.getElementById("main").innerHTML = `HI ${name}!`;

      const accessTokenRequest = {
        account,
        scopes: ["https://help.kusto.windows.net/.default"],
      };
      let acquireTokenResult = undefined;
      try {
        acquireTokenResult = await msalInstance.acquireTokenSilent(
          accessTokenRequest
        );
      } catch (error) {
        // if our access / refresh / id token is expired we need redirect to AAD to get a new one.
        if (error instanceof InteractionRequiredAuthError) {
          await msalInstance.acquireTokenRedirect(accessTokenRequest);
        }
      }

      const accessToken = acquireTokenResult.accessToken;
    ```

1. Finally, add code to make requests to the specified cluster. You must add the token in the **Authorization** attribute in the request header for the authentication to succeed. For example, the following code makes a request to run a query against the **Samples** database in the *Help* cluster.

    ```javascript
    const fetchResult = await fetch(
        "https://help.kusto.windows.net/v2/rest/query",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            db: "Samples",
            csl: "StormEvents | count",
          }),
        }
      );
      const jsonResult = await fetchResult.json();
      // the following line extracts the first cell in the result data
      const count = jsonResult.filter((x) => x.TableKind == "PrimaryResult")[0].Rows[0][0];
    ```

## Azure AD local token cache

With Kusto [client libraries](../api/client-libraries.md), Azure AD tokens are stored in a local token cache on the user's machine to reduce the number of times they're prompted for credentials. The cache file is **%APPDATA%\Kusto\userTokenCache.data** and can only be accessed by the signed-in user. However, the cache doesn't completely eliminate the need for interactive prompts, and users can't predict when they'll be prompted. Therefore, non-interactive logins can't be supported if using a user account to access Azure Data Explorer.

## Next steps

* Create [Kusto connection strings](../api/connection-strings/kusto.md) to connect to a cluster using the [client libraries](../api/client-libraries.md)
