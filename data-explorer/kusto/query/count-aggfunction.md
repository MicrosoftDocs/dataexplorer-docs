---
title: count() (aggregation function) - Azure Data Explorer | Microsoft Docs
description: This article describes count() (aggregation function) in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# count() (aggregation function)

Returns a count of the records per summarization group (or in total if summarization is done without grouping).

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)
* Use the [countif](countif-aggfunction.md) aggregation function
  to count only records for which some predicate returns `true`.

**Syntax**

summarize `count()`

**Returns**

Returns a count of the records per summarization group (or in total if summarization is done without grouping).