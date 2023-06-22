---
title:  Azure Active Directory authentication
description: This article describes Azure Active Directory authentication in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/21/2023
---
# Authenticate with Azure Active Directory

[Azure Active Directory (Azure AD)](/azure/active-directory/fundamentals/active-directory-whatis) is a cloud-based identity and access management service that can authenticate security principals and federate with other identity providers. Azure AD is the only method of authentication to Azure Data Explorer.

To authenticate with Azure AD, the client must communicate with the Azure AD service and request an access token specific to Azure Data Explorer. Then, the client can use the acquired access token as proof of identity when issuing requests to Azure Data Explorer.

The main types of authentication scenarios are as follows:

* [User authentication](index.md#user-authentication): Verifies the identity of human users through interactive prompts that prompt the user for their credentials or programmatically via a token.

* [Application authentication](index.md#application-authentication): Verifies the identity of an application that needs to access resources without human intervention by using configured credentials.  

* [On-behalf-of authentication](#on-behalf-of-authentication): Allows an application to obtain an Azure AD access token from another application and use it to access Azure Data Explorer.

> [!IMPORTANT]
> We recommend using the Kusto [client libraries](../api/client-libraries.md) for user and application authentication, which simplify the authentication process. However, for on-behalf-of authentication, follow the process described in the [On-behalf-of authentication](#on-behalf-of-authentication) section.

## Microsoft Authentication Library (MSAL)

To authenticate with Azure Data Explorer, the Kusto client libraries use [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) to acquire Azure AD tokens. We recommend using these libraries for user and application authentication, as they simplify the process. When using the client libraries, the authentication properties are configured through the [Kusto connection string](../api/connection-strings/kusto.md).

> [!NOTE]
> With Kusto [client libraries](../api/client-libraries.md), Azure AD tokens are stored in a local token cache on the user's machine to reduce the number of times they're prompted for credentials. The cache file is **%APPDATA%\Kusto\userTokenCache.data** and can only be accessed by the signed-in user.

During the token acquisition process, the client must provide the following information:

* The [resource](#how-to-specify-the-resource) or cluster URI.
* The [Azure AD tenant ID](#how-to-specify-the-azure-ad-tenant-id)
* The [Azure AD authority URI](#how-to-specify-the-azure-ad-authority-uri).
* The Azure AD client application ID.
* For application authentication: the Azure AD client application credential, which is a secret or certificate.
* For user authentication: the Azure AD client application `ReplyUrl`, or the URL to which Azure AD redirects after authentication completes successfully. MSAL extracts the authorization code from this redirect.

If you can't use the client libraries, you can manually implement an authentication flow using MSAL.

## Implement an authentication flow with MSAL

In this section, learn how to create an authentication flow to Azure Data Explorer using MSAL. For more information on MSAL authentication flows, see [Authentication flow support in MSAL](active-directory/develop/msal-authentication-flows).

### How to specify the resource

The client must specify the resource ID for which the Azure AD token should be issued, which for an Azure Data Explorer endpoint is the cluster URI without port information and path.

**Example**: The resource ID for the `help` cluster is `https://help.kusto.windows.net`.

### How to specify the Azure AD tenant ID

Azure AD is a multi-tenant service, and every organization can create an object called directory in Azure AD. The directory object holds security-related objects such as user accounts, applications, and groups. Azure AD often refers to the directory as a tenant. Azure AD tenants are identified by a GUID, or the tenant ID. In many cases, the domain name of the organization can identity the Azure AD tenant.

**Example**: An organization "Contoso" might have the tenant ID `12345678-a123-4567-b890-123a456b789c` and the domain name `contoso.com`.

### How to specify the Azure AD authority URI

The Azure AD authority URI is the endpoint used for authentication. The Azure AD directory, or tenant, determines the Azure AD authority URI.

If you know the principal's Azure AD directory, use `https://login.microsoftonline.com/{tenantId}` as the Azure AD authority URI where `{tenantId}` is either the tenant ID or domain name. If you don't know the principal's directory, then use the "common" Azure AD authority by replacing `{tenantId}` with `common`.

> [!NOTE]
> The Azure AD service endpoint changes in national clouds. When working with an Azure Data Explorer
> service deployed in a national cloud, set the corresponding national cloud Azure AD service endpoint.

## User and application authentication

The following examples use MSAL to authenticate to Azure Data Explorer. Select the tab relevant for the required type of authentication.

### [User authentication](#tabs/user-auth)

The following examples uses MSAL to get an Azure AD user token to access Azure Data Explorer in a way that launches the interactive sign-in UI:

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

### [Application authentication](#tabs/app-auth)

The following example uses MSAL to get an Azure AD application token to access Azure Data Explorer. In this flow no prompt is presented, and the application must be registered with Azure AD and equipped with credentials needed to perform application authentication, such as an app key issued by Azure AD, or an X509v2 certificate that has been pre-registered with Azure AD.

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

---

## On-behalf-of authentication

[On-behalf-of authentication](/azure/active-directory/develop/msal-authentication-flows#on-behalf-of-obo) is relevant when you have a web application or service that acts as a mediator between the user or application and Azure Data Explorer.

In this scenario, an application is sent an Azure AD access token for an arbitrary resource managed by the application, and the application uses that token to acquire a new Azure AD access token for the Azure Data Explorer resource. Then, the application can access Azure Data Explorer on behalf of the principal indicated by the original Azure AD access token.

This flow is called the [OAuth 2.0 on-behalf-of authentication flow](/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow). It generally requires multiple configuration steps with Azure AD, and in some cases might require special consent from the administrator of the Azure AD tenant. The following sections describe the steps of the flow.

**Step 1: Establish trust relationship between your application and Azure Data Explorer**

1. Open the [Azure portal](https://portal.azure.com/) and make sure that you're
   signed-in to the correct tenant.
2. On the resources pane, select **Azure Active Directory** and then **App registrations**.
3. Locate the application that uses the on-behalf-of flow and open it.
4. Select **API permissions**, then **Add a permission**.
5. Search for the application named **Azure Data Explorer** and select it.
6. Select **user_impersonation**.
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

**Step 3: Provide the token to the Kusto client library and execute queries**

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

To set up authentication for a web client, you need to [provision an Azure AD application](../../provision-azure-ad-app.md) and enable the single-page application (SPA) setting on the application. The SPA setting enables the [OAuth authorization code flow](/azure/active-directory/develop/msal-authentication-flows#authorization-code) to obtain tokens used by [MSAL.js 2.0](https://www.npmjs.com/package/@azure/msal-browser). To configure the app, follow the steps in the [SPA app registration scenario](/azure/active-directory/develop/scenario-spa-app-registration).

In this scenario, the app is redirected to sign in to Azure AD. Once signed in, Azure AD redirects back to the app with an authorization code in the URI. Then, the app makes a request to the token endpoint to get the access token. The token is valid for 24 hour during which the client can reuse it by acquiring the token silently.

MSAL.js 2.0 has detailed sample apps for different frameworks such as React and Angular. For an example of how to use MSAL.js 2.0 to authenticate to an Azure Data Explorer cluster using a React application, see the [MSAL.js 2.0 React sample](https://github.com/Azure-Samples/ms-identity-javascript-react-spa). For other frameworks, check the MSAL.js 2.0 documentation.

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

## Next steps

* [How to provision an Azure AD application](../../provision-azure-ad-app.md)
* Use the [client libraries](../api/client-libraries.md) to connect to Azure Data Explorer
