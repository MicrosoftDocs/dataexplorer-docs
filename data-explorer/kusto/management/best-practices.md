---
title: Best practices for schema design - Azure Data Explorer | Microsoft Docs
description: This article describes Best practices for schema design in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2019
---
# Best practices for schema design

There are several "Dos and Don'ts" you can follow to make your management commands perform better and have a lighter effect on the service.

## Do

1. If you need to create multiple tables use the [`.create tables`](../management/tables.md#create-tables) command, instead of issuing many `.create table` commands.
2. If you need to rename multiple tables, do this with a single call to [`.rename tables`](../management/tables.md#rename-tables), instead of by issuing a separate call for each pair of tables.
3. Use the lowest-scoped `.show` command, instead of applying filters after a pipe (`|`). For example:
    - Use `.show table T extents` instead of `.show cluster extents | where TableName == 'T'`
    - Use `.show database DB schema` instead of `.show schema | where DatabaseName == 'DB'`.
4. Use `.show table T` only if you need to get actual statistics on a single table. If you just need to check table's existence, or simply get the table's schema, use `.show table T schema as json`.
5. When defining the schema for a table which will include datetime values, make sure that these columns are typed with the `datetime` type.
    - Kusto is highly-optimized for filtering on `datetime` columns. Don't convert `string` or numeric (e.g. `long`) columns to `datetime` at query time for filtering, if that can be done before or during ingestion time.

## Don't

1. Don't run `.show` commands too frequently (e.g. `.show schema`, `.show databases`, `.show tables`). When possible - cache the information they return.
2. Don't Run `.show schema` command on a cluster which a large schema (e.g. with more than 100 databases). Instead, use [`.show databases schema`](../management/databases.md#show-databases-schema).
3. Don't run [command-then-query](index.md#combining-queries-and-control-commands) operations too frequently.
    - *command-then-query*: means piping the result set of the control command and applying filters/aggregations on it.
        - For example: `.show ... | where ... | summarize ...`
    - When running something like: `.show cluster extents | count` (emphasis on the `| count`), Kusto first prepares a data table holding all details on all extents in the cluster, and then sends that in-memory only table to the Kusto engine in order to do the count. This means that Kusto actually works very hard in an un-optimized path to give you back such a trivial answer.
4. Excessively using extent tags as part of data ingestion. Especially when using `drop-by:` tags, which limit the system's ability to perform performance-oriented grooming processes in the background.
    - See performance notes [here](../management/extents-overview.md#extent-tagging).