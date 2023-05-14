---
title: .delete ingestion time policy command- Azure Data Explorer
description: Learn how to use the `.delete ingestion time policy` command to delete a table's ingestion time policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete ingestion time policy

Delete a table's [ingestion time policy](ingestiontimepolicy.md). Azure Data Explorer can add an optional policy for tables to create a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `ingestiontime`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table for which to delete the ingestion time policy.|

### Example

The following command deletes the ingestion time policy for a table named `MyTable`.

```kusto
.delete table `MyTable` policy ingestiontime 
```
