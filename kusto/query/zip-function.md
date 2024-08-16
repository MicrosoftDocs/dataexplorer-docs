---
title:  zip()
description:  This article describes zip().
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# zip()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The `zip` function accepts any number of `dynamic` arrays, and returns an
array whose elements are each an array holding the elements of the input
arrays of the same index.

## Syntax

`zip(`*arrays*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *arrays* | `dynamic` |  :heavy_check_mark: | The dynamic array values to zip. The function accepts between 2-16 arrays.|

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUajKLNBIqcxLzM1M1og21DHWMY3V1FGAixjpmOiYxWpqAgB4H4QJLQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print zip(dynamic([1,3,5]), dynamic([2,4,6]))
```

**Output** 

|print_0|
|--|
|`[[1,2],[3,4],[5,6]]`|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUajKLNBIqcxLzM1M1ohWclTSUTAEIj3TWE0dBbh4da2OgpKTUqymJgDjejoyNQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print zip(dynamic(["A", 1, 1.5]), dynamic([{}, "B"]))
```

**Output** 

|print_0|
|--|
|`[["A",{}], [1,"B"], [1.5, null]]`|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjUSrzLwSHYUkq+KSosy8dE2FaEMdpfy8VCUdIx2lkvJ8JR1jIJ1RlJqqFMvLVaNQXJqbm1iUWZWqkKhgq5CbmJ0an5NZXKKRqAk0BEUkSROkvqAoPys1uUShKrNAIxGoRBMADfxJ3HsAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(a:int, b:string) [1,"one",2,"two",3,"three"]
| summarize a = make_list(a), b = make_list(b)
| project zip(a, b)
```

**Output** 

|print_0|
|--|
|`[[1,"one"],[2,"two"],[3,"three"]]`|
