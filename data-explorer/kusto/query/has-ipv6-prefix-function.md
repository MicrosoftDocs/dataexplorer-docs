---
title: has_ipv6_prefix() - Azure Data Explorer
description: Learn how to use the has_ipv6_prefix() function to check if a specified IPv4 address prefix appears in the text.
---
# has_ipv6_prefix()

Returns a value indicating whether a specified IPv6 address prefix appears in a text.

A valid IPv6 address prefix is either a complete IPv6 address (`2600:9000:2530:3e00:7:49a5:5fd2:8621`) or its prefix ending with a dot or colon (`2600:9000:2530:` or `0:0:0:0:0:ffff:192.168.`). For prefixes,
the `::` format for compressing multiple 0s is not permitted.

IP address entrances in a text must be properly delimited with a character that doesn't include alphanumeric, ':', or '.' characters. For example, properly delimited IP addresses are:

* "These requests came from: "2600:1402:9800:29b::356e, 2607:f8b0:4002:c09::93 and 2600:9000:2530:3e00:7:49a5:5fd2:8621"
* "05:04:54 ::1 GET /favicon.ico 404"

## Syntax

`has_ipv6_prefix(`*source* `,` *ip_address_prefix* `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source*| string| &check;| The text to search.|
| *ip_address_prefix*| string| &check;| The IP address prefix for which to search.|

## Returns

`true` if the *ip_address_prefix* is a valid IPv6 address prefix, and it was found in *source*. Otherwise, the function returns `false`.

> [!TIP]
> To search for many IPv6 prefixes at once, use the [has_any_ipv6_prefix()](has-any-ipv6-prefix-function.md) function.

## Examples

### Properly formatted IPv6 prefix

```kusto
print result=has_ipv6_prefix('05:04:54 ::1 GET /favicon.ico 404', '0:0:0:0:0:0:0:')
```

|result|
|--|
|true|

### Properly formatted IPv6 prefix with embedded ipv4 address

```kusto
print result=has_ipv6_prefix('05:04:54 ::ffff:192.168.1.1 GET /favicon.ico 404', '0:0:0:0:0:ffff:192.168.')
```

|result|
|--|
|true|

### Invalid IPv6 prefix

```kusto
print result=has_ipv6_prefix('05:04:54 ::1 GET /favicon.ico 404', '0:0:0:0:0:0:0')
```

|result|
|--|
|false|

### Invalid IPv6 address

```kusto
print result=has_ipv6_prefix('05:04:54 ::1ffff GET /favicon.ico 404', '0:')
```

|result|
|--|
|false|

### Improperly delimited IPv6 address

```kusto
print result=has_ipv6_prefix('05:04:54::1 GET /favicon.ico 404', '0:')
```

|result|
|--|
|false|
