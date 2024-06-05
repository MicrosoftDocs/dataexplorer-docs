---
title:  Show continuous data export artifacts
description:  This article describes how to show continuous data export artifacts.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# Show continuous export artifacts

Returns all artifacts exported by the continuous-export in all runs. Filter the results by the Timestamp column in the command to view only records of interest. The history of exported artifacts is retained for 14 days.
The command will not return any results if executed on a [follower database](../../../follower.md), it must be executed against the leader database.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `continuous-export` *ContinuousExportName* `exported-artifacts`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ContinuousExportName* | `string` |  :heavy_check_mark: | The name of the continuous export. |

## Returns

| Output parameter  | Type     | Description                            |
|-------------------|----------|----------------------------------------|
| Timestamp         | `datetime` | Timestamp of the continuous export run |
| ExternalTableName | `string` | Name of the external table             |
| Path              | `string` | Output path                            |
| NumRecords        | `long` | Number of records exported to path     |

## Example

```kusto
.show continuous-export MyExport exported-artifacts | where Timestamp > ago(1h)
```

| Timestamp                   | ExternalTableName | Path             | NumRecords | SizeInBytes |
|-----------------------------|-------------------|------------------|------------|-------------|
| 2018-12-20 07:31:30.2634216 | ExternalBlob      | `http://storageaccount.blob.core.windows.net/container1/1_6ca073fd4c8740ec9a2f574eaa98f579.csv` | 10                          | 1024              |
