---
title:  .alter table policy ingestiontime command
description: Learn how to use the `.alter table policy ingestiontime` command to turn on or turn off a table's ingestion time policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/25/2023
---
# .alter table policy ingestiontime command

Turns on or turns off a table's [ingestion time policy](ingestion-time-policy.md). This policy adds a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column.

## Permissions

You must have at least [Table Ingestor](../management/access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `ingestiontime` *Flag*

`.alter` `tables` `(`*TableName*`,` ...`)` `policy` `ingestiontime` *Flag*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table.|
|*Flag*| `bool` | :heavy_check_mark:|Determines whether to turn on or turn off the policy. `true` turns on the policy. `false` turns off the policy.|

### Examples

To turn on the policy:

```kusto
.alter table table_name policy ingestiontime true
```

To turn off the policies of multiple tables:

```kusto
.alter tables (table1, table2) policy ingestiontime false
```
