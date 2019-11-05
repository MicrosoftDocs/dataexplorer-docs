---
title: Data mappings - Azure Data Explorer | Microsoft Docs
description: This article describes Data mappings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/04/2019
---
# Data mappings

This article describes data mappings that are used at ingestion time to map incoming data to columns inside Kusto tables.
Kusto supports different types of mappings, both `row-oriented` as CSV, JSON and AVRO, and `column-oriented` as Parquet.

Each element in the mapping list is constructed from 3 properties:
|Property|Description|
|----|--|
|`column`|Target column name in the Kusto table|
|`datatype`| (Optional) Datatype with which to create the mapped column if not already exists in the Kusto table|
|`Properties`|(Optional) Property-bag containing properties specific for each mapping as described in each section below.


All mappings can be [pre-created](tables.md#create-ingestion-mapping) and can be referenced from the ingest command using `ingestionMappingReference` and `ingestionMappingType` parameters.

## CSV Mapping

When the source file is in CSV format (or any delimeter-separated format) and its schema doesn't match the current Kusto table schema, a CSV mapping maps from the file schema to the Kusto table schema. If the table doesn't exist in Kusto, it will be created according to this mapping. If some fields in the mapping are missing in the table, they will be added. 

CSV mapping can be applied on all the delimiter-separated formats, namely: CSV, TSV, PSV, SCSV, SOHsv.

Each element in the mapping list describes a single column and may contain the following properties:

|Property|Description|
|----|--|
|`ordinal`|The column order number in csv.|
|`constantValue`|(Optional) The constant value to be used for a column instead of some value inside the csv|

* Note: `Ordinal` and `ConstantValue` are mutually exclusive.

### Example of the CSV mapping

``` json
[
{ "column" : "rownumber","Properties":{"Ordinal":"0"}},
{ "column" : "rowguid", "Properties":{"Ordinal":"1"}},
{ "column" : "xdouble","Properties":{"Ordinal":"2"}},
{ "column" : "xbool", "Properties":{"Ordinal":"3"}},
{ "column" : "xint32", "Properties":{"Ordinal":"4"}},
{ "column" : "xint64", "Properties":{"Ordinal":"5"}},
{ "column" : "xdate", "Properties":{"Ordinal":"6"}},
{ "column" : "xsmalltext", "Properties":{"Ordinal":"7"}},
{ "column" : "xtext", "Properties":{"Ordinal":"8"}},
{ "column" : "xnumberAsText", "Properties":{"Ordinal":"9"}},
{ "column" : "xtime", "Properties":{"Ordinal":"10"}},
{ "column" : "xtextWithNulls", "Properties":{"Ordinal":"11"}},
{ "column" : "xdynamicWithNulls", "Properties":{"Ordinal":"12"}},
{ "column" : "xanothertext", "Properties":{"Ordinal":"13"}},
{ "column" : "constvalue", "Properties":{"ConstValue":"some value"}}
]
```      
 

**Note**  
* When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string:

```kusto
.ingest into Table123 (@"source1", @"source2")
  with @'{"ingestionMapping": "[{\"Name\":\"rownumber\",\"Properties\":{\"Ordinal\":\"0\"}},{\"Name\":\"rowguid\",\"Properties\":{\"Ordinal\":\"1\"}},...]","ingestionMappingType":"Csv", "format":"csv"}'
```

* Deprecated CSV mapping: the older version of mapping format allowed different definition for each mapping, where some of the properties could be specified without 'Properties' dictionary. 
The new version of mapping format present a unified format for all mapping kinds and should be used instead of the older version which will be deprecated in the near future.

 ``` json 
[
{ "Name" : "rownumber", "Ordinal" : 0},
{ "Name" : "rowguid", "Ordinal" : 1 },
{ "Name" : "xdouble", "Ordinal" : 2},
{ "Name" : "xbool", "Ordinal" : 3 },
{ "Name" : "xint32", "Ordinal" : 4 },
{ "Name" : "xint64", "Ordinal" : 5 },
{ "Name" : "xdate", "Ordinal" : 6 },
{ "Name" : "xsmalltext", "Ordinal" : 7 },
{ "Name" : "xtext", "Ordinal" : 8},
{ "Name" : "xnumberAsText", "Ordinal" : 9 },
{ "Name" : "xtime", "Ordinal" : 10},
{ "Name" : "xtextWithNulls", "Ordinal" : 11 },
{ "Name" : "xdynamicWithNulls", "Ordinal" : 12 },
{ "Name" : "xanothertext", "Ordinal" : 13 },
{ "Name" : "constvalue", "ConstValue" : "some value"}
]
```      

## JSON Mapping

When the source file is in JSON format, this maps the file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Json mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a single or multiple columns as a dictionary and may contain the following properties: 

|Property|Description|
|----|--|
|`columns`|Target columns' names to be mapped to the same property. Can be used instead of or in addition to `column`.|
|`path`|If starts with `$`: JSON path to the field that will become the content of the column in the JSON document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used.|
|`transform`|(Optional) Transformation that should be applied on the content. See [mapping transformations](#mapping-transformations).|


### Example of the JSON Mapping

``` json
[
  { "column" : "rownumber", "Properties":{"Path":"$.rownumber"}}, 
  { "column" : "rowguid", "Properties":{"Path":"$.rowguid"}}, 
  { "column" : "xdouble", "Properties":{"Path":"$.xdouble"}}, 
  { "column" : "xbool", "Properties":{"Path":"$.xbool"}}, 
  { "column" : "xint32", "Properties":{"Path":"$.xint32"}}, 
  { "column" : "xint64", "Properties":{"Path":"$.xint64"}}, 
  { "column" : "xdate", "Properties":{"Path":"$.xdate"}}, 
  { "column" : "xsmalltext", "Properties":{"Path":"$.xsmalltext"}}, 
  { "column" : "xtext", "Properties":{"Path":"$.xtext"}}, 
  { "column" : "xnumberAsText", "Properties":{"Path":"$.xnumberAsText"}}, 
  { "column" : "xtime", "Properties":{"Path":"$.xtime"}}, 
  { "column" : "xtextWithNulls", "Properties":{"Path":"$.xtextWithNulls"}}, 
  { "column" : "xdynamicWithNulls", "Properties":{"Path":"$.xdynamicWithNulls"}}, 
  { "column" : "sourceLocation", "Properties":{"transform":"SourceLocation"}}, 
  { "column" : "sourceLineNumber", "Properties":{"transform":"SourceLineNumber"}}, 
  { "column" : "xanothertext", "datatype" : "string",  "Properties":{"Path":"$.xanothertext"}},
  { "column" : "event_as_jason_document", "datatype" : "dynamic", "Properties":{"Path":"$"}}
]
```      
 **Note**
 
 *  When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string:

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with @'{"ingestionMapping" : "[{\"column\":\"rownumber\",\"Properties\":{\"Path\":\"$.rownumber\"}},{\"column\":\"rowguid\",\"Properties\":{\"Path\":\"$.rowguid\"}},...]","ingestionMappingType":"Json", "format":"json"}'
```

* Deprecated JSON mapping:

``` json
[
  { "column" : "rownumber", "path" : "$.rownumber"},
  { "column" : "rowguid", "path" : "$.rowguid" },
  { "column" : "xdouble", "path" : "$.xdouble" },
  { "column" : "xbool", "path" : "$.xbool" },
  { "column" : "xint32", "path" : "$.xint32" },
  { "column" : "xint64", "path" : "$.xint64" },
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
  { "column" : "event_as_json_document", "path" : "$", "datatype" : "dynamic" }
]
```      
    
## Avro Mapping

When the source file is in Avro format, this maps the Avro file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. 
The columns mapped in the Avro Mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the list describes a single or multiple columns as a dictionary and may contain the following properties: 

|Property|Description|
|----|--|
|`field`|The name of the field in the Avro record|
|`path`|Alternative of using `field` which allows taking inner part of an Avro record-field if necessarry. The value denotes JSON-path from the root of the record. See Notes section below for more information. |
|`transform`|(Optional) Transformation that should be applied on the content. See [supported transformations](#mapping-transformations).|

**Notes**
- `field` and `path` cannot be used together - only one is allowed. 
- `path` cannot point to root `$` only, it must have at least one level of path.
- The two alternatives below are equal:

``` json
[
  {"column": "rownumber", "Properties":{"Field":"RowNumber"}}
]
```

``` json
[
  {"column": "rownumber", "Properties":{"Path":"$.RowNumber"}}
]
```

### Example of the AVRO mapping

``` json
[
  {"column": "rownumber", "Properties":{"Field":"rownumber"}},
  {"column": "rowguid", "Properties":{"Field":"rowguid"}},
  {"column": "xdouble", "Properties":{"Field":"xdouble"}},
  {"column": "xfloat", "Properties":{"Field":"xfloat"}},
  {"column": "xboolean", "Properties":{"Field":"xboolean"}},
  {"column": "xint32", "Properties":{"Field":"xint32"}},
  {"column": "xint64", "Properties":{"Field":"xint64"}},
  {"column": "xdate", "Properties":{"Field":"xdate"}},
  {"column": "xsmalltext", "Properties":{"Field":"xsmalltext"}},
  {"column": "xtext", "Properties":{"Field":"xtext"}},
  {"column": "xnumberastext", "Properties":{"Field":"xnumberastext"}},
  {"column": "xtime", "Properties":{"Field":"xtime"}},
  {"column": "xtextwithnulls", "Properties":{"Field":"xtextwithnulls"}},
  {"column": "xdynamicwithnulls", "Properties":{"Field":"xdynamicwithnulls"}},
  {"column": "xanothertext", "Properties":{"Field":"xanothertext"}},
]
``` 
**Notes**
* When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string: 

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with @'{"ingestionMapping": "[{\"column\":\"rownumber\", \"Properties\":{\"Field\":\"RowNumber\"}},{\"column\":\"rowguid\",\"Properties\":{\"Field\":\"rowguid\"}},...]","ingestionMappingType":"Avro", format":"avro"}'
```
* Deprecated AVRO mapping:
``` json
[
  {"column": "rownumber", "field": "RowNumber" },
  {"column": "rowguid", "field": "RowGuid" },
  {"column": "xdouble", "field": "XDouble" },
  {"column": "xboolean", "field": "XBoolean" },
  {"column": "xint32", "field": "XInt32" },
  {"column": "xint64", "field": "XInt64" },
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

## Parquet Mapping

When the source file is in Parquet format, this maps the file content to the Kusto table. The table must exist in the Kusto database unless a valid datatype is specified for all the columns mapped. The columns mapped in the Parquet mapping must exist in the Kusto table unless a datatype is specified for all the non-existing columns.

Each element in the mapping list describes a single column and may contain the following properties:

|Property|Description|
|----|--|
|`path`|If starts with `$`: JSON path to the field that will become the content of the column in the Parquet document (JSON path that denotes the entire document is `$`). If the value does not start with `$`: a constant value is used.|
|`transform`|(Optional) Transformation that should be applied on the content. See [mapping transformations](#mapping-transformations).|


### Example of the Parquet Mapping

``` json
[
  { "column" : "rownumber", "Properties":{"Path":"$.rownumber"}}, 
  { "column" : "rowguid", "Properties":{"Path":"$.rowguid"}}, 
  { "column" : "xdouble", "Properties":{"Path":"$.xdouble"}}, 
  { "column" : "xbool", "Properties":{"Path":"$.xbool"}}, 
  { "column" : "xint32", "Properties":{"Path":"$.xint32"}}, 
  { "column" : "xint64", "Properties":{"Path":"$.xint64"}}, 
  { "column" : "xdate", "Properties":{"Path":"$.xdate"}}, 
  { "column" : "xsmalltext", "Properties":{"Path":"$.xsmalltext"}}, 
  { "column" : "xtext", "Properties":{"Path":"$.xtext"}}, 
  { "column" : "xnumberAsText", "Properties":{"Path":"$.xnumberAsText"}}, 
  { "column" : "xtime", "Properties":{"Path":"$.xtime"}}, 
  { "column" : "xtextWithNulls", "Properties":{"Path":"$.xtextWithNulls"}}, 
  { "column" : "xdynamicWithNulls", "Properties":{"Path":"$.xdynamicWithNulls"}}, 
  { "column" : "sourceLocation", "Properties":{"transform":"SourceLocation"}}, 
  { "column" : "sourceLineNumber", "Properties":{"transform":"SourceLineNumber"}}, 
  { "column" : "xanothertext", "datatype" : "string",  "Properties":{"Path":"$.xanothertext"}},
  { "column" : "event_as_jason_document", "datatype" : "dynamic", "Properties":{"Path":"$"}}
]
```      

**Note**

When the mapping above is provided as part of the `.ingest` control command it is serialized as JSON string:

```kusto
.ingest into Table123 (@"source1", @"source2") 
  with @'{"ingestionMapping" : "[{\"column\":\"rownumber\",\"Properties\":{\"Path\":\"$.rownumber\"}},{\"column\":\"rowguid\",\"Properties\":{\"Path\":\"$.rowguid\"}},...]","ingestionMappingType":"Parquet", "format":"parquet"}'
```

## Mapping transformations

Some of the data format mappings (Parquet, Json and Avro) support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time - one can use [Update policy](update-policy.md), which allows defining a lightweight processing using KQL expression.

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