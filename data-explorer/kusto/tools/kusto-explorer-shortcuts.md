---
title: Kusto.Explorer keyboard shortcuts (hot keys) - Azure Data Explorer
description: This article describes Kusto.Explorer keyboard shortcuts (hot keys) in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/27/2023
---
# Kusto.Explorer keyboard shortcuts (hot keys)

## Application-level

The following keyboard shortcuts can be used in any context:

| Hot key | Description |
|--|--|
| <kbd>F1</kbd> | Opens the help |
| <kbd>F11</kbd> | Toggle full-view mode |
| <kbd>Ctrl</kbd>+<kbd>F1</kbd> | Toggle ribbon appearance |
| <kbd>Ctrl</kbd>+<kbd>+</kbd> | Increases query and data results font |
| <kbd>Ctrl</kbd>+<kbd>-</kbd> | Decreases query and data results font |
| <kbd>Ctrl</kbd>+<kbd>0</kbd> | Resets query and data results font |
| <kbd>Ctrl</kbd>+<kbd>1</kbd> .. <kbd>7</kbd> | Switches to Query document panel with the respective number (1..7) |
| <kbd>Ctrl</kbd>+<kbd>F2</kbd> | Renames header of the Query Editor panel |
| <kbd>Ctrl</kbd>+<kbd>N</kbd> | Opens a new query editor |
| <kbd>Ctrl</kbd>+<kbd>O</kbd> | Open query editor script in a new query editor |
| <kbd>Ctrl</kbd>+<kbd>W</kbd> | Closes active query editor |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Saves query into a file |
| <kbd>Shift</kbd>+<kbd>F3</kbd> | Opens Analytical Report Gallery |
| <kbd>Shift</kbd>+<kbd>F12</kbd> | Toggles the Light/Dark theme of the application |
| <kbd>Ctrl</kbd>+<kbd>F12</kbd> | Toggles Extended Accessibility events of the application (requires a restart to take effect) |
| <kbd>Alt</kbd>+<kbd>Ctrl</kbd>+<kbd>F12</kbd> | Opens Kusto.Explorer Calculator utility |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>O</kbd> | Opens Kusto.Explorer options and settings dialog |
| <kbd>Esc</kbd> | Cancel running query |
| <kbd>Shift</kbd>+<kbd>F5</kbd> | Cancel running query |

## Query and results view

You can use the following keyboard shortcuts with the query editor or when the context is in the results view:

| Hot key | Description |
|--|--|
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> | Copies query, deep-link, and data to the clipboard |
| <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> | Copies query and deep-link the clipboard in HTML format |
| <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> | Copies query, deep-link, and places data in the clipboard in Markdown format |
| <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd> | Copies query and deep-link the clipboard in Markdown format |
| <kbd>Ctrl</kbd>+<kbd>~</kbd> | Copies query and data to the clipboard in markdown format |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> | Toggles mode of hiding duplicate rows in the data view |
| <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd> | Toggles mode of hiding empty columns in the data view |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>J</kbd> | Toggles mode of collapsing columns with a single value in the data view |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd> | Opens a Query Analyzer tool in a new query panel |
| <kbd>Alt</kbd>+<kbd>C</kbd> | Renders Column chart over existing data |
| <kbd>Alt</kbd>+<kbd>T</kbd> | Renders Timeline chart over existing data |
| <kbd>Alt</kbd>+<kbd>A</kbd> | Renders Anomaly timeline chart over existing data |
| <kbd>Alt</kbd>+<kbd>P</kbd> | Renders Pie chart over existing data |
| <kbd>Alt</kbd>+<kbd>L</kbd> | Renders Ladder timeline chart over existing data |
| <kbd>Alt</kbd>+<kbd>V</kbd> | Renders Pivot chart over existing data |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> | Shows Timeline pivot over existing data |
| <kbd>Ctrl</kbd>+<kbd>F9</kbd> | Toggles `show only matching rows`/`highlight matching rows` modes for  client text search (<kbd>Ctrl</kbd>+<kbd>F</kbd>) behavior in the data grid. |
| <kbd>Ctrl</kbd>+<kbd>F10</kbd> | Shows details panel - where the selected row is presented as property grid |
| <kbd>Ctrl</kbd>+<kbd>F</kbd> | Shows the search box for the panel that is currently in focus. Supported in `Connections`, `Data Results`, and `Query Editor` panels |
| <kbd>Ctrl</kbd>+<kbd>Tab</kbd> | Shows Query Editor document selector dialog. You can hold <kbd>Ctrl</kbd> and switch between documents with <kbd>Tab</kbd> |
| <kbd>Ctrl</kbd>+<kbd>J</kbd> | Toggles the appearance of the result panel |
| <kbd>Ctrl</kbd>+<kbd>E</kbd> | Toggles the appearance of the query editor and result panel in the cycle of: `Query Editor and Results` -> `Query Editor` -> `Query Editor and Results` -> `Results` |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd> | Toggles the appearance of the query editor and result panel in the cycle of: `Query Editor and Results` -> `Results` -> `Query Editor and Results` -> `Query Editor` |
| <kbd>F6</kbd> | Toggles the focus of the main application panel in the cycle of: `Connections panel` -> `Query Editor` -> `Results` |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> | Focuses on Results panel |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> | Focuses on Connections panel |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Y</kbd> | Focuses on Query editor |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> | Focuses on Chart panel |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd> | Focuses on Query Information panel |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd> | Focuses on Query Statistics panel |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>K</kbd> | Focuses on Error panel |
| <kbd>Alt</kbd>+<kbd>Ctrl</kbd>+<kbd>L</kbd> | Locks current connection context to the Query Editor, so changing the selected row in the Connection panel has no effect on the Query Editor context. |

## Results Table Viewer

The following keyboard shortcuts can be used when the **Results** view (table) is in active keyboard focus:

| Hot key | Description |
|--|--|
| <kbd>Ctrl</kbd>+<kbd>Q</kbd> | Show current column context menu |
| <kbd>Ctrl</kbd>+<kbd>S</kbd> | Toggle current column sorting |
| <kbd>Ctrl</kbd>+<kbd>U</kbd> | Opens a panel showing current column values with client-side filtering |
| <kbd>Ctrl</kbd>+<kbd>F</kbd> | Shows search box for the results |
| <kbd>Ctrl</kbd>+<kbd>F3</kbd> | Toggles `show only matching rows`/`highlight matching rows` modes for client text search (<kbd>Ctrl</kbd>+<kbd>F</kbd>) behavior in the data grid. |

## Query editor

The following keyboard shortcuts can be used when editing a query in the query editor:

| Hot key | Description |
|--|--|
| <kbd>F1</kbd> | When the cursor points to an operator or function - opens a help window with information about the operator or function. If the help topic isn't present - opens a help URL |
| <kbd>F5</kbd> | Run currently selected query |
| <kbd>Shift</kbd>+<kbd>Enter</kbd> | Run currently selected query |
| <kbd>F8</kbd> | Fetch query results from the local cache. If results aren't present - run the currently selected query |
| <kbd>Ctrl</kbd>+<kbd>F5</kbd> | Preview results of the selected query (shows few results and total count) |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Space</kbd> | Insert data cell selections as filters into the query |
| <kbd>Ctrl</kbd>+<kbd>Space</kbd> | Force IntelliSense rules check. Possible options will be shown in any rule matched |
| <kbd>Ctrl</kbd>+<kbd>Enter</kbd> | Adds `pipe` symbol and moves to a new line |
| <kbd>Ctrl</kbd>+<kbd>Z</kbd> | Undo |
| <kbd>Ctrl</kbd>+<kbd>Y</kbd> | Redo |
| <kbd>Ctrl</kbd>+<kbd>L</kbd> | Deletes current line |
| <kbd>Ctrl</kbd>+<kbd>D</kbd> | Deletes current line |
| <kbd>Ctrl</kbd>+<kbd>F</kbd> | Opens `Find` dialog |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> | Opens `Find` dialog (all tabs lookup) |
| <kbd>Ctrl</kbd>+<kbd>H</kbd> | Opens `Replace` dialog |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd> | Opens `Replace` dialog (all tabs lookup) |
| <kbd>Ctrl</kbd>+<kbd>G</kbd> | Opens `Go-to line` dialog |
| <kbd>Ctrl</kbd>+<kbd>F8</kbd> | Show my queries past 3 days |
| <kbd>Ctrl</kbd>+ bracket | When the cursor is at a bracket symbol: `(` , `)` , `[` , `]` , `{` , `}` - moves the cursor to the matching opening or closing bracket |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Q</kbd> | Prettify current query |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd> | Make current query or selection lower-case |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>U</kbd> | Make current query or selection upper-case |
| <kbd>Ctrl</kbd>+<kbd>Mouse wheel up</kbd> | Increases font of the query editor |
| <kbd>Ctrl</kbd>+<kbd>Mouse wheel down</kbd> | Decreases font of the query editor |
| <kbd>Alt</kbd>+<kbd>P</kbd> | Opens query parameters dialog |
| <kbd>F2</kbd> | Open current line / selected text in editor dialog |
| <kbd>Ctrl</kbd>+<kbd>F6</kbd> | Runs KQL static query analysis to detect common issues |
| <kbd>F12</kbd> | Navigate to the definition of the symbol |
| <kbd>Alt</kbd>+<kbd>F12</kbd> | Find all references of the current symbol |
| <kbd>Alt</kbd>+<kbd>Home</kbd> | Navigate to the definition of the symbol |
| <kbd>Alt</kbd>+<kbd>Ctrl</kbd>+<kbd>M</kbd> | Extract currently selected literal or tabular expression as let statement |
| <kbd>Ctrl</kbd>+<kbd>.</kbd> | Extract currently selected literal or tabular expression as let statement |
| <kbd>Ctrl</kbd>+<kbd>R</kbd>, <kbd>Ctrl</kbd>+<kbd>R</kbd> | Renames current symbol |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>D</kbd> | Inserts current timestamp as `datetime` literal |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>R</kbd> | Inserts `range x from 1 to 1 step 1` snippet |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd> | Comment current line or selected lines |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>F</kbd> | Prettify current query |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>V</kbd> | Duplicate current query (append it to the end of current query document) |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>U</kbd> | Uncomment current line or selected lines |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd> | Turn current line or selected lines into multi-line string literal |
| <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>M</kbd> | Remove multi-line string literal marks (reverse of <kbd>Ctrl</kbd>, <kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>S</kbd>) |
| <kbd>Ctrl</kbd>+<kbd>M</kbd>, <kbd>Ctrl</kbd>+<kbd>M</kbd> | Toggle outlining expansion of the current query |
| <kbd>Ctrl</kbd>+<kbd>M</kbd>, <kbd>Ctrl</kbd>+<kbd>L</kbd> | Toggle outlining expansion of all queries in the document |

## JSON viewer

The following keyboard shortcuts can be used from within the results JSON viewer.
They display if you double-click on a JSON-like value in the results view cell:

| Hot key | Description |
|--|--|
| <kbd>Ctrl</kbd>+<kbd>UpArrow</kbd> | Navigate to parent |
| <kbd>Ctrl</kbd>+<kbd>RightArrow</kbd> | Expand current node (one level) |
| <kbd>Ctrl</kbd>+<kbd>LeftArrow</kbd> | Collapse current node (one level) |
| <kbd>Ctrl</kbd>+<kbd>.</kbd> | Toggle expansion of the current node (all child levels expanded/collapsed) |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd> | Toggle expansion of the current node parent (all child levels expanded/collapsed) |

## Connection panel

The following keyboard shortcuts can be used from within the **Connections** panel:

| Hot key | Description |
|--|--|
| <kbd>Ctrl</kbd>+<kbd>UpArrow</kbd> | Navigate to parent |
| <kbd>Ctrl</kbd>+<kbd>RightArrow</kbd> | Expand current node (one level) |
| <kbd>Ctrl</kbd>+<kbd>LeftArrow</kbd> | Collapse current node (one level) |
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd> | Collapse all levels |
| <kbd>Ctrl</kbd>+<kbd>R</kbd> | Refresh currently selected connection |
| <kbd>Insert</kbd> | Add a new connection |
| <kbd>Del</kbd> | Delete current connection |
| <kbd>Ctrl</kbd>+<kbd>E</kbd> | Edit currently selected connection |
| <kbd>Ctrl</kbd>+<kbd>T</kbd> | Open a new query editor using the currently selected connection |

## Diagnostics and Monitoring

The following keyboard shortcuts are available from the `Monitoring` ribbon.

| Hot key | Description |
|--|--|
| <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F1</kbd> | Run cluster diagnostic flow |
