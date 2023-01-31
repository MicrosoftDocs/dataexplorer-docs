---
title: pairwise_dist_fl() - Azure Data Explorer
description: This article describes the pairwise_dist_fl() user-defined function in Azure Data Explorer.
ms.reviewer: andkar
ms.topic: reference
ms.date: 03/03/2022
---
# pairwise_dist_fl()

Calculate pairwise distances between entities based on multiple nominal and numerical variables.

The function `pairwise_dist_fl()` calculates the multivariate distance between data points belonging to the same partition, taking into account nominal and numerical variables.

- All string fields, besides entity and partition names, are considered nominal variables. The distance is equal to 1 if the values are different, and 0 if they're the same.
- All numerical fields are considered numerical variables. They're normalized by transforming to z-scores and the distance is calculated as the absolute value of the difference.
The total multivariate distance between data points is calculated as the average of the distances between variables.

A distance close to zero means that the entities are similar and a distance above 1 means they're different. Similarly, an entity with an average distance close to or above one indicates that it's different from many other entities in the partition, indicating a potential outlier.

The output of the function is pairwise distances between entities under the same partition. It can be used as-is to look for similar or different pairs. such as entities with minimal distances share many common features. It can also be easily transformed to a distance matrix (see the usage example) or used as input for clustering or outlier detection algorithms.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`pairwise_dist_fl(entity, partition)`
  
## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *entity* | string | &check; | The name of the input table column containing the names or IDs of the entities for which the distances will be calculated. |
| *partition* | string | &check; | The name of the input table column containing the partition or scope, so that the distances are calculated for all pairs of entities under the same partition. |

## Usage

`pairwise_dist_fl` is a user-defined function. You can either embed its code as a query-defined function or you can create a stored function in your database. See the following tabs for more examples.

# [Query-defined](#tab/query-defined)

To use a query-defined function, embed the code using the [let statement](../query/letstatement.md). No permissions are required.

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
        | extend dist = bin((1.0*array_sum(d)-1.0)/array_length(d), 0.0001) // -1 cancels the artifact distance calculated between entity names appearing in the bag and normalizes by number of features        
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
    'Franny',   'F',    170,    65,     4,  'Bag',      'Person',
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
    'Waldo',    'F',    51,     21,     4,  'Tail',     'Pet',
    'Xander',   'M',    50,     24,     4,  'Tail',     'Pet'
];
raw_data
| invoke pairwise_dist_fl('name', 'type')
| where _partition == 'Person' | sort by entity asc, entity1 asc
| evaluate pivot (entity, max(dist), entity1) | sort by entity1 asc
```

# [Stored](#tab/stored)

To store the function, see [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

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
        | extend dist = bin((1.0*array_sum(d)-1.0)/array_length(d), 0.0001) // -1 cancels the artifact distance calculated between entity names appearing in the bag and normalizes by number of features        
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
    'Franny',   'F',    170,    65,     4,  'Bag',      'Person',
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


---

## Analysis

```kusto
| entity1  | Andy   | Betsy  | Cindy  | Dan    | Elmie  | Franny | Godzilla | Hannie |
|----------|--------|--------|--------|--------|--------|--------|----------|--------|...
| Andy     |        | 0.354  | 0.4125 | 0.1887 | 0.4843 | 0.3702 | 1.2087   | 0.6265 |
| Betsy    | 0.354  |        | 0.416  | 0.4708 | 0.6307 | 0.0161 | 1.2051   | 0.4872 |
| Cindy    | 0.4125 | 0.416  |        | 0.6012 | 0.3575 | 0.3998 | 1.4783   | 0.214  |
| Dan      | 0.1887 | 0.4708 | 0.6012 |        | 0.673  | 0.487  | 1.0199   | 0.8152 |
| Elmie    | 0.4843 | 0.6307 | 0.3575 | 0.673  |        | 0.6145 | 1.5502   | 0.1565 |
| Franny   | 0.3702 | 0.0161 | 0.3998 | 0.487  | 0.6145 |        | 1.2213   | 0.471  |
| Godzilla | 1.2087 | 1.2051 | 1.4783 | 1.0199 | 1.5502 | 1.2213 |          | 1.5495 |
| Hannie   | 0.6265 | 0.4872 | 0.214  | 0.8152 | 0.1565 | 0.471  | 1.5495   |        |...
.
.
.
```

Looking at entities of two different types, we would like to calculate distance between entities belonging to the same type, by taking into account both nominal variables (such as gender or preferred accessory) and numerical variables (such as the number of limbs, height, and weight). The numerical variables are on different scales and must be centralized and scaled, which is done automatically. The output is pairs of entities under the same partition with calculated multivariate distance. It can be analyzed directly, visualized as a distance matrix or scatterplot, or used as input data for outlier detection algorithm by calculating mean distance per entity, with entities with high values indicating global outliers.
For example, when adding an optional visualization using a distance matrix, you get a table as shown in the sample. From the sample, you can see that:

 * Some pairs of entities (Betsy and Franny) have a low distance value (close to 0) indicating they're similar.
 * Some pairs of entities (Godzilla and Elmie) have a high distance value (1 or above) indicating they're different.

The output can further be used to calculate the average distance per entity. A high average distance might indicate global outliers. For example, we can see that on average Godzilla has a high distance from the others indicating that it's a probable global outlier.

