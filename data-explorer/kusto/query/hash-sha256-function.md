---
title:  hash_sha256()
description: Learn how to use the hash_sha256() function to return a sha256 hash value of the source input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/30/2023
---
# hash_sha256()

Returns a sha256 hash value of the source input.

## Syntax

`hash_sha256(`*source*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source* | scalar |  :heavy_check_mark: | The value to be hashed.|

## Returns

The sha256 hash value of the given scalar, encoded as a hex string (a string
of characters, each two of which represent a single Hex number between 0
and 255).

> [!WARNING]
> The algorithm used by this function (SHA256) is guaranteed
> to not be modified in the future, but is very complex to calculate. Users that
> need a "lightweight" hash function for the duration of a single query are advised
> to use the function [hash()](./hash-function.md) instead.

## Examples

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUeBSAIIMQ9uMxOKM+OKMRCNTMw2l8PyinBQlTR2IpBGKZEpiSWpJZm6qhpGBkYGugSEQaWoCAD4yqn1MAAAA" target="_blank">Run the query</a>

```kusto
print 
    h1=hash_sha256("World"),
    h2=hash_sha256(datetime(2020-01-01))
```

**Output**

|h1|h2|
|---|---|
|78ae647dc5544d227130a0682a51e30bc7777fbb6d8a8f17007463a3ecd1d524|ba666752dc1a20eb750b0eb64e780cc4c968bc9fb8813461c1d7e750f302d71d|

The following example uses the `hash_sha256()` function to aggregate StormEvents based on State's SHA256 hash value.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSguzc1NLMqsSlUIBkk455fmlSjYKiSDaA1NhaRKoHhiSaoOhPJILM6wzQAS8cUZiUamZhpgUU2gOSX5BQqmEOVwY1JSi5MBsDX5S28AAAA=" target="_blank">Run the query</a>

```kusto
StormEvents 
| summarize StormCount = count() by State, StateHash=hash_sha256(State)
| top 5 by StormCount desc
```

**Output**

|State|StateHash|StormCount|
|---|---|---|
|TEXAS|9087f20f23f91b5a77e8406846117049029e6798ebbd0d38aea68da73a00ca37|4701|
|KANSAS|c80e328393541a3181b258cdb4da4d00587c5045e8cf3bb6c8fdb7016b69cc2e|3166|
|IOWA|f85893dca466f779410f65cd904fdc4622de49e119ad4e7c7e4a291ceed1820b|2337|
|ILLINOIS|ae3eeabfd7eba3d9a4ccbfed6a9b8cff269dc43255906476282e0184cf81b7fd|2022|
|MISSOURI|d15dfc28abc3ee73b7d1f664a35980167ca96f6f90e034db2a6525c0b8ba61b1|2016|
