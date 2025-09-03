---
title:  The update table command
description: Learn how to use update table command to perform transactional data updates.
ms.reviewer: vplauzon
ms.topic: reference
ms.date: 11/18/2024
---
# `.update table` command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `.update table` command performs data updates in a specified table by deleting and appending records atomically.
There are two options for appending the records:

- Ingest the records based on a provided query. The query is noted using the *AppendIdentifier*.
- Move extents containing the records to append from another table to the target table. For more information, see [Update using move extents](#update-using-move-extents).

> [!WARNING]
> This command is unrecoverable.

> [!NOTE]
> When you run the `.update table` command on a table that is the source for an [update policy](update-policy.md), the `.update table` command triggers these update policies for which the table being modified is the update policy source.
>
> You can delete up to 5 million records in a single command.

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

**Update using `append` and `delete`:**

```kusto
.update [async] table TableName delete DeleteIdentifier append AppendIdentifier [with ( propertyName = propertyValue )] <|
let DeleteIdentifier = DeletePredicate;
let AppendIdentifier = AppendPredicate;
```

**Update using `move extents` and `delete`:**

```kusto
.update [async] table TableName delete DeleteIdentifier move SourceTableName [with ( *propertyName = propertyValue )] <|
let DeleteIdentifier = DeletePredicate;
```

### Parameters

| Name               | Type     | Required           | Description                                                                                                                                                                                                                                         |
| ------------------ | -------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| *async*        | `string` |  | If specified, indicates that the command runs in asynchronous mode.
| *TableName*        | `string` | :heavy_check_mark: | The name of the table to update.
| *DeleteIdentifier* | `string` | :heavy_check_mark: | The identifier name used to specify the delete predicate applied to the updated table.                                                                                                                                                              |
| *DeletePredicate*  | `string` | :heavy_check_mark: | The text of a query whose results are used as data to delete. The predicate has the same [limitations as the soft delete predicate](../concepts/data-soft-delete.md#limitations-and-considerations). |
| *AppendIdentifier* | `string` || The identifier name used to specify the append predicate applied to the updated table. Required if using update based on ingest from query.  |
| *AppendPredicate*  | `string` || The text of a query whose results are used as data to append. Required if using update based on ingest from query. |
| *SourceTableName*  | `string` || The name of the table to move extents from. Must be a local table in current database. Required if using [Update using move extents](#update-using-move-extents).|

> [!IMPORTANT]
>
> * Both delete and append predicates can't use remote entities, cross-db, and cross-cluster entities. Predicates can't reference an external table or use the `externaldata` operator.
> * Append and delete queries are expected to produce deterministic results. Nondeterministic queries can lead to unexpected results. A query is deterministic if and only if it would return the same data if executed multiple times.
>    * For example, use of [`take` operator](../query/take-operator.md), [`sample` operator](../query/sample-operator.md), [`rand` function](../query/rand-function.md), and other such operators isn't recommended because these operators aren't deterministic.
> * Queries might be executed more than once within the `update` execution. If the intermediate query results are inconsistent, the update command can produce unexpected results.
> * The delete and append predicates are based on the same snapshot of the table, and therefore they can't depend on each other. In other words, the append predicate executes on a snapshot of the source table *before* the deletion and vice versa - the delete predicate executes on a snapshot of the source table *before* the append.

## Supported properties

| Name     | Type | Description                                                                                                                                                |
| -------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `whatif` | bool | If `true`, returns the number of records that are appended / deleted in every shard, without appending / deleting any records. The default is `false`. |
| `distributed` | bool | If `true`, the command ingests from all nodes executing the query in parallel. This option is relevant only for update based on ingest from query. Default is `false`. See [performance tips](#performance-tips). |
| `extentTagsToMove` | string | Optional [Extent tags](extent-tags.md) to filter only specific extents, when using update using move extents. The tags are provided as an array, in the same format as in [Ingestion properties](../ingestion-properties.md). See examples in [Update using move extents](#update-using-move-extents).|

> [!IMPORTANT]
> We recommend running in `whatif` mode first before executing the update to validate the predicates before deleting or appending data.

## Returns

The result of the command is a table where each record represents an [extent](extents-overview.md) that was either created with new data or had records deleted.

| Name     | Type     | Description                                                                      |
| -------- | -------- | -------------------------------------------------------------------------------- |
| Table    | `string`   | The table in which the extent was created or deleted.                            |
| Action   | `string` | *Create* or *Delete* depending on the action performed on the extent.            |
| ExtentId | `guid`   | The unique identifier for the extent created or deleted by the command. |
| RowCount | `long`   | The number of rows created or deleted in the specified extent by the command.    |

## Update using move extents

When you use this option, the records to append to target table are moved from the provided *SourceTableName* using [move extents](move-extents.md). The update moves *all* extents from the table, or only those that match the provided *extentTagsToMove*, if *extentTagsToMove* are specified in the command properties. The source table must be a local table in the current database and must the same schema as the target table.

The move extents option is useful when the records to append are already ingested to a staging table in the database, and should replace existing records in the target table. In this case, using the move extents option is more efficient than ingest from query, as this option doesn't require reingesting the records. See examples in [Update rows from a staging table using move extents](#update-rows-from-a-staging-table-using-move-extents).

## Choose between `.update table` and materialized views

There are scenarios where you could use either the `.update table` command or a [materialized view](materialized-views/materialized-view-overview.md) to achieve the same goal in a table. For example, a materialized view could be used to keep the latest version of each record or an update could be used to update records when a new version is available.

Use the following guidelines to decide which method to use:

* If your update pattern isn't supported by materialized views, use the update command.
* If the source table has a high ingestion volume, but only few updates, using the update command can be more performant and consume less cache or storage than materialized views. This is because materialized views need to reprocess all ingested data, which is less efficient than identifying the individual records to update based on the append or delete predicates.
* Materialized views are a fully managed solution. The materialized view is [defined once](materialized-views/materialized-view-create-or-alter.md) and materialization happens in the background by the system. The update command requires an orchestrated process (for example, [Azure Data Factory](/azure/data-explorer/data-factory-integration), [Logic Apps](/azure/data-explorer/logic-apps), [Power Automate](/azure/data-explorer/flow), and others) that explicitly executes the update command every time there are updates. If materialized views work enough for your use case, using materialized views requires less management and maintenance.

## Performance tips

* Data ingestion is a resource-intensive operation that might affect concurrent activities on the cluster, including running queries. We recommend that you avoid the following resource-intensive actions: running many `.update` commands at once, and intensive use of the *distributed* property.
* Limit the append data to less than 1 GB per operation. If necessary, use multiple update commands.
* Set the `distributed` flag to `true` only if the amount of data being produced by the query is large, exceeds 1 GB, and doesn't require serialization:  multiple nodes can then produce output in parallel. Don't use this flag when query results are small, since it might needlessly generate many small data shards.

## Examples

For the examples, we're going to use the following table:

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

The following example updates a single column on a single row:

```kusto
.update table Employees delete D append A with(whatif=true) <|
    let D = Employees
      | where Id==3;
    let A = Employees
      | where Id==3
      | extend Color="Orange";
```

Notice that `whatif` is set to true. After this query, the table is unchanged, but the command returns that there would be an extent with one row deleted and a new extent with one row.

The following command actually performs the update:

```kusto
.update table Employees delete D append A <|
    let D = Employees
      | where Id==3;
    let A = Employees
      | where Id==3
      | extend Color="Orange";
```

### Update a single column on multiple rows

The following example updates on one single column `Color` to the value of *Green* on those rows that have the value *blue*.

```kusto
.update table Employees delete D append A <|
    let D = Employees
        | where Code=="Employee"
        | where Color=="Blue";
    let A = D
      | extend Color="Green";
```

Here we reused the *delete identifier* in the definition on the append predicate.

### Update multiple columns on multiple rows

The following example updates multiple columns on all rows with color gray.

```kusto
.update table Employees delete D append A <|
    let D = Employees
      | where Color=="Gray";
    let A = D
      | extend Code=strcat("ex-", Code)
      | extend Color="";
```

### Update rows using another table (reference values)

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

This mapping table is then used to update some colors in the original table:

```kusto
.update table Employees delete D append A <|
  let D = Employees
    | where Code=="Customer";
  let A = D
    | lookup ColorMapping on $left.Color==$right.OldColor
    | project Id, Code, Color=NewColor
```

### Update rows with a datatable

Sometimes values to update are known without being stored in a table, and the [datatable operator](../query/datatable-operator.md) can be helpful:

```kusto
.update table Employees delete D append A <|
  let A = datatable(Id:long, Code:string, Color:string)[
    1, "Customer", "Purple",
    2, "Customer", "Magenta",
    3, "Customer", "Turquoise",
  ];
  let D = Employees
      | join kind=leftsemi A on Id
      | where true;
```

### Update rows from a staging table using move extents

A popular pattern is to first land data in a staging table before updating the main table.

The first command creates a staging table:

```kusto
.set-or-replace MyStagingTable <|
    range i from 70 to 130 step 5
    | project Id=i
    | extend Code = tostring(dynamic(["Customer", "Employee"])[Id %2])
    | extend Color = tostring(dynamic(["Red", "Blue", "Gray"])[Id %3])
```

The next command updates the main table with the data in the staging table, by moving all  extents from staging table to main table:

```kusto
.update table Employees delete D move MyStagingTable <|
    let D = Employees
        | join kind=leftsemi MyStagingTable on Id
        | where true;
```

Some records in the staging table didn't exist in the main table (that is, had `Id>100`) but were still inserted in the main table (upsert behavior). Since the command uses move extents, MyStagingTable will be empty after the update.

#### Update from a staging table using move extents with extent tags

In this example, the extents in the staging table include extent tags, and we're only interested in updating based on a subset of the tags:

```kusto
.set-or-replace MyStagingTable with(tags='["drop-by:tag1"]')<|
    range i from 70 to 100 step 5
    | project Id=i
    | extend Code = tostring(dynamic(["Customer", "Employee"])[Id %2])
    | extend Color = tostring(dynamic(["Red", "Blue", "Gray"])[Id %3])

.set-or-replace MyStagingTable with(tags='["drop-by:tag2"]')<|
    range i from 100 to 150 step 5
    | project Id=i
    | extend Code = tostring(dynamic(["Customer", "Employee"])[Id %2])
    | extend Color = tostring(dynamic(["Red", "Blue", "Gray"])[Id %3])
```

The following command updates the main table with the data from the first ingestion ("drop-by:tag1") in the staging table.
The delete part must filter on the extent tags as well, if you would like to only delete records based on this tag.
The entire MyStagingTable is considered for the delete query, not only the records in the extents with "drop-by:tag1" so the filter
must be explicitly added to the delete query.

```kusto
.update table Employees delete D move MyStagingTable with (extentTagsToMove='["drop-by:tag1"]') <|
    let D = Employees | where Id in (MyStagingTable | where extent_tags() has "drop-by:tag1" | project Id);
```

At the end of the command, MyStagingTable includes only the records from the second ingestion ("drop-by:tag2"), as the command
moves the extents with `drop-by:tag1`.

### Compound key

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

## Related content

* [Materialized views](materialized-views/materialized-view-overview.md)
* [.delete table records - soft delete command](soft-delete-command.md)
