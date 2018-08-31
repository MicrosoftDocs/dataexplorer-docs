---
title: avg() (aggregation function) - Azure Kusto | Microsoft Docs
description: This article describes avg() (aggregation function) in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# avg() (aggregation function)

Calculates the average of *Expr* across the group. 

* Can be used only in context of aggregation inside [summarize](summarizeoperator.md)

**Syntax**

summarize `avg(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be used for aggregation calculation. 

**Returns**

The average value of *Expr* across the group.
 