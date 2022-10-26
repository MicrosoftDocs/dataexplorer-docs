---
title: Embed the Azure Data Explorer web UI in an **iframe**.
description: This article describes how to embed the Azure Data Explorer web UI in an **iframe**.
ms.reviewer: gikoifma
ms.topic: reference
ms.date: 09/13/2022
---
# Embed the Azure Data Explorer web UI in an iframe

The Azure Data Explorer web UI can be embedded in an iframe and hosted in third-party websites.

:::image type="content" source="../images/host-web-ux-in-iframe/web-ux.png" alt-text="Screenshot of the Azure Data Explorer web U I.":::

Embedding the Azure Data Explorer web UI in your website enables your users to:

- Edit queries (includes all language features such as colorization and intellisense)
- Explore table schemas visually
- Authenticate to Azure AD
- Execute queries
- Display query execution results
- Create multiple tabs
- Save queries locally
- Share queries by email

All functionality is tested for accessibility and supports dark and light on-screen themes.

## Use Monaco-Kusto or embed the Azure Data Explorer web UI?

Monaco-Kusto offers you an editing experience such as completion, colorization, refactoring, renaming, and go-to-definition. It requires you to build a solution for authentication, query execution, result display, and schema exploration, but offers you full flexibility to fashion the user experience that fits your needs.

Embedding the Azure Data Explorer web UI offers you extensive functionality with little effort, but contains limited flexibility for the user experience. There's a fixed set of query parameters that enable limited control over the system's look and behavior.

## How to embed the Azure Data Explorer web UI in an iframe

### Host the website in an iframe

Add the following code to your website:

```html
<iframe
  src="https://dataexplorer.azure.com/clusters/<cluster>?f-IFrameAuth=true"
></iframe>
```

The `f-IFrameAuth` query parameter tells the Azure Data Explorer web UI *not* to redirect to get an authentication token. This action is necessary, since the hosting website is responsible for providing an authentication token to the embedded iframe.

Replace `<cluster>` with the hostname of the cluster you want to load into the connection pane, such as `help.kusto.windows.net`. By default, iframe-embedded mode doesn't provide a way to add clusters from the UI, since the assumption is that the hosting website is aware of the required cluster.

### Handle authentication

1. When set to 'iframe mode' (`f-IFrameAuth=true`), the Azure Data Explorer web UI won't try to redirect for authentication. The message posting mechanism that browsers use, is used to request and receive a token. During page loading, the following message will be posted to the parent window:

   ```javascript
   window.parent.postMessage(
     {
       signature: "queryExplorer",
       type: "getToken",
       scope: "${Can be either 'query' or a custom scope}",
     },
     "*"
   );
   window.addEventListener(
     "message",
     event => this.handleIncomingMessage(event),
     false
   );
   ```

1. Then, it will listen for a message with the following structure:

   ```json
   {
     "type": "postToken",
     "message": "${the actual authentication token}",
     "scope": "${The scope that was received in the message from the iframe}"
   }
   ```

1. The provided token should be a [JWT token](https://tools.ietf.org/html/rfc7519) obtained from the [Azure AD authentication endpoint](../../management/access-control/how-to-authenticate-with-aad.md#web-client-javascript-authentication-and-authorization).
When generating the token:
     * If the scope isn't query: use the scope from the message above.
     * If the scope is query: use the scope of your service, as described in the [Azure AD authentication endpoint](../../management/access-control/how-to-authenticate-with-aad.md#web-client-javascript-authentication-and-authorization).

  For example, you can calculate the scope as follows:
  
  ```javascript
  const scope = event.data.scope === 'query' ? $"https://{serviceName}.{region}.kusto.windows.net/.default" : event.data.scope;
  ```

> [!IMPORTANT]
> The hosting window must refresh the token before expiration and use the same mechanism to provide the updated token to the application. Otherwise, once the token expires, service calls will fail.

### Embed dashboards (preview)

To embed a dashboard, you'll need to make a few changes to the above steps

1. Change the URL of the iframe:

  1. Add the following code to your website:
  
      ```html
      <iframe
        src="https://dataexplorer.azure.com/dashboards?f-IFrameAuth=true"
      ></iframe>
      ```

1. Establish a trust relationship between your application and the Azure Data Explorer service.

    In addition to the steps in [AAD authentication endpoint](../../management/access-control/how-to-authenticate-with-aad.md#on-behalf-of-authentication), you also need to establish trust relationship between your application and the dashboards service:       
 
    1. Open the [Azure portal](https://portal.azure.com/) and make sure that you're
       signed-in to the correct tenant. Look at the top right corner to verify the identity used to sign into the portal.
    1. In the resources pane, select **Azure Active Directory** > **App registrations**.
    1. Locate the application that uses the on-behalf-of flow and open this application.
    1. Select **Manifest**.
    1. Select **requiredResourceAccess**.
    1. In the manifest, and add the following entry:
    
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
    
    1. Save your changes in the **Manifest**.
    1. Select **API permissions**, and validate you have a new entry: **RTD Metadata Service**.
    1. Open the Azure PowerShell and add the following new service principal for that app:
    
          ```
          New-AzureADServicePrincipal -AppId 35e917a9-4d95-4062-9d97-5781291353b9
          ```
    1. In the **API permissions** page, select **Grant admin consent**.


### Feature flags

The hosting application may want to control certain aspects of the user experience. For example, hide the connection pane, or disable connecting to other clusters.
For this scenario, the web explorer supports feature flags.

A feature flag can be used in the URL as a query parameter. To disable adding other clusters, use https://dataexplorer.azure.com/?f-ShowConnectionButtons=false in the hosting application.

| setting                 | Description                                                                                                        | Default Value |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| f-ShowShareMenu           | Show the share menu item                                                                                           | true          |
| f-ShowConnectionButtons   | Show the **add connection** button to add a new cluster                                                            | true          |
| f-ShowOpenNewWindowButton | Show the **open in web** UI button that opens a new browser window and point to https://dataexplorer.azure.com with the right cluster and database in scope           | false         |
| f-ShowFileMenu            | Show the file menu (**download**, **tab**, **content**, and so on)                                                 | true          |
| f-ShowToS                 | Show **link to the terms of service for Azure Data Explorer** from the settings dialog                             | true          |
| f-ShowPersona             | Show the user name from the settings menu, in the top-right corner                                                 | true          |
| f-IFrameAuth              | If true, the web explorer will expect the iframe to handle authentication and provide a token via a message. This process will always be true for iframe scenarios                                                                                                                                      | false         |
| f-PersistAfterEachRun     | Usually the web explorer will persist in the unload event. When hosting in iframes, it doesn't always fire. This flag will then trigger **persisting local state** after each query run. As a result, any data loss that occurs, will only affect text that had never been run, thus limiting its impact          | false         |
| f-ShowSmoothIngestion     | If true, show the ingestion wizard experience when right-clicking on a database                                   | true          |
| f-RefreshConnection       | If true, always refreshes the schema when loading the page and never depends on local storage                      | false         |
| f-ShowPageHeader          | If true, shows the page header that includes the Azure Data Explorer title and settings                            | true          |
| f-HideConnectionPane      | If true, the left connection pane doesn't display                                                                  | false         |
| f-SkipMonacoFocusOnInit   | Fixes the focus issue when hosting on iframe                                                                       | false         |
| f-Homepage   | Enable the homepage and rerouting new users to it                                                                       | true         |
| f-ShowNavigation   | IF true, shows the navigation pane on the left                                                                   | true         |
| f-DisableDashboardTopBar   | IF true, hides the top bar in the dashboard                                                                  | false         |
| f-DisableNewDashboard   | IF true, hides the option to add a new dashboard                                                               | false         |
| f-DisableNewDashboard   | IF true, hides the option to search in the dashboards list                                                               | false         |
| f-DisableDashboardEditMenu   | IF true, hides the option to edit a dashboard                                                               | false         |
| f-DisableDashboardFileMenu   | IF true, hides the file menu button in a dashboard                                                               | false         |
| f-DisableDashboardShareMenu   | IF true, hides the share menu button in a dashboard                                                               | false         |
| f-DisableDashboardDelete   | IF true, hides the dashboard delete button                                                           | false         |
| f-DisableTileRefresh   | IF true, disables tiles refresh button in a dashboard                                                          | false         |
| f-DisableDashboardAutoRefresh   | IF true, disables tiles auto refresh in a dashboard                                                          | false         |
| f-DisableExploreQuery   | IF true, disables the explore query button of the tiles                                                         | false         |
| f-DisableCrossFiltering   | IF true, disables the cross filtering feature in dashboards                                                         | false         |
| f-HideDashboardParametersBar   | IF true, hides the parameters bar in a dashboard                                                         | false         |



### Feature flag presets

Presets will set a bunch of feature flags at once.
Currently, there's only a single preset.

`IbizaPortal` - Changes the following flags from the defaults.

```json
"f-ShowOpenNewWindowButton": true,
"f-PersistAfterEachRun": true,
"f-IFrameAuth": true,
"f-Homepage": false,
"f-ShowPageHeader": false,
"f-ShowNavigation": false,
```

For embedding dashboards only, without the query area, we recommend setting the following feature flags:
```json
"f-PersistAfterEachRun": true,
"f-IFrameAuth": true,
"f-Homepage": false,
"f-ShowPageHeader": false,
"f-ShowNavigation": false,
"f-DisableExploreQuery": false,
```

> [!WARNING]
> If you use a preset, you won't be able to add additional feature flags on top of it. If you need that flexibility, you should use individual feature flags.
