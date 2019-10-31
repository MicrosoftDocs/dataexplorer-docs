---
title: Data mappings - Azure Data Explorer | Microsoft Docs
description: This article describes Data mappings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/16/2019
---
# Data mappings

This article describes data mappings that are used at ingestion time to map incoming data to columns inside Kusto tables.

## CSV Mapping

When the source file is in CSV format (or any delimeter-separated format) and its schema doesn't match the current Kusto table schema, a CSV mapping maps from the file schema to the Kusto table schema. If the table doesn't exist in Kusto, it will be created according to this mapping. If some fields in the mapping are missing in the table, they will be added. 

CSV mapping can be applied on all the delimiter-separated formats, namely: CSV, TSV, PSV, SCSV, SOHsv.

Each element in the mapping list describes a single column as a dictionary with next properties: 


|Property|Description|
|----|--|
|`name`|Target column name in the Kusto table|
| `datatype`| (Optional) Datatype with which to create the mapped column if not already exists in the Kusto table||`ordinal`|The column order number in csv.|
|`constantValue`|(Optional) The constant value to be used for a column instead of some value inside the csv|

* Note: `Ordinal` and `ConstantValue` are mutually exclusive.

### Example of the CSV mapping

``` json
[
{ "Name" : "rownumber", "Ordinal" : 0},
{ "Name" : "rowguid", "Ordinal" : 1 },
{ "Name" : "xdouble", "Ordinal" : 2},
{ "Name" : "xfloat", "Ordinal" : 3},
{ "Name" : "xbool", "Ordinal" : 4 },
{ "Name" : "xint16", "Ordinal" : 5 },
{ "Name" : "xint32", "Ordinal" : 6 },
{ "Name" : "xint64", "Ordinal" : 7 },
{ "Name" : "xuint8", "Ordinal" : 8 },
{ "Name" : "xuint16", "Ordinal" : 9 },
{ "Name" : "xuint32", "Ordinal" : 10 },
{ "Name" : "xuint64", "Ordinal" : 11 },
{ "Name" : "xdate", "Ordinal" : 12 },
{ "Name" : "xsmalltext", "Ordinal" : 13 },
{ "Name" : "xtext", "Ordinal" : 14},
{ "Name" : "xnumberAsText", "Ordinal" : 15 },
{ "Name" : "xtime", "Ordinal" : 16},
{ "Name" : "xtextWithNulls", "Ordinal" : 17 },
{ "Name" : "xdynamicWithNulls", "Ordinal" : 18 },
{ "Name" : "xanothertext", "Ordinal" : 19 },
{ "Name" : "constvalue", "ConstValue" : "some value"}
]
```      

CSV mapping can be [pre-created](tables.md#create-ingestion-mapping) and be referenced from the ingest command `csvMappingReference` parameter.
 
* Note: When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string:

```kusto
.ingest into Table123 (@"source1", @"source2")
  with @'{"csvMapping": "[{\"Name\":\"rownumber\",\"Ordinal\":0},{\"Name\":\"rowguid\",\"Ordinal\":1},...]","format":"csv"}'
```

## JSON Mapping

When the source file is in JSON format, this maps the file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Json mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a single or multiple columns as a dictionary with next properties: 

|Property|Description|
|----|--|
|`column`|Target column name in the Kusto table|
|`columns`|Target columns' names to be mapped to the same property. Can be used instead of or in addition to `column`.|
| `datatype`| (Optional) Datatype with which to create the mapped column if not already exists in the Kusto table|
|`path`|If starts with `$`: JSON path to the field that will become the content of the column in the JSON document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used.|
|`transform`|(Optional) Transformation that should be applied on the content. See [mapping transformations](#mapping-transformations).|


### Example of the JSON Mapping

``` json
[
  { "column" : "rownumber", "path" : "$.rownumber"},
  { "column" : "rowguid", "path" : "$.rowguid" },
  { "column" : "xdouble", "path" : "$.xdouble" },
  { "column" : "xfloat", "path" : "$.xfloat" },
  { "column" : "xbool", "path" : "$.xbool" },
  { "column" : "xint16", "path" : "$.xint16" },
  { "column" : "xint32", "path" : "$.xint32" },
  { "column" : "xint64", "path" : "$.xint64" },
  { "column" : "xuint8", "path" : "$.xuint8" },
  { "column" : "xuint16", "path" : "$.xuint16" },
  { "column" : "xuint32", "path" : "$.xuint32" },
  { "column" : "xuint64", "path" : "$.xuint64" },
  { "column" : "xdate", "path" : "$.xdate" },
  { "column" : "xsmalltext", "path" : "$.xsmalltext" },
  { "column" : "xtext", "path" : "$.xtext" },
  { "column" : "xnumberAsText", "path" : "$.xnumberAsText" },
  { "column" : "xtime", "path" : "$.xtime" },
  { "column" : "xtextWithNulls", "path" : "$.xtextWithNulls" },
  { "column" : "xdynamicWithNulls", "path" : "$.xdynamicWithNulls" },
  { "column" : "sourceLocation", "transform" : "SourceLocation" },
  { "column" : "sourceLineNumber", "transform" : "SourceLineNumber" },
  { "column" : "xanothertext", "path" : "$.xanothertext", "datatype" : "string" },
  { "column" : "event_as_jason_document", "path" : "$", "datatype" : "dynamic" }
]
```      

JSON mapping can be [pre-created](tables.md#create-ingestion-mapping) and be referenced from the ingest command `jsonMappingReference` parameter.

* Note: When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string:

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with @'{"jsonMapping" : "[{\"column\":\"rownumber\",\"path\":\"$.rownumber\"},{\"column\":\"rowguid\",\"path\":\"$.rowguid\"},...]","format":"json"}'
```
    
## Avro Mapping

When the source file is in Avro format, this maps the Avro file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. 
The columns mapped in the Avro Mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a single or multiple columns as a dictionary with next properties: 

|Property|Description|
|----|--|
|`column`|Target column name in the Kusto table|
|`field`|The name of the field in the Avro record|
|`path`|Alternative of using `field` which allows taking inner part of an Avro record-field if necessarry. The value denotes JSON-path from the root of the record. See Notes section below for more information. |
|`transform`|(Optional) Transformation that should be applied on the content. See [supported transformations](#mapping-transformations).|

**Notes**
- `field` and `path` cannot be used together - only one is allowed. 
- `path` cannot point to root `$` only, it must have at least one level of path.
- The two alternatives below are equal:

``` json
[
  {"column": "rownumber", "field": "RowNumber" }
]
```

``` json
[
  {"column": "rownumber", "path": "$.RowNumber" }
]
```

### Example of the AVRO mapping

``` json
[
  {"column": "rownumber", "field": "RowNumber" },
  {"column": "rowguid", "field": "RowGuid" },
  {"column": "xdouble", "field": "XDouble" },
  {"column": "xfloat", "field": "XFloat" },
  {"column": "xboolean", "field": "XBoolean" },
  {"column": "xint16", "field": "XInt16" },
  {"column": "xint32", "field": "XInt32" },
  {"column": "xint64", "field": "XInt64" },
  {"column": "xuint8", "field": "XUInt8" },
  {"column": "xuint16", "field": "XUInt16" },
  {"column": "xuint32", "field": "XUInt32" },
  {"column": "xuint64", "field": "XUInt64" },
  {"column": "xdate", "field": "XDate" },
  {"column": "xsmalltext", "field": "XSmallText" },
  {"column": "xtext", "field": "XText" },
  {"column": "xnumberastext", "field": "XNumberAsText" },
  {"column": "xtime", "field": "XTime" },
  {"column": "xtextwithnulls", "field": "XTextWithNulls" },
  {"column": "xdynamicwithnulls", "field": "XDynamicWithNulls" },
  {"column": "xanothertext", "field": "XAnotherText" }
]
``` 

* Note: When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string: 

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with @'{"avroMapping": "[{\"column\":\"rownumber\",\"field\":\"RowNumber\"},{\"column\":\"rowguid\",\"field\":\"RowGuid\"},...]","format":"avro"}'
```
    
Avro mapping can be [pre-created](tables.md#create-ingestion-mapping) and be referenced from the ingest command `avroMappingReference` parameter.

## Mapping transformations

Some of the data format mappings support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time - one can use [Update policy](update-policy.md), which allows defining a lightweight processing using KQL expression.

|Path-dependant transformation|Description|Conditions|
|--|--|--|
|`PropertyBagArrayToDictionary`|Transforms Json array of properties (e.g. {events:[{"n1":"v1"},{"n2":"v2"}]}) to dictionary and serializes it to valid JSON document (e.g. {"n1":"v1","n2":"v2"}).|Can be applied only when `path` is used|
|`GetPathElement(index)`|Extracts an element from the given path according to the given index (e.g. Path: $.a.b.c, GetPathElement(0) == "c", GetPathElement(-1) == "b", type string|Can be applied only when `path` is used|
|`SourceLocation`|Name of the storage artifact that provided the data, type string (e.g. the blob's "BaseUri" field).|
|`SourceLineNumber`|Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).|

The following transformations are going to be available in the beginning of Nov-2019:

|Path-dependant transformation|Description|Conditions|
|--|--|--|
|`DateTimeFromUnixSeconds`|Converts number representing unix-time (seconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMilliseconds`|Converts number representing unix-time (milliseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMicroseconds`|Converts number representing unix-time (microseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixNanoseconds`|Converts number representing unix-time (nanoseconds since 1970-01-01) to UTC datetime string|