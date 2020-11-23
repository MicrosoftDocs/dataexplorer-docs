---
title: ipv4_lookup plugin - Azure Data Explorer
description: This article describes ipv4_lookup plugin in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 11/22/2020
---
# ipv4_lookup plugin

The `ipv4_lookup` looks up IPv4 value in a lookup table and returns rows with matched values.

```kusto
T | evaluate ipv4_lookup(LookupTable, SourceIPv4Key, LookupKey)

T | evaluate ipv4_lookup(LookupTable, SourceIPv4Key, LookupKey, return_unmatched = true)
```

## Syntax

*T* `|` `evaluate` `ipv4_lookup(` *LookupTable* `,` *SourceIPv4Key* `,` *LookupKey* [`,` *return_unmatched* ] `)`

## Arguments

* *T*: The tabular input whose column *SourceIPv4Key* will be used for IPv4 matching.
* *LookupTable*: Table or tabular expression with IPv4 lookup data, whose column *LookupKey* will be used for IPv4 matching. IPv4 values can be masked using [IP-prefix notation](#ip-prefix-notation).
* *SourceIPv4Key*: The column of *T* with IPv4 string to be looked up in *LookupTable*. IPv4 values can be masked using [IP-prefix notation](#ip-prefix-notation).
* *LookupKey*: The column of *LookupTable* with IPv4 string that is matched against each *SourceIPv4Key* value.
* *return_unmatched*: A boolean flag that defines if the result should include all or only matching rows (default: `false` - only matching rows returned).

## IP-prefix notation
 
IP addresses can be defined with `IP-prefix notation` using a slash (`/`) character.
The IP address to the left of the slash (`/`) is the base IP address. The number (1 to 32) to the right of the slash (`/`) is the number of contiguous 1 bit in the netmask. 

For example, 192.168.2.0/24 will have an associated net/subnetmask containing 24 contiguous bits or 255.255.255.0 in dotted decimal format.

## Returns

The `ipv4_lookup` plugin returns a result of join (lookup) based on IPv4 key. The schema of the table is the union of the source table and the lookup table, similar to the result of `lookup` operator.

In case when *return_unmatched* argument is set to `true`, the resulting table will include both matched and unmatched rows (filled with nulls).

In case when *return_unmatched* argument is set to `false` or omitted (default value of `false` is used), the resulting table will have as many records as matching results. This variant of lookup has better performance comparing to `return_unmatched=true` execution.

**Notes**

The plugin covers the scenario of IPv4-based join, and assumes that the lookup table size is small (100K-200K rows), while the input table can have larger size.
The performance of the plugin will depend on sizes of both lookup and data source tables, amount of columns and amount of the matching records.

## Examples

### IPv4 lookup - matching rows only

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
// IP lookup table: IP_Data
// Partial data from: https://raw.githubusercontent.com/datasets/geoip2-ipv4/master/data/geoip2-ipv4.csv
let IP_Data = datatable(network:string, continent_code:string ,continent_name:string, country_iso_code:string, country_name:string)
[
  "111.68.128.0/17","AS","Asia","JP","Japan",
  "5.8.0.0/19","EU","Europe","RU","Russia",
  "223.255.254.0/24","AS","Asia","SG","Singapore",
  "46.36.200.51/32","OC","Oceania","CK","Cook Islands",
  "2.20.183.0/24","EU","Europe","GB","United Kingdom",
];
let IPs = datatable(ip:string)
[
  '2.20.183.12',   // United Kingdom
  '5.8.1.2',       // Russia
  '192.165.12.17', // Unknown
];
IPs
| evaluate ipv4_lookup(IP_Data, ip, network)
```

|ip|network|continent_code|continent_name|country_iso_code|country_name|
|---|---|---|---|---|---|
|2.20.183.12|2.20.183.0/24|EU|Europe|GB|United Kingdom|
|5.8.1.2|5.8.0.0/19|EU|Europe|RU|Russia|

### IPv4 lookup - return both matching and non-matching rows

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
// IP lookup table: IP_Data
// Partial data from: 
// https://raw.githubusercontent.com/datasets/geoip2-ipv4/master/data/geoip2-ipv4.csv
let IP_Data = datatable(network:string,continent_code:string ,continent_name:string ,country_iso_code:string ,country_name:string )
[
    "111.68.128.0/17","AS","Asia","JP","Japan",
    "5.8.0.0/19","EU","Europe","RU","Russia",
    "223.255.254.0/24","AS","Asia","SG","Singapore",
    "46.36.200.51/32","OC","Oceania","CK","Cook Islands",
    "2.20.183.0/24","EU","Europe","GB","United Kingdom",
];
let IPs = datatable(ip:string)
[
    '2.20.183.12',   // United Kingdom
    '5.8.1.2',       // Russia
    '192.165.12.17', // Unknown
];
IPs
| evaluate ipv4_lookup(IP_Data, ip, network, return_unmatched = true)
```

|ip|network|continent_code|continent_name|country_iso_code|country_name|
|---|---|---|---|---|---|
|2.20.183.12|2.20.183.0/24|EU|Europe|GB|United Kingdom|
|5.8.1.2|5.8.0.0/19|EU|Europe|RU|Russia|
|192.165.12.17||||||

### IPv4 lookup - using source in external_data()

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let IP_Data = external_data(network:string,geoname_id:long,continent_code:string,continent_name:string ,country_iso_code:string,country_name:string,is_anonymous_proxy:bool,is_satellite_provider:bool)
    ['https://raw.githubusercontent.com/datasets/geoip2-ipv4/master/data/geoip2-ipv4.csv'];
let IPs = datatable(ip:string)
[
    '2.20.183.12',   // United Kingdom
    '5.8.1.2',       // Russia
    '192.165.12.17', // Sweden
];
IPs
| evaluate ipv4_lookup(IP_Data, ip, network, return_unmatched = true)
```

|ip|network|geoname_id|continent_code|continent_name|country_iso_code|country_name|is_anonymous_proxy|is_satellite_provider|
|---|---|---|---|---|---|---|---|---|
|2.20.183.12|2.20.183.0/24|2635167|EU|Europe|GB|United Kingdom|0|0|
|5.8.1.2|5.8.0.0/19|2017370|EU|Europe|RU|Russia|0|0|
|192.165.12.17|192.165.8.0/21|2661886|EU|Europe|SE|Sweden|0|0|
