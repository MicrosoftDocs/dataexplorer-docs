---
title: graph-merge operator (Preview)
description: Learn how to use the graph-merge operator to merge the nodes and edges of two graphs, combining them into a single new graph.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/19/2023
---
# graph-merge operator (Preview)

The `graph-merge` operator merges the nodes and edges of two graphs, combining them into a single new graph.

> [!WARNING]
> The `graph-merge` operator is currently offered in preview mode. 
> The syntax and semantics of the operator might change prior to public availability.

## Syntax
*LeftGraph* | `graph-merge` (*RightGraph*) [on *Attributes*]

## Arguments
|Name|Type|Required | Description |
|---|---|---|---|
|*LeftGraph*|Graph|Yes|The left graph. Denoted as `$left`|
|*RightGraph*|Graph|Yes|The right graph. Denoted as `$right`|
|*Attributes*|string|No|One or more comma-separated rules that describe how edges from *LeftGraph* are matched to edges from *RightGraph*. Multiple rules are evaluated using the `and` logical operator|


## Rules:
|Rule Kind|Syntax|Predicate|
|---|---|---|
|Equality by name| `ColumnName` | `where` `$left.ColumnName` == `$right.ColumnName` |
|Equality by value|`$left.LeftColumn` == `$right.RightColumn`| `where` `$left.LeftColumn` == `$right.RightColumn` |

## Returns
The graph merge operator combines nodes and edges from two origin graphs into a new graph, adhering to specified merge rules.
In the absence of any rules, the edges are unionized rather than merged.

## Examples
### Example 1:
The following example builds a graph from emails and aliases tables and a second graph for calls and employees first and last names. 
Following the `make-graph` operators that builds the two graphs is a call to `graph-merge`.
Because *Attributes* is not specified the edges of the new graph are the union of the edges from both the source graphs.

```kusto
let Emails = datatable(fromPrincipal: long, toPrincipal:long, wordCount: long, when: datetime) 
[
	1, 2, 200, datetime(2022, 01, 01),
	2, 3, 500, datetime(2022, 01, 02), 
	2, 4, 5,datetime(2022, 01, 03),
	3, 4, 2, datetime(2022, 01, 04),
	1, 4, 101,datetime(2022, 01, 05),
];
let Calls = datatable(caller: long, callee: long, subject: string, duration: long, when: datetime) 
[
	1, 2, "Finance", 20, datetime(2022, 08, 01),
	2, 1, "Finance", 2, datetime(2022, 01, 02),
	3, 4, "HR", 15, datetime(2022, 01, 01),
	4, 3, "Lunch", 105, datetime(2022, 01, 05),
	1, 4, "Finance", 20, datetime(2022, 01, 05),
	4, 1, "HR", 35, datetime(2022, 01, 01)
];
let EmployeeAlias = datatable(principalId: long, alias: string) 
[
	1, "aa",
	2, "bb",
	3, "ee",
	4, "mm",
	5, "vv"
];
let EmployeeInfo = datatable(principalId: long, firstName: string, lastName: string) 
[
	1, "Alice", "Adams",
	2, "Bob", "Baker",
	3, "Eve", "Evans",
	4, "Mallory", "Mason",
	6, "Trent", "Smith"
];
let EmailsGraph = Emails
	| make-graph fromPrincipal --> toPrincipal with EmployeeAlias on principalId;
let CallsGraph = Calls
	| make-graph caller --> callee with EmployeeInfo on principalId;
EmailsGraph
| graph-merge CallsGraph
| graph-to-table edges as MergeEdges, nodes as MergeNodes;
MergeEdges;
MergeNodes
```

#### Result Table 1:
|fromPrincipal|toPrincipal|wordCount|when|caller|callee|subject|duration|
|---|---|---|---|---|---|---|---|
|1|2|200|2022-01-01 00:00:00.0000000|||||
||||2022-01-01 00:00:00.0000000|3|4|HR|15|
||||2022-01-01 00:00:00.0000000|4|1|HR|35|
|2|3|500|2022-01-02 00:00:00.0000000|||||
||||2022-01-02 00:00:00.0000000|2|1|Finance|2|
|2|4|5|2022-01-03 00:00:00.0000000|||||
|3|4|2|2022-01-04 00:00:00.0000000|||||
|1|4|101|2022-01-05 00:00:00.0000000|||||
||||2022-01-05 00:00:00.0000000|4|3|Lunch|105|
||||2022-01-05 00:00:00.0000000|1|4|Finance|20|
||||2022-08-01 00:00:00.0000000|1|2|Finance|20|

#### Result Table 2:
|principalId|alias|firstName|lastName|
|---|---|---|---|
|1|aa|Alice|Adams|
|2|bb|Bob|Baker|
|3|ee|Eve|Evans|
|4|mm|Mallory|Mason|
|5|vv|||
|6||Trent|Smith|

### Example 2:
The following example builds a graph from emails and aliases tables and a second graph for calls and employees first and last names. 
Following the `make-graph` operators that builds the two graphs is a call to `graph-merge`.
Because *Attributes* is specified the edges will be merged based on source and destination of the emails and calls (all edges with the same source and destination would be merged into a single edge).

```kusto
let Emails = datatable(fromPrincipal: long, toPrincipal:long, wordCount: long, when: datetime) 
[
	1, 2, 200, datetime(2022, 01, 01),
	2, 3, 500, datetime(2022, 01, 02), 
	2, 4, 5,datetime(2022, 01, 03),
	3, 4, 2, datetime(2022, 01, 04),
	1, 4, 101,datetime(2022, 01, 05),
];
let Calls = datatable(caller: long, callee: long, subject: string, duration: long, when: datetime) 
[
	1, 2, "Finance", 20, datetime(2022, 08, 01),
	2, 1, "Finance", 2, datetime(2022, 01, 02),
	3, 4, "HR", 15, datetime(2022, 01, 01),
	4, 3, "Lunch", 105, datetime(2022, 01, 05),
	1, 4, "Finance", 20, datetime(2022, 01, 05),
	4, 1, "HR", 35, datetime(2022, 01, 01)
];
let EmployeeAlias = datatable(principalId: long, alias: string) 
[
	1, "aa",
	2, "bb",
	3, "ee",
	4, "mm",
	5, "vv"
];
let EmployeeInfo = datatable(principalId: long, firstName: string, lastName: string) 
[
	1, "Alice", "Adams",
	2, "Bob", "Baker",
	3, "Eve", "Evans",
	4, "Mallory", "Mason",
	6, "Trent", "Smith"
];
Emails | join kind=fullouter Calls on $left.fromPrincipal == $right.caller, $left.toPrincipal == $right.callee

let EmailsGraph = Emails
	| make-graph fromPrincipal --> toPrincipal with EmployeeAlias on principalId;
let CallsGraph = Calls
	| make-graph caller --> callee with EmployeeInfo on principalId;
EmailsGraph
| graph-merge CallsGraph on $left.fromPrincipal == $right.caller, $left.toPrincipal == $right.callee
| graph-to-table edges as MergeEdges, nodes as MergeNodes;
MergeEdges;
MergeNodes
```

#### Result Table 1:
|fromPrincipal|toPrincipal|wordCount|when|caller|callee|subject|duration|
|---|---|---|---|---|---|---|---|
|||||4|1|HR|35|2022-01-01 00:00:00.0000000|
|||||2|1|Finance|2|2022-01-02 00:00:00.0000000|
|||||4|3|Lunch|105|2022-01-05 00:00:00.0000000|
|1|2|200|2022-01-01 00:00:00.0000000|1|2|Finance|20|2022-08-01 00:00:00.0000000|
|2|3|500|2022-01-02 00:00:00.0000000||||||
|2|4|5|2022-01-03 00:00:00.0000000||||||
|3|4|2|2022-01-04 00:00:00.0000000|3|4|HR|15|2022-01-01 00:00:00.0000000|
|1|4|101|2022-01-05 00:00:00.0000000|1|4|Finance|20|2022-01-05 00:00:00.0000000|

#### Result Table 2:
|principalId|alias|firstName|lastName|
|---|---|---|---|
|1|aa|Alice|Adams|
|2|bb|Bob|Baker|
|3|ee|Eve|Evans|
|4|mm|Mallory|Mason|
|5|vv|||
|6||Trent|Smith|

## See also

* [Graph operators](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
* [graph-match operator](graph-match-operator.md)

