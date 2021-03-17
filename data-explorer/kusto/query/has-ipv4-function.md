---
title: has_ipv4() - Azure Data Explorer
description: This article describes has_ipv4() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 02/16/2021
---
# has_ipv4()

Returns a value indicating whether specified IPv4 address appears in a text.

IP address entrances in a text must be properly delimited with non-alphanumeric characters. For instance, properly delimited IP addresses are:

 * "These requests came from: 192.168.1.1, 10.1.1.115 and 10.1.1.201"
 * "05:04:54 127.0.0.1 GET /favicon.ico 404"

The function works significantly faster if text column to search in is indexed using special tokenizer `common_logs_ipv4`. To update column tokenizer type to be used during future data ingestions, use the command:

```kusto
.alter column Table.Column policy encoding @'{"EncodingPolicyOrigin":"Automatic", "ShardFieldTokenizer":"common_logs_ipv4"}'
```

## Syntax

`has_ipv4(`*text* `,` *ip_address* `)`

## Arguments

* *text*: The value containing the text to search in.
* *ip_address*: String value containing the IP address to look for.

## Returns

`true` in case *ip_address* is a valid IPv4 address, and it was found in *text*. Otherwise the function returns `false`.

## Examples

```kusto
has_ipv4('05:04:54 127.0.0.1 GET /favicon.ico 404', '127.0.0.1')          // true
has_ipv4('05:04:54 127.0.0.256 GET /favicon.ico 404', '127.0.0.256')      // false, invalid IPv4 address
has_ipv4('05:04:54127.0.0.1 GET /favicon.ico 404', '127.0.0.1')           // false, improperly delimited IP address
```
