---
title: __has_ipv4_prefix() - Azure Data Explorer
description: This article describes __has_ipv4_prefix() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 02/16/2021
---
# __has_ipv4_prefix()

Returns a value indicating whether a specified IPv4 address prefix appears in a text.

A valid IP address prefix is either a complete IPv4 address (`192.168.1.11`) or its prefix ending with a dot (`192.`, `192.168.` or `192.168.1.`).

IP address entrances in a text must be properly delimited with non-alphanumeric characters. For example, properly delimited IP addresses are:

 * "These requests came from: 192.168.1.1, 10.1.1.115 and 10.1.1.201"
 * "05:04:54 127.0.0.1 GET /favicon.ico 404"

The function works significantly faster if the searched text column is indexed using the special tokenizer `common_logs_ipv4`. To update the column tokenizer type to be used in future data ingestions, use the command:

```kusto
.alter column Table.Column policy encoding @'{"EncodingPolicyOrigin":"Automatic", "ShardFieldTokenizer":"common_logs_ipv4"}'
```

## Syntax

`__has_ipv4(`*text* `,` *ip_address_prefix* `)`

## Arguments

* *text*: The value containing the text to search in.
* *ip_address_prefix*: String value containing the IP address prefix to look for.

## Returns

`true` if the *ip_address_prefix* is a valid IPv4 address prefix, and it was found in *text*. Otherwise, the function returns `false`.

## Examples

```kusto
__has_ipv4_prefix('05:04:54 127.0.0.1 GET /favicon.ico 404', '127.0.')          // true
__has_ipv4_prefix('05:04:54 127.0.0.1 GET /favicon.ico 404', '127.0')           // false, invalid IPv4 prefix
__has_ipv4_prefix('05:04:54 127.0.0.256 GET /favicon.ico 404', '127.0.')        // false, invalid IPv4 address
__has_ipv4_prefix('05:04:54127.0.0.1 GET /favicon.ico 404', '127.0.')           // false, improperly delimited IP address
```
