---
title:  around() function
description: Learn how to use the around() function to indicate if the first argument is within a range around the center value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# around()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a `bool` value indicating if the first argument is within a range around the center value.

## Syntax

`around(`*value*`,`*center*`,`*delta*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*value*| int, long, real, datetime, or timespan |  :heavy_check_mark: | The value to compare to the *center*.|
| *center* | int, long, real, datetime, or timespan |  :heavy_check_mark: | The center of the range defined as [(`center`-`delta`) .. (`center` + `delta`)]. |
| *delta* | int, long, real, datetime, or timespan |  :heavy_check_mark: | The delta value of the range defined as [(`center`-`delta`) .. (`center` + `delta`)].|

## Returns

Returns `true` if the value is within the range, `false` if the value is outside the range.
Returns `null` if any of the arguments is `null`.

## Example: Filtering values around a specific timestamp

The following example filters rows around specific timestamp.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVUgpUeBSAIK0ovxchZTEktSSzNxUDSMDI0NdAxBSMDC0MjDQhCgqyceuxAihpLgktUDBMDczj6tGoTwjtShVIbEovzQvRSOlRAeX+cYGmjpgPZoA56xhi5QAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
range dt 
    from datetime(2021-01-01 01:00) 
    to datetime(2021-01-01 02:00) 
    step 1min
| where around(dt, datetime(2021-01-01 01:30), 1min)
```

**Output**

|dt|
|---|
|2021-01-01 01:29:00.0000000|
|2021-01-01 01:30:00.0000000|
|2021-01-01 01:31:00.0000000|
