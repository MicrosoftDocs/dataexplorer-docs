---
title:  coalesce()
description: Learn how to use the coalesce() function to evaluate a list of expressions to return the first non-null expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/27/2022
---
# coalesce()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Evaluates a list of expressions and returns the first non-null (or non-empty for string) expression.

## Syntax

`coalesce(`*arg*`,`*arg_2*`,[`*arg_3*`,...])`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| arg | scalar |  :heavy_check_mark: | The expression to be evaluated.|

> [!NOTE]
>
> * All arguments must be of the same type.
> * Maximum of 64 arguments is supported.

## Returns

The value of the first *arg* whose value isn't null (or not-empty for string expressions).

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleLogs?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbFNzk/MSS1OTtUoyc/Jz0vXUMrLL1FIVMgrzU1KLVLS1FGAiZsYgXjGxpoA2oxMXz8AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result=coalesce(tolong("not a number"), tolong("42"), 33)
```

**Output**

|result|
|---|
|42|
