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

1. If you need to create multiple tables use a single [`.create tables`](create-tables-command.md) command, instead of issuing many `.create table` commands.
2. If you need to rename multiple tables, make a single call to [`.rename tables`](rename-table-command.md), instead of issuing a separate call for each pair of tables.
3. Use the lowest-scoped `.show` command, instead of applying filters after a pipe (`|`). For example:
    * Use `.show table T extents` instead of `.show cluster extents | where TableName == 'T'`
    * Use `.show database DB schema` instead of `.show schema | where DatabaseName == 'DB'`.
4. Use `.show table T` only if you need to get actual statistics on a single table. If you just need to check a table's existence, or to get the table's schema, use `.show table T schema as json`.
5. When defining the schema for a table that will include datetime values, make sure that the relevant columns are set to the `datetime` type.
    * Kusto is highly optimized for filtering on `datetime` columns. Don't convert `string` or numeric, such as `long`, columns to `datetime` at query time for filtering, if that can be done before or during ingestion time.

## Don't

1. Don't run `.show` commands too frequently (such as, `.show schema`, `.show databases`, `.show tables`). When possible, cache the information they return.
2. Don't Run `.show schema` command on a cluster which a large schema (for example, with more than 100 databases). Instead, use [`.show databases schema`](../management/show-schema-database.md).
3. Don't run [command-then-query](index.md#combining-queries-and-control-commands) operations too frequently.
    * *command-then-query*: Pipes the result set of the control command and applies filters/aggregations on it.
        * For example: `.show ... | where ... | summarize ...`
    * When running something like: `.show cluster extents | count` (emphasis on the `| count`), Kusto first prepares a data table that holds all details of all extents in the cluster. The system then sends that in-memory-only table to the Kusto engine to do the count. The system actually works hard in an unoptimized path to give you such a trivial answer.
4. Don't excessively use extent tags as part of data ingestion. Especially when using `drop-by:` tags that limit the system's ability to do performance-oriented grooming processes in the background.
    * For more information, see [performance notes](../management/extents-overview.md#extent-tagging).
