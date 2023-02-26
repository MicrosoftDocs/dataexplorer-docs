---
title: .delete database cache policy command - Azure Data Explorer
description: This article describes the .delete database cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .delete database cache policy

Delete the database cache policy.  To speed up queries, Azure Data Explorer caches data on its processing nodes, in SSD, or even in RAM. The [cache policy](cachepolicy.md) enables Azure Data Explorer to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `database` *DatabaseName* `policy` `caching`

## Arguments

*DatabaseName* - Specify the name of the database.

## Example

The following example deletes the caching policy.

```kusto
.delete database MyDatabase policy caching
```
