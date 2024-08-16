---
title:  isnull()
description: Learn how to use the isnull() function to check if the argument value is null.
ms.reviewer: alexans
ms.topic: reference
ms.date: 05/15/2024
---
# isnull()

Evaluates an expression and returns a Boolean result indicating whether the value is null.

> [!NOTE]
> String values can't be null. Use [isempty](./isempty-function.md) to determine if a value of type `string` is empty or not.

## Syntax

`isnull(`*Expr*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*Expr*|scalar| :heavy_check_mark:| The expression to evaluate whether the value is null. The expression can be any scalar value other than strings, arrays, or objects that always return `false`. For more information, see [The dynamic data type](scalar-data-types/dynamic.md).|

## Returns

Returns `true` if the value is null and `false` otherwise. Empty strings, arrays, property bags, and objects always return `false`.

The following table lists return values for different expressions (*x*):

|x                |`isnull(x)`|
|-----------------|-----------|
|`""`             |`false`    |
|`"x"`            |`false`    |
|`parse_json("")`  |`true`     |
|`parse_json("[]")`|`false`    |
|`parse_json("{}")`|`false`    |

## Example

Find the storm events for which there's no begin location.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKM9ILUpVyCzOK83J0XBKTc%2FM80ks0VRIzEtBFczP0wSqLijKz0pNLlEILkksKgnJzE3VUXDNS4EyCjKL81NSPVOATJDpIAZQXUkqlB9SWQBkwqyAsfLzAAm1x4OQAAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| where isnull(BeginLat) and isnull(BeginLon)
| project StartTime, EndTime, EpisodeId, EventId, State, EventType, BeginLat, BeginLon
```

**Output**

|StartTime|EndTime|EpisodeId| EventId |State| EventType| BeginLat| BeginLon |
|-----|-----|-----|-----|-----|-----|-----|-----|
| 2007-01-01T00:00:00Z |2007-01-01T05:00:00Z |4171 |23358  |WISCONSIN  |Winter Storm  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |1492  |7067  |MINNESOTA  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |1492  |7068  |MINNESOTA  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |1492  |7069  |MINNESOTA  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |1492  |7065  |MINNESOTA  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |1492  |7070  |MINNESOTA  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |1492  |7071  |MINNESOTA  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |1492  |7072  |MINNESOTA  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |2380  |11735  |MINNESOTA  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |1492  |7073  |MINNESOTA  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |2240  |10857  |TEXAS  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |2240  |10858  |TEXAS  |Drought  | | |
| 2007-01-01T00:00:00Z |2007-01-31T23:59:00Z |1492  |7066  |MINNESOTA  |Drought  | | |
| ... |... |... |... |...  |... |... |... |
