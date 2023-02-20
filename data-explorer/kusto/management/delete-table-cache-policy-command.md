---
title: .delete table cache policy command - Azure Data Explorer
description: This article describes the .delete table cache policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/27/2021
---
# .delete table cache policy

Delete the table cache policy. To speed up queries on data, Azure Data Explorer caches it on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) lets Azure Data Explorer describe the data artifacts that it uses so that important data can take priority. 

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` [*DatabaseName* `.`]*TableName* `policy` `caching`

## Arguments

*DatabaseName* - Specify the name of the database.
*TableName* - Specify the name of the table. Use without *DatabaseName* when running in the required database's context.

## Example

The following example deletes the caching policy.

```kusto
.delete table MyTable policy 
```
