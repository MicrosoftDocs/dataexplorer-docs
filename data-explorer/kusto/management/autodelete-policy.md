---
title: Auto delete policy commands - Azure Data Explorer | Microsoft Docs
description: This article describes Auto delete policy commands in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 03/02/2021
---
# Auto delete policy command

This article describes control commands used for managing the [auto delete policy](autodeletepolicy.md).

## show policy

```kusto
.show table [table_name] policy auto_delete
```
Displays the auto delete policy that is applied on the table.


### Output

|Policy name | Entity name | Policy | Child entities | Entity type
|---|---|---|---|---
|AutoDeletePolicy | Table name | JSON serialization of the policy object | null | Table

## alter policy

```kusto
.alter table [table_name] policy auto_delete 'policy object, serialized as JSON'
```

The `.alter` command allows changing the auto delete policy that is applied on the table.

### Examples

The following example sets the expiry of a table `T` to 2021-02-01. The table will be deleted even if there are records in it (noted by `DeleteIfNotEmpty`).

```kusto
.alter table T policy auto_delete @'{ "ExpiryDate" : "2021-02-01 18:00", "DeleteIfNotEmpty": true }'
```

## delete policy

```kusto
.delete table [table_name] policy auto_delete
```

The `.delete` command deletes the auto delete policy of the given table.
