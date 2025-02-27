---
title:  regex_quote()
description: Learn how to use the regex_quote() function to return a string that escapes all regular expression characters.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 08/11/2024
---
# regex_quote()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a string that escapes all [regular expression](regex.md) characters.

## Syntax

`regex_quote(`*string*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *string* | `string` |  :heavy_check_mark: | The string to escape.|

## Returns

Returns *string* where all regex expression characters are escaped.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKVGwBTLSUyviC0vzS1I11DWK81VyU/VCUuMqSjTVNQH+BIvaKwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print result = regex_quote('(so$me.Te^xt)')
```

**Output**

| result |
|---|
| `\(so\$me\.Te\^xt\)` |
