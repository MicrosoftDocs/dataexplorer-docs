---
title:  max_of()
description: Learn how to use the max_of() function to return the maximum value of all argument expressions.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# max_of()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the maximum value of all argument expressions.

## Syntax

`max_of(`*arg*`,` *arg_2*`,` [ *arg_3*`,` ... ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*arg_i* | scalar |  :heavy_check_mark: | The values to compare.|

* All arguments must be of the same type.
* Maximum of 64 arguments is supported.
* Non-null values take precedence to null values.

## Returns

The maximum value of all argument expressions.

## Examples

### Find the largest number

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwVchNrIjPT9MwNNBRMNRR0DUGUuaaADn0q08kAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = max_of(10, 1, -3, 17) 
```

**Output**

|result|
|---|
|17|

### Find the maximum value in a data-table

Notice that non-null values take precedence over null values.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUBQ1HK4XMvBIdBScwrcnLFc3LpQAEhjoKZjoQpoUOkAdhApVo5JXm5GjqKBjpwBUiRDFUwZm8XLG8XDUKBUX5WanJJQq5iRXx+WkajkCLNQGMk9JIjgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (A: int, B: int)
[
    1, 6,
    8, 1,
    int(null), 2,
    1, int(null),
    int(null), int(null)
]
| project max_of(A, B)
```

**Output**

|result|
|---|
|6|
|8|
|2|
|1|
|(null)|
