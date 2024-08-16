---
title:  url_encode()
description: Learn how to use the url_encode() function to convert characters of the input URL into a transmittable format.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# url_encode()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The function converts characters of the input URL into a format that can be transmitted over the internet.
Differs from [url_encode_component](url-encode-component-function.md) by encoding spaces as '+' and not as '%20' (see application/x-www-form-urlencoded [here](https://en.wikipedia.org/wiki/Percent-encoding)).

For more information about URL encoding and decoding, see [Percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding).

## Syntax

`url_encode(`*url*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*url*| `string` | :heavy_check_mark:|The URL to encode.|

## Returns

URL (string) converted into a format that can be transmitted over the Internet.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoLcpRsFVwUM8oKSkottLXLy8v10vKzEvXS87P1c9IzcnJVyjPL8pJUbfmKijKzCtRyC/KTM/MSwTpAurVUUjNS85PSU2BcOMhPA0gUxMAGwCJQ14AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let url = @'https://www.bing.com/hello world';
print original = url, encoded = url_encode(url)
```

**Output**

|original|encoded|
|---|---|
|https://www.bing.com/hello world/|https%3a%2f%2fwww.bing.com%2fhello+world|
