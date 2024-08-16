---
title:  parse_ipv6()
description: Learn how to use the parse_ipv6() function to convert IPv6 or IPv4 strings to a canonical IPv6 string representation. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# parse_ipv6()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts IPv6 or IPv4 string to a canonical IPv6 string representation.

## Syntax

`parse_ipv6(`*ip*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ip* | `string` |  :heavy_check_mark: | The IPv6/IPv4 network address that is converted to canonical IPv6 representation. The value may include net-mask using [IP-prefix notation](#ip-prefix-notation).|

[!INCLUDE [ip-prefix-notation](../includes/ip-prefix-notation.md)]

## Returns

If conversion is successful, the result is a string representing a canonical IPv6 network address.
If conversion isn't successful, the result is an empty string.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjcyCMhMrheKSosy8dE2uaC4FIFA3tDTSMzSz0DMyNQVhdR0MIX0jE5AolAdXyBXLVaOQWlGSmpeiADTZTMFWoSCxqDg1HsQB26UJANsJke17AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(ipv4: string)
[
    '192.168.255.255', '192.168.255.255/24', '255.255.255.255'
]
| extend ipv6 = parse_ipv6(ipv4)
```

**Output**

| ipv4               | ipv6                                    |
|--------------------|-----------------------------------------|
| 192.168.255.255    | 0000:0000:0000:0000:0000:ffff:c0a8:ffff |
| 192.168.255.255/24 | 0000:0000:0000:0000:0000:ffff:c0a8:ff00 |
| 255.255.255.255    | 0000:0000:0000:0000:0000:ffff:ffff:ffff |
