---
title:  Best practices for schema management
description:  This article describes Best practices for schema management.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/18/2020
---

# Best practices for schema management

Here are several best practices to follow. They'll help make your management commands work better, and have a lighter impact on the service resources.

|Action  |Use  |Don't use | Notes |
|---------|---------|---------|----
| **Create multiple tables**    |  Use a single [`.create tables`](create-tables-command.md) command       | Don't issue many `.create table` commands        | |
| **Rename multiple tables**    | Make a single call to [`.rename tables`](rename-table-command.md)        |  Don't issue a separate call for each pair of tables   |    |
|**Show commands**   |   Use the lowest-scoped `.show` command |   Don't apply filters after a pipe (`|`)   </ul></li>  | Limit use as much as possible. When possible, cache the information they return. |
| Show extents  | Use `.show table T extents`   |Don't use `.show cluster extents | where TableName == 'T'`  |
|  Show database schema. |Use `.show database DB schema`  |  Don't use `.show schema | where DatabaseName == 'DB'` |
| **Show schema on a cluster which a large schema** <br> |Use [`.show databases schema`](../management/show-schema-database.md) |Don't use `.show schema`| For example, use on cluster with more than 100 databases.
| **Check a table's existence or get the table's schema**|Use `.show table T schema as json`|Don't use  `.show table T` |Only use this command to get actual statistics on a single table.|
| **Define the schema for a table that will include `datetime` values**  |Set the relevant columns to the `datetime` type | Don't convert `string` or numeric columns to `datetime` at query time for filtering, if that can be done before or during ingestion time|
| **Add extent tag to metadata** |Use sparingly |Avoid `drop-by:` tags, which limit the system's ability to do performance-oriented grooming processes in the background.|  <br> See [performance notes](../management/extent-tags.md). |
