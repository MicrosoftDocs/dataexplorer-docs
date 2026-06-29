---
title: inline_external_table operator
description: Learn how to use the inline_external_table operator to return a data table whose data is retrieved from the specified external storage artifact.
ms.reviewer: TBD
ms.topic: reference
ms.date: 06/16/2026
---
# inline_external_table operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `inline_external_table` operator returns a table whose schema is defined in the query itself or inferred from Delta Lake metadata, and whose data is read from an external storage artifact, such as a blob in Azure Blob Storage or a file in Azure Data Lake Storage.

::: moniker range="azure-data-explorer"
> [!NOTE]
> The `inline_external_table` operator supports:
> * a specific set of storage services, as listed under [Storage connection strings](../api/connection-strings/storage-connection-strings.md).
> * shared Access Signature (SAS) key, Access key, Microsoft Entra Token, and Managed Identity authentication methods. For more information, see [Storage authentication methods](../api/connection-strings/storage-connection-strings.md#storage-authentication-methods).

::: moniker-end

::: moniker range="microsoft-fabric"
> [!NOTE]
> The `inline_external_table` operator supports:
> * a specific set of storage services, as listed under [Storage connection strings](../api/connection-strings/storage-connection-strings.md).
> * shared Access Signature (SAS) key, Access key, and Microsoft Entra Token authentication methods. For more information, see [Storage authentication methods](../api/connection-strings/storage-connection-strings.md#storage-authentication-methods).

::: moniker-end

## Syntax

### Storage mode

`inline_external_table` `(`*columnName*`:`*columnType* [`,` ...] `)`
`kind` `=` `storage`
[`partition` `by` `(`*partitionName*`:`*partitionType* [`=` *expression*] [`,` ...]`)`]
[`pathformat` `=` `(`*pathFormatElement* [...]`)`]
`dataformat` `=` *dataFormat*
`(` *storageConnectionString* [`,` ...] `)`
[`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`]

### Delta mode

`inline_external_table` [`(`*columnName*`:`*columnType* [`,` ...] `)`]
`kind` `=` `delta`
`(` *storageConnectionString* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *columnName*, *columnType* | `string` | :heavy_check_mark: for `kind=storage` | A list of column names and their types. This list defines the schema of the table. In `kind=delta`, this list is optional. If the schema isn't specified, it's inferred from the Delta log. If a schema is specified, the columns must exist in the Delta table and must use compatible types. |
| *kind* | `string` | :heavy_check_mark: | The inline external table type. Supported values are `storage` and `delta`. |
| *partitionName*, *partitionType*, *expression* | `string` | | A list of optional partition columns for `kind=storage`. Supported partition types are `string`, `datetime`, and `long`. The optional expression maps a partition column to a source column expression. |
| *pathFormatElement* | `string` | | An optional path format definition for `kind=storage`. The path format can include literal path segments, partition column references, and `datetime_pattern()` expressions. |
| *dataFormat* | `string` | :heavy_check_mark: for `kind=storage` | The data format of the external storage files. This parameter isn't supported for `kind=delta`. |
| *storageConnectionString* | `string` | :heavy_check_mark: | A [storage connection string](../api/connection-strings/storage-connection-strings.md) of the storage artifact to query. `kind=storage` accepts one or more storage connection strings. `kind=delta` requires exactly one Delta table root URI. |
| *propertyName*, *propertyValue* | `string` | | A list of optional [supported properties](#supported-properties) that determines how to interpret the data retrieved from storage. These properties apply to `kind=storage`. |

> [!NOTE]
> For security reasons, make sure that no credential is specified by the *storageConnectionString* property.
> If the query needs to specify credentials, use [query parameters](./query-parameters-statement.md) to specify the whole connection string.
>
> For example, assuming that the query includes a query parameter called `URI` whose value points at external storage, the query would look like this:
> ```kusto
> declare query_parameters(URI:string);
> inline_external_table(x:string) kind=storage dataformat=txt (URI)
> ```
>
> If this is not possible (for example, you're using a client that does not support setting query parameters),
> be sure to use [obfuscated string literals](./scalar-data-types/string.md#obfuscated-string-literals).

### Supported properties

The following properties apply only to `kind=storage`.

| Property | Type | Description |
|--|--|--|
| includeHeaders | `string` | Header handling for text formats. For example, use `All` to skip the first record in every file when CSV files contain headers. |
| encoding | `string` | Specifies how text is encoded, such as `UTF8NoBOM` or `UTF8BOM`. |
| namePrefix | `string` | If set, only files with this name prefix are read. |
| fileExtension | `string` | If set, only files with this file extension are read. |

> [!NOTE]
>
> This operator doesn't accept any pipeline input.
>
> Standard [query limits](../concepts/query-limits.md) apply to external data queries as well.
>
> In `kind=delta`, `dataformat`, `partition by`, and `pathformat` aren't supported. The data format, partitioning information, and path format are inferred from Delta metadata. Delta mode requires exactly one Delta table root URI.

## Returns

The `inline_external_table` operator returns a data table whose data is retrieved from the specified storage artifact, indicated by the storage connection string.

In `kind=storage`, the table schema is the schema specified in the query. In `kind=delta`, the table schema is either specified in the query or inferred from the Delta log. Partition columns inferred from Delta metadata are returned as virtual columns.

## Examples

The following example queries a Parquet file stored in external storage.

```kusto
inline_external_table(Timestamp:datetime, DeviceId:string, Value:real)
    kind=storage
    dataformat=parquet
    (h@"https://mycompanystorage.blob.core.windows.net/iot/2026/06/01/data.parquet?...SAS...")
| summarize AvgValue = avg(Value) by DeviceId
```

**Output**

|DeviceId|AvgValue|
|---|---|
|Device-001|23.45|
|Device-002|18.92|
|Device-003|31.67|

The following example queries multiple CSV files stored in external storage.

```kusto
inline_external_table(Timestamp:datetime, ProductId:string, Quantity:long)
    kind=storage
    dataformat=csv
    (
        h@"https://mycompanystorage.blob.core.windows.net/archivedproducts/2026/06/01/part-00000.csv.gz?...SAS...",
        h@"https://mycompanystorage.blob.core.windows.net/archivedproducts/2026/06/02/part-00000.csv.gz?...SAS..."
    )
    with(includeHeaders='All')
| summarize TotalQuantity = sum(Quantity) by ProductId
```

**Output**

|ProductId|TotalQuantity|
|---|---|
|PROD-123|1500|
|PROD-456|2300|
|PROD-789|870|

The following example queries partitioned Parquet files stored in external storage.

```kusto
inline_external_table(Timestamp:datetime, DeviceId:string, Region:string, Value:real)
    kind=storage
    partition by(
        Day:datetime = startofday(Timestamp),
        RegionPartition:string = Region
    )
    pathformat=('day=' datetime_pattern('yyyy/MM/dd', Day) '/region=' RegionPartition)
    dataformat=parquet
    (h@"https://mycompanystorage.blob.core.windows.net/iotpartitioned;managed_identity=...")
| where Day between (datetime(2026-01-01) .. datetime(2026-01-07))
| summarize AvgValue = avg(Value) by Region
```

**Output**

|Region|AvgValue|
|---|---|
|East|27.8|
|West|22.1|
|North|19.5|
|South|31.2|

The following example queries a Delta Lake table root. The schema is inferred from the Delta log, and the inferred `Amount` column is used for filtering.

```kusto
inline_external_table
    kind=delta
    (h@"abfss://filesystem@storageaccount.dfs.core.windows.net/delta/customer-events;sharedkey=...")
| where Amount > 0
| take 10
```

**Output**

|Timestamp|CustomerId|Amount|EventType|
|---|---|---|---|
|2026-06-01T10:23:45Z|CUST-001|150.00|Purchase|
|2026-06-01T11:15:30Z|CUST-002|75.50|Purchase|
|2026-06-01T12:45:00Z|CUST-003|200.00|Purchase|
|2026-06-01T13:20:15Z|CUST-001|50.25|Purchase|
|2026-06-01T14:30:00Z|CUST-004|125.75|Purchase|

The following example queries a Delta Lake table root with an explicit schema.

```kusto
inline_external_table(Timestamp:datetime, CustomerId:string, Amount:real)
    kind=delta
    (h@"abfss://filesystem@storageaccount.dfs.core.windows.net/delta/customer-events;sharedkey=...")
| summarize TotalAmount = sum(Amount) by CustomerId
```

**Output**

|CustomerId|TotalAmount|
|---|---|
|CUST-001|1250.75|
|CUST-002|890.50|
|CUST-003|2100.00|
|CUST-004|675.25|

## Related content

* For more info on storage connection strings, see [Storage connection strings](../api/connection-strings/storage-connection-strings.md).
* For more info on external tables, see [external tables](schema-entities/external-tables.md).
