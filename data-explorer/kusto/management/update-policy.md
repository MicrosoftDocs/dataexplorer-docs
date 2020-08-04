---
title: Kusto update policy management - Azure Data Explorer
description: This article describes Update policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 08/04/2020
---
# update policy commands

The [update policy](updatepolicy.md) is a table-level policy object that automatically
runs a query and then ingests the results when data is ingested into another table.

## Show update policy

This command returns the update policy of the specified table,
or all tables in the default database if `*` is used as a table name.

### Syntax

* `.show` `table` *TableName* `policy` `update`
* `.show` `table` *DatabaseName*`.`*TableName* `policy` `update`
* `.show` `table` `*` `policy` `update`

### Returns

This command returns a table that has one record per table.

|Column    |Type    |Description                                                                                                                                                           |
|----------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|EntityName|`string`|The name of the entity the update policy is defined on                                                                                                                |
|Policies  |`string`|A JSON array indicating all update policies defined for the entity, formatted as [update policy object](updatepolicy.md#the-update-policy-object)|

### Example

```kusto
.show table DerivedTableX policy update 
```

|EntityName        |Policies                                                                                                                                    |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
|[TestDB].[DerivedTableX]|[{"IsEnabled": true, "Source": "MyTableX","Query": "MyUpdateFunction()","IsTransactional": false,"PropagateIngestionProperties": false}]|

## Alter update policy

This command sets the update policy of the specified table.

### Syntax

* `.alter` `table` *TableName* `policy` `update` *ArrayOfUpdatePolicyObjects*
* `.alter` `table` *DatabaseName*`.`*TableName* `policy` `update` *ArrayOfUpdatePolicyObjects*

*ArrayOfUpdatePolicyObjects* is a JSON array that has zero or more update policy objects defined.

> [!NOTE]
> * Use a stored function for the `Query` property of the update policy object.
   You will only need to modify the function definition, instead of the entire policy object.
> * If `IsEnabled` is set to `true`, then the following validations are performed on the update policy as it's being set:
>    * `Source` - Checks that the table exists in the target database.
>    * `Query` 
>        * Checks that the schema defined by the schema matches the one of the target table
>        * Checks that the query references the `source` table of the update policy. 
        Defining an update policy query which does not reference the source is possible by setting 
        `AllowUnreferencedSourceTable=true` in the *with* properties (see example below),
        but isn't recommended due to performance issues. For every ingestion to the source table, 
        all records in a different table are considered for the update policy execution.
 >       * Checks that the policy doesn't result in a cycle being created in the chain of update policies in the target database.
 > * If `IsTransactional` is set to `true`, then checks that the `TableAdmin` permissions are also verified against `Source` (the source table).
 > * Test your update policy or function for performance, before applying it to run on each ingestion to the source table. For more information, see [testing an update policy's performance impact](updatepolicy.md#performance-impact).

### Returns

The command sets the table's update policy object, overriding any current policy,
and then returns the output of the corresponding [.show table update policy](#show-update-policy) command.

### Example

```kusto
// Create a function that will be used for update
.create function 
MyUpdateFunction()
{
    MyTableX
    | where ColumnA == 'some-string'
    | summarize MyCount=count() by ColumnB, Key=ColumnC
    | join (OtherTable | project OtherColumnZ, Key=OtherColumnC) on Key
    | project ColumnB, ColumnZ=OtherColumnZ, Key, MyCount
}

// Create the target table (if it doesn't already exist)
.set-or-append DerivedTableX <| MyUpdateFunction() | limit 0

// Use update policy on table DerivedTableX
.alter table DerivedTableX policy update
@'[{"IsEnabled": true, "Source": "MyTableX", "Query": "MyUpdateFunction()", "IsTransactional": false, "PropagateIngestionProperties": false}]'
```

* When an ingestion to the source table occurs, in this case, `MyTableX`, one or more extents (data shards) are created in that table
* The `Query` that is defined in the update policy object, in this case `MyUpdateFunction()`, will only run on those extents, and won't run on the entire table.
  * "Scoping" is done internally and automatically, and shouldn't be handled when defining the `Query`.
  * Only newly ingested records, that are different in each ingestion operation, will be taken into consideration when ingesting to the `DerivedTableX` derived table.

```kusto
// The following example will throw an error for not referencing the source table in the update policy query
// The policy's source table is MyTableX, whereas the query only references MyOtherTable. 
.alter table DerivedTableX policy update
@'[{"IsEnabled": true, "Source": "MyTableX", "Query": "MyOtherTable", "IsTransactional": false, "PropagateIngestionProperties": false}]'

// Adding the following properties will suppress the error (but is not recommended)
.alter table DerivedTableX policy update with (AllowUnreferencedSourceTable=true)
@'[{"IsEnabled": true, "Source": "MyTableX", "Query": "MyOtherTable", "IsTransactional": false, "PropagateIngestionProperties": false}]'

```

## .alter-merge table *TableName* policy update

This command modifies the update policy of the specified table.

**Syntax**

* `.alter-merge` `table` *TableName* `policy` `update` *ArrayOfUpdatePolicyObjects*
* `.alter-merge` `table` *DatabaseName*`.`*TableName* `policy` `update` *ArrayOfUpdatePolicyObjects*

*ArrayOfUpdatePolicyObjects* is a JSON array that has zero or more update policy objects defined.

> [!NOTE]
> * Use stored functions for the bulk implementation of the query property of the update policy object. 
     You'll only need to modify the function definition instead of the entire policy object.
> * The validations are the same as those done on an `alter` command.

**Returns**

The command appends to the table's update policy object, overriding any current policy, and then returns the output of the corresponding [.show table *TableName* update policy](#show-update-policy) command.

**Example**

```kusto
.alter-merge table DerivedTableX policy update 
@'[{"IsEnabled": true, "Source": "MyTableY", "Query": "MyUpdateFunction()", "IsTransactional": false}]'  
``` 

## .delete table *TableName* policy update

Deletes the update policy of the specified table.

**Syntax**

* `.delete` `table` *TableName* `policy` `update`
* `.delete` `table` *DatabaseName*`.`*TableName* `policy` `update`

**Returns**

The command deletes the table's update policy object and then returns the output of the corresponding [.show table *TableName* update policy](#show-update-policy) command.

**Example**

```kusto
.delete table DerivedTableX policy update 
```
