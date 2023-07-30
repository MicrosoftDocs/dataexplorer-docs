---
title: Kusto.Explorer keyboard shortcuts (hot-keys) - Azure Data Explorer
description: This article describes Kusto.Explorer keyboard shortcuts (hot-keys) in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/08/2023
---
# Kusto.Explorer keyboard shortcuts (hot-keys)

## Application-level

The following keyboard shortcuts can be used from any context:

|Hot Key|Description|
|-------|-----------|
|`F1`     | Opens the help|
|`F11`    | Toggle full-view mode|
|`Ctrl`+`F1`| Toggle ribbon appearance |
|`Ctrl`+`+`| Increases query and data results font|
|`Ctrl`+`-`| Decreases query and data results font|
|`Ctrl`+`0`| Resets query and data results font|
|`Ctrl`+`1` .. `7`| Switches to Query document panel with respective number (1..7)|
|`Ctrl`+`F2`|Renames header of the Query Editor panel|
|`Ctrl`+`N` |Opens a new query editor|
|`Ctrl`+`O` |Open query editor script in a new query editor|
|`Ctrl`+`W` |Closes active query editor|
|`Ctrl`+`S` |Saves query into a file|
|`Shift`+`F3` | Opens Analytical Report Gallery|
|`Shift`+`F12`| Toggles Light/Dark theme of the application|
|`Ctrl`+`F12`| Toggles Extended Accessibility events of the application (requires restart to take effect)|
|`Alt`+`Ctrl`+`F12`| Opens Kusto.Explorer Calculator utility |
|`Ctrl`+`Shift`+`O`|Opens Kusto.Explorer options and settings dialog|
|`Esc`|Cancel running query|
|`Shift`+`F5`|Cancel running query|

## Query and results view

You can use the following keyboard shortcuts with the query editor or when the context is in the results view:

|Hot Key|Description|
|-------|-----------|
|`Ctrl`+`Shift`+`C`|Copies query, deep-link, and data to the clipboard|
|`Alt`+`Shift`+`C` |Copies query and deep-link the clipboard in HTML format|
|`Alt`+`Shift`+`R` |Copies query, deep-link, and places data in the clipboard in Markdown format|
|`Alt`+`Shift`+`M` |Copies query and deep-link the clipboard in Markdown format|
|`Ctrl`+`~` |Copies query and data to the clipboard in markdown format |
|`Ctrl`+`Shift`+`D`|Toggles mode of hiding duplicate rows in the data view|
|`Alt`+`Shift`+`H`|Toggles mode of hiding empty columns in the data view|
|`Ctrl`+`Shift`+`J`|Toggles mode of collapsing columns with single value in the data view|
|`Ctrl`+`Shift`+`A`|Opens a Query Analyzer tool in a new query panel|
|`Alt`+`C`  |Renders Column chart over existing data|
|`Alt`+`T`  |Renders Timeline chart over existing data|
|`Alt`+`A`  |Renders Anomaly timeline chart over existing data|
|`Alt`+`P`  |Renders Pie chart over existing data|
|`Alt`+`L`  |Renders Ladder timeline chart over existing data|
|`Alt`+`V`  |Renders Pivot chart over existing data|
|`Ctrl`+`Shift`+`V`|Shows Timeline pivot over existing data|
|`Ctrl`+`F9`  | Toggles `show only matching rows`/`highlight matching rows` modes for  client text search (`Ctrl`+`F`) behavior in data grid. |
|`Ctrl`+`F10` |Shows details panel - where selected row is presented as property  grid|
|`Ctrl`+`F`  | Shows search box for the panel that is currently in focus. Supported in `Connections`, `Data Results`, and `Query Editor` panels|
|`Ctrl`+`Tab`| Shows Query Editor document selector dialog. You can hold `Ctrl` and switch between documents with `Tab` |
|`Ctrl`+`J`|Toggles appearance of the result panel|
|`Ctrl`+`E`|Toggles appearance of the query editor and result panel in cycle of: `Query Editor and Results` -> `Query Editor` -> `Query Editor and Results` -> `Results` |
|`Ctrl`+`Shift`+`E`|Toggles appearance of the query editor and result panel in cycle of: `Query Editor and Results` -> `Results` -> `Query Editor and Results` -> `Query Editor` |
|`F6`|Toggles focus of the main application panel in cycle of: `Connections panel` -> `Query Editor` -> `Results`  |
|`Ctrl`+`Shift`+`R` | Focuses on Results panel |
|`Ctrl`+`Shift`+`T` | Focuses on Connections panel |
|`Ctrl`+`Shift`+`Y` | Focuses on Query editor |
|`Ctrl`+`Shift`+`P` | Focuses on Chart panel |
|`Ctrl`+`Shift`+`I` | Focuses on Query Information panel |
|`Ctrl`+`Shift`+`S` | Focuses on Query Statistics panel |
|`Ctrl`+`Shift`+`K` | Focuses on Error panel |
|`Alt`+`Ctrl`+`L`|Locks current connection context to the Query Editor, so changing selected row in the Connection panel has no effect on the Query Editor context. |

## Results Table Viewer

The following keyboard shortcuts can be used when results view (table) is in active keyboard focus:

|Hot Key|Description|
|-----------|-----------|
|`Ctrl`+`Q` |Show current column context menu|
|`Ctrl`+`S` |Toggle current column sorting|
|`Ctrl`+`U` |Opens a panel showing current column values with client-side filtering|
|`Ctrl`+`F` | Shows search box for the results|
|`Ctrl`+`F3`| Toggles `show only matching rows`/`highlight matching rows` modes for client text search (`Ctrl`+`F`) behavior in data grid. |

## Query editor

The following keyboard shortcuts can be used when editing a query in the query editor:

|Hot Key|Description|
|-------|-----------|
|`F1`|When cursor points to an operator or function - opens a help window with information about the operator or function. If the help topic isn't present - opens a help URL|
|`F5`|Run currently selected query|
|`Shift`+`Enter`|Run currently selected query|
|`F8`|Fetch query results from the local cache. If results aren't present - run currently selected query|
|`Ctrl`+`F5` | Preview results of the selected query (shows few results and total count)|
|`Ctrl`+`Shift`+`Space`| Insert data cell selections as filters into the query|
|`Ctrl`+`Space`| Force IntelliSense rules check. Possible options will be shown in any rule matched |
|`Ctrl`+`Enter`| Adds `pipe` symbol and moves to a new line|
|`Ctrl`+`Z`| Undo |
|`Ctrl`+`Y`| Redo |
|`Ctrl`+`L`| Deletes current line|
|`Ctrl`+`D`| Deletes current line|
|`Ctrl`+`F`| Opens `Find` dialog |
|`Ctrl`+`Shift`+`F`| Opens `Find` dialog (all tabs lookup) |
|`Ctrl`+`H`| Opens `Replace` dialog |
|`Ctrl`+`Shift`+`H`| Opens `Replace` dialog (all tabs lookup) |
|`Ctrl`+`G`| Opens `Go-to line` dialog |
|`Ctrl`+`F8` | Show my queries past 3 days |
|`Ctrl`+ bracket | When cursor is at bracket symbols: `(` , `)` , `[` , `]` , `{` , `}` - moves cursor to the matching opening or closing bracket |
|`Ctrl`+`Shift`+`Q` | Prettify current query |
|`Ctrl`+`Shift`+`L` | Make current query or selection lower-case |
|`Ctrl`+`Shift`+`U` |  Make current query or selection upper-case |
|`Ctrl`+`Mouse wheel up`| Increases font of the query editor|
|`Ctrl`+`Mouse wheel down`| Decreases font of the query editor|
|`Alt`+`P` | Opens query parameters dialog |
|`F2`| Open current line / selected text in editor dialog |
|`Ctrl`+`F6`| Runs KQL static query analysis to detect common issues |
|`F12`| Navigate to the definition of the symbol |
|`Alt`+`F12`| Find all references of the current symbol |
|`Alt`+`Home`| Navigate to the definition of the symbol |
|`Alt`+`Ctrl`+`M`| Extract currently selected literal or tabular expression as let statement |
|`Ctrl`+`.`| Extract currently selected literal or tabular expression as let statement |
|`Ctrl`+`R`, `Ctrl`+`R` | Renames current symbol |
|`Ctrl`+`K`, `Ctrl`+`D` | Inserts current timestamp as datetime literal |
|`Ctrl`+`K`, `Ctrl`+`R` | Inserts `range x from 1 to 1 step 1` snippet |
|`Ctrl`+`K`, `Ctrl`+`C` | Comment current line or selected lines |
|`Ctrl`+`K`, `Ctrl`+`F` | Prettify current query |
|`Ctrl`+`K`, `Ctrl`+`V` | Duplicate current query (append it to the end of current query document) |
|`Ctrl`+`K`, `Ctrl`+`U` | Uncomment current line or selected lines |
|`Ctrl`+`K`, `Ctrl`+`S` | Turn current line or selected lines into multi-line string literal |
|`Ctrl`+`K`, `Ctrl`+`M` | Remove multi-line string literal marks (reverse of `Ctrl`+`K`, `Ctrl`+`S`) |
|`Ctrl`+`M`, `Ctrl`+`M` | Toggle outlining expansion of the current query |
|`Ctrl`+`M`, `Ctrl`+`L` | Toggle outlining expansion of all queries in the document |

## JSON viewer

The following keyboard shortcuts can be used from within the results JSON viewer.
They display if you double-click on a JSON-like value in the results view cell:

|Hot Key|Description|
|-------|-----------|
|`Ctrl`+`Up Arrow`|Navigate to parent|
|`Ctrl`+`Right Arrow`|Expand current node (one level)|
|`Ctrl`+`Left Arrow`|Collapse current node (one level)|
|`Ctrl`+`.`|Toggle expansion of the current node (all child levels expanded/collapsed)
|`Ctrl`+`Shift`+`.`|Toggle expansion of the current node parent (all child levels expanded/collapsed)|

## Connection panel

The following keyboard shortcuts can be used from within the results JSON viewer.
They display if you double-click on a JSON-like value in the results view cell:

|Hot Key|Description|
|-------|-----------|
|`Ctrl`+`Up` Arrow|Navigate to parent|
|`Ctrl`+`Right` Arrow|Expand current node (one level)|
|`Ctrl`+`Left` Arrow|Collapse current node (one level)|
|`Ctrl`+`Shift`+`L`|Collapse all levels|
|`Ctrl`+`R`|Refresh currently selected connection|
|`Insert`|Add a new connection|
|`Del`|Delete current connection|
|`Ctrl`+`E`|Edit currently selected connection|
|`Ctrl`+`T`|Open a new query editor using currently selected connection|

## Diagnostics and Monitoring

The following keyboard shortcuts are available from `Monitoring` ribbon.

|Hot Key|Description|
|-----------|-----------|
|`Ctrl`+`Shift`+`F1`|Run cluster diagnostic flow|
