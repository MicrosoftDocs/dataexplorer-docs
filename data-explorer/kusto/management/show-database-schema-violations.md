---
title: .show database schema violations
description: Learn how to use the `.show database schema violations` command to show schema violations within a database.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 10/04/2023
---
# .show database schema violations

This command identifies schema violations within a database. It performs a comprehensive validation of functions, materialized views, external tables, data mappings, continuous exports, and various policies.

## Permissions

You must have at least Database Viewer or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `schema` `violations`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database for which to validate the schema.|

## Returns

The command returns a table of schema validation issues within a database. The table contains the following columns:

|Column name|Description|
|--|--|
|Entity kind|The type of database entity.|
|Entity name|The name of the entity.|
|Property|The property of the entity being validated. For example, this value could be the name of a policy. For a list of policies, see [Policies overview](policies.md).|
|Reason|A message explaining the reason for the validation failure.|

## Example

```kusto
.show database MyDatabase schema violations
```

**Output**

|Entity kind|Entity name|Property|Reason|
|--|--|--|--|
|Function|DiagnosticMetricsExpand||Request is invalid and cannot be processed: Semantic error: SEM0100: 'mvexpand' operator: Failed to resolve table or column expression named 'DiagnosticRawRecords'|
|ContinuousExport|SampleMetricsExport||Continuous export job 'SampleMetricsExport' is disabled|
|MaterializedView|DailyCovid19||Invalid Materialized view job: 'DailyCovid19'. Entity ID 'Covid19' of kind 'MaterializedView' was not found.|

## Related content

* [Best practices for schema management](management-best-practices.md)
