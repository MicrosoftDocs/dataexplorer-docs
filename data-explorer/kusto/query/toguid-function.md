---
title:  toguid()
description: Learn how to use the toguid() function to convert the input string to a `guid` scalar.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/09/2025
---
# toguid()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts a string to a [`guid`](scalar-data-types/guid.md) scalar.

> [!NOTE]
> When possible, use [guid literals](scalar-data-types/guid.md#guid-literals) instead.

## Syntax

`toguid(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar |  :heavy_check_mark: | The value to convert to [guid](scalar-data-types/guid.md).|

## Returns

The conversion process takes the first 32 characters of the input, ignoring properly located hyphens, validates that the characters are between 0-9 or a-f, and then converts the string into a [`guid`](scalar-data-types/guid.md) scalar. The rest of the string is ignored.

If the conversion is successful, the result is a [`guid`](scalar-data-types/guid.md) scalar. Otherwise, the result is `null`.

## Example

The following example converts strings in a datatable that fit the conversion structure requirements, to `guid`.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjeKSIisFIJGZl67JyxXNy6UABEoGhkbGJqZm5haWiUnJKalp6HwlHSwKdUEyuiARXaxqE6H2KJRkJJYoZBYr5OWXKCQqpJdmpijxcsXyctUopFaUpOalgIUUbBVK8kEMkBM1ATuW7RixAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(str: string)
[
    "0123456789abcdef0123456789abcdef",
    "0123456789ab-cdef-0123-456789abcdef",
    "a string that is not a guid"
]
| extend guid = toguid(str)
```

**Output**

|str|guid|
|---|---|
|0123456789abcdef0123456789abcdef|01234567-89ab-cdef-0123-456789abcdef|
|0123456789ab-cdef-0123-456789abcdef|01234567-89ab-cdef-0123-456789abcdef|
|a string that isn't a guid||

## Related content

* [Scalar function types at a glance](scalar-functions.md)
* [The guid data type](scalar-data-types/guid.md)
* [new_guid()](new-guid-function.md)
* [base64_decode_toguid()](base64-decode-toguid-function.md)
* [tobool()](tobool-function.md)
