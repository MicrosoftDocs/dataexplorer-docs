---
title: ".alter ingestion time policy command- Azure Data Explorer"
description: "This article describes the .alter ingestion time policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 11/29/2021
---
# .alter ingestion time policy

Enable or disable a table's [ingestion time policy](ingestiontimepolicy.md). Azure Data Explorer can add an optional policy for tables to create a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column.

## Permissions

You must have [Table Ingestor](../management/access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` *TableName* `policy` `ingestiontime` [true|false]
`.alter` `tables` (*TableName*, ...) `policy` `ingestiontime` [true|false]

## Arguments

*TableName* - Specify the name of the table.

### Examples

To enable the policy:

```kusto
.alter table table_name policy ingestiontime true
```

To disable the policies of multiple tables:

```kusto
.alter tables (table1, table2) policy ingestiontime false
```