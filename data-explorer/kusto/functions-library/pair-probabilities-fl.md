---
title: pair_probabilities_fl() - Azure Data Explorer
description: This article describes the pair_probabilities_fl() user-defined function in Azure Data Explorer.
author: orspod
ms.author: orspodek
ms.reviewer: andkar
ms.service: data-explorer
ms.topic: reference
ms.date: 08/10/2021
---
# pair_probabilities_fl()

Calculate various probabilities and related metrics for a pair of categorical variables.

The function `pair_probabilities_fl()`calculates the following probabilities and related metrics for a pair of categorical variables, A and B, as follows:
- P(A) is the probability of each value *A=a*
- P(B) is the probability of each value *B=b*
- P(A|B) is the conditional probability of *A=a* given *B=b*
- P(B|A) is the conditional probability of *B=b* given *A=a*
- P(A&#8746;B) is the union probability (*A=a* or *B=b*)
- P(A&#8745;B) is the intersection probability (*A=a* and *B=b*)
- Lift metric is calculated as P(A&#8745;B)/P(A)*P(B). Lift near 1 means that the joint probability of two values is similar to what is expected in case that both variables are independent. Lift >> 1 means that values co-occur more often than expected under independence assumption. Lift << 1 means that values are less likely to co-occur than expected under independence assumption.
- Jaccard similarity coefficient is calculated as P(A&#8745;B)/P(A&#8746;B). High coefficient (close to 1) means that the values tend to occur together, whether low coefficient (close to 0) means that the values tend to stay apart.

> [!NOTE]
> This function is a [UDF (user-defined function)](../query/functions/user-defined-functions.md). For more information, see [usage](#usage).

## Syntax

`pair_probabilities_fl()`
  
## Arguments

* None

## Usage

`pair_probabilities_fl` is a user-defined function. You can either embed its code in your query, or install it in your database. There are two usage options: ad hoc and persistent usage. See the below tabs for examples.

# [Ad hoc](#tab/adhoc)

For ad hoc usage, embed its code using a [let statement](../query/letstatement.md). No permission is required.

<!-- csl: https://help.kusto.windows.net/Samples -->
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
| project _A, _B, _scope, floor(P_A, 0.00001), floor(P_B, 0.00001), floor(P_AB, 0.00001), floor(P_AUB, 0.00001), floor(P_AIB, 0.00001)
, floor(P_BIA, 0.00001), floor(Lift_AB, 0.00001), floor(Jaccard_AB, 0.00001)
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

# [Persistent](#tab/persistent)

For persistent usage, use [`.create function`](../management/create-function.md). Creating a function requires [database user permission](../management/access-control/role-based-authorization.md).

### One-time installation

<!-- csl: https://help.kusto.windows.net/Samples -->
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
| project _A, _B, _scope, floor(P_A, 0.00001), floor(P_B, 0.00001), floor(P_AB, 0.00001), floor(P_AUB, 0.00001), floor(P_AIB, 0.00001)
, floor(P_BIA, 0.00001), floor(Lift_AB, 0.00001), floor(Jaccard_AB, 0.00001)
| sort by _scope, _A, _B
};
```

### Usage

<!-- csl: https://help.kusto.windows.net/Samples -->
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

Looking at list of pairs of people dancing at two dance classes supposedly at random, we would like to find out if anything looks anomalous (e.g. not random) while looking at each class by itself.
We can see that the pair Michael-Patricia have a lift metric of 2.375, which is significantly above 1, which means that they are seen together much more often that what would be expected if this pairing was random. Their Jaccard coefficient is 0.75, which is close to 1, which also means that when they dance, they prefer to dance together.


```kusto
| A       	| B        	| scope   	| P_A     	| P_B     	| P_AB    	| P_AUB   	| P_AIB   	| P_BIA   	| Lift_AB 	| Jaccard_AB 	|
|---------	|----------	|---------	|---------	|---------	|---------	|---------	|---------	|---------	|---------	|------------	|
| Robert  	| Patricia 	| Modern  	| 0.31578 	| 0.42105 	| 0.05263 	| 0.68421 	| 0.12499 	| 0.16666 	| 0.39583 	| 0.07692    	|
| Robert  	| Mary     	| Modern  	| 0.31578 	| 0.26315 	| 0.15789 	| 0.42105 	| 0.59999 	| 0.49999 	| 1.89999 	| 0.37499    	|
| Robert  	| Linda    	| Modern  	| 0.31578 	| 0.31578 	| 0.10526 	| 0.52631 	| 0.33333 	| 0.33333 	| 1.05555 	| 0.2        	|
| Michael 	| Patricia 	| Modern  	| 0.31578 	| 0.42105 	| 0.31578 	| 0.42105 	| 0.75    	| 0.99999 	| 2.375   	| 0.75       	|
| James   	| Patricia 	| Modern  	| 0.36842 	| 0.42105 	| 0.05263 	| 0.73684 	| 0.12499 	| 0.14285 	| 0.33928 	| 0.07142    	|
| James   	| Mary     	| Modern  	| 0.36842 	| 0.26315 	| 0.10526 	| 0.52631 	| 0.4     	| 0.28571 	| 1.08571 	| 0.2        	|
| James   	| Linda    	| Modern  	| 0.36842 	| 0.31578 	| 0.21052 	| 0.47368 	| 0.66666 	| 0.57142 	| 1.80952 	| 0.44444    	|
| Robert  	| Mary     	| Classic 	| 0.49999 	| 0.49999 	| 0.24999 	| 0.75    	| 0.49999 	| 0.49999 	| 0.99999 	| 0.33333    	|
| Robert  	| Linda    	| Classic 	| 0.49999 	| 0.49999 	| 0.24999 	| 0.75    	| 0.49999 	| 0.49999 	| 0.99999 	| 0.33333    	|
| James   	| Mary     	| Classic 	| 0.49999 	| 0.49999 	| 0.24999 	| 0.75    	| 0.49999 	| 0.49999 	| 0.99999 	| 0.33333    	|
| James   	| Linda    	| Classic 	| 0.49999 	| 0.49999 	| 0.24999 	| 0.75    	| 0.49999 	| 0.49999 	| 0.99999 	| 0.33333    	|
|---------	|----------	|---------	|---------	|---------	|---------	|---------	|---------	|---------	|---------	|------------	|
```
---
