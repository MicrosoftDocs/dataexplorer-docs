---
title:  parse_version()
description: Learn how to use the parse_version() function to convert the input string representation of the version to a comparable decimal number,
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/27/2024
---
# parse_version()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts the input string representation of the version to a comparable decimal number.

## Syntax

`parse_version` `(`*version*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *version* | `string` |  :heavy_check_mark: | The version to be parsed.|

> [!NOTE]
>
> * *version* must contain from one to four version parts, represented as numbers and separated with dots ('.').
> * Each part of *version* may contain up to eight digits, with the max value at 99999999.
> * If the number of parts is less than four, all the missing parts are considered as trailing. For example, `1.0` == `1.0.0.0`.

## Returns

If conversion is successful, the result will be a decimal.
If conversion is unsuccessful, the result will be `null`.

## Example

The following query creates a table of version strings and then parses each version string into its individual components using the parse_version function. The result is a table with the original version strings and their parsed components, which can be further analyzed or used in subsequent operations.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoSy0qzszPCy4pysxLL1awVUhJLAHCpJxUDaiUlUIxWFKTK5pLAQiUDPWM9Iz1TJR0IFwwR88UxjUEcfTMYFxjPQMQRCg2BHO5Yq25UK3mqlFIrShJzUtRKEgsKk5NCYPIAl0E5sdDVcNcpQkA68ymFL0AAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let versionStrings = datatable(version: string)
[
    "1.2.3.4",
    "2.3.4.5",
    "1.4.5.6",
    "3.0.0.0",
    "2.1.0.0"
];
versionStrings
| extend parsedVersion = parse_version(version)
```

**Output**

| version | parsedVersion |
|---|---|
| 1.2.3.4 | 1,000,000,020,000,000,300,000,004 |
| 2.3.4.5 | 2,000,000,030,000,000,400,000,005 |
| 1.4.5.6 | 1,000,000,040,000,000,500,000,006 |
| 3.0.0.0 | 3,000,000,000,000,000,000,000,000 |
| 2.1.0.0 | 2,000,000,010,000,000,000,000,000 |
