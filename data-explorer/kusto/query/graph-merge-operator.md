---
title: graph-merge operator (Preview)
description: Learn how to use the graph-merge operator to merge the nodes and edges of two graphs, combining them into a single new graph.
ms.reviewer: rocohen
ms.topic: reference
ms.date: 09/03/2023
---
# graph-merge operator (Preview)

The `graph-merge` operator merges the nodes and edges of two graphs, combining them into a single new graph.

> [!NOTE]
> This operator is used in conjunction with the [make-graph operator](make-graph-operator.md).

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

The following examples build a graph from emails and aliases tables and another graph for calls and employees first and last names. The `make-graph` operators build the two graphs. Then, each example shows a different usage of `graph-merge`.

### Merge without attributes

Since *Attributes* aren't specified, the edges of the new graph are the union of the edges from both the source graphs.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA41T22rbQBB9N/gfln2KQQJJtktJaCEJahtoQmn7VvKwlsa22r2Y1domkI/v7MiSVr40RRJozh7NnDmjkeBYrkQla/aBlcLhtZBwtbRGfbOVLqqNkNdMGr2KmDM91CB7Y8t7s9WupezXoK99HnCVggkbj36NRyyNWIZ3kkTd0VWWZIglqX8mEZIwmkZsfomUTSLWsGbIis5RppRnSozsfJYZUVKipIic48w95/lmPJLozb2QR9YUiIBtG6YI2qjeLn5DgW7UDp1CoNxa4Sqj/8cf/qnSQhfAvVWn8t+HTqVD+kXLOj/4l+9ITOf/msCMJsC/bnWx9uTkAnsemPiG6J4+a0STjOlFGb3xudpI8wJwKysxHMCm/QkfytZW4Umt64GrXAh+cIwvFvxgBwfgB0lcKXpFQXy346flH/TSvFV9WdnaPQkF/dylGCKhJuyI/OK3pVB1p+/OLDx4J/6A7ZTmO2LmO6HrTvMj/nPGvnB6rY2mg3cY/bSgnYd/qMqtB934Df9sxWaNzTQRfvPKFFaLV4QPVp7F8cdw39keEx7NxGgWmBHuS1uIguM6zf5QgWZ5hrnJ8JPUQQPj0SujTLECu4KgYn/iTEzTYlCuoGYo9tFzcx9FTJsyAJ98hCV6RhvQyV8JFXqLIQUAAA==" target="_blank">Run the query</a>

```kusto
let Emails = datatable(
    fromPrincipal: long,
    toPrincipal: long,
    wordCount: long,F
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

Since *Attributes* are specified, the edges are merged based on source and destination of the emails and calls. Meaning, all edges with the same source and destination are merged into a single edge.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA5VUXWvbMBR9968Qog8N2MV2kjFaMmiLtxXWMra9jT3I9o3tTR9BVlIK/fG7kj8mJzFlSRx8j47uPffog4MhmWANb8mGlMzgN+dwGRD8bLUSX3Uji2bH+DXhSlahGzDqLPysdHmv9tJMwBrktc0MphEQLIhDf7r/JCQp/uI4HAmXaZwiFif2WXQpMF6GZD1HSxchGXgr5J1nLftkS0dKz5NWPSlxpMRi52hrpP26CTh6d8/4OesKhEH7PjgEfKTd57+hQLNag272YLnXzDRK/p+F9GMjmSyAWjdPNb+fmplMJ8y66vlFP39DajLj7ZB75RaKftnLorb0eIa/ntj8hnh/wqoT78QsZ8UMa5OJHVcvALe8YdM12g3b96HsjSbMkoa1OLaYMkZH+2ie09EbCkBHbVSIPkBt9HCgx0oe5Fa9JWTb6NY8MQHjxiCcTZETedih84/elky0ntQ7lVv4jv0B7YnODo6dHZhsPfmPuEeVfqHutVWyH3qH8Q8N0tiB76IxtdeYvTo+abarsa8ucnNeicCaUeVGJhcJiaIP/g1CnjHh0VopSTxnvJM2VHLBaaHu2LkK3XmbJnf2H+f2WgheicsTCdAV+BVx0gWHrbmatrLZkAvdVLW56iqHPctv74gDYxGjIrcJCJQVtATbfrRlMxuFRKrSA59sdBP8I/TvDv8LKAlw68QFAAA=" target="_blank">Run the query</a>

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
| graph-merge CallsGraph on $left.fromPrincipal == $right.caller, $left.toPrincipal == $right.callee
| graph-to-table edges as MergeEdges, nodes as MergeNodes;
MergeEdges;
MergeNodes
```

**Output table 1**

|fromPrincipal|toPrincipal|wordCount|when|caller|callee|subject|duration|
|---|---|---|---|---|---|---|---|
|1|2|200|2022-01-01T00:00:00Z|1|2|"Finance"|20|
| | | |2022-01-01T00:00:00Z|4|1|"HR"|35|
| | | |2022-01-02T00:00:00Z|2|1|"Finance"|2|
|2|3|500|2022-01-02T00:00:00Z| | | | |
|2|4|5|2022-01-03T00:00:00Z| | | | |
|3|4|2|2022-01-04T00:00:00Z|3|4|"HR"|15|
| | | |2022-01-05T00:00:00Z|4|3|"Lunch"|105|
|1|4|101|2022-01-05T00:00:00Z|1|4|"Finance"|20|

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
