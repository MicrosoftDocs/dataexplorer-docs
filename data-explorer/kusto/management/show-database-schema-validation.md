---
title: .show database schema validation
description: Learn how to use the `.show database schema validation` command to show schema violations within a database.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 10/02/2023
---
# .show database schema validation

This command shows schema violations within a database. For information about what the command validates, see [Validation scenarios](#validation-scenarios).

## Permissions

You must have at least Database Viewer or Database Monitor permissions to run this command. For more information, see [Kusto role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` `schema` `validation`

## Returns

The command returns a table of schema validation issues within a database. The table contains the following columns:

|Column name|Description|
|--|--|
|Entity kind|The type of database entity. For example, a function or table.|
|Entity name|The name of the entity.|
|Property|The property of the entity being validated. For example, this value could be the name of a policy. For a list of policies, see [Policies overview](policies.md).|
|Reason|A message explaining the reason for the validation failure.|

## Validation scenarios

The command performs validation checks for the following scenarios:

| Entity Kind | Scenario Description |
|--|--|
| [Cache policy](cachepolicy.md) | A cache policy uses a negative timespan value. |
| [Continuous export](data-export/continuous-data-export.md) | |
| | A continuous export has been disabled. |
| | A continuous export query output doesn't match the external table schema. |
| | A continuous export references a nonexistent external table. |
| | A continuous export uses a deleted or blocked managed identity per the identity policy. |
| [Data mapping](mappings.md) | A data mapping references a nonexistent column. |
| [External table](../query/schema-entities/externaltables.md) | An external table blob path doesn't exist. |
| [Function](../query/schema-entities/stored-functions.md) | |
| | A function participates in a recursive loop. |
| | A function references a retyped column. |
| | A function references a function with incorrect parameters or parameter types. |
| | A function references a nonexistent function. |
| | A function references a nonexistent table. |
| [Materialized view](materialized-views/materialized-view-overview.md) | |
| | A materialized view references a nonexistent dimension table. |
| | A materialized view references a nonexistent source table. |
| [Row level security policy](rowlevelsecuritypolicy.md) | A row level security policy query output schema doesn't match the table's schema. |
| [Update policy](updatepolicy.md) | |
| | An update policy refers to a function with an incompatible output schema. |
| | An update policy returns a scalar value instead of a tabular value. |
| | An update policy refers to a nonexistent function or source table. |

## Example

```kusto
.show database schema validation
```

**Output**

|Entity kind|Entity name|Property|Reason|
|--|--|--|--|
