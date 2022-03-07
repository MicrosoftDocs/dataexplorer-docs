---
title: include file
description: include file
ms.topic: include
ms.date: 08/12/2020
ms.reviewer: tzgitlin
ms.custom: include file
---
|**Property** | **Property description**|
|---|---|
| `rawSizeBytes` | Size of the raw (uncompressed) data. For Avro/ORC/Parquet, that is the size before format-specific compression is applied. Provide the original data size by setting this property to the uncompressed data size in bytes.|
| `kustoTable` |  Name of the existing target table. Overrides the `Table` set on the `Data Connection` blade. |
| `kustoDataFormat` |  Data format. Overrides the `Data format` set on the `Data Connection` blade. |
| `kustoIngestionMappingReference` |  Name of the existing ingestion mapping to be used. Overrides the `Column mapping` set on the `Data Connection` blade.|
| `kustoIgnoreFirstRecord` | If set to `true`, Kusto ignores the first row of the blob. Use in tabular format data (CSV, TSV, or similar) to ignore headers. |
| `kustoExtentTags` | String representing [tags](../kusto/management/extents-overview.md#extent-tagging) that will be attached to resulting extent. |
| `kustoCreationTime` |  Overrides [Extent Creation time](../kusto/management/extents-overview.md#extent-creation-time) for the blob, formatted as an ISO 8601 string. Use for backfilling. |
