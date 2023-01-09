---
title: parse_ipv6_mask() - Azure Data Explorer
description: Learn how to use the parse_ipv6_mask() function to convert IPv6 or IPv4 strings and netmask to a canonical IPv6 string representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2023
---
# parse_ipv6_mask()

Converts IPv6/IPv4 string and netmask to a canonical IPv6 string representation.

```kusto
parse_ipv6_mask("127.0.0.1", 24) == '0000:0000:0000:0000:0000:ffff:7f00:0000'
parse_ipv6_mask(":fe80::85d:e82c:9446:7994", 120) == 'fe80:0000:0000:0000:085d:e82c:9446:7900'
```

## Syntax

`parse_ipv6_mask(`*`Expr`*`,`*`PrefixMask`*`)`

## Arguments

* *`Expr`*: String expression representing IPv6/IPv4 network address that will be converted to canonical IPv6 representation. String may include net-mask using [IP-prefix notation](#ip-prefix-notation).
* *`PrefixMask`*: An integer from 0 to 128 representing the number of most-significant bits that are taken into account.

[!INCLUDE [ip-prefix-notation](../../includes/ip-prefix-notation.md)]

## Returns

If conversion is successful, the result will be a string representing a canonical IPv6 network address.
If conversion isn't successful, the result will be `null`.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
datatable(ip_string:string, netmask:long)
[
 // IPv4 addresses
 '192.168.255.255',     120,  // 120-bit netmask is used
 '192.168.255.255/24',  124,  // 120-bit netmask is used, as IPv4 address doesn't use upper 8 bits
 '255.255.255.255', 128,  // 128-bit netmask is used
 // IPv6 addresses
 'fe80::85d:e82c:9446:7994', 128,     // 128-bit netmask is used
 'fe80::85d:e82c:9446:7994/120', 124, // 120-bit netmask is used
 // IPv6 with IPv4 notation
 '::192.168.255.255',    128,  // 128-bit netmask is used
 '::192.168.255.255/24', 128,  // 120-bit netmask is used, as IPv4 address doesn't use upper 8 bits
]
| extend ip6_canonical = parse_ipv6_mask(ip_string, netmask)
```

**Output**

|ip_string|netmask|ip6_canonical|
|---|---|---|
|192.168.255.255|120|0000:0000:0000:0000:0000:ffff:c0a8:ff00|
|192.168.255.255/24|124|0000:0000:0000:0000:0000:ffff:c0a8:ff00|
|255.255.255.255|128|0000:0000:0000:0000:0000:ffff:ffff:ffff|
|fe80::85d:e82c:9446:7994|128|fe80:0000:0000:0000:085d:e82c:9446:7994|
|fe80::85d:e82c:9446:7994/120|124|fe80:0000:0000:0000:085d:e82c:9446:7900|
|::192.168.255.255|128|0000:0000:0000:0000:0000:ffff:c0a8:ffff|
|::192.168.255.255/24|128|0000:0000:0000:0000:0000:ffff:c0a8:ff00|
