---
title: Embed the Azure Data Explorer web UI in an **iframe**.
description: Learn how to embed the Azure Data Explorer web UI in an **iframe**.
ms.reviewer: izlisbon
ms.topic: how-to
ms.custom: has-azure-ad-ps-ref, azure-ad-ref-level-one-done
ms.date: 6/6/2023
---
# Embed the Azure Data Explorer web UI in an iframe

The Azure Data Explorer web UI can be embedded in an iframe and hosted in third-party websites. This article describes how to embed the Azure Data Explorer web UI in an iframe.

:::image type="content" source="../media/host-web-ux-in-iframe/web-ux.png" alt-text="Screenshot of the Azure Data Explorer web U I.":::

All functionality is tested for accessibility and supports dark and light on-screen themes.

## How to embed the web UI in an iframe

Add the following code to your website:

```html
<iframe
  src="https://dataexplorer.azure.com/?f-IFrameAuth=true&f-UseMeControl=false&workspace=<guid>"
></iframe>
```

The `f-IFrameAuth` query parameter tells the web UI *not* to redirect to get an authentication token and the `f-UseMeControl=false` parameter tells the web UI *not* to show the user account information pop-up window. These actions are necessary since the hosting website is responsible for authentication.

The `workspace=<guid>` query parameter creates a separate workspace for the embedded iframe. Workspace is a logic unit that contains tabs, queries, settings and connections. By setting it to a unique value, it prevents data sharing between the embedded and the non-embedded version of `https://dataexplorer.azure.com`.

### Handle authentication

When embedding the web UI, the hosting page is responsible for authentication. The following diagrams describe the authentication flow.

:::image type="content" source="../media/host-web-ux-in-iframe/adx-embed-sequence-diagram.png" lightbox="../media/host-web-ux-in-iframe/adx-embed-sequence-diagram.png" alt-text="Diagram that shows the authentication flow for an embedded web U I iframe.":::

:::image type="content" source="../media/host-web-ux-in-iframe/adx-embed-scopes.png" lightbox="../media/host-web-ux-in-iframe/adx-embed-scopes.png" alt-text="Diagram that shows the scopes required for embedding the web U I iframe.":::

Use the following steps to handle authentication:

1. In your application, listen for the **getToken** message.

    ```javascript
    window.addEventListener('message', (event) => {
       if (event.data.signature === "queryExplorer" && event.data.type === "getToken") {
         // CODE-1: Replace this placeholder with code to get the access token from Microsoft Entra ID and
         //         then post a "postToken" message with an access token and an event.data.scope
       }
    })    
   ```

1. Define a function to map the `event.data.scope` to Microsoft Entra scope. Use the following table to decide how to map `event.data.scope` to Microsoft Entra scopes:

    | Resource         | event.data.scope                                            | Microsoft Entra scope                                                    |
    | ---------------- | ----------------------------------------------------------- | -----------------------------------------------------------       |
    | Cluster          | `query`                                                     | `https://{your_cluster}.{your_region}.kusto.windows.net/.default` |
    | Graph            | `People.Read`                                               | `People.Read`, `User.ReadBasic.All`, `Group.Read.All`             |
    | Dashboards       | `https://rtd-metadata.azurewebsites.net/user_impersonation` | `https://rtd-metadata.azurewebsites.net/user_impersonation`       |
  
    For example, the following function maps scopes based on the information in the table.

    ```javascript
        function mapScope(scope) {
            switch(scope) {
                case "query": return ["https://your_cluster.your_region.kusto.windows.net/.default"];
                case "People.Read": return ["People.Read", "User.ReadBasic.All", "Group.Read.All"];
                default: return [scope]
            }
        }
    ```

1. Get a [JWT access token](https://tools.ietf.org/html/rfc7519) from the [Microsoft Entra authentication endpoint](../../management/access-control/how-to-authenticate-with-aad.md#web-client-javascript-authentication-and-authorization) for the scope. This code replaces placeholder CODE-1.

    For example, you can use @azure/MSAL-react to get the access token. The example uses the **mapScope** function you defined earlier.

    ```javascript
    import { useMsal } from "@azure/msal-react";
    const { instance, accounts } = useMsal();

    instance.acquireTokenSilent({
      scopes: mapScope(event.data.scope),
      account: accounts[0],
    })
    .then((response) =>
        var accessToken = response.accessToken
        // - CODE-2: Replace this placeholder with code to post a "postToken" message with an access token and an event.data.scope
    )
    ```

    > [!IMPORTANT]
    > You can only use User Principal Name (UPN) for authentication, service principals are not supported.

1. Post a **postToken** message with the access token. This code replaces placeholder CODE-2:

   ```javascript
        iframeWindow.postMessage({
            "type": "postToken",
            "message": // the access token your obtained earlier
            "scope": // event.data.scope as passed to the "getToken" message
        }, '*');
      }
    ```

    > [!IMPORTANT]
    > The hosting window must refresh the token before expiration by sending a new **postToken** message with updated tokens. Otherwise, once the tokens expire, service calls will fail.

> [!TIP]
> In our sample project, you can view an [application](https://github.com/Azure/azure-kusto-webexplorer-embedding/blob/main/src/app.js) that uses authentication.

### Embed dashboards

To embed a dashboard, a trust relationship must be established between the host's Microsoft Entra app and the Azure Data Explorer dashboard service (**RTD Metadata Service**).

1. Follow the steps in [Web Client (JavaScript) authentication and authorization](../../management/access-control/how-to-authenticate-with-aad.md#on-behalf-of-authentication#web-client-javascript-authentication-and-authorization).
1. Open the [Azure portal](https://portal.azure.com/) and make sure that you're signed into the correct tenant. In the top-right corner, verify the identity used to sign into the portal.
1. In the resources pane, select **Microsoft Entra ID** > **App registrations**.
1. Locate the app that uses the **on-behalf-of** flow and open it.
1. Select **Manifest**.
1. Select **requiredResourceAccess**.
1. In the manifest, add the following entry:

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

    - `35e917a9-4d95-4062-9d97-5781291353b9` is the application ID of Azure Data Explorer dashboard service.  
    - `388e2b3a-fdb8-4f0b-ae3e-0692ca9efc1c` is the user_impersonation permission.

1. In the **Manifest**, save your changes.
1. Select **API permissions** and validate you have a new entry: **RTD Metadata Service**.
1. Under Microsoft Graph, add permissions for `People.Read`, `User.ReadBasic.All`, and `Group.Read.All`.
1. In Azure PowerShell, add the following new service principal for the app:

    ```powershell
    New-MgServicePrincipal -AppId 35e917a9-4d95-4062-9d97-5781291353b9
    ```


    If you encounter the `Request_MultipleObjectsWithSameKeyValue` error, it means that the app is already in the tenant indicating it was added successfully.

1. In the **API permissions** page, select **Grant admin consent** to consent for all users.

> [!NOTE]
> To embed a dashboard without the query area, use the following setup:
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

A feature flag can be used in the URL as a query parameter. To disable adding other clusters, use <https://dataexplorer.azure.com/?f-ShowConnectionButtons=false> in the hosting app.

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
| f-PersistAfterEachRun | Usually, browsers persist in the unload event. However, the unload event isn't always triggered when hosting in an iframe. This flag triggers the **persisting local state** event after each query run. This limits any data loss that may occur, to only affect new query text that has never run. | false |
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

## Related content

- [Kusto Query Language (KQL) overview](../../query/index.md)
- [Write Kusto queries](/azure/data-explorer/kusto/query/tutorials/learn-common-operators)
- [Embedding sample](https://github.com/Azure/azure-kusto-webexplorer-embedding)
