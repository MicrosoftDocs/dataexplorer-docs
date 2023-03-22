---
title: has_ipv6() - Acure Data Explorer
description: Learn how to use the has_ipv6() function to check if any IPv6 addresses appear in the text.
---

# has_ipv6()

Returns a value indicating whether a specified IPv6 address appears in a text.

IP address entrances in a text must be properly delimited with a character that doesn't include alphanumeric, ':', or '.' characters. For example, properly delimited IP addresses are:

* "These requests came from: 2600:1402:9800:29b::356e, 2607:f8b0:4002:c09::93 and 2600:9000:2530:3e00:7:49a5:5fd2:8621"
* "05:04:54 ::1 GET /favicon.ico 404"

## Syntax

`has_ipv6(`*source* `,` *ip_address* `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source* | string | &check; | The text to search.|
| *ip_address* | string | &check; | The value containing the IP address for which to search.|

## Returns

`true` if the *ip_address* is a valid IPv6 address, and it was found in *source*. Otherwise, the function returns `false`.

> [!TIP]
>
> * To search for many IPv6 addresses at once, use [has_any_ipv6()](has-any-ipv6-function.md) function.
> * To search for IPv4 addresses prefix, use [has_ipv6_prefix()](has-ipv6-prefix-function.md) function.

## Examples

### Properly formatted IP address

```kusto
print result=has_ipv6('05:04:54 ::1 GET /favicon.ico 404', '::1')
```

**Output**

|result|
|--|
|true|

### Invalid IP address

```kusto
print result=has_ipv6('05:04:54 ::1ffff GET /favicon.ico 404', '::1ffff')
```

**Output**

|result|
|--|
|false|

### Improperly delimited IP

```kusto
print result=has_ipv6('05:04:54::1 GET /favicon.ico 404', '::1')
```

**Output**

|result|
|--|
|false|
