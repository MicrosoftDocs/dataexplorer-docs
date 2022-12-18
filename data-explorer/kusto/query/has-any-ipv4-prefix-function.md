---
title: has_any_ipv4_prefix() - Azure Data Explorer
description: This article describes has_any_ipv4_prefix() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 05/31/2021
---
# has_any_ipv4_prefix()

Returns a value indicating whether one of specified IPv4 address prefixes appears in a text.

A valid IP address prefix is either a complete IPv4 address (`192.168.1.11`) or its prefix ending with a dot (`192.`, `192.168.` or `192.168.1.`).

IP address entrances in a text must be properly delimited with non-alphanumeric characters. For example, properly delimited IP addresses are:

 * "These requests came from: 192.168.1.1, 10.1.1.115 and 10.1.1.201"
 * "05:04:54 127.0.0.1 GET /favicon.ico 404"

## Syntax

`has_any_ipv4_prefix(`*source* `,` *ip_address_prefix* [`,` *ip_address_prefix_2*`,` ...] `)`  

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source*| string | &check; | The value to search.|
| *ip_address_prefix*| string or dynamic | &check; | An IP address prefix, or an array of IP address prefixes, for which to search. A valid IP address prefix is either a complete IPv4 address, such as `192.168.1.11`, or its prefix ending with a dot, such as `192.`, `192.168.` or `192.168.1.`.|

## Returns

`true` if the one of specified IP address prefixes is a valid IPv4 address prefix, and it was found in *source*. Otherwise, the function returns `false`.

## Examples

```kusto
has_any_ipv4_prefix('05:04:54 127.0.0.1 GET /favicon.ico 404', '127.0.', '192.168.') // true

has_any_ipv4_prefix('05:04:54 127.0.0.1 GET /favicon.ico 404', dynamic(["127.0", "192.168."])) // false, invalid IPv4 prefix

has_any_ipv4_prefix('05:04:54 127.0.0.256 GET /favicon.ico 404', '127.0.', '192.168.') // false, invalid IPv4 address

has_any_ipv4_prefix('05:04:54127.0.0.1 GET /favicon.ico 404', '127.0.', '192.') // false, improperly delimited IP address
```
