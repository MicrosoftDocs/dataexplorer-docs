---
title:  Alias statement
description: Learn how to use an alias statement to define an alias for a database that is used for a query.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/21/2025
---
# Alias statement

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Alias statements allow you to define an alias for a database, which can be used in the same query.

The `alias` statement is useful as a shorthand name for a database so it can be referenced using that alias in the same query.

## Syntax

`alias` database *DatabaseAliasName* `=` cluster("QueryURI").database("*DatabaseName*")

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *DatabaseAliasName* | `string` | :heavy_check_mark: | An existing name or new database alias name. You can escape the name with brackets. For example, ["Name with spaces"]. |
| *QueryURI* | `string` | :heavy_check_mark: | The URI that can be used to run queries or management commands. |
| *DatabaseName* | `string` | :heavy_check_mark: | The name of the database to give an alias. |

:::moniker range="azure-data-explorer"
> [!NOTE]
>
> - To get your Query URI, in the Azure portal, go to your cluster's overview page, and then copy the URI.
> - The mapped Query and the mapped database-name must appear inside double-quotes(") or single-quotes(').
::: moniker-end
:::moniker range="microsoft-fabric"
> [!NOTE]
>
> - To get your Query URI, see [Copy a KQL database URI](/fabric/real-time-intelligence/access-database-copy-uri#copy-uri).
> - The mapped Query and the mapped database-name must appear inside double-quotes(") or single-quotes(').
::: moniker-end

## Examples

[!INCLUDE [help-cluster](../includes/help-cluster-note.md)]

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
