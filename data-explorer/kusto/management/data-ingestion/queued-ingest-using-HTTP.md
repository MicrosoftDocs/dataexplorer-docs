---
title: Queued Ingestion via REST API
description: Learn how to use the REST API to submit blobs for ingestion into Azure Data Explorer tables.
ms.reviewer: 
ms.topic: reference
ms.date: 09/15/2025
---

# Queued ingestion via REST API

The queued ingestion REST API allows you to programmatically submit one or more blobs for ingestion into a specified database and table. This method is ideal for automated workflows and external systems that need to trigger ingestion dynamically.

## Permissions

To use the REST API for queued ingestion, you need:

- **Table Ingestor** role to ingest data into an existing table.
- **Database User** role to access the target database.
- **Storage Blob Data Reader** role on the blob storage container.

For more information, see [Role-based access control](../../access-control/role-based-access-control.md).

## HTTP Endpoint

```http
URL: /v1/rest/ingestion/queued/{database}/{table}
Method: POST
```

|Parameter|Type|Required|Description|
|--|--|--|--|
|`database`|`string`|✔️|The name of the target database.|
|`table`|`string`|✔️|The name of the target table.|

## Request body parameters

The request must be a JSON object with the following structure.

### Top-level fields

|Field|Type|Required|Description|
|--|--|--|--|
[#Blob object](#blob-object)
|`properties`|`object`|✔️|An object containing ingestion properties. See [Supported ingestion properties](#supported-ingestion-properties) |
|`timestamp`|`datetime`|No|Optional timestamp indicating when the ingestion request was created.|

### Blob object

Each item in the `blobs` array must follow this structure:

|Field|Type|Required|Description|
|--|--|--|--|
|`url`|`string`|✔️|The URL of the blob to ingest. The service performs light validation on this field.|
|`sourceId`|`string`|No|An identifier for the source blob.|
|`rawSize`|`integer`|No|The size of the blob before compression (nullable).|

### Supported ingestion properties

|Property|Type|Description|
|--|--|--|
|`format`|`string`|Data format (for example, `csv`, `json`).|
|`enableTracking`|`bool`|If `true`, returns an `ingestionOperationId` for status tracking.|
|`tags`|`array`|List of tags to associate with the ingested data.|
|`skipBatching`|`bool`|If `true`, disables batching of blobs.|
|`deleteAfterDownload`|`bool`|If `true`, deletes the blob after ingestion.|
|`ingestionMappingReference`|`string`|Reference to a predefined ingestion mapping.|
|`creationTime`|`string`|ISO8601 timestamp for the ingested data extents.|
|`ingestIfNotExists`|`array`|Prevents ingestion if data with matching tags already exists.|
|`ignoreFirstRecord`|`bool`|If `true`, skips the first record (for example, header row).|
|`validationPolicy`|`string`|JSON string defining validation behavior.|
|`zipPattern`|`string`|Regex pattern for extracting files from zipped blobs.|

## Example

```http
POST /v1/rest/ingestion/queued/MyDatabase/MyTable
Content-Type: application/json
Authorization: Bearer <access_token>
```

```json
{
  "timestamp": "2025-10-01T12:00:00Z",
  "blobs": [
    {
      "url": "https://example.com/blob1.csv.gz",
      "sourceId": "source_1",
      "rawSize": 1048576
    }
  ],
  "properties": {
    "format": "csv",
    "enableTracking": true,
    "tags": ["ingest-by:rest"],
    "ingestionMappingReference": "csv_mapping",
    "creationTime": "2025-10-01T11:00:00Z"
  }
}
```

> [!NOTE]
> Setting `"enableTracking": true` will return a non-empty `ingestionOperationId` in the response, which can be used to monitor ingestion status via the rest-api-status.md.

## Response

|Condition|Response|
|--|--|
|Tracking enabled (`enableTracking: true`)|Returns a nonempty `ingestionOperationId`.|
|Tracking disabled or omitted|Returns an empty `ingestionOperationId`.|

**Tracking enabled:**

```json
{
  "ingestionOperationId": "ingest_op_12345"
}
```

**Tracking disabled:**

```json
{
  "ingestionOperationId": ""
}
```

## Performance tips

- Submit up to **20 blobs** per request for optimal performance.
- Use `enableTracking` to monitor ingestion status via the status endpoint.
- Avoid setting `skipBatching` unless ingestion latency is critical.
