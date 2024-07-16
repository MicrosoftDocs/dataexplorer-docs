---
title:  parse_urlquery()
description: Learn how to use the parse_urlquery() function to return a dynamic object that contains the query parameters.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/12/2023
---
# parse_urlquery()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns a `dynamic` object that contains the query parameters.

> **Deprecated aliases:** parseurlquery()

## Syntax

`parse_urlquery(`*query*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *query* | `string` |  :heavy_check_mark: | The query part of the URL. The format must follow URL query standards (key=value& ...).|

## Returns

An object of type [dynamic](scalar-data-types/dynamic.md) that includes the query parameters.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUQhKLS7NKbEtSCwqTo0vLcopLE0tqtRQyja0LTNUyzayLTNSyza2LTNW0gQABqxVODAAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print Result=parse_urlquery("k1=v1&k2=v2&k3=v3")
```

**Output**

|Result|
|--|
|{ "Query Parameters":"{"k1":"v1", "k2":"v2", "k3":"v3"}" }|

The following example uses a function to extract specific query parameters.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA4WPwQrCMBBE74X+w9KDaaAV9abSf9CDXkqRgksppLVuNlVR/900oVDxYC7Jzs6bIQoZKuS9QXrsSiqbY6kMQgbxdZA0U91WG/B3At1gGUcJzzAAe5QNcRttQfvQeDKkXMA0Rm69nS9+jj2TR64dXD0yko6Kee52hQyDt6U6a2c4kPLODERf4y3rdbpaLNezjlAj9Zg6lcmgCIMX4J2xPcMgWuT3l/EYmPg8ISfUmPmX/CoX8gPcEHXrUQEAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let getQueryParamValue = (querystring: string, param: string) {
    let params = parse_urlquery(querystring);
    tostring(params["Query Parameters"].[param])
};
print UrlQuery = 'view=vs-2019&preserve-view=true'
| extend view = getQueryParamValue(UrlQuery, 'view')
| extend preserve = getQueryParamValue(UrlQuery, 'preserve-view')
```

**Output**

| UrlQuery | view | preserve |
|--|--|--|
|view=vs-2019&preserve-view=true|vs-2019|true|
