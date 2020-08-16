---
title: Kusto.Explorer installation and user interface
description: Learn about the features of Kusto.Explorer and how it can help you to explore your data
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: overview
ms.date: 05/19/2020
---

# Kusto.Explorer installation and user interface

Kusto.Explorer is a rich desktop application that enables you to explore your data using the Kusto Query Language in an easy-to-use user interface. This overview explains how to get started with setting up your Kusto.Explorer and explains the user interface you will use.

With Kusto.Explorer, you can:
* [Query your data](kusto-explorer-using.md#query-mode).
* [Search your data](kusto-explorer-using.md#search-mode) across tables.
* [Visualize your data](#visualizations-section) in a wide variety of graphs.
* [Share queries and results](kusto-explorer-using.md#share-queries-and-results) by email or using deep links.

## Installing Kusto.Explorer

* Install the [Kusto.Explorer tool](https://aka.ms/ke).

* Instead, access your Kusto cluster with your browser at: 
`https://<your_cluster>.kusto.windows.net.`
     Replace &lt;your_cluster&gt; with your Azure Data Explorer cluster name.

### Using Chrome and Kusto.Explorer

If you use Chrome as your default browser, make sure to install the ClickOnce extension for Chrome:

[https://chrome.google.com/webstore/detail/clickonce-for-google-chro/kekahkplibinaibelipdcikofmedafmb/related?hl=en-US](https://chrome.google.com/webstore/detail/clickonce-for-google-chro/kekahkplibinaibelipdcikofmedafmb/related?hl=en-US)

## Overview of the user interface

The Kusto.Explorer user interface is designed with a layout based on tabs and panels, similar to that of other Microsoft products: 

1. Navigate through the tabs on the [menu panel](#menu-panel) to perform various operations
2. Manage your connections in the [connections panel](#connections-panel)
3. Create scripts to run in the script panel
4. View the results of the scripts in the results panel

:::image type="content" source="images/kusto-explorer/ke-start.png" alt-text="Kusto Explorer start":::

## Menu panel

Kusto.Explorer Menu panel includes the following tabs:

* [Home](#home-tab)
* [File](#file-tab)
* [Connections](#connections-tab)
* [View](#view-tab)
* [Tools](#tools-tab)
* [Monitoring](#monitoring-tab)
* [Management](#management-tab)
* [Help](#help-tab)

### Home tab

:::image type="content" source="images/kusto-explorer/home-tab.png" alt-text="Kusto Explorer home tab":::

The Home tab shows the most recently used functions, divided into sections:

* [Query](#query-section)
* [Share](#share-section)
* [Visualizations](#visualizations-section)
* [View](#view-section)
* [Help](#help-tab) 

### Query section

:::image type="content" source="images/kusto-explorer/home-query-menu.png" alt-text="Query menu Kusto Explorer":::

|Menu|    Behavior|
|----|----------|
|Mode dropdown | <ul><li>Query mode: Switches Query Window into a [script mode](kusto-explorer-using.md#query-mode). Commands can be loaded and saved as scripts (default)</li> <li> Search mode: A single query mode where each command entered is processed immediately and presents a result in the Result Window</li> <li>Search++ mode: Allows searching for a term using search syntax across one or more tables. Learn more about using [Search++ Mode](kusto-explorer-using.md#search-mode)</li></ul> |
|New Tab| Opens a new tab for querying Kusto |

### Share section

:::image type="content" source="images/kusto-explorer/home-share-menu.png" alt-text="Kusto Explorer share menu":::

|Menu|    Behavior|
|----|----------|
|Data To Clipboard|    Exports Query and data set to a clipboard. If a chart is presented, it exports the chart as bitmap| 
|Result To Clipboard| Exports the data set to a clipboard. If a chart is presented, it exports the chart as bitmap| 
|Query to Clipboard| Exports the Query to a clipboard|

### Visualizations section

:::image type="content" source="images/kusto-explorer/home-visualizations-menu.png" alt-text="Kusto Explorer menu visualizations":::

|Menu         | Behavior|
|-------------|---------|
|Area chart      | Displays an area chart in which the X-axis is the first column (must be numeric). All numeric columns are mapped to different series (Y-axis) |
|Column Chart | Displays a column chart where all numeric columns are mapped to different series (Y-axis). The text column before numeric is the X-axis (can be controlled in the UI)|
|Bar Chart    | Displays a bar chart where all numeric columns are mapped to different series (X-axis). The text column before numeric is the Y-axis (can be controlled in the UI)|
|Stacked Area chart      | Displays a stacked area chart in which the X-axis is the first column (must be numeric). All numeric columns are mapped to different series (Y-axis) |
|Timeline Chart   | Displays a time chart in which the X-axis is the first column (must be datetime). All numeric columns are mapped to different series (Y-axis).|
|Line Chart   | Displays a line chart in which the X-axis is the first column (must be numeric). All numeric columns are mapped to different series (Y-axis).|
|[Anomaly Chart](#anomaly-chart)|    Similar to timechart, but finds anomalies in time series data, using the machine learning anomalies algorithm. For anomaly detection, Kusto.Explorer uses the [series_decompose_anomalies](../query/series-decompose-anomaliesfunction.md) function.
|Pie Chart    |    Displays a pie chart in which the color-axis is the first column. The theta-axis (must be a measure, converted to percent) is the second column.|
|Time Ladder |    Displays a ladder chart in which the X-axis is the last two columns (must be datetime). The Y-axis is a composite of the other columns.|
|Scatter Chart| Displays a point graph in which the X-axis is the first column (must be numeric). All numeric columns are mapped to different series (Y-axis).|
|Pivot Chart  | Displays a pivot table and pivot chart that gives the full flexibility of selecting data, columns, rows, and various chart types.| 
|Time Pivot   | Interactive navigation over the events time-line (pivoting on time axis)|

> [!NOTE]
> <a id="anomaly-chart">Anomaly Chart</a>: 
>The algorithm expects timeseries data, which consists of two columns:
>* Time in fixed interval buckets
>* Numeric value for anomaly detection
>To produce timeseries data in Kusto.Explorer, summarize by the time field and specify the time bucket bin.

### View section

:::image type="content" source="images/kusto-explorer/home-view-menu.png" alt-text="Kusto Explorer view menu":::

|Menu           | Behavior|
|---------------|---------|
|Full View Mode | Maximizes the work space by hiding the ribbon menu and Connection Panel. Exit Full View Mode by selecting **Home** > **Full View Mode**, or by pressing **F11**.|
|Hide Empty Columns| Removes empty columns from the data grid|
|Collapse Singular Columns| Collapses columns with singular values|
|Explore Column Values| Shows column values distribution|
|Increase Font  | Increases the font size of the query tab and of the results data grid|  
|Decrease Font  | Decreases the font size of the query tab and of the results data grid|

>[!NOTE]
> Data View Settings:
>
> Kusto.Explorer keeps track of what settings are used per unique set of columns. When columns are reordered or removed, the data view is saved and will be reused whenever the data with the same columns is retrieved. To reset the view to its defaults, in the **View** tab, select **Reset View**. 

## File tab

:::image type="content" source="images/kusto-explorer/file-tab.png" alt-text="Kusto Explorer file tab":::

|Menu| Behavior|
|---------------|---------|
||---------*Query Script*---------|
|New Tab | Opens a new tab window for querying Kusto |
|Open File| Loads data from a *.kql file to the active script panel|
|Save To File| Saves the content of the active script panel to *.kql file|
|Close Tab| Closes the current tab window|
||---------*Save Data*---------|
|Data To CSV       | Exports data to a CSV (comma-separated-values) file| 
|Data To JSON      | Exports data to a JSON formatted file|
|Data To Excel     | Exports data to an XLSX (Excel) file|
|Data To Text      | Exports data to a TXT (text) file| 
|Data To KQL Script| Exports Query to a script file| 
|Data To Results   | Exports Query and data to a Results (QRES) file|
|Run Query Into CSV |Runs a query and saves the results to a local CSV file|
||---------*Load Data*---------|
|From Results|    Loads Query and data from a Results (QRES) file| 
||---------*Clipboard*---------|
|Query and Results To Clipboard|    Exports Query and data set to a clipboard. If a chart is presented, it exports the chart as a bitmap| 
|Result To Clipboard| Exports data set to a clipboard. If a chart is presented, it exports the chart as a bitmap| 
|Query to Clipboard| Exports the Query to a clipboard|
||---------*Results*---------|
|Clear results cache| Clears cached results of previously executed queries| 

## Connections tab

:::image type="content" source="images/kusto-explorer/connections-tab.png" alt-text="Kusto Explorer connections tab":::

|Menu|Behavior|
|----|----------|
||---------*Groups*---------|
|Add Group| Adds a new Kusto Server group|
|Rename Group| Renames the existing Kusto Server group|
|Remove Group| Removes the existing  Kusto Server group|
||---------*Clusters*---------|
|Import Connections| Imports connections from a file specifying connections|
|Export Connections| Exports connections to a file|
|Add Connection| Adds a new Kusto Server connection| 
|Edit Connection| Opens a dialog for Kusto Server connection properties editing|
|Remove Connection| Removes the existing connection to Kusto Server|
|Refresh| Refreshes properties of a Kusto server connection|
||---------*Security*---------|
|Inspect Your ADD Principal| Shows currents active user details|
|Sign-out From AAD| Signs-out the current user from the connection to AAD|
||---------*Data Scope*---------|
|Caching scope|<ul><li>Hot DataExecute queries only on [hot data cache](../management/cachepolicy.md)</li><li>All Data: Execute queries on all available data (default)</li></ul> |
|DateTime Column| Name of column which may be used for time pre-filter|
|Time Filter| Value of time pre-filter|

## View tab

:::image type="content" source="images/kusto-explorer/view-tab.png" alt-text="Kusto Explorer view tab":::

|Menu|Behavior|
|----|----------|
||---------*Appearance*---------|
|Full View Mode | Maximizes the work space by hiding the ribbon menu and Connection Panel|
|Increase Font  | Increases the font size of the query tab and of the results data grid|  
|Decrease Font  | Decreases the font size of the query tab and of the results data grid|
|Reset Layout|Resets the layout of the tool's docking controls and windows|
|Rename Document Tab |Rename the selected tab |
||---------*Data View*---------|
|Reset View| Resets [data view settings](#dvs) to its defaults |
|Explore Column Values|Shows column values distribution|
|Focus on Query Statistics|Changes the focus to query statistics instead of query results upon query completion|
|Hide Duplicates|Toggles removal of the duplicate rows from the query results|
|Hide Empty Columns|Toggles removal of empty columns from the query results|
|Collapse Singular Columns|Toggles collapsing columns with singular value|
||---------*Data Filtering*---------|
|Filter Rows In Search|Toggles the option to show only matching rows in query results search (**Ctrl+F**)|
||---------*Visualizations*---------|
|Visualizations|See [Visualizations](#visualizations-section), above. |

> [!NOTE]
> <a id="dvs">Data View Settings:</a> 
>
> Kusto.Explorer keeps track of the settings used per unique set of columns. When columns are reordered or removed, the data view is saved and will be reused whenever the data with the same columns is retrieved. To reset the view to its defaults, in the **View** tab, select **Reset View**. 

## Tools tab

:::image type="content" source="images/kusto-explorer/tools-tab.png" alt-text="Kusto Explorer tools tab":::

|Menu|Behavior|
|----|----------|
||---------*IntelliSense*---------|
|Enable IntelliSense| Enables and disables IntelliSense on the Script Panel|
||---------*Analyze*---------|
|Query Analyzer| Launches the Query Analyzer tool|
|Query Checker | Analyzes the current query and outputs a set of applicable improvement recommendations|
|Calculator| Launches the calculator|
||---------*Analytics*---------|
|Analytical Reports| Opens a dashboard with multiple pre-built reports for data analysis|
||---------*Translate*---------|
|Query to Power BI| Translates a query to a format suitable for using in Power BI|
||---------*Options*---------|
|Reset Options| Sets application settings to default values|
|Options| Opens a tool for configuring application settings. Learn more about [Kusto.Explorer options](kusto-explorer-options.md).|

## Monitoring tab

:::image type="content" source="images/kusto-explorer/monitoring-tab.png" alt-text="Kusto Explorer monitoring tab":::

|Menu             | Behavior|
|-----------------|---------| 
||---------*Monitor*---------|
|Cluster Diagnostics | Shows a health summary for the Server Group currently selected in Connections Panel | 
|Latest data: All tables| Shows a summary of the latest data in all tables of the currently selected database|
|Latest data: Selected table|Shows in the status bar the latest data in the selected table| 

## Management tab

:::image type="content" source="images/kusto-explorer/management-tab.png" alt-text="Kusto Explorer management tab":::

|Menu             | Behavior|
|-----------------|---------|
||---------*Authorized Principals*---------|
|Manage Cluster Authorized Principals |Enables managing a cluster's principals for authorized users| 
|Manage Database Authorized Principals | Enables managing a database's principals for authorized users| 
|Manage Table Authorized Principals | Enables managing a table's principals for authorized users| 
|Manage Function Authorized Principals | Enables managing a function's principals for authorized users| 

## Help tab

:::image type="content" source="images/kusto-explorer/help-tab.png" alt-text="Kusto Explorer help tab":::

|Menu             | Behavior|
|-----------------|---------|
||---------*Documentation*---------|
|Help             | Opens a link to the Kusto online documentation  | 
|What's new       | Opens a document that lists all Kusto.Explorer changes|
|Report Issue      |Opens a dialog with two options: <ul><li>Report issues related to service</li><li>Report issues in the client application</li></ul> | 
|Suggest Feature  | Opens a link to the Kusto feedback forum | 
|Check Updates     | Checks if there are updates to your version of Kusto.Explorer | 

## Connections panel

:::image type="content" source="images/kusto-explorer/connections-panel.png" alt-text="Kusto Explorer connections panel":::

The Connections pane shows all the configured cluster connections. For each cluster the databases, tables, and attributes (columns) 
that they store are shown. Select items (which sets an implicit context
for the search/query in the main panel), or double-click items to copy the name to the search/query panel.

If the actual schema is large (such as a database with hundreds of tables), you can search it by pressing **CTRL+F** and entering a 
substring (case-insensitive) of the entity name you're looking for.

Kusto.Explorer supports controlling the Connection panel from the query window, which is useful for scripts. For example, you can start a script file with a command that instructs Kusto.Explorer to connect to the cluster/database whose data is being queried by the script, by using the following syntax:

<!-- csl -->
```kusto
#connect cluster('help').database('Samples')

StormEvents | count
```

Run each line using `F5`, or similar.

### Control the user identity connecting to Kusto.Explorer

The default security model for new connections is
AAD-Federated security. Authentication is done through the
Azure Active Directory using the default AAD user experience.

If you need finer control over the authentication parameters, you can expand the
"Advanced: Connection Strings" edit box and provide a valid
[Kusto connection string](../api/connection-strings/kusto.md) value.

For example, users with a presence in
multiple AAD tenants sometimes need to use a particular "projection"
of their identities to a specific AAD tenant. Do this by
providing a connection string, such as the one below (replace words IN CAPITALS with specific values):

```kusto
Data Source=https://CLUSTER_NAME.kusto.windows.net;Initial Catalog=DATABASE_NAME;AAD Federated Security=True;Authority Id=AAD_TENANT_OF_CLUSTER;User=USER_DOMAIN
```

* `AAD_TENANT_OF_CLUSTER` is a domain name or AAD tenant ID (a GUID) of the AAD tenant in which the cluster is hosted. This is usually the domain name of the organization that owns the cluster, such as `contoso.com`. 
* USER_DOMAIN is the identity of the user invited into that tenant (for example, `user@example.com`). 

>[!NOTE]
> The domain name of the user is not necessarily the same as that of the tenant hosting the cluster.

:::image type="content" source="images/kusto-explorer/advanced-connection-string.png" alt-text="Kusto Explorer advanced connection string":::

## Keyboard shortcuts

You might find that using keyboard shortcuts enables you to perform operations faster than with the mouse. Take a look at this [list of Kusto.Explorer keyboard shortcuts](kusto-explorer-shortcuts.md) to learn more.

## Table row colors

Kusto.Explorer tries to interpret the severity or verbosity level of each row in the results panel and color them accordingly. It does this by matching the distinct values of each column with a set of known patterns ("Warning", "Error", and so on).

To modify the output color scheme, or turn this behavior off, from the **Tools** menu, select **Options** > **Results Viewer** > **Verbosity color scheme**.

:::image type="content" source="images/kusto-explorer/ke-color-scheme.png" alt-text="Kusto Explorer color scheme modification":::

## Next steps

Learn more about working with Kusto.Explorer:

* [Using Kusto.Explorer](kusto-explorer-using.md)
* [Kusto.Explorer keyboard shortcuts](kusto-explorer-shortcuts.md)
* [Kusto.Explorer options](kusto-explorer-options.md)
* [Troubleshooting Kusto.Explorer](kusto-explorer-troubleshooting.md)

Learn more about Kusto.Explorer tools and utilities:
* [Kusto.Explorer code analyzer](kusto-explorer-code-analyzer.md)
* [Kusto.Explorer code navigation](kusto-explorer-codenav.md)
* [Kusto.Explorer code refactoring](kusto-explorer-refactor.md)
* [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/kusto/query/)
