---
title:  geo_distance_point_to_line()
description: Learn how to use the geo_distance_point_to_line() function to calculate the shortest distance between a coordinate and a line or multiline on Earth.
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 04/04/2024
---
# geo_distance_point_to_line()

Calculates the shortest distance in meters between a coordinate and a line or multiline on Earth.

## Syntax

`geo_distance_point_to_line(`*longitude*`,`*latitude*`,`*lineString*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *longitude* | `real` |  :heavy_check_mark: | The geospatial coordinate longitude value in degrees. A valid value is in the range [-180, +180].|
| *latitude* | `real` |  :heavy_check_mark: | The geospatial coordinate latitude value in degrees. A valid value is in the range [-90, +90].|
| *lineString* | `dynamic` |  :heavy_check_mark: | A line or multiline in the [GeoJSON format](https://tools.ietf.org/html/rfc7946).|

## Returns

The shortest distance, in meters, between a coordinate and a line or multiline on Earth. If the coordinate or lineString are invalid, the query produces a null result.

> [!NOTE]
>
> * The geospatial coordinates are interpreted as represented by the [WGS-84](https://earth-info.nga.mil/index.php?dir=wgs84&action=wgs84) coordinate reference system.
> * The [geodetic datum](https://en.wikipedia.org/wiki/Geodetic_datum) used to measure distance on Earth is a sphere. Line edges are [geodesics](https://en.wikipedia.org/wiki/Geodesic) on the sphere.
> * If input line edges are straight cartesian lines, consider using [geo_line_densify()](geo-line-densify-function.md) in order to convert planar edges to geodesics.

### LineString definition and constraints

dynamic({"type": "LineString","coordinates": [[lng_1,lat_1], [lng_2,lat_2],..., [lng_N,lat_N]]})

dynamic({"type": "MultiLineString","coordinates": [[line_1, line_2, ..., line_N]]})

* LineString coordinates array must contain at least two entries.
* Coordinates [longitude, latitude] must be valid where longitude is a real number in the range [-180, +180] and latitude is a real number in the range [-90, +90].
* Edge length must be less than 180 degrees. The shortest edge between the two vertices is chosen.

> [!TIP]
>
> * Using literal LineString or a MultiLineString may result in better performance.
> * If you want to know the shortest distance between one or more points to many lines, consider folding these lines into one multiline. See the following [example](#examples).

## Examples

### Shortest distance to airport

The following example finds the shortest distance between North Las Vegas Airport and a nearby road.

:::image type="content" source="media/geo-distance-point-to-line-function/distance-point-to-line.png" alt-text="Screenshot of a map showing the distance between North Las Vegas Airport and a specific road.":::

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA03PwWrDMAwG4FcxObWQFVuyZLuwN+htxxJCSEwxrE5IfCmj7z6zunPOn/Tr17KGmMQUtjTE0fch9nef/LqJT3Hzc/8Py5zn+jT33yH6w4dSdFLOMVArkE+gpFauFdMjDvcwHn6a9Fh8cxbNJY9/pXzk1rSiGed5nUIckt8yXq+vHEVoSw445ahrRRFk54pIicxVtASCP1EOtJE7QSL7EmsJcCdaGi6Sz+gqpJlLmtHa7naYNaoijNZWsQjWFSEpTRUHrN5pbLC2Bgm6fKoManRVgHLtdwNk6rrn8fgL1VPyAZ0BAAA=" target="_blank">Run the query</a>

```kusto
print distance_in_meters = geo_distance_point_to_line(-115.199625, 36.210419, dynamic({ "type":"LineString","coordinates":[[-115.115385,36.229195],[-115.136995,36.200366],[-115.140252,36.192470],[-115.143558,36.188523],[-115.144076,36.181954],[-115.154662,36.174483],[-115.166431,36.176388],[-115.183289,36.175007],[-115.192612,36.176736],[-115.202485,36.173439],[-115.225355,36.174365]]}))
```

**Output**

| distance_in_meters |
|--------------------|
| 3797.88887253334   |

### Storm events across the south coast

The following example finds storm events along the US south coast filtered by a maximum distance of 5 km from the defined shore line.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22ST48TMQzF7/spop5aqUS2E8cOsBcQt70tt1VVjdqoHdjOVNPAagV8d9ymXS6c5o9/eX5+8XOp7jT+qPvPY3eq7t5tX4fu0G/mv2b19Vhm793soR/KY536YTdbutlmHKdtP3S1nKz49PQui0dlYOUcJOacl47Y5yxsH5hZCJFWS3chWYFTipCIDUs+J6TIIsCUstwoxIw3Rnxm5owAMUViDg2KHiLlpJeOrWn2QomIAuZgZyA2knxWJcWLWvZKyEpCwOejF0SzTSCAKPZoFGIQYZNBjOGNChol8cVXAB+Qs4qdYRZNzbyeRwwA0voZRTY+GENRz3ijko8agzTC5hCynBgCplZnj0Qg9uPqOqkFR+ZYOWljLAFAy+Qs1GI3LYyMZJZCkIQtKiWfks1zi0C9QkIJDKocRdKNUow5vuWuHoIlKeeRJVkaNwxFJDTzdoFszhNTUErCV2dgt4+EkBvEnuCsjBw4WWG1+rP4cPdYx+nw5WcZ6unutztO47eyqe5T2fXDwzgsr29dXboL9NWW0biXfZmK25Vxve1PtRs2ZX0c+6Gu67h+tj2d/0/g334v3EfHAGBKUxm2ZXKnTVdrmTb7bqrupa97N//eD9v7Q3dc/AWyeZdJHAMAAA==" target="_blank">Run the query</a>

```kusto
let southCoast = dynamic({"type":"LineString","coordinates":[[-97.18505859374999,25.997549919572112],[-97.58056640625,26.96124577052697],[-97.119140625,27.955591004642553],[-94.04296874999999,29.726222319395504],[-92.98828125,29.82158272057499],[-89.18701171875,29.11377539511439],[-89.384765625,30.315987718557867],[-87.5830078125,30.221101852485987],[-86.484375,30.4297295750316],[-85.1220703125,29.6880527498568],[-84.00146484374999,30.14512718337613],[-82.6611328125,28.806173508854776],[-82.81494140625,28.033197847676377],[-82.177734375,26.52956523826758],[-80.9912109375,25.20494115356912]]});
StormEvents
| project BeginLon, BeginLat, EventType
| where geo_distance_point_to_line(BeginLon, BeginLat, southCoast) < 5000
| render scatterchart with (kind=map)
```

**Output**

:::image type="content" source="media/geo-distance-point-to-line-function/us-south-coast-storm-events.png" alt-text="Screenshot of rendered storm events along the south coast of the US.":::

### New York taxi pickups

The following example finds New York taxi pickups filtered by a maximum distance of 0.1 meters from the defined multiline.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA42YTW8cNwyG7%2F0VC58SwA0kkaKktDn03px6DAxjsR4k0zi7xnrSNGj73%2FuOlxzSRYsGuRj7LEmJevmxuZ%2BW3dv93fx4Ov7027R7s7v7etx%2Fmg8v%2Frhavj5MV6%2Bv3n6%2BX%2Baf5%2BP0y3Kej%2B%2Bvrq8Op9P5bj7ul%2Bnx6vW7d%2B%2B%2Bb%2FRq9DZ6oWtOrxqnLqXeXBsQHuUCMhEHwDBRUBOLg0SsrkrmAKT2rBalSXVXkovFIGrVLar0rK5ojAh4kFpwkRRAKRuQkh1wG0ld1ULJg%2BNrZlG5UrDgvllIjMHEdqra8W8DNCopEPwdQUoaQ1iGu6Im3SwEURwgiFq0nHJwRd1itNxCdstolt0GrwFwqwo6l3CqkoooGInDzXMVE8N4dqqci8aoqbRwjzSaGGD87UBMJTWNGBz2eqqaa3goCDHpBfFxG9VB7WKApQYLShajdAquOv4pIG4u6ramV11xCsdtrQ%2B74GoQALSsFnhjcVcyWJ%2B2ViTILfDQRYHUJgGk1NRVK8nTDgdVy6DihMGiQgFq0VedbABpUO3WgbJ1C87DTjUaFQcQnFpIovC0jShtYERXBaWjIEvxwmkFClVQSg8xchezKKiCADipqIVwdwdpkMpHkGevqJbwogZgFCzYylm45xEAWeFIxQ2Dq1XVCp4dN%2BHiBtAANgsZtZkrSd0rSqARy5W07LlC1W03b2snc4BOaGCIJ1EgLLtgx6u7K%2BRdO4OMklyiIp1VomtpjQCoqytkJ8aAqvSCaCXDk4jrWgNAKwl9d235qsRWuHoNCpqqWVAKHU44pWwAR3dAlexUaDE5ALQGAyOeqmAcKMCLhSSWnDW7kEL2hgxd5pwVjB5SknPVJgNSfHihm6PQLwBSKAEU63Ct91AGKCMrNTSiQgGgJg1g6FQHZSjoKQsFkO2CPXH2h6pPU1hBpwjK0FyhN2dvMlAM6wVXhfl71EY9GYAe3AJJ1xfEHBneSyrqyCw4UQ4g5Q3gS%2B6qrugCKt7JLSruZwCTzwGLNf3%2BJD4HpTa1aNgmggWEaaBQSCLWFEsJSi08FMnYLJBptyBMLLVASwspoa04Oy4SgiMLZQOhZeC2JmrIqLna182ia3AIJoghI9sXC4zaeKqMcrlYjIwh7CANm2oDLWYEgOJWUKCLDaCKrAFAejkCZFRjkCQOAKNIAWN0Oui1akrWL0kAEKYCDMLgCiWpxYmy4xIAXtAAruLgqZNdAOrG6xw9mC0GLuLvgYVsSyLuGo6LZely3J5w2HBctERRgB0zHJes9QGMMD%2BYsrZXVAOiuUUZ3WJgj%2BkBoKbyBRBmVwDMyQDyPhzAV1OwrhMB6KAHWOeBA5SgBofyQkoKFktWgBcpG8j2HugxSJxbZJuDPdUUliJOGLF6XBSjTxxcgrsCwea7WRBmp52qpbDcEWzMYv11EEChagBTxgFWNcsuGlYOgMVc4ZeFdx%2BswSUbwLLjFmvdqysUZHCFnzZqgX0qbJaE6VUvn%2BfaUvPPMea7AjjrNyD%2FhdxGxbuCKsEZloZxAVi8S3GQKBUDyP03RcnaL1cAYQdnfPnxBYAioW%2BK8k9kNhX6UmfYfpuHh%2Fz1GdHpqQcLbG8K1k7ogPF4GgOSjwBt0iywIAYgZImkLtHCehPACMsJesDYgo8RXfGWLUhAAsAELAY4WkATGwjFDmDKBgjVg5%2BEw2P0eCq0dQM5DEPCylS2GGES4xceb8GfWWClzOXfYqD22E8V6g07jzhIEYTg63T5BjmIVQl%2BrgVh1yH2UPgdEOVDWNNMDLHeatalF4DC9kUV82hTCT9TCW8qwTjsQSWS%2FWnje0hOG3gmuMoOYtpRONvTZnr25lw3UEN2MRPGBqTFN9e9cwWjx6eVLXjuEVBwFQsHTcNPtf72u7n56%2BUP3x2%2FHm6X%2Fe%2Fzd3%2FuHs6nX6fDsnuYDx8%2FP9zen47v5%2BXz3XS9fbJfnj7Ad798mM7T7v10ur2bH5f98TDdPpzm43K7nG7v5%2BP04n%2BdXIf%2FcHq5%2B%2FHNLr3KcLzsP047iBV%2Fnqfj3XTePR72yzKdDx%2F252X3ZV4%2B7F58nI93bz7tH17%2BDY7A8nu4EgAA" target="_blank">Run the query</a>

```kusto
let MadisonAve = dynamic({"type":"MultiLineString","coordinates":[[[-73.9879823,40.7408625],[-73.9876492,40.7413345],[-73.9874982,40.7415046],[-73.9870343,40.7421446],[-73.9865812,40.7427655],[-73.9861292,40.7433756],[-73.9856813,40.7439956],[-73.9854932,40.7442606],[-73.9852232,40.7446216],[-73.9847903,40.7452305],[-73.9846232,40.7454536],[-73.9844803,40.7456606],[-73.9843413,40.7458585],[-73.9839533,40.7463955],[-73.9839002,40.7464696],[-73.9837683,40.7466566],[-73.9834342,40.7471015],[-73.9833833,40.7471746],[-73.9829712,40.7477686],[-73.9824752,40.7484255],[-73.9820262,40.7490436],[-73.9815623,40.7496566],[-73.9811212,40.7502796],[-73.9809762,40.7504976],[-73.9806982,40.7509255],[-73.9802752,40.7515216],[-73.9798033,40.7521795],[-73.9795863,40.7524656],[-73.9793082,40.7528316],[-73.9787872,40.7534725],[-73.9783433,40.7540976],[-73.9778912,40.7547256],[-73.9774213,40.7553365],[-73.9769402,40.7559816],[-73.9764622,40.7565766],[-73.9760073,40.7572036],[-73.9755592,40.7578366],[-73.9751013,40.7584665],[-73.9746532,40.7590866],[-73.9741902,40.7597326],[-73.9737632,40.7603566],[-73.9733032,40.7609866],[-73.9728472,40.7616205],[-73.9723422,40.7622826],[-73.9718672,40.7629556],[-73.9714042,40.7635726],[-73.9709362,40.7642185],[-73.9705282,40.7647636],[-73.9704903,40.7648196],[-73.9703342,40.7650355],[-73.9701562,40.7652826],[-73.9700322,40.7654535],[-73.9695742,40.7660886],[-73.9691232,40.7667166],[-73.9686672,40.7673375],[-73.9682142,40.7679605],[-73.9677482,40.7685786],[-73.9672883,40.7692076],[-73.9668412,40.7698296],[-73.9663882,40.7704605],[-73.9659222,40.7710936],[-73.9654262,40.7717756],[-73.9649292,40.7724595],[-73.9644662,40.7730955],[-73.9640012,40.7737285],[-73.9635382,40.7743615],[-73.9630692,40.7749936],[-73.9626122,40.7756275],[-73.9621172,40.7763106],[-73.9616111,40.7769896],[-73.9611552,40.7776245],[-73.9606891,40.7782625],[-73.9602212,40.7788866],[-73.9597532,40.7795236],[-73.9595842,40.7797445],[-73.9592942,40.7801635],[-73.9591122,40.7804105],[-73.9587982,40.7808305],[-73.9582992,40.7815116],[-73.9578452,40.7821455],[-73.9573802,40.7827706],[-73.9569262,40.7833965],[-73.9564802,40.7840315],[-73.9560102,40.7846486],[-73.9555601,40.7852755],[-73.9551221,40.7859005],[-73.9546752,40.7865426],[-73.9542571,40.7871505],[-73.9541771,40.7872335],[-73.9540892,40.7873366],[-73.9536971,40.7879115],[-73.9532792,40.7884706],[-73.9532142,40.7885205],[-73.9531522,40.7885826],[-73.9527382,40.7891785],[-73.9523081,40.7897545],[-73.9518332,40.7904115],[-73.9513721,40.7910435],[-73.9509082,40.7916695],[-73.9504602,40.7922995],[-73.9499882,40.7929195],[-73.9495051,40.7936045],[-73.9490071,40.7942835],[-73.9485542,40.7949065],[-73.9480832,40.7955345],[-73.9476372,40.7961425],[-73.9471772,40.7967915],[-73.9466841,40.7974475],[-73.9453432,40.7992905],[-73.9448332,40.7999835],[-73.9443442,40.8006565],[-73.9438862,40.8012945],[-73.9434262,40.8019196],[-73.9431412,40.8023325],[-73.9429842,40.8025585],[-73.9425691,40.8031855],[-73.9424401,40.8033609],[-73.9422987,40.8035533],[-73.9422013,40.8036857],[-73.9421022,40.8038205],[-73.9420024,40.8039552],[-73.9416372,40.8044485],[-73.9411562,40.8050725],[-73.9406471,40.8057176],[-73.9401481,40.8064135],[-73.9397022,40.8070255],[-73.9394081,40.8074155],[-73.9392351,40.8076495],[-73.9387842,40.8082715],[-73.9384681,40.8087086],[-73.9383211,40.8089025],[-73.9378792,40.8095215],[-73.9374011,40.8101795],[-73.936405,40.8115707],[-73.9362328,40.8118098]],[[-73.9362328,40.8118098],[-73.9362432,40.8118567],[-73.9361239,40.8120222],[-73.9360302,40.8120805]],[[-73.9362328,40.8118098],[-73.9361571,40.8118294],[-73.9360443,40.8119993],[-73.9360302,40.8120805]],[[-73.9360302,40.8120805],[-73.9359423,40.8121378],[-73.9358551,40.8122385],[-73.9352181,40.8130815],[-73.9348702,40.8135515],[-73.9347541,40.8137145],[-73.9346332,40.8138615],[-73.9345542,40.8139595],[-73.9344981,40.8139945],[-73.9344571,40.8140165],[-73.9343962,40.8140445],[-73.9343642,40.8140585],[-73.9343081,40.8140725],[-73.9341971,40.8140895],[-73.9341041,40.8141005],[-73.9340022,40.8140965],[-73.9338442,40.8141005],[-73.9333712,40.8140895],[-73.9325541,40.8140755],[-73.9324561,40.8140705],[-73.9324022,40.8140695]],[[-73.9360302,40.8120805],[-73.93605,40.8121667],[-73.9359632,40.8122805],[-73.9353631,40.8130795],[-73.9351482,40.8133625],[-73.9350072,40.8135415],[-73.9347441,40.8139168],[-73.9346611,40.8140125],[-73.9346101,40.8140515],[-73.9345401,40.8140965],[-73.9344381,40.8141385],[-73.9343451,40.8141555],[-73.9342991,40.8141675],[-73.9341552,40.8141985],[-73.9338601,40.8141885],[-73.9333991,40.8141815],[-73.9323981,40.8141665]]]});
nyc_taxi
| project pickup_longitude, pickup_latitude
| where geo_distance_point_to_line(pickup_longitude, pickup_latitude, MadisonAve) <= 0.1
| take 100
| render scatterchart with (kind=map)
```

**Output**

:::image type="content" source="media/geo-distance-point-to-line-function/madison-ave-road.png" alt-text="Screenshot of rendered NYC taxi pickups on Madison Ave.":::

The following example folds many lines into one multiline and queries this multiline. The query finds all taxi pickups that happened 10 km away from all roads in Manhattan.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA6WUy2%2BbMBzH75X6P3iciMRSPzHulEnbYaf2sh12iCLkgpfQ8JJx1mVd%2F%2FeZh4mbHjYpcAD8%2Bb39xaUy4F7WO2mMrL82Mu%2FA6voK2CuXxt4PpQp%2FKGkOWnW3%2BbGWVZEtRoP1%2BBhsRxA%2BB%2BbYquA2%2BDK6BFHQ6qZV2hSqC26fgzv5oErLEWVm981opcxnvQ1eomCrmkoZfeytpiD3h9IUd0WtrGFRb22wrGl0XtTS9NHW6%2FV7TpaCYIyZiChcJkjQmLBN5ADxAKfEA4KTGXCx2WxeXhbRBQ19Rxj2HV3WSowEo2gsDNKEUldxjBGjeAKM47nHmMATEJR5gAk4AYQ4OoUiggoHCOInQCGbPQiH7PKpoM58%2BqkumwmHFGHal8VpAsm8iRxiSIlbFzCe%2BxBxMjZoASfUAwyiCQgkuAcoww4QJOKNJQ4JK5cpWBKT%2F%2FM5R7MPsZOdgL1PIEmSKYstETIPxCx2gPqhEooJmgCnXi9czKEQYYkHEg4doCLxC%2BZxQsa6mB0q9nwYdentX%2BYHI8xlwdQfJcdu%2BMz%2BfNAHCDsQJxYM6jqJ6%2BYGLJdLUDVaAT0cRPZzxJsP11elPahkWQ5H1Mo0XSZLqcORvz7AxrU%2FwEryUWVmCJZ60lq582zpRLn0qPPuDlUldfFbgUruVVoWnQnPIy3OU1W9pEsrabACD3KbtjLbh6Peo7d6B68EH4E%2BR%2Fomx8I2Xx%2Bz1MhfxfXVKVdbZPtDm5ZNvS3MIVfRvCLNsNAbP%2B2UHee5KXi3AhDIOj93GcDJz84nzW1Rss5U2jZFbVLTpH1%2F4T%2Bz2wWpO5U%2Bdk0duo1bLMBHgKC9%2BiTGDtZ%2B9a9a1bnSwO6qMUpnO6kNeCrMDoT7os5XlWwXfwES9dcdqgYAAA%3D%3D" target="_blank">Run the query</a>

```kusto
let ManhattanRoads =
    datatable(features:dynamic)
    [
        dynamic({"type":"Feature","properties":{"Label":"145thStreetBrg"},"geometry":{"type":"MultiLineString","coordinates":[[[-73.9322259,40.8194635],[-73.9323259,40.8194743],[-73.9323973,40.8194779]]]}}),
        dynamic({"type":"Feature","properties":{"Label":"W120thSt"},"geometry":{"type":"MultiLineString","coordinates":[[[-73.9619541,40.8104844],[-73.9621542,40.8105725],[-73.9630542,40.8109455],[-73.9635902,40.8111714],[-73.9639492,40.8113174],[-73.9640502,40.8113705]]]}}),
        dynamic({"type":"Feature","properties":{"Label":"1stAve"},"geometry":{"type":"MultiLineString","coordinates":[[[-73.9704124,40.748033],[-73.9702043,40.7480906],[-73.9696892,40.7487346],[-73.9695012,40.7491976],[-73.9694522,40.7493196]],[[-73.9699932,40.7488636],[-73.9694522,40.7493196]],[[-73.9694522,40.7493196],[-73.9693113,40.7494946],[-73.9688832,40.7501056],[-73.9686562,40.7504196],[-73.9684231,40.7507476],[-73.9679832,40.7513586],[-73.9678702,40.7514986]],[[-73.9676833,40.7520426],[-73.9675462,40.7522286],[-73.9673532,40.7524976],[-73.9672892,40.7525906],[-73.9672122,40.7526806]]]}})
        // ... more roads ...
    ];
let allRoads=toscalar(
    ManhattanRoads
    | project road_coordinates=features.geometry.coordinates
    | summarize make_list(road_coordinates)
    | project multiline = bag_pack("type","MultiLineString", "coordinates", list_road_coordinates));
nyc_taxi
| project pickup_longitude, pickup_latitude
| where pickup_longitude != 0 and pickup_latitude != 0
| where geo_distance_point_to_line(pickup_longitude, pickup_latitude, parse_json(allRoads)) > 10000
| take 10
| render scatterchart with (kind=map)
```

**Output**

:::image type="content" source="media/geo-distance-point-to-line-function/lines-folding.png" alt-text="Screenshot of a query map rendering example of lines folded into a multiline. The example is all taxi pickups 10 km away from all Manhattan roads.":::

### Invalid LineString

The following example returns a null result because of the invalid LineString input.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjJLC5JzEtOjc/Mi89NLUktKlawVUhPzY+HSxTkA9XFl+TH52TmpWoY6hjqKKRU5iXmZiZrVCsolVQWpCpZKfkA5YJLgCamK9VqagIAkwcZF1sAAAA=" target="_blank">Run the query</a>

```kusto
print distance_in_meters = geo_distance_point_to_line(1,1, dynamic({ "type":"LineString"}))
```

**Output**

| distance_in_meters |
|--------------------|
|                    |

### Invalid coordinate

The following example returns a null result because of the invalid coordinate input.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAz3MPQrDMAxA4asITQloyM8W6A26dTTGGFsEQSMbW0sovXs9df4erzZRgyzdoiYOouFi49bhASeX8IdaRheshLcoT%2FuyEOwE%2BdZ4SZo%2BgHZXxgOfg182picSplJaFo3GHQ%2FnVlo9uY0277%2Fz%2FAN%2FadA9egAAAA%3D%3D" target="_blank">Run the query</a>

```kusto
print distance_in_meters = geo_distance_point_to_line(300, 3, dynamic({ "type":"LineString","coordinates":[[1,1],[2,2]]}))
```

**Output**

| distance_in_meters |
|--------------------|
|                    |
