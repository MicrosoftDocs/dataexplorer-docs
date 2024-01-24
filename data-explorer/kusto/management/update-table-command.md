---
title:  .update table command
description: Learn how to use the .update table command to perform transactional data updates.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/25/2024
---
# Update table

The `.update table` command performs  data updates in a specified table by deleting and appending data atomically.

## Permissions

You must have at least [Table Ingestor](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

The update commands has two syntaxes.

### Complete Syntax

The complete syntax offers the most flexibility as you can define a query to delete rows and a different query to append rows:

`.update` `table` *TableName* `delete` *DeleteIdentifier* `append` *AppendIdentifier* [`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`] `<|`

`let` *DeleteIdentifier*`=` ...`;`

`let` *AppendIdentifier*`=` ...`;`

### Simplified syntax

The simplified syntax only takes an append query in.  It deduces the delete queries by finding all the existing rows having an *Id Column* value that is present in the append query:

`.update` `table` *TableName* on *IdColumnName* [`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`] `<|`

*appendQuery*

For instance, if the table original content is:

Name | Address
-|-
Alice|221B Baker street
Bob|1600 Pennsylvania Avenue
Carl|11 Wall Street New York

And we perform the following update on it:

```kusto
.update table MyTable on Name <|
appendQuery
```

Where the *appendQuery* yields the following result set:

Name | Address
-|-
Alice|2 Macquarie Street
Diana|350 Fifth Avenue

Since we updated *on* the `Name` column, the *Alice* row will be deleted and the table after the update will look like this:

Name | Address
-|-
Alice|2 Macquarie Street
Bob|1600 Pennsylvania Avenue
Carl|11 Wall Street New York
Diana|350 Fifth Avenue

Notice that *Diana* wasn't found in the original table.  This is valid and no corresponding row was deleted.

## Parameters

|Name|Type|Required|Description|
|---|---|---|---|
|*TableName*|string|&check;|The name of the table to update. The table name is always relative to the database in context.
|*IdColumnName*|string|&check;|The name of the column identifying rows.  The column must be present in both the table and *appendQuery*.
|*appendQuery*|string|&check;|The text of a query or a management command whose results are used as data to append.
|*DeleteIdentifier*|string|&check;|The identifier name used to specify the delete predicate applied to the updated table.
|*AppendIdentifier*|string|&check;|The identifier name used to specify the append predicate applied to the updated table.

## Supported properties

Name|Type|Description
|---|---|---|
|*whatif*|bool|If `true`, returns the number of records that will be appended / deleted in every shard, without actually appending / deleting any records. The default is `false`.

## Returns

The result of the command is a table where each record represent an [extent](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/management/extents-overview) that was either created (with new data) or had records deleted in it.

|Name       |Type      |Description                                                                |
|-----------|----------|---------------------------------------------------------------------------|
|Table   |`guid`    |The table in which the extent was created or deleted.|
|Action |`string`  |"Create" or "Delete" depending on the action performed on the extent.|
|ExtentId   |`guid`    |The unique identifier for the extent that was created or deleted by the command.|
|RowCount   |`long`    |The number of rows created or deleted in the specified extent by the command.|

>[!NOTE]
> When you update a table that is the source for an update policy, the result of the command contains all generated results in all tables.

## Limitations

- This command does not support deleting more than 5 million records.
- The predicates for this command must meet the following requirements:
    - Delete predicate must include at least one `where` operator.
    - Delete predicate can only use the following operators: `extend`, `where` and `project`.
    - No remote entities, cross-db and cross-cluster entities can be referenced by both the delete and append predicates.
    - The predicates cannot reference other tables, nor external tables and the `externaldata` operator.
- The delete predicate is expected to produce deterministic results and failing to do so can result in unexpected results.

## .update vs Materialized Views

**VP Notes**:  I find this section important for guidance but I do not like its format.  I give an example not to be abstract but it makes the section extremelly long and story-like.  The exact syntax can be improved by the doc-writer, but please give feedback on the structure of the section.

In some cases, you could use either the .update command or a [materialized view](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/management/materialized-views/materialized-view-overview) to achieve the same goal in a table.  So which one would be a better option for you?

An example of such use case would be where a table `Widget` has a `Timestamp` and `WidgetId` column and we are only interested in the latest *version* of each widget.  We could define a materialized view as follow: 

```kusto
.create materialized-view LatestWidget on table Widget
{
    Widget
    | summarize arg_max(Timestamp, *) by WidgetId
}
```

Or, similarly, upon new data being available for that table, we could `.update` the table.

We would recommend to use the `.update` in the following conditions:

* Materialized View doesn't support your update pattern
* The table has few updates compare to the ingestion rate ; for instance, maybe you ingest data all day but do corrections (updates) on records only once a day (or a week) on few records

The rational behind the second point is that Materialized View uses more storage (for the source table and the materialized view) and resources (ingested data is always compared to existing data).  If you know that updates are exceptional (occurs rarely), running `.update` will consume less resources.

On the other hand, automating a process with `.update` requires an external agent to run the command (e.g. [Azure Data Factory](https://learn.microsoft.com/en-us/azure/data-explorer/data-factory-integration), [Logic Apps](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/tools/logicapps), [Power Automate](https://learn.microsoft.com/en-us/azure/data-explorer/flow), etc.) while a Materialized View is self-sufficient.

## Examples

We will base the examples on the following table:

```kusto
.set-or-replace MyTable <|
  range i from 1 to 100 step 1
  | project Id=i
  | extend Code = tostring(dynamic(["Customer", "Employee"])[Id %2])
  | extend Colour = tostring(dynamic(["Red", "Blue", "Gray"])[Id %3])
```

This creates a table with 100 records starting with:

Id|Code|Colour
-|-|-
1|Employee|Blue
2|Customer|Gray
3|Employee|Red
4|Customer|Blue
5|Employee|Gray
6|Customer|Red
6|Employee|Blue

### Updating a single column on one row

```kusto
.update table MyTable on Id with(whatif=true) <|
MyTable
| where Id==3
| extend Colour="Orange"
```

Since we set `whatif` to true, the table is unchanged but the command returns that there would be an extent with one row deleted and a new extent with one row.

The following command actually performs the update:

```kusto
.update table MyTable on Id <|
MyTable
| where Id==3
| extend Colour="Orange"
```

### Updating a single column on multiple rows

```kusto
.update table MyTable on Id <|
MyTable
| where Code=="Employee"
| where Colour=="Blue"
| extend Colour="Green"
```

Here we only updated the single column `Colour` to *Green*. 

### Updating multiple columns on multiple rows

```kusto
.update table MyTable on Id <|
MyTable
| where Colour=="Gray"
| extend Code=strcat("ex-", Code)
| extend Colour=""
```

### Updating rows using another table

Here we first create the following mapping table:

```kusto
.set-or-replace ColourMapping <|
  datatable(OldColour:string, NewColour:string)[
    "Red", "Pink",
    "Blue", "Purple",
    "Gray", "LightGray",
    "Orange", "Yellow",
    "Green", "AppleGreen"
  ]
```

We then use that table to update map some colours in our table:

```kusto
.update table MyTable on Id <|
MyTable
| where Code=="Customer"
| lookup ColourMapping on $left.Colour==$right.OldColour
| project Id, Code, Colour=NewColour
```

### Updating rows with a staging table

A popular pattern is to first land data in a temporary / staging table before updating the main table.

Here we first create the following staging table:

```kusto
.set-or-replace MyStagingTable <|
  range i from 70 to 130 step 5
  | project Id=i
  | extend Code = tostring(dynamic(["Customer", "Employee"])[Id %2])
  | extend Colour = tostring(dynamic(["Red", "Blue", "Gray"])[Id %3])
```

We then update the main table with the data in the staging table:

```kusto
.update table MyTable on Id <|
MyStagingTable
| where true
```

Note that some records in the staging table didn't exist in the main table (i.e. had `Id>100`) but were still inserted in the main table (upsert behaviour).

### Complete syntax - Compound key

```kusto
.update table MyTable delete D append A <|
let D = MyTable
  | where Code=="Customer"
  | where Colour=="Blue";
let A = MyTable
  | where Code=="Customer"
  | where Colour=="Blue"
  | extend Colour = "AppleGreen";
```

Here we do not identify the rows to update by one column (the `Id` column) but by two columns (`Code` and `Colour`).

This is possible with the complete syntax since the simplified syntax assumed a single column to match deletes with appends.

### Complete syntax - Complete control

```kusto
.update table MyTable delete D append A <|
let D = MyTable
  | where Code=="Employee";
let A = MyTable
  | where Code=="Employee"
  | where Colour=="Purple"
  | extend Code="Corporate"
  | extend Colour="Mauve";
```

Here we delete all rows with `Code` *Employee* but append only the rows with `Code` *Employee* **and** `Colour` purple.  That is, we delete more rows than we insert.

This is possible with the complete syntax as we control exactly what is deleted vs appended.

