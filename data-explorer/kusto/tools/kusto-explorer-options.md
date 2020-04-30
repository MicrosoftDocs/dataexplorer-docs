---
title: ﻿Kusto Explorer options - Azure Data Explorer | Microsoft Docs
description: This article describes ﻿Kusto Explorer options in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 04/01/2020
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
  
## Query Editor

| Option | Description |
|---------|--------------|
| Queries auto-save | When enabled, the application automatically saves open documents. Changing this setting requires restarting the application to take effect. Enabled by default.|
| Track changes | When enabled, the application tracks changes made to query scripts on disk by other applications. If the query script is changed externally you'll be notified and prompted for reloading it. Changing this setting requires restarting the application. Enabled by default.|
| Use Edit Sessions | When enabled, each application process owns its own set of documents. Disabled by default.|
| Font Size | The font size used in the query editor.|
| Select command background | The background color used to highlight the currently selected command.|
| Replace tabs with spaces | When enabled, tabs are automatically replaced with spaces.|
| Disable function parameter injection | When enabled, function parameter injection from the clipboard is disabled.|
| Disable query parameter injection | When enabled, query parameter injection is disabled.|
| Disable query run triggers except F5 | When enabled, only the F5 key will trigger queries to run.|
| Show help inside the application | When enabled, Help topics are shown inside the application. When disabled Help topics are opened inside a browser.|
| Query parameter length limit | The maximal length of a string that can be used as a query parameter. Setting this value to more than 128K may cause performance issues. Default is 64K.|

## IntelliSense

| Option | Description |
|---------|--------------|
| IntelliSense Version | The version of IntelliSense engine used. *V1* is the classic engine. *V2* is the modern engine. Default is *V2*. |
| IntelliSense: Control Commands | The version of IntelliSense for control commands. *V1* is the classic engine. *V2* is the modern engine. Default is *V2*. | 
| IntelliSense | Enables or disables IntelliSense. Default is enabled.|
| Syntax Highlighting | Enables or disables syntax highlighting. Default is enabled.|
| Tool-tips | Enables or disables the tool-tips that appear when the mouse hovers over areas of the selected query. Default is enabled.|

## Formatter

| Option | Description |
|---------|--------------|
| Version | The version of the formatter used when the Prettify Query tool is applied to the current query. *V1* is the classic formatter. *V2* is the modern formatter. Default is *V2*.|
| Indentation | The number of spaces for indented items.|
| Function Braces | The placement of function braces. *Vertical* places open and close curly braces on new lines. *Horizontal* leaves the open brace on its original line and places the close brace on a new line. *None* leaves all braces as is.|
| Pipe Operator | The placement of the pipe (bar) character that exists between tabular query operators. *New Line* places all pipe characters on a new line. *Smart* places all pipe characters on a new line if the query already spans more than one line. *None* leaves all pipe characters as is.|
| Semicolon | The placement of semicolons that end query statements. *New Line* places semicolons on a new line, indented. *Smart* places semicolons on a new line if the statement itself spans more than one line.  *None* leaves semicolons as is.
| Insert Missing Syntax | Adds missing punctuation like (such as commas and semicolons) that you are getting error messages for.|

## Results Viewer

| Option | Description |
|---------|--------------|
| Font Size | The font size used by the data table grid, where query results are shown.|
| Verbosity color scheme | Selects the color scheme for row formatting base on auto-detected verbosity level.|
| Hide empty columns | When enabled, empty columns in the view showing data will be hidden.  Default is disabled.|
| Collapse single-value columns| When enabled, will auto-collapse single-value columns in the view showing data. Columns with single non-empty values will be shown as groups. Default is disabled.|
| Auto-sort results by datetime columns | When enabled, rows will be auto-sorted by datetime columns. Default is enabled.|
| Column visible range | The maximal amount of characters to be displayed in a column. Default is 2048.|
| Visualize JSON as text | When enabled, JSON values are visualized as text. Default is disabled.|
| Maximum Text Details Size | The maximum number of characters that will be shown in the detailed information panel when the cell is double-clicked. Default is 32KB.|

## Connections

| Option | Description |
|---------|--------------|
| Sort table columns alphabetically | When enabled, the columns appearing under the table nodes in the connections panel will be sorted alphabetically.|
| Query Server Timeout | The server timeout for query execution.|
| Warn on connection lock | When enabled, the application will warn about connection lock every time a connection switch is attempted. Default is enabled.|
| Lazy schema exploration | When enabled, the connections panel will only fetch and display database schema when the database node is expanded.|
| Show hidden system objects | When enabled, hidden system objects will be shown if the user has appropriate permissions.|
| Query weak consistency | When enabled, weak consistency will be used for queries.|
| Kusto parser version | The version of the parser used to execute queries. *V1* is the classic parser. *V2* is the modern parser. Default is *V1*.|

## Diagnostic Tracing

| Option | Description |
|---------|--------------|
| Enable Tracing | Enables tracing.|
| Trace verbosity | Sets the verbosity of tracing.|
| Traces location | The location where traces are logged.|
| PlatformTraceVerbosity | Sets the verbosity of tracing for the platform.| 