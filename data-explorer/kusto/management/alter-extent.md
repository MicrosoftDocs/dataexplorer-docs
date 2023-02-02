---
title: .alter extent tags - Azure Data Explorer
description: This article describes the alter extent command in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/02/2020
---

# .alter extent tags

The command runs in the context of a specific database. It alters the specified [extent tags](extents-overview.md#extent-tagging) of all of the extents returned by the query.

The extents whose tags should be altered are specified using a Kusto query that returns a recordset with a column called "ExtentId".

> [!NOTE]
> Data shards are called **extents** in Kusto, and all commands use "extent" or "extents" as a synonym.
> For more information on extents, see [Extents (Data Shards) Overview](extents-overview.md).

## Permissions

This command requires [Table Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter` [`async`] `extent` `tags` `(`'*Tag1*'[`,`'*Tag2*'`,`...`,`'*TagN*']`)` <| *query*

`.alter-merge` [`async`] `extent` `tags` `(`'*Tag1*'[`,`'*Tag2*'`,`...`,`'*TagN*']`)` <| *query*

* `.alter` or `.alter-merge`:
  * `.alter` sets the collection of the extent's tags to the specified tags, while overriding the extent's existing tags.
  * `.alter-merge` sets the collection of the extent's tags to the union of the specified tags and the extent's existing tags.

* `async` (optional): Execute the command asynchronously.
   * An Operation ID (Guid) is returned. 
   * The operation's status can be monitored. Use the [`.show operations`](operations.md#show-operations) command.
   * You can retrieve the results of a successful execution. Use the [`.show operation details`](operations.md#show-operation-details) command.

## Restrictions

All extents must be in the context database, and must belong to the same table.

## Return output

|Output parameter |Type |Description|
|---|---|---|
|OriginalExtentId |string |A unique identifier (GUID) for the original extent whose tags have been modified. The extent is dropped as part of the operation.|
|ResultExtentId |string |A unique identifier (GUID) for the result extent that has modified tags. The extent is created and added as part of the operation. Upon failure - "Failed".|
|ResultExtentTags |string |The collection of tags that the result extent is tagged with, or "null" in case the operation fails.|
|Details |string |Includes the failure details if the operation fails.|

## Examples

### Alter tags 

Alter tags of all the extents in table `MyTable` to `MyTag`

```kusto
.alter extent tags ('MyTag') <| .show table MyTable extents
```

### Alter tags of specific extents

Alter tags of all the extents in table `MyTable`, tagged with `drop-by:MyTag` to `drop-by:MyNewTag` and `MyOtherNewTag`

```kusto
.alter extent tags ('drop-by:MyNewTag','MyOtherNewTag') <| .show table MyTable extents where tags has 'drop-by:MyTag'
```

### Alter-merge tags of specific extents

Alter-merges tags of all the extents in table `MyTable`, tagged with `drop-by:MyTag` to `drop-by:MyNewTag` and `MyOtherNewTag`, by
appending 2 new tags to their existing collection of tags

```kusto
.alter-merge extent tags ('drop-by:MyNewTag','MyOtherNewTag') <| .show table MyTable extents where tags has 'drop-by:MyTag'
```


## Sample output

|OriginalExtentId |ResultExtentId | ResultExtentTags | Details
|---|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687 | drop-by:MyNewTag MyOtherNewTag| 
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be | drop-by:MyNewTag MyOtherNewTag| 
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f | drop-by:MyNewTag MyOtherNewTag| 
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df | drop-by:MyNewTag MyOtherNewTag| 
