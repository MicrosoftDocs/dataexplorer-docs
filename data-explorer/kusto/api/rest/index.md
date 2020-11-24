---
title: Azure Data Explorer REST API - Azure Data Explorer
description: This article describes Azure Data Explorer REST API in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 05/29/2019
---
# Azure Data Explorer REST API

This article describes how to interact with Azure Data Explorer over HTTPS.

## Supported actions

The list of actions supported by an endpoint differs according to whether the
endpoint is an engine endpoint or a data management endpoint.

|Action         |HTTP verb   |URI template           |Engine|Data Management|Authentication |
|---------------|------------|-----------------------|------|---------------|---------------|
|Query          |GET or POST |/v1/rest/query         |Yes   |No             |Yes            |
|Query          |GET or POST |/v2/rest/query         |Yes   |No             |Yes            |
|Management     |POST        |/v1/rest/mgmt          |Yes   |Yes            |Yes            |
|UI             |GET         |/                      |Yes   |No             |No             |
|UI             |GET         |/{dbname}              |Yes   |No             |No             |

Where *Action* represents a group of related activities

* The Query action sends a query to the service and gets back the results of the query.
* The Management action sends a control command to the service and gets back
  the results of the control command.
* The UI action can be used to start up a desktop client or web client. The action is done through an HTTP Redirect response,
to interact with the service.

## Next steps

For more information on the HTTP request and response of the query and management actions, see:
 * [Query management HTTP request](./request.md)
 * [Query management HTTP response](./response.md)
 * [Query v2 HTTP response](./response2.md)

For more information on the UI action, see:
 * [UI deep link](./deeplink.md)
