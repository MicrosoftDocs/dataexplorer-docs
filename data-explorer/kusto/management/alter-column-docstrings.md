---
title: ".alter column docstring - Azure Data Explorer | Microsoft Docs"
description: "This article describes .alter column docstring in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/14/2021
---
# .alter column docstring

Sets the `docstring` property of one or more columns of the specified table.  Columns not explicitly set will have this property removed.

`DocString` is free text that you can attach to a table/function/column describing the entity. This string is presented in various UX settings next to the entity names.

## Syntax

`.alter` `table` *TableName* `column-docstrings` `(` *Col1* `:` *Docstring1* [`,` *Col2* `:` *Docstring2*]... `)`

## Example 

```kusto
.alter table Table1 column-docstring (Column1:"DocString1", Column2:"DocString2")
```
