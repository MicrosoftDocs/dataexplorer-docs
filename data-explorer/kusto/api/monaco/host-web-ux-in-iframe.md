---
title: Embed Web UI in an iframe - Azure Data Explorer | Microsoft Docs
description: This article describes Embed Web UI in an iframe in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/19/2020
---
# Embed Web UI in an iframe

The Azure Data Explorer Web UI can be embedded in an iframe and hosted in third party websites.

![alt text](../images/web-ux.jpg "Azure Data Explorer Web UI")

Embedding the Azure Data Explorer Web UX in your website enables your users to do the following:

- Edit queries (includes all language features such as colorization and intellisense)
- Explore table schemas visually
- Authenticate to AAD
- Execute queries
- Display query execution results
- Create multiple tabs
- Save queries locally
- Share queries by email

All functionality is tested for accessibility and supports dark and light theme.

## Use Monaco-Kusto or embed the Web UI?

Monaco-Kusto offers you an editing experience such as completion, colorization, refactoring, renaming, and go-to-definition, it requires you to build a solution for authentication, query execution, result display, and schema exploration around it. On the other hand, you get full flexibility to fashion the user experience that fits your needs.

Embedding the Azure Data Explorer Web UI, offers you extensive functionality with little effort, but contains limited flexibility regarding the user experience. There are a fixed set of query parameters that allow limited control on the look and behavior of the system.

## How to embed the Web UI in an iframe

### Host the website in iframe

Add the following code to your website:

```html
<iframe
  src="https://dataexplorer.azure.com/clusters/<cluster>?ibizaPortal=true"
></iframe>
```

The `ibizaPortal` query parameter tells the Azure Data Explorer Web UI _not_ to redirect to get an authentication token. This is necessary since the hosting website is responsible for providing an authentication token to the embedded iframe.

Replace `<cluster>` with the hostname of the cluster you want to load into the connection pane (for `example: help.kusto.windows.net`). By default, iframe-embedded mode doesn't provide a way to add clusters from the UI, since the assumption is that the hosting website is aware of the required cluster.

### Handle authentication

1. When set to 'iframe mode' (`ibizaPortal=true`), The Azure Data Explorer Web UI won't try to redirect for authentication. The Web UI will use the message posting mechanism that browsers use to request and receive a token. During page loading, the following message will be posted to the parent window:

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
> It is the responsibility of the hosting window to refresh the token before expiration and use the same mechanism to provide the updated token to the application. Otherwise, once the token expires, service calls will always fail.

### Feature flags

The hosting application may want to contorl certain aspects of the user experience. For example - hide the connection pane, or disable connecting to other cluster.
For this scenario the web explorer supports feature flags.

A feature flag can be used in the url as a query parameter. For example, if the hosting application wishes to disable adding other cluster they should use https://dataexplorer.azure.com/?ShowConnectionButtons=false

| setting                 | Description                                                                                                                                                                                                                                                                                       | Default Value |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| ShowShareMenu           | Show the share menu item                                                                                                                                                                                                                                                                          | true          |
| ShowConnectionButtons   | Show the add connection button to add a new cluster                                                                                                                                                                                                                                               | true          |
| ShowOpenNewWindowButton | Show "open in web UI button. this will open a new browser window that will point to https://dataexplorer.azure.com with the right cluster and database in scope                                                                                                                                   | false         |
| ShowFileMenu            | Show the file menu (download tab content ETC)                                                                                                                                                                                                                                                     | true          |
| ShowToS                 | Show link to the terms of service for azure data explorer from the settings dialog                                                                                                                                                                                                                | true          |
| ShowPersona             | show the user name in the top right and from settings menu                                                                                                                                                                                                                                        | true          |
| IFrameAuth              | If true, web explorer will expect the iframe to handle authentication and provide a token via message. This will always be true for iframe scenarios                                                                                                                                              | false         |
| PersistAfterEachRun     | Usually the web explorer will persist in the onunload event. when hosting in iframes, it does not fire in some cases. thus, this flag will trigger persiting local state after each query run. Thus any data loss that occurs will only effect text that had never been run thus limiting impact. | false         |
| ShowSmoothIngestion     | If true, show the 1-click ingestion experience when right clicking on a database                                                                                                                                                                                                                  | true          |
| RefreshConnection       | If true, always refreshs the schema when loading the page and never depends on local storage                                                                                                                                                                                                      | false         |
| ShowPageHeader          | If true, shows the page header (which includes the Azure Data Explorer title, settings and other)                                                                                                                                                                                                 | true          |
| HideConnectionPane      | If true, does not display the left connection pane                                                                                                                                                                                                                                                | false         |
| SkipMonacoFocusOnInit   | Fixes focus issue when hosting on iframe                                                                                                                                                                                                                                                          | false         |

### Feature flag presets

presets will set a bunch of feature flags at once.
Today we have a single preset.

`IbizaPortal` - Changes the following flags from the deafults:

```json
ShowOpenNewWindowButton: true,
PersistAfterEachRun: true,
IFrameAuth: true,
ShowPageHeader: false,                                 |
```

> [!WARNING]
> If you use a preset you won't be able to add additional feature flags on top of it. If you need that flexibility you should use individual feature flags.