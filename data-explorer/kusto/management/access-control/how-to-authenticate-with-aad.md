---
title: How-To Authenticate with AAD for Azure Data Explorer Access - Azure Data Explorer | Microsoft Docs
description: This article describes How-To Authenticate with AAD for Azure Data Explorer Access in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/13/2019

---
# How-To Authenticate with AAD for Azure Data Explorer Access

The recommended way to access Azure Data Explorer is by authenticating to the
**Azure Active Directory** service (sometimes also called **Azure AD**, or simply
**AAD**). Doing so guarantees that Azure Data Explorer never sees the accessing principal's
directory credentials, by using a two-stage process:

1. In the first step, the client communicates with the AAD service, authenticates
   to it, and requests an access token issued specifically for the particular Azure Data Explorer
   endpoint the client intends to access.
2. In the second step the client issues requests to Azure Data Explorer, providing the access
   token acquired in the first step as a proof of identity to Azure Data Explorer.

Azure Data Explorer then executes the request on behalf of the security principal for which AAD
issued the access token, and all authorization checks are performed using
this identity.

In most cases, the recommendation is to use one of Azure Data Explorer SDKs to access the
service programmatically, as they remove much of the hassle of implementing the
flow above (and much else). See, for example, the [.NET SDK](../../api/netfx/about-the-sdk.md).
The authentication properties are then set by the [Kusto connection string](../../api/connection-strings/kusto.md).
If that is not possible, please read on for detailed information on how to
implement this flow yourself.

The main authenticating scenarios are:

* **A client application authenticating a signed-in user**.
  In this scenario, an interactive (client) application triggers an AAD prompt
  to the user for credentials (such as username and password).
  See [user authentication](#user-authentication),

* **A "headless" application**.
  In this scenario an application is running with no user present to provide
  credentials, and instead the application authenticates as "itself" to AAD
  using some credentials it has been configured with.
  See [application authentication](#application-authentication).

* **On-behalf-of authentication**.
  In this scenario, sometimes called the "web service" or "web app" scenario,
  the application gets an AAD access token from another application, and then
  "converts" it to an another AAD access token that can be used with Azure Data Explorer.
  In other words, the application acts as a mediator between the user or application
  that provided credentials and the Azure Data Explorer service.
  See [on-behalf-of authentication](#on-behalf-of-authentication).

## Specifying the AAD resource for Azure Data Explorer

When acquiring an access token from AAD, the client must tell AAD which **AAD resource**
the token should be issued to. The AAD resource of a Azure Data Explorer endpoint is the
URI of the endpoint, barring the port information and the path. For example:

```txt
https://help.kusto.windows.net
```



## Specifying the AAD tenant ID

AAD is a multi-tenant service, and every organization can create an object called
**directory** in AAD. The directory object holds security-related objects such
as user accounts, applications, and groups. AAD often refers to the directory
as a **tenant**. AAD tenants are identifies by a GUID (**tenant ID**). In many
cases, AAD tenants can also be identified by the domain name of the organization.

For example, an organization called "Contoso" might have the tenant ID
`4da81d62-e0a8-4899-adad-4349ca6bfe24` and the domain name `contoso.com`.

## Specifying the AAD authority

AAD has a number of endpoints for authentication:

* When the tenant hosting the principal being authenticated is known
  (in other words, when one knows which AAD directory the user or application
  are in), the AAD endpoint is `https://login.microsoftonline.com/{tenantId}`.
  Here, `{tenantId}` is either the organization's tenant ID in AAD, or its
  domain name (e.g. `contoso.com`).

* When the tenant hosting the principal being authenticated is not known,
  the "common" endpoint can be used by replacing the `{tenantId}` above
  with the value `common`.

> [!NOTE]
> The AAD endpoint used for authentication is also called **AAD authority URL**
> or simply **AAD authority**.

## AAD token cache

When using the Azure Data Explorer SDK, the AAD tokens are stored on the local machine in a
per-user token cache (a file called **%APPDATA%\Kusto\tokenCache.data** which can
only be accessed or decrypted by the signed-in user.) The cache is inspected
for tokens before prompting the user for credentials, thus greatly reducing the
number of times a user has to enter credentials.

> [!NOTE]
> The AAD token cache reduces the number of interactive prompts that a user would
> be presented with accessing Azure Data Explorer, but does not reduce them complete. Additionally,
> users cannot anticipate in advance when they will be prompted for credentials.
> This means that one must not attempt to use a user account to access Azure Data Explorer if
> there's a need to support non-interactive logons (such as when scheduling tasks
> for example), because when the time comes for prompting the logged on user for
> credentials that prompt will fail if running under non-interactive logon.


## User authentication

The easiest way to access Azure Data Explorer with user authentication is to use the Azure Data Explorer SDK
and set the `Federated Authentication` property of the Azure Data Explorer connection string to
`true`. The first time the SDK is used to send a request to the service the user
will be presented with a sign-in form to enter the AAD credentials, and on
successful authentication the request will be sent.

Applications that do not use the Azure Data Explorer SDK can still use the AAD client library
(ADAL) instead of implementing the AAD service security protocol client. Please
see [https://github.com/AzureADSamples/WebApp-WebAPI-OpenIDConnect-DotNet]
for an example of doing so from a .NET application.

To authenticate users for Azure Data Explorer access, an application must first be granted the
`Access Kusto` delegated permission. Please see [Kusto guide to AAD applications provisioning](how-to-provision-aad-app.md#set-up-delegated-permissions-for-kusto-service-application)
for details.

The following brief code snippet demonstrates using ADAL to acquire an AAD user
token to access Azure Data Explorer (launches logon UI):

```csharp
// Create an HTTP request
WebRequest request = WebRequest.Create(new Uri("https://{serviceNameAndRegion}.kusto.windows.net"));

// Create Auth Context for AAD (common or tenant-specific endpoint):
AuthenticationContext authContext = new AuthenticationContext("AAD Authority URL");

// Acquire user token for the interactive user for Kusto:
AuthenticationResult result = authContext.AcquireTokenAsync("https://{serviceNameAndRegion}.kusto.windows.net", "your client app id", 
    new Uri("your client app resource id"), new PlatformParameters(PromptBehavior.Auto)).GetAwaiter().GetResult();

// Extract Bearer access token and set the Authorization header on your request:
string bearerToken = result.AccessToken;
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

## Application authentication

The following brief code snippet demonstrates using ADAL to acquire an
AAD application token to access Azure Data Explorer. In this flow no prompt is presented, and
the application must be registered with AAD and equipped with credentials needed
to perform application authentication (such as an app key issued by AAD,
or an X509v2 certificate that has been pre-registered with AAD).

```csharp
// Create an HTTP request
WebRequest request = WebRequest.Create(new Uri("https://{serviceNameAndRegion}.kusto.windows.net"));

// Create Auth Context for AAD (common or tenant-specific endpoint):
AuthenticationContext authContext = new AuthenticationContext("AAD Authority URL");

// Acquire application token for Kusto:
ClientCredential applicationCredentials = new ClientCredential("your application client ID", "your application key");
AuthenticationResult result =
        authContext.AcquireTokenAsync("https://{serviceNameAndRegion}.kusto.windows.net", applicationCredentials).GetAwaiter().GetResult();

// Extract Bearer access token and set the Authorization header on your request:
string bearerToken = result.AccessToken;
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

## On-behalf-of authentication

In this scenario an application was sent an AAD access token for some arbitrary
resource managed by the application, and it uses that token to acquire a new AAD
access token for the Azure Data Explorer resource so that the application could access Kusto
on behalf of the principal indicated by the original AAD access token.

This flow is called the
[OAuth2 token exchange flow](https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-04).
It generally requires multiple configuration steps with AAD, and in some cases
(depending on the AAD tenant configuration) might require special consent from
the administrator of the AAD tenant.



**Step 1: Establish trust relationship between your application and the Azure Data Explorer service**

1. Open the [Azure portal](https://portal.azure.com/) and make sure that you are
   signed-in to the correct tenant (see top/right corner for the identity
   used to sign-in to the portal).

2. On the resources pane, click **Azure Active Directory**, then **App registrations**.

3. Locate the application that uses the on-behalf-of flow and open it.

4. Click **API permissions**, then **Add a permission**.

5. Search for the application named **Azure Data Explorer** and select it.

6. Select **user_impersonation / Access Kusto**.

7. Click **Add permission**.

**Step 2: Perform token exchange in your server code**

```csharp
// Create Auth Context for AAD (common or tenant-specific endpoint):
AuthenticationContext authContext = new AuthenticationContext("AAD Authority URL");

// Exchange your token for for Kusto token.
// You will need to provide your application's client ID and secret to authenticate your application 
var tokenForKusto = authContext.AcquireTokenAsync(
    "https://{serviceNameAndRegion}.kusto.windows.net",
    new ClientCredential(customerAadWebApplicationClientId, customerAAdWebApplicationSecret),
    new UserAssertion(customerAadWebApplicationToken)).GetAwaiter().GetResult();
```

**Step 3: Provide the token to Kusto client library and execute queries**

```csharp
var kcsb = new KustoConnectionStringBuilder(string.Format(
    "https://{0}.kusto.windows.net;fed=true;UserToken={1}", 
    clusterName, 
    tokenForKusto.AccessToken));
var client = KustoClientFactory.CreateCslQueryProvider(kcsb);
var queryResult = client.ExecuteQuery(databaseName, query, null);
```

## Web Client (JavaScript) authentication and authorization



**AAD application configuration**

> [!NOTE]
> In addition to the standard [steps](./how-to-provision-aad-app.md) you need to
> follow in order to setup an AAD app, you should also enable oauth implicit flow
> in your AAD application. You can achieve that by selecting manifest from your
>application page in the azure portal, and set oauth2AllowImplicitFlow to true.

**Details**

When the client is a JavaScript code running in the user's browser, the implicit grant flow is used. The token granting the client application
access to the Azure Data Explorer service is provided immediately following a successful authentication as part of the redirect URI (in a URI
fragment); no refresh token is given in this flow, so the client can't cache the token for prolonged periods of time and reuse it.

Like in the native client flow, there should be  two AAD applications (Server and Client) with a configured relationship between them. 

AdalJs requires getting an id_token before any access_token calls are made.

Access token is obtains by calling the `AuthenticationContext.login()` method, and access_tokens are obtained by calling `Authenticationcontext.acquireToken()`.

* Create an AuthenticationContext with the right configuration:

```javascript
var config = {
    tenant: "microsoft.com",
    clientId: "<Web AAD app with current website as reply URL. for example, KusDash uses f86897ce-895e-44d3-91a6-aaeae54e278c>",
    redirectUri: "<where you'd like AAD to redirect after authentication succeeds (or fails).>",
    postLogoutRedirectUri: "where you'd like AAD to redirect the browser after logout."
};

var authContext = new AuthenticationContext(config);
```

* Call `authContext.login()` before trying to `acquireToken()` if you are not logged in. a good way ot know if you're logged in or not is to call `authContext.getCachedUser()` and see if it returns `false`)
* Call `authContext.handleWindowCallback()` whenever your page loads. This is the piece of code that intercepts the redirect back from AAD and pulls the token out of the fragment URL and caches it.
* Call `authContext.acquireToken()` to get the actual access token, now that you have a valid ID token. The first parameter to acquireToken will be the Kusto server AAD application resource URL.  

```javascript
 authContext.acquireToken("<Kusto cluster URL>", callbackThatUsesTheToken);
 ```

* in the callbackThatUsesTheToken you can use the token as a bearer token in the Azure Data Explorer request. for example:

```javascript
var settings = {
    url: "https://" + clusterAndRegionName + ".kusto.windows.net/v1/rest/query",
    type: "POST",
    data: JSON.stringify({
        "db": dbName,
        "csl": query,
        "properties": null
    }),
    contentType: "application/json; charset=utf-8",
    headers: { "Authorization": "Bearer " + token },
    dataType: "json",
    jsonp: false,
    success: function(data, textStatus, jqXHR) {
        if (successCallback !== undefined) {
            successCallback(data.Tables[0]);
        }

    },
    error: function(jqXHR, textStatus, errorThrown) {
        if (failureCallback !==  undefined) {
            failureCallback(textStatus, errorThrown, jqXHR.responseText);
        }

    },
};

$.ajax(settings).then(function(data) {/* do something wil the data */});
``` 

> Warning - if you get the following or similar exception when authenticating: 
`ReferenceError: AuthenticationContext is not defined` 
it's probably because you don't have AuthenticationContext in the global namespace. 
Unfortunately AdalJS currently has an undocumented requirement that the authentication context will be defined in the global namespace.