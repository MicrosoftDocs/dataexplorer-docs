---
title:  not()
description: Learn how to use the not() function to reverse the value of its boolean argument.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/26/2024
---
# not()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Reverses the value of its `bool` argument.

## Syntax

`not(`*expr*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*expr*|scalar| :heavy_check_mark:|An expression that evaluates to a boolean value. The result of this expression is reversed.|

## Returns

Returns the reversed logical value of its `bool` argument.

## Examples

The following query returns the number of events that are not a tornado, per state.

:::moniker range="azure-data-explorer"
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSspVuDlqlEoz0gtSlXIyy%2FRAAuGVBakKtjaKiiF5BflJabkK2mCVRWX5uYmFmVWpSok55fmlWhoKiRVKgSXJJakAgA2hsjZUAAAAA%3D%3D" target="_blank">Run the query</a>
:::moniker-end

```kusto
StormEvents 
| where not(EventType == "Tornado") 
| summarize count() by State
```

**Output**

| State | Count |
|--|--|
| TEXAS | 4485 |
| KANSAS | 3005 |
| IOWA | 2286 |
| ILLINOIS | 1999 |
| MISSOURI | 1971 |
| GEORGIA | 1927 |
| MINNESOTA | 1863 |
| WISCONSIN | 1829 |
| NEBRASKA | 1715 |
| NEW YORK | 1746 |
| ... | ... |

The following query excludes records where either the EventType is hail, *or* the state is Alaska.

:::moniker range="azure-data-explorer"
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5qpRKM9ILUpVyMsv0QALhVQWpCrY2iooeSRm5igp5BcpBJcklkCEHHMSi7MTlTQBNhteI0EAAAA%3D" target="_blank">Run the query</a>
:::moniker-end

```kusto
StormEvents
| where not(EventType == "Hail" or State == "Alaska")
```

The next query excludes records where both the EventType is hail *and* the state is Alaska simultaneously.

:::moniker range="azure-data-explorer"
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5uWqUSjPSC1KVcjLL9EAi4VUFqQq2NoqKHkkZuYoKSTmpSgElySWQMQccxKLsxOVNAFEoBiQQwAAAA%3D%3D" target="_blank">Run the query</a>
:::moniker-end

```kusto
StormEvents
| where not(EventType == "Hail" and State == "Alaska")
```

### Combine with other conditions

You can also combine the not() function with other conditions. The following query returns all records where the EventType is not a flood and the property damage is greater than $1,000,000.

:::moniker range="azure-data-explorer"
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS%2FKdS1LzSsp5uWqUSjPSC1KVcjLL9EAi4VUFqQq2NoqKLnl5OenKGkqJOalKLgk5iampwYU5RekFpVUKtgpGBqAAQBYZhVQSwAAAA%3D%3D" target="_blank">Run the query</a>
:::moniker-end

```kusto
StormEvents
| where not(EventType == "Flood") and DamageProperty > 1000000
```
