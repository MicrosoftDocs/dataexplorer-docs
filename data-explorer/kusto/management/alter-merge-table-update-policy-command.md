---
title:  .alter-merge table policy update command
description: Learn how to use the `.alter-merge table policy` command to change the table's update policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 06/01/2026
---
# .alter-merge table policy update command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Changes the table's update policy. The [update policy](update-policy.md) simplifies the process of syncing and updating data between two tables. When new data is inserted into the source table, a transformation query runs over this data to modify and insert the data into the target table.

> [!NOTE]
>
> * The source table and the table for which the update policy is defined must be in the same database.
> * The update policy function schema and the target table schema must match in their column names, types, and order.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` [ *DatabaseName* `.`]*TableName* `policy` `update` *ArrayOfPolicyObjects*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *DatabaseName* | `string` | | The name of the database. When you run the command from the database context that contains the table to alter, *DatabaseName* isn't required. |
| *TableName* | `string` |  :heavy_check_mark: | The name of the table. A wildcard, `*`, denotes all tables.|
| *ArrayOfPolicyObjects* | `string` |  :heavy_check_mark: | A serialized array of policy objects. For more information, see [update policy](update-policy.md).|

## Returns

Returns a JSON representation of the policy.

> [!WARNING]
> If an update policy is already defined on the table, the PolicyObjects specified in the command are added to the array of PolicyObjects in the existing policy. Entries aren't  deduplicated, so if the exact same PolicyObject already exists in the current update policy, another entry will be added, potentially causing duplicates during ingestion time.

## Example

The following command changes the update policy for a table using [multi-line string literals](../query/scalar-data-types/string.md#multi-line-string-literals).

````kusto
.alter-merge table MyDatabase.MyTable policy update
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

::: moniker range="azure-data-explorer"

### Example with an accelerated external table reference

The following example adds an update policy entry whose query joins data from an accelerated external table. Because the external table uses impersonation authentication, the policy must include a `ManagedIdentity`:

````kusto
.alter-merge table MyDatabase.MyTargetTable policy update
```
[
    {
        "IsEnabled": true,
        "Source": "MySourceTable",
        "Query": "MySourceTable | join kind=leftouter (external_table('MyAcceleratedExternalTable')) on CommonKey | project-away CommonKey1",
        "IsTransactional": true,
        "PropagateIngestionProperties": false,
        "ManagedIdentity": "system"
    }
]
```
````

::: moniker-end

::: moniker range="microsoft-fabric"

### Example with an accelerated external table reference

The following example adds an update policy entry whose query joins data from an accelerated external table. In Fabric, the system automatically populates the `OwnerPrincipalDetails` property for authorization:

````kusto
.alter-merge table MyDatabase.MyTargetTable policy update
```
[
    {
        "IsEnabled": true,
        "Source": "MySourceTable",
        "Query": "MySourceTable | join kind=leftouter (external_table('MyAcceleratedExternalTable')) on CommonKey | project-away CommonKey1",
        "IsTransactional": true,
        "PropagateIngestionProperties": false
    }
]
```
````

> [!NOTE]
> When the policy is read back, the returned JSON may include a system-populated `OwnerPrincipalDetails` property. This property captures the identity of the user who sets or alters the update policy, and is used by the system for authorization when the query references external tables. The property is read-only and set automatically.

::: moniker-end