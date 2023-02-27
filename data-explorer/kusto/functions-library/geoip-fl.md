---
title: geoip_fl() - Azure Data Explorer
description: Learn how to use the geoip_fl() user-defined function in Azure Data Explorer.
ms.reviewer: adieldar
ms.topic: reference
ms.date: 02/22/2023
---
# geoip_fl()

Retrieves geographic information of ip address.

> [!NOTE]
> This function retrieved geographic data from GeoLite2 data created by MaxMind, available from [http://www.maxmind.com](http://www.maxmind.com). Please review [GeoLite2 End User License Agreement](https://www.maxmind.com/en/geolite2/eula).

> [!NOTE]
>
> * `geoip_fl()` is a [user-defined function](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).
> * This function contains inline Python and requires [enabling the python() plugin](../query/pythonplugin.md#enable-the-plugin) on the cluster.

## Syntax

`T | invoke geoip_fl(`*ip_col*`,` *country_col*`,` *state_col*`,` *city_col*`,` *longitude_col*`,` *latitude_col*`)`
  
## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ip_col* | string | &check; | The name of the column containing the IP addresses to resolve. |
| *country_col* | string | &check; | The name of the column to store the retrieved country. |
| *state_col* | string | &check; | The name of the column to store the retrieved state. |
| *city_col* | string | &check; | The name of the column to store the retrieved city. |
| *longitude_col* | real | &check; | The name of the column to store the retrieved longitude. |
| *latitude_col* | real | &check; | The name of the column to store the retrieved latitude. |

## Usage

`geoip_fl()` is a user-defined function [tabular function](../query/functions/user-defined-functions.md#tabular-function), to be applied using the [invoke operator](../query/invokeoperator.md). You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

### [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

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
        reader = geoip2.database.Reader(r'Temp\\GeoLite2-City.mmdb')

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
;
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

To store the function, see [`.create function`](../management/create-function.md).  Creating a function requires [Database User permissions](../management/access-control/role-based-access-control.md).

### One time installation

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
        reader = geoip2.database.Reader(r'Temp\\GeoLite2-City.mmdb')

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

### Usage

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

| ip | country | state | city | longitude | latitude |
|--|--|--|--|--|--|
| 20.103.85.33 | Netherlands | North Holland | Amsterdam | 4.8883 | 52.3716 |
| 20.53.203.50 | Australia | New South Wales | Sydney | 151.2006 | -33.8715 |
| 20.81.111.85 | United States | Virginia | Tappahannock | -76.8545 | 37.9273 |
| 20.84.181.62 | United States | Iowa | Des Moines | -93.6124 | 41.6021 |
| 205.251.242.103 | United States | Virginia | Ashburn | -77.4903 | 39.0469 |
| 8.8.8.8 | United States | California | Los Angeles | -118.2441 | 34.0544 |