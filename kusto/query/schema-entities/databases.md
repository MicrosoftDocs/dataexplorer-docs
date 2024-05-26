---
title:  Databases
description:  This article describes Databases.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/03/2023
---
# Databases

Databases are named entities that hold tables and stored functions. Kusto follows a relation model of storing the data where the upper-level entity is a `database`.

A single cluster can host several databases, in which each database hosts its own collection of [tables](tables.md), [stored functions](stored-functions.md), and [external tables](external-tables.md). Each database has its own set of permissions that follow the [Role Based Access Control (RBAC) model](../../access-control/index.md).

> [!NOTE]
>
> * The maximum limit of databases per cluster is 10,000.
> * Database names must follow [Identifier naming rules](entity-names.md#identifier-naming-rules) with the exception of case-sensitivity rule. Database names are case-insensitive.
> * Both queries combining data from multiple tables in the same database and queries combining data from multiple databases in the same cluster have comparable performance.
