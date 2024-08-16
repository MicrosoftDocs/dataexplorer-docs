---
title:  geo_info_from_ip_address()
description: Learn how to use the geo_info_from_ip_address() function to retrieve geolocation information about IPv4 or IPv6 addresses.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# geo_info_from_ip_address()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Retrieves geolocation information about IPv4 or IPv6 addresses.

## Syntax

`geo_info_from_ip_address(`*IpAddress* `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *IpAddress*| `string` |  :heavy_check_mark: | IPv4 or IPv6 address to retrieve geolocation information about.|

## Returns

A dynamic object containing the information on IP address whereabouts (if the information is available). The object contains the following fields:

|Name| Type | Description|
|--|--|--|
|`country`| `string` |Country name|
|`state`| `string` |State (subdivision) name|
|`city`| `string` |City name|
|`latitude`| `real` |Latitude coordinate|
|`longitude`| `real` |Longitude coordinate|

> [!NOTE]
>
> * IP geolocation is inherently imprecise; locations are often near the center of the population. Any location provided by this function should not be used to identify a particular address or household.
> * This function uses GeoLite2 data created by MaxMind, available from [https://www.maxmind.com](https://www.maxmind.com).
> * The function is also built on the [MaxMind DB Reader](https://github.com/oschwald/maxminddb-rust) library provided under [ISC license](https://github.com/oschwald/maxminddb-rust/blob/main/LICENSE).

[!INCLUDE [dynamic-access](../includes/dynamic-access.md)]

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUcgsiM/JT04syczPs01PzY/PzEvLj08rys+NB8okpqQUpRYXa6gbGeiZGusZGRjrmRqoawIAlfxqOjoAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print ip_location=geo_info_from_ip_address('20.53.203.50')
```

**Output**

|ip_location|
|--|
|`{"country": "Australia", "state": "New South Wales", "city": "Sydney", "latitude": -33.8715, "longitude": 151.2006}`|


:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAw3JwQqAIAwA0F/pZt1MCWTQt4w1XQzKifr/1Lu+1rXORRs+xjTV6nkXQ61iKN1e/Idy7mWM1QXyEUJKHmQPDCmCEBe4vGeAcOTitg/tI4d9TwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print ip_location=geo_info_from_ip_address('2a03:2880:f12c:83:face:b00c::25de')
```

**Output**

|ip_location|
|--|
|`{"country": "United States", "state": "Florida", "city": "Boca Raton", "latitude": 26.3594, "longitude": -80.0771}`|
