---
title:  parse_ipv4()
description: Learn how to use the parse_ipv4() function to convert an IPv4 string to a long number in big-endian order.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# parse_ipv4()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts IPv4 string to a signed 64-bit wide long number representation in big-endian order.

## Syntax

`parse_ipv4(`*ip*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ip* | `string` |  :heavy_check_mark: | The IPv4 that is converted to long. The value may include net-mask using [IP-prefix notation](#ip-prefix-notation).|

[!INCLUDE [ip-prefix-notation](../includes/ip-prefix-notation.md)]

## Returns

If conversion is successful, the result is a long number.
If conversion isn't successful, the result is `null`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjcyC+OKSosy8dCsFCK3JFc2lAATqhpZGeoZmFnqGeobqOihcfSMTkIiRqakeEtY3NlTniuWqUUitKEnNS1EAmpyTn5euYKtQkFhUnBqfWVBmgrBOEwD8UomugwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(ip_string: string)
[
    '192.168.1.1', '192.168.1.1/24', '255.255.255.255/31'
]
| extend ip_long = parse_ipv4(ip_string)
```

**Output**

|ip_string|ip_long|
|---|---|
|192.168.1.1|3232235777|
|192.168.1.1/24|3232235776|
|255.255.255.255/31|4294967294|
