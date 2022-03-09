---
title: pairwise_dist_fl() - Azure Data Explorer
description: This article describes the pairwise_dist_fl() user-defined function in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: andkar
ms.service: data-explorer
ms.topic: reference
ms.date: 02/28/2022
---
# pairwise_dist_fl()

Calculate distances between pairs of entites based on multiple nominal and numerical variables.

The function `pairwise_dist_fl()`calculates multivariate distance between datapoints belonging to the same partition, taking into account nominal and numerical variables. 
- All string fields are considered nominal variables; the distance is equal to 1 if the values are different, and 0 if they are the same.
- All numerical fields are considered numerical variables. They are normalized by transforming to z-scores and the distance is calculated as absolute value of the difference.
The total multivariate distance between datapoints is calculated as the sum of distances between variables.

[TBD] Suggested usage XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`pairwise_dist_fl(entity, partition)`
  
## Arguments

* entity: column that contains the names or IDs of the entities for which the distances will be calculated
* partition: column that contains the partition/scope, so the distances will be calculated for all pairs of entities under the same parition
## Usage

`pairwise_dist_fl` is a user-defined function. You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using a [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let pairwise_dist_fl = (tbl:(*), id_col:string, partition_col:string)
{
    let generic_dist = (value1:dynamic, value2:dynamic) 
    {
        // Calculates the distance between two values; treats all strings as nominal values and numbers as numerical,
        // can be extended to other data types or tweaked by adding weights or changing formulas.
            iff(gettype(value1[0]) == "string", todouble(tostring(value1[0]) != tostring(value2[0])), abs(todouble(value1[0]) - todouble(value2[0])))
    };
    let T = (tbl | extend _entity = column_ifexists(id_col, ''), _partition = column_ifexists(partition_col, '') | project-reorder _entity, _partition);
    let sum_data = (
        // Calculates summary statistics to be used for normalization.
        T
        | project-reorder _entity
        | project _partition, p = pack_array(*)
        | mv-expand with_itemindex=idx p
        | summarize count(), avg(todouble(p)), stdev(todouble(p)) by _partition, idx
        | sort by _partition, idx asc
        | summarize make_list(avg_p), make_list(stdev_p) by _partition
    );
    let normalized_data = (
        // Performs normalization on numerical variables by substrcting mean and scaling by standard deviation. Other normalization techniques can be used
        // by adding metrics to previous function and using here.
        T
        | project _partition, p = pack_array(*)
        | join kind = leftouter (sum_data) on _partition
        | mv-apply p, list_avg_p, list_stdev_p on (
            extend normalized = iff((not(isnan(todouble(list_avg_p))) and (list_stdev_p > 0)), pack_array((todouble(p) - todouble(list_avg_p))/todouble(list_stdev_p)), p)
            | summarize a = make_list(normalized) by _partition
        )
        | project _partition, a
    );
    let dist_data = (
        // Calculates distances of included variables and sums them up to get a multivariate distance between all entities under the same partition.
        normalized_data
        | join kind = inner (normalized_data) on _partition
        | project entity = tostring(a[0]), entity1 = tostring(a1[0]), a = array_slice(a, 1, -1), a1 = array_slice(a1, 1, -1), _partition
        | mv-apply a, a1 on 
        (
            project d = generic_dist(pack_array(a), pack_array(a1))
            | summarize d = make_list(d)
        )
        | extend dist = floor(array_sum(d)-1.0, 0.0001) // -1 cancels the artifact distance calculated between entity names appearing in the bag
        | project-away d
        | where entity != entity1
        | sort by _partition asc, entity asc, dist asc
    );
    dist_data
};
//
let raw_data = datatable(name:string, gender: string, height:int, weight:int, limbs:int, accessory:string, type:string)[
    'Andy',     'M',    160,    80,     4,  'Hat',      'Person',
    'Betsy',    'F',    170,    70,     4,  'Bag',      'Person',
    'Cindy',    'F',    130,    30,     4,  'Hat',      'Person',
    'Dan',      'M',    190,    105,    4,  'Hat',      'Person',
    'Elmie',    'M',    110,    30,     4,  'Toy',      'Person',
    'Fanny',    'F',    170,    65,     4,  'Bag',      'Person',
    'Godzilla', '?',    260,    210,    5,  'Tail',     'Person',
    'Hannie',   'F',    112,    28,     4,  'Toy',      'Person',
    'Ivie',     'F',    105,    20,     4,  'Toy',      'Person',
    'Johnnie',  'M',    107,    21,     4,  'Toy',      'Person',
    'Kyle',     'M',    175,    76,     4,  'Hat',      'Person',
    'Laura',    'F',    180,    70,     4,  'Bag',      'Person',
    'Mary',     'F',    160,    60,     4,  'Bag',      'Person',
    'Noah',     'M',    178,    90,     4,  'Hat',      'Person',
    'Odelia',   'F',    186,    76,     4,  'Bag',      'Person',
    'Paul',     'M',    158,    69,     4,  'Bag',      'Person',
    'Qui',      'F',    168,    62,     4,  'Bag',      'Person',
    'Ronnie',   'M',    108,    26,     4,  'Toy',      'Person',
    'Sonic',    'F',    52,     20,     6,  'Tail',     'Pet',
    'Tweety',   'F',    52,     20,     6,  'Tail',     'Pet' ,
    'Ulfie',    'M',    39,     29,     4,  'Wings',    'Pet',
    'Vinnie',   'F',    53,     22,     1,  'Tail',     'Pet',
    'Woody',    'F',    51,     21,     4,  'Tail',     'Pet',
    'Xander',   'M',    50,     24,     4,  'Tail',     'Pet'
];
raw_data
| invoke pairwise_dist_fl('name', 'type')
```

# [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Calculate distances between pairs of entites based on multiple nominal and numerical variables")
let pairwise_dist_fl = (tbl:(*), id_col:string, partition_col:string)
{
    let generic_dist = (value1:dynamic, value2:dynamic) 
    {
        // Calculates the distance between two values; treats all strings as nominal values and numbers as numerical,
        // can be extended to other data types or tweaked by adding weights or changing formulas.
            iff(gettype(value1[0]) == "string", todouble(tostring(value1[0]) != tostring(value2[0])), abs(todouble(value1[0]) - todouble(value2[0])))
    };
    let T = (tbl | extend _entity = column_ifexists(id_col, ''), _partition = column_ifexists(partition_col, '') | project-reorder _entity, _partition);
    let sum_data = (
        // Calculates summary statistics to be used for normalization.
        T
        | project-reorder _entity
        | project _partition, p = pack_array(*)
        | mv-expand with_itemindex=idx p
        | summarize count(), avg(todouble(p)), stdev(todouble(p)) by _partition, idx
        | sort by _partition, idx asc
        | summarize make_list(avg_p), make_list(stdev_p) by _partition
    );
    let normalized_data = (
        // Performs normalization on numerical variables by substrcting mean and scaling by standard deviation. Other normalization techniques can be used
        // by adding metrics to previous function and using here.
        T
        | project _partition, p = pack_array(*)
        | join kind = leftouter (sum_data) on _partition
        | mv-apply p, list_avg_p, list_stdev_p on (
            extend normalized = iff((not(isnan(todouble(list_avg_p))) and (list_stdev_p > 0)), pack_array((todouble(p) - todouble(list_avg_p))/todouble(list_stdev_p)), p)
            | summarize a = make_list(normalized) by _partition
        )
        | project _partition, a
    );
    let dist_data = (
        // Calculates distances of included variables and sums them up to get a multivariate distance between all entities under the same partition.
        normalized_data
        | join kind = inner (normalized_data) on _partition
        | project entity = tostring(a[0]), entity1 = tostring(a1[0]), a = array_slice(a, 1, -1), a1 = array_slice(a1, 1, -1), _partition
        | mv-apply a, a1 on 
        (
            project d = generic_dist(pack_array(a), pack_array(a1))
            | summarize d = make_list(d)
        )
        | extend dist = floor(array_sum(d)-1.0, 0.0001) // -1 cancels the artifact distance calculated between entity names appearing in the bag
        | project-away d
        | where entity != entity1
        | sort by _partition asc, entity asc, dist asc
    );
    dist_data
};
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let raw_data = datatable(name:string, gender: string, height:int, weight:int, limbs:int, accessory:string, type:string)[
    'Andy',     'M',    160,    80,     4,  'Hat',      'Person',
    'Betsy',    'F',    170,    70,     4,  'Bag',      'Person',
    'Cindy',    'F',    130,    30,     4,  'Hat',      'Person',
    'Dan',      'M',    190,    105,    4,  'Hat',      'Person',
    'Elmie',    'M',    110,    30,     4,  'Toy',      'Person',
    'Fanny',    'F',    170,    65,     4,  'Bag',      'Person',
    'Godzilla', '?',    260,    210,    5,  'Tail',     'Person',
    'Hannie',   'F',    112,    28,     4,  'Toy',      'Person',
    'Ivie',     'F',    105,    20,     4,  'Toy',      'Person',
    'Johnnie',  'M',    107,    21,     4,  'Toy',      'Person',
    'Kyle',     'M',    175,    76,     4,  'Hat',      'Person',
    'Laura',    'F',    180,    70,     4,  'Bag',      'Person',
    'Mary',     'F',    160,    60,     4,  'Bag',      'Person',
    'Noah',     'M',    178,    90,     4,  'Hat',      'Person',
    'Odelia',   'F',    186,    76,     4,  'Bag',      'Person',
    'Paul',     'M',    158,    69,     4,  'Bag',      'Person',
    'Qui',      'F',    168,    62,     4,  'Bag',      'Person',
    'Ronnie',   'M',    108,    26,     4,  'Toy',      'Person',
    'Sonic',    'F',    52,     20,     6,  'Tail',     'Pet',
    'Tweety',   'F',    52,     20,     6,  'Tail',     'Pet' ,
    'Ulfie',    'M',    39,     29,     4,  'Wings',    'Pet',
    'Vinnie',   'F',    53,     22,     1,  'Tail',     'Pet',
    'Woody',    'F',    51,     21,     4,  'Tail',     'Pet',
    'Xander',   'M',    50,     24,     4,  'Tail',     'Pet'
];
raw_data
| invoke pairwise_dist_fl('name', 'type')
| where _partition == 'Person' | sort by entity asc, entity1 asc
| evaluate pivot (entity, max(dist), entity1) | sort by entity1 asc
```
```kusto
| entity1  | Andy   | Betsy  | Cindy   | Dan    | Elmie   | Fanny  | Godzilla | Hannie  |
|----------|--------|--------|---------|--------|---------|--------|----------|---------| ...
| Andy     |        | 2.4781 | 2.8875  | 1.321  | 3.3905  | 2.5914 | 8.461    | 4.3856  |
| Betsy    | 2.4781 |        | 2.9124  | 3.2961 | 4.4154  | 0.1133 | 8.4361   | 3.4104  |
| Cindy    | 2.8875 | 2.9124 |         | 4.2086 | 2.5029  | 2.7991 | 10.3486  | 1.498   |
| Dan      | 1.321  | 3.2961 | 4.2086  |        | 4.7116  | 3.4094 | 7.1399   | 5.7066  |
| Elmie    | 3.3905 | 4.4154 | 2.5029  | 4.7116 |         | 4.3021 | 10.8516  | 1.0956  |
| Fanny    | 2.5914 | 0.1133 | 2.7991  | 3.4094 | 4.3021  |        | 8.5494   | 3.2971  |
| Godzilla | 8.461  | 8.4361 | 10.3486 | 7.1399 | 10.8516 | 8.5494 |          | 10.8466 |
| Hannie   | 4.3856 | 3.4104 | 1.498   | 5.7066 | 1.0956  | 3.2971 | 10.8466  |         |
|----------|--------|--------|---------|--------|---------|--------|----------|---------| ...
.
.
.
```
---

Looking at entities of two different types, we would like to calculate distance between entities belonging to the same type, by taking into account both nominal variables (such as gender or preferred accessory) and numerical variables (such as number of limbs, height and weight). The numerical variables are on different scales and obviously need to be centralized and scaled - which is done automatically. The output is pairs of entities under the same partition with calculated multivariate distance. This could be analyzed directly, visualized as distance matrix or scatterplot, or used as input data for outlier detection (most straightforwardly, by calculating mean distance per entity, with entities with high values indicating global outliers).
For example, when adding optional visualization using distance matrix as suggested above, we receive the table as in the sample shown below. From this sample we can learn that some pairs of entities have low distance and thus are similar (e.g. Betsy and Fanny) and some have high distance (e.g. Godzilla and Elmie). This output can further be used to calculate average distance per entity. High average distance might indicate global outliers. For example, we can see that Godzilla has high distance from others on the average, thus being a probable global outlier.


---
