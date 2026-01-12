---
title: Queued Ingestion Status via REST API
description: Learn how to use the REST API to check the status of queued ingestion operations in Azure Data Explorer.
ms.reviewer: 
ms.topic: reference
ms.date: 12/11/2025
---

# Ingestion status via REST API (Preview)

The ingestion status REST API allows you to monitor the progress and results of queued ingestion operations. This endpoint provides detailed information about each blob in an ingestion request, including success, failure, or in-progress status.

## Permissions

To use the REST API for ingestion status, you need:

- **Ingestor** role with **table** scope to ingest data into an existing table.
- **Database User** role to access the target database.
- **Storage Blob Data Reader** role on the blob storage container.

For more information, see [Role-based access control](../../access-control/role-based-access-control.md).

## HTTP Endpoint

```http
URL: /v1/rest/ingestion/queued/{database}/{table}/{operationId}
Method: GET
```

|Parameter|Type|Required|Description|
|--|--|--|--|
|`database`|`string`|  :heavy_check_mark: | The name of the target database.|
|`table`|`string`|  :heavy_check_mark: | The name of the target table.|
|`operationId`|`string`|  :heavy_check_mark: | The ingestion operation ID returned from the queued ingestion endpoint.|

### Query parameters

|Parameter|Type|Required|Description|
|--|--|--|--|
|`details`|`bool`|No|Controls whether to display detailed information for each blob. Defaults to `false`.|

## Example

### Request without details

```http
GET /v1/rest/ingestion/queued/MyDatabase/MyTable/ingest_op_12345
Authorization: Bearer <access_token>
```

### Request with details

```http
GET /v1/rest/ingestion/queued/MyDatabase/MyTable/ingest_op_12345?details=true
Authorization: Bearer <access_token>
```

## Response

### Response schema

#### Top-level fields

|Field|Type|Description|
|--|--|--|
|`startTime`|`timestamp`|The time when the ingestion operation started.|
|`lastUpdated`|`timestamp`|The time when the operation was last updated or completed.|
|`status`|`object`|An object containing counts of blobs for each status category.|
|`details`|`array`|An array of blob detail objects. Only appears when `details=true`.|

#### Status object

|Field|Type|Description|
|--|--|--|
|`Succeeded`|`integer`|Number of blobs that successfully ingested.|
|`Failed`|`integer`|Number of blobs that failed to ingest.|
|`InProgress`|`integer`|Number of blobs currently being ingested.|

#### Blob details object

Only appears when the `details` query parameter is set to `true`.

|Field|Type|Description|
|--|--|--|
|`sourceId`|`string`|The source ID of the blob.|
|`url`|`string`|The URL of the blob.|
|`status`|`string`|Status of the blob: `InProgress`, `Succeeded`, `Failed`, or `Canceled`.|
|`startTime`|`timestamp`|The time when blob ingestion started.|
|`lastUpdated`|`timestamp`|The time when blob ingestion completed or was last updated.|
|`errorCode`|`string`|Error code describing the failure. Only appears when `status` is `Failed`.|
|`failureStatus`|`string`|Failure classification: `Unknown`, `Permanent`, `Transient`, or `Exhausted`. Only appears when `status` is `Failed`.|
|`details`|`string`|Free text describing the error. Only appears when `status` is `Failed`.|

## Response examples

### Summary only (details=false)

```json
{
  "startTime": "2025-10-01T12:00:00Z",
  "lastUpdated": "2025-10-01T12:30:00Z",
  "status": {
    "Succeeded": 8,
    "Failed": 1,
    "InProgress": 2,
    "Canceled": 0
  }
}
```

### With blob details (details=true)

```json
{
  "startTime": "2025-10-01T12:00:00Z",
  "lastUpdated": "2025-10-01T12:30:00Z",
  "status": {
    "Succeeded": 1,
    "Failed": 1,
    "InProgress": 1,
    "Canceled": 0
  },
  "details": [
    {
      "sourceId": "123a6999-411e-4226-a333-w79992dd9b95",
      "url": "https://example.com/blob1.csv.gz",
      "status": "Failed",
      "startTime": "2025-10-01T12:00:00Z",
      "lastUpdated": "2025-10-01T12:15:00Z",
      "errorCode": "BadRequest_MissingMappingFailure",
      "failureStatus": "Permanent",
      "details": "Mapping not found"
    },
    {
      "url": "https://example.com/blob2.csv.gz",
      "status": "InProgress",
      "startTime": "2025-10-01T12:05:00Z",
      "lastUpdated": "2025-10-01T12:20:00Z"
    },
    {
      "url": "https://example.com/blob3.csv.gz",
      "status": "Succeeded",
      "startTime": "2025-10-01T12:00:00Z",
      "lastUpdated": "2025-10-01T12:10:00Z"
    }
  ]
}
```

> [!NOTE]
> The `ingestionOperationId` is obtained from the queued ingestion endpoint when `enableTracking` is set to `true`. For more information, see [Queued ingestion via REST API](queued-ingest-use-http.md).

## Usage tips

- Poll this endpoint periodically to monitor long-running ingestion operations.
- Use `details=false` for quick status checks to minimize response size.
- Use `details=true` to troubleshoot failures and identify problematic blobs.
- The `errorCode` field can be used to implement retry logic for transient failures.
- Permanent failures (such as `BadRequest_MissingMappingFailure`) require configuration changes before retrying.