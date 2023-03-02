---
title: show materialized-view failures commands - Azure Data Explorer
description: This article describes show materialized-view failures commands in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---

# .show materialized-view failures

Returns failures that occurred as part of the materialization process of the materialized view.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName* `failures`

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | string | &check;  | Name of the materialized view. |

### Returns

| Name           | Type      | Description                                                |
|----------------|-----------|------------------------------------------------------------|
| Timestamp      | timestamp | Date and time when the failure ocurred.                    |
| OperationId    | string    | Operation identifier of the run that failed.               |
| Name           | string    | Name of the materialized view.                             |
| LastSuccessRun | datetime  | Date and time of the last run that completed successfully. |
| FailureKind    | string    | Type of failure (Permanent/Transient).                     |
| Details        | string    | Details of the failure.                                    |

## Examples

### Show failures occurred during materialization of a materialized view

The following command shows the failures, if any, ocurred during the materialization of materialized view ViewName:

```kusto
.show materialized-view ViewName failures
```

**Output:**

| Timestamp | OperationId | Name  | MaxCreatedOn                 | OriginalSize | ExtentSize | CompressedSize | IndexSize | Blocks | Segments | ReservedSlot1 | ReservedSlot2 | ExtentContainerId | RowCount | MinCreatedOn                 | Tags | Kind      | ReservedSlot3 | DeletedRowCount |
|-----------|-------------|------------|------------------------------|--------------|------------|----------------|-----------|--------|----------|---------------|---------------|-------------------|----------|------------------------------|------|-----------|---------------|-----------------|
