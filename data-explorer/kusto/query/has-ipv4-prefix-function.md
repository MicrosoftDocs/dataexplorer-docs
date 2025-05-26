---
title:  has_ipv4_prefix()
description: Learn how to use the has_ipv4_prefix() function to check if a specified IPv4 address prefix appears in the text.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# has_ipv4_prefix()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a value indicating whether a specified IPv4 address prefix appears in a text.

A valid IP address prefix is either a complete IPv4 address (`192.168.1.11`) or its prefix ending with a dot (`192.`, `192.168.` or `192.168.1.`).

IP address entrances in a text must be properly delimited with nonalphanumeric characters. For example, properly delimited IP addresses are:

* "These requests came from: 192.168.1.1, 10.1.1.115 and 10.1.1.201"
* "05:04:54 127.0.0.1 GET /favicon.ico 404"

## Syntax

`has_ipv4_prefix(`*source* `,` *ip_address_prefix* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source*| `string` |  :heavy_check_mark:| The text to search.|
| *ip_address_prefix*| `string` |  :heavy_check_mark:| The IP address prefix for which to search.|

## Returns

`true` if the *ip_address_prefix* is a valid IPv4 address prefix, and it was found in *source*. Otherwise, the function returns `false`.

> [!TIP]
> To search for many IPv4 prefixes at once, use the [has_any_ipv4_prefix()](has-any-ipv4-prefix-function.md) function.

## Examples

The following example shows how to use the `has_ipv4_prefix` function to search for a specific IPv4 address prefix within text.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOzywoM4kvKEpNy6zQUDcwtTIwsTI1UTA0MtczAEJDBXfXEAX9tMSyzOT8PD0goWBiYKKuo6AOUaGuCQBk8fTRUQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_ipv4_prefix('05:04:54 127.0.0.1 GET /favicon.ico 404', '127.0.')
```

|result|
|--|
|true|

The following example demonstrates using `has_ipv4_prefix` with an invalid IP address prefix. The IP address in the text is properly delimited by nonalphanumeric characters.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOzywoM4kvKEpNy6zQUDcwtTIwsTI1UTA0MtczAEJDBXfXEAX9tMSyzOT8PD0goWBiYKKuo6AOVqGuCQDlc4Z2UAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_ipv4_prefix('05:04:54 127.0.0.1 GET /favicon.ico 404', '127.0')
```

|result|
|--|
|false|

The following example demonstrates using `has_ipv4_prefix` with an invalid IP address. The IP address in the text is properly delimited by nonalphanumeric characters.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOzywoM4kvKEpNy6zQUDcwtTIwsTI1UTA0MtczAEIjUzMFd9cQBf20xLLM5Pw8PSChYGJgoq6joA5Ro64JAMAcwIpTAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_ipv4_prefix('05:04:54 127.0.0.256 GET /favicon.ico 404', '127.0.')
```

|result|
|--|
|false|

The following example demonstrates using `has_ipv4_prefix` with an improperly delimited IP address. The IP address in the text is improperly delimited by nonalphanumeric characters.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOzywoM4kvKEpNy6zQUDcwtTIwsTI1MTQy1zMAQkMFd9cQBf20xLLM5Pw8PSChYGJgoq6joA5Roa4JAD4FydVQAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_ipv4_prefix('05:04:54127.0.0.1 GET /favicon.ico 404', '127.0.')
```

|result|
|--|
|false|
