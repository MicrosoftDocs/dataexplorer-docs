---
title: .drop extent tags - Azure Data Explorer
description: This article describes the drop extent tags command in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/21/2023
---

# .drop extent tags

The command runs in the context of a specific database. It drops specific [extent tags](extents-overview.md#extent-tagging) from all or specific extents in the database and table.  

> [!NOTE]
> Data shards are called **extents** in Kusto, and all commands use "extent" or "extents" as a synonym.
> For more information on extents, see [Extents (Data Shards) Overview](extents-overview.md).

There are two ways to specify which tags should be removed from which extents:

* Explicitly specify the tags that should be removed from all extents in the specified table.
* Provide a query whose results specify the extent IDs in the table, and for each extent - the tags that should be removed.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions for all involved source and destination tables.

## Syntax

`.drop` [`async`] `extent` `tags` `from` `table` *TableName* `(`'*Tag1*'[`,`'*Tag2*'`,`...`,`'*TagN*']`)`

`.drop` [`async`] `extent` `tags` <| *query*

`async` (optional): Execute the command asynchronously.

* An Operation ID (Guid) is returned.
* The operation's status can be monitored. Use the [`.show operations`](operations.md#show-operations) command.
* Use the [`.show operation details`](operations.md#show-operation-details) command to retrieve the results of a successful execution.

## Restrictions

All extents must be in the context database, and must belong to the same table.

## Specify extents with a query

The extents and the tags to drop are specified using a Kusto query. It returns a recordset with a column called "ExtentId" and a column called "Tags".

> [!NOTE]
> When using the [Kusto .NET client library](../api/netfx/about-kusto-data.md), the following methods will generate the required command:
>
> * `CslCommandGenerator.GenerateExtentTagsDropByRegexCommand(string tableName, string regex)`
> * `CslCommandGenerator.GenerateExtentTagsDropBySubstringCommand(string tableName, string substring)`

### Syntax for .drop extent tags in query

```kusto
.drop extent tags <| ...query...
```

### Return output

Output parameter |Type |Description
---|---|---
OriginalExtentId |string |A unique identifier (GUID) for the original extent whose tags have been modified. The extent is dropped as part of the operation.
ResultExtentId |string |A unique identifier (GUID) for the result extent that has modified tags. The extent is created and added as part of the operation. Upon failure - "Failed".
ResultExtentTags |string |The collection of tags that the result extent is tagged with, if any remain, or "null" in case the operation fails.
Details |string |Includes the failure details if the operation fails.

## Examples

### Drop one tag

Drop the `drop-by:Partition000` tag from any extent in table that is tagged with it:

```kusto
.drop extent tags from table MyOtherTable ('drop-by:Partition000')
```

### Drop several tags

Drop the the tags `drop-by:20160810104500`, `a random tag`, and `drop-by:20160810` from any extent in table that is tagged with either of them:

```kusto
.drop extent tags from table [My Table] ('drop-by:20160810104500','a random tag','drop-by:20160810')
```

### Drop all `drop-by` tags

Drop all `drop-by` tags from extents in table `MyTable`:

```kusto
.drop extent tags <| 
  .show table MyTable extents 
  | where isnotempty(Tags)
  | extend Tags = split(Tags, '\r\n') 
  | mv-expand Tags to typeof(string)
  | where Tags startswith 'drop-by'
```

### Drop all tags matching specific regex

Drop all tags matching regex `drop-by:StreamCreationTime_20160915(\d{6})` from extents in table `MyTable`:

```kusto
.drop extent tags <| 
  .show table MyTable extents 
  | where isnotempty(Tags)
  | extend Tags = split(Tags, '\r\n')
  | mv-expand Tags to typeof(string)
  | where Tags matches regex @"drop-by:StreamCreationTime_20160915(\d{6})"
```

## Sample output

|OriginalExtentId |ResultExtentId | ResultExtentTags | Details
|---|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687 | Partition001 |
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be | |
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f | Partition001 Partition002 |
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df | |
