---
title: ".alter-merge column docstring - Azure Data Explorer | Microsoft Docs"
description: "This article describes .alter-merge column docstring in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/14/2021
---
# .alter-merge column-docstring

Sets the `docstring` property for one or more columns of a specified table. Columns not explicitly defined will keep any previous definition for this property, if it exists.

`DocString` is free descriptive text that you can attach to a table/function/column. This string is presented in various UX settings next to the entity name.

## Syntax

`.alter-merge` `table` *TableName* `column-docstring` `(` *Col1* `:` *Docstring1* [`,` *Col2* `:` *Docstring2*]... `)`

## Example 

```kusto
.alter-merge table Table1 column-docstring (Column1:"DocString1", Column2:"DocString2")
```
