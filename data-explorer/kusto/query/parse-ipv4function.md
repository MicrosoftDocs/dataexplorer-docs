---
title: parse_ipv4() - Azure Data Explorer
description: Learn how to use the parse_ipv4() function to convert an IPv4 string to a long number in big-endian order.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2023
---
# parse_ipv4()

Converts IPv4 string to a signed 64-bit wide long number representation in big-endian order.

## Syntax

`parse_ipv4(`*ip*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ip* | string | &check; | The IPv4 that will be converted to long. The value may include net-mask using [IP-prefix notation](#ip-prefix-notation).|

## IP-prefix notation

IP addresses can be defined with `IP-prefix notation` using a slash (`/`) character.
The IP address to the LEFT of the slash (`/`) is the base IP address. The number (0 to 32) to the RIGHT of the slash (/) is the number of contiguous 1 bit in the netmask.

For example, 192.168.2.0/24 will have an associated net/subnetmask containing 24 contiguous bits or 255.255.255.0 in dotted decimal format.

## Returns

If conversion is successful, the result will be a long number.
If conversion isn't successful, the result will be `null`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjcyC+OKSosy8dCsFCK3JFc2lAATqhpZGeoZmFnqGeobqOihcfSMTkIiRqakeEtY3NlTniuWqUUitKEnNS1EAmpyTn5euYKtQkFhUnBqfWVBmgrBOEwD8UomugwAAAA==" target="_blank">Run the query</a>

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
