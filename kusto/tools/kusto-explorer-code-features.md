---
title:  Kusto Explorer code features
description: This article describes Kusto Explorer Code features.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/19/2023
---

# Kusto.Explorer code features

Similar to other IDEs, Kusto.Explorer offers a variety of code features, including [Code refactoring](#code-refactoring), [Code navigation](#code-navigation), and a [Code analyzer](#code-analyzer) utility.

## Code refactoring

Use Kusto.Explorer's KQL query editing and refactoring features to rename variables and column names, and extract scalars and tabular statements as `let` expressions.

### Rename variable or column name

Rename selected symbols by clicking `Ctrl`+`R` in the query editor window.

![Animated GIF that shows a variable being renamed in the Query Editor window. Three occurrences are simultaneously replaced with the new name.](./media/kusto-explorer-code-features/ke-refactor-rename.gif "refactor-rename")

### Extract scalars as `let` expressions

To define selected literals as `let` expressions, press `Alt`+`Ctrl`+`M`.

![Animated GIF. The Query Editor pointer starts on a literal expression. A let statement then appears that sets that literal value to a new variable.](./media/kusto-explorer-code-features/ke-extract-as-let-literal.gif "extract-as-let-literal")

### Extract tabular statements as `let` expressions

To define tabular expressions as `let` statements, select the text, and then press `Alt`+`Ctrl`+`M`.

![Animated GIF. A tabular expression is selected in the Query Editor. A let statement then appears that sets that tabular expression to a new variable.](./media/kusto-explorer-code-features/ke-extract-as-let-tabular.gif "extract-as-let-tabular")

## Code navigation

Kusto.Explorer provides several features for easy code navigation using query symbols information.

### Go-to symbol definition

You can navigate to the definition of the current symbol using `F12` or the `Alt`+`Home` shortcuts.

### List all references of a symbol

You can obtain all references of the current symbol using the `Ctrl`+`F12` shortcut.

:::image type="content" source="media/kusto-explorer-code-features/ke-code-nav-references.gif" alt-text="References of a symbol Kusto Explorer Code Navigation.":::

For more information on keyboard shortcuts in Kusto.Explorer, see [Keyboard shortcuts](../tools/kusto-explorer-shortcuts.md).

## Code analyzer

Use Kusto.Explorer's code analyzer utility to automatically analyze the current query and output a set of applicable improvement recommendations.

To view improvement recommendations, at the bottom of the result grid, select the **Issues** tab.

:::image type="content" source="media/kusto-explorer-code-features/ke-code-analyze.gif" alt-text="Code analyzer GIF in Kusto Explorer.":::
