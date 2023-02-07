---
title: strlen() - Azure Data Explorer
description: Learn how to use the strlen() function to measure the length of the input string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/01/2023
---
# strlen()

Returns the length, in characters, of the input string.

## Syntax

`strlen(`*source*`)`

## Arguments

* *source*: The source string that will be measured for string length.

## Returns

Returns the length, in characters, of the input string.

>[!NOTE]
>This function counts Unicode [code points](https://en.wikipedia.org/wiki/Code_point).

## Examples

```kusto
print length = strlen("hello")
```

**Output**

|length|
|---|
|5|

```kusto
print length = strlen("⒦⒰⒮⒯⒪")
```

**Output**

|length|
|---|
|5|

```kusto
print strlen('Çedilla') // the first character is a grapheme cluster
                        // that requires 2 code points to represent
```

**Output**

|length|
|---|
|8|