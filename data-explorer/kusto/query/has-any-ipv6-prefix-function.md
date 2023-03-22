---
title: has_any_ipv6_prefix() - Azure Data Explorer
description: Learn how to use the has_any_ipv6_prefix() function to check if any IPv6 address prefixes appear in the text.
---
# has_any_ipv6_prefix()

Returns a boolean value indicating whether one of specified IPv6 address prefixes appears in a text.

IP address entrances in a text must be properly delimited with a character that doesn't include alphanumeric, ':', or '.' characters.. For example, properly deliminated IP addresses are:

* "These requests came from: "2600:1402:9800:29b::356e, 2607:f8b0:4002:c09::93 and 2600:9000:2530:3e00:7:49a5:5fd2:8621"
* "05:04:54 ::1 GET /favicon.ico 404"

## Syntax

`has_any_ipv6_prefix(`*source* `,` *ip_address_prefix* [`,` *ip_address_prefix_2*`,` ...] `)`  

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source*| string | &check; | The value to search.|
| *ip_address_prefix*| string or dynamic | &check; | An IP address prefix, or an array of IP address prefixes, for which to search. A valid IP address prefix is either a complete IPv6 address, such as `2600:9000:2530:3e00:7:49a5:5fd2:8621`, or its prefix ending with a dot, such as `2600:9000:2530:` or `0:0:0:0:0:ffff:192.168.`.|

## Returns

`true` if the one of specified IP address prefixes is a valid IPv6 address prefix, and it was found in *source*. Otherwise, the function returns `false`.

## Examples

### IP addresses as list of strings

```kusto
print result=has_any_ipv6_prefix('05:04:54 ::1:2 GET /favicon.ico 404', '0.0.0.0.0.0.1:', '2600:') // true

```

|result|
|--|
|true|

### IP addresses as dynamic array

```kusto
print result=has_any_ipv6_prefix('05:04:54 ::1 GET /favicon.ico 404', dynamic(["0.0.0.0.0.0.1:", "2600:"]))
```

|result|
|--|
|true|

### Invalid IPv6 prefix

```kusto
print result=has_any_ipv6_prefix('05:04:54 ::1.2 GET /favicon.ico 404', '0:0:0:0:0:0:1')
```

|result|
|--|
|false|

### Improperly deliminated IP address

```kusto
print result=has_any_ipv6_prefix('05:04:54::1:2 GET /favicon.ico 404', '0:0:0:0:0:0:1:', '2600:')
```

|result|
|--|
|false|
