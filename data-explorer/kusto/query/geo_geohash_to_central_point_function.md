---
title: geo_geohash_to_central_point() - Azure Data Explorer | Microsoft Docs
description: This article describes geo_geohash_to_central_point() in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/20/2019
---
# geo_geohash_to_central_point()

Calculates geospatial coordinates that represents a center of Geohash rectangular area.

More information on Geohash can be found [here](https://en.wikipedia.org/wiki/Geohash).

**Syntax**

`geo_geohash_to_central_point(`*geohash*`)`

**Arguments**

* *geohash*: Geohash value for a geographic location. Geohash string can have length of 1 to 18 characters.


**Returns**

The geospatial coordinates value in [GeoJSON Format](https://tools.ietf.org/html/rfc7946) and of a dynamic data type.

> [!NOTE]
> The GeoJSON format specifies longitude first and latitude second.

**Examples**

```kusto
print point = geo_geohash_to_central_point("sunny")
| extend coordinates = point.coordinates
| extend longitude = coordinates[0]
| extend latitude = coordinates[1]
```

|point|coordinates|longitude|latitude|
|---|---|---|---|
|{<br>  "type": "Point",<br>  "coordinates": [<br>    42.47314453125,<br>    23.70849609375<br>  ]<br>}|[<br>  42.47314453125,<br>  23.70849609375<br>]|42.47314453125|23.70849609375|