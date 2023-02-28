---
title: ".alter ingestion time policy command- Azure Data Explorer"
description: "This article describes the .alter ingestion time policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter ingestion time policy

Turn on or off a table's [ingestion time policy](ingestiontimepolicy.md). Azure Data Explorer can add an optional policy for tables to create a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column.

## Permissions

You must have at least [Table Ingestor](../management/access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `ingestiontime` *Flag*

`.alter` `tables` `(`*TableName*`,` ...`)` `policy` `ingestiontime` *Flag*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*|string|&check;|The name of the table.|
|*Flag*|bool|&check;|Determines whether to turn on or turn off the policy. `true` turns on the policy. `false` turns off the policy.

### Examples

To turn on the policy:

```kusto
.alter table table_name policy ingestiontime true
```

To turn off the policies of multiple tables:

```kusto
.alter tables (table1, table2) policy ingestiontime false
```
