---
title:  geoip_fl()
description: Learn how to use the geoip_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 03/13/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors-all
---
# geoip_fl()

::: zone pivot="azuredataexplorer, fabric"

`geoip_fl()` is a [user-defined function](../query/functions/user-defined-functions.md) that retrieves geographic information of ip address.

> [!NOTE]
> * Use the native function [geo_info_from_ip_address()](../query/geo-info-from-ip-address-function.md) instead of the function described in this document. The native function provides the same functionality and is better for performance and scalability. This document is provided for reference purposes only.
> * This function retrieved geographic data from GeoLite2 data created by MaxMind, available from [http://www.maxmind.com](http://www.maxmind.com). Please review [GeoLite2 End User License Agreement](https://www.maxmind.com/en/geolite2/eula).

[!INCLUDE [python-zone-pivot-fabric](../../includes/python-zone-pivot-fabric.md)]

## Syntax

`T | invoke geoip_fl(`*ip_col*`,` *country_col*`,` *state_col*`,` *city_col*`,` *longitude_col*`,` *latitude_col*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ip_col* | string | &check; | The name of the column containing the IP addresses to resolve. |
| *country_col* | string | &check; | The name of the column to store the retrieved country. |
| *state_col* | string | &check; | The name of the column to store the retrieved state. |
| *city_col* | string | &check; | The name of the column to store the retrieved city. |
| *longitude_col* | real | &check; | The name of the column to store the retrieved longitude. |
| *latitude_col* | real | &check; | The name of the column to store the retrieved latitude. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/letstatement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/letstatement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabularexpressionstatements.md). To run a working example of `geoip_fl()`, see [Example](#example).

```kusto
let geoip_fl=(tbl:(*), ip_col:string, country_col:string, state_col:string, city_col:string, longitude_col:string, latitude_col:string)
{
    let kwargs = bag_pack('ip_col', ip_col, 'country_col', country_col, 'state_col', state_col, 'city_col', city_col, 'longitude_col', longitude_col, 'latitude_col', latitude_col);
    let code= ```if 1:
        from sandbox_utils import Zipackage
        Zipackage.install('geoip2.zip')
        import geoip2.database

        ip_col = kargs['ip_col']
        country_col = kargs['country_col']
        state_col = kargs['state_col']
        city_col = kargs['city_col']
        longitude_col = kargs['longitude_col']
        latitude_col = kargs['latitude_col']
        result=df
        reader = geoip2.database.Reader(r'C:\\Temp\\GeoLite2-City.mmdb')

        def geodata(ip):
            try:
                gd = reader.city(ip)
                geo = pd.Series((gd.country.name, gd.subdivisions.most_specific.name, gd.city.name, gd.location.longitude, gd.location.latitude))
            except:
                geo = pd.Series((None, None, None, None, None))
            return geo
        
        result[[country_col, state_col, city_col, longitude_col, latitude_col]] = result[ip_col].apply(geodata)
        
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs,
        external_artifacts =
        pack('geoip2.zip', 'https://artifactswestus.blob.core.windows.net/public/geoip2-4.6.0.zip',
             'GeoLite2-City.mmdb', 'https://artifactswestus.blob.core.windows.net/public/GeoLite2-City-20230221.mmdb')
        )
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = 'Packages\\Utils', docstring = 'Retrieve geographics of ip address')
geoip_fl(tbl:(*), ip_col:string, country_col:string, state_col:string, city_col:string, longitude_col:string, latitude_col:string)
{
    let kwargs = bag_pack('ip_col', ip_col, 'country_col', country_col, 'state_col', state_col, 'city_col', city_col, 'longitude_col', longitude_col, 'latitude_col', latitude_col);
    let code= ```if 1:
        from sandbox_utils import Zipackage
        Zipackage.install('geoip2.zip')
        import geoip2.database

        ip_col = kargs['ip_col']
        country_col = kargs['country_col']
        state_col = kargs['state_col']
        city_col = kargs['city_col']
        longitude_col = kargs['longitude_col']
        latitude_col = kargs['latitude_col']
        result=df
        reader = geoip2.database.Reader(r'C:\\Temp\\GeoLite2-City.mmdb')

        def geodata(ip):
            try:
                gd = reader.city(ip)
                geo = pd.Series((gd.country.name, gd.subdivisions.most_specific.name, gd.city.name, gd.location.longitude, gd.location.latitude))
            except:
                geo = pd.Series((None, None, None, None, None))
            return geo
        
        result[[country_col, state_col, city_col, longitude_col, latitude_col]] = result[ip_col].apply(geodata)
        
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs,
        external_artifacts =
        pack('geoip2.zip', 'https://artifactswestus.blob.core.windows.net/public/geoip2-4.6.0.zip',
             'GeoLite2-City.mmdb', 'https://artifactswestus.blob.core.windows.net/public/GeoLite2-City-20230221.mmdb')
        )
}
```

---

## Example

The following example uses the [invoke operator](../query/invokeoperator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

```kusto
let geoip_fl=(tbl:(*), ip_col:string, country_col:string, state_col:string, city_col:string, longitude_col:string, latitude_col:string)
{
    let kwargs = bag_pack('ip_col', ip_col, 'country_col', country_col, 'state_col', state_col, 'city_col', city_col, 'longitude_col', longitude_col, 'latitude_col', latitude_col);
    let code= ```if 1:
        from sandbox_utils import Zipackage
        Zipackage.install('geoip2.zip')
        import geoip2.database

        ip_col = kargs['ip_col']
        country_col = kargs['country_col']
        state_col = kargs['state_col']
        city_col = kargs['city_col']
        longitude_col = kargs['longitude_col']
        latitude_col = kargs['latitude_col']
        result=df
        reader = geoip2.database.Reader(r'C:\\Temp\\GeoLite2-City.mmdb')

        def geodata(ip):
            try:
                gd = reader.city(ip)
                geo = pd.Series((gd.country.name, gd.subdivisions.most_specific.name, gd.city.name, gd.location.longitude, gd.location.latitude))
            except:
                geo = pd.Series((None, None, None, None, None))
            return geo
        
        result[[country_col, state_col, city_col, longitude_col, latitude_col]] = result[ip_col].apply(geodata)
        
    ```;
    tbl
    | evaluate python(typeof(*), code, kwargs,
        external_artifacts =
        pack('geoip2.zip', 'https://artifactswestus.blob.core.windows.net/public/geoip2-4.6.0.zip',
             'GeoLite2-City.mmdb', 'https://artifactswestus.blob.core.windows.net/public/GeoLite2-City-20230221.mmdb')
        )
};
datatable(ip:string) [
'8.8.8.8',
'20.53.203.50',
'20.81.111.85',
'20.103.85.33',
'20.84.181.62',
'205.251.242.103',
]
| extend country='', state='', city='', longitude=real(null), latitude=real(null)
| invoke geoip_fl('ip','country', 'state', 'city', 'longitude', 'latitude')
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
datatable(ip:string) [
'8.8.8.8',
'20.53.203.50',
'20.81.111.85',
'20.103.85.33',
'20.84.181.62',
'205.251.242.103',
]
| extend country='', state='', city='', longitude=real(null), latitude=real(null)
| invoke geoip_fl('ip','country', 'state', 'city', 'longitude', 'latitude')
```

---

**Output**

| ip | country | state | city | longitude | latitude |
|--|--|--|--|--|--|
| 20.103.85.33 | Netherlands | North Holland | Amsterdam | 4.8883 | 52.3716 |
| 20.53.203.50 | Australia | New South Wales | Sydney | 151.2006 | -33.8715 |
| 20.81.111.85 | United States | Virginia | Tappahannock | -76.8545 | 37.9273 |
| 20.84.181.62 | United States | Iowa | Des Moines | -93.6124 | 41.6021 |
| 205.251.242.103 | United States | Virginia | Ashburn | -77.4903 | 39.0469 |
| 8.8.8.8 | United States | California | Los Angeles | -118.2441 | 34.0544 |

::: zone-end

::: zone pivot="azuremonitor"

This feature isn't supported.

::: zone-end
