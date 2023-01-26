---
title: regex_quote() - Azure Data Explorer
description: Learn how to use the regex_quote() function to return a string that escapes all regular expression characters.
ms.reviewer: shanisolomon
ms.topic: reference
ms.date: 01/15/2023
---
# regex_quote()

Returns a string that escapes all regular expression characters.

## Syntax

`regex_quote(`*value*`)`

## Arguments

*value*: The string to escape.

## Returns

Returns *string* where all regex expression characters are escaped.

## Example

This statement:

```kusto
print result = regex_quote('(so$me.Te^xt)')
```

Returns the following results:

| result |
|---|
| `\(so\\$me\\.Te\\^xt\\)` |
