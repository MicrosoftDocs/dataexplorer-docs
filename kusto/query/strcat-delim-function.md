---
title:  strcat_delim()
description: Learn how to use the strcat_delim() function to concatenate between 2 and 64 arguments using a specified delimiter as the first argument.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# strcat_delim()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Concatenates between 2 and 64 arguments, using a specified delimiter as the first argument.

## Syntax

`strcat_delim(`*delimiter*, *argument1*, *argument2*[ , *argumentN*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *delimiter* | `string` |  :heavy_check_mark: | The string to be used as separator in the concatenation.|
| *argument1* ... *argumentN* | scalar |  :heavy_check_mark: | The expressions to concatenate.|

> [!NOTE]
> If the arguments aren't of string type, they'll be forcibly converted to string.

## Returns

The arguments concatenated to a single string with *delimiter*.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSguUbAFEkXJiSXxKak5mbka6rrqOgqGOgrqRkBa3RHEKdYEAPL2A8YtAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print st = strcat_delim('-', 1, '2', 'A', 1s)
```

**Output**

|st|
|---|
|1-2-A-00:00:01|
