---
title:  project-keep operator
description: Learn how to use the project-keep operator to select columns from the input to keep in the output.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# project-keep operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Select what columns from the input to keep in the output. Only the columns that are specified as arguments will be shown in the result. The other columns are excluded.

## Syntax

*T* `| project-keep` *ColumnNameOrPattern* [`,` ...]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input from which to keep columns.|
| *ColumnNameOrPattern* | `string` |  :heavy_check_mark: | One or more column names or column wildcard-patterns to be kept in the output.|

## Returns

A table with columns that were named as arguments. Contains same number of rows as the input table.

> [!TIP]
> You can `project-keep` any columns that are present in the original table or that were computed as part of the query.

> [!NOTE]
> The order of the columns in the result is determined by their original order in the table. Only the columns that were specified as arguments are kept. The other columns are excluded from the result.

## Example

The following query returns columns from the `ConferenceSessions` table that contain the word "session".

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3POz0tLLUrNS04NTi0uzszPK+blqlEoKMrPSk0u0c1OTS1QKIZIaAEAWs65FysAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
ConferenceSessions
| project-keep session*
```

The following table shows only the first 10 results.

|sessionid|session_title|session_type|session_location|
|--|--|--|--|
|COM64| Focus Group: Azure Data Explorer |Focus Group|Online|
|COM65| Focus Group: Azure Data Explorer |Focus Group|Online|
|COM08| Ask the Team: Azure Data Explorer|Ask the Team|Online|
|COM137| Focus Group: Built-In Dashboard and Smart Auto Scaling Capabilities in Azure Data Explorer|Focus Group| Online|
|CON-PRT157| Roundtable: Monitoring and managing your Azure Data Explorer deployments|Roundtable|Online|
|CON-PRT103| Roundtable: Advanced Kusto query language topics|Roundtable| Online|
|CON-PRT157| Roundtable: Monitoring and managing your Azure Data Explorer deployments|Roundtable|Online|
|CON-PRT103| Roundtable: Advanced Kusto query language topics|Roundtable|Online|
|CON-PRT130| Roundtable: Data exploration and visualization with Azure Data Explorer |Roundtable |Online|
|CON-PRT130| Roundtable: Data exploration and visualization with Azure Data Explorer |Roundtable |Online|
|...|...|...|...|

## Related content

* To choose what columns from the input to exclude from the output, use [project-away](project-away-operator.md).
* To rename columns, use [`project-rename`](project-rename-operator.md).
* To reorder columns, use [`project-reorder`](project-reorder-operator.md).
