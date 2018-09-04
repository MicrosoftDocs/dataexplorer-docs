---
title: MS SQL compatibility known issues - Azure Kusto | Microsoft Docs
description: This article describes MS SQL compatibility known issues in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# MS SQL compatibility known issues

Below is partial list of the MS-SQL functionality that is NOT supported in Kusto.

## CREATE, INSERT, DROP, ALTER statements

Any data modifications are not allowed in Kusto.

## Correlated sub-queries

Correlated subquries in SELECT, WHERE and JOIN clauses are not suppported.

## Cursors

SQL cursors are not supported.

## Control of flow

Control of flow statements are not supported except limitted cases, like IF THEN ELSE clause with the same schema for THEN and ELSE batches.

## Data types

Depending on a query, the data may return in different type than in SQL server. This especially applicable to TINYINT adn SMALLINT types that do not have support in Kusto query language. Clients that expect byte or int16, may get int32 or int64 values.

## Columns' order

When asterix is used in SELECT, the order of tables may be different in Kusto. Client that use column names would work better in these cases.
If there is no asterix character in SELECT, the column ordinals would be preserved.

## Columns' names

In SQL, multiple columns may have the same name. This is not allowed in Kusto. In case of name collision, the names of the columns might be different in Kusto. However, the original name would be preserved, at least for one of colliding columns.

## `ANY`, `ALL`, `EXIST` predicates

ANY, ALL, and EXISTS predicates are not supported.

## Kusto stored functions 

Kusto exposes stored functions as SQL views. However, it doesn't allow using parameters with stored functions. Stored function can also be referred as stored procedure (via EXEC), but also, parameters are not supported yet.

## Recursive CTEs

Recursive Common Table Expressions are not supported.

## Dynamic SQL

Dynamic SQL statements are not supported.