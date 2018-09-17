---
title: How-To -  Authenticate with AAD for Kusto Access - Azure Kusto | Microsoft Docs
description: This article describes How-To -  Authenticate with AAD for Kusto Access in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# How-To: Authenticate with AAD for Kusto Access

This article explains how to obtain an AAD Access Token for Kusto service access. 
 
The recommended way to authenticate to Kusto is by authenticating an interactive user (or an application) to AAD as the authentication provider, and then presenting the user (or application) token received from AAD to Kusto. In this case, all actions will be executed on-behalf-of the logged-in user, and authorization will be based on the user identity.

[Kusto Client Library (Kusto.Data)](../../api/netfx/about-kusto-data.md) provides an abstraction over interaction with AAD by allowing the caller to specify the authentication schema and parameters in Kusto Connection String.
Please see the [Kusto connection strings](../../api/connection-strings/kusto.md) reference for guidance and examples.


## AAD User Authentication

An interactive application that uses the Kusto Client Libraries can indicate this form of authentication simply by setting the "Federated Authentication" property of the Kusto Connection String to "true". The client library will display the necessary login form to the user and cache the token in a local secure store.

Applications that do not use the Kusto Client Libraries (such as JavaScript applications) can acquire a user token by using the AAD client library (ADAL).
For an example of how to do so, please see: https://github.com/AzureADSamples/WebApp-WebAPI-OpenIDConnect-DotNet

Please note that if an application wishes to authenticate users for Kusto access, it needs to be granted delegated permissions to `Access Kusto`,
as documented in [Kusto guide to AAD Applications provisioning](how-to-provision-aad-app.md#set-up-delegated-permissions-for-the-kusto-service-application).

Resource id should be **your Kusto cluster URL**, e.g. `https://mycluster.kusto.windows.net` or `https://mycluster.kustomfa.windows.net`.

In all the examples below, the term `AAD Authority URL` denotes the AAD endpoint to be contacted for authentication ans expands into one of the following:
* In order to access the `common` endpoint and to authenticate based on the principal's default AAD tenant: `https://login.microsoftonline.com/common/oauth2/authorize`
* In order to specify the AAD tenant for the authentication: `https://login.microsoftonline.com/<tenantId>/oauth2/authorize`

The following brief code snippet demonstrates using ADAL to acquire an AAD user token to access Kusto (launches logon UI):

```csharp
// Create an HTTP request
WebRequest request = WebRequest.Create(new Uri("https://your_cluster_name.kusto.windows.net"));

// Create Auth Context for AAD (common or tenant-specific endpoint):
AuthenticationContext authContext = new AuthenticationContext("AAD Authority URL");

// Acquire user token for the interactive user for Kusto:
AuthenticationResult result = authContext.AcquireTokenAsync("https://your_cluster_name.kusto.windows.net", "your client app id", 
    new Uri("your client app resource id"), new PlatformParameters(PromptBehavior.Auto)).GetAwaiter().GetResult();

// Extract Bearer access token and set the Authorization header on your request:
string bearerToken = result.AccessToken;
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

## AAD Application Authentication

### Explicit AAD Application Authentication
 
Applications that do not use the Kusto Client Libraries (such as JavaScript applications) can acquire an application token using the AAD client library ADAL.
The following brief code snippet demonstrates using ADAL to acquire an AAD app token to access Kusto (requires application to be registered with AAD):

```csharp
// Create an HTTP request
WebRequest request = WebRequest.Create(new Uri("https://your_cluster_name.kusto.windows.net"));

// Create Auth Context for AAD (common or tenant-specific endpoint):
AuthenticationContext authContext = new AuthenticationContext("AAD Authority URL");

// Acquire application token for Kusto:
ClientCredential applicationCredentials = new ClientCredential("your applciation client ID", "your application key");
AuthenticationResult result =
        authContext.AcquireTokenAsync("https://your_cluster_name.kusto.windows.net", applicationCredentials).GetAwaiter().GetResult();

// Extract Bearer access token and set the Authorization header on your request:
string bearerToken = result.AccessToken;
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

AAD also supports Application authentication with an X509v2 certificate (requires preregistration of the certificate with AAD).

## Reuse existing AAD tokens to access Kusto

Let's say you already have your own authentication scenario against AAD for your own application - and thus you already have an AAD access token at tyour disposal.
In that case you can use the [OAuth2 token exchange flow](https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-04) to procure a token for Kusto by providing AAD with token you have at your disposal.

### Step 1: Establish trust relationship between your application and Kusto service
1. Go to the(old) Azure portal => Active Directory => Applications and find your AAD application
2. Click on the **Configure** tab
3. Go to the **permissions to other applications** section
4. Search for the application named Kusto and select it
5. Go to delegated permission and add **Access Kusto**
6. Click save

### Step 2: Perform token exchange in your server code

```csharp
// Create Auth Context for AAD (common or tenant-specific endpoint):
AuthenticationContext authContext = new AuthenticationContext("AAD Authority URL");

// Exchange your token for for Kusto token.
// You will need to provide your application's client ID and secret to authenticate your application 
var tokenForKusto = authContext.AcquireTokenAsync(
    "https://your_cluster_name.kusto.windows.net",
    new ClientCredential(customerAadWebApplicationClientId, customerAAdWebApplicationSecret),
    new UserAssertion(customerAadWebApplicationToken)).GetAwaiter().GetResult();
```

### Step 3: Provide the token to Kusto client library and execute queries
```csharp
var kcsb = new KustoConnectionStringBuilder(string.Format(
    "https://{0}.kusto.windows.net;fed=true;UserToken={1}", 
    clusterName, 
    tokenForKusto.AccessToken));
var client = KustoClientFactory.CreateCslQueryProvider(kcsb);
var queryResult = client.ExecuteQuery(clusterName, query, null);
```


## Web Client (JavaScript) Authentication and Authorization



### AAD application configuration
>Note that in addition to the standard [steps](./how-to-provision-aad-app.md) you need to follow in order to setup an AAD app, you should also enable oauth implicit flow in your AAD application. You can achieve that by selecting manifest from your application page in the azure portal, and set oauth2AllowImplicitFlow to true

### Details
When the client is a JavaScript code running in the user's browser, the implicit grant flow is used. The token granting the client application
access to the Kusto service is provided immediately following a successful authentication as part of the redirect URI (in a URI
fragment); no refresh token is given in this flow, so the client can't cache the token for prolonged periods of time and reuse it.

Like in the native client flow, there should be  two AAD applications (Server and Client) with a configured relationship between them. 

AdalJs requires getting an id_token before any access_token calls are made.

Access token is obtains by calling the `AuthenticationContext.login()` method, and access_tokens are obtained by calling `Authenticationcontext.acquireToken()`.

- Create an AuthenticationContext with the right configuration:

```javascript
var config = {
    tenant: "microsoft.com",
    clientId: "<Web AAD app with current website as reply URL. for example, KusDash uses f86897ce-895e-44d3-91a6-aaeae54e278c>",
    redirectUri: "<where you'd like AAD to redirect after authentication succeeds (or fails).>",
    postLogoutRedirectUri: "where you'd like AAD to redirect the browser after logout."
};

var authContext = new AuthenticationContext(config);
```

- Call `authContext.login()` before trying to `acquireToken()` if you are not logged in. a good way ot know if you're logged in or not is to call `authContext.getCachedUser()` and see if it returns `false`)
- Call `authContext.handleWindowCallback()` whenever your page loads. This is the piece of code that intercepts the redirect back from AAD and pulls the token out of the fragment URL and caches it.
- Call `authContext.acquireToken()` to get the actual access token, now that you have a valid ID token. The first parameter to acquireToken will be the Kusto server AAD application resource URL.  
```javascript
 authContext.acquireToken("<Kusto cluster URL>", callbackThatUsesTheToken);
 ```
- in the callbackThatUsesTheToken you can use the token as a bearer token in the kusto request. for example:

```javascript
var settings = {
    url: "https://" + clusterName + ".kusto.windows.net/v1/rest/query",
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

## AAD token cache

So as not to require users to repeatedly enter their credentials, Kusto caches
AAD tokens. The token cache is stored locally on the machine (`%APPDATA%\Kusto\tokenCache.data`)
and is bound to the logged-on user identity so it can't be decrypted by other
users on that machine.

