---
title:  hash_combine()
description: learn how to use the hash_combine() function to combine hash values of two or more hashes.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/25/2022
---
# hash_combine()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Combines hash values of two or more hashes.

## Syntax

`hash_combine(`*h1* `,` *h2* [`,` *h3* ...]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *h1*, *h2*, ... *hN* | `long` |  :heavy_check_mark: | The hash values to combine.|

## Returns

The combined hash value of the given scalars.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShLzClNNVSwVVDySM3JyVfSgYgYgUTC84tyUpS4ahRSK0pS81IUMkDqMhKLMzQgujR1FDKMbBECRpoItcn5uUmZeakpUB3xUL5GhiFIkyYAFnd56X0AAAA=" target="_blank">Run the query</a>
:::moniker-end

```kusto
print value1 = "Hello", value2 = "World"
| extend h1 = hash(value1), h2=hash(value2)
| extend combined = hash_combine(h1, h2)
```

**Output**

|value1|value2|h1|h2|combined|
|---|---|---|---|---|
|Hello|World|753694413698530628|1846988464401551951|-1440138333540407281|
