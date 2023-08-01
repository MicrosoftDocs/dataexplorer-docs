---
title: .show databases command
description: Learn how to use the `.show databases` command to show records of databases in the cluster that the user has access to.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# .show databases command

Returns a table in which every record corresponds to a database in the cluster that the user has access to.

For a table that shows the properties of the context database, see [`.show database`](show-database.md).

## Syntax

`.show` `databases`

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Returns

|Column name       |Column type|Description                                                                  |
|------------------|-----------|-----------------------------------------------------------------------------|
|DatabaseName      |`string`   |The name of the database attached to the cluster                    |
|PersistentStorage |`string`   |The persistent storage "root" of the database. For internal use only          |
|Version           |`string`   |The version of the database. For internal use only                       |
|IsCurrent         |`bool`     |Whether this database is the database context of the request                    |
|DatabaseAccessMode|`string`   |One of `ReadWrite`, `ReadOnly`, `ReadOnlyFollowing`, or `ReadWriteEphemeral`    |
|PrettyName        |`string`   |The pretty name of the database, if any                        |
|ReservedSlot1     |`bool`     |Reserved. For internal use only              |
|DatabaseId        |`guid`     |A globally unique identifier for the database. For internal use only          |
