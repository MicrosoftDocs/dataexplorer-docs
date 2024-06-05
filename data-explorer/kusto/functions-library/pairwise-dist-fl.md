---
title:  pairwise_dist_fl()
description: Learn how to use the pairwise_dist_fl() function to calculate the multivariate distance between data points in the same partition.
ms.reviewer: andkar
ms.topic: reference
ms.date: 03/13/2023
---
# pairwise_dist_fl()

Calculate pairwise distances between entities based on multiple nominal and numerical variables.

The function `pairwise_dist_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that calculates the multivariate distance between data points belonging to the same partition, taking into account nominal and numerical variables.

- All string fields, besides entity and partition names, are considered nominal variables. The distance is equal to 1 if the values are different, and 0 if they're the same.
- All numerical fields are considered numerical variables. They're normalized by transforming to z-scores and the distance is calculated as the absolute value of the difference.
The total multivariate distance between data points is calculated as the average of the distances between variables.

A distance close to zero means that the entities are similar and a distance above 1 means they're different. Similarly, an entity with an average distance close to or above one indicates that it's different from many other entities in the partition, indicating a potential outlier.

The output of the function is pairwise distances between entities under the same partition. It can be used as-is to look for similar or different pairs. such as entities with minimal distances share many common features. It can also be easily transformed to a distance matrix (see the usage example) or used as input for clustering or outlier detection algorithms.

## Syntax

`pairwise_dist_fl(`*entity*, *partition*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *entity* | `string` |  :heavy_check_mark: | The name of the input table column containing the names or IDs of the entities for which the distances will be calculated. |
| *partition* | `string` |  :heavy_check_mark: | The name of the input table column containing the partition or scope, so that the distances are calculated for all pairs of entities under the same partition. |

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `pairwise_dist_fl()`, see [Example](#example).

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
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

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

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=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" target="_blank">Run the query</a>

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

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

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

**Output**

| entity1 | Andy | Betsy | Cindy | Dan | Elmie | Franny | Godzilla | Hannie | ... |
|---|---|---|---|---|---|---|---|---|---|
| Andy | | 0.354 | 0.4125 | 0.1887 | 0.4843 | 0.3702 | 1.2087 | 0.6265 | ... |
| Betsy | 0.354 |  | 0.416 | 0.4708 | 0.6307 | 0.0161 | 1.2051 | 0.4872 | ... |
| Cindy | 0.4125 | 0.416 |  | 0.6012 | 0.3575 | 0.3998 | 1.4783 | 0.214 | ... |
| Dan | 0.1887 | 0.4708 | 0.6012 |  | 0.673 | 0.487 | 1.0199 | 0.8152 | ... |
| Elmie | 0.4843 | 0.6307 | 0.3575 | 0.673 |  | 0.6145 | 1.5502 | 0.1565 | ... |
| Franny | 0.3702 | 0.0161 | 0.3998 | 0.487 | 0.6145 |  | 1.2213 | 0.471 | ... |
| Godzilla | 1.2087 | 1.2051 | 1.4783 | 1.0199 | 1.5502 | 1.2213 |  | 1.5495 | ... |
| Hannie | 0.6265 | 0.4872 | 0.214 | 0.8152 | 0.1565 | 0.471 | 1.5495 |  | ... |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

Looking at entities of two different types, we would like to calculate distance between entities belonging to the same type, by taking into account both nominal variables (such as gender or preferred accessory) and numerical variables (such as the number of limbs, height, and weight). The numerical variables are on different scales and must be centralized and scaled, which is done automatically. The output is pairs of entities under the same partition with calculated multivariate distance. It can be analyzed directly, visualized as a distance matrix or scatterplot, or used as input data for outlier detection algorithm by calculating mean distance per entity, with entities with high values indicating global outliers.
For example, when adding an optional visualization using a distance matrix, you get a table as shown in the sample. From the sample, you can see that:

 * Some pairs of entities (Betsy and Franny) have a low distance value (close to 0) indicating they're similar.
 * Some pairs of entities (Godzilla and Elmie) have a high distance value (1 or above) indicating they're different.

The output can further be used to calculate the average distance per entity. A high average distance might indicate global outliers. For example, we can see that on average Godzilla has a high distance from the others indicating that it's a probable global outlier.
