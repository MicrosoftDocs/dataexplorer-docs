---
title: Show continuous data export failures - Azure Data Explorer
description: This article describes how to show continuous data export failures in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/03/2020
---
# Show continuous export failures

Returns all failures logged as part of the continuous export. Filter the results by the Timestamp column in the command to view only time range of interest. 

## Syntax

`.show` `continuous-export` *ContinuousExportName* `failures`

## Properties

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export  |

## Output

| Output parameter | Type      | Description                                         |
|------------------|-----------|-----------------------------------------------------|
| Timestamp        | Datetime  | Timestamp of the failure.                           |
| OperationId      | String    | Operation ID of the failure.                    |
| Name             | String    | Continuous export name.                             |
| LastSuccessRun   | Timestamp | The last successful run of the continuous export.   |
| FailureKind      | String    | Failure/PartialFailure. PartialFailure indicates some artifacts were exported successfully before the failure occurred. |
| Details          | String    | Failure error details.                              |

## Example 

```kusto
.show continuous-export MyExport failures 
```

| Timestamp                   | OperationId                          | Name     | LastSuccessRun              | FailureKind | Details    |
|-----------------------------|--------------------------------------|----------|-----------------------------|-------------|------------|
| 2019-01-01 11:07:41.1887304 | ec641435-2505-4532-ba19-d6ab88c96a9d | MyExport | 2019-01-01 11:06:35.6308140 | Failure     | Details... |
