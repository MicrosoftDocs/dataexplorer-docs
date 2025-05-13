---
title:  estimate_data_size()
description: Learn how to use the estimate_data_size() function to return an estimated data size in bytes of the selected columns of the tabular expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# estimate_data_size()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Provides an estimated data size in bytes for the selected columns of a tabular expression.

## Syntax

`estimate_data_size(`*columns*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*columns*| `string` | :heavy_check_mark:|One or more comma-separated column references in the source tabular expression to use for data size estimation. To include all columns, use the wildcard (`*`) character.|

## Returns

Returns the estimated data size in bytes of the referenced columns. Estimation is based on data types and actual values.
For example, the data size for the string `'{"a":"bcd"}'` is smaller than the dynamic value `dynamic({"a":"bcd"})`
because the latter's internal representation is more complex than that of a string.

## Examples

The following example calculates the total data size using `estimate_data_size()`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22NvQ7CMBCDd57CWxMYmvAbhr5F9ypSj1KpSarmkCLEw3OFtbdYlu3vFh8HQsFjSQEWnGANMtMsZuPqWrpqSnHQGDMcdh9QYYo9WlE0qOzxdL5cb+5uqm3ArzhRHPi5MuTfSsmvEPwyvgltYj814hVlHoNn6nrPvssSqr3Wf4pyB2t0kXUD68wXVvoNCMgAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 10 step 1                    // x (long) is 8 
| extend Text = '1234567890'                   // Text length is 10  
| summarize Total=sum(estimate_data_size(*))   // (8+10)x10 = 180
```

**Output**

|Total|
|---|
|180|

## Related content

* [Estimate table size](../management/estimate-table-size.md)
