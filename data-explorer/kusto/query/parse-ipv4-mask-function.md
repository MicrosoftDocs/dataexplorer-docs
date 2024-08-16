---
title:  parse_ipv4_mask()
description: Learn how to use the parse_ipv4_mask() function to convert an IPv4 input string and netmask to a 64-bit wide long number in big-endian order.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2023
---
# parse_ipv4_mask()

Converts the input string of IPv4 and netmask to a signed, 64-bit wide, long number representation in big-endian order.

## Syntax

`parse_ipv4_mask(`*ip* `,` *prefix*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ip*| `string` |  :heavy_check_mark: | The IPv4 address to convert to a long number.|
| *prefix*| `int` |  :heavy_check_mark: | An integer from 0 to 32 representing the number of most-significant bits that are taken into account.|

## Returns

If conversion is successful, the result is a [long](scalar-data-types/long.md) number.
If conversion isn't successful, the result is `null`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShILCpOjc8sKDOJz00sztZQMjQy1zMAQkMlHQUjE00AwjOPByYAAAA=" target="_blank">Run the query</a>

```kusto
print parse_ipv4_mask("127.0.0.1", 24)
```
