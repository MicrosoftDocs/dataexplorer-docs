---
title: Kusto.Explorer tool - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.Explorer tool in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/23/2020
---
# Kusto.Explorer tool

Kusto.Explorer is a rich desktop application that allows you to explore your data using Kusto query language.

## Getting the tool

* Install the [Kusto.Explorer tool](https://aka.ms/Kusto.Explorer)

* Alternatively, access your Kusto cluster with your browser at:
[https://<your_cluster>.kusto.windows.net](https://your_cluster.kusto.windows.net). Replace <your_cluster> with your Azure Data Explorer cluster name.



## Using Chrome and Kusto.Explorer

If you use Chrome as your default browser, make sure to install the ClickOnce extension for Chrome:

[https://chrome.google.com/webstore/detail/clickonce-for-google-chro/kekahkplibinaibelipdcikofmedafmb/related?hl=en-US](https://chrome.google.com/webstore/detail/clickonce-for-google-chro/kekahkplibinaibelipdcikofmedafmb/related?hl=en-US)



## Overview of the user experience

Kusto Explorer window has several UI parts:

1. [Menu panel](#menu-panel)
2. [Connections panel](#connections-panel)
3. Script panel
4. Results panel

![Kusto.Explorer startup](./Images/KustoTools-KustoExplorer/ke-start.png "ke-start")

### Keyboard shortcuts

You might find that using keyboard shortcuts enables you to perform operations faster than with the mouse. Take a look at this [list of Kusto.Explorer keyboard shortcuts](kusto-explorer-shortcuts.md).

### Menu panel

Kusto.Explorer Menu panel includes the following tabs:

* [Home](#home-tab)
* [File](#file-tab)
* [Connections](#connections-tab)
* [View](#view-tab)
* [Tools](#tools-tab)

* [Management](#management-tab)
* [Help](#help-tab)

### Home tab

![Kusto.Explorer Home](./Images/KustoTools-KustoExplorer/home-tab.png "home-tab")

The Home tab shows the most recently used functions, divided into sections:

* [Query](#query-section)
* [Share](#share-section)
* [Visualizations](#visualizations-section)
* [View](#view-section)
* [Help](#help-tab) 

#### Query section

![Kusto.Explorer query menu](./Images/KustoTools-KustoExplorer/home-query-menu.png "query-menu")

|Menu|    Behavior|
|----|----------|
|Mode dropdown | <ul><li>Query mode: Switches Query Window into a [script mode](#query-mode). Commands can be loaded and saved as scripts (default)</li> <li> Search mode: A single query mode where each command entered is processed immediately and presents a result in the Result Window</li> <li>Search++ mode: Allows searching for a term using search syntax across one or more tables. Learn more about using [Search++ Mode](kusto-explorer.md#search-mode)</li></ul> |
|New Tab| Opens a new tab for querying Kusto |

#### Share section

![Kusto.Explorer share section](./Images/KustoTools-KustoExplorer/home-share-menu.png "share-menu")

|Menu|    Behavior|
|----|----------|
|Data To Clipboard|    Exports Query and data set to a clipboard. If a chart is presented, it exports the chart as bitmap| 
|Result To Clipboard| Exports the data set to a clipboard. If a chart is presented, it exports the chart as bitmap| 
|Query to Clipboard| Exports the Query to a clipboard|

#### Visualizations section

![alt text](./Images/KustoTools-KustoExplorer/home-visualizations-menu.png "menu-visualizations")

|Menu         | Behavior|
|-------------|---------|
|Area chart      | Displays an area chart in which the X-axis is the first column (must be numeric) and all numeric columns are mapped to different series (Y-axis) |
|Column Chart | Displays a column chart where all numeric columns are mapped to different series (Y-axis) and the text column before numeric is the X-axis (can be controlled in the UI)|
|Bar Chart    | Displays a bar chart where all numeric columns are mapped to different series (X-axis) and the text column before numeric is the Y-axis (can be controlled in the UI)|
|Stacked Area chart      | Displays a stacked area chart in which the X-axis is the first column (must be numeric) and all numeric columns are mapped to different series (Y-axis) |
|Timeline Chart   | Displays a time chart in which the X-axis is the first column (must be datetime) and all numeric columns are mapped to different series (Y-axis).|
|Line Chart   | Displays a line chart in which the X-axis is the first column (must be numeric) and all numeric columns are mapped to different series (Y-axis).|
|Anomaly Chart|    Similar to timechart, but finds anomalies in time series data, using the machine learning anomalies algorithm. For anomaly detection, Kusto.Explorer uses the [series_decompose_anomalies](../query/series-decompose-anomaliesfunction.md) function.(*) 
|Pie Chart    |    Displays a pie chart in which the color-axis is the first column and the theta-axis (must be a measure, converted to percent) is the second column.|
|Ladder Chart |    Displays a ladder chart in which the X-axis is the last two columns (must be datetime) and the Y-axis is a composite of the other columns.|
|Scatter Chart| Displays a point graph in which the X-axis is the first column (must be numeric) and all numeric columns are mapped to different series (Y-axis).|
|Pivot Chart  | Displaya a pivot table and pivot chart that gives the full flexibility of selecting data, columns, rows and various chart types.| 
|Time Pivot   | Interactive navigation over the events time-line (pivoting on time axis)|

(*) Anomaly Chart: 
The algorithm expects timeseries data, which consists of two columns:
1. Time in fixed interval buckets
2. Numeric value for anomaly detection
To produce this in Kusto.Explorer, summarize by the time field and specify the time bucket bin.

#### View section

![alt text](./Images/KustoTools-KustoExplorer/home-view-menu.png "view-menu")

|Menu           | Behavior|
|---------------|---------|
|Full View Mode | Maximizes the work space by hiding the ribbon menu and Connection Panel|
|Hide Empty Columns| Removes empty columns from the data grid|
|Collapse Singular Columns| Collapses columns with singular values|
|Explore Column Values| Shows column values distribution|
|Increase Font  | Increases the font size of the query tab and of the results data grid|  
|Decrease Font  | Decreases the font size of the query tab and of the results data grid|

(*) Data View Settings:
Kusto.Explorer keeps track of what settings are used per unique set of columns. So when columns are reordered or removed, the data view is saved and will be reused
whenever the data with the same columns is retrieved. To reset the view to its defaults, in the **View** tab, select **Reset View**. 

### File tab

![Kusto.Explorer File](./Images/KustoTools-KustoExplorer/file-tab.png "file-tab")

|Menu| Behavior|
|---------------|---------|
||---------*Query Script*---------|
|New Tab | Opens a new tab window for querying Kusto |
|Open File| Loads data from a *.kql file to the active script panel|
|Save To File| Saves the content of the active script panel to *.kql file|
|Close Tab| Closes the current tab window|
||---------*Save Data*---------|
|To CSV       | Exports data to a CSV (comma-separated-values) file| 
|To JSON      | Exports data to a JSON formatted file|
|To Excel     | Exports data to an XLSX (Excel) file|
|To Text      |    Exports data to a TXT (text) file| 
|To CSL Script|    Exports Query to a script file| 
|To Results   |    Exports Query and data to a Results (QRES) file|
||---------*Load Data*---------|
|From Results|    Loads Query and data from a Results (QRES) file| 
||---------*Clipboard*---------|
|Data To Clipboard|    Exports Query and data set to a clipboard. If a chart is presented, it exports the chart as a bitmap| 
|Result To Clipboard| Exports data set to a clipboard. If a chart is presented, it exports the chart as a bitmap| 
|Query to Clipboard| Exports the Query to clipboard|
||---------*Results*---------|
|Clear results cache| Clears cached results of previously executed queries| 

### Connections Tab

![Kusto.Explorer connections tab](./Images/KustoTools-KustoExplorer/connections-tab.png "connections-tab")

|Menu|Behavior|
|----|----------|
||---------*Groups*---------|
|Add group| Adds a new Kusto Server group|
|Rename group| Renames the existing Kusto Server group|
|Remove group| Removes the existing  Kusto Server group|
||---------*Clusters*---------|
|Import connections| Imports connections from a file specifying connections|
|Export connections| Exports connections to a file|
|Add connection| Adds a new Kusto Server connection| 
|Edit connection| Opens a dialog for Kusto Server connection properties editing|
|Remove connection| Removes the existing connection to Kusto Server|
|Refresh| Refreshes properties of a Kusto server connection|
||---------*Identity Providers*---------|
|Inspect Connection Principal| Shows currents active user details|
|Sign-out From AAD| Signs-out the current user from the connection to AAD|
||---------*Data Scope*---------|
|Caching scope|<ul><li>Hot DataExecute queries only on [hot data cache](../management/cachepolicy.md)</li><li>All Data: Execute queries on all available data (default)</li></ul> |
|DateTime Column| Name of column which may be used for time pre-filter|
|Time Filter| Value of time pre-filter|

### View Tab

![view tab](./Images/KustoTools-KustoExplorer/view-tab.png "view-tab")

|Menu|Behavior|
|----|----------|
||---------*Appearance*---------|
|Full View Mode | Maximizes the work space by hiding the ribbon menu and Connection Panel|
|Increase Font  | Increases the font size of the query tab and of the results data grid|  
|Decrease Font  | Decreases the font size of the query tab and of the results data grid|
|Reset Layout|Resets the layout of the tool's docking controls and windows|
||---------*Data View*---------|
|Reset View| Resets data view settings (*)|
|Explore Column Values|Shows column values distribution|
|Focus on query statistics|Changes the focus to query statistics instead of query results upon query completion|
|Hide Duplicates|Toggles removal of the duplicate rows from the query results|
|Hide Empty Columns|Toggles removal of empty columns from the query results|
|Collapse Singular Columns|Toggles collapsing columns with singular value|
||---------*Data Filtering*---------|
|Filter Rows in Search|Toggles the option to show only matching rows in query results search (Ctrl+F)|
||---------*Visualizations*---------|
|Visualizations|See [Visualizations](#visualizations-section), above. |

(*) Data View Settings: Kusto.Explorer keeps track of what settings are used per unique set of columns. So when columns are reordered or removed, the data view is saved and will be reused whenever the data with the same columns is retrieved. To reset the view to its defaults, in the **View** tab, select **Reset View**. 

### Tools Tab

![tools tab](./Images/KustoTools-KustoExplorer/tools-tab.png "tools-tab")

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
|Options| Opens a tool for configuring application settings. [Details](kusto-explorer-options.md)|



### Management Tab

![management tab](./Images/KustoTools-KustoExplorer/management-tab.png "management-tab")

|Menu             | Behavior|
|-----------------|---------|
||---------*Authorized Principals*---------|
|Manage Cluster Authorized Principals |Enables managing a cluster's principals for authorized users| 
|Manage Database Authorized Principals | Enables managing a database's principals for authorized users| 
|Manage Table Authorized Principals | Enables managing a table's principals for authorized users| 
|Manage Function Authorized Principals | Enables managing a function's principals for authorized users| 

### Help Tab

![help tab](./Images/KustoTools-KustoExplorer/help-tab.png "help-tab")

|Menu             | Behavior|
|-----------------|---------|
||---------*Documentation*---------|
|Help             | Opens a link to the Kusto online documentation  | 
|What's new       | Opens a document that lists all Kusto.Explorer changes|
|Report Issue      |Opens a dialog with two options: <ul><li>Report issues related to service</li><li>Report issues in the client application</li></ul> | 
|Suggest Feature  | Opens a link to the Kusto feedback forum | 
|Check Updates     | Checks if there are updates to your version of Kusto.Explorer | 

## Connections panel

![alt text](./Images/KustoTools-KustoExplorer/connectionsPanel.png "connections-panel") 

The left pane of Kusto.Explorer shows all the cluster connections that the client
is configured with. For each cluster it shows the databases, tables, and attributes (columns) 
that they store. The Connections panel enables you to select items (which sets an implicit context
for the search/query in the main panel), or double-click items to copy the name to the
search/query panel.

If the actual schema is large (such as a database with hundreds of tables), it's possible to search the schema by pressing CTRL+F and entering a 
substring (case-insensitive) of the entity name you're looking for.

Kusto.Explorer supports controlling the Connection panel from the query window.
This is very useful for scripts. For example, starting a script file with a command
that instructs Kusto.Explorer to connect to the cluster/database whose data is being
queried by the script is possible by using the following syntax. As usual, you'll have to run each line using `F5` or similar:

```kusto
#connect cluster('help').database('Samples')

StormEvents | count
```

### Controlling the user identity used for connecting to Kusto

When adding a new connection, the default security model used is
AAD-Federated security, in which authentication is done through the
Azure Active Directory using the default AAD user experience.

In some cases, you might need finer control over the authentication parameters
than is available in AAD. If so, it's possible to expand the
"Advanced: Connection Strings" edit box and provide a valid
[Kusto connection string](../api/connection-strings/kusto.md) value.

For example, users who have presence in
multiple AAD tenants sometimes need to use a particular "projection"
of their identities to a specific AAD tenant. This can be done by
providing a connection string such as the one below (replace words IN CAPITAL with specific values):

```
Data Source=https://CLUSTER_NAME.kusto.windows.net;Initial Catalog=DATABASE_NAME;AAD Federated Security=True;Authority Id=AAD_TENANT_OF_CLUSTER;User=USER_DOMAIN
```

What is unique is that `AAD_TENANT_OF_CLUSTER` is a domain name
or AAD tenant ID (a GUID) of the AAD tenant in which the cluster is hosted
(usually the organization domain name who owns the cluster, such as 
`contoso.com`), and USER_DOMAIN is the identity of the user invited into that tenant (for example, `joe@fabrikam.com`). 

>[!Note]
> The domain name of the user is not necessarily the same as that of the tenant hosting the cluster.

## Table row colors

Kusto.Explorer tries to "guess" the severity or verbosity level of each row in the results pane and color it accordingly. It does this by matching the distinct values of each column with a set of known patterns ("Warning", "Error", and so on).

To modify the output color scheme, or turn this behavior off, from the **Tools** menu, select **Options** > **Results Viewer** > **Verbosity color scheme**.

![alt text](./Images/KustoTools-KustoExplorer/ke-color-scheme.png)

## Search++ Mode

1. In the Home tab, in the Query dropdown, select "Search++".
2. Select **Multiple tables** and then, under **Choose tables**, define which tables to search.
3. In the edit box enter your search phrase and select **Go**
4. A heat-map of the table/time-slot grid shows which term appears and where they appear
5. Select a cell in the grid and select **View Details** to show the relevant entries

![alt text](./Images/KustoTools-KustoExplorer/ke-search-beta.jpg "ke-search-beta") 

## Query Mode

Kusto.Explorer has a powerful script mode which enables you to write, edit and run ad-hoc queries. The script mode comes with syntax highlighting and IntelliSense, so you can quickly ramp-up to Kusto CSL language.

### Basic Queries

If you have have table Logs, you can start exploring them by entering:

```kusto
StormEvents | count 
```

When your cursor is positioned on this line it's colored gray. Pressing 'F5' runs the query. 

Here are some more example queries:

```kusto
// Take 10 lines from the table. Useful to get familiar with the data
StormEvents | limit 10 
```

```kusto
// Filter by EventType == 'Flood' and State == 'California' (=~ means case insensitive) 
// and take sample of 10 lines
StormEvents 
| where EventType == 'Flood' and State =~ 'California'
| limit 10
```

## Importing a local file into a Kusto table

Kusto.Explorer provides a convenient way to upload a files from your machine to a Kusto table.

1. Make sure you created the table with a schema which matches your file
(for example, using the [.create table](../management/tables.md) command)

1. Make sure the file extension is appropriate to the contents of the file. For example:
    * If your file contains comma-separated-values, make sure your file has a .csv extension.
    * If your file contains tab-separated-values, make sure your file has a .tsv extension.

1. Right-click the target database in the [Connections panel](#connections-panel), and select **Refresh**, so that your table appears.

    ![alt text](./Images/KustoTools-KustoExplorer/right-click-refresh-schema.png "right-click-refresh-schema")

1. Right-click the target table in the [Connections panel](#connections-panel), and select **Import data from local files**.

    ![alt text](./Images/KustoTools-KustoExplorer/right-click-import-local-file.png "right-click-import-local-file")

1. Select the file(s) to upload and select **Open**.

    ![alt text](./Images/KustoTools-KustoExplorer/import-local-file-choose-files.png "import-local-file-choose-files")

    The progress bar displays the progress, and a dialog displays when the operation completes

    ![alt text](./Images/KustoTools-KustoExplorer/import-local-file-progress.png "import-local-file-progress")

    ![alt text](./Images/KustoTools-KustoExplorer/import-local-file-complete.png "import-local-file-complete")

1. Query the data in your table (double-click the table in the [Connections panel](#connections-panel)).

## Managing Authorized Principals

Kusto.Explorer provides a convenient way to manage cluster, database, table, or function authorized principals.

> [!Note]
> Only [admins](../management/access-control/role-based-authorization.md) can add or drop authorized principals in their own scope.

1. Right-click the target entity in the [Connections panel](#connections-panel), and select **Manage Authorized Principals**. (You can also do this from the Management Menu.)

    ![alt text](./Images/KustoTools-KustoExplorer/right-click-manage-authorized-principals.png "right-click-manage-authorized-principals")

    ![alt text](./Images/KustoTools-KustoExplorer/manage-authorized-principals-window.png "manage-authorized-principals-window")

1. To add a new authorized principal, select **Add principal**, provide the principal details, and confirm the action.

    ![alt text](./Images/KustoTools-KustoExplorer/add-authorized-principals-window.png "add-authorized-principals-window")

    ![alt text](./Images/KustoTools-KustoExplorer/confirm-add-authorized-principals.png "confirm-add-authorized-principals")

1. To drop an existing authorized principal, select **Drop principal** and confirm the action.

    ![alt text](./Images/KustoTools-KustoExplorer/confirm-drop-authorized-principals.png "confirm-drop-authorized-principals")

## Sharing queries and results by email

Kusto.Explorer provides a convenient way to share queries and query results by email. Select **Export to Clipboard**, and Kusto.Explorer will copy the following items to the clipboard:
1. Your query
1. The query results (table or chart)
1. The connection details for the Kusto cluster and database
1. A link that will re-run the query automatically

Here's how it works:

1. Run a query in Kusto.Explorer
1. Select **Export to Clipboard** (or press `Ctrl+Shift+C`)

    ![alt text](./Images/KustoTools-KustoExplorer/menu-export.png "menu-export")

1. Open, for example, a new Outlook message.

    ![alt text](./Images/KustoTools-KustoExplorer/share-results.png "share-results")
    
1. Paste the contents of the clipboard to the Outlook message.

    ![alt text](./Images/KustoTools-KustoExplorer/share-results-2.png "share-results-2")

## Client-side query parametrization

> [!WARNING]
> There are two types of query parametrization techniques in Kusto:
> * [Language-integrated query parametrization](../query/queryparametersstatement.md) is implemented as part
> of the query engine and meant to be used by applications that query the service programmatically.
>
> * Client-side query parametrization, described below, is a feature of the Kusto.Explorer application only. It's equivalent to using string-replace operations on the queries before sending them to be executed by the service. The syntax described below is not part of the query language itself, and can't be used when sending queries to the service by means other than Kusto.Explorer.

If you plan to use same value in multiple queries or in multiple tabs, it's going to be difficult to change it. However, Kusto.Explorer supports Query parameters. Parameters are denoted by {} brackets. For example: `{parameter1}`

The script editor highlights query parameters:

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-1.png "parametrized-query-1")

You can easily define and edit existing query parameters:

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-2.png "parametrized-query-2")

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-3.png "parametrized-query-3")

The script editor also has IntelliSense for query parameters that are already defined:

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-4.png "parametrized-query-4")

There can be multiple sets of parameters (listed in the **Parameters Set** combo box).
Use the **Add new** and **Delete current** to manipulate the list of Parameter sets.

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-5.png "parametrized-query-5")

Query parameters are shared among tabs, so that they can be easily reused.

## Deep-linking queries

### Overview
You can create a URI that, when opened in a browser, Kusto.Explorer will start locally and run a specific query on a specified Kusto database.

### Limitations
The queries are limited to ~2000 characters due to Internet Explorer limitations (the limitation is approximate because it's dependent on the cluster and Database name length)
https://support.microsoft.com/kb/208427 
To reduce chances you will reach the character limit, see [Getting Shorter Links](#getting-shorter-links), below.

The format of the URI is:
    https://<ClusterCname>.kusto.windows.net/<DatabaseName>?query=<QueryToExecute>

For example: 
    https://help.kusto.windows.net/Samples?query=StormEvents+%7c+limit+10
 
This URI will open Kusto.Explorer, connect to the `help` Kusto cluster, and run the specified query on the `Samples` database. If there is an instance of Kusto.Explorer already running, the running instance will open a new tab and run the query in it.)

**Security note**: For security reasons, deep-linking is disabled for control commands.



### Creating a deep-link
The easiest way to create a deep-link is to author your query in Kusto.Explorer and then use
Export to Clipboard to copy the query (including the deep link and results) to the clipboard. You can then share it by email.
        
When copied to an email, the deep link is displayed in small fonts; for example:

https://help.kusto.windows.net:443/Samples [[Click to run query](https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d)] 

The first link opens Kusto.Explorer and sets the cluster and database context appropriately.
The second link (Click to run query) is the deep link. If you move to the link to an email message
and press CTRL-K, you can see the actual URL:

https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d

### Deep-links and parametrized queries

You can use Parametrized Queries with deep-linking.

1. Create a query to be formed as a Parametrized Query (for example, `KustoLogs | where Timestamp > ago({Period}) | count`) 
2. Provide a parameter for every Query Parameter in the URI
In this case:

https://mycluster.kusto.windows.net/MyDatabase?web=0&query=KustoLogs+%7c+where+Timestamp+>+ago({Period})+%7c+count&Period=1h

### Getting shorter links

Queries can become long. To reduce the chance the query exceeds the maximum length use the 
`String Kusto.Data.Common.CslCommandGenerator.EncodeQueryAsBase64Url(string query)` method 
available in Kusto Client Library. This method produces a more compact version of the query. The shorter format is also recognized by Kusto.Explorer.

https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d

The query is made more compact by applying next transformation:

```csharp
 UrlEncode(Base64Encode(GZip(original query)))
```

## Kusto.Explorer command-line arguments

Kusto.Explorer supports several command-line arguments in the following syntax (the order matters):

[*LocalScriptFile*] [*QueryString*]

Where:
* *LocalScriptFile* is the name of a script file on the local machine which must
  have the extension `.kql`. If such a file exists, Kusto.Explorer automatically
  loads this file when it starts up.
* *QueryString* is a string formatted using HTTP query string formatting. This method provides additional properties, as described in the table below.

For example, to start Kusto.Explorer with a script file called `c:\temp\script.kql`
and configured to communicate with cluster `help`, database `Samples`, use the
following command:

```
Kusto.Explorer.exe c:\temp\script.kql uri=https://help.kusto.windows.net/Samples;Fed=true&name=Samples
```

|Argument  |Description                                                               |
|----------|--------------------------------------------------------------------------|
|**Query to execute**                                                                 |
|`query`   |The query to execute (base64-encoded). If empty, use `querysrc`.          |
|`querysrc`|The URL of a file or blob holding the query to execute (if `query` is empty).|
|**Connection to the Kusto cluster**                                                  |
|`uri`     |The connection string of the Kusto cluster to connect to.                 |
|`name`    |The display name of the connection to the Kusto cluster.                  |
|**Connection group**                                                                 |
|`path`    |The URL of a connection group file to download (URL-encoded).             |
|`group`   |The name of the connection group.                                         |
|`filename`|The local file holding the connection group.                              |

## Kusto.Explorer connection files

Kusto.Explorer keeps its connections settings in the `%LOCALAPPDATA%\Kusto.Explorer` folder.
A list of Connection Groups is kept inside `%LOCALAPPDATA%\Kusto.Explorer\UserConnectionGroups.xml`,
and each Connection Group is kept inside a dedicated file under `%LOCALAPPDATA%\Kusto.Explorer\Connections\`.

### Format of connection group files

The file location is `%LOCALAPPDATA%\Kusto.Explorer\UserConnectionGroups.xml`.  

This is an XML serialization of an array of the `ServerGroupDescription` objects with the following properties:

```
  <ServerGroupDescription>
    <Name>`Connection Group name`</Name>
    <Details>`Full path to XML file containing the list of connections`</Details>
  </ServerGroupDescription>
```

Example:

```
<?xml version="1.0"?>
<ArrayOfServerGroupDescription xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <ServerGroupDescription>
    <Name>Connections</Name>
    <Details>C:\Users\alexans\AppData\Local\Kusto.Explorer\UserConnections.xml</Details>
  </ServerGroupDescription>
</ArrayOfServerGroupDescription>  
```

### Format of connection list files

File location is: `%LOCALAPPDATA%\Kusto.Explorer\Connections\`.

This is an XML serialization of an array of the `ServerDescriptionBase` objects with the following properties:

```
   <ServerDescriptionBase xsi:type="ServerDescription">
    <Name>`Connection name`</Name>
    <Details>`Details as shown in UX, usually full URI`</Details>
    <ConnectionString>`Full connection string to the cluster`</ConnectionString>
  </ServerDescriptionBase>
```

Example:

```
<?xml version="1.0"?>
<ArrayOfServerDescriptionBase xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <ServerDescriptionBase xsi:type="ServerDescription">
    <Name>Help</Name>
    <Details>https://help.kusto.windows.net</Details>
    <ConnectionString>Data Source=https://help.kusto.windows.net:443;Federated Security=True</ConnectionString>
  </ServerDescriptionBase>
</ArrayOfServerDescriptionBase>
```

## Resetting Kusto.Explorer

If you need to, you can completely reset Kusto.Explorer. Use the following procedure to progressively reset Kusto.Explorer deployed on your computer, until it's completely removed and must be installed from scratch.

1. In Windows, open **Change or remove a programs** (also known as **Programs and Features**).
1. Select every item whose name starts with `Kusto.Explorer`.
1. Select **Uninstall**.

   If this fails to uninstall the application (a known issue sometimes with
   ClickOnce applications), see [this stack overflow article](https://stackoverflow.com/questions/10896223/how-do-i-completely-uninstall-a-clickonce-application-from-my-computer) which explains how to do it.

1. Delete the folder `%LOCALAPPDATA%\Kusto.Explorer`. This removes all connections, history, and so on.

1. Delete the folder `%APPDATA%\Kusto`. This removes the Kusto.Explorer token cache. You will need to re-authenticate to all clusters.

It's also possible to revert to a specific version of Kusto.Explorer:

1. Run `appwiz.cpl`.
1. Select **Kusto.Explorer** and select **Uninstall/Change**.
3. Select **Restore the application to its previous state**.

## Troubleshooting

### Kusto.Explorer fails to start

#### Kusto.Explorer shows error dialog during or after start-up

**Symptom:**

At start-up, Kusto.Explorer shows an `InvalidOperationException` error.

**Possible solution:**

This error may suggest that the operating system became corrupted or is missing some of the essential modules.
To check missing or corrupted system files, follow the steps described here:   
[https://support.microsoft.com/help/929833/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system](https://support.microsoft.com/help/929833/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system)

### Kusto.Explorer always downloads even when there are no updates

**Symptom:**

Every time you open Kusto.Explorer, you are prompted to install a new verison. Kusto.Explorer downloads the entire package, without actually updating the already-installed version.

**Possible solution:**

This could be a result of corruption in your local ClickOnce store. You can clear the local ClickOnce store, by running the following command, in an elevated command prompt.
> [!Important]
> 1. If there are any other instances of ClickOnce applications or of `dfsvc.exe`, terminate them before running this command.
> 2. Any ClickOnce apps will reinstall automatically the next time you run them, as long as you have access to the original install location stored in the app shortcut. App shortcuts won't be deleted.

```
rd /q /s %userprofile%\appdata\local\apps\2.0
```

Try installing Kusto.Explorer again from one of the [installation mirrors](#getting-the-tool).

#### ClickOnce error: Cannot Start Application

**Symptoms:**  

* The program fails to start and displays an error containing: `External component has thrown an exception`
* The program fails to start and displays an error containing: `Value does not fall within the expected range`
* The program fails to start and displays an error containing: `The application binding data format is invalid.` 
* The program fails to start and displays an error containing: `Exception from HRESULT: 0x800736B2`

You can explore the error details by clicking `Details` in the following error dialog:

![alt text](./Images/KustoTools-KustoExplorer/clickonce-err-1.jpg "clickonce-err-1")

```
Following errors were detected during this operation.
    * System.ArgumentException
        - Value does not fall within the expected range.
        - Source: System.Deployment
        - Stack trace:
            at System.Deployment.Application.NativeMethods.CorLaunchApplication(UInt32 hostType, String applicationFullName, Int32 manifestPathsCount, String[] manifestPaths, Int32 activationDataCount, String[] activationData, PROCESS_INFORMATION processInformation)
            at System.Deployment.Application.ComponentStore.ActivateApplication(DefinitionAppId appId, String activationParameter, Boolean useActivationParameter)
            at System.Deployment.Application.SubscriptionStore.ActivateApplication(DefinitionAppId appId, String activationParameter, Boolean useActivationParameter)
            at System.Deployment.Application.ApplicationActivator.Activate(DefinitionAppId appId, AssemblyManifest appManifest, String activationParameter, Boolean useActivationParameter)
            at System.Deployment.Application.ApplicationActivator.ProcessOrFollowShortcut(String shortcutFile, String& errorPageUrl, TempFile& deployFile)
            at System.Deployment.Application.ApplicationActivator.PerformDeploymentActivation(Uri activationUri, Boolean isShortcut, String textualSubId, String deploymentProviderUrlFromExtension, BrowserSettings browserSettings, String& errorPageUrl)
            at System.Deployment.Application.ApplicationActivator.ActivateDeploymentWorker(Object state)
```

**Proposed solution steps:**

1. Uninstall the Kusto.Explorer application using `Programs and Features` (`appwiz.cpl`).

1. Try running `CleanOnlineAppCache`, and then try installing Kusto.Explorer again. From an elevated command-prompt: 
    
    ```
    rundll32 %windir%\system32\dfshim.dll CleanOnlineAppCache
    ```

    Install Kusto.Explorer again from one of the [installation mirrors](#getting-the-tool).

1. If it still fails, delete the local ClickOnce store. Any ClickOnce apps will reinstall automatically the next time you run them, as long as you have access to the original install location stored in the app shortcut. App shortcuts would not be deleted.

From an elevated command-prompt:

    ```
    rd /q /s %userprofile%\appdata\local\apps\2.0
    ```

    Install Kusto.Explorer again from one of the [installation mirrors](#getting-the-tool)

1. If it still fails, remove temp deployment files and rename the Kusto.Explorer local AppData folder.

    From an elevated command-prompt:

    ```
    rd /s/q %userprofile%\AppData\Local\Temp\Deployment
    ren %LOCALAPPDATA%\Kusto.Explorer Kusto.Explorer.bak
    ```

    Install Kusto.Explorer again from one of the [installation mirrors](#getting-the-tool)

1. To restore your connections from Kusto.Explorer.bak, from an elevated command-prompt:

    ```
    copy %LOCALAPPDATA%\Kusto.Explorer.bak\User*.xml %LOCALAPPDATA%\Kusto.Explorer
    ```

1. If it still fails, enable verbose ClickOnce logging by creating a LogVerbosityLevel string value of 1 under:

`HKEY_CURRENT_USER\Software\Classes\Software\Microsoft\Windows\CurrentVersion\Deployment`, repro it again, and send the verbose output to KEBugReport@microsoft.com. 

#### ClickOnce error: Your administrator has blocked this application because it potentially poses a security risk to your computer

**Symptom:**  
Program fails to install with either of the following errors:
* `Your administrator has blocked this application because it potentially poses a security risk to your computer`.
* `Your security settings do not allow this application to be installed on your computer.`

**Solution:**

1. This could be due to another application overriding the default ClickOnce trust prompt behavior. You can view your default configuration settings, compare them to the actual ones on your machine, and reset them as necessary, as explained [in this how-to article](https://docs.microsoft.com/visualstudio/deployment/how-to-configure-the-clickonce-trust-prompt-behavior).

#### Cleanup application data

Sometimes, when previous troubleshooting steps didn't help with getting Kusto.Explorer to start, cleaning data stored locally may help.

Data stored by Kusto.Explorer application can be found here: `C:\Users\\[your alias]\AppData\Local\Kusto.Explorer`.

> [!NOTE]
> Cleaning the data will lead to loss of opened tabs (Recovery folder), saved connections (Connections folder), and application settings (UserSettings folder).