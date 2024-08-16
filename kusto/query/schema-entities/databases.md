---
title:  Databases
description:  This article describes Databases.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# Databases

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

Databases are named entities that hold tables and stored functions. Kusto follows a relation model of storing the data where the upper-level entity is a `database`.

A single cluster can host several databases, in which each database hosts its own collection of [tables](tables.md), [stored functions](stored-functions.md), and [external tables](external-tables.md). Each database has its own set of permissions that follow the [Role Based Access Control (RBAC)](../../access-control/role-based-access-control.md) model.

> [!NOTE]
>
> * The maximum limit of databases per cluster is 10,000.
> * Database names must follow [Identifier naming rules](entity-names.md#identifier-naming-rules) with the exception of case-sensitivity rule. Database names are case-insensitive.
> * Both queries combining data from multiple tables in the same database and queries combining data from multiple databases in the same cluster have comparable performance.
::: moniker-end

:::moniker range="microsoft-fabric"
A single Eventhouse can host several databases, in which each database hosts its own collection of [tables](tables.md), [stored functions](stored-functions.md), and [external tables](external-tables.md). Each database has its own set of permissions that follow the [Role Based Access Control (RBAC)](../../access-control/role-based-access-control.md) model.

> [!NOTE]
>
> * The maximum limit of databases per Eventhouse is 10,000.
> * Database names must follow [Identifier naming rules](entity-names.md#identifier-naming-rules) with the exception of case-sensitivity rule. Database names are case-insensitive.
> * Both queries combining data from multiple tables in the same database and queries combining data from multiple databases in the same Eventhouse have comparable performance.
::: moniker-end

A database hosts its own collection of [tables](tables.md), [stored functions](stored-functions.md), and [external tables](external-tables.md). Each database has its own set of permissions that follow the [Role Based Access Control (RBAC)](../../access-control/role-based-access-control.md) model.
