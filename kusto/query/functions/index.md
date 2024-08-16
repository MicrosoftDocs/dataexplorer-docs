---
title:  Functions
description:  This article describes Functions.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
adobe-target: true
---

# Function types

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

Functions are reusable queries or query parts. Kusto supports two
kinds of functions:

* *Built-in functions* are hard-coded functions defined by Kusto that can't be
  modified by users.

* *User-defined functions*, which are divided into two types:

  * *Stored functions*: user-defined functions that are stored and managed database schema entities, similar to tables. For more information, see [Stored functions](../../query/schema-entities/stored-functions.md). To create a stored function, use the [.create function command](../../management/create-function.md).

  * *Query-defined functions*: user-defined functions that are defined and used within the scope of a single query. The definition of such functions is done through a let statement. For more information on how to create query-defined functions, see [Create a user defined function](../let-statement.md#create-a-user-defined-function-with-scalar-calculation).

  For more information on user-defined functions, see [User-defined functions](user-defined-functions.md).
