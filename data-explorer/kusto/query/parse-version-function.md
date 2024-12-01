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

The following query creates a table of version strings and then parses each version string into a comparable decimal number using the parse_version function. The result is a table with the original version strings and their parsed components, which can be further analyzed or used in subsequent operations.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFIKVGwVUhJLAHCpJxUjTIrheKSosy8dE0uBSCIBpNKBnogaKqkA2Ga6xnAmMYQhhGEMtQzgkiBGMZ6JmCmElesNVdKCVeNQmpFSWpeikJBYlFxakpYalFxZn4e0HYwP74Mwtco0wQA%2F7qnM5cAAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let dt = datatable(v: string)
    [
    "0.0.0.5", "0.0.7.0", "0.0.3", "0.2", "0.1.2.0", "1.2.3.4", "1"
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

### Using parse_version with other functions

This query determines which labs have equipment that requires updates.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA2WQTQvCMAyG7%2FsVoacNytBNEfw4%2BH0R7yIyujXKZGyjrUPBH286GZuzOTR98iZNkqEBaWABUhiyOEM3E%2FEUtFFpfuNQNa7nnB2gww4ihiXjwAa%2BtTHjLV81fOIPunzDeI3DLlx%2FxQFdLdx%2F4dAPfivsLLc09Eddvq05kcvMkcZ5Az4N5hJKoTTKqEKl0yKn%2BWrQvN3Ka6U5otTRo6QNIAnT69XtZc972dRIPTzz6PMTatvDsWC2ZqmKOyYGaIm0PP5TnMK6UAbilw2D0An8aT4NEEn1kAEAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
let dt = datatable(lab: string, v: string)
[
    "Lab A", "0.0.0.5",
    "Lab B", "0.0.7.0",
    "Lab D","0.0.3",
    "Lab C", "0.2", 
    "Lab G", "0.1.2.0",
    "Lab F", "1.2.3.4",
    "Lab E", "1",
];
dt
| extend parsed_version = parse_version(v)
| extend needs_update = iff(parsed_version < parse_version("1.0.0.0"), "Yes", "No")
| project lab, v, needs_update
| sort by lab asc , v, needs_update
```

**Output**

| lab | v | needs_update |
|---|---|---|
| Lab A | 0.0.0.5 | Yes |
| Lab B | 0.0.7.0 | Yes |
| Lab C | 0.2 | Yes |
| Lab D | 0.0.3 | Yes |
| Lab E | 1 |No |
| Lab F | 1.2.3.4 |No |
| Lab G | 0.1.2.0 | Yes |
