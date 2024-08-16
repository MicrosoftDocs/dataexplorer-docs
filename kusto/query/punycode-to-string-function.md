---
title:  punycode_to_string 
description:  This article describes the punycode_to_string() command.
ms.topic: reference
ms.date: 08/11/2024
---

# punycode_to_string()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Decodes input string from [punycode](https://en.wikipedia.org/wiki/Punycode) form. The string shouldn't contain the initial xn--, and must contain only ASCII characters.

## Syntax

`punycode_to_string('input_string')`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *input_string* | `string` |  :heavy_check_mark: | A string to be decoded from punycode form. The function accepts one string argument.

## Returns

* Returns a `string` that represents the original, decoded string.
* Returns an empty result if decoding failed.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhJTc5PSU1RsFUoKM2rBLHjS/Lji0uAkuka6onJiSm5mam6aUWJeYmZxam6eQVJhonqmgCaLR+2PAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
 print decoded = punycode_to_string('acadmie-franaise-npb1a')
```

|decoded|
|---|
|académie-française|

## Related content

* Use [punycode_from_string()](punycode-from-string-function.md) to encode a string to punycode form.
