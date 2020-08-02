---
title: countif() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes countif() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 08/02/2020
---
# countif() (aggregation function)

Returns a count of rows for which *Predicate* evaluates to `true`.

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

See also - [count()](count-aggfunction.md) function, which counts rows without predicate expression.

## Syntax

summarize `countif(`*Predicate*`)`

## Arguments

*Predicate*: Expression that will be used for aggregation calculation. *Predicate* can be any scalar expression with return type of bool (evaluating to true/false).

## Returns

Returns a count of rows for which *Predicate* evaluates to `true`.

> [!TIP]
> Use `summarize countif(filter)` instead of `where filter | summarize count()`
