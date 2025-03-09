---
title:  toupper()
description: Learn how to use the toupper() function to convert a string to upper case.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/09/2025
---
# toupper()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts a string to upper case.

## Syntax

`toupper(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `string` |  :heavy_check_mark: | The value to convert to an uppercase string.|

## Returns

If conversion is successful, result is an uppercase string.
If conversion isn't successful, result is `null`.

## Example

The following example checks whether the `toupper()` function converted the lowercase input string to uppercase.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJLy0oSC3SUMpIzcnJV9JUsLVVUPJw9fHxVwIAC8jUKyEAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
toupper("hello") == "HELLO"
```

## Related content

* [Scalar function types at a glance](scalar-functions.md)
* [tostring()](tostring-function.md)
* [toupper()](toupper-function.md)
