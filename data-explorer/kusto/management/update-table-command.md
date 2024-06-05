---
title:  .update table command (preview)
description: Learn how to use the update table command to perform transactional data updates.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 06/04/2024
---
# .update table command (preview)

The `.update table` command performs data updates in a specified table by deleting and appending records atomically.

> [!WARNING]
> This command is unrecoverable.

> [!NOTE]
> When you run the `.update table` command on a table that is the source for an [update policy](update-policy.md), the `.update table` command triggers these update policies for which the table being modified is the update policy source.
> 
> You can delete up to 5 million records in a single command.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

There are two syntax options, [Simplified syntax](#simplified-syntax) and [Expanded syntax](#expanded-syntax).

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Expanded syntax

The expanded syntax offers the flexibility to define a query to delete rows and a different query to append rows:

`.update` `table` *TableName* `delete` *DeleteIdentifier* `append` *AppendIdentifier* [`with` `(` *propertyName* `=` *propertyValue* `)`] `<|` <br>
`let` *DeleteIdentifier*`=` *DeletePredicate*`;` <br>
`let` *AppendIdentifier*`=` *AppendPredicate*`;`

### Parameters for expanded syntax

| Name               | Type     | Required           | Description                                                                                                                                                                                                                                         |
| ------------------ | -------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *TableName*        | `string` | :heavy_check_mark: | The name of the table to update.                                                                                                                                                                                                                    |
| *DeleteIdentifier* | `string` | :heavy_check_mark: | The identifier name used to specify the delete predicate applied to the updated table.                                                                                                                                                              |
| *DeletePredicate*  | `string` | :heavy_check_mark: | The text of a query whose results are used as data to delete. The delete predicate must include at least one `where` operator, and can only use the following operators: `extend`, `where`, `project`, `join` and `lookup`. |
| *AppendIdentifier* | `string` | :heavy_check_mark: | The identifier name used to specify the append predicate applied to the updated table.                                                                                                                                                              |
| *AppendPredicate*  | `string` | :heavy_check_mark: | The text of a query whose results are used as data to append.                                                                                                                                                               |

> [!IMPORTANT]
> * Both delete and append predicates can't use remote entities, cross-db, and cross-cluster entities. Predicates can't reference an external table or use the `externaldata` operator.
> * Append and delete queries are expected to produce deterministic results.  Nondeterministic queries can lead to unexpected results. A query is deterministic if and only if it would return the same data if executed multiple times.
>    * For example, use of [`take` operator](../query/take-operator.md), [`sample` operator](../query/sample-operator.md), [`rand` function](../query/rand-function.md), and other such operators isn't recommended because these operators aren't deterministic.
> * Queries might be executed more than once within the `update` execution. If the intermediate query results are inconsistent, the update command can produce unexpected results.

### Simplified syntax

The simplified syntax requires an append query and a key. The key is a column in the table that represents unique values in the table. This column is used to define which rows should be deleted from the table. A join is performed between the original table and the append query, to identify rows that agree on their value with respect to this column.

`.update` `table` *TableName* on *IDColumnName* [`with` `(` *propertyName* `=` *propertyValue* `)`] `<|` <br>
*appendQuery*

### Parameters for simplified syntax 

| Name               | Type     | Required           | Description                                                                                                                                       |
| ------------------ | -------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| *TableName*        | `string` | :heavy_check_mark: | The name of the table to update.                                                                                                                  |
| *IDColumnName*     | `string` | :heavy_check_mark: | The name of the column identifying rows. The column must be present in both the table and *appendQuery*.                                         |
| *appendQuery*      | `string` | :heavy_check_mark: | The text of a query or a management command whose results are used as data to append.  The query's schema must be the same as the table's schema. |

> [!IMPORTANT]
> * The append query can't use remote entities, cross-db, and cross-cluster entities, reference an external table, or use the `externaldata` operator.
> * The append query is expected to produce deterministic results.  Nondeterministic queries can lead to unexpected results. A query is deterministic if and only if it returns the same data if executed multiple times.
>    * For example, use of [`take` operator](../query/take-operator.md), [`sample` operator](../query/sample-operator.md), [`rand` function](../query/rand-function.md), and other such operators isn't recommended because these operators aren't deterministic.
> * Queries might be executed more than once within the `update` execution. If the intermediate query results are inconsistent, the update command can produce unexpected results.

## Supported properties

| Name     | Type | Description                                                                                                                                                |
| -------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *whatif* | bool | If `true`, returns the number of records that will be appended / deleted in every shard, without appending / deleting any records. The default is `false`. |
| *distributed* | bool | If `true`, the command ingests from all nodes executing the query in parallel. Default is `false`. See [performance tips](#performance-tips). |

> [!IMPORTANT]
> We recommend running in `whatif` mode first before executing the update to validate the predicates before deleting or appending data.

## Returns

The result of the command is a table where each record represents an [extent](extents-overview.md) that was either created with new data or had records deleted.

| Name     | Type     | Description                                                                      |
| -------- | -------- | -------------------------------------------------------------------------------- |
| Table    | `string`   | The table in which the extent was created or deleted.                            |
| Action   | `string` | *Create* or *Delete* depending on the action performed on the extent.            |
| ExtentId | `guid`   | The unique identifier for the extent that was created or deleted by the command. |
| RowCount | `long`   | The number of rows created or deleted in the specified extent by the command.    |

## Choose between `.update table` and materialized views

There are scenarios where you could use either the `.update table` command or a [materialized view](materialized-views/materialized-view-overview.md) to achieve the same goal in a table.  For example, a materialized view could be used to keep the latest version of each record or an update could be used to update records when a new version is available. 

Use the following guidelines to decide which method to use:

* If your update pattern isn't supported by materialized views, use the update command.
* If the source table has a high ingestion volume, but only few updates, using the update command can be more performant and consume less cache or storage than materialized views. This is because materialized views need to reprocess all ingested data, which is less efficient than identifying the individual records to update based on the append or delete predicates.
* Materialized views is a fully managed solution. The materialized view is [defined once](materialized-views/materialized-view-create-or-alter.md) and materialization happens in the background by the system. The update command requires an orchestrated process (for example, [Azure Data Factory](../../data-factory-integration.md), [Logic Apps](../tools/logicapps.md), [Power Automate](../../flow.md), and others) that explicitly executes the update command every time there are updates. If materialized views work well enough for your use case, using materialized views requires less management and maintenance.

## Performance tips

* Data ingestion is a resource-intensive operation that might affect concurrent activities on the cluster, including running queries.  We recommend that you avoid the following resource-intensive actions: running many `.update` commands at once, and intensive use of the *distributed* property.
* Limit the append data to less than 1 GB per operation. If necessary, use multiple update commands.
* Set the `distributed` flag to `true` only if the amount of data being produced by the query is large, exceeds 1 GB and doesn't require serialization:  multiple nodes can then produce output in parallel.  Don't use this flag when query results are small, since it might needlessly generate many small data shards.

## Examples -  Simplified syntax

The following examples use the [Simplified syntax](#simplified-syntax).

### General example 

The following table is created.

```kusto
.set-or-replace People <|
datatable(Name:string, Address:string)[
  "Alice", "221B Baker street",
  "Bob", "1600 Pennsylvania Avenue",
  "Carl", "11 Wall Street New York"
]
```

| Name  | Address                  |
| ----- | ------------------------ |
| Alice | 221B Baker street        |
| Bob   | 1600 Pennsylvania Avenue |
| Carl  | 11 Wall Street New York  |

Then the following update command is run:

```kusto
.update table People on Name <|
  datatable(Name:string, Address:string)[
  "Alice", "2 Macquarie Street",
  "Diana", "350 Fifth Avenue" ]
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

### Example table

The next examples are based on the following table:

```kusto
.set-or-replace Employees <|
  range i from 1 to 100 step 1
  | project Id=i
  | extend Code = tostring(dynamic(["Customer", "Employee"])[Id %2])
  | extend Color = tostring(dynamic(["Red", "Blue", "Gray"])[Id %3])
```

This command creates a table with 100 records starting with:

| ID | Code     | Color |
| -- | -------- | ----- |
| 1  | Employee | Blue  |
| 2  | Customer | Gray  |
| 3  | Employee | Red   |
| 4  | Customer | Blue  |
| 5  | Employee | Gray  |
| 6  | Customer | Red   |
| 6  | Employee | Blue  |

### Update a single column on one row

The following example uses the simplified syntax to update a single column on a single row that matches the append predicate:

```kusto
.update table Employees on Id with(whatif=true) <|
    Employees
    | where Id==3
    | extend Color="Orange"
```

Notice that `whatif` is set to true. After this query, the table is unchanged, but the command returns that there would be an extent with one row deleted and a new extent with one row.

The following command actually performs the update:

```kusto
.update table Employees on Id <|
  Employees
  | where Id==3
  | extend Color="Orange"
```

### Update a single column on multiple rows

The following example updates on one single column `Color` to the value of *Green* on those rows that matched the append predicate. 

```kusto
.update table Employees on Id <|
  Employees
  | where Code=="Employee"
  | where Color=="Blue"
  | extend Color="Green"
```

### Update multiple columns on multiple rows

The following example updates multiple columns on all rows that match the append predicate.

```kusto
.update table Employees on Id <|
  Employees
  | where Color=="Gray"
  | extend Code=strcat("ex-", Code)
  | extend Color=""
```

### Update rows using another table

In this example, the first step is to create the following mapping table:

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

This mapping table is then used to update some colors in the original table based on the append predicate and the corresponding "New Color":

```kusto
.update table Employees on Id <|
  Employees
  | where Code=="Customer"
  | lookup ColorMapping on $left.Color==$right.OldColor
  | project Id, Code, Color=NewColor
```

### Update rows with a staging table

A popular pattern is to first land data in a staging table before updating the main table.

The first command creates a staging table:

```kusto
.set-or-replace MyStagingTable <|
    range i from 70 to 130 step 5
    | project Id=i
    | extend Code = tostring(dynamic(["Customer", "Employee"])[Id %2])
    | extend Color = tostring(dynamic(["Red", "Blue", "Gray"])[Id %3])
```

The next command updates the main table with the data in the staging table:

```kusto
.update table Employees on Id <|
  MyStagingTable
```

Some records in the staging table didn't exist in the main table (that is, had `Id>100`) but were still inserted in the main table (upsert behavior).

## Examples - Expanded syntax

The following examples use the [Expanded syntax](#expanded-syntax).

### Compound key

The simplified syntax assumes a single column can match rows in the *appendQuery* to infer rows to delete.  More than one column can be used, for example, using compound keys.

The first command creates a table with compound keys:

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

The next command updates a specific record using the expanded syntax:

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

### Complete control

In the following example, all rows with `Code` *Employee* are deleted, and rows with `Code` *Employee* **and** `Color` purple are appended.  More rows are deleted than inserted.

```kusto
.update table Employees delete D append A <|
  let D = Employees
    | where Code=="Employee";
  let A = Employees
    | where Code=="Employee"
    | where Color=="Purple"
    | extend Code="Corporate"
    | extend Color="Mauve";
```

This type of action is only possible using the expanded syntax, which independently controls the delete and append operations.

## Related content

* [Materialized views](materialized-views/materialized-view-overview.md)
* [.delete table records - soft delete command](soft-delete-command.md)
