---
title: has_any_ipv6() - Azure Data Explorer
description: Learn how to use the has_any_ipv6() function to check if any IPv6 addresses appear in the text.
ms.topic: reference
ms.date: 03/21/2023
---
# has_any_ipv6()

Returns a value indicating whether one of specified IPv4 addresses appears in a text.

IP address entrances in a text must be properly delimited with a character that doesn't include alphanumeric, ':', or '.' characters. For example, properly delimited IP addresses are:

* "These requests came from: 2600:1402:9800:29b::356e, 2607:f8b0:4002:c09::93 and 2600:9000:2530:3e00:7:49a5:5fd2:8621"
* "05:04:54 ::1 GET /favicon.ico 404"

## Syntax

`has_any_ipv6(`*source* `,` *ip_address* [`,` *ip_address_2*`,` ...] `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source*| string | &check; | The value to search.|
| *ip_address*| string or dynamic | &check; | An IP address, or an array of IP addresses, for which to search.|

## Returns

`true` if one of specified IP addresses is a valid IPv4 address, and it was found in *source*. Otherwise, the function returns `false`.

## Examples

### IP addresses as list of strings

```kusto
print result=has_any_ipv6('05:04:54 ::1 GET /favicon.ico 404', '::1', '::2')
```

|result|
|--|
|true|

### IP addresses as dynamic array

```kusto
print result=has_any_ipv6('05:04:54 ::1 GET /favicon.ico 404', dynamic(['::1', '::2']))
```

|result|
|--|
|true|

### Invalid IPv6 address

```kusto
print result=has_any_ipv6('05:04:54 ::1ffff GET /favicon.ico 404', dynamic(["::1ffff", "::1"]))
```

|result|
|--|
|false|

### Improperly deliminated IP address

```kusto
print result=has_any_ipv6('05:04:54::1 GET /favicon.ico 404', '::1', '::2') // false, improperly delimited IPv6 address
```

|result|
|--|
|false|
