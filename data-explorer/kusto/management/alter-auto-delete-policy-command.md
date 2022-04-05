---
title: ".alter auto delete policy command - Azure Data Explorer"
description: "This article describes the .alter auto delete policy command in Azure Data Explorer."
ms.reviewer: yifats
ms.topic: reference
ms.date: 01/04/2022
---
# .alter auto delete policy

Alters the auto delete policy that is applied to a table. For more information, see [auto delete policy](auto-delete-policy.md).

## Syntax

`.alter` `table` *TableName* `policy` `auto_delete` *SerializedPolicyObject* 

## Arguments

- *TableName* - The name of the table.
- *SerializedPolicyObject* - One serialized JSON policy object defined.

## Returns

Returns a JSON representation of the policy.

## Example

The following example sets the expiry of a table `T` to `2021-02-01`. The table will be deleted even if there are records in it (noted by `DeleteIfNotEmpty`).

```kusto
.alter table StormEvents policy auto_delete @'{ "ExpiryDate" : "2021-12-01", "DeleteIfNotEmpty": true }'
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|AutoDeletePolicy|[database].[StormEvents]|{ "ExpiryDate": "2021-12-01T00:00:00" "DeleteIfNotEmpty": true }| |Table|
