---
title: Update policy - Azure Data Explorer | Microsoft Docs
description: This article describes Update policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# Update policy

The [update policy](../concepts/updatepolicy.md)
is a table-level policy object to automatically
run a query and ingest its results when data is ingested into another table.

## Show update policy

This command returns the update policy of the specified table,
or all tables in the default database if `*` is used as a table name.

**Syntax**

* `.show` `table` *TableName* `policy` `update`
* `.show` `table` *DatabaseName*`.`*TableName* `policy` `update`
* `.show` `table` `*` `policy` `update`

**Returns**

This command returns a table that has one record per table,
with the following columns:

|Column    |Type    |Description                                                                                                                                                           |
|----------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|EntityName|`string`|The name of the entity the update policy is defined on                                                                                                                |
|Policies  |`string`|A JSON array indicating all update policies defined for the entity, formatted as [update policy object](../concepts/updatepolicy.md#the-update-policy-object)|

**Example**

```kusto
.show table DerivedTableX policy update 
```

|EntityName        |Policies                                                                                                                                    |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
|[TestDB].[DerivedTableX]|[{"IsEnabled": true, "Source": "MyTableX","Query": "MyUpdateFunction()","IsTransactional": false,"PropagateIngestionProperties": false}]|

## Alter update policy

This command sets the update policy of the specified table.

**Syntax**

* `.alter` `table` *TableName* `policy` `update` *ArrayOfUpdatePolicyObjects*
* `.alter` `table` *DatabaseName*`.`*TableName* `policy` `update` *ArrayOfUpdatePolicyObjects*

*ArrayOfUpdatePolicyObjects* is a JSON array that has zero or more update policy objects defined.

**Notes**

1. It is recommended that one uses a stored function for the the `Query` property of the update policy object.
   This makes it easy to modify just the function definition instead of the entire policy object.

2. The following validations are performed on the update policy when it is being set (in case `IsEnabled` is set to `true`):
    1. `Source`: Table should exist in the target database.
    2. `Query`: The schema defined by the schema should match the one of the target table.
    3. The policy doesn't result with a cycle being created in the chain of Update Policies in the target database.
    4. In case `IsTransactional` is set to `true`, `TableAdmin` permissions are verified against `Source` (the source table) as well.
  
3. Make sure you test your update policy / function for performance before applying it to run on each ingestion to the source table -
   see [here](../concepts/updatepolicy.md#testing-an-update-policys-performance-impact).

**Returns**

The command sets the table's update policy object (overriding any current
policy defined, if any) and then returns the output of the corresponding [.show table TABLE update policy](#show-update-policy)
command.

**Example**

```kusto
// Creating function that will be used for update
.create function 
MyUpdateFunction()
{
    MyTableX
    | where ColumnA == 'some-string'
    | summarize MyCount=count() by ColumnB, Key=ColumnC
    | join (OtherTable | project OtherColumnZ, Key=OtherColumnC) on Key
    | project ColumnB, ColumnZ=OtherColumnZ, Key, MyCount
}

// Creating the target table (in case it doesn't already exist)
.set-or-append DerivedTableX <| MyUpdateFunction() | limit 0

// Use update policy on table DerivedTableX
.alter table DerivedTableX policy update
@'[{"IsEnabled": true, "Source": "MyTableX", "Query": "MyUpdateFunction()", "IsTransactional": false, "PropagateIngestionProperties": false}]'
```

- When an ingestion to the source table (in this case `MyTableX`) occurs, 1 or more extents (data shards) are created in that table.
- The `Query` which is defined in the update policy object (in this case `MyUpdateFunction()`) will only run on those extents, and will not run on the entire table.
  - This "scoping" is done internally and automatically, it should not be handled when defining the `Query`.
  - Only newly ingested records (different in each ingestion operation) will be taken into consideration when ingesting to the derived table (in this case `DerivedTableX`).


## .alter-merge table TABLE policy update

This command modifies the update policy of the specified table.

**Syntax**

* `.alter-merge` `table` *TableName* `policy` `update` *ArrayOfUpdatePolicyObjects*
* `.alter-merge` `table` *DatabaseName*`.`*TableName* `policy` `update` *ArrayOfUpdatePolicyObjects*

*ArrayOfUpdatePolicyObjects* is a JSON array that has zero or more update policy objects defined.

**Notes**

1. It is recommended that one use stored functions for the bulk implementation
   of the query property of the update policy object. This makes it easy to
   modify just the function definition instead of the entire policy object.

2. The same validations performed on the update policy in case of an `alter` command are performed for an `alter-merge` command.

**Returns**

The command appends to the table's update policy object (overriding any current
policy defined, if any) and then returns the output of the corresponding [.show table TABLE update policy](#show-update-policy)
command.

**Example**

```kusto
.alter-merge table DerivedTableX policy update 
@'[{"IsEnabled": true, "Source": "MyTableY", "Query": "MyUpdateFunction()", "IsTransactional": false}]'  
``` 

## .delete table TABLE policy update

Deletes the update policy of the specified table.

**Syntax**

* `.delete` `table` *TableName* `policy` `update`
* `.delete` `table` *DatabaseName*`.`*TableName* `policy` `update`

**Returns**

The command deletes the table's update policy object and then returns 
the output of the corresponding [.show table TABLE update policy](#show-update-policy)
command.

**Example**

```kusto
.delete table DerivedTableX policy update 
```