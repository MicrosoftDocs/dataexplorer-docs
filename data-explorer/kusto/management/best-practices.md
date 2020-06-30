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

Here are several "Dos and Don'ts" that you can follow. They'll help make your management commands work better, and have a lighter impact on the service resources.

## Do

|To do this  |Use this  |Not this | 
|---------|---------|---------|
| Create multiple tables    |  Use a single [`.create tables`](create-tables-command.md) command       | Issue many `.create table` commands        |
| Rename multiple tables    | Make a single call to [`.rename tables`](rename-table-command.md)        |  Issue a separate call for each pair of tables       |
|Show commands     |   Use the lowest-scoped `.show` command  |   Apply filters after a pipe (`|`)      |
|**Example** <br>Show extents    | `.show table T extents`   |  `.show cluster extents | where TableName == 'T'`    |
|**Example** <br>Show database schema     |  `.show database DB schema`        |  `.show schema | where DatabaseName == 'DB'`       |
| Check a table's existence or get the table's schema| `.show table T schema as json`|  `.show table T` (Only use this command to get actual statistics on a single table)|
| Define the schema for a table that will include `datetime` values  |Set the relevant columns to the `datetime` type | Convert `string` or numeric, such as `long`, columns to `datetime` at query time for filtering, if that can be done before or during ingestion time|
| Show schema on a cluster which a large schema (for example, with more than 100 databases) | [`.show databases schema`](../management/show-schema-database.md) | `.show schema`|

## Don't

* Don't run `.show` commands too frequently (such as, `.show schema`, `.show databases`, `.show tables`). When possible, cache the information they return.

* Don't run [command-then-query](index.md#combining-queries-and-control-commands) operations too frequently.
    * *command-then-query*: Pipes the result set of the control command and applies filters/aggregations on it.
        * For example: `.show ... | where ... | summarize ...`
    * When running something like: `.show cluster extents | count` (emphasis on the `| count`), Kusto first prepares a data table that holds all details of all extents in the cluster. The system then sends that in-memory-only table to the Kusto engine to do the count. The system actually works hard in an unoptimized path to give you such a trivial answer.
* Don't excessively use extent tags as part of data ingestion. Especially when using `drop-by:` tags that limit the system's ability to do performance-oriented grooming processes in the background.
    * For more information, see [performance notes](../management/extents-overview.md#extent-tagging).
