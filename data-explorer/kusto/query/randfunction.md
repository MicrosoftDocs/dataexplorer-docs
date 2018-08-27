---
title: rand() (Azure Kusto)
description: This article describes rand() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# rand()

Returns a random number.

    rand()
    rand(1000)

**Syntax**

* `rand()` - returns a value of type `real`
  with a uniform distribution in the range [0.0, 1.0).
* `rand(` *N* `)` - returns a value of type `real`
  chosen with a uniform distribution from the set {0.0, 1.0, ..., *N* - 1}.