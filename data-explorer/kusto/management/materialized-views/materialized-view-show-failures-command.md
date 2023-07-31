---
title:  .show materialized-view failures commands
description: This article describes show materialized-view failures commands in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/23/2023
---

# .show materialized-view failures

Returns failures that occurred as part of the materialization process of the materialized view.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName* `failures`

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | string | &check;  | Name of the materialized view. |

### Returns

| Name           | Type      | Description                                                |
|----------------|-----------|------------------------------------------------------------|
| Timestamp      | timestamp | Date and time when the failure occurred.                    |
| OperationId    | string    | Operation identifier of the run that failed.               |
| Name           | string    | Name of the materialized view.                             |
| LastSuccessRun | datetime  | Date and time of the last run that completed successfully. |
| FailureKind    | string    | Type of failure (Permanent/Transient).                     |
| Details        | string    | Details of the failure.                                    |

## Examples

### Show failures occurred during materialization of a materialized view

The following command shows the failures, if any, occurred during the materialization of materialized view ViewName:

```kusto
.show materialized-view ViewName failures
```

**Output:**

| Timestamp | OperationId | Name  | LastSuccessRun | FailureKind | Details |
|-----------|-------------|-------|----------------|-------------|---------|
