---
title: Best practices for schema design - Azure Data Explorer
description: This article describes Best practices for schema design in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/18/2020
---
# Best practices for schema design

Here are several best practices to follow. They'll help make your management commands work better, and have a lighter impact on the service resources.

|Action  |Use  |Don't use | Notes |
|---------|---------|---------|----
| **Create multiple tables**    |  Use a single [`.create tables`](create-tables-command.md) command       | Issue many `.create table` commands        | |
| **Rename multiple tables**    | Make a single call to [`.rename tables`](rename-table-command.md)        |  Issue a separate call for each pair of tables   |    |
|**Show commands** <ul><li>Show extents </li><li>Show database schema.</li></ul>    |   Use the lowest-scoped `.show` command <ul><li> `.show table T extents` </li> <li>`.show database DB schema`</ul></li> |   Apply filters after a pipe (`|`) <ul> <li>  `.show cluster extents | where TableName == 'T'` </li><li> `.show schema | where DatabaseName == 'DB'`  </ul></li>  | Limit use as much as possible. When possible, cache the information they return. |
| **Show schema on a cluster which a large schema** (for example, with more than 100 databases) | [`.show databases schema`](../management/show-schema-database.md) | `.show schema`|
| **Check a table's existence or get the table's schema**| `.show table T schema as json`|  `.show table T` (Only use this command to get actual statistics on a single table)|
| **Define the schema for a table that will include `datetime` values**  |Set the relevant columns to the `datetime` type | Convert `string` or numeric, such as `long`, columns to `datetime` at query time for filtering, if that can be done before or during ingestion time|
| **Add extent tag to metadata** |Use sparingly ||In particular, `drop-by:` tags limit the system's ability to do performance-oriented grooming processes in the background. <br>For more information, see [performance notes](../management/extents-overview.md#extent-tagging). |
