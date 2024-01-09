---
title:  dayofweek()
description: Learn how to use the dayofweek() function to return the `timespan` since the preceding Sunday.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/09/2024
---
# dayofweek()

Returns the number of days since the preceding Sunday, as a `timespan`.

To convert `timespan` to `int`, see [Convert timespan to integer](#convert-timespan-to-integer).

## Syntax

`dayofweek(`*date*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | datetime | &check; | The datetime for which to determine the day of week.|

## Returns

The `timespan` since midnight at the beginning of the preceding Sunday, rounded down to an integer number of days.

## Examples

The following example returns 0, indicating that the specified datetime is a Sunday.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/yaeltestcluster.eastus/databases/DatabaseNew?query=H4sIAAAAAAAAAysoyswr4eUKycxNLS5IzFOwVUhJrMxPK09NzdZISSxJLQFKaBhampjrGhrqGhsoGBpYGQCRqaYmAHvwNxk6AAAA" target="_blank">Run the query</a>

```kusto
print
Timespan = dayofweek(datetime(1947-11-30 10:00:05))
```

**Output**

|Timespan|
|--|
|00:00:00|

The following example returns 1, indicating that the specified datetime is a Monday.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/yaeltestcluster.eastus/databases/DatabaseNew?query=H4sIAAAAAAAAAysoyswr4eUKycxNLS5IzFOwVUhJrMxPK09NzdZISSxJLQFKaBhamhvoGpjqGhpqagIA76Tx5DEAAAA%3D" target="_blank">Run the query</a>

```kusto
print
Timespan = dayofweek(datetime(1970-05-11))
```

**Output**

|Timespan|
|--|
|1.00:00:00|

### Convert timespan to integer

The following example returns the number of days both as a `timespan` and as data type `int`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/yaeltestcluster.eastus/databases/DatabaseNew?query=H4sIAAAAAAAAA8tJLVFIyS%2B3TUmszE8rT03N1khJLEktycxN1TC0NDfQNdU1NNLUtOblKijKzCvh5QoByhQXJOYp2IK06fByeeaVANkl%2BUBZDaCIvmGKJgBG7I0VVAAAAA%3D%3D" target="_blank">Run the query</a>

```kusto
let dow=dayofweek(datetime(1970-5-12));
print
Timespan = dow,
Integer = toint(dow/1d)
```

**Output**

|Timespan|Integer|
|--|--|
|2.00:00:00|2|

## Related content

[The timespan data type](scalar-data-types/timespan.md)
