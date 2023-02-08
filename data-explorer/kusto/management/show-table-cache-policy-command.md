---
title: .show table cache policy command - Azure Data Explorer
description: This article describes the .show table cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/27/2021
---
# .show table cache policy

Show the table cache policy. To speed up queries on data, Azure Data Explorer caches it on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority.

## Permissions

You must have Database User, Database Viewer, or Database Monitor permissions to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` [*DatabaseName* `.`]*TableName* `policy` `caching`

## Arguments

*DatabaseName* - Specify the name of the database.
*TableName* - Specify the name of the table. Use without *DatabaseName* when running in the required database's context.

## Examples

The following examples shows the table caching policy:

```kusto
.show table MyDatabase.MyTable policy caching 
```

```kusto
.show table MyTable policy caching 
```