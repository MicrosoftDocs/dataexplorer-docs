---
title: Functions - Azure Data Explorer
description: This article describes Functions in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 11/21/2022
adobe-target: true
---

# Function types

**Functions** are reusable queries or query parts. Kusto supports two
kinds of functions:

* **Built-in functions** are hard-coded functions defined by Kusto that cannot be
  modified by users.

* **User-defined functions**, which are divided into two types:

  * Stored functions: are user-defined functions that are stored and managed database schema entities (such as tables). See [Stored functions](../schema-entities/stored-functions.md).
  * Temporary functions: are user-defined functions that are defined and used within the scope of a single query. The definition of such functions is done through a [let statement](../letstatement.md).

For more information on user-defined functions, see [User-defined functions](./user-defined-functions.md).
For details on how to create and manage stored functions, see [managing functions](../../management/functions.md).
