---
title:  has_any_ipv4_prefix()
description: Learn how to use the has_any_ipv4_prefix() function to check if any IPv4 address prefixes appear in the text.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# has_any_ipv4_prefix()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a boolean value indicating whether one of specified IPv4 address prefixes appears in a text.

IP address entrances in a text must be properly delimited with non-alphanumeric characters. For example, properly delimited IP addresses are:

* "These requests came from: 192.168.1.1, 10.1.1.115 and 10.1.1.201"
* "05:04:54 127.0.0.1 GET /favicon.ico 404"

## Syntax

`has_any_ipv4_prefix(`*source* `,` *ip_address_prefix* [`,` *ip_address_prefix_2*`,` ...] `)`  

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source*| `string` |  :heavy_check_mark: | The value to search.|
| *ip_address_prefix*| string or dynamic |  :heavy_check_mark: | An IP address prefix, or an array of IP address prefixes, for which to search. A valid IP address prefix is either a complete IPv4 address, such as `192.168.1.11`, or its prefix ending with a dot, such as `192.`, `192.168.` or `192.168.1.`.|

## Returns

`true` if the one of specified IP address prefixes is a valid IPv4 address prefix, and it was found in *source*. Otherwise, the function returns `false`.

## Examples

### IP addresses as list of strings

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOT8yrjM8sKDOJLyhKTcus0FA3MLUyMLEyNVEwNDLXMwBCQwV31xAF/bTEsszk/Dw9IKFgYmCirqOgDlEBZlka6RmaWeipayro6yuUFJWmAgAUwkzUaQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_any_ipv4_prefix('05:04:54 127.0.0.1 GET /favicon.ico 404', '127.0.', '192.168.') // true

```

|result|
|--|
|true|

### IP addresses as dynamic array

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOT8yrjM8sKDOJLyhKTcus0FA3MLUyMLEyNVEwNDLXMwBCQwV31xAF/bTEsszk/Dw9IKFgYmCirqOQUpmXmJuZrBGtBFGqpKOgZGhppGdoZqGnFKupCQARxDvmbAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_any_ipv4_prefix('05:04:54 127.0.0.1 GET /favicon.ico 404', dynamic(["127.0.", "192.168."]))
```

|result|
|--|
|true|

### Invalid IPv4 prefix

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOT8yrjM8sKDOJLyhKTcus0FA3MLUyMLEyNVEwNDLXMwBCQwV31xAF/bTEsszk/Dw9IKFgYmCirqOgDlahrgkA7mfKHVQAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_any_ipv4_prefix('05:04:54 127.0.0.1 GET /favicon.ico 404', '127.0')
```

|result|
|--|
|false|

### Improperly deliminated IP address

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOT8yrjM8sKDOJLyhKTcus0FA3MLUyMLEyNTE0MtczAEJDBXfXEAX9tMSyzOT8PD0goWBiYKKuo6AOUQFmWRrpqWsCACl5RqJcAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_any_ipv4_prefix('05:04:54127.0.0.1 GET /favicon.ico 404', '127.0.', '192.')
```

|result|
|--|
|false|
