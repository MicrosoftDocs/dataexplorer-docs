---
title: Kusto Explorer Code Refactoring - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto Explorer Code Refactoring in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/05/2019

---
# Kusto Explorer Code Refactoring

Similar to other IDEs, Kusto.Explorer offers several features to KQL query editing and refactoring.

## Rename variable or column name

Clicking `Ctrl`+`R`, `Ctrl`+`R` in the Query Editor window will allow you to rename currently selected symbol.

See below snapshot that demonstrates the experience:

![alt text](./Images/KustoTools-KustoExplorer/ke-refactor-rename.gif "refactor-rename")

## Extract scalars as `let` expressions

You can promote currently selected literal as `let` expression by clicking `Alt`+`Ctrl`+`M`. 

![alt text](./Images/KustoTools-KustoExplorer/ke-extract-as-let-literal.gif "extract-as-let-literal")

## Extract tabular statements as `let` expressions

You can also promote tabular expressions as `let` statements by selecting its text and then clicking `Alt`+`Ctrl`+`M`. 

![alt text](./Images/KustoTools-KustoExplorer/ke-extract-as-let-tabular.gif "extract-as-let-tabular")
