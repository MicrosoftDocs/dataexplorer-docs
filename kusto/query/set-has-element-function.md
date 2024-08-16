---
title:  set_has_element()
description: Learn how to use the set_has_element() function to determine if the input set contains the specified value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# set_has_element()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Determines whether the specified set contains the specified element.

## Syntax

`set_has_element(`*set*`,` *value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *set* | `dynamic` |  :heavy_check_mark: | The input array to search.|
| *value* | |  :heavy_check_mark: | The value for which to search. The value should be of type `long`, `int`, `double`, `datetime`, `timespan`, `decimal`, `string`, `guid`, or `bool`.|

## Returns

`true` or `false` depending on if the value exists in the array.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgsKrJNqcxLzM1M1ohWKsnILFbSUVCCkIl5IDK1IjG3ICdVKVZTgatGoaAoPys1uUQhKLW4NKfEtji1JD4jsTg+NSc1NzWvRANoHJIWTQCSW+h8ZAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print arr=dynamic(["this", "is", "an", "example"]) 
| project Result=set_has_element(arr, "example")
```

**Output**

|Result|
|---|
|true|

## Related content

Use [`array_index_of(arr, value)`](array-index-of-function.md) to find the position at which the value exists in the array. Both functions are equally performant.
