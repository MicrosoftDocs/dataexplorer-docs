---
title:  url_encode_component()
description: Learn how to use the url_encode_component() function to convert characters of the input URL into a transmittable format.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/02/2023
---
# url_encode_component()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

The function converts characters of the input URL into a format that can be transmitted over the internet. Differs from [url_encode](url-encode-function.md) by encoding spaces as '%20' and not as '+'.

For more information about URL encoding and decoding, see [Percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding).

## Syntax

`url_encode_component(`*url*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *url* | `string` |  :heavy_check_mark: | The URL to encode.|

## Returns

URL (string) converted into a format that can be transmitted over the Internet.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyXLMQqAMAxA0V3wDtmqIO2uCN5E1AZbiEmpkV7fiuP/8AgVnkwww2KCarpH50opdo982kMuF5BIoEgm78zUNilHVpAcz8jb56oeAPkQj/7P9a+18iSMrF2d/QtxbpMUagAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let url = @'https://www.bing.com/hello world/';
print original = url, encoded = url_encode_component(url)
```

**Output**

|original|encoded|
|---|---|
|https://www.bing.com/hello world/|https%3a%2f%2fwww.bing.com%2fhello%20world|
