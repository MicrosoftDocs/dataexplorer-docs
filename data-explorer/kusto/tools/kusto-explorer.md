---
title: Kusto.Explorer installation and user interface
description: Learn about the features of Kusto.Explorer and how it can help you to explore your data
ms.reviewer: alexans
ms.topic: conceptual
ms.date: 03/20/2023
---

# Kusto.Explorer installation and user interface

Kusto.Explorer is a rich Windows desktop application that enables you to explore your data using the Kusto Query Language in an easy-to-use user interface. This overview explains how to get started with setting up your Kusto.Explorer and explains the user interface you'll use.


With Kusto.Explorer, you can:

* [Query your data](kusto-explorer-using.md#query-mode).
* [Search your data](kusto-explorer-using.md#search-mode) across tables.
* [Visualize your data](#visualizations-section) in a wide variety of graphs.
* [Share queries and results](kusto-explorer-using.md#share-queries-and-results) by email or using deep links.

## Installing Kusto.Explorer

* Download and install the Kusto.Explorer tool from:
  * [https://aka.ms/ke](https://aka.ms/ke)
  <!--* [https://aka.ms/ke-mirror](https://aka.ms/ke-mirror) (Non-CDN location)-->

* Alternatively, access your Kusto cluster with a ClickOnce-enabled browser at:
`https://<your_cluster>/?web=0`
     Replace &lt;your_cluster&gt; with your cluster URI (for example, `help.kusto.windows.net`.)

### Using Google Chrome and Kusto.Explorer

If Google Chrome is your default browser, installing the ClickOnce extension for Chrome is required.
If your default browser is the Chromium-based Microsoft Edge, installing this extension *isn't* required.

[https://chrome.google.com/webstore/detail/clickonce-for-google-chro/kekahkplibinaibelipdcikofmedafmb/related?hl=en-US](https://chrome.google.com/webstore/detail/clickonce-for-google-chro/kekahkplibinaibelipdcikofmedafmb/related?hl=en-US)

## Overview of the user interface

The Kusto.Explorer user interface is designed with a layout based on tabs and panels, similar to that of other Microsoft products:

* Navigate through the tabs on the [menu panel](#menu-panel) to perform various operations
* Manage your connections in the [connections panel](#connections-panel)
* Create scripts to run in the script panel
* View the results of the scripts in the results panel

:::image type="content" source="images/kusto-explorer/ke-start.png" alt-text="Screenshot of Kusto Explorer user interface that shows an overview of the interface's four panels.":::

## Connections panel

:::image type="content" source="images/kusto-explorer/connections-panel.png" alt-text="Screenshot of the Connections panel that shows the Help cluster's databases.":::

The Connections pane shows all the configured cluster connections. For each cluster the databases, tables, and attributes (columns) that they store are shown. Select items (which sets an implicit context
for the search/query in the main panel), or double-click items to copy the name to the search/query panel.

If the actual schema is large (such as a database with hundreds of tables), you can search it by pressing **CTRL+F** and entering a substring (case-insensitive) of the entity name you're looking for.

Kusto.Explorer supports controlling the Connection panel from the query window, which is useful for scripts. For example, you can start a script file with a command that instructs Kusto.Explorer to connect to the cluster/database the script queries, using the following syntax:

<!-- csl -->
```kusto
#connect cluster('help').database('Samples')

StormEvents | count
```

Run each line using `F5`, or similar.

## Work Folders panel

:::image type="content" source="images/kusto-explorer/work-folders-pane.png" alt-text="Screenshot of the Work Folders panel showing Unsaved work and Tracked Folders.":::

The Work folders pane organizes your work folders in one place to make navigating your work easier. There are two types of work folders:

* **Unsaved work**: lists folders for open query tabs that you may still be working on.
* **Tracked folders**: lists folders from your local device that you can add as KQL libraries for easier access and management.

## Menu panel

### Home tab

:::image type="content" source="images/kusto-explorer/home-tab.png" alt-text="Screenshot of the Home tab that shows the Home tab's five sections.":::

The Home tab shows the most frequently used operations. It includes:

### Query section

:::image type="content" source="images/kusto-explorer/home-query-menu.png" alt-text="Screenshot of the Home tab section titled Tabs that shows an option for creating a new tab for queries.":::

|Menu|    Behavior|
|----|----------|
|Mode dropdown | <ul><li>Query mode: Switches the query editor into a [query mode](kusto-explorer-using.md#query-mode). Commands can be written and saved as queries (default)</li> <li> Search mode: A single query mode where each command entered is processed immediately and presents a result in the result panel</li> <li>Search++ mode: Allows searching for a term using search syntax across one or more tables. Learn more about using [Search++ Mode](kusto-explorer-using.md#search-mode)</li></ul> |
|New Tab| Opens a new tab for querying Kusto Query Language. |

### Share section

:::image type="content" source="images/kusto-explorer/home-share-menu.png" alt-text="Screenshot of the Home tab section titled Share that shows three options.":::

|Menu|    Behavior|
|----|----------|
|Data To Clipboard|    Exports Query and data set to a clipboard. If a chart is presented, it exports the chart as bitmap|
|Result To Clipboard| Exports the data set to a clipboard. If a chart is presented, it exports the chart as bitmap|
|Query to Clipboard| Exports the Query to a clipboard|

### Visualizations section

:::image type="content" source="images/kusto-explorer/home-visualizations-menu.png" alt-text="Screenshot of the Home tab section titled Visualizations that shows the different options for visualizing data.":::

For variable visualizations, see the [render operator](../query/renderoperator.md).

|Menu         | Behavior|
|-------------|---------|
|Area chart   | Displays an area chart in which the X-axis is the first column (must be numeric). All numeric columns are mapped to different series (Y-axis). |
|Column Chart | Displays a column chart where all numeric columns are mapped to different series (Y-axis). The text column before numeric is the X-axis (can be controlled in the UI).|
|Bar Chart    | Displays a bar chart where all numeric columns are mapped to different series (X-axis). The text column before numeric is the Y-axis (can be controlled in the UI).|
|Stacked Area Chart      | Displays a stacked area chart in which the X-axis is the first column (must be numeric). All numeric columns are mapped to different series (Y-axis). |
|Time Chart   | Displays a time chart in which the X-axis is the first column (must be datetime). All numeric columns are mapped to different series (Y-axis).|
|Line Chart   | Displays a line chart in which the X-axis is the first column (must be numeric). All numeric columns are mapped to different series (Y-axis).|
|Anomaly Chart| Similar to Time Chart, but finds anomalies in time series data, using a machine learning anomaly detection algorithm. The data must be in fixed interval buckets. For anomaly detection, Kusto.Explorer uses the [series_decompose_anomalies](../query/series-decompose-anomaliesfunction.md) function.
|Pie Chart    |    Displays a pie chart in which the color-axis is the first column. The theta-axis (must be a measure, converted to percent) is the second column.|
|Time Ladder |    Displays a ladder chart in which the X-axis is the last two columns (must be datetime). The Y-axis is a composite of the other columns.|
|Scatter Chart| Displays a point graph in which the X-axis is the first column (must be numeric). All numeric columns are mapped to different series (Y-axis).|
|Pivot Chart  | Displays a pivot table and pivot chart that gives the full flexibility of selecting data, columns, rows, and various chart types.| 
|Time Pivot   | Interactive navigation over the events time-line (pivoting on time axis)|

### View section

:::image type="content" source="images/kusto-explorer/home-view-menu.png" alt-text="Screenshot of the Home tab section titled View that shows options for altering the data view.":::

|Menu           | Behavior|
|---------------|---------|
|Full View Mode | Maximizes the work space by hiding the ribbon menu and Connection Panel. Exit Full View Mode by selecting **Home** > **Full View Mode**, or by pressing **F11**.|
|Hide Empty Columns| Removes empty columns from the data grid.|
|Collapse Singular Columns| Collapses columns with singular values.|
|Explore Column Values| Shows column values distribution|
|Increase Font  | Increases the font size of the query tab and of the results data grid.|  
|Decrease Font  | Decreases the font size of the query tab and of the results data grid.|

>[!NOTE]
> Data View Settings:
>
> Kusto.Explorer keeps track of what settings are used per unique set of columns. When columns are reordered or removed, the data view is saved and will be reused whenever the data with the same columns is retrieved. To reset the view to its defaults, in the **View** tab, select **Reset View**.

## File tab

:::image type="content" source="images/kusto-explorer/file-tab.png" alt-text="Screenshot of the File tab that shows the File tab's five sections.":::

|Menu| Behavior|
|---------------|---------|
||---------*Query Script*---------|
|New Tab | Opens a new tab window for querying Kusto. |
|Open File| Loads data from a *.kql file to the active script panel.|
|Save To File| Saves the content of the active script panel to *.kql file.|
|Close Tab| Closes the current tab window|
||---------*Profiles*---------|
|Import Profile| Import a Kusto.Explorer profile. |
|Export Profile| Export a Kusto.Explorer profile.|
||---------*Save Data*---------|
|Data To CSV       | Exports data to a CSV (comma-separated-values) file.|
|Data To JSON      | Exports data to a JSON formatted file.|
|Data To Excel     | Exports data to an XLSX (Excel) file.|
|Data To Text      | Exports data to a TXT (text) file.|
|Data To KQL Script| Exports Query to a script file.|
|Data To Results   | Exports Query and data to a Results (QRES) file.|
|Run Query Into CSV |Runs a query and saves the results to a local CSV file.|
||---------*Load Data*---------|
|From Results|    Loads Query and data from a Results (QRES) file.|
||---------*Clipboard*---------|
|Query and Results To Clipboard|    Exports Query and data set to a clipboard. If a chart is presented, it exports the chart as a bitmap.|
|Result To Clipboard| Exports data set to a clipboard. If a chart is presented, it exports the chart as a bitmap.|
|Query To Clipboard| Exports the Query to a clipboard.|
|Results To Clipboard (datatable())| Exports query results to a clipboard. Maximal allowed cell value is 30000.|
||---------*Results*---------|
|Clear results cache| Clears cached results of previously executed queries.|

## Connections tab

:::image type="content" source="images/kusto-explorer/connections-tab.png" alt-text="Screenshot of the Connections tab that shows the Connection tab's five sections.":::

|Menu|Behavior|
|----|----------|
||---------*Groups*---------|
|Add Group| Adds a new Kusto Server group.|
||---------*Clusters*---------|
|Import Connections| Imports connections from a file specifying connections.|
|Export Connections| Exports connections to a file.|
|Add Connection| Adds a new Kusto Server connection.|
|Edit Connection| Opens a dialog for Kusto Server connection properties editing.|
|Remove Connection| Removes the existing connection to Kusto Server.|
|Refresh| Refreshes properties of a Kusto server connection.|
||---------*Profiles*---------|
|Import Profile| Import a Kusto.Explorer profile.|
|Export Profile| Export a Kusto.Explorer profile.|
||---------*Security*---------|
|Inspect Your ADD Principal| Shows currents active user details.|
|Sign-out| Signs-out the current user from the connection to Microsoft Azure Active Directory (Azure AD).|
||---------*Data Scope*---------|
|Caching scope|<ul><li>Hot DataExecute queries only on [hot data cache](../management/cachepolicy.md)</li><li>All Data: Execute queries on all available data (default).</li></ul> |
|DateTime Column| Name of a column that may be used for time prefilter.|
|Time Filter| Value of time prefilter.|

## View tab

:::image type="content" source="images/kusto-explorer/view-tab.png" alt-text="Screenshot of the View tab that shows the View tab's four sections.":::

|Menu|Behavior|
|----|----------|
||---------*Appearance*---------|
|Full View Mode | Maximizes the work space by hiding the ribbon menu and Connection Panel. Exit Full View Mode by selecting **Home** > **Full View Mode**, or by pressing **F11**.|
|Increase Font  | Increases the font size of the query tab and of the results data grid.|  
|Decrease Font  | Decreases the font size of the query tab and of the results data grid.|
|Reset Layout|Resets the layout of the tool's docking controls and windows.|
|Rename Document Tab |Rename the selected tab. |
||---------*Data View*---------|
|Reset View| Resets [data view settings](#dvs) to its defaults. |
|Explore Column Values|Shows column values distribution.|
|Focus on Query Statistics|Changes the focus to query statistics instead of query results upon query completion.|
|Hide Duplicates|Toggles removal of the duplicate rows from the query results.|
|Hide Empty Columns|Removes empty columns from the query results.|
|Collapse Singular Columns|Collapses columns with singular values.|
|Row Selection| Enables selection of specific rows in the Results panel|
|Color By Column| Groups identical records in the first column by color.|
|Wrap Text| Formats cells to wrap the data to fit the column width.|
||---------*Data Filtering*---------|
|Filter Rows In Search|Toggles the option to show only matching rows in query results search (**Ctrl+F**).|
||---------*Visualizations*---------|
|Visualizations|See section [Visualizations](#visualizations-section) in this document. |

> [!NOTE]
> <a id="dvs">Data View Settings:</a>
>
> Kusto.Explorer keeps track of the settings used per unique set of columns. When columns are reordered or removed, the data view is saved and will be reused whenever the data with the same columns is retrieved. To reset the view to its defaults, in the **View** tab, select **Reset View**.

## Tools tab

:::image type="content" source="images/kusto-explorer/tools-tab.png" alt-text="Screenshot of the Tool tab that shows the Tool tab's six sections.":::

|Menu|Behavior|
|----|----------|
||---------*IntelliSense*---------|
|Enable IntelliSense| Enables and disables IntelliSense on the Script Panel.|
|Issues List| Lists issues in the Script panel.|
||---------*Automation*---------|
|Add New Automation| Produces an analysis report that provides insights about the query.|
||---------*Utilities*---------|
|Command-line tools|Opens the command prompt on your computer.|
|Compress LZ4 file|Compresses files using the LZ4 algorithm.|
|Decompress LZ4 file| Decompresses files using the LZ4 algorithm.|
||---------*Analytics*---------|
|Analytical Reports| Opens a dashboard with multiple pre-built reports for data analysis.|
||---------*Translate*---------|
|Query to Power BI| Translates a query to a format suitable for using in Power BI.|
||---------*Options*---------|
|Reset Options| Sets application settings to default values.|
|Options| Opens a tool for configuring application settings. To learn more, see [Kusto.Explorer options](kusto-explorer-options.md).|

## Table row colors

Kusto.Explorer tries to interpret the severity or verbosity level of each row in the results panel and color them accordingly. It does this by matching the distinct values of each column with a set of known patterns ("Warning," "Error," and so on).

To modify the output color scheme, or turn off this behavior, from the **Tools** menu, select **Options** > **Results Viewer** > **Verbosity color scheme**.

:::image type="content" source="images/kusto-explorer/ke-color-scheme.png" alt-text="Screenshot of Kusto Explorer color scheme modification.":::

**Excel** color scheme legend| **Vivid** color scheme legend
|---|---
| :::image type="content" source="images/kusto-explorer/excel-color-scheme.png" alt-text="Screenshot of the Excel color scheme legend in Kusto Explorer." border="false"::: |:::image type="content" source="images/kusto-explorer/vivid-color-scheme.png" alt-text="Screenshot vivid color scheme legend in Kusto Explorer." border="false":::

## Monitoring tab

:::image type="content" source="images/kusto-explorer/monitoring-tab.png" alt-text="Screenshot of the Monitoring tab that shows two options for monitoring data.":::

|Menu             | Behavior|
|-----------------|---------|
||---------*Monitor*---------|
|Cluster Diagnostics | Shows a health summary for the Server Group currently selected in Connections Panel. |
|Latest data: All tables| Shows a summary of the latest data in all tables of the currently selected database.|
|Latest data: Selected table|Shows in the status bar the latest data in the selected table.|

## Management tab

:::image type="content" source="images/kusto-explorer/management-tab.png" alt-text="Screenshot of the Management tab that shows options for managing Authorized Principals. ":::

|Menu             | Behavior|
|-----------------|---------|
||---------*Authorized Principals*---------|
|Manage Database Authorized Principals | Enables managing a database's principals for authorized users.|
|Manage Table Authorized Principals | Enables managing a table's principals for authorized users.|
|Manage Function Authorized Principals | Enables managing a function's principals for authorized users.|

## Help tab

:::image type="content" source="images/kusto-explorer/help-tab.png" alt-text="Screenshot of the Help tab that shows options for Documentation.":::

|Menu             | Behavior|
|-----------------|---------|
||---------*Documentation*---------|
|Help             | Opens a link to the Kusto online documentation.  |
|What's new       | Opens a document that lists all Kusto.Explorer changes.|
|Report Issue      |Opens a dialog with two options: <ul><li>Report issues related to service</li><li>Report issues in the client application</li></ul>. |
|Keyboard Shortcuts| Opens a link to the [list of Kusto.Explorer keyboard shortcuts](kusto-explorer-shortcuts.md).|
|Show EULA| Opens a link to the Microsoft Azure Legal Information article.|

### Control the user identity connecting to Kusto.Explorer

The default security model for new connections is Azure AD-Federated security. Authentication is done through the Azure Active Directory using the default Azure AD user experience.

If you need finer control over the authentication parameters, you can expand the
"Advanced: Connection Strings" edit box and provide a valid
[Kusto connection string](../api/connection-strings/kusto.md) value.

For example, users with a presence in
multiple Azure AD tenants sometimes need to use a particular "projection"
of their identities to a specific Azure AD tenant, which can be done through
the connection string (replace words IN CAPITALS with specific values):

```kusto
Data Source=https://CLUSTER_NAME.kusto.windows.net;Initial Catalog=DATABASE_NAME;AAD Federated Security=True;Authority Id=AAD_TENANT_OF_CLUSTER;User=USER_DOMAIN
```

* `AAD_TENANT_OF_CLUSTER` is a domain name or Azure AD tenant ID (a GUID) of the tenant in which the cluster is hosted. For example, `contoso.com`.
* USER_DOMAIN is the identity of the user invited into that tenant (for example, `user@example.com`).

>[!NOTE]
> The domain name of the user is not necessarily the same as that of the tenant hosting the cluster.

:::image type="content" source="images/kusto-explorer/advanced-connection-string.png" alt-text="Screenshot of the Add Connection pane showing the option titled Advanced Connection String.":::

## Next steps

To learn more about working with Kusto.Explorer see:

* [Using Kusto.Explorer](kusto-explorer-using.md)
* [Kusto.Explorer keyboard shortcuts](kusto-explorer-shortcuts.md)
* [Kusto.Explorer options](kusto-explorer-options.md)
* [Troubleshooting Kusto.Explorer](kusto-explorer-troubleshooting.md)

To learn more about Kusto.Explorer tools and utilities, see:

* [Kusto.Explorer code features](kusto-explorer-code-features.md)
* [Kusto Query Language (KQL)](/azure/kusto/query/)
