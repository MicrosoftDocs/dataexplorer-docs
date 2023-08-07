---
title: graph-merge operator (Preview)
description: Learn how to use the graph-merge operator to merge the nodes and edges of two graphs, combining them into a single new graph.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/07/2023
---
# graph-merge operator (Preview)

The `graph-merge` operator merges the nodes and edges of two graphs, combining them into a single new graph.

## Syntax

*LeftGraph* `|` `graph-merge` *RightGraph* [ `on` *Conditions* ]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *LeftGraph* | string | &check; | The left graph. Denoted as `$left`. |
| *RightGraph* | string | &check; | The right graph. Denoted as `$right`. |
| *Attributes* | string | | One or more comma-separated rules that determine how edges from *LeftGraph* are matched with edges from *RightGraph*. If the columns to match have the same name in both graphs, use the syntax `on` *ColumnName*. Otherwise, use the syntax `on` `$left.`*LeftColumn* `==` `$right.`*RightColumn*. Multiple rules are evaluated using the `and` logical operator.|

## Returns

The graph merge operator combines nodes and edges from two origin graphs into a new graph, adhering to specified merge rules.
In the absence of any rules, the edges are unionized rather than merged.

## Examples

### Merge without attributes

The following example builds a graph from emails and aliases tables and a second graph for calls and employees first and last names. The `make-graph` operators build the two graphs. Then, `graph-merge` merges the nodes and edges of the two graphs.

Since *Attributes* isn't specified, the edges of the new graph are the union of the edges from both the source graphs.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA41T22rbQBB9N/gfln2KQQJJtktJaCEJahtoQmn7VvKwlsa22r2Y1domkI/v7MiSVr40RRJozh7NnDmjkeBYrkQla/aBlcLhtZBwtbRGfbOVLqqNkNdMGr2KmDM91CB7Y8t7s9WupezXoK99HnCVggkbj36NRyyNWIZ3kkTd0VWWZIglqX8mEZIwmkZsfomUTSLWsGbIis5RppRnSozsfJYZUVKipIic48w95/lmPJLozb2QR9YUiIBtG6YI2qjeLn5DgW7UDp1CoNxa4Sqj/8cf/qnSQhfAvVWn8t+HTqVD+kXLOj/4l+9ITOf/msCMJsC/bnWx9uTkAnsemPiG6J4+a0STjOlFGb3xudpI8wJwKysxHMCm/QkfytZW4Umt64GrXAh+cIwvFvxgBwfgB0lcKXpFQXy346flH/TSvFV9WdnaPQkF/dylGCKhJuyI/OK3pVB1p+/OLDx4J/6A7ZTmO2LmO6HrTvMj/nPGvnB6rY2mg3cY/bSgnYd/qMqtB934Df9sxWaNzTQRfvPKFFaLV4QPVp7F8cdw39keEx7NxGgWmBHuS1uIguM6zf5QgWZ5hrnJ8JPUQQPj0SujTLECu4KgYn/iTEzTYlCuoGYo9tFzcx9FTJsyAJ98hCV6RhvQyV8JFXqLIQUAAA==" target="_blank">Run the query</a>

```kusto
let Emails = datatable(
    fromPrincipal: long,
    toPrincipal: long,
    wordCount: long,
    when: datetime
) 
    [
    1, 2, 200, datetime(2022, 01, 01),
    2, 3, 500, datetime(2022, 01, 02), 
    2, 4, 5, datetime(2022, 01, 03),
    3, 4, 2, datetime(2022, 01, 04),
    1, 4, 101, datetime(2022, 01, 05),
];
let Calls = datatable(
    caller: long,
    callee: long,
    subject: string,
    duration: long,
    when: datetime
) 
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

**Output table 1**

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

**Output table 2**

|principalId|alias|firstName|lastName|
|---|---|---|---|
|1|aa|Alice|Adams|
|2|bb|Bob|Baker|
|3|ee|Eve|Evans|
|4|mm|Mallory|Mason|
|5|vv|||
|6||Trent|Smith|

### Merge with attributes

The following example builds a graph from emails and aliases tables and a second graph for calls and employees first and last names. The `make-graph` operators builds the two graphs. Then, `graph-merge` merges the nodes and edges of the two graphs.

Since *Attributes* is specified, the edges are merged based on source and destination of the emails and calls. Meaning, all edges with the same source and destination are merged into a single edge.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA61U22rbQBB9N/gfliUPMchB8qWUFBeS4LaBJpQmb6UPa2tkb7IXs1rZBPzxnV3dVr40fSiWQXP2MHPmzKwEWDKXjIuczEjKLP4WAi4zo+UPw9WSb5i4JkKrVUSsbqES2WmT3ulC2ZqyW4O6dnnAcgkD0u/96vdIEpERPnEcNUeXo3iEWJy4/yBCEkbjiEzPkUaDiJSsCbKiU5SxzzP2jNHpLBNPSTwlQeQUZ+o4vz/1ewK9uWPiwJolImDqhn0EdZQXixdYohu5RacQSAvDLNfqX/yhX7hiagnUWXUs/2PoVNKln7Ws8YN++4nEZPq3CUz8BOj3Qi3XjhyfYU8DE98R3dInpWgvY3xWRmv8XG6EfgO4EZx1B7Cpl/A+rW1ljlS7HrhKGaOVY3SxoJUdFIBWkqiU/hUF0e2WHpe/V5l+r3rGTW4fmYR27oJ1kVATduT9ojcpk3mj71YvHHjLXsE0Sudbz5xvmcobzQ+4c9q8Uf+aa+UPPmD0bEBZBz9JbtdVN9Xt3pMXzRV55SqdZQUmKCyYar21IhcCMnvVufZkNiMXhq/W9qrc+ahiBd+BQw409rmiXw3brNG9MkKReyKxveHK491iw+Hn8ANDdtjBwRKgzMD98ILWhXxwWKcU7wuUGru5/YSPUgcN9Ht74jMNJZgVhBX/o3FtFauHftUIpCvICTb+4OrOXRQRpdMAfHQRym0ZdeBP/gBZULo73gUAAA==" target="_blank">Run the query</a>

```kusto
let Emails = datatable(
    fromPrincipal: long,
    toPrincipal: long,
    wordCount: long,
    when: datetime
) 
    [
    1, 2, 200, datetime(2022, 01, 01),
    2, 3, 500, datetime(2022, 01, 02), 
    2, 4, 5, datetime(2022, 01, 03),
    3, 4, 2, datetime(2022, 01, 04),
    1, 4, 101, datetime(2022, 01, 05),
];
let Calls = datatable(
    caller: long,
    callee: long,
    subject: string,
    duration: long,
    when: datetime
) 
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
Emails
| join kind=fullouter Calls on $left.fromPrincipal == $right.caller, $left.toPrincipal == $right.callee;
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

**Output table 1**

|fromPrincipal|toPrincipal|wordCount|when|caller|callee|subject|duration|when1|
|---|---|---|---|---|---|---|---|---|
|||||4|1|HR|35|2022-01-01 00:00:00.0000000|
|||||2|1|Finance|2|2022-01-02 00:00:00.0000000|
|||||4|3|Lunch|105|2022-01-05 00:00:00.0000000|
|1|2|200|2022-01-01 00:00:00.0000000|1|2|Finance|20|2022-08-01 00:00:00.0000000|
|2|3|500|2022-01-02 00:00:00.0000000||||||
|2|4|5|2022-01-03 00:00:00.0000000||||||
|3|4|2|2022-01-04 00:00:00.0000000|3|4|HR|15|2022-01-01 00:00:00.0000000|
|1|4|101|2022-01-05 00:00:00.0000000|1|4|Finance|20|2022-01-05 00:00:00.0000000|

**Output table 2**

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
