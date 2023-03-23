---
title: Syntax conventions of reference documentation - Azure Data Explorer
description: Learn about the syntax conventions for the Kusto Query Language and Azure Data Explorer management command documentation.
ms.topic: reference
ms.date: 03/23/2023
---
# Syntax conventions of reference documentation

This article outlines the syntax conventions followed in the [Kusto Query Language (KQL)](index.md) and Azure Data Explorer [management commands](../management/index.md) reference documentation.

## Syntax conventions

|Syntax convention|Description|
|--|--|
|*Italic*|Parameters to be provided a value upon use of the function or command.|
|`Block`|String literals to be entered exactly as shown.|
|[ ] (square brackets)|Denotes that the enclosed item is an optional parameter.|
|`|` (pipe)|When enclosed in brackets, indicates that you can only use one of the syntax items on either side of the pipe.<br/><br/>When not enclosed in brackets, indicates a break between KQL operators in a tabular expression statement. The data is transformed and "piped" from one operator to the next.|
|`,`...|Indicates the preceding parameter can be repeated multiple times, separated by commas.|
|`;`|Query statement terminator.|

## Optional parameters

Even if a parameter is optional, you may need to provide an empty value in order to specify a parameter later in the order. This requirement is because arguments must be provided in the order specified in the syntax. The best practice is to provide an empty value of the same type as the parameter.

### Example

Consider the [http_request plugin](http-request-plugin.md) syntax:

`evaluate` `http_request` `(` *Uri* [, *RequestHeaders* [, *Options*]] `)`

Based on this syntax, the *RequestHeaders* and *Options* are optional parameters of type [dynamic](scalar-data-types/dynamic.md). When invoking this plugin, if you want to specify *Options* then you must also specify *RequestHeaders*. If you don't have any value to pass, pass an empty dynamic property bag.

## See also

* [KQL overview](index.md)
* [KQL quick reference](../../kql-quick-reference.md)
