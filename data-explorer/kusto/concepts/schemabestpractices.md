---
title: Schema Best Practices - Azure Data Explorer | Microsoft Docs
description: This article describes Schema Best Practices in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Schema Best Practices

There are several DOs and DONTs you can follow to make your schema related control commands to perform better and to have a smaller load on the service.

**DOs**

1. If you need to create multiple tables use the[`.create tables`](../management/tables.md#create-tables) command.
2. If you need to rename multiple tables, do this with a single call to [`.rename tables`](../management/tables.md#rename-tables) and not by using a separate call per tables pair.
3. Use the lowest-scoped `.show` command instead of applying filters after a pipe (`|`). For example:
    - use `.show table T extents` instead of `.show cluster extents | where TableName == 'T'`
    - use `.show database DB schema` instead of `.show schema | where DatabaseName == 'DB'`.
4. Use `.show table T` only if you need to get actual statistics on a single table. If you just need to check table's existance, or simply get the table's schema, use `.show table T schema as json`.
5. When defining a schema of a table, which queries on will utilize datetime-filters - make sure that these columns are typed as `datetime` columns.
    - Kusto is highly-optimized for filtering on `datetime` columns. Don't convert `string` or numeric columns to `datetime` at query time for filtering, if that can be done before ingestion.

**DON'Ts**

1. Running frequent `.show` commands (e.g. `.show schema`, `.show databases`, `.show tables`). Where possible - cache this information.
2. Running `.show schema` command on a big cluster (e.g., with more than 100 databases). You can get the schema for a database or a list of databases with [`.show databases schema`](../management/databases.md#show-databases-schema)
3. Running frequent command-then-query (`.show ... | where | summarize ...`) operations.
    - *command-then-query*: means piping the result set of the control command and applying filters/aggregations on it.
    - When running something like: `.show cluster extents | count` (emphasis on the `| count`), Kusto first prepares a data table holding all details on all extents in the cluster, and then sends that in-memory only table to the Kusto engine in order to do the count. This means that Kusto actually works very hard in an un-optimized path to give you back such a trivial answer.
4. Excessively using extent tags as part of data ingestion. Especially when using `drop-by:` tags, which limit the system's ability to perform performance-oriented grooming processes in the background. See performance notes [here](../management/extents-overview.md#extent-tagging).