---
title: Extents, Extent Tags, Extent Containers - Azure Kusto | Microsoft Docs
description: This article describes Extents, Extent Tags, Extent Containers in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Extents, Extent Tags, Extent Containers

## Extents (Data shards)

Data shards are called **extents** in Kusto, and all commands use "extent"
or "extents" as a synonym.

### .show extents

**Cluster Level**

`.show` `cluster` `extents` [`hot`]

Shows information about extents (data shards) that are present in the cluster.
If `hot` is specified - shows only extents which are expected to be in the hot cache.

**Database Level**

`.show` `database` *DatabaseName* `extents` [`(`*ExtentId1*`,`...`,`*ExtentIdN*`)`] [`hot`] [`where` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag1* [`and` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag2*...]]

Shows information about extents (data shards) that are present in the specified database.
If `hot` is specified - shows only extents which expected to be in the hot cache.

**Table Level**

`.show` `table` *TableName* `extents` [`(`*ExtentId1*`,`...`,`*ExtentIdN*`)`] [`hot`] [`where` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag1* [`and` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag2*...]]

`.show` `tables` `(`*TableName1*`,`...`,`*TableNameN*`)` `extents` [`(`*ExtentId1*`,`...`,`*ExtentIdN*`)`] [`hot`] [`where` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag1* [`and` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag2*...]]

Shows information about extents (data shards) that are present in the specified table(s) (the database is taken from the command's context).
If `hot` is specified - shows only extents which expected to be in the hot cache.

**NOTES**

* Using database and/or table level commands is much faster than filtering (adding `| where DatabaseName == '...' and TableName == '...'`)
the results of a cluster-level command.
* If the optional list of extent IDs is provided, the returned data set is limited to those
  extents only.
    * Again, this is much faster than filtering (adding `| where ExtentId in(...)` to) the results of "bare" commands.
* In case `tags` filters are specified:
  * The returned list is limited to those extents whose tags collection obeys *all* of the provided tags filters.
    * Again, this is much faster than filtering (adding `| where Tags has '...' and Tags contains '...'`) the results of "bare" commands.
  * `has` filters are equality filters: extents which aren't tagged with either of the specified tags will be 
  filtered out.
  * `!has` filters are equality negative filters: extents which are tagged with either of the specified tags will be 
  filtered out.
  * `contains` filters are case-insensitive substring filters: extents which don't have the specified strings 
  as a substring of any of their tags will be filtered out. 
  * `!contains` filters are case-insensitive substring negative filters: extents which have the specified strings 
  as a substring of any of their tags will be filtered out. 
  
  * **Examples**
    * Extent `E` in table `T` is tagged with tags `aaa`, `BBB` and `ccc`.
    * This query will return `E`: 
    
    ```kusto 
    .show table T extents where tags has 'aaa' and tags contains 'bb' 
    ``` 
    
    * This query will *not* return `E` (as it is not tagged with a tag which is equal to `aa`):
    
    ```kusto 
    .show table T extents where tags has 'aa' and tags contains 'bb' 
    ``` 
    
    * This query will return `E`: 
    
    ```kusto 
    .show table T extents where tags contains 'aaa' and tags contains 'bb' 
    ``` 

|Output parameter |Type |Description 
|---|---|---
|ExtentId |Guid |ID of the extent 
|DatabaseName |String |Database that extent belongs to 
|TableName |String |Table that extents belong to 
|MaxCreatedOn |DateTime |Date-time when the extent was created (for a merged extent - the maximum of creation times among source extents) 
|OriginalSize |Double |Original size in bytes of the extent data 
|ExtentSize |Double |Size of the extent in memory (compressed + index) 
|CompressedSize |Double |Compressed size of the extent data in memory 
|IndexSize |Double |Index size of the extent data 
|Blocks |UInt64 |Amount of data blocks in extent 
|Segments |UInt64 |Amount of data segment in extent 
|AssignedDataNodes |String | Deprecated (An empty string)
|LoadedDataNodes |String |Deprecated (An empty string)
|ExtentContainerId |String | ID of the extent container the extent is in
|RowCount |UInt64 |Amount of rows in the extent
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
 
### .merge extents

**Syntax**

`.merge` `[async | dryrun]` *TableName* `(` *GUID1* [`,` *GUID2* ...] `)` `[with(rebuild=true)]`

This command merges the extents (See: [Extents (Data Shards)](https://kusdoc2.azurewebsites.net/docs/concepts/extents.html)) indicated by their IDs in the specified table.

There are 2 flavors for merge operations: *Merge* (which rebuilds indexes), and *Rebuild* (which completely reingests the data).

* `async`: The operation will be performed asynchronously - the result will be an operation ID (GUID), which one can run `.show operations <operation ID>` with, to view the command's state & status.
* `dryrun`: The operation will only list the extents which should be merged, but won't actually merge them. 
* `with(rebuild=true)`: the extents will be rebuilt (data will be reingested) instead of merged (indexes will be rebuilt).

**Return output**

Output parameter |Type |Description 
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent in the source table, which has been merged into the target extent. 
ResultExtentId |string |A unique identifier (GUID) for the result extent which has been created from the source extents. Upon failure - "Failed" or "Abandoned".
Duration |timespan |The time period it took to complete the merge operation.

**Examples**

Rebuilds two specific extents in `MyTable`, performed asynchronously
```kusto
.merge async MyTable (e133f050-a1e2-4dad-8552-1f5cf47cab69, 0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687) with(rebuild=true)
```

Merges two specific extents in `MyTable`, performed synchronously
```kusto
.merge MyTable (12345050-a1e2-4dad-8552-1f5cf47cab69, 98765b2d-9dd2-4d2c-a45e-b24c65aa6687)
```

**Notes**
- In General, `.merge` commands should rarely be run manually, and they are continously performed automatically in the background of the Kusto cluster (according to the [Merge Policies](https://kusdoc2.azurewebsites.net/docs/concepts/mergepolicy.html) defined for tables and databases in it).  
  - General considerations about the criteria for merging multiple extents into a single one are documented under [Merge Policy](https://kusdoc2.azurewebsites.net/docs/concepts/mergepolicy.html).
- `.merge` operations have a possible final state of `Abandoned` (which can be seen when running `.show operations` with the operation ID) - this state suggests the source extents were not merged together, as some of the source extents no longer exist in the source table.
  - Such a state is expected to occur in cases such as:
     - The source extents have been dropped as part of the table's retention.
     - The source extents have been moved to a different table.
     - The source table has been entirely dropped or renamed.

### .move extents

**Syntax**

`.move` `[async]` `extents` `all` `from` `table` *SourceTableName* `to` `table` *DestinationTableName*

`.move` `[async]` `extents` `(` *GUID1* [`,` *GUID2* ...] `)` `from` `table` *SourceTableName* `to` `table` *DestinationTableName* 

`.move` `[async]` `extents` `to` `table` *DestinationTableName* <| *query*

This command runs in the context of a specific database, and moves the specified extents from the source table to the destination table transactionally.
Requires [Table admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) for the source and destination tables.

* `async` (optional) specifies whether or not the command is executed asynchronously (in which case, an Operation ID (Guid) is returned,
  and the operation's status can be monitored using the [.show operations](./diagnostics.md#show-operations) command).

There are three ways to specify which extents to move:
1. All extents of a specific table are to be moved.
2. By explicitly specifying the extent IDs in the source table.
3. By providing a query whose results specify the extent IDs in the source table(s).

**Restrictions**
- Both source and destination tables must be in the context database. 
- All columns in the source table are expected to exist in the destination table with the same name and data type.

**Specifying Extents with a Query**

```kusto 
.move extents to table TableName <| ...query... 
```

The extents are specified using a Kusto query that returns a recordset with a column called "ExtentId". 

**Return output** (for sync execution)

Output parameter |Type |Description 
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent in the source table, which has been moved to the destination table. 
ResultExtentId |string |A unique identifier (GUID) for the result extent which has been moved from the source table to the destination table. Upon failure - "Failed"

**Examples**

Moves all extents in table `MyTable` to table `MyOtherTable`.
```kusto
.move extents all from table MyTable to table MyOtherTable
```

Moves 2 specific extents (by their extent IDs) from table `MyTable` to table `MyOtherTable`.
```kusto
.move extents (AE6CD250-BE62-4978-90F2-5CB7A10D16D7,399F9254-4751-49E3-8192-C1CA78020706) from table MyTable to table MyOtherTable
```

Moves all extents from 2 specific tables (`MyTable1`, `MyTable2`) to table `MyOtherTable`.
```kusto
.move extents to table MyOtherTable <| .show tables (MyTable1,MyTable2) extents
```

**Example output** 

|OriginalExtentId |ResultExtentId 
|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687 
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be 
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df 

### .drop extents

Drops extents from specified database / table. 
This command has several variants: In one variant the extents to be dropped are specified by a Kusto query, whereas in 
the other variants extents are specified using a mini-language described below. 
 
#### Specifying Extents with a Query

Requires [Table admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) foreach of the tables which have extents returned by the provided query.

Drops extents (or just reports them without actually dropping if `whatif` is used):

**Syntax**

`.drop` `extents` [`whatif`] <| *query*

The extents are specified using a Kusto query that returns a recordset with a column called "ExtentId". 
 
#### Dropping a specific extent

Requires [Table admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) in case table name is specified.

Requires [Database admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) in case table name isn't specified.

**Syntax**

`.drop` `extent` *ExtentId* [`from` *TableName*]

#### Dropping specific multiple extents

Requires [Table admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) in case table name is specified.

Requires [Database admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) in case table name isn't specified.

**Syntax**

`.drop` `extents` `(`*ExtentId1*`,`...*ExtentIdN*`)` [`from` *TableName*]

#### Specifying Extents by Properties

Requires [Table admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) in case table name is specified.

Requires [Database admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) in case table name isn't specified.

`.drop` `extents` [`older` *N* (`days` | `hours`)] `from` (*TableName* | `all` `tables`) [`trim` `by` (`extentsize` | `datasize`) *N* (`MB` | `GB` | `bytes`)] [`limit` *LimitCount*]

* `older`: Only extents older than *N* days/hours will be dropped. 
* `trim`: The operation will trim the data in the database until the sum of extents matches the desired size (MaxSize) 
* `limit`: The operation will be applied to first *LimitCount* extents 

The command supports emulation (`.drop-pretend` instead of `.drop`) mode, which produces an output as if command would have run, 
but without actually executing it.

**Examples**

Remove all extents created more than 10 days ago from all tables in database `MyDatabase`

```kusto
.drop extents <| .show database MyDatabase extents | where CreatedOn < now() - time(10d)
```

Removes all extents in tables `Table1` and `Table2`, whose creation time was over 10 days ago:

```kusto
.drop extents older 10 days from tables (Table1, Table2)
```

Emulation mode: shows which extents would be removed by the command (extent ID parameter is not applicable for this command):

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
 
**Example output** 

|Extent Id |Table Name |Created On 
|---|---|---
|43c6e03f-1713-4ca7-a52a-5db8a4e8b87d |TestTable |2015-01-12 12:48:49.4298178 

### .replace extents

**Syntax**

`.replace` `[async]` `extents` `in` `table` *DestinationTableName* `<| 
{`*query for extents to be dropped from table*`},{`*query for extents to be moved to table*`}`

This command runs in the context of a specific database, 
moves the specified extents from their source tables to the destination table,
and drops the specified extents from the destination table.
All of the drop and move operations are done transactionally.

Requires [Table admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) for the source and destination tables.

* `async` (optional) specifies whether or not the command is executed asynchronously (in which case, an Operation ID (Guid) is returned,
  and the operation's status can be monitored using the [.show operations](./diagnostics.md#show-operations) command).

Specifying which extents should be dropped or moved is done by providing 2 queries
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
ResultExtentId |string |A unique identifier (GUID) for the result extent which has been moved from the source table to the destination table, or - empty, in case the extent was dropped from the destination table. Upon failure - "Failed"

**Examples**

Moves all extents from 2 specific tables (`MyTable1`, `MyTable2`) to table `MyOtherTable`, and drops all extents in `MyOtherTable` 
tagged with `drop-by:MyTag`:
```kusto
.replace extents in table MyOtherTable <|
    {.show table 'MyOtherTable' extents where tags has 'drop-by:MyTag'},
    {.show tables (MyTable1,MyTable2) extents}
```

**Example output** 

|OriginalExtentId |ResultExtentId 
|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687 
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be 
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df 

### .attach extents by metadata

**Syntax**

`.attach` [`async`] `extents` `by` `metadata` `<|` *Query to obtain extents metadata*

`.attach` [`async`] `extents` `into` `table` *DestinationTableName* `by` `metadata` `<|` *Query to obtain extents metadata*

- `async` (optional): specifies whether or not the command is executed asynchronously (in which case, an Operation ID (Guid) is returned,
  and the operation's status can be monitored using the [.show operations](./diagnostics.md#show-operations) command).

- *Query to obtain extents metadata*: a query or command which should have the following output schema:
  - *ExtentId*: `string`
  - *ExtentMetadata*: `string`
  - *TableName*: `string` (this column should exist with non-empty values in case *DestinationTableName* isn't explicitly specified in the command)

- This command runs in the context of a specific database, 
and attaches the specified extents to the destination table(s), according to the extents' metadata, as returned by 
*Query to obtain extents metadata*.
- The command can be used for restoring extents which have been soft-deleted, in case:
  - The extent container(s) the extents reside in have not yet been hard-deleted (according to the effective [retention policy](https://kusdoc2.azurewebsites.net/docs/concepts/retentionpolicy.html)).
  - A [purge](https://kusdoc2.azurewebsites.net/docs/concepts/compliance-gdpr.html) command hasn't been run on any table in the database since.


Requires [Cluster admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html).

**Restrictions**
- All extents specified by *Query to obtain extents metadata* are expected to reside in extent containers which are managed by the target database.
- All extents are expected to have at least a single common column with the destination table (a column is identified by its ID (GUID) in this case).

**Return output** (for sync execution)

Output parameter |Type |Description 
---|---|---
DatabaseName |string |The name of the destination database.
TableName |string |The name of the destination table.
ExtentsAttached |int |The number of extents which have been attached.

**Examples**

Attaches the last 10 extents dropped from `MyTable` in `MyDatabase` back to the table:

```kusto
.attach extents into table MyTable by metadata <|
    .show database MyDatabase journal
    | where Event == 'DROP-EXTENT-BY-RETENTION'
    | parse EntityContainerName with * 'Table=' TableName
    | where TableName == 'MyTable'
    | top 10 by EventTimestamp desc
    | project ExtentId = EntityName, ExtentMetadata = OriginalEntityState
```

Attaches the last 10 extents dropped from any table in `MyDatabase` back to the table(s):

```kusto
.attach extents into table MyTable by metadata <|
    .show database MyDatabase journal
    | where Event == 'DROP-EXTENT-BY-RETENTION'
    | parse EntityContainerName with * 'Table=' TableName
    | top 10 by EventTimestamp desc
    | project ExtentId = EntityName, ExtentMetadata = OriginalEntityState, TableName
```

**Example output** 

|DatabaseName |TableName |ExtentsAttached
|---|---|---
|MyDatabase |MyTable1 | 3
|MyDatabase |MyTable2 | 6
|MyDatabase |MyTable3 | 1

## Extent Tags

### .drop extent tags

**Syntax**

`.drop` `extent` `tags` `from` `table` *TableName* `(`'*Tag1*'[`,`'*Tag2*'`,`...`,`'*TagN*']`)`

`.drop` `extent` `tags` <| *query*

The command runs in the context of a specific database, and drops the provided [extent tag(s)](https://kusdoc2.azurewebsites.net/docs/concepts/extents.html#extent-tagging) from any extent in the provided database and table, which includes any of the tags.  

There are two ways to specify which tags should be removed from which extents:

1. By explicitly specifying the tags which should be removed from all extents in the specified table.
2. By providing a query whose results specify the extent IDs in the table and foreach extent - the tags which should be removed.

**Restrictions**
- All extents must be in the context database, and must belong to the same table. 

**Specifying Extents with a Query**

Requires [Table admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) for all involved source and destination tables.

```kusto 
.drop extent tags <| ...query... 
```

The extents and the tags to drop are specified using a Kusto query that returns a recordset with a column called "ExtentId" and a column called "Tags". 

*NOTE*: When using the [Kusto client library](../api/netfx/about-kusto-data.md), you can use the following methods in order to generate the desired command:
- `CslCommandGenerator.GenerateExtentTagsDropByRegexCommand(string tableName, string regex)`
- `CslCommandGenerator.GenerateExtentTagsDropBySubstringCommand(string tableName, string substring)`

**Return output**

Output parameter |Type |Description 
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent whose tags have been modified (and is dropped as part of the operation) 
ResultExtentId |string |A unique identifier (GUID) for the result extent which has modified tags (and is created and added as part of the operation). Upon failure - "Failed"
ResultExtentTags |string |The collection of tags which the result extent is tagged with (if any remain) 

**Examples**

Drops the `drop-by:Partition000` tag from any extent in table `MyOtherTable` which is tagged with it.
```kusto
.drop extent tags from table MyOtherTable ('drop-by:Partition000')
```

Drops the tags `drop-by:20160810104500`, `a random tag`, and/or `drop-by:20160810` from any extent in table `My Table` which is tagged with either of them.
```kusto
.drop extent tags from table [My Table] ('drop-by:20160810104500','a random tag','drop-by:20160810')
```

Drops all `drop-by` tags from extents in table `MyTable`.
```kusto
.drop extent tags <| 
  .show table MyTable extents 
  | where Tags != '' 
  | extend Tags = split(Tags, '\r\n') 
  | mvexpand Tags 
  | where Tags startswith 'drop-by'
```

Drops all tags matching regex `drop-by:StreamCreationTime_20160915(\d{6})` from extents in table `MyTable`.
```kusto
.drop extent tags <| 
  .show table MyTable extents 
  | where Tags != '' 
  | extend Tags = split(Tags, '\r\n')
  | mvexpand Tags 
  | where Tags matches regex @"drop-by:StreamCreationTime_20160915(\d{6})"
```

**Example output** 

|OriginalExtentId |ResultExtentId | ResultExtentTags 
|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687 | Partition001 
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be | 
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f | Partition001 Partition002
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df | 

### .alter extent tags

**Syntax**

`.alter` `extent` `tags` `(`'*Tag1*'[`,`'*Tag2*'`,`...`,`'*TagN*']`)` <| *query*

The command runs in the context of a specific database, and alters the [extent tag(s)](https://kusdoc2.azurewebsites.net/docs/concepts/extents.html#extent-tagging)
of all of the extents returned by the specified query, to the provided set of tags.

The extents and the tags to alter are specified using a Kusto query that returns a recordset with a column called "ExtentId".

Requires [Table admin permission](https://kusdoc2.azurewebsites.net/docs/concepts/accesscontrol/principal-roles.html) for all involved tables.

**Restrictions**
- All extents must be in the context database, and must belong to the same table. 

**Return output**

Output parameter |Type |Description 
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent whose tags have been modified (and is dropped as part of the operation) 
ResultExtentId |string |A unique identifier (GUID) for the result extent which has modified tags (and is created and added as part of the operation). Upon failure - "Failed"
ResultExtentTags |string |The collection of tags which the result extent is tagged with 

**Examples**

Alters tags of all the extents in table `MyTable` to `MyTag`.
```kusto
.alter extent tags ('MyTag') <| .show table MyTable extents
```

Alters tags of all the extents in table `MyTable`, tagged with `drop-by:MyTag` to `drop-by:MyNewTag` and `MyOtherNewTag`.
```kusto
.alter extent tags ('drop-by:MyNewTag','MyOtherNewTag') <| .show table MyTable extents where tags has 'drop-by:MyTag'
```

**Example output** 

|OriginalExtentId |ResultExtentId | ResultExtentTags 
|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687 | drop-by:MyNewTag MyOtherNewTag
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be | drop-by:MyNewTag MyOtherNewTag
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f | drop-by:MyNewTag MyOtherNewTag
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df | drop-by:MyNewTag MyOtherNewTag

## Extent Containers

### .show extentcontainers

```kusto
.show extentcontainers [with(state='<ReadWrite|ReadOnly|SoftDelete>', isrecyclable='<true|false>')]
```
    
Optional parameters:

* `state`: Only extent containers with the given state will be shown. 
* `isrecyclable`: Only extent containers with the given recyclable state will be shown.
    
**Examples**
    
Returns a set showing all the extent containers of the specified database.

```kusto
.show extentcontainers
```
    
Returns a set showing all the extent containers of the specified database which are in `ReadOnly` state.

```kusto    
.show extentcontainers with(state='ReadOnly')
```
    
Returns a set showing all the extent containers of the specified database which are recyclable.

```kusto    
.show extentcontainers with(isrecyclable='true')
```
    
Returns a set showing all the extent containers of the specified database which are not recyclable and are in `ReadWrite` state.

```kusto
.show extentcontainers with(state ='ReadWrite, isrecyclable='false')
```
 
**Return output***

Output parameter |Type |Description 
---|---|---
Moniker |Guid |A unique identifier for the extent container.
Url |String |Indicates the persistent storage URI which the container is linked to.
State |String |Indicates the state of the container (`ReadWrite`, `ReadOnly` or `SoftDelete`)
CreatedOn |DateTime |Indicates the UTC time of when the container was created. 
MaxDateTime |DateTime |Indicates the maximum value among the container's extents' MaxCreatedOn property.
IsRecyclable |Boolean |Indicates whether or not the container can be periodically recycled by the Data Management service.
StoresDatabaseMetadata |Boolean |Indicates whether or not the container stores the database's metadata (there is exactly one container per database which has this set to `true`).
HardDeletePeriod |TimeSpan |Indicates the time span after which the extent container will get hard deleted from storage. 

### .drop extentcontainers

```kusto
.alter extentcontainers [DatabaseName] drop [ContainerId]  

.alter extentcontainers [DatabaseName] drop 
```
 
 **Examples**

```kusto
.alter extentcontainers TestDB drop 97a5fcce-6bd6-4339-a11b-66ee21964602
```

* Drops the given container (by ID) from the database and from persistent storage.
* The container must not be in `ReadWrite` state. 
* The command also drops all the extents in the container from the database's metadata, and physically deletes the path of the container.
* To find a container ID, one can run `.show extentcontainers | where Url == '...'` on the relevant database.

```kusto
.alter extentcontainers TestDB drop
```

* Drops the containers from the database which are: 
  * In `SoftDelete` state and their hard retention period had passed (measured from the container's creation datetime). 
  * Are in `ReadOnly` state and have no extents contained in them. 
* The command also drops all the extents in the container from the database's metadata, and physically deletes the path of the container 

**Return output***

Output parameter |Type |Description 
---|---|---
DatabaseName |String |The name of the database the containers were dropped from.
Result |String |Upon success - the number of extent containers which were dropped from the database. Upon failure - a database-specific error message.

### .add extentcontainers

```kusto
.alter extentcontainers [DatabaseName] add [BlobContainerUrl;Key]|[Network Path]|[Local Path] [HardDeletePeriod]
```
 
 **Examples**

```kusto
.alter extentcontainers TestDB add @"https://myaccount1.blob.core.windows.net/testdb1;account-key-goes-here=="
```

* Adds an extent container to a database named `TestDB`, with the given URI. 
* For clusters hosted in Azure, the first part of the URI is a pointer to an Azure blob container, while the second (after the semicolon, ';') 
  is the Azure storage account key. 
* The command also physically creates the path if it doesn't already exist (excluding in Azure storage, in case the underlying storage account 
  doesn't already exist).
* If no `HardDeletePeriod` is specified, the extent container will be added with the maximum hard delete period which is set to the given 
  database and its tables.

```kusto
.alter extentcontainers TestDB add @"https://myaccount1.blob.core.windows.net/testdb1;account-key-goes-here==" 10d
```

* Creates an extent container with a hard delete period of 10 days. 
* This means that if all extents are dropped from the extent container, and 10 days have passed since its creation time, 
  the container will get hard-deleted from persistent storage, and removed from the database.

**Return output***

Output parameter |Type |Description 
---|---|---
Moniker |Guid |A unique identifier for the added extent container.
Url |String |Indicates the persistent storage URI which the container is linked to.
State |String |Indicates the state of the container (`ReadWrite`, `ReadOnly` or `SoftDelete`)
CreatedOn |DateTime |Indicates the UTC time of when the container was created. 
MaxDateTime |DateTime |Indicates the maximum value among the container's extents' MaxCreatedOn property.
IsRecyclable |Boolean |Indicates whether or not the container can be periodically recycled by the Data Management service.
StoresDatabaseMetadata |Boolean |Indicates whether or not the container stores the database's metadata (there is exactly one container per database which has this set to `true`).
HardDeletePeriod |TimeSpan |Indicates the time span after which the extent container will get hard deleted from storage. 

### .recycle extentcontainers

 `Recycle` is an operation which consists of:
 * Setting the state of an existing container to `ReadOnly`.
 * Creating a new container (with `ReadWrite` state).
 This operation runs periodically and modifies extent containers in the cluster based on the `ContainerRecyclingPeriod`, as it is
 defined in the database's or table's [Retention Policy](https://kusdoc2.azurewebsites.net/docs/concepts/retentionpolicy.html), and is done in purpose to allow 
 periodic hard-deletion of data (in resolution of containers and not single files).

```kusto
.alter extentcontainers [DatabaseName] recycle [ContainerId] 

.alter extentcontainers [DatabaseName] recycle older [AgeInHours] hours 
```

**Examples**

```kusto
.alter extentcontainers TestDB recycle 97a5fcce-6bd6-4339-66ee21964602
```

* Creates a new container in `ReadWrite` state and sets the given container to have `ReadOnly` state. 
* The given container must be in `ReadWrite` state.
* The given container must have `IsRecyclable == true` and `StoresDatabaseMetadata == false`. 
* To find a container ID, one can run `.show extentcontainers | where Url == '...'` on the relevant database.

```kusto
.alter extentcontainers TestDB recycle older 24 hours
```

* Creates a new container in `ReadWrite` state, and sets the state of any existing container with the following attributes to `ReadOnly`: 
 * The existing container was created more than 24 hours ago.
 * The existing container is in `ReadWrite` state. 
 * The existing container has `IsRecyclable == true` and `StoresDatabaseMetadata == false`. 

**Return output**

Output parameter |Type |Description 
---|---|---
DatabaseName |String |The name of the database the containers were recycled in.
Result |String |Upon success - the number of extent containers which were recycled in the database. Upon failure - a database-specific error message.
 
### .alter extentcontainers

Alters the state of an extent container in a database.
 
```kusto
.alter extentcontainers [DatabaseName] set state [ContainerId] to readonly|readwrite 
```
 
**Examples**

```kusto
.alter extentcontainers TestDB set state 97a5fcce-6bd6-4339-a11b-66ee21964602 to readonly
```

* Sets the state of the given container (by ID) to `ReadOnly`.
* To find a container ID, one can run `.show extentcontainers | where Url == '...'` on the relevant database.