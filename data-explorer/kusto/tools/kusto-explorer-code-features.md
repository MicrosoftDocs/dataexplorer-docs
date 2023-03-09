---
title: Kusto Explorer Code Refactoring - Azure Data Explorer
description: This article describes Kusto Explorer Code features.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 06/05/2019
---

# Kusto.Explorer code features

<!-- Intro-->

## Kusto Explorer Code Refactoring

Similar to other IDEs, Kusto.Explorer offers several features to KQL query editing and refactoring.

## Rename variable or column name

Clicking `Ctrl`+`R`, `Ctrl`+`R` in the Query Editor window will allow you to rename currently selected symbol.

See below snapshot that demonstrates the experience:

![Animated GIF that shows a variable being renamed in the Query Editor window. Three occurrences are simultaneously replaced with the new name.](./Images/kusto-explorer-refactor/ke-refactor-rename.gif "refactor-rename")

## Extract scalars as `let` expressions

You can promote currently selected literal as `let` expression by clicking `Alt`+`Ctrl`+`M`. 

![Animated GIF. The Query Editor pointer starts on a literal expression. A let statement then appears that sets that literal value to a new variable.](./Images/kusto-explorer-refactor/ke-extract-as-let-literal.gif "extract-as-let-literal")

## Extract tabular statements as `let` expressions

You can also promote tabular expressions as `let` statements by selecting its text and then clicking `Alt`+`Ctrl`+`M`. 

![Animated GIF. A tabular expression is selected in the Query Editor. A let statement then appears that sets that tabular expression to a new variable.](./Images/kusto-explorer-refactor/ke-extract-as-let-tabular.gif "extract-as-let-tabular")

## Kusto Explorer Code Navigation

Kusto.Explorer provides several features for easy code navigation using query symbols information.

## Go-to symbol definition

You can navigate to the definition of the current symbol using `F12` or `Alt`+`Home` short-cut.

## List all references of a symbol

You can obtain all references of the current symbol using `Ctrl`+`F12` short-cut.

:::image type="content" source="images/kusto-explorer-codenav/ke-code-nav-references.gif" alt-text="References of a symbol Kusto Explorer Code Navigation.":::

## Kusto Explorer Code Analyzer

Kusto.Explorer provides code analyzer utility that automatically analyzes the current query and outputs a set of applicable improvement recommendations.

To view improvement recommendations, at the bottom of the result grid, select the **Issues** tab.

:::image type="content" source="images/kusto-explorer-code-analyzer/ke-code-analyze.gif" alt-text="Code analyzer GIF in Kusto Explorer.":::
