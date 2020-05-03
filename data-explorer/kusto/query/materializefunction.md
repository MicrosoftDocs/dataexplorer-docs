---
title: materialize() - Azure Data Explorer
description: This article describes materialize() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/21/2019
---
# materialize()

Allows caching a subquery result during the time of query execution in a way that other subqueries can reference the partial result.

 
**Syntax**

`materialize(`*expression*`)`

**Arguments**

* *expression*: Tabular expression to be evaluated and cached during query execution.

**Tips**

* Use materialize with join or union when their operands have mutual subqueries that can be executed once. See the examples below.

* Useful also in scenarios when we need to join/union fork legs.

* Materialize can only be used in let statements if you give the cached result a name.


* Materialize has a cache size limit of **5 GB**. 
  This limit is per cluster node and is mutual for all queries running concurrently.
  If a query uses `materialize()` and the cache can't hold any more data,
  the query will abort with an error.

**Examples**

We want to generate a random set of values and want to know: 
 * how many distinct values we have 
 * the sum of all these values 
 * the top three values

This operation can be done using [batches](batches.md) and materialize:

 ```kusto
let randomSet = materialize(range x from 1 to 30000000 step 1
| project value = rand(10000000));
randomSet
| summarize dcount(value);
randomSet
| top 3 by value;
randomSet
| summarize sum(value)

```