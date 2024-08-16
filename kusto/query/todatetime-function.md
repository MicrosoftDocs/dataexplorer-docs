---
title:  todatetime()
description: Learn how to use the todatetime() function to convert the input expression to a datetime value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# todatetime()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts the input to a [datetime](scalar-data-types/datetime.md) scalar value.

> [!NOTE]
> When possible, use [datetime literals](scalar-data-types/datetime.md#) instead.

## Syntax

`todatetime(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar |  :heavy_check_mark: | The value to convert to [datetime](scalar-data-types/datetime.md).|

## Returns

If the conversion is successful, the result will be a [datetime](scalar-data-types/datetime.md) value.
Else, the result will be `null`.

## Example

The following example converts a date and time string into a `datetime` value.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJT0ksSS3JzE3VUDIyMDTVNTTSNTZUMDK2MrUEIj1LJU0ARpCGGSkAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print todatetime("2015-12-31 23:59:59.9")
```

The following example compares a converted date string to a `datetime` value.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJT0ksSS3JzE3VUDc00jUw0jUyMDJS11SwtVXALgMAakZnYjgAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print todatetime('12-02-2022') == datetime('12-02-2022')
```

**Output**

|print_0|
|--|
|true|
