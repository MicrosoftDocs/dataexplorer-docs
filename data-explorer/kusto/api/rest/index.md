---
title: Azure Data Explorer REST API - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Data Explorer REST API in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/29/2019
---
# Azure Data Explorer REST API

This article describes how to interact with Kusto over HTTPS.

## What actions are supported?

The list of actions supported by an endpoint differs according to whether the
endpoint is a engine endpoint or a data management endpoint.

|Action         |HTTP verb  |URI template             |Engine|Data Management|Authentication?|
|---------------|-----------|-------------------------|------|---------------|---------------|
|Query          |GET or POST|`/v1/rest/query`         |Yes   |No             |Yes            |
|Query          |GET or POST|`/v2/rest/query`         |Yes   |No             |Yes            |
|Management     |POST       |`/v1/rest/mgmt`          |Yes   |Yes            |Yes            |
|UI             |GET        |`/`                      |Yes   |No             |No             |
|UI             |GET        |`/{dbname}`              |Yes   |No             |No             |

Where **Action** represents a group of related activities:

* The **Query** action sends a query to the service and gets back the results of the query.
* The **Management** action sends a control command to the service and gets back
  the results of the control command.
* The **UI** action can be used to start up a desktop client or web client
  (through an HTTP Redirect response) to interact with the service.

See [query/management HTTP request](./request.md), [query/management HTTP response](./response.md),
and [query v2 HTTP response](./response2.md) for details on the HTTP request/response
of the query and management actions. See [UI (deeplink)](./deeplink.md) for
the details of the UI action.