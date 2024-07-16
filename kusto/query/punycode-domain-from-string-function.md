---
title:  punycode_domain_from_string
description:  This article describes the punycode_domain_from_string() command.
ms.topic: reference
ms.date: 06/22/2023
---

# punycode_domain_from_string()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Decodes input string from encoded Internationalized Domain Name in Applications (IDNA) [punycode](https://en.wikipedia.org/wiki/Punycode) form.

## Syntax

`punycode_domain_from_string(`*encoded_string*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|---|---|---|---|
| *encoded_string* | `string` |  :heavy_check_mark: | An IDNA string to be decoded from punycode form. The function accepts one string argument.

## Returns

* Returns a `string` that represents the original Internationalized Domain Name.
* Returns an empty result if decoding failed.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOywrCMBBF94X+Q+jKgslGkCq4qQtBXLkVKWMyxmgykZhAC368fSDo3NXh3oGjIPa5WJwhSa9QrV8xGNJlnp3yjPVXtMT5DrkzIOpktUCVijn7KQ+GeEUgtmijvIEJwgf9Pzl23N6hkmKAPWmeIiwXMGLd4+oBQno3Pp3ZG9uIpJjyDgxtnom6wa2ZuLkG75pJ82tdfgCkob8XyAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(encoded:string)
[
    "xn--Ge-mia.Bulg.edu", 
    "xn--Lin-8na.Celtchair.org", 
    "xn--Ry-lja8c.xn--Jng-uta63a.xn--Bng-9ka.com", 
] 
| extend domain=punycode_domain_from_string(encoded)
```

|encoded|domain|
|---|---|
|xn--Ge-mia.Bulg.edu|Gáe.Bulg.edu
|xn--Lin-8na.Celtchair.org|Lúin.Celtchair.org|
|xn--Ry-lja8c.xn--Jng-uta63a.xn--Bng-9ka.com|Rúyì.Jīngū.Bàng.com|

## Related content

* To encode a domain name to punycode form, see [punycode_domain_to_string()](punycode-domain-to-string-function.md).
