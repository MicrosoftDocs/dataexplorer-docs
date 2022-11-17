---
title: Data mappings - Azure Data Explorer
description: This article describes Data mappings in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/16/2022
---

# Data mappings

Data mappings are used during ingestion to map incoming data to columns inside tables.

Data Explorer supports different types of mappings, both `row-oriented` (CSV, JSON, AVRO and W3CLOGFILE), and `column-oriented` (Parquet and ORC).

Each element in the mapping list is constructed from three properties:

|Property|Description|
|----|--|
|`Column`|Target column name in the table|
|`Datatype`| (Optional) Datatype with which to create the mapped column if it doesn't already exist in the table|
|`Properties`|(Optional) Property-bag containing properties specific for each mapping as described in each section below.|

The mappings can be [pre-created](create-ingestion-mapping-command.md) and can be referenced from the ingest command using `ingestionMappingReference` parameters.

Ingestion is possible without specifying a mapping (see [identity mapping](#identity-mapping)).

## Supported mapping types

* [CSV](csv-mapping.md)
* [JSON](json-mapping.md)
* [AVRO](avro-mapping.md)
* [W3CLOGFILE](w3clogfile-mapping.md)
* [Parquet](parquet-mapping.md)
* [ORC](orc-mapping.md)

## Identity mapping

Ingestion is possible without specifying `ingestionMapping` or `ingestionMappingReference` properties. The data will be mapped using an identity data mapping derived from the table's schema. The table schema will remain the same. `format` property should be specified. (see [ingestion formats](../../ingestion-supported-formats.md)).

|Format type|Format|Mapping logic|
|---------|---------| ---------|
|Tabular data formats with defined order of columns, such as delimiter-separated or single-line formats| `CSV`, `TSV`, `TSVe`, `PSV`, `SCSV`, `Txt`, `SOHsv`, `Raw`| All table columns are mapped in their respective order to data columns in order they appear in the data source. Column data type is taken from the table schema. |
|Formats with named columns or records with named fields|`JSON`, `Parquet`, `Avro`, `ApacheAvro`, `Orc`, `W3CLOGFILE`| All table columns are mapped to data columns or record fields having the same name (case-sensitive). Column data type is taken from the table schema. |

> [!WARNING]
> Any mismatch between the table schema and the structure of data, such as column or field data types, column or field names or their number might result in empty or incorrect data ingested.

## Mapping transformations

Some of the data format mappings (Parquet, JSON and AVRO) support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time, use [Update policy](./show-table-update-policy-command.md), which allows defining lightweight processing using KQL expression.

|Path-dependant transformation|Description|Conditions|
|--|--|--|
|`PropertyBagArrayToDictionary`|Transforms JSON array of properties (e.g. {events:[{"n1":"v1"},{"n2":"v2"}]}) to dictionary and serializes it to valid JSON document (for example, {"n1":"v1","n2":"v2"}).|Can be applied only when `Path` is used|
|`SourceLocation`|Name of the storage artifact that provided the data, type string (for example, the blob's "BaseUri" field).|
|`SourceLineNumber`|Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).|
|`DateTimeFromUnixSeconds`|Converts number representing unix-time (seconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMilliseconds`|Converts number representing unix-time (milliseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixMicroseconds`|Converts number representing unix-time (microseconds since 1970-01-01) to UTC datetime string|
|`DateTimeFromUnixNanoseconds`|Converts number representing unix-time (nanoseconds since 1970-01-01) to UTC datetime string|
