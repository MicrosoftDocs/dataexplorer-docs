---
title: Azure Data Explorer web UI query keyboard shortcuts
description: This article describes Azure Data Explorer query keyboard shortcuts (hot keys) in Azure Data Explorer web UI.
ms.reviewer: mibar
ms.topic: reference
ms.date: 05/28/2023
---

# Azure Data Explorer web UI keyboard shortcuts

Keyboard shortcuts provide a quick way to navigate websites, and allow users to work more efficiently. Instead of using a pointing device, you use keys, or combinations of keys, to run tasks. This article lists Windows keyboard shortcuts that work in the Azure Data Explorer web UI query editor window and results viewer.

In the query editor, select <kbd>F1</kbd> to view a list of keyboard shortcuts in the command palette.

The letters that appear below represent letter keys on your keyboard. For example, to use <kbd>G</kbd>+<kbd>N</kbd>, hold down the <kbd>G</kbd> key and then press <kbd>N</kbd>. If the command is <kbd>Ctrl</kbd>+<kbd>K</kbd> <kbd>Ctrl</kbd>+<kbd>X</kbd>, keep pressing <kbd>Ctrl</kbd>, and simultaneously press <kbd>K</kbd> and then <kbd>X</kbd>.

## Query editor

| To do this action                             | Press                                                        |
| --------------------------------------------- | ------------------------------------------------------------ |
| Show command palette                          | <kbd>F1</kbd>                                                |
| Copy query link to clipboard                  | <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>L</kbd>                 |
| Copy query and link to clipboard              | <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>C</kbd>                 |
| Copy line(s) up                               | <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>UpArrow</kbd>           |
| Copy line(s) down                             | <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>DownArrow</kbd>         |
| Toggle line(s) comment                        | <kbd>Ctrl</kbd>+<kbd>/</kbd>                                 |
| Find                                          | <kbd>Ctrl</kbd>+<kbd>F</kbd>                                 |
| Fold                                          | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>[</kbd>                |
| Fold all                                      | <kbd>Ctrl</kbd>+<kbd>K</kbd> <kbd>Ctrl</kbd>+<kbd>0</kbd>    |
| Format selection                              | <kbd>Ctrl</kbd>+<kbd>K</kbd> <kbd>Ctrl</kbd>+<kbd>F</kbd>    |
| Format all                                    | <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd>                 |
| Go to line                                    | <kbd>Ctrl</kbd>+<kbd>G</kbd>                                 |
| Go to Next Problem (Error, Warning, Info)     | <kbd>Alt</kbd>+<kbd>F8</kbd>                                 |
| Go to Previous Problem (Error, Warning, Info) | <kbd>Shift</kbd>+<kbd>F8</kbd>                               |
| Insert line above                             | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd>            |
| Insert Line Below                             | <kbd>Ctrl</kbd>+<kbd>Enter</kbd>                             |
| Move line down                                | <kbd>Alt</kbd>+<kbd>DownArrow</kbd>                          |
| Move line up                                  | <kbd>Alt</kbd>+<kbd>UpArrow</kbd>                            |
| Add new tab                                   | <kbd>Ctrl</kbd>+<kbd>J</kbd>                                 |
| Show Editor Context Menu                      | <kbd>Shift</kbd>+<kbd>F10</kbd>                              |
| Switch to tab on the left                     | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>[</kbd>                  |
| Switch to tab on the right                    | <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>]</kbd>                  |
| Unfold                                        | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>]</kbd>                |
| Unfold all                                    | <kbd>Ctrl</kbd>+<kbd>K</kbd> <kbd>Ctrl</kbd>+<kbd>J</kbd>    |
| Run query                                     | <kbd>Shift</kbd>+<kbd>Enter</kbd>                            |
| Recall execution result                       | <kbd>F8</kbd>                                                |
| Reopen closed tab                             | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> |

<!-- | Go to definition                              | <kbd>Ctrl</kbd>+<kbd>F12</kbd>                               | // Line 32-->

## Results viewer

| To do this action                                     | Press                                             |
| ----------------------------------------------------- | ------------------------------------------------- |
| Insert data cell selections as filters into the query | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> |
| [Column header] Toggle the sorting state              | <kbd>Enter</kbd>                                  |
| [Column header] Open the menu for the focused header  | <kbd>Shift</kbd>+<kbd>Enter</kbd>                 |

## Related content

* [Azure Data Explorer web UI query overview](web-ui-query-overview.md)
* [Write Kusto Query Language queries in the web UI](web-ui-kql.md)
* [Tutorial: Learn common Kusto Query Language operators](kusto/query/tutorials/learn-common-operators.md)
* [Visualize data with Azure Data Explorer dashboards](azure-data-explorer-dashboards.md)
