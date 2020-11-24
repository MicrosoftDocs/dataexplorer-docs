---
title: alter-merge table column-docstrings - Azure Data Explorer | Microsoft Docs
description: This article describes alter-merge table column-docstrings in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
---
# .alter-merge table column-docstrings

Sets the `docstring` property of one or more columns of the specified table. 
Columns not explicitly set **retain** their existing value for this property, if they have one.

For alter table column-docstring, see [below](#alter-table-column-docstrings).

**Syntax**

`.alter-merge` `table` *TableName* `column-docstring` `(` *Col1* `:` *Docstring1* [`,` *Col2* `:` *Docstring2*]... `)`

**Example** 

```kusto
.alter-merge table Table1 column-docstrings (Column1:"DocString1", Column2:"DocString2")
```

## alter table column-docstrings

Sets the `docstring` property of one or more columns of the specified table. 
Columns not explicitly set will have this property **removed**.

**Syntax**

`.alter` `table` *TableName* `column-docstring` `(` *Col1* `:` *Docstring1* [`,` *Col2* `:` *Docstring2*]... `)`

**Example** 

```kusto
.alter table Table1 column-docstrings (Column1:"DocString1", Column2:"DocString2")
```
