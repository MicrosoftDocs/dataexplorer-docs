---
title: Authenticate with Azure AD for access - Azure Data Explorer
description: This article describes How-To Authenticate with Azure AD for Azure Data Explorer Access in Azure Data Explorer.
ms.reviewer: vladikb
ms.topic: reference
ms.custom: devx-track-js
ms.date: 02/07/2022
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
flow above (and much more). See, for example, the [.NET SDK](../../api/netfx/about-the-sdk.md).
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

Applications that don't use the Azure Data Explorer SDK can still use the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) instead of implementing the Azure AD service security protocol client. See [https://github.com/AzureADSamples/WebApp-WebAPI-OpenIDConnect-DotNet]
for an example of doing so from a .NET application.

If your application is intended to serve as front-end and authenticate users for an Azure Data Explorer cluster, the application must be granted delegated permissions on Azure Data Explorer.
The full step-by-step process is described in [Configure delegated permissions for the application registration](../../../provision-azure-ad-app.md#configure-delegated-permissions-for-the-application-registration).

The following brief code snippet demonstrates using [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire an Azure AD user
token to access Azure Data Explorer (launches logon UI):

```csharp
// Create an HTTP request
WebRequest request = WebRequest.Create(new Uri($"https://{serviceName}.{region}.kusto.windows.net"));

// Create a public authentication client for Azure AD:
var authClient = PublicClientApplicationBuilder.Create("<your client app ID>")
            .WithAuthority("https://login.microsoftonline.com/{Azure AD Tenant ID or name}")
            .WithRedirectUri(@"<your client app redirect URI>")
            .Build();

// Define scopes for accessing Azure Data Explorer cluster
string[] scopes = new string[] { $"https://{serviceName}.{region}.kusto.windows.net/.default" };

// Acquire user token for the interactive user for Azure Data Explorer:
AuthenticationResult result = authClient.AcquireTokenInteractive(scopes).ExecuteAsync().Result;

// Extract Bearer access token and set the Authorization header on your request:
string bearerToken = result.AccessToken;
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

## Application authentication

The following brief code snippet demonstrates using [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire an
Azure AD application token to access Azure Data Explorer. In this flow no prompt is presented, and
the application must be registered with Azure AD and equipped with credentials needed
to perform application authentication (such as an app key issued by Azure AD,
or an X509v2 certificate that has been pre-registered with Azure AD).

```csharp
// Create an HTTP request
WebRequest request = WebRequest.Create(new Uri("https://{serviceName}.{region}.kusto.windows.net"));

// Create a confidential authentication client for Azure AD:
var authClient = ConfidentialClientApplicationBuilder.Create("<your client app ID>")
            .WithAuthority("https://login.microsoftonline.com/{Azure AD Tenant ID or name}")
            .WithClientSecret("<your client app secret key>") // can be replaced by .WithCertificate to authenticate with an X.509 certificate
            .Build();

// Define scopes for accessing Azure Data Explorer cluster
string[] scopes = new string[] { $"https://{serviceName}.{region}.kusto.windows.net/.default" };

// Acquire aplpication token for Azure Data Explorer:
AuthenticationResult result = authClient.AcquireTokenForClient(scopes).ExecuteAsync().Result;

// Extract Bearer access token and set the Authorization header on your request:
string bearerToken = result.AccessToken;
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

2. On the resources pane, click **Azure Active Directory**, then **App registrations**.

3. Locate the application that uses the on-behalf-of flow and open it.

4. Click **API permissions**, then **Add a permission**.

5. Search for the application named **Azure Data Explorer** and select it.

6. Select **user_impersonation / Access Kusto**.

7. Click **Add permission**.

**Step 2: Perform token exchange in your server code**

```csharp
// Create a confidential authentication client for Azure AD:
var authClient = ConfidentialClientApplicationBuilder.Create("<your client app ID>")
            .WithAuthority("https://login.microsoftonline.com/{Azure AD Tenant ID or name}")
            .WithClientSecret("<your client app >") // can be replaced by .WithCertificate to authenticate with an X.509 certificate
            .Build();

// Define scopes for accessing Azure Data Explorer cluster
string[] scopes = new string[] { $"https://{serviceName}.{region}.kusto.windows.net/.default" };

// Encode the "original" token that will be used for exchange
var userAssertion = new UserAssertion(accessToken);

// Acquire on-behalf-of user token for the interactive user for Azure Data Explorer based on provided token:
AuthenticationResult result = authClient.AcquireTokenOnBehalfOf(scopes, userAssertion).ExecuteAsync().Result;

string accessTokenForAdx = result.AccessToken;
```

**Step 3: Provide the token to Kusto client library and execute queries**

```csharp
// Create KustoConnectionStringBuilder using the previously acquired Azure AD token
var kcsb = new KustoConnectionStringBuilder($"https://{serviceName}.{region}.kusto.windows.net")
            .WithAadUserTokenAuthentication(accessTokenForAdx);

// Create an ADX query client base on the conneciton string object
var queryClient = KustoClientFactory.CreateCslQueryProvider(kcsb);

// Execute query
var queryResult = queryclient.ExecuteQuery(databaseName, query, null);
```

## Web Client (JavaScript) authentication and authorization

**Azure AD application configuration**

> [!NOTE]
> We will be using the [MSAL.js 2.0](https://www.npmjs.com/package/@azure/msal-browser) library for authentication.
> In addition to the standard [steps](../../../provision-azure-ad-app.md) you need to
> follow in order to setup an Azure AD application, you will also need to enable SPA setting on your AAD application, 
> This will enable Oauth authorization code flow with PKCE for obtaining tokens, which is what msal 2 uses (MSAL 1 used a less secure implicit grant flow).
> Follow MSAL 2 section in the MSAL tutorial [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration) to configure the app accordingly.

**Details**

When the client is a JavaScript code running in the user's browser, the auth code flow is used. The authentication flow consists of 2 stages: 
1. MSAL redirects to AAD to login. AAD redirects back to the app, with an autorization code in the  url.
2. MSAL makes a request to the token endpoint to get the access token.
A 24 hour refresh token is given in this flow, so the client can cache the token for prolonged periods of time and try reuse it by acquiring the token silently.

Like in the native client flow, there should be  two Azure AD applications (Server and Client) with a configured relationship between them.

MSAL js 2 requires logging in (also known as getting an ID token) before any access token calls are made.

The ID token is obtained by calling the `PublicClientApplication.loginRedirect()` method, and access tokens are obtained by calling `PublicClientApplication.acquireTokenSilent()` or `PublicClientApplication.acquireTokenRedirect()` in case silent acquisition failed.
MSAL 2 also supports `PublicClientApplicationloginPopup()`, but some browser block pop-ups which makes it less useful than a redirect.

MSAL JS has detailed sample apps for different frameworks such as react and angular. [this](https://github.com/Azure-Samples/ms-identity-javascript-react-spa) is a good start if you need to auhtenticate to azure data explorer using a react application.
Since the client-side javascript framwork ecosystem is exremely diverse, it is reccommended to find the right sample app in MSAL js documentation that feets your needs. 

We will provide a barebones framework-less sample code below to use as a genereal reference.

1. Create an instance of MSAL's `PublicClientApplication` with the right configuration:

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

2. It is important to always call `handleRedirectPromise()` whenever the page loads. This is because AAD will put the authorization code as part of the URL and this function contains the piece of code that pulls the auth code out of the fragment URL and caches it. Note the `await` here - it's important.

```javascript
await msalInstance.handleRedirectPromise();
```

3. login if the MSAL doesn't have any locallly cached accounts. Note that we're providing the scopes we'll need for access, thus at this point when the user gets redirected to AAD they might be asked to consent to provide your app the permission to access Azure Data Explorer on their behalf.

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

4. Now that the user is logged in, Call `msalInstance.acquireTokenSilent()` to get the actual access token for Azure data explorer. if silent token acquisition failes, you will need to call `acquireTokenRedirect()` in order to get a new authorization code.

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

5. Now that you have an access token to the Azure Data Explorer cluster, you can issue a requet to that cluster. All you have to do is put the token in the Authorization header:

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
