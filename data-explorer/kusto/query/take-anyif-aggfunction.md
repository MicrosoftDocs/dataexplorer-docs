---
title: take-anyif() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes take-anyif() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 06/07/2021
---
# take_anyif() (aggregation function)

Arbitrarily selects one record for each group in a [summarize operator](summarizeoperator.md), for which the predicate
is "true". The function returns the value of an expression over each such record.

> [!NOTE]
> This function is useful when you want to get a sample value of one column per value of the compound group key, subject to some predicate that is "true".
> If such a value is present, the function attempts to return a non-null/non-empty value.

## Syntax

`summarize` `take_anyif` `(` *Expr*, *Predicate* `)`

## Arguments

* *Expr*: An expression over each record selected from the input to return.
* *Predicate*: Predicate to indicate which records may be considered for evaluation.

## Returns

The `take_anyif` aggregation function returns the value of the expression calculated
for each of the records randomly selected from each group of the summarize operator. Only records for which *Predicate* returns "true" may be selected. If the predicate doesn't return "true", a null value is produced.

## Examples

Pick a random EventType from Storm events, where event description has a key phrase.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
| summarize take_anyif(EventType, EventNarrative has 'strong wind')
```

|EventType|
|---|
|Thunderstorm Wind|
