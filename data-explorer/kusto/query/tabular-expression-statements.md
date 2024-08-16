---
title:  Tabular expression statements
description: Learn how to use tabular expression statements to produce tabular datasets.
ms.reviewer: alexans
ms.topic: reference
ms.date: 05/01/2023
---
# Tabular expression statements

The tabular expression statement is what people usually have in mind when they talk about queries. This statement usually appears last in the statement list, and both its input and its output consists of tables or tabular datasets.
Any two statements must be separated by a semicolon.

A tabular expression statement is generally composed of *tabular data sources* such as tables, *tabular data operators* such as filters and projections, and optional *rendering operators*. The composition is represented by the pipe character (`|`), giving the statement a regular form that visually represents the flow of tabular data from left to right.
Each operator accepts a tabular dataset "from the pipe", and other inputs including more tabular datasets from the body of the operator, then emits a tabular dataset to the next operator that follows.

## Syntax

*Source* `|` *Operator1* `|` *Operator2* `|` *RenderInstruction*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*Source*| `string` | :heavy_check_mark:|A tabular data source. See [Tabular data sources](#tabular-data-sources).|
|*Operator*| `string` | :heavy_check_mark:|Tabular data operators, such as filters and projections.|
|*RenderInstruction*| `string` ||Rendering operators or instructions.|

## Tabular data sources

A tabular data source produces sets of records, to be further processed by tabular data operators. The following list shows supported tabular data sources:

* Table references
* The tabular [range operator](range-operator.md)
* The [print operator](print-operator.md)
* An invocation of a function that returns a table
* A [table literal](datatable-operator.md) ("datatable")

## Examples

### Filter rows by condition

The following query counts the number of records in the `StormEvents` table that have a value of "FLORIDA" in the `State` column.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksSVWwtVVQcvPxD/J0cVQCySXnl+aVAAA3VvV9MQAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State == "FLORIDA"
| count
```

**Output**

|Count|
|--|
|1042|

### Combine data from two tables

In the following example, the [join](join-operator.md) operator is used to combine records from two tabular data sources: the `StormEvents` table and the `PopulationData` table.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlXwzMsqLcpMLXbJLEpNLlHQhgt45qVAhOwUTA1A6rPyM/MUNALyC0pzEksy8/NcEksSNRXy8xSCSxJLUkEqCorys0A6wAI6CgilOgoh+SWJOTCjFWwJWwsARutqhK4AAAA=" target="_blank">Run the query</a>

```kusto
StormEvents 
| where InjuriesDirect + InjuriesIndirect > 50
| join (PopulationData) on State
| project State, Population, TotalInjuries = InjuriesDirect + InjuriesIndirect
```

**Output**

| State | Population | TotalInjuries |
|---|---|---|
| ALABAMA | 4918690 | 60 |
| CALIFORNIA | 39562900 | 61 |
| KANSAS | 2915270 | 63 |
| MISSOURI | 6153230 | 422 |
| OKLAHOMA | 3973710 | 200 |
| TENNESSEE | 6886720 | 187 |
| TEXAS | 29363100 | 137 |
