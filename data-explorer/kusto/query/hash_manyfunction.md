---
title: hash_many() - Azure Data Explorer
description: This article describes hash_many() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 24/01/2022
---
# hash_many()

Returns a combined hash value of multiple values.

## Syntax

`hash_many(`*s1* `,` *s2* [`,` *s3* ...]`)`

## Arguments

* *s1*, *s2*, ..., *sN*: input values that will be hashed together.

## Returns

The `hash()` function is applied on all the given scalars, and then the hashes are combined into a single result, which is returned.

> [!WARNING]
> The algorithm used to calculate the hash for the given scalars is xxhash64. This algorithm might change in the future, and the only guarantee is that within a single query all invocations of this method use the same algorithm. Consequently, you are advised not to store the results of `hash_many()` in a table. If persisting hash values is required, use [hash_sha256()](./sha256hashfunction.md), [hash_sha1()](./sha1-hash-function.md) or [hash_md5()](./md5hashfunction.md) instead, and combine the hashes into a single hash by using some bitwise operations. Note that these functions are more complex to calculate than `hash()`).

## Examples

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
print value1 = "Hello", value2 = "World"
| extend combined = hash_many(value1, value2)
```

|value1|value2|combined|
|---|---|---|
|Hello|World|-1440138333540407281|
