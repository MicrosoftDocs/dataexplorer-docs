---
title:  format_ipv4_mask()
description: Learn how to use the format_ipv4_mask() function to parse the input with a netmask and return a string representing the IPv4 address in CIDR notation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# format_ipv4_mask()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Parses the input with a netmask and returns a string representing the IPv4 address in CIDR notation.

## Syntax

`format_ipv4_mask(`*ip* [`,` *prefix*`])`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ip* | `string` |  :heavy_check_mark: | The IPv4 address as CIDR notation. The format may be a string or number representation in big-endian order.|
| *prefix* | `int` | | An integer from 0 to 32 representing the number of most-significant bits that are taken into account. If unspecified, all 32 bit-masks are used.|

## Returns

If conversion is successful, the result will be a string representing IPv4 address as CIDR notation.
If conversion isn't successful, the result will be an empty string.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjcSUlKLU4mKr4pKizLx0HYXcxOJsq5z8vHRNrmguBXVDSyM9QzMLPUM9Q3UdBSMTHQU4wJA1NsIpq29kgqIAmyzIUg1dQ00dBa5YrhqF1IqS1LwUBaDjSnNKFGwV0vKLchNL4jMLykxgjoa4FqQBbi1EeTxIHFUPWAhNIwAom5ZMBgEAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(address:string, mask:long)
[
 '192.168.1.1', 24,          
 '192.168.1.1', 32,          
 '192.168.1.1/24', 32,       
 '192.168.1.1/24', long(-1), 
]
| extend result = format_ipv4(address, mask), 
         result_mask = format_ipv4_mask(address, mask)
```

**Output**

|address|mask|result|result_mask|
|---|---|---|---|
|192.168.1.1|24|192.168.1.0|192.168.1.0/24|
|192.168.1.1|32|192.168.1.1|192.168.1.1/32|
|192.168.1.1/24|32|192.168.1.0|192.168.1.0/24|
|192.168.1.1/24|-1|||

## Related content

* For IPv4 address formatting without CIDR notation, see [format_ipv4()](format-ipv4-function.md).
* For a list of functions related to IP addresses, see [IPv4 and IPv6 functions](scalar-functions.md#ipv4ipv6-functions).
