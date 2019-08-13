---
title: Data mappings - Azure Data Explorer | Microsoft Docs
description: This article describes Data mappings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/12/2019
---
# Data mappings

This article describes data mappings that are used at ingestion time to map incoming data to columns inside Kusto tables.

## CSV Mapping

When the source file is in CSV format and its schema doesn't match the current Kusto table schema, a CSV mapping maps from the file schema to the Kusto table schema. If the table doesn't exist in Kusto, it will be created according to this mapping. If some fields in the mapping are missing in the table, they will be added. 

Each element in the list describes a single column as a dictionary: 

* `Name`
* `DataType`
* `Ordinal` - the column order number in csv
* `ConstantValue` - the constant value to be used for a column instead of some value inside the csv

`Ordinal` and `ConstantValue` are mutually exclusive.

Example of the CSV mapping:

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
 
CSV mapping can be applied on all the delimiter-separated formats, meaning : CSV, TSV, PSV, SCSV, SOHsv.

## JSON Mapping

When the source file is in JSON format, this maps the file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Json mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a single or multiple columns as a dictionary: 

* `Column`: the target column name 
* `Columns`: the target columns' names to be mapped to the same property
 * Can be used instead of `Column` (or in addition to `Column`)
* `DataType`: the datatype with which to create the mapped column if not already exists in the Kusto table (optional)
* `Path`  
 * If starts with `$`: JSON path to the field that will become the content of the column in the JSON document (JSON path that denotes the entire document is `$`)
 * Otherwise a constant value is used
* `Transform` (optional): the transformation that should be applied on the content:
 * Path dependent transform:
   * `PropertyBagArrayToDictionary` - creating a dictionary from the array content of the field and serializes it to JSON.
   * `GetPathElement(index)` - Extract an element from the given path according to the given index (e.g. Path: $.a.b.c, GetPathElement(0) == "c", GetPathElement(-1) == "b", type string.
 * Path independent transform:
   * `SourceLocation` - Name of the storage artifact that provided the data, type string (e.g. the blob's "BaseUri" field).
   * `SourceLineNumber` - Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).

 
Example of the JSON Mapping:

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

Each element in the list describes a single or multiple columns as a dictionary: 

* `column`: the name of the column in Kusto table
* `field`: the name of the filed in Avro record
 
Example of the AVRO mapping:

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