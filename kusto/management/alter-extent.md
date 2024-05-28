---
title: .alter extent tags command
description: Learn how to use the `.alter extent tags` command to change the extent tags.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 04/20/2023
---

# .alter extent tags command

The command runs in the context of a specific database. It alters the specified [extent tags](extent-tags.md) of all of the extents returned by the query.

The extents whose tags should be altered are specified using a Kusto query that returns a record set with a column called "ExtentId".

> [!NOTE]
> Data shards are called **extents** in Kusto, and all commands use "extent" or "extents" as a synonym.
> For more information on extents, see [Extents (Data Shards) Overview](extents-overview.md).

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` [`async`] `table` '*TableName*' `extent` `tags` `(`*Tags*`)` `with` `(` `extentCreatedOnFrom`='*FromDate*' `,` `extentCreatedOnTo`='*ToDate*'`)` <| *Query*

`.alter-merge` [`async`] `table` '*TableName*' `extent` `tags` `(`*Tags*`)` `with` `(` `extentCreatedOnFrom`='*FromDate*' `,` `extentCreatedOnTo`='*ToDate*'`)` <| *Query*

* `.alter` sets the collection of the extent's tags to the specified tags, while overriding the extent's existing tags.
* `.alter-merge` sets the collection of the extent's tags to the union of the specified tags and the extent's existing tags.

> [!NOTE]
> For better performance, set extentCreatedOnFrom and extentCreatedOnTo parameters to the smallest possible range 

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|`async`| `string` ||If specified, the command will run asynchronously. The return output when run with `async` is an operation ID (guid) that can be used to monitor the operation's status. Use [`.show operations`](show-operations.md) or [`.show operation details`](show-operation-details.md).|
|*Tags*| `string` | :heavy_check_mark:|One or more comma-separated extent tags. Each tag should be enclosed in single quotes (`'`).|
|*Query*| `string` | :heavy_check_mark:|Specifies the extents whose tags should be altered.|

## Restrictions

All extents must be in the context database, and must belong to the same table.

## Returns

|Output parameter |Type |Description|
|---|---|---|
|OriginalExtentId | `string` |A unique identifier (GUID) for the original extent whose tags have been modified. The extent is dropped as part of the operation.|
|ResultExtentId | `string` |A unique identifier (GUID) for the result extent that has modified tags. The extent is created and added as part of the operation. Upon failure - "Failed".|
|ResultExtentTags | `string` |The collection of tags that the result extent is tagged with, or "null" in case the operation fails.|
|Details | `string` |Includes the failure details if the operation fails.|

## Examples

### Alter tags

Alter tags of all the extents within the specified creation time range in table `MyTable` to `MyTag`

```kusto
.alter table MyTable extent tags ('MyTag') with (extentCreatedOnFrom=datetime(2023-03-10), extentCreatedOnTo=datetime(2023-03-12)) <| .show table MyTable extents
```

### Alter tags of specific extents

Alter tags of all the extents within the specified creation time range in table `MyTable`, tagged with `drop-by:MyTag` to `drop-by:MyNewTag` and `MyOtherNewTag`

```kusto
.alter table MyTable extent tags ('drop-by:MyNewTag','MyOtherNewTag') with (extentCreatedOnFrom=datetime(2023-03-10), extentCreatedOnTo=datetime(2023-03-12)) <| .show table MyTable extents where tags has 'drop-by:MyTag'
```

### Alter-merge tags of specific extents

Alter-merges tags of all the extents within the specified creation time range in table `MyTable`, tagged with `drop-by:MyTag` to `drop-by:MyNewTag` and `MyOtherNewTag`, by
appending 2 new tags to their existing collection of tags

```kusto
.alter-merge table MyTable extent tags ('drop-by:MyNewTag','MyOtherNewTag') with (extentCreatedOnFrom=datetime(2023-03-10), extentCreatedOnTo=datetime(2023-03-12)) <| .show table MyTable extents where tags has 'drop-by:MyTag'
```

## Sample output

|OriginalExtentId |ResultExtentId | ResultExtentTags | Details
|---|---|---|---
|e133f050-a1e2-4dad-8552-1f5cf47cab69 |0d96ab2d-9dd2-4d2c-a45e-b24c65aa6687 | drop-by:MyNewTag MyOtherNewTag| 
|cdbeb35b-87ea-499f-b545-defbae091b57 |a90a303c-8a14-4207-8f35-d8ea94ca45be | drop-by:MyNewTag MyOtherNewTag| 
|4fcb4598-9a31-4614-903c-0c67c286da8c |97aafea1-59ff-4312-b06b-08f42187872f | drop-by:MyNewTag MyOtherNewTag| 
|2dfdef64-62a3-4950-a130-96b5b1083b5a |0fb7f3da-5e28-4f09-a000-e62eb41592df | drop-by:MyNewTag MyOtherNewTag| 
