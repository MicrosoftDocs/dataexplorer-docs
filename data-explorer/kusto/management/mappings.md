---
title:  Data mappings
description: This article describes Data mappings in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/08/2023
---

# Data mappings

Data mappings are used during ingestion to map incoming data to columns inside tables.

Data Explorer supports different types of mappings, both row-oriented (CSV, JSON, AVRO and W3CLOGFILE), and column-oriented (Parquet and ORC).

Each element in the mapping list is constructed from three fields:

| Property    | Required | Description                                                                                                   |
|-------------|----------|---------------------------------------------------------------------------------------------------------------|
| Column      | &check;  | Target column name in the table.                                                                              |
| Datatype    |          | Datatype with which to create the mapped column if it doesn't already exist in the table.                     |
| Properties  |          | Property-bag containing properties specific for each mapping as described in each specific mapping type page. |

[!INCLUDE [data-mapping-type-note](../../includes/data-mapping-type-note.md)]

The mappings can be [pre-created](create-ingestion-mapping-command.md) and can be referenced from the ingest command using `ingestionMappingReference` parameters.

Ingestion is possible without specifying a mapping. See [identity mapping](#identity-mapping).

## Supported mapping types

The following table defines mapping types to be used when ingesting or querying external data of a specific format.

| Data Format | Mapping Type |
|-------------|-----------------------------------------------|
| JSON        | [JSON Mapping](json-mapping.md)               |
| CSV         | [CSV Mapping](csv-mapping.md)                 |
| TSV         | [CSV Mapping](csv-mapping.md)                 |
| PSV         | [CSV Mapping](csv-mapping.md)                 |
| SCSV        | [CSV Mapping](csv-mapping.md)                 |
| SOHsv       | [CSV Mapping](csv-mapping.md)                 |
| TXT         | [CSV Mapping](csv-mapping.md)                 |
| RAW         | [CSV Mapping](csv-mapping.md)                 |
| AVRO        | [AVRO Mapping](avro-mapping.md)               |
| W3CLOGFILE  | [W3CLOGFILE Mapping](w3c-log-file-mapping.md) |
| Parquet     | [Parquet Mapping](parquet-mapping.md)         |
| ORC         | [ORC Mapping](orc-mapping.md)                 |

## Identity mapping

Ingestion is possible without specifying `ingestionMapping` or `ingestionMappingReference` properties. The data will be mapped using an identity data mapping derived from the table's schema. The table schema will remain the same. `format` property should be specified. See [ingestion formats](../../ingestion-supported-formats.md).

| Format type                                                                                             | Format                                           | Mapping logic                                                                                                                                                    |
|---------------------------------------------------------------------------------------------------------|--------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Tabular data formats with defined order of columns, such as delimiter-separated or single-line formats. | CSV, TSV, TSVe, PSV, SCSV, Txt, SOHsv, Raw       | All table columns are mapped in their respective order to data columns in order they appear in the data source. Column data type is taken from the table schema. |
| Formats with named columns or records with named fields.                                                | JSON, Parquet, Avro, ApacheAvro, Orc, W3CLOGFILE | All table columns are mapped to data columns or record fields having the same name (case-sensitive). Column data type is taken from the table schema.            |

> [!WARNING]
> Any mismatch between the table schema and the structure of data, such as column or field data types, column or field names or their number might result in empty or incorrect data ingested.

## Mapping transformations

Some of the data format mappings (Parquet, JSON and AVRO) support simple and useful ingest-time transformations. Where the scenario requires more complex processing at ingest time, use [Update policy](./show-table-update-policy-command.md), which allows defining lightweight processing using KQL expression.

| Path-dependant transformation | Description                                                                                                                                                             | Conditions                               |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| PropertyBagArrayToDictionary  | Transforms JSON array of properties, such as {events:[{"n1":"v1"},{"n2":"v2"}]}, to dictionary and serializes it to valid JSON document, such as {"n1":"v1","n2":"v2"}. | Can be applied only when `Path` is used. |
| SourceLocation                | Name of the storage artifact that provided the data, type string (for example, the blob's "BaseUri" field).                                                             |                                          |
| SourceLineNumber              | Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).                                                                |                                          |
| DateTimeFromUnixSeconds       | Converts number representing unix-time (seconds since 1970-01-01) to UTC datetime string.                                                                               |                                          |
| DateTimeFromUnixMilliseconds  | Converts number representing unix-time (milliseconds since 1970-01-01) to UTC datetime string.                                                                          |                                          |
| DateTimeFromUnixMicroseconds  | Converts number representing unix-time (microseconds since 1970-01-01) to UTC datetime string.                                                                          |                                          |
| DateTimeFromUnixNanoseconds   | Converts number representing unix-time (nanoseconds since 1970-01-01) to UTC datetime string.                                                                           |                                          |
