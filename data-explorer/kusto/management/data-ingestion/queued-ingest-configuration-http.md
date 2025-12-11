---
title: Queued Ingestion Configuration via REST API
description: Learn how to use the REST API to retrieve ingestion configuration settings for Azure Data Explorer.
ms.reviewer: 
ms.topic: reference
ms.date: 12/11/2025
---

# Ingestion configuration via REST API (Preview)

The ingestion configuration REST API allows you to programmatically retrieve configuration settings for data ingestion, including storage container URIs, Lake folder paths from the Microsoft Fabric offering, and ingestion limits. This endpoint enables integration with the Data Management storage resources used for ingestion.

## Permissions

To use the REST API for ingestion configuration, you need:

- **Ingestor** role with **table** scope to ingest data into an existing table.

For more information, see [Role-based access control](../../access-control/role-based-access-control.md).

## HTTP Endpoint

```http
URL: /v1/rest/ingestion/configuration
Method: GET
```

This endpoint requires no input parameters.

## Authentication

Authentication scheme: Bearer token

```http
GET /v1/rest/ingestion/configuration
Authorization: Bearer <access_token>
```

## Response

The response is a JSON object containing configuration settings for containers and ingestion parameters.

### Response schema

#### Top-level fields

|Field|Type|Description|
|--|--|--|
|`containerSettings`|`object`|Contains all settings relevant to storage containers and upload methods.|
|`ingestionSettings`|`object`|Contains ingestion-related configuration properties.|

#### Container settings object

|Field|Type|Description|
|--|--|--|
|`containers`|`array`|List of container descriptions, each containing a storage path.|
|`lakeFolders`|`array`|List of Lake folder paths for OneLake integration.|
|`refreshInterval`|`string`|Time interval between configuration refresh calls (duration format).|
|`preferredUploadMethod`|`string`|The preferred upload method: `Storage`, `Lake`, or `Default`.|

#### Container object

|Field|Type|Description|
|--|--|--|
|`path`|`string`|The container URI embedded with credentials (SAS token).|

#### Lake folder object

|Field|Type|Description|
|--|--|--|
|`path`|`string`|A Lake folder path for OneLake storage.|

#### Ingestion settings object

|Field|Type|Description|
|--|--|--|
|`maxBlobsPerBatch`|`integer`|The maximum number of blobs accepted per ingestion batch.|
|`maxDataSize`|`long`|The maximum allowed data size in bytes.|
|`preferredIngestionMethod`|`string`|The preferred ingestion method: `V1` (Queue) or `V2` (REST).|

## Example

### Request

```http
GET /v1/rest/ingestion/configuration
Authorization: Bearer <access_token>
```

### Response

```json
{
  "containerSettings": {
    "containers": [
      {
        "path": "https://mystorageaccount.blob.core.windows.net/ingestdata?sv=2021-06-08&ss=b&srt=sco&sp=rwdlacx&se=2025-12-31T23:59:59Z&st=2025-01-01T00:00:00Z&spr=https&sig=..."
      }
    ],
    "lakeFolders": [
      {
        "path": "https://onelake.dfs.fabric.microsoft.com/workspace/artifact/Files"
      }
    ],
    "refreshInterval": "01:00:00",
    "preferredUploadMethod": "Storage"
  },
  "ingestionSettings": {
    "maxBlobsPerBatch": 20,
    "maxDataSize": 6442450944,
    "preferredIngestionMethod": "REST"
  }
}
```

## Usage tips

- Call this endpoint before initiating ingestion to obtain the correct storage container or Lake folder URIs.
- The `refreshInterval` indicates how often you should refresh the configuration to get updated credentials.
- Use the `maxBlobsPerBatch` value to ensure your ingestion requests don't exceed the allowed limit.
- The container `path` includes embedded SAS credentials that expire based on the token's validity period.