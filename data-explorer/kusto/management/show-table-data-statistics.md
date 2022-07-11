---
title: .show table data statistics - Azure Data Explorer
description: This article describes .show table data statistics command in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/07/2022
---

# .show table data statistics

Displays table data statistics estimation, per table column and storage engine version.

Requires [Database monitor permission](../management/access-control/role-based-authorization.md).

> [!NOTE]
> The command only returns statistics for data stored in columnar stores, row store data statistics
> are not included.

**Syntax**

`.show` `table` **T1** `data` `statistics` [ `with` `(` **Options** `)` ]

**Options**

The following options can be specified.

|Option Name| Description |
|--|--|
| `samplepercent` | Only scan this percentage of data. |
| `scope` | Specify `hotcache` to only scan hot cache data, or `all` to scan all the data. |
| `from` | Only scan data extents created after this time. |
| `to` | Only scan data extents created before this time. |

If no options are provided, only 1% of hot cache data is scanned.

**Output**

The command returns a result table that contains the following information.

| Column Name | Type | Description |
|--|--|--|
| `ColumnName` | string   | Table column name. |
| `ColumnType` | string   | Table column data type. |
| `ColumnId` | guid | Table column internal ID. |
| `OriginalSize` | long | Estimation for ingested data size in bytes. |
| `ExtentSize` | long | Estimation for total size of extents (data size + index size) in bytes. |
| `CompressionRatio` | real | Ratio of original data size to extent data size. |
| `DataCompressedSize` | long | Extents data size in bytes, excluding indexes. |
| `SharedIndexSize` | long | In case of [Engine V3](../../engine-v3.md), text index size in bytes. |
| `IndexSize` | long | Size of numeric indexes in bytes. For Engine V2, the value includes text index size as well. |
| `IndexSizePercent` | real | Ratio of the index size to original data size in bytes. |
| `StorageEngineVersion` | string | Engine version. If data exists for multiple engine versions, the output includes an entry for each one. |
| `PresentRowCount`	| long | Total rows count, excluding [deleted](../concepts/data-soft-delete.md) ones. |
| `DeletedRowCount` | long | [Deleted](../concepts/data-soft-delete.md) rows count. |
| `SamplePercent` | real | Actual data sampling percentage, which may differ from the hint provided in `samplepercent` option. |
| `IncludeColdData`	| bool | Whether cold data was taken into account when calculating statitics estimate. |

**Example**

```kusto
.show table Users data statistics with (scope="all", samplepercent=80)
```

|ColumnName|	ColumnType|	ColumnId|	OriginalSize|	ExtentSize|	CompressionRatio|	DataCompressedSize|	SharedIndexSize|	IndexSize|	IndexSizePercent|	StorageEngineVersion|	PresentRowCount|	DeletedRowCount|	SamplePercent|	IncludeColdData|
|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
|Name|	string|	45c15cfe-ef38-4153-97e7-c18d21651fc2|	60907|	137305|	0.44|	137305|	27787|	0|	0|	V3|	2500|	0|	80|	True|
|Usage|	real|	c0aa6668-0f73-46a1-874e-f1b19123eb61|	20000|	20282|	0.99|	20102|	27787|	180|	0.9|	V3|	2500|	0|	80|	True|
|ID|	long|	eb01bab7-da60-4515-a5d4-4780a827bd85|	20000|	5722|	3.49|	5152|	27787|	570|	2.85|	V3|	2500|	0|	80|	True|
