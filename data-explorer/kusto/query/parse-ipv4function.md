---
title: parse-ipv4() (Azure Kusto)
description: This article describes parse-ipv4() in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# parse-ipv4()

Converts input to integener (signed 64-bit) number representation.

    parse-ipv4("127.0.0.1") == 2130706433
    parse-ipv4('192.1.168.1') < parse-ipv4('192.1.168.2') == true

**Syntax**

`parse-ipv4(`*Expr*`)`

**Arguments**

* *Expr*: Expression that will be converted to long. 

**Returns**

If conversion is successful, result will be a long number.
If conversion is not successful, result will be `null`.
 