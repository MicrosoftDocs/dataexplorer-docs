---
title: Embed web UX in an iframe - Azure Data Explorer | Microsoft Docs
description: This article describes Embed web UX in an iframe in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/04/2019
---
# Embed web UX in an iframe
## Overview
The Azure Data Explorer web UX can be embedded in an iframe and hosted in 3rd party websites.
![alt text](../images/web-ux.jpg "Azure Data Explorer web UX")

Embedding the web UX in your website enables your users do the following:
1. edit queries (including all language feature such as colorization, intellisense ETC)
1. explore table schemas visually
1. authenticate to AAD
1. execute queries
1. display query execution results
1. create multiple tabs
1. save queries locally and share them in email

all funcitonality is tested for accessibility and supports dark and light theme.

## When Should I use monaco-kusto and when should i embed the web UX?
When you use monaco-kusto you get an editing eperience (i.e completion, colorization, refactorings, renames, go-to-definition ETC), but you need to build everything around it (authentication, query execution, display the results, explore schema, ETC). On the other hand, you get full flexibility to fashion a user experinece as fits your needs.

When you embed the Azure Data Explorer web experience, you get all the aformentioned functionality (in the overview section) with no effort, but you have more limited flexibility regarding the way the UX behaves and looks. You are basically limited by a fixed set of query parameters we provisioned to give more control on the looks and behavior of the system

## How to embed the web UX in an iframe
### Step 1: host the website in iframe
Add the following code to your website

```html    
<iframe src="https://dataexplorer.azure.com/?ibizaPortal=true"></iframe>
```
the `ibizaPortal` query parameter tells the data explorer UX _not_ to redierect to get an auth token. This is necessary since the hosting website will be responsible for providing an authentication token to the embedded iframe.


### Step 2: Handle Authentication
when set to 'iframe mode' (`ibizaPortal=true`), The web UX won't try to redirect for authentication. 

Instead it will  use the message posting mechanism browsers have to request and receive a token.

On page load it will post the following message to the parent window:

```javascript
window.parent.postMessage(
    {
        signature: 'queryExplorer',
        type: 'getToken'
    }, 
    '*');
window.addEventListener('message', event => this.handleIncomingMessage(event), false);
```

It will then listen for a message with the following structure:
```json
{
    "type": "postToken",
    "message": "${the actual authentication token}"
}
```

The provided token should be a [JWT token](https://tools.ietf.org/html/rfc7519) obtained from the AAD authentication endpoint as per the [following doucmentation](../../management/access-control/how-to-authenticate-with-aad.md#web-client-javascript-authentication-and-authorization).

> [!IMPORTANT] It is the responsibility of the hosting window to refresh the token before expiration and use the same mechanism to provide the updated token to the application. Otherwise once the token expires, service calls will always fail.