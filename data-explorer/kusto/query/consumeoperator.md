---
title: consume operator - Azure Kusto | Microsoft Docs
description: This article describes consume operator in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# consume operator

Pulls all the data from its source tabular expression. Optionally, returns
basic statistics for that data.

```kusto
T | consume
```

**Syntax**

`consume` [`with_stats` `=` *WithStats* [`,` `decodeblocks` `=` *DecodeBlocks*]]

**Arguments**

* *WithStats*: A constant Boolean value. If set to `true` (or if the global
  property `perftrace` is set), the operator will return a single
  row with a single column called `Stats` of type `dynamic` holding the statistics
  of the data source fed to the `consume` operator.
* **DecodeBlocks**: A constant Boolean value. If set to `true` (or if *PerfTrace*
  is `true`), the operator will decode all the data it gets as input.

The `consume` operator can be used for estimating the
cost of a query without actually delivering the results back to the client.
(The estimation is not exact for a variety of reasons; for example, `consume`
is calculated distributively, so `T | consume` will not deliver the table's
data between the nodes of the cluster.) It can also be used to get some basic
statistics (such as the number of records and estimated overall data size) of
its input.