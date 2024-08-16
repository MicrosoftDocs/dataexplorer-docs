---
title:  ipv4_range_to_cidr_list()
description: Learn how to use the ipv4_range_to_cidr_list() function to convert IPv4 address range to a list of CIDR ranges.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# ipv4_range_to_cidr_list()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts a IPv4 address range denoted by starting and ending IPv4 addresses to a list of IPv4 ranges in CIDR notation.

## Syntax

`ipv4_range_to_cidr_list(`*StartAddress* `,` *EndAddress* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *StartAddress*| `string` |  :heavy_check_mark: | An expression representing a starting IPv4 address of the range.|
| *EndAddress*| `string` |  :heavy_check_mark: | An expression representing an ending IPv4 address of the range.|

## Returns

A dynamic array object containing the list of ranges in CIDR notation.

[!INCLUDE [CIDR notation](../includes/ip-prefix-notation.md)]

## Examples


```kusto
print start_IP="1.1.128.0", end_IP="1.1.140.255"
 | project ipv4_range_list = ipv4_range_to_cidr_list(start_IP, end_IP)
```

**Output**

|ipv4_range_list|
|--|
|`["1.1.128.0/21", "1.1.136.0/22","1.1.140.0/24"]`|

## Related content

* Overview of [IPv4/IPv6 functions](scalar-functions.md#ipv4ipv6-functions)
* Overview of [IPv4 text match functions](scalar-functions.md#ipv4-text-match-functions)
