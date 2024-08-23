---
title:  infer_storage_schema_with_suggestions plugin
description: Learn how to use the infer_storage_schema_with_suggestions plugin to infer the optimal schema of external data.
ms.reviewer: avnera
ms.topic: reference
ms.date: 08/11/2024
---
# infer_storage_schema_with_suggestions plugin

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This `infer_storage_schema_with_suggestions` plugin infers the schema of external data and returns a JSON object. For each column, the object provides inferred type, a recommended type, and the recommended mapping transformation. The recommended type and mapping are provided by the suggestion logic that determines the optimal type using the following logic:

* **Identity columns**: If the inferred type for a column is `long` and the column name ends with `id`, the suggested type is `string` since it provides optimized indexing for identity columns where equality filters are common.
* **Unix datetime columns**: If the inferred type for a column is `long` and one of the unix-time to datetime [mapping transformations](../management/mappings.md#mapping-transformations) produces a valid datetime value, the suggested type is `datetime` and the suggested `ApplicableTransformationMapping` mapping is the one that produced a valid datetime value.

The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator. To obtain the table schema that uses the inferred schema for [Create and alter Azure Storage external tables](../management/external-tables-azure-storage.md) without suggestions, use the [infer_storage_schema](infer-storage-schema-plugin.md) plugin.

## Authentication and authorization

In the [properties of the request](#supported-properties-of-the-request), you specify storage connection strings to access. Each storage connection string specifies the authorization method to use for access to the storage. Depending on the authorization method, the principal may need to be granted permissions on the external storage to perform the schema inference.

The following table lists the supported authentication methods and any required permissions by storage type.

|Authentication method|Azure Blob Storage / Data Lake Storage Gen2|Data Lake Storage Gen1|
|--|--|--|
|[Impersonation](../api/connection-strings/storage-connection-strings.md#impersonation)|Storage Blob Data Reader|Reader|
|[Shared Access (SAS) token](../api/connection-strings/storage-connection-strings.md#shared-access-sas-token)|List + Read|This authentication method isn't supported in Gen1.|
|[Microsoft Entra access token](../api/connection-strings/storage-connection-strings.md#azure-ad-access-token)||
|[Storage account access key](../api/connection-strings/storage-connection-strings.md#storage-account-access-key)||This authentication method isn't supported in Gen1.|

## Syntax

`evaluate` `infer_storage_schema_with_suggestions(` *Options* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *Options* | `dynamic` |  :heavy_check_mark: |A property bag specifying the [properties of the request](#supported-properties-of-the-request).|

### Supported properties of the request

| Name | Type | Required | Description |
|--|--|--|--|
|*StorageContainers*| `dynamic` | :heavy_check_mark:|An array of [storage connection strings](../api/connection-strings/storage-connection-strings.md) that represent prefix URI for stored data artifacts.|
|*DataFormat*| `string` | :heavy_check_mark:|One of the supported [Data formats supported for ingestion](../ingestion-supported-formats.md)|
|*FileExtension*| `string` ||If specified, the function only scans files ending with this file extension. Specifying the extension may speed up the process or eliminate data reading issues.|
|*FileNamePrefix*| `string` ||If specified, the function only scans files starting with this prefix. Specifying the prefix may speed up the process.|
|*Mode*| `string` ||The schema inference strategy. A value of: `any`, `last`, `all`. The function infers the data schema from the first found file, from the last written file, or from all files respectively. The default value is `last`.|
|*InferenceOptions*|`dynamic`||More inference options. Valid options: `UseFirstRowAsHeader` for delimited file formats. For example, `'InferenceOptions': {'UseFirstRowAsHeader': true}` .

## Returns

The `infer_storage_schema_with_suggestions` plugin returns a single result table containing a single row/column containing a JSON string.

> [!NOTE]
>
> * Storage container URI secret keys must have the permissions for *List* in addition to *Read*.
> * Schema inference strategy 'all' is a very "expensive" operation, as it implies reading from *all* artifacts found and merging their schema.
> * Some returned types may not be the actual ones as a result of wrong type guess (or, as a result of schema merge process). This is why you should review the result carefully before using them.

## Example

```kusto
let options = dynamic({
  'StorageContainers': [
    h@'https://storageaccount.blob.core.windows.net/MobileEvents;secretKey'
  ],
  'FileExtension': '.json',
  'FileNamePrefix': 'js-',
  'DataFormat': 'json'
});
evaluate infer_storage_schema_with_suggestions(options)
```

**Example input data**

```json
    {
        "source": "DataExplorer",
        "created_at": "2022-04-10 15:47:57",
        "author_id": 739144091473215488,
        "time_millisec":1547083647000
    }
```

**Output**

```json
{
  "Columns": [
    {
      "OriginalColumn": {
        "Name": "source",
        "CslType": {
          "type": "string",
          "IsNumeric": false,
          "IsSummable": false
        }
      },
      "RecommendedColumn": {
        "Name": "source",
        "CslType": {
          "type": "string",
          "IsNumeric": false,
          "IsSummable": false
        }
      },
      "ApplicableTransformationMapping": "None"
    },
    {
      "OriginalColumn": {
        "Name": "created_at",
        "CslType": {
          "type": "datetime",
          "IsNumeric": false,
          "IsSummable": true
        }
      },
      "RecommendedColumn": {
        "Name": "created_at",
        "CslType": {
          "type": "datetime",
          "IsNumeric": false,
          "IsSummable": true
        }
      },
      "ApplicableTransformationMapping": "None"
    },
    {
      "OriginalColumn": {
        "Name": "author_id",
        "CslType": {
          "type": "long",
          "IsNumeric": true,
          "IsSummable": true
        }
      },
      "RecommendedColumn": {
        "Name": "author_id",
        "CslType": {
          "type": "string",
          "IsNumeric": false,
          "IsSummable": false
        }
      },
      "ApplicableTransformationMapping": "None"
    },
    {
      "OriginalColumn": {
        "Name": "time_millisec",
        "CslType": {
          "type": "long",
          "IsNumeric": true,
          "IsSummable": true
        }
      },
      "RecommendedColumn": {
        "Name": "time_millisec",
        "CslType": {
          "type": "datetime",
          "IsNumeric": false,
          "IsSummable": true
        }
      },
      "ApplicableTransformationMapping": "DateTimeFromUnixMilliseconds"
    }
  ]
}
```

## Related content

* [infer_storage_schema plugin](infer-storage-schema-plugin.md)
