---
title:  has_any_ipv4()
description: Learn how to use the has_any_ipv4() function to check if any IPv4 addresses appear in the text.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# has_any_ipv4()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a value indicating whether one of specified IPv4 addresses appears in a text.

IP address entrances in a text must be properly delimited with non-alphanumeric characters. For example, properly delimited IP addresses are:

* "These requests came from: 192.168.1.1, 10.1.1.115 and 10.1.1.201"
* "05:04:54 127.0.0.1 GET /favicon.ico 404"

## Performance tips

[!INCLUDE [index-performance-tip-note](../includes/multi-arg-index-performance-note.md)]

## Syntax

`has_any_ipv4(`*source* `,` *ip_address* [`,` *ip_address_2*`,` ...] `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *source*| `string` |  :heavy_check_mark: | The value to search.|
| *ip_address*| string or dynamic |  :heavy_check_mark: | An IP address, or an array of IP addresses, for which to search.|

## Returns

`true` if one of specified IP addresses is a valid IPv4 address, and it was found in *source*. Otherwise, the function returns `false`.

## Examples

The following example demonstrates using `has_any_ipv4` with multiple scalar values, where each IP address is provided as a separate string argument. The IP addresses in the text are properly delimited by non-alphanumeric characters.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOT8yrjM8sKDPRUDcwtTIwsTI1UTA0MtczAEJDBXfXEAX9tMSyzOT8PD0goWBiYKKuo6AOV4HMMVLXBAATwSNyXgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_any_ipv4('05:04:54 127.0.0.1 GET /favicon.ico 404', '127.0.0.1', '127.0.0.2')
```

|result|
|--|
|true|

The following example demonstrates using `has_any_ipv4` with a dynamic array of IP addresses. The IP addresses in the text are properly delimited by non-alphanumeric characters.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOT8yrjM8sKDPRUDcwtTIwsTI1UTA0MtczAEJDBXfXEAX9tMSyzOT8PD0goWBiYKKuo5BSmZeYm5msEa0OVwoUhXOM1GM1NQHScYQ8aQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_any_ipv4('05:04:54 127.0.0.1 GET /favicon.ico 404', dynamic(['127.0.0.1', '127.0.0.2']))
```

|result|
|--|
|true|

The following example demonstrates using `has_any_ipv4` with an invalid IPv4 address. The IP addresses in the text are properly delimited by non-alphanumeric characters.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNSCyOT8yrjM8sKDPRUDcwtTIwsTI1UTA0MtczAEIjUzMFd9cQBf20xLLM5Pw8PSChYGJgoq6jkFKZl5ibmawRrYSkWElHQcnQ0kjP0MxCz1DPUClWUxMAIDlcGW8AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_any_ipv4('05:04:54 127.0.0.256 GET /favicon.ico 404', dynamic(["127.0.0.256", "192.168.1.1"]))
```

|result|
|--|
|false|

The following example demonstrates using `has_any_ipv4` with an improperly delimited IP address. The IP addresses in the text are not properly delimited by non-alphanumeric characters.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz2NywrCMBQFf+XsYqHkUVIfBZdF3LlwX4JJ8UKahiQW+vcGFzJwYODAxEShILn88eX6NnkyYZ8obvrAZD9IPfRadScuKwq38Qkxm41ea+B1oKVmLdj/8ZNLx9XxzFXVBkJgNj67FrTEtEaX/A7rPC1UnMX9AWNtzecvfjhaaIkAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=has_any_ipv4('05:04:54127.0.0.1 GET /favicon.ico 404', '127.0.0.1', '192.168.1.1') // false, improperly delimited IP address
```

|result|
|--|
|false|
