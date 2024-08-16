---
title:  punycode_domain_to_string 
description:  This article describes the punycode_domain_to_string() command.
ms.topic: reference
ms.date: 08/11/2024
---

# punycode_domain_to_string()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Encodes Internationalized Domain Name in Applications (IDNA) string to [Punycode](https://en.wikipedia.org/wiki/Punycode) form.


## Syntax

`punycode_domain_to_string(`*domain*`)`

## Parameters
| Name | Type | Required | Description |
|--|--|--|--|
| *domain* |  `string` |  :heavy_check_mark: | A string to be encoded to punycode form. The function accepts one string argument.

## Returns

* Returns a `string` that represents punycode-encoded original string.
* Returns an empty result if encoding failed.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjZT83MTMPKvikqLMvHQFzWh1n8OrFHwe7l6c+bihKSSj9OGutXkKIRmZh1flAQWS83PVdRTUgzIPb8jMyXm/d2Fw9uGFOSnF2YkFiUW5QCZQKL8oHahGyTsxJzWlLL80J1k9Q8+xqCS/6MjqrPxivdSUUqVYXq4ahdSKktS8FAWgzbYFpXmVyfkpqfEQ18SX5MdDHAR1niYAt9ocW7AAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(domain:string )['Lê Lợi。Thuận Thiên。com', 'Riðill｡Skáldskaparmál｡org', "Kaledvoulc'h.Artorījos.edu"]
| extend str=punycode_domain_to_string(domain)
```

|domain|str|
|---|---|
|Lê Lợi。Thuận Thiên。com|xn--L Li-gpa4517b.xn--Thun Thin-s4a7194f.com|
|Riðill｡Skáldskaparmál｡org|xn--Riill-jta.xn--Skldskaparml-dbbj.org|
|Kaledvoulc'h.Artorījos.edu|Kaledvoulc'h.xn--Artorjos-ejb.edu|

## Related content

* To retrieve the original decoded string, see [punycode_domain_from_string()](punycode-domain-from-string-function.md).
