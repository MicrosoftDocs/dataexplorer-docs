---
title:  parse_xml()
description: Learn how to use the parse_xml() function to return a dynamic object that is determined by the value of XML.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# parse_xml()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Interprets a `string` as an XML value, converts the value to a JSON, and returns the value as `dynamic`.

## Syntax

`parse_xml(`*xml*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *xml*| `string` |  :heavy_check_mark: | The XML-formatted string value to parse.|

## Returns

An object of type [dynamic](scalar-data-types/dynamic.md) that is determined by the value of *xml*, or null, if the XML format is invalid.

The conversion is done as follows:

XML                                |JSON                                            |Access
-----------------------------------|------------------------------------------------|--------------
`<e/>`                             | { "e": null }                                  | o.e
`<e>text</e>`	                   | { "e": "text" }	                            | o.e
`<e name="value" />`               | { "e":{"@name": "value"} }	                    | o.e["@name"]
`<e name="value">text</e>`         | { "e": { "@name": "value", "#text": "text" } } | o.e["@name"] o.e["#text"]
`<e> <a>text</a> <b>text</b> </e>` | { "e": { "a": "text", "b": "text" } }	        | o.e.a o.e.b
`<e> <a>text</a> <a>text</a> </e>` | { "e": { "a": ["text", "text"] } }	            | o.e.a[0] o.e.a[1]
`<e> text <a>text</a> </e>`        | { "e": { "#text": "text", "a": "text" } }	    | 1`o.e["#text"] o.e.a

> [!NOTE]
>
> * Maximal input `string` length for `parse_xml` is 1 MB (1,048,576 bytes). Longer strings interpretation will result in a null object.
> * Only element nodes, attributes and text nodes will be translated. Everything else will be skipped.

## Example

In the following example, when `context_custom_metrics` is a `string` that looks like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<duration>
    <value>118.0</value>
    <count>5.0</count>
    <min>100.0</min>
    <max>150.0</max>
    <stdDev>0.0</stdDev>
    <sampledValue>118.0</sampledValue>
    <sum>118.0</sum>
</duration>
```

then the following CSL Fragment translates the XML to the following JSON:

```json
{
    "duration": {
        "value": 118.0,
        "count": 5.0,
        "min": 100.0,
        "max": 150.0,
        "stdDev": 0.0,
        "sampledValue": 118.0,
        "sum": 118.0
    }
}
```

and retrieves the value of the `duration` slot
in the object, and from that it retrieves two slots, `duration.value` and
 `duration.min` (`118.0` and `100.0`, respectively).

```kusto
T
| extend d=parse_xml(context_custom_metrics) 
| extend duration_value=d.duration.value, duration_min=d["duration"]["min"]
```
