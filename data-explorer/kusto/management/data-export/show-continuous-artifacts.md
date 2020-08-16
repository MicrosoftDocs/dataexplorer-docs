---
title: Show continuous data export artifacts - Azure Data Explorer
description: This article describes how to show continuous data export artifacts in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/03/2020
---
# Show continuous export artifacts

Returns all artifacts exported by the continuous-export in all runs. Filter the results by the Timestamp column in the command to view only records of interest. The history of exported artifacts is retained for 14 days. 

## Syntax

`.show` `continuous-export` *ContinuousExportName* `exported-artifacts`

## Properties

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export. |

## Output

| Output parameter  | Type     | Description                            |
|-------------------|----------|----------------------------------------|
| Timestamp         | Datetime | Timestamp of the continuous export run |
| ExternalTableName | String   | Name of the external table             |
| Path              | String   | Output path                            |
| NumRecords        | long     | Number of records exported to path     |

## Example

```kusto
.show continuous-export MyExport exported-artifacts | where Timestamp > ago(1h)
```

| Timestamp                   | ExternalTableName | Path             | NumRecords | SizeInBytes |
|-----------------------------|-------------------|------------------|------------|-------------|
| 2018-12-20 07:31:30.2634216 | ExternalBlob      | `http://storageaccount.blob.core.windows.net/container1/1_6ca073fd4c8740ec9a2f574eaa98f579.csv` | 10                          | 1024              |
