---
title: parse_ipv6() - Azure Data Explorer
description: Learn how to use the parse_ipv6() function to convert IPv6 or IPv4 strings to a canonical IPv6 string representation. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2023
---
# parse_ipv6()

Converts IPv6 or IPv4 string to a canonical IPv6 string representation.

```kusto
parse_ipv6("127.0.0.1") == '0000:0000:0000:0000:0000:ffff:7f00:0001'
parse_ipv6(":fe80::85d:e82c:9446:7994") == 'fe80:0000:0000:0000:085d:e82c:9446:7994'
```

## Syntax

`parse_ipv6(`*`Expr`*`)`

## Arguments

* *`Expr`*: String expression representing IPv6/IPv4 network address that will be converted to canonical IPv6 representation. String may include net-mask using [IP-prefix notation](#ip-prefix-notation).

[!INCLUDE [ip-prefix-notation](../../includes/ip-prefix-notation.md)]

## Returns

If conversion is successful, the result will be a string representing a canonical IPv6 network address.
If conversion isn't successful, the result will be an empty string.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
datatable(ipv4:string)
[
 '192.168.255.255',
 '192.168.255.255/24',
 '255.255.255.255'
]
| extend ipv6 = parse_ipv6(ip_string)
```

**Output**

| ipv4               | ipv6                                    |
|--------------------|-----------------------------------------|
| 192.168.255.255    | 0000:0000:0000:0000:0000:ffff:c0a8:ffff |
| 192.168.255.255/24 | 0000:0000:0000:0000:0000:ffff:c0a8:ff00 |
| 255.255.255.255    | 0000:0000:0000:0000:0000:ffff:ffff:ffff |
