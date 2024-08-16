---
title:  format_bytes()
description: Learn how to use the format_bytes() function to format a number as a string representing the data size in bytes.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# format_bytes()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Formats a number as a string representing data size in bytes.

## Syntax

`format_bytes(`*size* [`,` *precision* [`,` *units*]]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *size* | `real` |  :heavy_check_mark: | The value to be formatted as data size in bytes.|
| *precision* | `int` | | The number of digits the value will be rounded to after the decimal point. The default is 0.|
| *units* | `string` | | The units of the target data size: `Bytes`, `KB`, `MB`, `GB`, `TB`, `PB`, or `EB`. If this parameter is empty, the units will be auto-selected based on input value.|

## Returns

A string of *size* formatted as data size in bytes.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUeAqM1SwVUjLL8pNLIlPqixJLdYwNTPR1OEqM0IXNzQwNjbSUTAESRqjSxoZGIDlQZImuCR1FMDyprjlDXQUlLydlDQBI/ZQzZ0AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print 
v1 = format_bytes(564),
v2 = format_bytes(10332, 1),
v3 = format_bytes(20010332),
v4 = format_bytes(20010332, 2),
v5 = format_bytes(20010332, 0, "KB")
```

**Output**

|v1|v2|v3|v4|v5|
|---|---|---|---|---|
|564 Bytes|10.1 KB|19 MB|19.08 MB|19541 KB|

## Related content

* [Estimate table size](../management/estimate-table-size.md)
