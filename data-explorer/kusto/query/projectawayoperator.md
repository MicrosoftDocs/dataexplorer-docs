---
title: project-away operator - Azure Data Explorer
description: This article describes project-away operator in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# project-away operator

Select what columns from the input to exclude from the output.

> [!NOTE]
> The order of the columns in the result is determined by their original order in the table. Only the columns that were specified as arguments are dropped. The other columns are included in the result.

## Syntax

*T* `| project-away` *ColumnNameOrPattern* [`,` ...]

## Parameters

| Name | Type | Required | Description |
| -- | -- | -- | -- |
| *T* | tabular | &check; | Input from which to remove columns. |
| *ColumnNameOrPattern* | Name of the column or column wildcard-pattern to be removed from the output.

## Returns

A table with columns that were not named as arguments. Contains same number of rows as the input table.

> [!TIP]
>
> You can `project-away` any columns that are present in the original table or that were computed as part of the query.

## Examples

The input table `PopulationData` has 2 columns: `State` and `Population`. Project-away the `Population` column and you'll be left with a list of state names.

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwvILyjNSSzJzM9zSSxJ5OWqUSgoys9KTS7RTSxPrFQIgEsDAH2sb1kpAAAA)

```kusto
PopulationData
| project-away Population
```

The below table shows only the first 10 results.

|State|
|---|
|ALABAMA|
|ALASKA|
|ARIZONA|
|ARKANSAS|
|CALIFORNIA|
|COLORADO|
|CONNECTICUT|
|DELAWARE|
|DISTRICT OF COLUMBIA|
|FLORIDA|

### Project-away using a column name pattern

Removing columns starting with "session": `sessionid`, `session_title`, `session_type`, and `session_location`.

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3POz0tLLUrNS04NTi0uzszPK+blqlEoKMrPSk0u0U0sT6xUKIZIaAEAV4MJgSsAAAA=)

```kusto
ConferenceSessions
| project-away session*
```

The below table only displays the output columns. To see the content of the output run the query above.

|conference|owner|participants|URL|level|starttime|duration|time_and_duration|kusto_affinity|
|---|---|---|---|---|---|---|---|---|
||||||||||

## See also

* To choose what columns from the input to keep in the output, use [project-keep](project-keep-operator.md).
* To rename columns, use [`project-rename`](projectrenameoperator.md).
* To reorder columns, use [`project-reorder`](projectreorderoperator.md).
