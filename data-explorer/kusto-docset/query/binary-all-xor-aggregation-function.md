---
title:  binary_all_xor() (aggregation function)
description: Learn how to use the binary_all_xor() function to aggregate values using the binary XOR operation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# binary_all_xor() (aggregation function)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Accumulates values using the binary `XOR` operation for each summarization group, or in total if a group is not specified.

[!INCLUDE [data-explorer-agg-function-summarize-note](../includes/agg-function-summarize-note.md)]

## Syntax

`binary_all_xor` `(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *expr* | `long` |  :heavy_check_mark: | The value used for the binary `XOR`  calculation. |

## Returns

Returns a value that is aggregated using the binary `XOR` operation over records for each summarization group, or in total if a group is not specified.

## Example

The following example produces `CAFEF00D` using binary `XOR` operations:

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjbzSXKuc/Lx0Ta5oLgUFgwoTExMDENYB8wxdIRDCszRwdHJyNLCE8AwMDJwMDUwddbhiuWoUiktzcxOLMqtSFYpSi0tzShRsFUrySwsKUos0SvIzUis0kjLzEosq4xNzcuIr8otA9mpqagIAuXol8IgAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(num:long)
[
  0x44404440,
  0x1E1E1E1E,
  0x90ABBA09,
  0x000B105A,
]
| summarize result = toupper(tohex(binary_all_xor(num)))
```

**Output**

|results|
|--|
|CAFEF00D|
