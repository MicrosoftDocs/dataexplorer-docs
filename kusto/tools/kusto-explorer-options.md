---
title:  Kusto Explorer options
description:  This article describes Kusto Explorer options.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/20/2023
---
# Kusto Explorer options

The following tables describe the options for customizing the behavior of Kusto.Explorer from the **Tools** > **Options** dialog box.

## General Settings

| Option | Description |
|---------|--------------|
| Tool Mode | Enables beta, alpha and experimental application features. Default is none.|
| Extended Accessibility | When enabled, the application sends accessibility events used by accessibility tools. May affect performance if enabled. Default is disabled. |
| Allow sending telemetry data | When enabled, the application sends telemetry data when errors occur or the application crashes. |
| Welcome message | When enabled, the application shows the welcome message on start. Default is enabled.|
| Display theme | The application UI color scheme: light or dark.|
| Use legacy display themes| Enables and disables using legacy themes. |
| Multi-line Query tabs| Enables and disables multi-line arrangement of the query panel tabs. Default is enabled. |
  
## Query editor

| Option | Description |
|---------|--------------|
| Queries auto-save | When enabled, the application automatically saves open documents. Changing this setting requires restarting the application to take effect. Enabled by default.|
| Track changes | When enabled, the application tracks changes made to query scripts on disk by other applications. If the query script is changed externally, you'll be notified and prompted for reloading it. Changing this setting requires restarting the application. Enabled by default.|
| Use Edit Sessions | When enabled, each application process owns its own set of documents. Disabled by default.|
| Font| The font used in the Query editor.|
| Font Size | The font size used in the query editor.|
| Select command background | The background color used to highlight the currently selected command.|
| Replace tabs with spaces | When enabled, tabs are automatically replaced with spaces.|
| Disable function parameter injection | When enabled, function parameter injection from the clipboard is disabled.|
| Disable query parameter injection | When enabled, query parameter injection is disabled.|
| Disable query run triggers except F5 | When enabled, only the F5 key triggers queries to run.|
| Show help inside the application | When enabled, Help topics are shown inside the application. When disabled Help topics are opened inside a browser.|
| Query parameter length limit | The maximal length of a string that can be used as a query parameter. Setting this value to more than 128K may cause performance issues. Default is 64K.|
| Quick replacements| Invoke "Quick replacement" by pressing Ctrl+Space in the query editor when the caret is at the text to be replaced.|
|Auto-prettify text on paste| Auto-formats and prettifies pasted text in the query editor for text greater than 100 characters. Disabled by default.|

## IntelliSense

| Option | Description |
|---------|--------------|
| IntelliSense | Enables or disables IntelliSense. Default is enabled.|
| IntelliSense- Command Version | Chooses the IntelliSense version for management commands. Default: mixed.|
| Syntax Highlighting | Enables or disables syntax highlighting. Default is enabled.|
| Issues List | Displays the issues list for the current query or command in the editor.|
| Issue Options| Adjust which issues appear in the issues list.|
| Tool-tips | Enables or disables the tool-tips that appear when the mouse hovers over areas of the selected query. Default is enabled.|

## Formatter

| Option | Description |
|---------|--------------|
| Version | The version of the formatter used when the Prettify Query tool is applied to the current query. *V1* is the classic formatter. *V2* is the modern formatter. Default is *V2*.|
| Indentation | The number of spaces for indented items.|
| Bracketing Style| The placement of braces, parentheses, and brackets.|
| Schema| The alignment of the parentheses around a schema declaration, when on separate lines.|
| Data Table Values| The alignment of brackets around data table values, when on separate lines.|
| Function Body| The alignment of function body brace. * when on separate lines.
| Function Parameters| The alignment of function parameter parentheses, when on separate lines.|
| Function Arguments| The alignment of function argument parentheses, when on separate lines. |
| Pipe Operator | The placement of the pipe (bar) character that exists between tabular query operators. *New Line* places all pipe characters on a new line. *Smart* places all pipe characters on a new line if the query already spans more than one line. *None* leaves all pipe characters as is.|
| Expression| The placement of expressions in lists. |
| Statement | The placement of statements. |
| Semicolon | The placement of semicolons that end query statements. *New Line* places semicolons on a new line, indented. *Smart* places semicolons on a new line if the statement itself spans more than one line.  *None* leaves semicolons as is.
| Insert Missing Syntax | Adds missing punctuation like (such as commas and semicolons) that you're getting error messages for.|

## Results Viewer

| Option | Description |
|---------|--------------|
| Font Size | The font size used by the data table grid, where query results are shown.|
| Font | Font family used to display results.|
| Max lines per cell | Maximum number of lines to show in each cell. Changing the setting to '-1' will result in unlimited lines per cell. Default is eight lines per cell.|
| Numeric formatting | Formatting used for numbers. Default  is no formatting. |
| Verbosity color scheme | Selects the color scheme for row formatting based on autodetected verbosity level.|
| Hide empty columns | When enabled, empty columns in the view showing data will be hidden.  Default is disabled.|
| Collapse single-value columns| When enabled, will autocollapse single-value columns in the view showing data. Columns with single nonempty values will be shown as groups. Default is disabled.|
| Templated value replacement | When enabled, you can interpolate the template column 'body:string' using the other columns, and the properties column 'env_properties:dynamic'. Interpolation is done for the pattern '{columnOrPropertyName}'. This option requires the result to have a 'body' and 'env_properties' columns. Default is disabled.
| Auto-sort results by datetime columns | When enabled, rows will be auto-sorted by datetime columns. Default is enabled.|
| Column visible range | The maximal number of characters to be displayed in a column. Default is 2048.|
| Text wrapping | When enabled, text that doesn't fit into cell width will be wrapped according to the column width. Default is disabled.|
| Visualize JSON as text | When enabled, JSON values are visualized as single-row text. Default is disabled.|
| Maximum Text Details Size | The maximum number of characters that will be shown in the detailed information panel when the cell is double-clicked. Default is 32KB.|
| Play Completion Sound | Plays sounds when query or command is completed. Default is disabled. |

## Connections

| Option | Description |
|---------|--------------|
| Additional Trusted Hosts | Lists additional trusted hosts that are considered safe to connect to. Use ';' to specify more than a single host, and '*' to specify a multiple-domain pattern.|
| Sort table columns alphabetically | When enabled, the columns appearing under the table nodes in the connections panel will be sorted alphabetically.|
| Show Views in 'Function' folder | When enabled, functions with the 'view=true' tag will appear under the Functions folder or Connections panel.|
| Query Server Timeout | The server timeout for query execution.|
| Admin Command Server Timeout | Specifies the server timeout for admin command execution.|
| Lazy schema exploration | When enabled, the connections panel will only fetch and display database schema when the database node is expanded.|
| Show hidden system objects | When enabled, hidden system objects will be shown if the user has appropriate permissions.|
| Query weak consistency | When enabled, weak consistency will be used for queries.|
| Query results protocol | Determines which version of the Query results protocol version will be used when executing a query.|
| KQL parses version | Determines which version of the Kusto Query Language parser will be used when executing a query. |
| Allow unsafe connections | Allows using unsafe connection protocols for local dev/test environments.|

## Diagnostic Tracing

| Option | Description |
|---------|--------------|
| Enable Tracing | Enables tracing.|
| Trace verbosity | Sets the verbosity of tracing.|
| Traces location | The location where traces are logged.|
| PlatformTraceVerbosity | Sets the verbosity of tracing for the platform.|

## Tools

| Option | Description |
|---------|--------------|
| Export Visible Result Only | When enabled, exporting results to clipboard only exports the data from currently visible results tab.|
