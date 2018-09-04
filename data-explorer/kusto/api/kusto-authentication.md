---
title: Kusto Authentication - Azure Kusto | Microsoft Docs
description: This article describes Kusto Authentication in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto Authentication

### This section explains how to perform explicit programmatic AAD authentication in order to obtain an AAD token that will be honored by Kusto service.

The recommended way to authenticate to Kusto is by authenticating an interactive user (or an application) to AAD as the authentication provider, and then presenting the user (or application) token received from AAD to Kusto. In this case, all actions will be executed on-behalf-of the logged-in user, and authorization will be based on the user identity.

[Kusto Client Library (Kusto.Data)](using-the-kusto-client-library.md) provides an abstraction over interaction with AAD by allowing the caller to specify the authentication schema and parameters in Kusto Connection String.
Please use the [Kusto Connection Strings](https://kusdoc2.azurewebsites.net/docs/concepts/kusto-connection-strings.html) reference for guidance and examples.


## AAD User Authentication

An interactive application that uses the Kusto Client Libraries can indicate this form of authentication simply by setting the "Federated Authentication" property of the Kusto Connection String to "true". The client library will display the necessary login form to the user and cache the token in a local secure store.

Applications that do not use the Kusto Client Libraries (such as JavaScript applications) can acquire a user token by using the AAD client library (ADAL).
For an example of how to do so, please see: https://github.com/AzureADSamples/WebApp-WebAPI-OpenIDConnect-DotNet

Please note that such applications need to be granted delegated permissions to `Access Kusto`,
as documented in [Kusto guide to AAD Applications provisioning](https://kusdoc2.azurewebsites.net/docs/concepts/security-create-aad-app.html#set-up-delegated-permissions-for-the-kusto-service-application).

Resource id should be **your Kusto cluster URL**, e.g. `https://mycluster.kusto.windows.net` or `https://mycluster.kustomfa.windows.net`.

The following brief code snippet demonstrates using ADAL to acquire an AAD user token to access Kusto (launches logon UI):

```csharp
// Create an HTTP request
WebRequest request = WebRequest.Create(new Uri("https://your_cluster_name.kusto.windows.net"));

// Create Auth Context for MSFT AAD:
AuthenticationContext authContext = new AuthenticationContext("https://login.windows.net/microsoft.com");

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

// Create Auth Context for MSFT AAD:
AuthenticationContext authContext = new AuthenticationContext("https://login.windows.net/microsoft.com");

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
// Create Auth context for MSFT tenant on AAD
AuthenticationContext authContext = new AuthenticationContext("https://login.windows.net/microsoft.com");

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