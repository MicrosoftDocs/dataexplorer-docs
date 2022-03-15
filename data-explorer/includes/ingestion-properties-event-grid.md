---
title: include file
description: include file
ms.topic: include
ms.date: 03/15/2022
ms.reviewer: tzgitlin
ms.custom: include file
---
|Property | Description|
|---|---|
| `rawSizeBytes` | Size of the raw (uncompressed) data. For Avro/ORC/Parquet, that is the size before format-specific compression is applied. Provide the original data size by setting this property to the uncompressed data size in bytes.|
| `kustoDatabase` | The case-sensitive name of the target database. By default, data is ingested into the target database associated with the data connection. Use this property to override the default database and send data to a different database. To do so, you must first [set up the connection as a multi-database connection](#route-event-data-to-an-alternate-database). |
| `kustoTable` | The case-sensitive name of the existing target table. Overrides the `Table` set on the `Data Connection` pane. |
| `kustoDataFormat` |  Data format. Overrides the `Data format` set on the `Data Connection` pane. |
| `kustoIngestionMappingReference` | Name of the existing [ingestion mapping](../kusto/management/create-ingestion-mapping-command.md) to be used. Overrides the `Column mapping` set on the `Data Connection` pane.|
| `kustoIgnoreFirstRecord` | If set to `true`, Kusto ignores the first row of the blob. Use in tabular format data (CSV, TSV, or similar) to ignore headers. |
| `kustoExtentTags` | String representing [tags](../kusto/management/extents-overview.md#extent-tagging) that will be attached to resulting extent. |
| `kustoCreationTime` | Overrides [Extent Creation time](../kusto/management/extents-overview.md#extent-creation-time) for the blob, formatted as an ISO 8601 string. Use for backfilling. |
