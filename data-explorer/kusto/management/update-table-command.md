---
title:  .update table command (preview)
description: Learn how to use the .update table command to perform transactional data updates.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 01/25/2024
---
# Update table (preview)

The `.update table` command performs data updates in a specified table by deleting and appending data atomically. This command is unrecoverable. This command doesn't support deleting more than 5 million records.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

There are two syntax options, [Simplified syntax](#simplified-syntax) and [Expanded syntax](#expanded-syntax).

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Simplified syntax

The simplified syntax only specifies an append query.  The delete query is deduced by finding all the existing rows having an *Id Column* value present in the append query:

`.update` `table` *TableName* on *IdColumnName* [`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`] `<|`

*appendQuery*

### Expanded syntax

The expanded syntax offers the most flexibility as you can define a query to delete rows and a different query to append rows:

`.update` `table` *TableName* `delete` *DeleteIdentifier* `append` *AppendIdentifier* [`with` `(` *propertyName* `=` *propertyValue* [`,` ...]`)`] `<|`

`let` *DeleteIdentifier*`=` ...`;`

`let` *AppendIdentifier*`=` ...`;`

## Parameters

| Name               | Type   | Required           | Description                                                                                                                                                                   |
| ------------------ | ------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *TableName*        | string | :heavy_check_mark: | The name of the table to update. The table name is always relative to the database in context.                                                                                |
| *IdColumnName*     | string | :heavy_check_mark: | The name of the column identifying rows.  The column must be present in both the table and *appendQuery*.                                                                     |
| *appendQuery*      | string | :heavy_check_mark: | The text of a query or a management command whose results are used as data to append.  The query's schema must be the same as the table's.  See [limitations](#limitations).  |
| *DeleteIdentifier* | string | :heavy_check_mark: | The identifier name used to specify the delete predicate applied to the updated table.  See [limitations](#limitations).                                                      |
| *AppendIdentifier* | string | :heavy_check_mark: | The identifier name used to specify the append predicate applied to the updated table.  The query's schema must be the same as the table's.  See [limitations](#limitations). |

The delete predicate must include at least one `where` operator, and can only only use the following operators: `extend`, `where`, `project`, `join` and `lookup`.
Both delete and append predicates can't use remote entities, cross-db, and cross-cluster entities. Predicates can't reference an external table or use the `externaldata` operator.

* Append and delete queries are expected to produce deterministic results.  Nondeterministic queries can lead to unexpected results.
  * A query is deterministic if and only if it would return the same data if executed multiple times
  * For instance, using the [`take` operator](../query/take-operator.md), [`sample` operator](../query/sample-operator.md), [`rand` function](../query/rand-function.md), etc. isn't recommended as they aren't deterministic.
  * The queries might be executed more than once within the `update` execution and if intermediate results are inconsistent, the update might produce unexpected results

## Supported properties

| Name     | Type | Description                                                                                                                                                |
| -------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *whatif* | bool | If `true`, returns the number of records that will be appended / deleted in every shard, without appending / deleting any records. The default is `false`. |

> [!IMPORTANT]
> We recommend running in `whatif` mode before executing the update, to validate the predicates before deleting or appending data.

## Returns

The result of the command is a table where each record represents an [extent](extents-overview.md) that was either created with new data or had records deleted in it.

| Name     | Type     | Description                                                                      |
| -------- | -------- | -------------------------------------------------------------------------------- |
| Table    | `guid`   | The table in which the extent was created or deleted.                            |
| Action   | `string` | "Create" or "Delete" depending on the action performed on the extent.            |
| ExtentId | `guid`   | The unique identifier for the extent that was created or deleted by the command. |
| RowCount | `long`   | The number of rows created or deleted in the specified extent by the command.    |

> [!NOTE]
> When you update a table that is the source for an update policy, the result of the command contains all generated results in all tables.

### Compare update command to materialized views

In some cases, you could use either the .update command or a [materialized view](materialized-views/materialized-view-overview) to achieve the same goal in a table.  For instance, a materialized view could be used to keep the latest version of each record or an update could be used to update records upon new version.  So which one would be a better option for you?

Use the following guidelines to identify which one you should use:

* If your update pattern isn't supported by materialized views, use the update command
* If the source table has a high ingestion volume, but only few updates, using the update command can be more performant and consume less cache / storage than materialized views. This is because materialized views need to reprocess all ingested data, which is less efficient than identifying the individual records to update based on the append/delete predicates.
* Materialized views is a fully managed solution. The materialized view is [defined once](materialized-views/materialized-view-create-or-alter) and materialization happens in the background by the system. Update command, on the other hand, requires an orchestrated process (for example, [Azure Data Factory](../..//data-factory-integration.md), [Logic Apps](../tools/logicapps.md), [Power Automate](../../flow.md), etc.) that explicitly executes the update command every time there are updates. Therefore, if materialized views work well enough for your use case, using materialized views is preferable and requires much less management and maintenance.

For example, the following command will change the column `State` to the value *Closed* for each row having value *2024-01-25T18:29:00.6811152Z* for column `Timestamp`.

```kusto
.update table MyTable delete D append A <|
  let D = MyTable
    | where Timestamp==datetime(2024-01-25T18:29:00.6811152Z);
  let A = MyTable
    | where Timestamp==datetime(2024-01-25T18:29:00.6811152Z)
    | extend State="Closed";
```

### Example: Simplified syntax

For instance, if the table original content is:

| Name  | Address                  |
| ----- | ------------------------ |
| Alice | 221B Baker street        |
| Bob   | 1600 Pennsylvania Avenue |
| Carl  | 11 Wall Street New York  |

And we perform the following update on it:

```kusto
.update table MyTable on Name <|
appendQuery
```

Where the *appendQuery* yields the following result set:

| Name  | Address            |
| ----- | ------------------ |
| Alice | 2 Macquarie Street |
| Diana | 350 Fifth Avenue   |

Since we updated *on* the `Name` column, the *Alice* row will be deleted and the table after the update will look like this:

| Name  | Address                  |
| ----- | ------------------------ |
| Alice | 2 Macquarie Street       |
| Bob   | 1600 Pennsylvania Avenue |
| Carl  | 11 Wall Street New York  |
| Diana | 350 Fifth Avenue         |

Notice that *Diana* wasn't found in the original table.  This is valid and no corresponding row was deleted.

Similarly, if there would have been multiple rows with *Alice* name in the original table, they would all have been deleted and replaced by the single *Alice* row we have in the end.

## Examples

We'll base the examples on the following table:

```kusto
.set-or-replace MyTable <|
  range i from 1 to 100 step 1
  | project Id=i
  | extend Code = tostring(dynamic(["Customer", "Employee"])[Id %2])
  | extend Color = tostring(dynamic(["Red", "Blue", "Gray"])[Id %3])
```

This creates a table with 100 records starting with:

| Id | Code     | Color |
| -- | -------- | ----- |
| 1  | Employee | Blue  |
| 2  | Customer | Gray  |
| 3  | Employee | Red   |
| 4  | Customer | Blue  |
| 5  | Employee | Gray  |
| 6  | Customer | Red   |
| 6  | Employee | Blue  |

### Updating a single column on one row

```kusto
.update table MyTable on Id with(whatif=true) <|
MyTable
| where Id==3
| extend Color="Orange"
```

Since we set `whatif` to true, the table is unchanged but the command returns that there would be an extent with one row deleted and a new extent with one row.

The following command actually performs the update:

```kusto
.update table MyTable on Id <|
MyTable
| where Id==3
| extend Color="Orange"
```

### Updating a single column on multiple rows

```kusto
.update table MyTable on Id <|
MyTable
| where Code=="Employee"
| where Color=="Blue"
| extend Color="Green"
```

Here we only updated the single column `Color` to *Green*. 

### Updating multiple columns on multiple rows

```kusto
.update table MyTable on Id <|
MyTable
| where Color=="Gray"
| extend Code=strcat("ex-", Code)
| extend Color=""
```

### Updating rows using another table

Here we first create the following mapping table:

```kusto
.set-or-replace ColorMapping <|
  datatable(OldColor:string, NewColor:string)[
    "Red", "Pink",
    "Blue", "Purple",
    "Gray", "LightGray",
    "Orange", "Yellow",
    "Green", "AppleGreen"
  ]
```

We then use that table to update map some Colors in our table:

```kusto
.update table MyTable on Id <|
MyTable
| where Code=="Customer"
| lookup ColorMapping on $left.Color==$right.OldColor
| project Id, Code, Color=NewColor
```

### Updating rows with a staging table

A popular pattern is to first land data in a temporary / staging table before updating the main table.

Here we first create the following staging table:

```kusto
.set-or-replace MyStagingTable <|
  range i from 70 to 130 step 5
  | project Id=i
  | extend Code = tostring(dynamic(["Customer", "Employee"])[Id %2])
  | extend Color = tostring(dynamic(["Red", "Blue", "Gray"])[Id %3])
```

We then update the main table with the data in the staging table:

```kusto
.update table MyTable on Id <|
MyStagingTable
| where true
```

Some records in the staging table didn't exist in the main table (that is, had `Id>100`) but were still inserted in the main table (upsert behavior).

### Complete syntax - Compound key

The simplified syntax assumes a single column can match rows in the *appendQuery* to infer rows to delete.  Sometimes we have more than one column (for example, in cases of compound keys).

Let's first create such a table with compound keys:

```kusto
.set-or-replace VersionedArticle <|
  datatable(ArticleId:string, Version:int, Detail:string)[
    "A", 1, "Early version",
    "B", 1, "News about mobiles",
    "C", 1, "Opinion article",
    "B", 2, "Revision about brand X",
    "B", 3, "Revision about brand Y",
    "C", 2, "Fact check"
  ]
```

We can still update a specific record with the complete syntax:

```kusto
.update table VersionedArticle delete D append A <|
let D = VersionedArticle
  | where ArticleId=="B"
  | where Version==3;
let A = VersionedArticle
  | where ArticleId=="B"
  | where Version==3
  | extend Detail = "Revision about brand Z";
```

### Complete syntax - Complete control

```kusto
.update table MyTable delete D append A <|
let D = MyTable
  | where Code=="Employee";
let A = MyTable
  | where Code=="Employee"
  | where Color=="Purple"
  | extend Code="Corporate"
  | extend Color="Mauve";
```

Here we delete all rows with `Code` *Employee* but append only the rows with `Code` *Employee* **and** `Color` purple.  That is, we delete more rows than we insert.

This is possible with the complete syntax as we control exactly what is deleted vs appended.
