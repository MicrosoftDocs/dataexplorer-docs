---
title:  Ingestion mappings
description: This article describes ingestion mappings in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/26/2023
---

# Ingestion mappings

Ingestion mappings are used during ingestion to map incoming data to columns inside tables.

Data Explorer supports different types of mappings, both row-oriented (CSV, JSON, AVRO and W3CLOGFILE), and column-oriented (Parquet and ORC).

Ingestion mappings can be [pre-created](create-ingestion-mapping-command.md) and can be referenced from the ingest command using `ingestionMappingReference` parameters. Although, ingestion is possible without specifying a mapping. For more information, see [identity mapping](#identity-mapping).

Each element in the mapping list is constructed from three fields:

| Property    | Required | Description                                                                                                   |
|-------------|----------|---------------------------------------------------------------------------------------------------------------|
| Column      |  :heavy_check_mark:  | Target column name in the table.                                                                              |
| Datatype    |          | Datatype with which to create the mapped column if it doesn't already exist in the table.                     |
| Properties  |          | Property-bag containing properties specific for each mapping as described in each specific mapping type page. |

[!INCLUDE [data-mapping-type-note](../../includes/data-mapping-type-note.md)]

## Supported mapping types

The following table defines mapping types to be used when ingesting or querying external data of a specific format.

| Data Format | Mapping Type |
|-------------|-----------------------------------------------|
| CSV         | [CSV Mapping](csv-mapping.md)                 |
| TSV         | [CSV Mapping](csv-mapping.md)                 |
| TSVe        | [CSV Mapping](csv-mapping.md)                 |
| PSV         | [CSV Mapping](csv-mapping.md)                 |
| SCSV        | [CSV Mapping](csv-mapping.md)                 |
| SOHsv       | [CSV Mapping](csv-mapping.md)                 |
| TXT         | [CSV Mapping](csv-mapping.md)                 |
| RAW         | [CSV Mapping](csv-mapping.md)                 |
| JSON        | [JSON Mapping](json-mapping.md)               |
| AVRO        | [AVRO Mapping](avro-mapping.md)               |
| APACHEAVRO  | [AVRO Mapping](avro-mapping.md)               |
| Parquet     | [Parquet Mapping](parquet-mapping.md)         |
| ORC         | [ORC Mapping](orc-mapping.md)                 |
| W3CLOGFILE  | [W3CLOGFILE Mapping](w3c-log-file-mapping.md) |

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
| PropertyBagArrayToDictionary  | Transforms JSON array of properties, such as `{events:[{"n1":"v1"},{"n2":"v2"}]}`, to dictionary and serializes it to valid JSON document, such as `{"n1":"v1","n2":"v2"}`. | Available for `JSON`, `Parquet`, `AVRO` and `ORC` mapping types. |
| SourceLocation                | Name of the storage artifact that provided the data, type string (for example, the blob's "BaseUri" field).|Available for `CSV`, `JSON`, `Parquet`, `AVRO`, `ORC` and `W3CLOGFILE` mapping types. |
| SourceLineNumber              | Offset relative to that storage artifact, type long (starting with '1' and incrementing per new record).   | Available for `CSV`, `JSON`, `Parquet`, `AVRO`, `ORC` and `W3CLOGFILE` mapping types. |
| DateTimeFromUnixSeconds       | Converts number representing unix-time (seconds since 1970-01-01) to UTC datetime string.| Available for `JSON`, `Parquet`, `AVRO` and `ORC` mapping types. |
| DateTimeFromUnixMilliseconds  | Converts number representing unix-time (milliseconds since 1970-01-01) to UTC datetime string. | Available for `JSON`, `Parquet`, `AVRO` and `ORC` mapping types. |
| DateTimeFromUnixMicroseconds  | Converts number representing unix-time (microseconds since 1970-01-01) to UTC datetime string. | Available for `JSON`, `Parquet`, `AVRO` and `ORC` mapping types. |
| DateTimeFromUnixNanoseconds   | Converts number representing unix-time (nanoseconds since 1970-01-01) to UTC datetime string. | Available for `JSON`, `Parquet`, `AVRO` and `ORC` mapping types. |
| DropMappedFields | Maps an object in the JSON document to a column and removes any nested fields already referenced by other column mappings. | Available for `JSON`, `Parquet`, `AVRO` and `ORC` mapping types. |
| BytesAsBase64 | Treats the data as byte array and converts it to a base64-encoded string. | Available for `AVRO` mapping type. For `ApacheAvro` format, the schema type of the mapped data field should be `bytes` or `fixed` Avro type. For `Avro` format, the field should be an array containing byte values from [0-255] range. `null` is ingested if the data does not represent a valid byte array. |

### Mapping transformation examples

####  `DropMappedFields` transformation:

Given the following JSON contents:

```json
{
    "Time": "2012-01-15T10:45",
    "Props": {
        "EventName": "CustomEvent",
        "Revenue": 0.456
    }
}
```

The following data mapping maps entire `Props` object into dynamic column `Props` while excluding
already mapped columns (`Props.EventName` is already mapped into column `EventName`, so it's
excluded).

```json
[
    { "Column": "Time", "Properties": { "Path": "$.Time" } },
    { "Column": "EventName", "Properties": { "Path": "$.Props.EventName" } },
    { "Column": "Props", "Properties": { "Path": "$.Props", "Transform":"DropMappedFields" } },
]
```

The ingested data looks as follows:

|  Time |        EventName           |   Props   |
|-------|----------------------------|-----------|
| `2012-01-15T10:45` | `CustomEvent` |  `{"Revenue": 0.456}`  |

#### `BytesAsBase64` transformation

Given the following AVRO file contents:

```json
{
    "Time": "2012-01-15T10:45",
    "Props": {
        "id": [227,131,34,92,28,91,65,72,134,138,9,133,51,45,104,52]
    }
}
```

The following data mapping maps the id column twice, with and without the transformation.

```json
[
    { "Column": "Id", "Properties": { "Path": "$.props.id" } },
    { "Column": "Base64EncodedId", "Properties": { "Path": "$.props.id", "Transform":"BytesAsBase64" } },
]
```

The ingested data looks as follows:

|  Id | Base64EncodedId   |
|-------|-----------|
| `[227,131,34,92,28,91,65,72,134,138,9,133,51,45,104,52]` | `44MiXBxbQUiGigmFMy1oNA==`  |
