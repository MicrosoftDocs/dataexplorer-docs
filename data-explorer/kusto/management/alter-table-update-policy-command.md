---
title:  .alter table update policy command
description: This article describes the .alter table update policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 03/08/2023
---
# .alter table update policy

Use this command to change the table update policy. The [update policy](updatepolicy.md) simplifies the process of syncing and updating data between two tables. When new data is inserted into the source table, a transformation query runs over this data to modify and insert the data into the target table.

> [!NOTE]
> The source table and the table for which the update policy is defined must be in the same database.
> The update policy function schema and the target table schema must match in their column names, types, and order.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `table` [ *DatabaseName*`.`]*TableName* `policy` `update` *ArrayOfPolicyObjects*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *DatabaseName* | string | | The name of the database. If you run the command from a database context that does not contain the specified table, then this parameter is required.|
| *TableName* | string | &check;| The name of the table.|
| *ArrayOfPolicyObjects* |string | &check; | A serialized array of policy objects. For more information, see [update policy](updatepolicy.md).|

## Returns

Returns a JSON representation of the policy.

## Example

Change the update policy for a table (using [multi-line string literals](../query/scalar-data-types/string.md#multi-line-string-literals)):

````kusto
.alter table MyDatabase.MyTable policy update
```
[
    {
        "IsEnabled": true,
        "Source": "MyTableX",
        "Query": "MyOtherTable",
        "IsTransactional": true,
        "PropagateIngestionProperties": false
    }
]
```
````
