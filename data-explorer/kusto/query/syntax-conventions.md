---
title: Syntax conventions for reference documentation - Azure Data Explorer
description: Learn about the syntax conventions for the Kusto Query Language and management command documentation.
ms.topic: reference
ms.date: 03/28/2023
---
# Syntax conventions for reference documentation

This article outlines the syntax conventions followed in the [Kusto Query Language (KQL)](index.md) and [management commands](../management/index.md) reference documentation.

## Syntax conventions

|Convention|Description|
|--|--|
|`Block`|String literals to be entered exactly as shown.|
|*Italic*|Parameters to be provided a value upon use of the function or command.|
|[ ] (square brackets)|Denotes that the enclosed item is optional.|
|`,` ...|Indicates that the preceding parameter can be repeated multiple times, separated by commas.|
|\| (pipe)|Indicates that you can only use one of the syntax items separated by the pipe(s).|
|`;`|Query statement terminator.|

### Example of syntax conventions

Consider the following example syntax:

`.command` *Resource* `action` `(` *SomeAction*`,` ... `)` [ `speedy` `=` `true` | `false` ]

Usage of this command might look as follows:

```kusto
.command TestDatabase action ( "test", "run", "debug" ) speedy = true
```

Let's break down the example usage step-by-step:

1. The name of the command, `.command`, is entered exactly as shown in the syntax.
1. The value TestDatabase is passed as an argument for the required *Resource* parameter.
1. The `action` keyword and parentheses are entered exactly as shown.
1. The strings "test", "run", and "debug" are passed as arguments for the *SomeAction* parameter. The "`,` ..." syntax indicates that one or more value can be provided for *SomeAction*.
1. The optional property `speedy` is set to `true`, though it could have been omitted.

## Working with optional parameters

To provide an argument for an optional parameter that comes after another optional parameter, you must provide an argument for the prior parameter. This requirement is because arguments must follow the order specified in the syntax. If you don't have a specific value to pass for the parameter, use an empty value of the same type.

### Example of sequential optional parameters

Consider the syntax for the [http_request plugin](http-request-plugin.md):

`evaluate` `http_request` `(` *Uri* [`,` *RequestHeaders* [`,` *Options*]] `)`

*RequestHeaders* and *Options* are optional parameters of type [dynamic](scalar-data-types/dynamic.md). To provide an argument for the *Options* parameter, you must also provide an argument for the *RequestHeaders* parameter. The following example shows how to provide an empty value for the first optional parameter, *RequestHeaders*, in order to be able to specify a value for the second optional parameter, *Options*.

`evaluate` `http_request` `(` "https://contoso.com/"`,` dynamic({})`,` dynamic({ EmployeeName: Nicole }) `)`

## See also

* [KQL overview](index.md)
* [KQL quick reference](../../kql-quick-reference.md)
