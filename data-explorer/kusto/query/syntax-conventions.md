---
title: Reference documentation syntax conventions - Azure Data Explorer
description: Learn about the syntax conventions for the Kusto Query Language and Azure Data Explorer management command documentation.
ms.topic: reference
ms.date: 03/23/2023
---
# Reference documentation syntax conventions

This article outlines the syntax conventions followed in the Kusto Query Language (KQL) and Azure Data Explorer management command reference documentation.

## Syntax conventions

|Syntax convention|Description|
|--|--|
|*Italic*|The name of a parameter.|
|`Block`|A string literal.|
|`|` (vertical bar)|Separates syntax items, and indicates that you can only use one of them.|
|[ ] (square brackets)|The enclosed item is considered to be an optional parameter.|
|`,`...|Indicates the preceding parameters can be repeated *n* number of times.|

## Optional parameters

Even if a parameter is optional, you may need to provide an empty value in order to specify a parameter later in the order. This requirement is because arguments must be provided in the order specified in the syntax. The best practice is to provide an empty value of the same type as the parameter.

### Example

Consider the [http_request plugin](http-request-plugin.md) syntax:

`evaluate` `http_request` `(` *Uri* [, *RequestHeaders* [, *Options*]] `)`

Based on this syntax, the *RequestHeaders* and *Options* are optional parameters of type [dynamic](scalar-data-types/dynamic.md). When invoking this plugin, if you want to specify *Options* then you must also specify *RequestHeaders*. If you don't have any value to pass, pass an empty dynamic property bag.

## See also

* [KQL overview](index.md)
* [KQL quick reference](../../kql-quick-reference.md)
