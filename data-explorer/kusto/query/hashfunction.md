---
title: hash() - Azure Data Explorer
description: This article describes hash() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 01/24/2022
---
# hash()

Returns a hash value for the input value.

## Syntax

`hash(`*source* [`,` *mod*]`)`

## Arguments

* *source*: The value to be hashed.
* *mod*: An optional modulo value to be applied to the hash result, so that
  the output value is between `0` and *mod* - 1

## Returns

The hash value of the specified scalar and, if specified, the modulo the specified mod value.

> [!WARNING]
> The function uses the *xxhash64* algorithm to calculate the hash for each scalar, but this may change. We therefore only recommend using this function within a single query where all invocations of the function will use the same algorithm.
>
> If you need to persist a combined hash, we recommend using [hash_sha256()](sha256hashfunction.md), [hash_sha1()](sha1-hash-function.md), or [hash_md5()](md5hashfunction.md) and combining the hashes into a single hash with a [bitwise operator](binoperators.md). Note that these functions are more complex to calculate than `hash()`.

## Examples

```kusto
hash("World")                   // 1846988464401551951
hash("World", 100)              // 51 (1846988464401551951 % 100)
hash(datetime("2015-01-01"))    // 1380966698541616202
```

The hash function can be useful for sampling the data when assuming the value is uniformly distributed , such as the StartTime in the following example that uses the hash function to run a query on 10% of the data.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where hash(StartTime, 10) == 0
| summarize StormCount = count(), TypeOfStorms = dcount(EventType) by State 
| top 5 by StormCount desc
```
