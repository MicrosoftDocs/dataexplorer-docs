---
title: .show extents - Azure Data Explorer
description: This article describes Extents (data shards) management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 07/02/2020
---

# .show extents

Data shards are called **extents** in Kusto, and all commands use "extent" or "extents" as a synonym.

> [!NOTE]
> For more information on extents, see [Extents (Data Shards) Overview](extents-overview.md).

**Cluster Level**

`.show` `cluster` `extents` [`hot`]

Shows information about extents (data shards) that are present in the cluster.
If `hot` is specified - shows only extents that are expected to be in the hot cache.

## Database level

`.show` `database` *DatabaseName* `extents` [`(`*ExtentId1*`,`...`,`*ExtentIdN*`)`] [`hot`] [`where` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag1* [`and` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag2*...]]

Shows information about extents (data shards) that are present in the specified database.
If `hot` is specified - shows only extents that expected to be in the hot cache.

## Table level

`.show` `table` *TableName* `extents` [`(`*ExtentId1*`,`...`,`*ExtentIdN*`)`] [`hot`] [`where` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag1* [`and` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag2*...]]

`.show` `tables` `(`*TableName1*`,`...`,`*TableNameN*`)` `extents` [`(`*ExtentId1*`,`...`,`*ExtentIdN*`)`] [`hot`] [`where` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag1* [`and` `tags` (`has`|`contains`|`!has`|`!contains`) *Tag2*...]]

Shows information about extents (data shards) that are present in the specified tables. The database is taken from the command's context.
If `hot` is specified, shows only extents that are expected to be in the hot cache.

## Notes

* Using database or table level commands is much faster than filtering (adding `| where DatabaseName == '...' and TableName == '...'`) the results of a cluster-level command.
* If the optional list of extent IDs is provided, the returned data set is limited to those extents only.
    * This method is much faster than filtering (adding `| where ExtentId in(...)` to) the results of "bare" commands.
* If `tags` filters are specified:
  * The returned list is limited to those extents whose tags collection obeys *all* of the provided tags filters.
    * This method is much faster than filtering (adding `| where Tags has '...' and Tags contains '...'` to) the results of "bare" commands.
  * `has` filters are equality filters. Extents that aren't tagged with either of the specified tags will be filtered out.
  * `!has` filters are equality negative filters. Extents that are tagged with either of the specified tags will be filtered out.
  * `contains` filters are case-insensitive substring filters. Extents that don't have the specified strings as a substring of any of their tags will be filtered out.
  * `!contains` filters are case-insensitive substring negative filters. Extents that have the specified strings as a substring of any of their tags will be filtered out.
  
### Examples
    
* Extent `E` in table `T` is tagged with tags `aaa`, `BBB`, and `ccc`.
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

## Output parameters

|Output parameter |Type |Description |
|---|---|---|
|ExtentId |Guid |ID of the extent 
|DatabaseName |String |Database that the extent belongs to
|TableName |String |Table that the extents belong to
|MaxCreatedOn |DateTime |Date-time when the extent was created. For a merged extent, the maximum of creation times among source extents
|OriginalSize |Double |Original size in bytes of the extent data
|ExtentSize |Double |Size of the extent in memory (compressed + index)
|CompressedSize |Double |Compressed size of the extent data in memory
|IndexSize |Double |Index size of the extent data
|Blocks |Long |Number of data blocks in the extent
|Segments |Long |Number of data segments in the extent
|AssignedDataNodes |String | Deprecated (an empty string)
|LoadedDataNodes |String |Deprecated (an empty string)
|ExtentContainerId |String | ID of the extent container the extent is in
|RowCount |Long |Number of rows in the extent
|MinCreatedOn |DateTime |Date-time when the extent was created. For a merged extent, the minimum of creation times among the source extents
|Tags|String|Tags, if any, defined for the extent
 
## Examples

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
