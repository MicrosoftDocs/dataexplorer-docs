---
title: .alter-merge column docstrings - Azure Data Explorer | Microsoft Docs
description: This article describes .alter-merge column docstrings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/14/2021
---
# .alter-merge column docstrings

Sets the `docstring` property of one or more columns of the specified table. Columns not explicitly set retain their existing value for this property, if they have one.

`DocString` is free text that you can attach to a table/function/column describing the entity. This string is presented in various UX settings next to the entity names.

## Syntax

`.alter-merge` `table` *TableName* `column-docstring` `(` *Col1* `:` *Docstring1* [`,` *Col2* `:` *Docstring2*]... `)`

## Example 

```kusto
.alter-merge table Table1 column-docstrings (Column1:"DocString1", Column2:"DocString2")
```
