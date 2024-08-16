---
title:  ipv6_is_in_any_range()
description: Learn how to use the ipv6_is_in_any_range function to check if an IPv6 string address is in any of the IPv6 address ranges.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# ipv6_is_in_any_range()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Checks whether an IPv6 string address is in any of the specified IPv6 address ranges.

## Syntax

`ipv6_is_in_any_range(`*Ipv6Address* `,` *Ipv6Range* [ `,` *Ipv6Range* ...] `)`

`ipv6_is_in_any_range(`*Ipv6Address* `,` *Ipv6Ranges* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *Ipv6Address* | `string` |  :heavy_check_mark: | An expression representing an IPv6 address.|
| *Ipv6Range* | `string` |  :heavy_check_mark: | An expression representing an IPv6 range using [IP-prefix notation](#ip-prefix-notation).|
| *Ipv6Ranges* | `dynamic` |  :heavy_check_mark: | An array containing IPv6 ranges using [IP-prefix notation](#ip-prefix-notation).|

> [!NOTE]
> Either one or more *IPv6Range* strings or an *IPv6Ranges* dynamic array is required.

[!INCLUDE [ip-prefix-notation](../includes/ip-prefix-notation.md)]

## Returns

* `true`: If the IPv6 address is in the range of any of the specified IPv6 networks.
* `false`: Otherwise.
* `null`: If conversion for one of the two IPv6 strings wasn't successful.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5WQzQqCQBSF9/MUg6sEQcdyshs+gBDRPkSu8yNDNoYO/UAP31S4aGfnbL/Lx7mdcnTXC+z2yt364TQW8mHxbMTiSKhPgJkCzdI15LiRwFZcgmJJCk0mlyDWWQaaCxkzlgbR9yKBqdoHRII5oIh5EpAq3JLOG8uD96DzbTq1KA8wusHYNqSzpdgIOQln0eovWs+luacl83S1JX4VeVJ1d8pKWo6ftxbmcuW1GWtja7SPekDbvhdHv18PX7mD2cSIAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let LocalNetworks=dynamic([
    "a5e:f127:8a9d:146d:e102:b5d3:c755:f6cd/112",
    "0:0:0:0:0:ffff:c0a8:ac/60"
]);
let IPs=datatable(IP:string) [
    "a5e:f127:8a9d:146d:e102:b5d3:c755:abcd",
    "a5e:f127:8a9d:146d:e102:b5d3:c755:abce",
    "a5e:f127:8a9d:146d:e102:b5d3:c755:abcf",
    "a5e:f127:8a9d:146d:e102:b5d3:c756:abd1",
];
IPs
| extend IsLocal=ipv6_is_in_any_range(IP, LocalNetworks)
```

**Output**

|IP|IsLocal|
|---|---|
|a5e:f127:8a9d:146d:e102:b5d3:c755:abcd|	True|
|a5e:f127:8a9d:146d:e102:b5d3:c755:abce|	True|
|a5e:f127:8a9d:146d:e102:b5d3:c755:abcf|	True|
|a5e:f127:8a9d:146d:e102:b5d3:c756:abd1|	False|

## Related content

* Overview of [IPv4/IPv6 functions](scalar-functions.md#ipv4ipv6-functions)
