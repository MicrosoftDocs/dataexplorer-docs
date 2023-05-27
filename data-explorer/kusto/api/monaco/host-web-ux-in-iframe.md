---
title: Embed the Azure Data Explorer web UI in an **iframe**.
description: Learn how to embed the Azure Data Explorer web UI in an **iframe**.
ms.reviewer: izlisbon
ms.topic: how-to
ms.date: 11/22/2022
---
# Embed the Azure Data Explorer web UI in an iframe

The Azure Data Explorer web UI can be embedded in an iframe and hosted in third-party websites. This article describes how to embed the Azure Data Explorer web UI in an iframe.

:::image type="content" source="../images/host-web-ux-in-iframe/web-ux.png" alt-text="Screenshot of the Azure Data Explorer web U I.":::

All functionality is tested for accessibility and supports dark and light on-screen themes.

## How to embed the web UI in an iframe

Add the following code to your website:

```html
<iframe
  src="https://dataexplorer.azure.com/?f-IFrameAuth=true&f-UseMeControl=false&workapce=<guid>"
></iframe>
```

The `f-IFrameAuth` query parameter tells the Azure Data Explorer web UI *not* to redirect to get an authentication token and the `f-UseMeControl=false` query parameter tells the Azure Data Explorer web UI *not* to show the user account information UX. These actions are necessary, since the hosting website is responsible for authentication.

The `workspace=<guid>` query parameter creates a separate workspace for the embedded iframe, to avoid data sharing with the nonembedded version of <https://dataexplorer.azure.com>.

### Handle authentication

When embedding the ADX web UI the hosting page is responsible for authentication. The below diagrams describes the auth flow.

:::image type="content" source="../images/host-web-ux-in-iframe/adx-embed-sequencediagram.png" alt-text="Sequence diagram for authentication in an embedded ADX iframe":::

:::image type="content" source="../images/host-web-ux-in-iframe/adx-embed-scopes.png" alt-text="Scopes required for embedding ADX iframe":::

Follow those steps to handle authentication:

1. Listen for "getToken" message:

    ```javascript
    window.addEventListener('message', (event) => {
       if (event.data.type === "getToken") {
         // - Get access token From Azure AD
         // - post a "postToken" message with an access token and event.data.scope
       }
    })    
   ```

2. Get access token From Azure AD

    Obtain a [JWT token](https://tools.ietf.org/html/rfc7519) from [Microsoft Azure Active Directory (Azure AD) authentication endpoint](../../management/access-control/how-to-authenticate-with-aad.md#web-client-javascript-authentication-and-authorization).  
      Use this table to decide how to map `event.data.scope` the Azure AD scopes:

      | resource         | event.data.scope                                            | Azure AD Scopes                                             |
      | ---------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
      | ADX Cluster      | `query`                                                     | `https://{serviceName}.{region}.kusto.windows.net/.default` |
      | Graph            | `People.Read`                                               | `People.Read`, `User.ReadBasic.All`, `Group.Read.All`       |
      | ADX Dashboards   | `https://rtd-metadata.azurewebsites.net/user_impersonation` | `https://rtd-metadata.azurewebsites.net/user_impersonation` |
  
    For example,

    ```typescript
        function mapScope(scope: string): string {
            switch(scope){   
                case "query": return ["https://kwedemo.westus.kusto.windows.net/.default"];
                case "People.Read": return ["People.Read", "User.ReadBasic.All", "Group.Read.All"];
                default: return [scope]  
        }
        var aadScopes = mapScope(event.data.scope);
    ```

    > [!IMPORTANT]
    > Service principals are not supported, only user authentication.

3. Post a "postToken" message with the access token:

   ```javascript
        iframeWindow.postMessage({
            "type": "postToken",
            "message": // accessToken from Azure AD,
            "scope": // scope as passed in the "getToken" message
        }, '*');
      }
    ```

> [!IMPORTANT]
> The hosting window must refresh the token before expiration by sending a new "postToken" message with updated tokens. Otherwise, once the tokens expire, service calls will fail.

### Embedding dashboards

To embed a dashboard, a trust relationship needs to be established between the Host's Azure AD App and Azure Data Explorer Dashboard Service Azure AD app (a.k.a RTD Metadata Service).

1. Follow the steps in [Web Client (JavaScript) authentication and authorization](../../management/access-control/how-to-authenticate-with-aad.md#on-behalf-of-authentication#web-client-javascript-authentication-and-authorization).
2. Open the [Azure portal](https://portal.azure.com/) and make sure that you're signed-in to the correct tenant. Look at the top right corner to verify the identity used to sign into the portal.
3. In the resources pane, select **Azure Active Directory** > **App registrations**.
4. Locate the app that uses the on-behalf-of flow and open this app.
5. Select **Manifest**.
6. Select **requiredResourceAccess**.
7. In the manifest, and add the following entry:

    ```json
      {
        "resourceAppId": "35e917a9-4d95-4062-9d97-5781291353b9",
        "resourceAccess": [
            {
                "id": "388e2b3a-fdb8-4f0b-ae3e-0692ca9efc1c",
                "type": "Scope"
            }
        ]
      }
    ```

    - `35e917a9-4d95-4062-9d97-5781291353b9` is the application ID of ADX Dashboard Service.  
    - `388e2b3a-fdb8-4f0b-ae3e-0692ca9efc1c` is the user_impersonation permission.

8. Save your changes in the **Manifest**.
9. Select **API permissions**, and validate you have a new entry: **RTD Metadata Service**.
10. Add permissions `People.Read`, `User.ReadBasic.All` and `Group.Read.All` under Microsoft Graph.
11. Open the Azure PowerShell and add the following new service principal for that app:

    ```powershell
    New-AzureADServicePrincipal -AppId 35e917a9-4d95-4062-9d97-5781291353b9
    ```

    If you encounter `Request_MultipleObjectsWithSameKeyValue` error, it means the app is already in the tenant, which can be seen as success.

12. To consent for all users, In the **API permissions** page, select **Grant admin consent**.

> [!NOTE]
> For embedding dashboards only, without the query area, use this setup:
>
> ```html
>  <iframe src="https://dataexplorer.azure.com/dashboards?[feature-flags]" />
> ```
>
> where `[feature-flags]` is:
>
> ```html
> "f-IFrameAuth": true,
> "f-PersistAfterEachRun": true,
> "f-Homepage": false,
> "f-ShowPageHeader": false,
> "f-ShowNavigation": false,
> "f-DisableExploreQuery": false,
> ```

### Feature flags

> [!IMPORTANT]
> The `f-IFrameAuth=true` flag is required for the iframe to work. The other flags are optional.

The hosting app may want to control certain aspects of the user experience. For example, hide the connection pane, or disable connecting to other clusters.
For this scenario, the web explorer supports feature flags.

A feature flag can be used in the URL as a query parameter. To disable adding other clusters, use https://dataexplorer.azure.com/?f-ShowConnectionButtons=false in the hosting app.

| setting | Description | Default Value |
|---|---|---|
| f-ShowShareMenu | Show the share menu item | true |
| f-ShowConnectionButtons | Show the **add connection** button to add a new cluster | true |
| f-ShowOpenNewWindowButton | Show the **open in web** UI button that opens a new browser window and point to https://dataexplorer.azure.com with the right cluster and database in scope | false |
| f-ShowFileMenu | Show the file menu (**download**, **tab**, **content**, and so on) | true |
| f-ShowToS | Show **link to the terms of service for Azure Data Explorer** from the settings dialog | true |
| f-ShowPersona | Show the user name from the settings menu, in the top-right corner. | true |
| f-UseMeControl | Show the user's account information | true |
| f-IFrameAuth | If true, the web explorer expects the iframe to handle authentication and provide a token via a message. This parameter is required for iframe scenarios. | false |
| f-PersistAfterEachRun | Usually, browsers persist in the unload event. However, the unload event isn't always triggered when hosting in an iframe. This flag will then trigger **persisting local state** after each query run. As a result, any data loss that occurs, will only affect text that had never been run, thus limiting its impact | false |
| f-ShowSmoothIngestion | If true, show the ingestion wizard experience when right-clicking on a database | true |
| f-RefreshConnection | If true, always refreshes the schema when loading the page and never depends on local storage | false |
| f-ShowPageHeader | If true, shows the page header that includes the Azure Data Explorer title and settings | true |
| f-HideConnectionPane | If true, the left connection pane doesn't display | false |
| f-SkipMonacoFocusOnInit | Fixes the focus issue when hosting on iframe | false |
| f-Homepage | Enable the homepage and rerouting new users to it | true |
| f-ShowNavigation | IF true, shows the navigation pane on the left | true |
| f-DisableDashboardTopBar | IF true, hides the top bar in the dashboard | false |
| f-DisableNewDashboard | IF true, hides the option to add a new dashboard | false |
| f-DisableNewDashboard | IF true, hides the option to search in the dashboards list | false |
| f-DisableDashboardEditMenu | IF true, hides the option to edit a dashboard | false |
| f-DisableDashboardFileMenu | IF true, hides the file menu button in a dashboard | false |
| f-DisableDashboardShareMenu | IF true, hides the share menu button in a dashboard | false |
| f-DisableDashboardDelete | IF true, hides the dashboard delete button | false |
| f-DisableTileRefresh | IF true, disables tiles refresh button in a dashboard | false |
| f-DisableDashboardAutoRefresh | IF true, disables tiles auto refresh in a dashboard | false |
| f-DisableExploreQuery | IF true, disables the explore query button of the tiles | false |
| f-DisableCrossFiltering | IF true, disables the cross filtering feature in dashboards | false |
| f-HideDashboardParametersBar | IF true, hides the parameters bar in a dashboard | false |

## Next steps

- [Kusto Query Language (KQL) overview](../../query/index.md)
- [Write Kusto queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
- [Non official GitHub example](https://github.com/izikl/kwe-embed-example)