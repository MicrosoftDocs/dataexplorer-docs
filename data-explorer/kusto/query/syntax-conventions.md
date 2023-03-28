---
title: Syntax conventions for reference documentation - Azure Data Explorer
description: Learn about the syntax conventions for the Kusto Query Language and Azure Data Explorer management command documentation.
ms.topic: reference
ms.date: 03/28/2023
---
# Syntax conventions for reference documentation

This article outlines the syntax conventions followed in the [Kusto Query Language (KQL)](index.md) and Azure Data Explorer [management commands](../management/index.md) reference documentation.

## Syntax conventions

|Convention|Description|
|--|--|
|`Block`|String literals to be entered exactly as shown.|
|*Italic*|Parameters to be provided a value upon use of the function or command.|
|[ ] (square brackets)|Denotes that the enclosed item is an optional parameter.|
|`,`...*n*|Indicates that the preceding parameter can be repeated multiple times, separated by commas.|
|`|` (pipe)|When enclosed in brackets, indicates that you can only use one of the syntax items separated by the pipe(s).<br/><br/>When not enclosed in brackets, indicates a break between KQL operators in a tabular expression statement. The data is transformed and "piped" from one operator to the next.|
|`;`|Query statement terminator.|

## Working with optional parameters

To provide an argument for an optional parameter that comes after another optional parameter, you must provide an argument for the prior parameter. This requirement is because arguments must follow the order specified in the syntax. If you don't have a specific value to pass for the parameter, use an empty value of the same type.

### Example of sequential optional parameters

Consider the syntax for the [http_request plugin](http-request-plugin.md):

`evaluate` `http_request` `(` *Uri* [, *RequestHeaders* [, *Options*]] `)`

*RequestHeaders* and *Options* are optional parameters of type [dynamic](scalar-data-types/dynamic.md). To provide an argument for the *Options* parameter, you must also provide an argument for the *RequestHeaders* parameter. The following example shows how to provide an empty value for the first optional parameter, *RequestHeaders*, in order to be able to specify a value for the second optional parameter, *Options*.

`evaluate` `http_request` `("https://contoso.com/", dynamic({}), dynamic({ EmployeeName: Nicole }))`

## See also

* [KQL overview](index.md)
* [KQL quick reference](../../kql-quick-reference.md)
