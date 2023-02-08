---
title: .show table ingestion time policy command- Azure Data Explorer
description: This article describes the .show table ingestion time policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/29/2021
---
# .show table ingestion time policy

Display a table's [ingestion time policy](ingestiontimepolicy.md). Azure Data Explorer can add an optional policy for tables to create a hidden `datetime` column in the table, called `$IngestionTime`. Whenever new data is ingested, the time of ingestion is recorded in the hidden column.

## Permissions

You must have Database User, Database Viewer, or Database Monitor to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `ingestiontime` 

## Arguments

*TableName* - Specify the name of the table.

## Returns

Returns a JSON representation of the policy.

### Examples

To show the policy:

```kusto
.show table table_name policy ingestiontime 
```
