---
title: ".alter-merge column docstrings - Azure Data Explorer | Microsoft Docs"
description: "This article describes .alter-merge column docstrings in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/03/2022
---
# .alter-merge column-docstrings

Sets the `docstrings` property for one or more columns of a specified table. Columns not explicitly defined will keep any previous definition for this property, if it exists.

## Syntax

`.alter-merge` `table` *TableName* `column-docstrings` `(` *Col1* `:` *DocString1* [`,` *Col2* `:` *DocString2*]... `)`

## Arguments

- *DocString* - Free text that you can attach to a table/function/column to describe the entity. This string is presented in various UX settings next to the entity names.
- *TableName* - Name of the table on which the operation is performed.
- *Col* - Column on which the operation is performed.
- 
## Example 

```kusto
.alter-merge table Table1 column-docstrings (Column1:"DocString1", Column2:"DocString2")
```
