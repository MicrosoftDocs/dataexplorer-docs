---
title:  Alias statement
description: Learn how to use an alias statement to define an alias for a database that is used for a query.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# Alias statement

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Alias statements allow you to define an alias for databases, which can be used later in the same query.

:::moniker range="azure-data-explorer"
This is useful when you're working with several clusters but want to appear as if you're working on fewer clusters.
The alias must be defined according to the following syntax, where *clustername* and *databasename* are existing and valid entities.

## Syntax

`alias` database *DatabaseAliasName* `=` cluster("https://*clustername*.kusto.windows.net").database("*DatabaseName*")
::: moniker-end

:::moniker range="microsoft-fabric"
This is useful when you're working with several Eventhouses but want to appear as if you're working on fewer Eventhouses.
The alias must be defined according to the following syntax, where *Eventhouse* and *databasename* are existing and valid entities.

## Syntax

`alias` database *DatabaseAliasName* `=` cluster("*serviceURL*").database("*DatabaseName*")
::: moniker-end

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseAliasName*| `string` | :heavy_check_mark:|An existing name or new database alias name. You can escape the name with brackets. For example, ["Name with spaces"]. |
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database to give an alias.|

:::moniker range="azure-data-explorer"
> [!NOTE]
> The mapped cluster-uri and the mapped database-name must appear inside double-quotes(") or single-quotes(').
::: moniker-end

:::moniker range="microsoft-fabric"
> [!NOTE]
> The mapped Eventhouse-uri and the mapped database-name must appear inside double-quotes(") or single-quotes(').
::: moniker-end

## Examples

In the [help cluster](https://dataexplorer.azure.com/clusters/help/), there's a `Samples` database with a `StormEvents` table.

First, count the number of records in that table.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUUjOL80rAQDPjygQFAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| count
```

**Output**

|Count|
|--|
|59066|

Then, give an alias to the `Samples` database and use that name to check the record count of the `StormEvents` table.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA03MsQ5AMBCA4V3iHS6dWGonBoMn8ARHL9GotnGHxcMTIqxf/vzoLDIYFOyRCRjn6IibW2sY3MpCS6ZGkchlUYzkop4uDHq33oSdtSdRuX4PmeqehcqrNPn0P77yTsIytxt5YThgCKuXE70pLeGKAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
alias database samplesAlias = cluster("https://help.kusto.windows.net").database("Samples");
database("samplesAlias").StormEvents | count
```

**Output**

|Count|
|--|
|59066|

Create an alias name that contains spaces using the bracket syntax.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0vMyUwsVkhJLElMSixOVYhWCk7MLchJLVZwgQk5glQoxSrYKiTnlBaXpBZpKGWUlBQUW+nrZ6TmFOhlAwXz9coz81Lyy4v18lJLlDT1YOZpwIxT0rTm5cIQRbdEUy+4JL8o17UsNa+kWKFGITm/NK8EACbMiWaiAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
alias database ["Samples Database Alias"] = cluster("https://help.kusto.windows.net").database("Samples");
database("Samples Database Alias").StormEvents | count
```

**Output**

|Count|
|--|
|59066|
