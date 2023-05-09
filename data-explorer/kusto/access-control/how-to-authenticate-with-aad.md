---
title: Authenticate with Azure AD for access - Azure Data Explorer
description: This article describes How-To Authenticate with Azure AD for Azure Data Explorer Access in Azure Data Explorer.
ms.reviewer: vladikb
ms.topic: reference
ms.custom: devx-track-js
ms.date: 05/08/2023
---
# How to authenticate with Azure Active Directory (Azure AD) for Azure Data Explorer access

The recommended way to access Azure Data Explorer is by authenticating to the
**Azure Active Directory (Azure AD)** service; doing so guarantees that
Azure Data Explorer never gets the accessing principal's directory credentials.
To do so, the client performs a two-steps process:

1. In the first step, the client:
    1. Communicates with the Azure AD service.
    1. Authenticates to the Azure AD service.
    1. Requests an access token issued specifically for Azure Data Explorer.
1. In the second step, the client issues requests to Azure Data Explorer, providing the access token acquired in the first step as a proof of identity to Azure Data Explorer.

Azure Data Explorer then executes the request on behalf of the security principal for which Azure AD issued the access token.
All authorization checks are performed using this identity.

In most cases, the recommendation is to use one of Azure Data Explorer SDKs to access the
service programmatically, as they remove much of the hassle of implementing the
flow (and much more). For more information, see the [.NET SDK](../../api/netfx/about-the-sdk.md).
The authentication properties are then set by the [Kusto connection string](../../api/connection-strings/kusto.md).
If that isn't possible, continue reading for detailed information on how to implement this flow yourself.

The main authenticating scenarios are:

* **A client application authenticating a signed-in user**.
  In this scenario, an interactive (client) application triggers an Azure AD prompt
  to the user for credentials (such as username and password).
  See [user authentication](#user-authentication),

* **A "headless" application**.
  In this scenario, an application is running with no user present to provide
  credentials. Instead the application authenticates as "itself" to Azure AD
  using some credentials it has been configured with.
  See [application authentication](#application-authentication).

* **On-behalf-of authentication**.
  In this scenario, sometimes called the "web service" or "web app" scenario,
  the application gets an Azure AD access token from another application, and then
  "converts" it to another Azure AD access token that can be used with Azure Data Explorer.
  In other words, the application acts as a mediator between the user or application
  that provided credentials and the Azure Data Explorer service.
  See [on-behalf-of authentication](#on-behalf-of-authentication).

## Specifying the Azure AD resource for Azure Data Explorer

When acquiring an access token from Azure AD, the client must indicate which *Azure AD resource*
the token should be issued to. The Azure AD resource of an Azure Data Explorer endpoint is the
URI of the endpoint, barring the port information and the path. For example:

```txt
https://help.kusto.windows.net
```

Alternatively, clients may also request an access token with a cloud-static resource ID, such as

`https://kusto.kusto.windows.net`

(for public cloud services). Clients doing so must make sure that they only send this access token
to an Azure Data Explorer service endpoint, based on the host name suffix (here, `kusto.windows.net`).
Sending the access token to untrusted service endpoints might result in token leakage, allowing the
receiving service to perform operations on any Azure Data Explorer service endpoint to which the
principal has access.

## Specifying the Azure AD tenant ID

Azure AD is a multi-tenant service, and every organization can create an object called
**directory** in Azure AD. The directory object holds security-related objects such
as user accounts, applications, and groups. Azure AD often refers to the directory
as a **tenant**. Azure AD tenants are identified by a GUID (**tenant ID**). In many
cases, Azure AD tenants can also be identified by the domain name of the organization.

For example, an organization called "Contoso" might have the tenant ID
`4da81d62-e0a8-4899-adad-4349ca6bfe24` and the domain name `contoso.com`.

## Specifying the Azure AD authority endpoint

Azure AD has many endpoints for authentication:

* When the tenant hosting the principal being authenticated is known
  (in other words, when one knows which Azure AD directory the user or application
  are in), the Azure AD endpoint is `https://login.microsoftonline.com/{tenantId}`.
  Here, `{tenantId}` is either the organization's tenant ID in Azure AD, or its
  domain name (for example, `contoso.com`).

* When the tenant hosting the principal being authenticated isn't known,
  the "common" endpoint can be used by replacing the `{tenantId}` above
  with the value `common`.

> [!NOTE]
> The Azure AD service endpoint used for authentication is also called *Azure AD authority URL*
> or simply **Azure AD authority**.

> [!NOTE]
> The Azure AD service endpoint changes in national clouds. When working with an Azure Data Explorer
> service deployed in a national cloud, please set the corresponding national cloud Azure AD service endpoint.
> To change the endpoint, set an environment variable `AadAuthorityUri` to the required URI.

## Azure AD local token cache

While using the Azure Data Explorer SDK, the Azure AD tokens are stored on the local machine in a
per-user token cache (a file called **%APPDATA%\Kusto\userTokenCache.data** which can
only be accessed or decrypted by the signed-in user.) The cache is inspected
for tokens before prompting the user for credentials, reducing the
number of times a user is prompted for credentials.

> [!NOTE]
> The Azure AD token cache reduces the number of interactive prompts that a user would
> be presented with accessing Azure Data Explorer, but doesn't reduce them completely. Additionally,
> users cannot anticipate in advance when they will be prompted for credentials.
> This means that one must not attempt to use a user account to access Azure Data Explorer if
> there's a need to support non-interactive logons (such as when scheduling tasks
> for example), because when the time comes for prompting the logged on user for
> credentials that prompt will fail if running under non-interactive logon.

## User authentication

The easiest way to access Azure Data Explorer with user authentication is to use the Azure Data Explorer SDK
and set the `Federated Authentication` property of the Azure Data Explorer connection string to
`true`. The first time the SDK is used to send a request to the service the user
will be presented with a sign-in form to enter the Azure AD credentials. Following a
successful authentication the request will be sent to Azure Data Explorer.

Applications that don't use the Azure Data Explorer SDK can still use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) instead of implementing the Azure AD service security protocol client. See [Azure AD and OpenID Connect](https://github.com/AzureADSamples/WebApp-WebAPI-OpenIDConnect-DotNet)
for an example of doing so from a .NET application.

If your application is intended to serve as front-end and authenticate users for an Azure Data Explorer cluster, the application must be granted delegated permissions on Azure Data Explorer.
The full step-by-step process is described in [Configure delegated permissions for the application registration](../../../provision-azure-ad-app.md#configure-delegated-permissions-for-the-application-registration).

The following brief code snippet demonstrates using [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire an Azure AD user
token to access Azure Data Explorer (launches sign-in UI):

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

## Application authentication

The following brief code snippet demonstrates using [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire an
Azure AD application token to access Azure Data Explorer. In this flow no prompt is presented, and
the application must be registered with Azure AD and equipped with credentials needed
to perform application authentication (such as an app key issued by Azure AD,
or an X509v2 certificate that has been pre-registered with Azure AD).

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

In this scenario, an application was sent an Azure AD access token for some arbitrary
resource managed by the application, and it uses that token to acquire a new Azure AD
access token for the Azure Data Explorer resource so that the application could access Kusto
on behalf of the principal indicated by the original Azure AD access token.

This flow is called the
[OAuth2 token exchange flow](https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-04).
It generally requires multiple configuration steps with Azure AD, and in some cases
(depending on the Azure AD tenant configuration) might require special consent from
the administrator of the Azure AD tenant.

**Step 1: Establish trust relationship between your application and the Azure Data Explorer service**

1. Open the [Azure portal](https://portal.azure.com/) and make sure that you're
   signed-in to the correct tenant (see top/right corner for the identity
   used to sign in to the portal).

2. On the resources pane, select **Azure Active Directory**, then **App registrations**.

3. Locate the application that uses the on-behalf-of flow and open it.

4. Select **API permissions**, then **Add a permission**.

5. Search for the application named **Azure Data Explorer** and select it.

6. Select **user_impersonation / Access Kusto**.

7. Select **Add permission**.

**Step 2: Perform token exchange in your server code**

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

**Step 3: Provide the token to Kusto client library and execute queries**

```csharp
// Create KustoConnectionStringBuilder using the previously acquired Azure AD token
var connectionStringBuilder = new KustoConnectionStringBuilder("https://<clusterName>.<region>.kusto.windows.net")
    .WithAadUserTokenAuthentication(accessTokenForAdx);
// Create an ADX query client base on the conneciton string object
using var queryClient = KustoClientFactory.CreateCslQueryProvider(connectionStringBuilder);
// Execute query
var queryResult = await queryClient.ExecuteQueryAsync("<databaseName>", "<query>", null);
```

## Web Client (JavaScript) authentication and authorization

**Azure AD application configuration**

In addition to the standard [steps](../../../provision-azure-ad-app.md) for setting up an Azure AD application, you'll also need to enable the single-page application (SPA) setting on your Azure AD application. This enables OAuth authorization code flow with PKCE for obtaining tokens used by [MSAL.js 2.0](https://www.npmjs.com/package/@azure/msal-browser) (MSAL 1.0 used a less secure implicit grant flow). Use the MSAL 2.0 steps in the [SPA app registration scenario](/azure/active-directory/develop/scenario-spa-app-registration) to configure the app accordingly.

**Details**

When the client is a JavaScript code running in the user's browser, the auth code flow is used. The authentication flow consists of two stages:

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
