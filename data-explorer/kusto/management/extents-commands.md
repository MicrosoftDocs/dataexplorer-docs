---
title: Extents (data shards) management - Azure Data Explorer | Microsoft Docs
description: This article describes Extents (data shards) management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/19/2020
---
# Extents (data shards) management

Data shards are called **extents** in Kusto, and all commands use "extent" or "extents" as a synonym.

## .show extents

**Cluster Level**

`.show` `cluster` `extents` [`hot`]

Shows information about extents (data shards) that are present in the cluster.
If `hot` is specified - shows only extents that are expected to be in the hot cache.

**Database Level**

`.show` `database` *DatabaseName* `extents` [`(`*ExtentId1*`,`...`,`*ExtentIdN*`)`] [`hot`] [`where` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag1* [`and` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag2*...]]

Shows information about extents (data shards) that are present in the specified database.
If `hot` is specified - shows only extents that expected to be in the hot cache.

**Table Level**

`.show` `table` *TableName* `extents` [`(`*ExtentId1*`,`...`,`*ExtentIdN*`)`] [`hot`] [`where` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag1* [`and` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag2*...]]

`.show` `tables` `(`*TableName1*`,`...`,`*TableNameN*`)` `extents` [`(`*ExtentId1*`,`...`,`*ExtentIdN*`)`] [`hot`] [`where` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag1* [`and` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag2*...]]

Shows information about extents (data shards) that are present in the specified table(s) (the database is taken from the command's context).
If `hot` is specified - shows only extents that expected to be in the hot cache.

**NOTES**

* Using database or table level commands is much faster than filtering (adding `| where DatabaseName == '...' and TableName == '...'`)
the results of a cluster-level command.
* If the optional list of extent IDs is provided, the returned data set is limited to those extents only.
    * This method is much faster than filtering (adding `| where ExtentId in(...)` to) the results of "bare" commands.
* In case `tags` filters are specified:
  * The returned list is limited to those extents whose tags collection obeys *all* of the provided tags filters.
    * This method is much faster than filtering (adding `| where Tags has '...' and Tags contains '...'` to) the results of "bare" commands.
  * `has` filters are equality filters: extents that aren't tagged with either of the specified tags will be filtered out.
  * `!has` filters are equality negative filters: extents that are tagged with either of the specified tags will be filtered out.
  * `contains` filters are case-insensitive substring filters: extents that don't have the specified strings as a substring of any of their tags will be filtered out. 
  * `!contains` filters are case-insensitive substring negative filters: extents that have the specified strings as a substring of any of their tags will be filtered out.
  
  * **Examples**
    * Extent `E` in table `T` is tagged with tags `aaa`, `BBB` and `ccc`.
    * This query will return `E`: 
    
    ```kusto 
    .show table T extents where tags has 'aaa' and tags contains 'bb' 
    ``` 
    
    * This query *won't* return `E` since it isn't tagged with `aa`:
    
    ```kusto 
    .show table T extents where tags has 'aa' and tags contains 'bb' 
    ``` 
    
    * This query will return `E`:
    
    ```kusto 
    .show table T extents where tags contains 'aaa' and tags contains 'bb' 
    ``` 

|Output parameter |Type |Description |
|---|---|---|
|ExtentId |Guid |ID of the extent 
|DatabaseName |String |Database that extent belongs to 
|TableName |String |Table that extents belong to 
|MaxCreatedOn |DateTime |Date-time when the extent was created (for a merged extent - the maximum of creation times among source extents) 
|OriginalSize |Double |Original size in bytes of the extent data 
|ExtentSize |Double |Size of the extent in memory (compressed + index) 
|CompressedSize |Double |Compressed size of the extent data in memory 
|IndexSize |Double |Index size of the extent data 
|Blocks |Long |Number of data blocks in extent 
|Segments |Long |Amount of data segment in extent 
|AssignedDataNodes |String | Deprecated (An empty string)
|LoadedDataNodes |String |Deprecated (An empty string)
|ExtentContainerId |String | ID of the extent container the extent is in
|RowCount |Long |Number of rows in the extent
|MinCreatedOn |DateTime |Date-time when the extent was created (for a merged extent - the minimum of creation times among source extents) 
|Tags|String|Tags, if any, defined for the extent 
 
**Examples**

```kusto 
// Show volume of extents being created per hour in a specific database
.show database MyDatabase extents | summarize count(ExtentId) by MaxCreatedOn bin=time(1h) | render timechart  

// Show volume of data arriving by table per hour 
.show database MyDatabase extents  
| summarize sum(OriginalSize) by TableName, MaxCreatedOn bin=time(1h)  
| render timechart

// Show data size distribution by table 
.show database MyDatabase extents | summarize sum(OriginalSize) by TableName

// Show all extents in the database named 'GamesDB' 
.show database GamesDB extents

// Show all extents in the table named 'Games' 
.show table Games extents

// Show all extents in the tables named 'TaggingGames1' and 'TaggingGames2', tagged with both 'tag1' and 'tag2' 
.show tables (TaggingGames1,TaggingGames2) extents where tags has 'tag1' and tags has 'tag2'
``` 
 
## .merge extents

**Syntax**

`.merge` `[async | dryrun]` *TableName* `(` *GUID1* [`,` *GUID2* ...] `)` `[with(rebuild=true)]`

This command merges the extents (See: [Extents (Data Shards) Overview](extents-overview.md)) indicated by their IDs in the specified table.

There are two flavors for merge operations: *Merge* (which rebuilds indexes), and *Rebuild* (which completely reingests the data).

* `async`: The operation will be asynchronous. The result will be an operation ID (GUID) that you can run `.show operations <operation ID>` with, to view the command's state & status.
* `dryrun`: The operation will only list the extents that should be merged, but won't actually merge them. 
* `with(rebuild=true)`: the extents will be rebuilt (data will be reingested) instead of merged (indexes will be rebuilt).

**Return output**

Output parameter |Type |Description 
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent in the source table, which has been merged into the target extent. 
ResultExtentId |string |A unique identifier (GUID) for the extent that was created from the source extents. Upon failure - "Failed" or "Abandoned".
Duration |timespan |The time period it took to complete the merge operation.

**Examples**

Rebuilds two specific extents in `MyTable`, asynchronously
```kusto
.merge async MyTable (e133f050-a1e2-4dad-8552-1f5cf47cab69, 0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687) with(rebuild=true)
```

Merges two specific extents in `MyTable`, synchronously
```kusto
.merge MyTable (12345050-a1e2-4dad-8552-1f5cf47cab69, 98765b2d-9dd2-4d2c-a45e-b24c65aa6687)
```

**Notes**
- In General, `.merge` commands should rarely be manually run. The commands are continuously automatically run in the background of the Kusto cluster, according to the [Merge Policies](mergepolicy.md) defined for tables and databases.  
  - See [Merge Policy](mergepolicy.md) for some general considerations about the criteria for merging multiple extents into a single one.
- `.merge` operations have a possible final state of `Abandoned`, which can be seen when running `.show operations` with the operation ID. This state suggests the source extents weren't merged, since some of the source extents no longer exist in the source table.
Such a state is expected to occur when:
* The source extents have been dropped as part of the table's retention.
* The source extents have been moved to a different table.
* The source table has been entirely dropped or renamed.

## .move extents

**Syntax**

`.move` [`async`] `extents` `all` `from` `table` *SourceTableName* `to` `table` *DestinationTableName*

`.move` [`async`] `extents` `(` *GUID1* [`,` *GUID2* ...] `)` `from` `table` *SourceTableName* `to` `table` *DestinationTableName* 

`.move` [`async`] `extents` `to` `table` *DestinationTableName* <| *query*

This command runs in the context of a specific database, and moves the specified extents from the source table to the destination table transactionally.
Requires [Table admin permission](../management/access-control/role-based-authorization.md) for the source and destination tables.

* `async` (optional) specifies whether the command is executed asynchronously. If it is, an Operation ID (Guid) is returned, and the operation's status can be monitored using the [.show operations](operations.md#show-operations) command).
    * If this option is used, the results of a successful execution can be retrieved via the [.show operation details](operations.md#show-operation-details) command).

There are three ways to specify which extents to move:
* All extents of a specific table are to be moved.
* By explicitly specifying the extent IDs in the source table.
* By providing a query whose results specify the extent IDs in the source table(s).

**Restrictions**

* Both source and destination tables must be in the context database. 
* All columns in the source table are expected to exist in the destination table with the same name and data type.

**Specifying Extents with a Query**

```kusto 
.move extents to table TableName <| ...query... 
```

The extents are specified using a Kusto query that returns a recordset with a column called "ExtentId". 

**Return output** (for sync execution)

Output parameter |Type |Description 
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent in the source table, which has been moved to the destination table. 
ResultExtentId |string |A unique identifier (GUID) for the result extent that has been moved from the source table to the destination table. Upon failure - "Failed".
Details |string |Includes the failure details, in case the operation fails.

**Examples**

Moves all extents in table `MyTable` to table `MyOtherTable`.
```kusto
.move extents all from table MyTable to table MyOtherTable
```

Moves two specific extents (by their extent IDs) from table `MyTable` to table `MyOtherTable`.
```kusto
.move extents (AE6CD250-BE62-4978-90F2-5CB7A10D16D7,399F9254-4751-49E3-8192-C1CA78020706) from table MyTable to table MyOtherTable
```

Moves all extents from two specific tables (`MyTable1`, `MyTable2`) to table `MyOtherTable`.
```kusto
.move extents to table MyOtherTable <| .show tables (MyTable1,MyTable2) extents
```

**Sample output** 

|OriginalExtentId |ResultExtentId| Details
|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687| 
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be| 
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f| 
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df| 

## .drop extents

Drops extents from specified database / table. 
This command has several variants: In one variant the extents to be dropped are specified by a Kusto query. In the other variants, extents are specified using a mini-language described below. 
 
### Specifying Extents with a Query

Requires [Table admin permission](../management/access-control/role-based-authorization.md) foreach of the tables that have extents returned by the provided query.

Drops extents (or just reports them without actually dropping if `whatif` is used):

**Syntax**

`.drop` `extents` [`whatif`] <| *query*

The extents are specified using a Kusto query that returns a recordset with a column called "ExtentId". 
 
### Dropping a specific extent

Requires [Table admin permission](../management/access-control/role-based-authorization.md) in case table name is specified.

Requires [Database admin permission](../management/access-control/role-based-authorization.md) in case table name isn't specified.

**Syntax**

`.drop` `extent` *ExtentId* [`from` *TableName*]

### Dropping specific multiple extents

Requires [Table admin permission](../management/access-control/role-based-authorization.md) in case table name is specified.

Requires [Database admin permission](../management/access-control/role-based-authorization.md) in case table name isn't specified.

**Syntax**

`.drop` `extents` `(`*ExtentId1*`,`...*ExtentIdN*`)` [`from` *TableName*]

### Specifying Extents by Properties

Requires [Table admin permission](../management/access-control/role-based-authorization.md) in case table name is specified.

Requires [Database admin permission](../management/access-control/role-based-authorization.md) in case table name isn't specified.

`.drop` `extents` [`older` *N* (`days` | `hours`)] `from` (*TableName* | `all` `tables`) [`trim` `by` (`extentsize` | `datasize`) *N* (`MB` | `GB` | `bytes`)] [`limit` *LimitCount*]

* `older`: Only extents older than *N* days/hours will be dropped. 
* `trim`: The operation will trim the data in the database until the sum of extents matches the required size (MaxSize).
* `limit`: The operation will be applied to first *LimitCount* extents.

The command supports emulation (`.drop-pretend` instead of `.drop`) mode, which produces an output as if command would have run, 
but without actually executing it.

**Examples**

Remove all extents created more than 10 days previous, from all tables in database `MyDatabase`

```kusto
.drop extents <| .show database MyDatabase extents | where CreatedOn < now() - time(10d)
```

Removes all extents in tables `Table1` and `Table2`, whose creation time was over 10 days ago.

```kusto
.drop extents older 10 days from tables (Table1, Table2)
```

Emulation mode: shows which extents would be removed by the command (extent ID parameter isn't applicable for this command):

```kusto
.drop-pretend extents older 10 days from all tables
```

Removes all extents from 'TestTable':

```kusto
.drop extents from TestTable
```
 
**Return output**

|Output parameter |Type |Description 
|---|---|---
|ExtentId |String |ExtentId that was dropped as a result of the command 
|TableName |String |Table name, where extent belonged  
|CreatedOn |DateTime |Timestamp that holds information about when extent was initially created 
 
**Sample output** 

|Extent ID |Table Name |Created On 
|---|---|---
|43c6e03f-1713-4ca7-a52a-5db8a4e8b87d |TestTable |2015-01-12 12:48:49.4298178 

## .replace extents

**Syntax**

`.replace` [`async`] `extents` `in` `table` *DestinationTableName* `<| 
{`*query for extents to be dropped from table*`},{`*query for extents to be moved to table*`}`

This command runs in the context of a specific database, 
moves the specified extents from their source tables to the destination table,
and drops the specified extents from the destination table.
All of the drop and move operations are done in a single transaction.

Requires [Table admin permission](../management/access-control/role-based-authorization.md) for the source and destination tables.

* `async` (optional) specifies whether or not the command is executed asynchronously (in which case, an Operation ID (Guid) is returned,
  and the operation's status can be monitored using the [.show operations](operations.md#show-operations) command).
    * In case this option is used, the results of a successful execution can be retrieved the [.show operation details](operations.md#show-operation-details) command).

Specifying which extents should be dropped or moved is done by providing two queries
- *query for extents to be dropped from table* - the results of this query specify the extent IDs  
that should be dropped from the destination table.
- *query for extents to be moved to table* - the results of this query specify the extent IDs in the source table(s) 
that should be moved to the destination table.

Both queries should return a recordset with a column called "ExtentId".

**Restrictions**
- Both source and destination tables must be in the context database. 
- All extents specified by the *query for extents to be dropped from table* are expected to belong to the destination table.
- All columns in the source tables are expected to exist in the destination table with the same name and data type.

**Return output** (for sync execution)

Output parameter |Type |Description 
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent in the source table, which has been moved to the destination table, or - the extent in the destination table, which has been dropped.
ResultExtentId |string |A unique identifier (GUID) for the result extent that has been moved from the source table to the destination table, or - empty, in case the extent was dropped from the destination table. Upon failure - "Failed".
Details |string |Includes the failure details, in case the operation fails.

> [!NOTE]
> The command will fail if extents returned by the *extents to be dropped from table* query don't exist in the destination table. This may happen if the extents were merged before the replace command was executed. 
> To make sure the command fails on missing extents, check that the query returns the expected ExtentIds. Example #1 below will fail if the extent to drop doesn't exist in table MyOtherTable. Example #2, however, will succeed even though the extent to drop doesn't exist, since the query to drop didn't return any extent ids. 

**Examples**

The following command moves all extents from two specific tables (`MyTable1`, `MyTable2`) to table `MyOtherTable`, and drops all extents in `MyOtherTable` 
tagged with `drop-by:MyTag`:

```kusto
.replace extents in table MyOtherTable <|
    {
        .show table MyOtherTable extents where tags has 'drop-by:MyTag'
    },
    {
        .show tables (MyTable1,MyTable2) extents
    }
```

**Sample output** 

|OriginalExtentId |ResultExtentId |Details
|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687| 
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be| 
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f| 
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df| 


The following command moves all extents from one specific table (`MyTable1`) to table `MyOtherTable`, and drops a specific extent in `MyOtherTable`, by its ID:


```kusto
.replace extents in table MyOtherTable <|
    {
        print ExtentId = "2cca5844-8f0d-454e-bdad-299e978be5df"
    },
    {
        .show table MyTable1 extents 
    }
```

```kusto
.replace extents in table MyOtherTable  <|
    {
        .show table MyOtherTable extents
        | where ExtentId == guid(2cca5844-8f0d-454e-bdad-299e978be5df) 
    },
    {
        .show table MyTable1 extents 
    }
```

The following command implements an idempotent logic, so that it drops extents from table `t_dest` only in case there are extents to move from table `t_source` to table `t_dest`:

```kusto
.replace async extents in table t_dest <|
{
    let any_extents_to_move = toscalar( 
        t_source
        | where extent_tags() has 'drop-by:blue'
        | summarize count() > 0
    );
    let extents_to_drop =
        t_dest
        | where any_extents_to_move and extent_tags() has 'drop-by:blue'
        | summarize by ExtentId = extent_id()
    ;
    extents_to_drop
},
{
    let extents_to_move = 
        t_source
        | where extent_tags() has 'drop-by:blue'
        | summarize by ExtentId = extent_id()
    ;
    extents_to_move
}
```

## .drop extent tags

**Syntax**

`.drop` [`async`] `extent` `tags` `from` `table` *TableName* `(`'*Tag1*'[`,`'*Tag2*'`,`...`,`'*TagN*']`)`

`.drop` [`async`] `extent` `tags` <| *query*

* `async` (optional) specifies whether the command is executed asynchronously and an Operation ID (Guid) is returned. The operation's status can be monitored using the [.show operations](operations.md#show-operations) command).
    * If this option is used, you can  retrieve the results of a successful execution with the [.show operation details](operations.md#show-operation-details) command.

The command runs in the context of a specific database, and drops the provided [extent tag(s)](extents-overview.md#extent-tagging) from any extent in the provided database and table, which includes any of the tags.  

There are two ways to specify which tags should be removed from which extents:

1. By explicitly specifying the tags that should be removed from all extents in the specified table.
2. By providing a query whose results specify the extent IDs in the table and foreach extent - the tags that should be removed.

**Restrictions**
- All extents must be in the context database, and must belong to the same table. 

**Specifying Extents with a Query**

Requires [Table admin permission](../management/access-control/role-based-authorization.md) for all involved source and destination tables.

```kusto 
.drop extent tags <| ...query... 
```

The extents and the tags to drop are specified using a Kusto query that returns a recordset with a column called "ExtentId" and a column called "Tags". 

*NOTE*: When using the [Kusto .NET client library](../api/netfx/about-kusto-data.md), the following methods will generate the desired command:
* `CslCommandGenerator.GenerateExtentTagsDropByRegexCommand(string tableName, string regex)`
* `CslCommandGenerator.GenerateExtentTagsDropBySubstringCommand(string tableName, string substring)`

**Return output**

Output parameter |Type |Description 
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent whose tags have been modified (and is dropped as part of the operation) 
ResultExtentId |string |A unique identifier (GUID) for the result extent that has modified tags (and is created and added as part of the operation). Upon failure - "Failed".
ResultExtentTags |string |The collection of tags that the result extent is tagged with (if any remain), or "null" in case the operation fails.
Details |string |Includes the failure details, in case the operation fails.

**Examples**

Drops the `drop-by:Partition000` tag from any extent in table  that is tagged with it.

```kusto
.drop extent tags from table MyOtherTable ('drop-by:Partition000')
```

Drops the tags `drop-by:20160810104500`, `a random tag`, and `drop-by:20160810` from any extent in table  that is tagged with either of them.

```kusto
.drop extent tags from table [My Table] ('drop-by:20160810104500','a random tag','drop-by:20160810')
```

Drops all `drop-by` tags from extents in table `MyTable`.

```kusto
.drop extent tags <| 
  .show table MyTable extents 
  | where isnotempty(Tags)
  | extend Tags = split(Tags, '\r\n') 
  | mv-expand Tags to typeof(string)
  | where Tags startswith 'drop-by'
```

Drops all tags matching regex `drop-by:StreamCreationTime_20160915(\d{6})` from extents in table `MyTable`.

```kusto
.drop extent tags <| 
  .show table MyTable extents 
  | where isnotempty(Tags)
  | extend Tags = split(Tags, '\r\n')
  | mv-expand Tags to typeof(string)
  | where Tags matches regex @"drop-by:StreamCreationTime_20160915(\d{6})"
```

**Sample output** 

|OriginalExtentId |ResultExtentId | ResultExtentTags | Details
|---|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687 | Partition001 |
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be | |
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f | Partition001 Partition002 |
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df | |

## .alter extent tags

**Syntax**

`.alter` [`async`] `extent` `tags` `(`'*Tag1*'[`,`'*Tag2*'`,`...`,`'*TagN*']`)` <| *query*

The command runs in the context of a specific database, and alters the [extent tag(s)](extents-overview.md#extent-tagging)
of all of the extents returned by the specified query, to the provided set of tags.

The extents and the tags to alter are specified using a Kusto query that returns a recordset with a column called "ExtentId".

* `async` (optional) specifies whether the command is executed asynchronously, and an Operation ID (Guid) is returned. The operation's status can be monitored using the [.show operations](operations.md#show-operations) command.
    * If this option is used, the results of a successful execution can be retrieved with the [.show operation details](operations.md#show-operation-details) command.

Requires [Table admin permission](../management/access-control/role-based-authorization.md) for all involved tables.

**Restrictions**

- All extents must be in the context database, and must belong to the same table. 

**Return output**

Output parameter |Type |Description 
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent whose tags have been modified (and is dropped as part of the operation) 
ResultExtentId |string |A unique identifier (GUID) for the result extent that has modified tags (and is created and added as part of the operation). Upon failure - "Failed".
ResultExtentTags |string |The collection of tags that the result extent is tagged with, or "null" in case the operation fails.
Details |string |Includes the failure details, in case the operation fails.

**Examples**

Alters tags of all the extents in table `MyTable` to `MyTag`.

```kusto
.alter extent tags ('MyTag') <| .show table MyTable extents
```

Alters tags of all the extents in table `MyTable`, tagged with `drop-by:MyTag` to `drop-by:MyNewTag` and `MyOtherNewTag`.

```kusto
.alter extent tags ('drop-by:MyNewTag','MyOtherNewTag') <| .show table MyTable extents where tags has 'drop-by:MyTag'
```

**Sample output** 

|OriginalExtentId |ResultExtentId | ResultExtentTags | Details
|---|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687 | drop-by:MyNewTag MyOtherNewTag| 
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be | drop-by:MyNewTag MyOtherNewTag| 
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f | drop-by:MyNewTag MyOtherNewTag| 
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df | drop-by:MyNewTag MyOtherNewTag| 
