---
title:  Azure Active Directory authentication
description: This article describes Azure Active Directory authentication in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/22/2023
---
# Authenticate with Azure Active Directory

[Azure Active Directory (Azure AD)](/azure/active-directory/fundamentals/active-directory-whatis) is a cloud-based identity and access management service that can authenticate security principals and federate with other identity providers. Azure AD is the only method of authentication to Azure Data Explorer.

To authenticate with Azure AD, the client must communicate with the Azure AD service and request an access token specific to Azure Data Explorer. Then, the client can use the acquired access token as proof of identity when issuing requests to Azure Data Explorer.

The main types of authentication scenarios are as follows:

* [User authentication](index.md#user-authentication): Verifies the identity of human users through interactive prompts that prompt the user for their credentials or programmatically via a token.

* [Application authentication](index.md#application-authentication): Verifies the identity of an application that needs to access resources without human intervention by using configured credentials.  

* [On-behalf-of authentication](#on-behalf-of-authentication): Allows an application to obtain an Azure AD access token from another application and use it to access Azure Data Explorer.

> [!IMPORTANT]
> We recommend using the [Kusto client libraries](../api/client-libraries.md) for user and application authentication, which simplify the authentication process. However, for on-behalf-of authentication, follow the process described in the [On-behalf-of authentication](#on-behalf-of-authentication) section.

## Microsoft Authentication Library (MSAL)

To authenticate with Azure Data Explorer, we recommend using the [Kusto client libraries](../api/client-libraries.md), which use [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire Azure AD tokens. These libraries simplify the authentication process.

When using the Kusto client libraries, you can configure the authentication properties through the [Kusto connection string](../api/connection-strings/kusto.md). This approach provides a straightforward way to authenticate without the need to implement complex authentication flows.

Alternatively, if you prefer to handle authentication manually, you can choose to implement one of the [MSAL authentication flows](active-directory/develop/msal-authentication-flows). However, keep in mind that this approach involves more complexity compared to using the client libraries.

During the token acquisition process with MSAL, the client must provide the following parameters:

|Parameter|Description|Example|
|--|--|--|
|Resource ID|The resource ID for which the Azure AD token should be issued. For Azure Data Explorer, this is the cluster URI without port information and path.|The resource ID for the `help` cluster is `https://help.kusto.windows.net`.|
|Azure AD tenant ID|Azure AD is a multi-tenant service, and every organization can create an object called directory in Azure AD. The directory object holds security-related objects such as user accounts, applications, and groups. Azure AD often refers to the directory as a tenant. Azure AD tenants are identified by a GUID, or the tenant ID. In many cases, the domain name of the organization can identity the Azure AD tenant.|An organization "Contoso" might have the tenant ID `12345678-a123-4567-b890-123a456b789c` and the domain name `contoso.com`.|
|Azure AD authority URI|The endpoint used for authentication. The Azure AD directory, or tenant, determines the Azure AD authority URI. Use `https://login.microsoftonline.com/{tenantId}` as the Azure AD authority URI where `{tenantId}` is either the tenant ID or domain name.|For example, `https://login.microsoftonline.com/12345678-a123-4567-b890-123a456b789c`.|

> [!NOTE]
> The Azure AD service endpoint changes in national clouds. When working with an Azure Data Explorer service deployed in a national cloud, set the corresponding national cloud Azure AD service endpoint.

## User and application authentication

The following examples use MSAL to authenticate to Azure Data Explorer. Select the tab relevant for the required type of authentication.

### [User authentication](#tabs/user-auth)

The following example uses MSAL to get an Azure AD user token to access Azure Data Explorer in a way that launches the interactive sign-in UI. The `appRedirectUri` is the URL to which Azure AD redirects after authentication completes successfully. MSAL extracts the authorization code from this redirect.

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

### [Application authentication](#tabs/app-auth)

The following example uses MSAL to get an Azure AD application token to access Azure Data Explorer. In this flow no prompt is presented, and the application must be registered with Azure AD and equipped with credentials needed to perform application authentication, such as an app key issued by Azure AD, or an X509v2 certificate that has been pre-registered with Azure AD. To set up an application, see [Provision an Azure AD application](../../provision-azure-ad-app.md).

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

---

## On-behalf-of authentication

When your web application or service acts as a mediator between the user or application and Azure Data Explorer, use [on-behalf-of authentication](/azure/active-directory/develop/msal-authentication-flows#on-behalf-of-obo).

In this scenario, an application is sent an Azure AD access token for a resource managed by the application, and the application uses that token to acquire a new Azure AD access token for the Azure Data Explorer resource. Then, the application can access Azure Data Explorer on behalf of the principal indicated by the original Azure AD access token. This flow is called the [OAuth 2.0 on-behalf-of authentication flow](/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). It generally requires multiple configuration steps with Azure AD, and in some cases might require special consent from the administrator of the Azure AD tenant.

First, you need to establish trust relationship between your application and Azure Data Explorer. To do so, follow the steps in [Configure delegated permissions for the application registration](../../provision-azure-ad-app.md#configure-delegated-permissions-for-the-application-registration). Then, perform token exchange in your server code and provide the token to the Kusto client library and execute queries, as shown in the following code sample.

```csharp
var authClient = ConfidentialClientApplicationBuilder.Create("<appId>")
    .WithAuthority($"https://login.microsoftonline.com/<appTenant>")
    .WithClientSecret("<appKey>") // Can be replaced by .WithCertificate to authenticate with an X.509 certificate
    .Build();

var result = authClient.AcquireTokenOnBehalfOf(
    new[] { "https://<clusterName>.<region>.kusto.windows.net/.default" }, // Define scopes for accessing Azure Data Explorer cluster
    new UserAssertion("<userAccessToken>") // Encode the "original" token that will be used for exchange
).ExecuteAsync().Result;
var accessTokenForAdx = result.AccessToken;

var connectionStringBuilder = new KustoConnectionStringBuilder("https://<clusterName>.<region>.kusto.windows.net")
    .WithAadUserTokenAuthentication(accessTokenForAdx);

using var queryClient = KustoClientFactory.CreateCslQueryProvider(connectionStringBuilder);

var queryResult = await queryClient.ExecuteQueryAsync("<databaseName>", "<query>", null);
```

## Web Client (JavaScript) authentication

To set up authentication for a web client, use the [OAuth authorization code flow](/azure/active-directory/develop/msal-authentication-flows#authorization-code).

In this scenario, the app is redirected to sign in to Azure AD. Once signed in, Azure AD redirects back to the app with an authorization code in the URI. Then, the app makes a request to the token endpoint to get the access token. The token is valid for 24 hour during which the client can reuse it by acquiring the token silently.

Use the MSAL.js 2.0 steps in the [SPA app registration](/azure/active-directory/develop/scenario-spa-app-registration) to configure the app. Microsoft Identity Platform has detailed tutorials for different use cases such as [React](/azure/active-directory/develop/single-page-app-tutorial-01-register-app), [Angular](/azure/active-directory/develop/tutorial-v2-angular-auth-code), and [JavaScript](/azure/active-directory/develop/tutorial-v2-javascript-auth-code).

The following code sample uses the MSAl library to sign in a user and access Azure Data Explorer.

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

## Azure AD token cache

With the [Kusto client libraries](../api/client-libraries.md), Azure AD tokens are stored in a local token cache on the user's machine to reduce the number of times they're prompted for credentials. The cache file is **%APPDATA%\Kusto\userTokenCache.data** and can only be accessed by the signed-in user.

## Next steps

* [How to provision an Azure AD application](../../provision-azure-ad-app.md)
* Use the [Kusto client libraries](../api/client-libraries.md) to connect to Azure Data Explorer
