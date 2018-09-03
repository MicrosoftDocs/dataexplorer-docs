---
title: current_principal() - Azure Kusto | Microsoft Docs
description: This article describes current_principal() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# current_principal()

Returns the current principal running this query.

**Syntax**

`current_principal()`

**Returns**

The current principal FQN as a `string`.

**Example**

```kusto
.show queries | where Principal == current_principal()
```