---
title:  externaldata operator
description: Learn how to use the externaldata operator to return a data table of the given schema whose data was parsed from the specified storage artifact.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "microsoft-fabric || azure-data-explorer || azure-monitor || microsoft-sentinel"
---
# externaldata operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `externaldata` operator returns a table whose schema is defined in the query itself, and whose data is read from an external storage artifact, such as a blob in Azure Blob Storage or a file in Azure Data Lake Storage.

> [!NOTE]
> The `externaldata` operator supports a specific set of storage services, as listed under [Storage connection strings](../api/connection-strings/storage-connection-strings.md).

> [!NOTE]
> The `externaldata` operator supports Shared Access Signature (SAS) key, Access key, and Microsoft Entra Token authentication methods. For more information, see [Storage authentication methods](../api/connection-strings/storage-connection-strings.md).

::: moniker range="microsoft-fabric  || azure-data-explorer"

::: moniker-end

::: moniker range="azure-monitor || microsoft-sentinel"

> [!NOTE]
> Use the `externaldata` operator to retrieve small reference tables of up to 100 MB from an external storage artifact. The operator is not designed for large data volumes. To retrieve large volumes of external data, we recommend [ingesting the external data into Log Analytics as custom logs](/azure/azure-monitor/logs/tutorial-custom-logs).
> This operator isn't supported when the public endpoint of the storage artifact is behind a firewall.

::: moniker-end

## Syntax

`externaldata` `(`*columnName*`:`*columnType* [`,` ...] `)`
`[` *storageConnectionString* [`,` ...] `]`
[`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *columnName*, *columnType* | `string` |  :heavy_check_mark:| A list of column names and their types. This list defines the schema of the table. |
| *storageConnectionString* | `string` |  :heavy_check_mark:| A [storage connection string](../api/connection-strings/storage-connection-strings.md) of the storage artifact to query. |
| *propertyName*, *propertyValue* | `string` | | A list of optional [supported properties](#supported-properties) that determines how to interpret the data retrieved from storage.

### Supported properties

| Property         | Type     | Description       |
|------------------|----------|-------------------|
| format         | `string` | The data format. If unspecified, an attempt is made to detect the data format from file extension. The default is `CSV`. All [ingestion data formats](../ingestion-supported-formats.md) are supported. |
| ignoreFirstRecord | `bool` | If set to `true`, the first record in every file is ignored. This property is useful when querying CSV files with headers. |
| ingestionMapping | `string` | Indicates how to map data from the source file to the actual columns in the operator result set. See [data mappings](../management/mappings.md). |

> [!NOTE]
>
> This operator doesn't accept any pipeline input.
>
> Standard [query limits](../concepts/query-limits.md) apply to external data queries as well.

## Returns

The `externaldata` operator returns a data table of the given schema whose data was parsed from the specified storage artifact, indicated by the storage connection string.

## Examples

### Fetch a list of user IDs stored in Azure Blob Storage

The following example shows how to find all records in a table whose `UserID` column falls into a known set of IDs, held (one per line) in an external storage file. Since the data format isn't specified, the detected data format is `TXT`.

```kusto
Users
| where UserID in ((externaldata (UserID:string) [
    @"https://storageaccount.blob.core.windows.net/storagecontainer/users.txt" 
      h@"?...SAS..." // Secret token needed to access the blob
    ]))
| ...
```

### Query multiple data files

The following example queries multiple data files stored in external storage.

```kusto
externaldata(Timestamp:datetime, ProductId:string, ProductDescription:string)
[
  h@"https://mycompanystorage.blob.core.windows.net/archivedproducts/2019/01/01/part-00000-7e967c99-cf2b-4dbb-8c53-ce388389470d.csv.gz?...SAS...",
  h@"https://mycompanystorage.blob.core.windows.net/archivedproducts/2019/01/02/part-00000-ba356fa4-f85f-430a-8b5a-afd64f128ca4.csv.gz?...SAS...",
  h@"https://mycompanystorage.blob.core.windows.net/archivedproducts/2019/01/03/part-00000-acb644dc-2fc6-467c-ab80-d1590b23fc31.csv.gz?...SAS..."
]
with(format="csv")
| summarize count() by ProductId
```

The above example can be thought of as a quick way to query multiple data files without defining an [external table](schema-entities/external-tables.md).

> [!NOTE]
> Data partitioning isn't recognized by the `externaldata` operator.

### Query hierarchical data formats

To query hierarchical data format, such as `JSON`, `Parquet`, `Avro`, or `ORC`, `ingestionMapping` must be specified in the operator properties.
In this example, there's a JSON file stored in Azure Blob Storage with the following contents:

```JSON
{
  "timestamp": "2019-01-01 10:00:00.238521",   
  "data": {    
    "tenant": "e1ef54a6-c6f2-4389-836e-d289b37bcfe0",   
    "method": "RefreshTableMetadata"   
  }   
}   
{
  "timestamp": "2019-01-01 10:00:01.845423",   
  "data": {   
    "tenant": "9b49d0d7-b3e6-4467-bb35-fa420a25d324",   
    "method": "GetFileList"   
  }   
}
...
```

To query this file using the `externaldata` operator, a data mapping must be specified. The mapping dictates how to map JSON fields to the operator result set columns:

```kusto
externaldata(Timestamp: datetime, TenantId: guid, MethodName: string)
[ 
   h@'https://mycompanystorage.blob.core.windows.net/events/2020/09/01/part-0000046c049c1-86e2-4e74-8583-506bda10cca8.json?...SAS...'
]
with(format='multijson', ingestionMapping='[{"Column":"Timestamp","Properties":{"Path":"$.timestamp"}},{"Column":"TenantId","Properties":{"Path":"$.data.tenant"}},{"Column":"MethodName","Properties":{"Path":"$.data.method"}}]')
```

The `MultiJSON` format is used here because single JSON records are spanned into multiple lines.

For more info on mapping syntax, see [data mappings](../management/mappings.md).
