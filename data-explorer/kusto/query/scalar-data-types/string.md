---
title: The string data type - Azure Data Explorer | Microsoft Docs
description: This article describes The string data type in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# The string data type

The `string` data type represents a Unicode string. (Kusto strings are encoded in UTF-8 and by default are limited to 1MB.)

## string literals

There are several ways to encode literals of the `string` data type:
* By enclosing the string in double-quotes (`"`): `"This is a string literal. Single quote characters (') do not require escaping. Double quote characters (\") are escaped by a backslash (\\)"`
* By enclosing the string in single-quotes (`'`): `'Another string literal. Single quote characters (\') require escaping by a backslash (\\). Double quote characters (") do not require escaping.'`

In the two representations above, the backslash (`\`) character indicates escaping.
It is used to escapte the enclosing quote characters, tab characters (`\t`),
newline characters (`\n`), and itself (`\\`).

Verbatim string literals are also supported. In this form, the backslash character (`\`) stands for itself,
not as an escape character:

* Enclosed in double-quotes (`"`): `@"This is a verbatim string literal that ends with a backslash\"`
* Enclosed in single-quotes (`'`): `@'This is a verbatim string literal that ends with a backslash\'`

String literals that follow each other in the query text are automatically
concatenated together. For example, the following yields `13`:

```kusto
print strlen("Hello" ', ' @"world!")
```

## Examples

```kusto
// Simple string notation
print s1 = 'some string', s2 = "some other string"

// Strings that include single or double-quotes can be defined as follows 
print s1 = 'string with " (double quotes)', 
          s2 = "string with ' (single quotes)"
          
// Strings with '\' can be prefixed with '@' (as in c#)
print myPath1 = @'C:\Folder\filename.txt'

// Escaping using '\' notation
print s = '\\n.*(>|\'|=|\")[a-zA-Z0-9/+]{86}=='
```

As can be seen, when a string is enclosed in double-quotes (`"`), the single-quote (`'`)
character does not require escaping and vice-versa. This makes it easier to quote strings
according to context.

## Obfuscated string literals

Obfuscated string literals are strings that Kusto will remove when outputting the string (for example, when tracing).
The obfuscation process replaces all obfuscated characters by a star (`*`) character.

To form an obfuscated string literal, prepend `h` or 'H'. For example:
```kusto
h'hello'
h@'world' 
h"hello"
```