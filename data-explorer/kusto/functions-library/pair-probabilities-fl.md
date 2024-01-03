---
title:  pair_probabilities_fl()
description: This article describes the pair_probabilities_fl() user-defined function in Azure Data Explorer.
ms.reviewer: andkar
ms.topic: reference
ms.date: 03/13/2023
---
# pair_probabilities_fl()

Calculate various probabilities and related metrics for a pair of categorical variables.

The function `pair_probabilities_fl()` is a [UDF (user-defined function)](../query/functions/user-defined-functions.md) that calculates the following probabilities and related metrics for a pair of categorical variables, A and B, as follows:

* P(A) is the probability of each value *A=a*
* P(B) is the probability of each value *B=b*
* P(A|B) is the conditional probability of *A=a* given *B=b*
* P(B|A) is the conditional probability of *B=b* given *A=a*
* P(A&#8746;B) is the union probability (*A=a* or *B=b*)
* P(A&#8745;B) is the intersection probability (*A=a* and *B=b*)
* The <a id="lift">**lift metric**</a> is calculated as P(A&#8745;B)/P(A)*P(B). For more information, see [lift metric](https://en.wikipedia.org/wiki/Lift_(data_mining)).
  * A lift near 1 means that the joint probability of two values is similar to what is expected in case that both variables are independent.
  * Lift >> 1 means that values cooccur more often than expected under independence assumption.
  * Lift << 1 means that values are less likely to cooccur than expected under independence assumption.
* The <a id="jaccard">**Jaccard similarity coefficient**</a> is calculated as P(A&#8745;B)/P(A&#8746;B). For more information, see [Jaccard similarity coefficient](https://en.wikipedia.org/wiki/Jaccard_index).
  * A high Jaccard coefficient, close to 1, means that the values tend to occur together.
  * A low Jaccard coefficient, close to 0, means that the values tend to stay apart.

## Syntax

`pair_probabilities_fl(`*A*, *B*, *Scope*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*A*|scalar|&check;|The first categorical variable.|
|*B*|scalar|&check;|The second categorical variable.|
|*Scope*|scalar|&check;|The field that contains the scope, so that the probabilities for *A* and *B* are calculated independently for each scope value.|

## Function definition

You can define the function by either embedding its code as a query-defined function, or creating it as a stored function in your database, as follows:

### [Query-defined](#tab/query-defined)

Define the function using the following [let statement](../query/let-statement.md). No permissions are required.

> [!IMPORTANT]
> A [let statement](../query/let-statement.md) can't run on its own. It must be followed by a [tabular expression statement](../query/tabular-expression-statements.md). To run a working example of `pair_probabilities_fl()`, see [Example](#example).

```kusto
let pair_probabilities_fl = (tbl:(*), A_col:string, B_col:string, scope_col:string)
{
let T = materialize(tbl | extend _A = column_ifexists(A_col, ''), _B = column_ifexists(B_col, ''), _scope = column_ifexists(scope_col, ''));
let countOnScope = T | summarize countAllOnScope = count() by _scope;
let probAB = T | summarize countAB = count() by _A, _B, _scope | join kind = leftouter (countOnScope) on _scope | extend P_AB = todouble(countAB)/countAllOnScope;
let probA  = probAB | summarize countA = sum(countAB), countAllOnScope = max(countAllOnScope) by _A, _scope | extend P_A = todouble(countA)/countAllOnScope;
let probB  = probAB | summarize countB = sum(countAB), countAllOnScope = max(countAllOnScope) by _B, _scope | extend P_B = todouble(countB)/countAllOnScope;
probAB
| join kind = leftouter (probA) on _A, _scope           // probability for each value of A
| join kind = leftouter (probB) on _B, _scope           // probability for each value of B
| extend P_AUB = P_A + P_B - P_AB                       // union probability
       , P_AIB = P_AB/P_B                               // conditional probability of A on B
       , P_BIA = P_AB/P_A                               // conditional probability of B on A
| extend Lift_AB = P_AB/(P_A * P_B)                     // lift metric
       , Jaccard_AB = P_AB/P_AUB                        // Jaccard similarity index
| project _A, _B, _scope, bin(P_A, 0.00001), bin(P_B, 0.00001), bin(P_AB, 0.00001), bin(P_AUB, 0.00001), bin(P_AIB, 0.00001)
, bin(P_BIA, 0.00001), bin(Lift_AB, 0.00001), bin(Jaccard_AB, 0.00001)
| sort by _scope, _A, _B
};
// Write your query to use the function here.
```

### [Stored](#tab/stored)

Define the stored function once using the following [`.create function`](../management/create-function.md). [Database User permissions](../management/access-control/role-based-access-control.md) are required.

> [!IMPORTANT]
> You must run this code to create the function before you can use the function as shown in the [Example](#example).

```kusto
.create-or-alter function with (folder = "Packages\\Stats", docstring = "Calculate probabilities and related metrics for a pair of categorical variables")
pair_probabilities_fl = (tbl:(*), A_col:string, B_col:string, scope_col:string)
{
let T = materialize(tbl | extend _A = column_ifexists(A_col, ''), _B = column_ifexists(B_col, ''), _scope = column_ifexists(scope_col, ''));
let countOnScope = T | summarize countAllOnScope = count() by _scope;
let probAB = T | summarize countAB = count() by _A, _B, _scope | join kind = leftouter (countOnScope) on _scope | extend P_AB = todouble(countAB)/countAllOnScope;
let probA  = probAB | summarize countA = sum(countAB), countAllOnScope = max(countAllOnScope) by _A, _scope | extend P_A = todouble(countA)/countAllOnScope;
let probB  = probAB | summarize countB = sum(countAB), countAllOnScope = max(countAllOnScope) by _B, _scope | extend P_B = todouble(countB)/countAllOnScope;
probAB
| join kind = leftouter (probA) on _A, _scope           // probability for each value of A
| join kind = leftouter (probB) on _B, _scope           // probability for each value of B
| extend P_AUB = P_A + P_B - P_AB                       // union probability
       , P_AIB = P_AB/P_B                               // conditional probability of A on B
       , P_BIA = P_AB/P_A                               // conditional probability of B on A
| extend Lift_AB = P_AB/(P_A * P_B)                     // lift metric
       , Jaccard_AB = P_AB/P_AUB                        // Jaccard similarity index
| project _A, _B, _scope, bin(P_A, 0.00001), bin(P_B, 0.00001), bin(P_AB, 0.00001), bin(P_AUB, 0.00001), bin(P_AIB, 0.00001)
, bin(P_BIA, 0.00001), bin(Lift_AB, 0.00001), bin(Jaccard_AB, 0.00001)
| sort by _scope, _A, _B
};
```

---

## Example

The following example uses the [invoke operator](../query/invoke-operator.md) to run the function.

### [Query-defined](#tab/query-defined)

To use a query-defined function, invoke it after the embedded function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA71WwW7bMAy9+yt4s915S3dt0YO1U4oWC7b2NAyGLCutWlkKbLlItu7fR8lupCZOhiTAnItNPj4+UqIUyQ0sqGiKRaNLWgopjOBtMZdwBYkp5UVylmaQF0zLi9Y0Qj1kQN59tUwveGBJo9+RRNY7ZKip4Y2gUvzilgxegS8NVxUUOXoxpqtVIeZ8KVrTJi5LBnGMGQsyAiAhwOUdAa31OGB66cQw3SnzVX0fYu5QSdvVNW1QWe/MpfR+Z0lSKFdDnp7F9ignO+LJRlxui1jrfIUnLRQ8Cyz+CiSfG91hbyAJlaWglQ8YWjUrHLXRle5KyZMhWzrZkB1IBMQPWrd1og9Na5pspPyaLpMNq69pW962uj3iyD5x5BRxZEzcduvGOtfriXYukvP3q+Nb4J/JBPz4rGCuG+CUPcILlR0HPYd8PzXpqckx1Fa1X4p7W69dkg+u9o/97hl/kLpTAhMHCaLBl9nA6UBGJpZr/4NkTKsKTw+tqHyn2dZv6yMhOZnmnjw/iZxY8ty34UbMTT8zjj6x/Gc2ZbqLXGIE1ByPL+Y1XlPGaFMFTH1/d2scIqAVtZC4q1EeLjdfojSU/MSZ2TgVMiiFsvoyOP90js/n9M1Etk35mO1+zDgNjNGacbqVZujUptlXHtDgrOrG+BMxG2qJ/lxGk4kb74oqxmd4mbTYsYoa/NmpK/VqfVk8iMbfHA5fMEnb9u3u+OH6H1/TmrdxZl9vabNyb+5DV7xRcXYI6psueWOs83TUrWCPlEv0xjNqt4ugfcgRqED9HlSg6+SMB+u6we1Lh1YchQrUn4w6OOP/X8cjdH2xu1+wf7ViA7Zr5++GjbJFPy8jP7Q44kK96Gc+/ocwiXGQ4yy2I2xbEkxvnP4FjoTy7UcKAAA=" target="_blank">Run the query</a>

```kusto
let pair_probabilities_fl = (tbl:(*), A_col:string, B_col:string, scope_col:string)
{
let T = materialize(tbl | extend _A = column_ifexists(A_col, ''), _B = column_ifexists(B_col, ''), _scope = column_ifexists(scope_col, ''));
let countOnScope = T | summarize countAllOnScope = count() by _scope;
let probAB = T | summarize countAB = count() by _A, _B, _scope | join kind = leftouter (countOnScope) on _scope | extend P_AB = todouble(countAB)/countAllOnScope;
let probA  = probAB | summarize countA = sum(countAB), countAllOnScope = max(countAllOnScope) by _A, _scope | extend P_A = todouble(countA)/countAllOnScope;
let probB  = probAB | summarize countB = sum(countAB), countAllOnScope = max(countAllOnScope) by _B, _scope | extend P_B = todouble(countB)/countAllOnScope;
probAB
| join kind = leftouter (probA) on _A, _scope           // probability for each value of A
| join kind = leftouter (probB) on _B, _scope           // probability for each value of B
| extend P_AUB = P_A + P_B - P_AB                       // union probability
       , P_AIB = P_AB/P_B                               // conditional probability of A on B
       , P_BIA = P_AB/P_A                               // conditional probability of B on A
| extend Lift_AB = P_AB/(P_A * P_B)                     // lift metric
       , Jaccard_AB = P_AB/P_AUB                        // Jaccard similarity index
| project _A, _B, _scope, bin(P_A, 0.00001), bin(P_B, 0.00001), bin(P_AB, 0.00001), bin(P_AUB, 0.00001), bin(P_AIB, 0.00001)
, bin(P_BIA, 0.00001), bin(Lift_AB, 0.00001), bin(Jaccard_AB, 0.00001)
| sort by _scope, _A, _B
};
//
let dancePairs = datatable(boy:string, girl:string, dance_class:string)[
    'James',   'Mary',      'Modern',
    'James',   'Mary',      'Modern',
    'Robert',  'Mary',      'Modern',
    'Robert',  'Mary',      'Modern',
    'Michael', 'Patricia',  'Modern',
    'Michael', 'Patricia',  'Modern',
    'James',   'Patricia',  'Modern',
    'Robert',  'Patricia',  'Modern',
    'Michael', 'Patricia',  'Modern',
    'Michael', 'Patricia',  'Modern',
    'James',   'Linda',     'Modern',
    'James',   'Linda',     'Modern',
    'Robert',  'Linda',     'Modern',
    'Robert',  'Linda',     'Modern',
    'James',   'Linda',     'Modern',
    'Robert',  'Mary',      'Modern',
    'Michael', 'Patricia',  'Modern',
    'Michael', 'Patricia',  'Modern',
    'James',   'Linda',     'Modern',
    'Robert',  'Mary',      'Classic',
    'Robert',  'Linda',     'Classic',
    'James',   'Mary',      'Classic',
    'James',   'Linda',     'Classic'
];
dancePairs
| invoke pair_probabilities_fl('boy','girl', 'dance_class')
```

### [Stored](#tab/stored)

> [!IMPORTANT]
> For this example to run successfully, you must first run the [Function definition](#function-definition) code to store the function.

```kusto
let dancePairs = datatable(boy:string, girl:string, dance_class:string)[
    'James',   'Mary',      'Modern',
    'James',   'Mary',      'Modern',
    'Robert',  'Mary',      'Modern',
    'Robert',  'Mary',      'Modern',
    'Michael', 'Patricia',  'Modern',
    'Michael', 'Patricia',  'Modern',
    'James',   'Patricia',  'Modern',
    'Robert',  'Patricia',  'Modern',
    'Michael', 'Patricia',  'Modern',
    'Michael', 'Patricia',  'Modern',
    'James',   'Linda',     'Modern',
    'James',   'Linda',     'Modern',
    'Robert',  'Linda',     'Modern',
    'Robert',  'Linda',     'Modern',
    'James',   'Linda',     'Modern',
    'Robert',  'Mary',      'Modern',
    'Michael', 'Patricia',  'Modern',
    'Michael', 'Patricia',  'Modern',
    'James',   'Linda',     'Modern',
    'Robert',  'Mary',      'Classic',
    'Robert',  'Linda',     'Classic',
    'James',   'Mary',      'Classic',
    'James',   'Linda',     'Classic'
];
dancePairs
| invoke pair_probabilities_fl('boy','girl', 'dance_class')
```

---

**Output**

Let's look at list of pairs of people dancing at two dance classes supposedly at random to find out if anything looks anomalous (meaning, not random). We'll start by looking at each class by itself.

The Michael-Patricia pair has a [**lift metric**](#lift) of 2.375, which is significantly above 1. This value means that they're seen together much more often that what would be expected if this pairing was random. Their [**Jaccard coefficient**](#jaccard) is 0.75, which is close to 1. When the pair dances, they prefer to dance together.

| A | B | scope | P_A | P_B | P_AB | P_AUB | P_AIB | P_BIA | Lift_AB | Jaccard_AB |
|---|---|---|---|---|---|---|---|---|---|---|
| Robert | Patricia | Modern | 0.31578 | 0.42105 | 0.05263 | 0.68421 | 0.12499 | 0.16666 | 0.39583 | 0.07692 |
| Robert | Mary | Modern | 0.31578 | 0.26315 | 0.15789 | 0.42105 | 0.59999 | 0.49999 | 1.89999 | 0.37499 |
| Robert | Linda | Modern | 0.31578 | 0.31578 | 0.10526 | 0.52631 | 0.33333 | 0.33333 | 1.05555 | 0.2 |
| Michael | Patricia | Modern | 0.31578 | 0.42105 | 0.31578 | 0.42105 | 0.75 | 0.99999 | 2.375 | 0.75 |
| James | Patricia | Modern | 0.36842 | 0.42105 | 0.05263 | 0.73684 | 0.12499 | 0.14285 | 0.33928 | 0.07142 |
| James | Mary | Modern | 0.36842 | 0.26315 | 0.10526 | 0.52631 | 0.4 | 0.28571 | 1.08571 | 0.2 |
| James | Linda | Modern | 0.36842 | 0.31578 | 0.21052 | 0.47368 | 0.66666 | 0.57142 | 1.80952 | 0.44444 |
| Robert | Mary | Classic | 0.49999 | 0.49999 | 0.24999 | 0.75 | 0.49999 | 0.49999 | 0.99999 | 0.33333 |
| Robert | Linda | Classic | 0.49999 | 0.49999 | 0.24999 | 0.75 | 0.49999 | 0.49999 | 0.99999 | 0.33333 |
| James | Mary | Classic | 0.49999 | 0.49999 | 0.24999 | 0.75 | 0.49999 | 0.49999 | 0.99999 | 0.33333 |
| James | Linda | Classic | 0.49999 | 0.49999 | 0.24999 | 0.75 | 0.49999 | 0.49999 | 0.99999 | 0.33333 |
