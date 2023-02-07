---
title: .delete database cache policy command - Azure Data Explorer
description: This article describes the .delete database cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/27/2021
---
# .delete database cache policy

Delete the database cache policy.  To speed up queries on data, Azure Data Explorer caches it, or parts of it, on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) enables Azure Data Explorer to describe the data artifacts that it uses, so that more important data can take priority.

## Permissions

This command requires at least [Database Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.delete` `database` *DatabaseName* `policy` `caching`

## Arguments

*DatabaseName* - Specify the name of the database.

## Example

The following example deletes the caching policy.

```kusto
.delete database MyDatabase policy caching
```