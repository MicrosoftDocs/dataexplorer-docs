---
title: .show table ingestion time policy command- Azure Data Explorer
description: This article describes the .show table ingestion time policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 04/25/2023
---
# .show table ingestion time policy

Display a table's [ingestion time policy](ingestiontimepolicy.md). This policy creates a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `ingestiontime` 

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table for which to show the policy details.|

## Returns

Returns a JSON representation of the policy.

### Examples

To show the policy:

```kusto
.show table table_name policy ingestiontime 
```
