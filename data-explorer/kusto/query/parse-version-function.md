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

## Examples

### Parse strings

The following query creates a table of version strings and then parses each version string into its individual components using the parse_version function. The result is a table with the original version strings and their parsed components, which can be further analyzed or used in subsequent operations.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFIKVGwVUhJLAHCpJxUjTIrheKSosy8dE0uBSCIBpNKBnogaKqkA2Ga6xnAmMYQhhGEMtQzgkiBGMZ6JmAmiLCEArA5BkpcsdZcKSVcNQqpFSWpeSkKBYlFxakpYalFxZn5eUD3gPnxZRC%2BRpkmAO77EVapAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let dt = datatable(v: string)
    [
    "0.0.0.5", "0.0.7.0", "0.0.3", "0.2", "0.1.2.0", "1.2.3.4", "1", "99999999.0.0.0"
];
dt
| extend parsedVersion = parse_version(v)
```

**Output**

| v | parsedVersion |
|---|---|
| 0.0.0.5 | 5 |
| 0.0.7.0 | 700,000,000 |
| 0.0.3 | 300,000,000 |
| 0.2 | 20,000,000,000,000,000 |
| 0.1.2.0 | 10,000,000,200,000,000 |
| 1.2.3.4 | 1,000,000,020,000,000,300,000,004 |
| 1 | 1,000,000,000,000,000,000,000,000 |
| 99999999.0.0.0 | 99,999,999,000,000,000,000,000,000,000,000 |

### Using parse_version with other functions

This query compares all pairs of version numbers from the initial list, removes duplicate pairs, and then identifies the higher version number for each pair.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA11QYU/DIBD93l/x7CeITdcyF6MG/4gxC1txZWtpAwyd8cd7UJeod8nx7t3jcWHQAV2ARKcC5W7QLD7CB2fsgRegeMm1bOqUm7Ja4H3dXOF6AWI52losowTW9V2GqTz8RPZpyuL1qehC8YXZTUe9D4itjBW2J32RLYg/TsbiZGwnjbXagdGav9TiqqbdW47J5obuvffaaXLDjSQVEf48jsqZz0xKjOqDxZZXNEydsSwKjt0FrFe+TyPcYoGCc6xWcHqcIv0HuvM8mL0KZrL+z+bJrEJvDvT2NmrnSUHmxryxWTmvr1x2f8Y/TqRlsgf/Bt4b/NePAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let dt = datatable(v: string)
    [
    "0.0.0.5", "0.0.7.0", "0.0.3", "0.2", "0.1.2.0", "1.2.3.4", "1", "99999999.0.0.0"
];
dt
| project v1=v, _key=1 
| join kind=inner (dt | project v2=v, _key = 1) on _key
| where v1 != v2
| summarize v1 = max(v1), v2 = min(v2) by (hash(v1) + hash(v2)) // removing duplications
| project v1, v2, higher_version = iif(parse_version(v1) > parse_version(v2), v1, v2)
```

**Output**

|v1|v2|higher_version|
|---|---|---|
|99999999.0.0.0|0.0.0.5|99999999.0.0.0|
|1|0.0.0.5|1|
|1.2.3.4|0.0.0.5|1.2.3.4|
|0.1.2.0|0.0.0.5|0.1.2.0|
|0.2|0.0.0.5|0.2|
|0.0.3|0.0.0.5|0.0.3|
|0.0.7.0|0.0.0.5|0.0.7.0|
|99999999.0.0.0|0.0.7.0|99999999.0.0.0|
|1|0.0.7.0|1|
|1.2.3.4|0.0.7.0|1.2.3.4|
|0.1.2.0|0.0.7.0|0.1.2.0|
|0.2|0.0.7.0|0.2|
|0.0.7.0|0.0.3|0.0.7.0|
|99999999.0.0.0|0.0.3|99999999.0.0.0|
|1|0.0.3|1|
|1.2.3.4|0.0.3|1.2.3.4|
|0.1.2.0|0.0.3|0.1.2.0|
|0.2|0.0.3|0.2|
|99999999.0.0.0|0.2|99999999.0.0.0|
|1|0.2|1|
|1.2.3.4|0.2|1.2.3.4|
|0.2|0.1.2.0|0.2|
|99999999.0.0.0|0.1.2.0|99999999.0.0.0|
|1|0.1.2.0|1|
|1.2.3.4|0.1.2.0|1.2.3.4|
|99999999.0.0.0|1.2.3.4|99999999.0.0.0|
|1.2.3.4|1|1.2.3.4|
|99999999.0.0.0|1|99999999.0.0.0|
