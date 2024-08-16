---
title:  jaccard_index()
description: Learn how to use the jaccard_index() function to calculate the Jaccard index of two input sets.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# jaccard_index()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Calculates the [Jaccard index](https://en.wikipedia.org/wiki/Jaccard_index) of two input sets.

## Syntax

`jaccard_index`(*set1*, *set2*)

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *set1*| `dynamic` |  :heavy_check_mark: | The array representing the first set for the calculation.|
| *set2*| `dynamic` |  :heavy_check_mark: | The array representing the second set for the calculation.|

> [!NOTE]
> Duplicate values in the input arrays are ignored.

## Returns

The [Jaccard index](https://en.wikipedia.org/wiki/Jaccard_index) of the two input sets. The Jaccard index formula is |*set1* ∩ *set2*| / |*set1* ∪ *set2*|.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShOLTG0TanMS8zNTNaINtQx0jGO1dQBCRuhCeuYxGryctUopFaUpOalKGQlJicnFqXYQun4zLyU1AoNkHEQ3ZoAjvvou2AAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print set1=dynamic([1,2,3]), set2=dynamic([1,2,3,4])
| extend jaccard=jaccard_index(set1, set2)
```

**Output**

|`set1`|`set2`|`jaccard`|
|---|---|---|
|[1,2,3]|[1,2,3,4]|0.75|
