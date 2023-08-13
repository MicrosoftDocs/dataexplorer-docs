---
title:  How to authenticate with Microsoft Authentication Library (MSAL) in apps
description: This article describes authentication with Microsoft Authentication Library (MSAL) in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/28/2023
---
# How to authenticate with Microsoft Authentication Library (MSAL) in apps

To programmatically authenticate with your cluster, you need to request an access token from [Azure Active Directory (Azure AD)](/azure/active-directory/fundamentals/active-directory-whatis) specific to Azure Data Explorer. This access token acts as proof of identity when issuing requests to your cluster. You can use one of the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) [flows](/azure/active-directory/develop/msal-authentication-flows) to create an access token.

This article explains how to use MSAL to authenticate principals to your cluster. The direct use of MSAL to authenticate principals is primarily relevant in web applications that require [On-behalf-of (OBO) authentication](#perform-on-behalf-of-obo-authentication) or [Single Page Application (SPA) authentication](#perform-single-page-application-spa-authentication). For other cases, we recommend using the [Kusto client libraries](../client-libraries.md) as they simplify the authentication process.

In this article, learn about the main authentication scenarios, the information to provide for successful authentication, and the use of MSAL for authentication.

## Authentication scenarios

The main authentication scenarios are as follows:

* [User authentication](#perform-user-authentication-with-msal): Used to verify the identity of human users.

* [Application authentication](#perform-application-authentication-with-msal): Used to verify the identity of an application that needs to access resources without human intervention by using configured credentials.

* [On-behalf-of (OBO) authentication](#perform-on-behalf-of-obo-authentication): Allows an application to exchange a token for said application with a token to access a Kusto service. This flow must be implemented with MSAL.

* [Single page application (SPA) authentication](#perform-single-page-application-spa-authentication): Allows client-side SPA web applications to sign in users and get tokens to access your cluster. This flow must be implemented with MSAL.

For user and application authentication, we recommend using the [Kusto client libraries](../../../kusto/api/client-libraries.md). For OBO and SPA authentication, the Kusto client libraries can't be used.

## Authentication parameters

During the token acquisition process, the client needs to provide the following parameters:

|Parameter name|Description|
|--|--|
|Resource ID|The resource ID for which to issue the Azure AD access token. The resource ID is the cluster URI without port information and path.<br/><br/>**Example**: The resource ID for the `help` cluster is `https://help.kusto.windows.net`.|
|Azure AD tenant ID|Azure AD is a multi-tenant service, and every organization can create an object called a directory that holds security-related objects such as user accounts and applications. Azure AD often refers to the directory as a tenant. Each tenant has a tenant ID in the form of a GUID. In many cases, the domain name of the organization may also be used to identity the Azure AD tenant.<br/><br/>**Example**: An organization "Contoso" might have the tenant ID `12345678-a123-4567-b890-123a456b789c` and the domain name `contoso.com`.|
|Azure AD authority URI|The endpoint used for authentication. The Azure AD directory, or tenant, determines the Azure AD authority URI. The URI is `https://login.microsoftonline.com/{tenantId}` where `{tenantId}` is either the tenant ID or domain name.<br/><br/>**Example**: For example, `https://login.microsoftonline.com/12345678-a123-4567-b890-123a456b789c`.|

> [!NOTE]
> The Azure AD service endpoint changes in national clouds. When working with an Azure Data Explorer service deployed in a national cloud, set the corresponding national cloud Azure AD service endpoint.

## Perform user authentication with MSAL

The following code sample shows how to use MSAL to get an authorization token for your cluster. The authorization is done in a way that launches the interactive sign-in UI. The `appRedirectUri` is the URL to which Azure AD redirects after authentication completes successfully. MSAL extracts the authorization code from this redirect.

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";

var authClient = PublicClientApplicationBuilder.Create("<appId>")
    .WithAuthority($"https://login.microsoftonline.com/<appTenant>")
    .WithRedirectUri("<appRedirectUri>")
    .Build();

var result = authClient.AcquireTokenInteractive(
    new[] { $"{kustoUri}/.default" } // Define scopes for accessing Azure Data Explorer cluster
).ExecuteAsync().Result;

var bearerToken = result.AccessToken;

var request = WebRequest.Create(new Uri(kustoUri));
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

> [!NOTE]
>
> * We recommend using the [Kusto client libraries](../client-libraries.md) whenever possible. These libraries simplify the authentication process by allowing you to provide authentication properties in the [Kusto connection string](../../../kusto/api/connection-strings/kusto.md).
> * With the Kusto client libraries, Azure AD tokens are stored in a local token cache on the user's machine to reduce the number of times they're prompted for credentials. The cache file is **%APPDATA%\Kusto\userTokenCache.data** and can only be accessed by the signed-in user.

## Perform application authentication with MSAL

The following code sample shows how to use MSAL to get an authorization token for your cluster. In this flow, no prompt is presented. The application must be registered with Azure AD and have an app key or an X509v2 certificate issued by Azure AD. To set up an application, see [Provision an Azure AD application](../../../provision-azure-ad-app.md).

```csharp
var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";

var authClient = ConfidentialClientApplicationBuilder.Create("<appId>")
    .WithAuthority($"https://login.microsoftonline.com/<appTenant>")
    .WithClientSecret("<appKey>") // Can be replaced by .WithCertificate to authenticate with an X.509 certificate
    .Build();

var result = authClient.AcquireTokenForClient(
    new[] { $"{kustoUri}/.default" } // Define scopes for accessing Azure Data Explorer cluster
).ExecuteAsync().Result;
var bearerToken = result.AccessToken;

var request = WebRequest.Create(new Uri(kustoUri));
request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", bearerToken));
```

> [!NOTE]
> We recommend using the [Kusto client libraries](../client-libraries.md) whenever possible. These libraries simplify the authentication process by allowing you to provide authentication properties in the [Kusto connection string](../../../kusto/api/connection-strings/kusto.md).

## Perform On-behalf-of (OBO) authentication

[On-behalf-of authentication](/azure/active-directory/develop/msal-authentication-flows#on-behalf-of-obo) is relevant when your web application or service acts as a mediator between the user or application and your cluster.

In this scenario, an application is sent an Azure AD access token for an arbitrary resource. Then, the application uses that token to acquire a new Azure AD access token for the Azure Data Explorer resource. Then, the application can access your cluster on behalf of the principal indicated by the original Azure AD access token. This flow is called the [OAuth 2.0 on-behalf-of authentication flow](/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). It generally requires multiple configuration steps with Azure AD, and in some cases might require special consent from the administrator of the Azure AD tenant.

To perform on-behalf-of authentication:

1. [Provision an Azure AD application](../../../provision-azure-ad-app.md).
1. Establish a trust relationship between the application and your cluster. To do so, follow the steps in [Configure delegated permissions](../../../provision-azure-ad-app.md#configure-delegated-permissions-for-the-application-registration).
1. In your server code, use MSAL to perform the token exchange.

    ```csharp
    var kustoUri = "https://<clusterName>.<region>.kusto.windows.net";

    var authClient = ConfidentialClientApplicationBuilder.Create("<appId>")
        .WithAuthority($"https://login.microsoftonline.com/<appTenant>")
        .WithClientSecret("<appKey>") // Can be replaced by .WithCertificate to authenticate with an X.509 certificate
        .Build();
    
    var result = authClient.AcquireTokenOnBehalfOf(
        new[] { $"{kustoUri}/.default" }, // Define scopes for accessing your cluster
        new UserAssertion("<userAccessToken>") // Encode the "original" token that will be used for exchange
    ).ExecuteAsync().Result;
    var accessTokenForAdx = result.AccessToken;
    ```

1. Use the token to run queries. For example:

    ```csharp
    var request = WebRequest.Create(new Uri(kustoUri));
    request.Headers.Set(HttpRequestHeader.Authorization, string.Format(CultureInfo.InvariantCulture, "{0} {1}", "Bearer", accessTokenForAdx));
    ```

## Perform Single Page Application (SPA) authentication

For authentication for a SPA web client, use the [OAuth authorization code flow](/azure/active-directory/develop/msal-authentication-flows#authorization-code).

In this scenario, the app is redirected to sign in to Azure AD. Then, Azure AD redirects back to the app with an authorization code in the URI. Then, the app makes a request to the token endpoint to get the access token. The token is valid for 24 hour during which the client can reuse it by acquiring the token silently.

Microsoft Identity Platform has detailed tutorials for different use cases such as [React](/azure/active-directory/develop/single-page-app-tutorial-01-register-app), [Angular](/azure/active-directory/develop/tutorial-v2-angular-auth-code), and [JavaScript](/azure/active-directory/develop/tutorial-v2-javascript-auth-code).

To set up authentication for a web client:

1. [Provision an Azure AD application](../../../provision-azure-ad-app.md).
1. Configure the app as described in [MSAL.js 2.0 with auth code flow](/azure/active-directory/develop/scenario-spa-app-registration#redirect-uri-msaljs-20-with-auth-code-flow).
1. Use the MSAL.js 2.0 library to sign in a user and authenticate to your cluster. Microsoft Identity Platform has detailed tutorials for different use cases such as [React](/azure/active-directory/develop/single-page-app-tutorial-01-register-app), [Angular](/azure/active-directory/develop/tutorial-v2-angular-auth-code), and [JavaScript](/azure/active-directory/develop/tutorial-v2-javascript-auth-code).

    The following example uses the MSAL.js library to access Azure Data Explorer.

    ```javascript
    import * as msal from "@azure/msal-browser";
    
    const msalConfig = {
      auth: {
        clientId: "<AAD client application ID>",
        authority: "https://login.microsoftonline.com/<AAD tenant ID>",
      },
    };
    
    const msalInstance = new msal.PublicClientApplication(msalConfig);
    const myAccounts = msalInstance.getAllAccounts();
    
    // If no account is logged in, redirect the user to log in.
    if (myAccounts === undefined || myAccounts.length === 0) {
      try {
        await msalInstance.loginRedirect({
          scopes: ["https://help.kusto.windows.net/.default"],
        });
      } catch (err) {
        console.error(err);
      }
    }
    const account = myAccounts[0];
    const name = account.name;
    window.document.getElementById("main").innerHTML = `Hi ${name}!`;
    
    // Get the access token required to access the specified Azure Data Explorer cluster.
    const accessTokenRequest = {
      account,
      scopes: ["https://help.kusto.windows.net/.default"],
    };
    let acquireTokenResult = undefined;
    try {
      acquireTokenResult = await msalInstance.acquireTokenSilent(accessTokenRequest);
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        await msalInstance.acquireTokenRedirect(accessTokenRequest);
      }
    }
    
    const accessToken = acquireTokenResult.accessToken;
    
    // Make requests to the specified cluster with the token in the Authorization header.
    const fetchResult = await fetch("https://help.kusto.windows.net/v2/rest/query", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        db: "Samples",
        csl: "StormEvents | count",
      }),
    });
    const jsonResult = await fetchResult.json();
    
    // The following line extracts the first cell in the result data.
    const count = jsonResult.filter((x) => x.TableKind === "PrimaryResult")[0].Rows[0][0];
    ```

## See also

* [Authentication over HTTPs](authentication.md)
* [Provision an Azure AD application](../../../provision-azure-ad-app.md)
* [Kusto client libraries](../../api/client-libraries.md)
