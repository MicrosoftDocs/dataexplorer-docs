---
title: .show external table artifacts command
description: Learn how to use the `.show external table artifacts` command to show external table artifacts for Azure Blob Storage or Azure Data Lake external tables.
ms.topic: reference
ms.date: 04/09/2023
---

# Show external table artifacts command

This article describes how to show all files that will be processed when querying a given external table.

## Permissions

You must have [Database User](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `external` `table` *ExternalTableName* `artifacts` [`limit` *MaxResults*]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ExternalTableName*|string| :heavy_check_mark:|The name of the external table.|
|*MaxResults*|int||The maximum number of results to return.|

> [!TIP]
> Iterating over all files referenced by an external table can be quite costly, depending on the number of files. Make sure to use `limit` parameter if you just want to see some URI examples.

## Returns

| Output parameter | Type   | Description                       |
|------------------|--------|-----------------------------------|
| Uri              | string | URI of external storage data file |
| Size             | long   | File length in bytes              |
| Partition        | dynamic | Dynamic object describing file partitions for partitioned external table |

## Example

```kusto
.show external table T artifacts
```

**Output**

| Uri | Size | Partition |
|--|--|--|
| `https://storageaccount.blob.core.windows.net/container1/folder/file.csv` | 10743 | `{}` |

For partitioned table, `Partition` column will contain extracted partition values:

**Output**

| Uri | Size | Partition |
|--|--|--|
| `https://storageaccount.blob.core.windows.net/container1/customer=john.doe/dt=20200101/file.csv` | 10743 | `{"Customer": "john.doe", "Date": "2020-01-01T00:00:00.0000000Z"}` |
