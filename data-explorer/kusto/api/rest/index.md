---
title:  REST API overview
description: This article describes how to use the REST API overview for Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/19/2023
---
# REST API overview

This article describes how to interact with your cluster over HTTPS.

## Supported actions

The available actions for an endpoint depend on whether it's an engine endpoint or a data management endpoint. In the Azure portal cluster overview, the engine endpoint is identified as the **Cluster URI** and the data management endpoint as the **Data ingestion URI**.

|Action         |HTTP verb   |URI template           |Engine|Data Management|Authentication |
|---------------|------------|-----------------------|------|---------------|---------------|
|Query          |GET or POST |/v1/rest/query         |Yes   |No             |Yes            |
|Query          |GET or POST |/v2/rest/query         |Yes   |No             |Yes            |
|Management     |POST        |/v1/rest/mgmt          |Yes   |Yes            |Yes            |
|StreamIngest   |POST        |/v1/rest/ingest        |Yes   |No             |Yes            |
|UI             |GET         |/                      |Yes   |No             |No             |
|UI             |GET         |/{dbname}              |Yes   |No             |No             |

Where *Action* represents a group of related activities

* The Query action sends a query to the service and gets back the results of the query.
* The Management action sends a management command to the service and gets back
  the results of the management command.
* The StreamIngest action ingests data to a table.
* The UI action can be used to start up a desktop client or web client. The action is done through an HTTP Redirect response,
to interact with the service.

## Next steps

For more information on the HTTP request and response of the query and management actions, see:

* [REST API reference](/rest/api/azurerekusto/)
* [Query management HTTP request](request.md)
* [Query management HTTP response](response.md)
* [Query v2 HTTP response](response2.md)

For more information on the stream ingest action, see:

* [Streaming ingestion HTTP request](streaming-ingest.md)

For more information on the UI action, see:

* [UI deep link](deeplink.md)
