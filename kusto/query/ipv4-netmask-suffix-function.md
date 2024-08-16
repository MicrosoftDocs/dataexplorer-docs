---
title:  ipv4_netmask_suffix()
description: Learn how to use the ipv4_netmask_suffix() function to return the value of the IPv4 netmask suffix from an IPv4 string address.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# ipv4_netmask_suffix()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the value of the IPv4 netmask suffix from an IPv4 string address.

## Syntax

`ipv4_netmask_suffix(`*ip*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*ip*| `string` |  :heavy_check_mark:| An expression representing an IPv4 address. IPv4 strings can be masked using [IP-prefix notation](#ip-prefix-notation).|

[!INCLUDE [ip-prefix-notation](../includes/ip-prefix-notation.md)]

## Returns

* The value of the netmask suffix the IPv4 address. If the suffix isn't present in the input, a value of `32` (full netmask suffix) is returned.
* `null`: If parsing the input as an IPv4 address string wasn't successful.

## Example: Resolve IPv4 mask suffix

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjcyC+OKSosy8dCsIpckVzaWgbmigZ6hnpGesrgPiWBrpGZpZAEUM9Y1MIEJG5noGQGiob2gGFIjlqlFIrShJzUtRSM5MKYovLk1Ly6xQsFXILCgzic9LLclNLM6GiiJs1AQAK1xCiYYAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(ip_string:string)
[
 '10.1.2.3',
 '192.168.1.1/24',
 '127.0.0.1/16',
]
| extend cidr_suffix = ipv4_netmask_suffix(ip_string)
```

**Output**

|ip_string|cidr_suffix|
|---|---|
|10.1.2.3|32|
|192.168.1.1/24|24|
|127.0.0.1/16|16|

## Related content

* Overview of [IPv4/IPv6 functions](scalar-functions.md#ipv4ipv6-functions)
* Overview of [IPv4 text match functions](scalar-functions.md#ipv4-text-match-functions)
