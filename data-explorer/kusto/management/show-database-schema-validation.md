---
title: .show database schema validation
description: Learn how ton use the `.show database schema validation` command to show find schema violations within a database.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 10/02/2023
---
# .show database schema validation

This command shows schema violations within a database. The command validates functions, materialized views, external tables, continuous exports, data mappings,n update policies, row level security policies, and the caching policy. For information about what is validated for each entity, see [Validation scenarios](#validation-scenarios).

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
|Property|The property of the entity being validated. For example, this could be the name of a policy. For a list of policies, see [Policies overview](policies.md).|
|Reason|A message explaining the reason for the validation failure.|

## Validation scenarios

The command performs validation checks for the following scenarios:

* A function references a non-existent table.
* A function references a non-existent function.
* A function references a function with incorrect parameters or parameter types.
* A function references a re-typed column.
* A function participates in a recursive loop.
* An update policy refers to a non-existent function or source table.
* An update policy refers to a function with an incompatible output schema.
* An update policy returns a scalar value instead of a tabular value.
* A row level security policy query output schema doesn't match the table's schema.
* A data mapping references a non-existent column.
* A materialized view references a non-existent source table.
* A materialized view references a non-existent dimension table.
* An external table blob path does not exist.
* A continuous export references a non-existent external table.
* A continuous export uses a deleted or blocked managed identity per the identity policy.
* A continuous export query output does not match the external table schema.
* A continuous export has been disabled.
* A caching policy uses a negative timespan value.

## Example

```kusto
.show database schema validation
```

**Output**

|Entity kind|Entity name|Property|Reason|
|--|--|--|--|
