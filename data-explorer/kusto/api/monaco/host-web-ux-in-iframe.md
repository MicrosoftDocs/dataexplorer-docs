---
title: Embed Web UI in an **iframe** - Azure Data Explorer
description: This article describes Embed Web UI in an **iframe** in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/19/2020
---
# Embed Web UI in an iframe

The Azure Data Explorer Web UI can be embedded in an iframe and hosted in third-party websites.
 
:::image type="content" source="../images/host-web-ux-in-iframe/web-ux.png" alt-text="Azure Data Explorer Web UI":::

Embedding the Azure Data Explorer Web UX in your website enables your users to:

- Edit queries (includes all language features such as colorization and intellisense)
- Explore table schemas visually
- Authenticate to Azure AD
- Execute queries
- Display query execution results
- Create multiple tabs
- Save queries locally
- Share queries by email

All functionality is tested for accessibility and supports dark and light on-screen themes.

## Use Monaco-Kusto or embed the Web UI?

Monaco-Kusto offers you an editing experience such as completion, colorization, refactoring, renaming, and go-to-definition. It requires you to build a solution for authentication, query execution, result display, and schema exploration, but offers you  full flexibility to fashion the user experience that fits your needs.

Embedding the Azure Data Explorer Web UI offers you extensive functionality with little effort, but contains limited flexibility for the user experience. There's a fixed set of query parameters that enable limited control over the system's look and behavior.

## How to embed the Web UI in an iframe

### Host the website in an iframe

Add the following code to your website:

```html
<iframe
  src="https://dataexplorer.azure.com/clusters/<cluster>?ibizaPortal=true"
></iframe>
```

The `ibizaPortal` query parameter tells the Azure Data Explorer Web UI *not* to redirect to get an authentication token. This action is necessary, since the hosting website is responsible for providing an authentication token to the embedded iframe.

Replace `<cluster>` with the hostname of the cluster you want to load into the connection pane, such as `help.kusto.windows.net`. By default, iframe-embedded mode doesn't provide a way to add clusters from the UI, since the assumption is that the hosting website is aware of the required cluster.

### Handle authentication

1. When set to 'iframe mode' (`ibizaPortal=true`), The Azure Data Explorer Web UI won't try to redirect for authentication. The Web UI will use the message posting mechanism that browsers use, to request and receive a token. During page loading, the following message will be posted to the parent window:

   ```javascript
   window.parent.postMessage(
     {
       signature: "queryExplorer",
       type: "getToken"
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
     "message": "${the actual authentication token}"
   }
   ```

1. The provided token should be a [JWT token](https://tools.ietf.org/html/rfc7519) obtained from the [[AAD authentication endpoint]](../../management/access-control/how-to-authenticate-with-aad.md#web-client-javascript-authentication-and-authorization).

> [!IMPORTANT]
> The hosting window must refresh the token before expiration and use the same mechanism to provide the updated token to the application. Otherwise, once the token expires, service calls will fail.

### Feature flags

The hosting application may want to control certain aspects of the user experience. For example, hide the connection pane, or disable connecting to other clusters.
For this scenario, the web explorer supports feature flags.

A feature flag can be used in the url as a query parameter. If the hosting application wants to disable adding other clusters, it should use https://dataexplorer.azure.com/?ShowConnectionButtons=false

| setting                 | Description                                                                                                        | Default Value |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| ShowShareMenu           | Show the share menu item                                                                                           | true          |
| ShowConnectionButtons   | Show the **add connection** button to add a new cluster                                                            | true          |
| ShowOpenNewWindowButton | Show the **open in web** UI button, that opens a new browser window and point to https://dataexplorer.azure.com with the right cluster and database in scope           | false         |
| ShowFileMenu            | Show the file menu (**download**, **tab**, **content**, and so on)                                                 | true          |
| ShowToS                 | Show **link to the terms of service for Azure Data Explorer** from the settings dialog                             | true          |
| ShowPersona             | Show the user name from the settings menu, in the top-right corner                                                 | true          |
| IFrameAuth              | If true, the web explorer will expect the iframe to handle authentication and provide a token via a message. This process will always be true for iframe scenarios                                                                                                                                      | false         |
| PersistAfterEachRun     | Usually the web explorer will persist in the unload event. When hosting in iframes, it doesn't always fire. This flag will then trigger **persisting local state** after each query run. As a result, any data loss that occurs, will only affect text that had never been run, thus limiting its impact          | false         |
| ShowSmoothIngestion     | If true, show the 1-click ingestion experience when right-clicking on a database                                   | true          |
| RefreshConnection       | If true, always refreshes the schema when loading the page and never depends on local storage                      | false         |
| ShowPageHeader          | If true, shows the page header that includes the Azure Data Explorer title and settings                            | true          |
| HideConnectionPane      | If true, the left connection pane doesn't display                                                                  | false         |
| SkipMonacoFocusOnInit   | Fixes the focus issue when hosting on iframe                                                                       | false         |

### Feature flag presets

Presets will set a bunch of feature flags at once.
Currently, there's only a single preset.

`IbizaPortal` - Changes the following flags from the defaults.

```json
ShowOpenNewWindowButton: true,
PersistAfterEachRun: true,
IFrameAuth: true,
ShowPageHeader: false,                                 |
```

> [!WARNING]
> If you use a preset, you won't be able to add additional feature flags on top of it. If you need that flexibility, you should use individual feature flags.
