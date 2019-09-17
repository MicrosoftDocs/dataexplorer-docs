---
title: Kusto.Explorer tool - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto.Explorer tool in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/13/2019
---
# Kusto.Explorer tool

Kusto.Explorer is a rich desktop application that allows you to explore your data using Kusto query language. 

## Getting the tool

Installation is simple as accessing your Kusto cluster with Internet Explorer at:
[https://your_cluster.kusto.windows.net](https://your_cluster.kusto.windows.net)

Alternatively, you can obtain a Kusto.Explorer tool from this URL: [https://aka.ms/Kusto.Explorer](https://aka.ms/Kusto.Explorer)



## Using Chrome and Kusto.Explorer

If you are using Chrome as your default browser - make sure to install the ClickOnce extension for Chrome:

<!-- The following link used to work but it no longer does. it could be it's not actually required * [http://www.clickoncechrome.com/install.html](http://www.clickoncechrome.com/install.html) -->
* [https://chrome.google.com/webstore/detail/clickonce-for-google-chro/kekahkplibinaibelipdcikofmedafmb/related?hl=en-US](https://chrome.google.com/webstore/detail/clickonce-for-google-chro/kekahkplibinaibelipdcikofmedafmb/related?hl=en-US)



## Overview of user experience

Kusto Explorer window has several UI parts:

1. [Menu panel](#menu-panel)
2. [Connections panel](#connections-panel)
3. Script panel
4. Results panel

![Kusto.Explorer startup](./Images/KustoTools-KustoExplorer/ke-start.png "ke-start")

### Keyboard shortcuts

Please study this [list of Kusto.Explorer keyboard shortcuts](kusto-explorer-shortcuts.md)
to truly become a Kusto.Explorer ninja master.

### Menu Panel

Kusto.Explorer Menu panel has several tabs:

* [Home](#home-tab)
* [File](#file-tab)
* [Connections](#connections-tab)
* [View](#view-tab)
* [Tools](#tools-tab)

* [Management](#management-tab)
* [Help](#help-tab)

### Home Tab

![Kusto.Explorer Home](./Images/KustoTools-KustoExplorer/home-tab.png "home-tab")

Home Tab accumulates most recently used functionality, splitted by menus:

* [Query](#query-menu)
* [Share](#share-menu)
* [Visualizations](#visualizations-menu)
* [View](#view-menu)
* [Help](#help-tab)

#### Query Menu

![Kusto.Explorer query menu](./Images/KustoTools-KustoExplorer/home-query-menu.png "query-menu")

|Menu|	Behavior|
|----|----------|
|New Tab Window| Opens a new tab window for querying Kusto |
|Mode: Query | Switches Query Window into a [script mode](#query-mode): commands can be loaded and saved as scripts (default)|
|Mode: Search| Single query mode: each command being entered is processed immediately and presents a result in the Result Window|
|Mode: Search++|Allows searching for a term using Search syntax across one or more tables. See more at using [Search++ Mode](kusto-explorer.md#search-mode)|
|Caching scope: Hot Data| Execute queries only on [hot data cache](../concepts/cachepolicy.md)|
|Caching scope: All Data| Execute queries on all available data (default)|
|DateTime Column| Name of column which may be used for time pre-filter|
|Time Filter| Value of time pre-filter|

#### Share Menu

![Kusto.Explorer share menu](./Images/KustoTools-KustoExplorer/home-share-menu.png "share-menu")

|Menu|	Behavior|
|----|----------|
|Data To Clipboard|	Exports Query and data set to a clipboard. In case chart is presented - exports the chart as bitmap| 
|Result To Clipboard| Exports data set to a clipboard. In case chart is presented - exports the chart as bitmap| 
|Query to Clipboard| Exports Query to clipboard|

#### Visualizations Menu

![alt text](./Images/KustoTools-KustoExplorer/home-visualizations-menu
.png "menu-visualizations")

|Menu         | Behavior|
|-------------|---------|
|Area chart	  | Display an area chart in which the x-axis is the first column (must be a numeric) and all numeric columns are mapped to different series (Y-axis) |
|Column Chart | Display a column chart where all numeric columns are mapped to different series (Y-axis) and the text column before numeric is the X-axis (can be controlled in the UI)|
|Bar Chart    | Display a bar chart where all numeric columns are mapped to different series (X-axis) and the text column before numeric is the Y-axis (can be controlled in the UI)|
|Stacked Area chart	  | Display a stacked area chart in which the x-axis is the first column (must be a numeric) and all numeric columns are mapped to different series (Y-axis) |
|Time Chart   | Display a time chart in which the x-axis is the first column (must be a datetime) and all numeric columns are mapped to different series (Y-axis).|
|Line Chart   | Display a line chart in which the x-axis is the first column (must be a numeric) and all numeric columns are mapped to different series (Y-axis).|
|Anomaly Chart|	Similar to timechart - while finding anomalies in time series data using machine learning anomalies algorithm. For anomaly detection, Kusto.Explorer uses [series_decompose_anomalies](../query/series-decompose-anomaliesfunction.md) function.(*) 
|Pie Chart    |	Display a pie chart in which the color-axis is the first column and the theta-axis (must be a measure, converted to percents) is the second column.|
|Ladder Chart |	Display a ladder chart in which the x-axis is the last two columns (must be a datetime) and the y-axis is a composite of the other columns.|
|Scatter Chart| Display a point graph in which the x-axis is the first column (must be a numeric) and all numeric columns are mapped to different series (Y-axis).|
|Pivot Chart  | Display a pivot table + pivot chart that gives the full flexibility of selecting data, columns, rows and various different chart types.| 
|Time Pivot   | Interactive navigation over the events time-line (pivoting on time axis)|

(*) Anomaly Chart: 
The algorithm is expecting time series data which consists of 2 columns:
1. Time in fixed interval buckets
2. Numeric value for anomaly detection
To produce that in Kusto.Explorer, you should summarize by the time field and specify the time bucket bin.

#### View Menu

![alt text](./Images/KustoTools-KustoExplorer/home-view-menu.png "view-menu")

|Menu           | Behavior|
|---------------|---------|
|Full View Mode | Maximizes the work space by hiding ribbon menu and Connection Panel|
|Increase Font  | Increases fonts of the query tab and of the results data grid|  
|Decrease Font  | Decreases fonts of the query tab and of the results data grid| 
|Hide Empty Columns| Removes empty columns from the data grid|
|Collapse Singular Columns| Collapses columns with singular value|
|Explore Column Values| Shows column values distribution|

(*) Data View Settings:
Kusto.Explorer keeps track of what settings are used per unique set of the columns, 
so when columns are reordered/removed - the data view is saved and will be reused
whenever the data with the same columns is retrieved. To reset the view to its defaults,
use `Reset View` menu item. 

### File Tab

![Kusto.Explorer File](./Images/KustoTools-KustoExplorer/file-tab.png "file-tab")

|Menu| Behavior|
|---------------|---------|
||---------*Query Script*---------|
|New Tab Window| Opens a new tab window for querying Kusto |
|Open File| Loads data from provided *.csl file to active script panel|
|Save To File| Saves content of active script panel to *.csl file|
|Query Srcipt|Close Tab| Closes current tab window|
||---------*Save Data*---------|
|To CSV       | Exports data to CSV (comma-separated-values) file| 
|To JSON      | Exports data to JSON formatted file|
|To Excel     | Exports data to XLSX (Excel) file|
|To Text      |	Exports data to TXT (text) file| 
|To CSL Script|	Exports Query to a script file| 
|To Results   |	Exports Query and data to Results (QRES) file|
||---------*Load Data*---------|
|From Results|	Loads Query and data from Results (QRES) file| 
||---------*Clipboard*---------|
|Data To Clipboard|	Exports Query and data set to a clipboard. In case chart is presented - exports the chart as bitmap| 
|Result To Clipboard| Exports data set to a clipboard. In case chart is presented - exports the chart as bitmap| 
|Query to Clipboard| Exports Query to clipboard|
||---------*Results*---------|
|Clear results cache| Clears cached results of previously executed queries| 

### Connections Tab

![Kusto.Explorer connections tab](./Images/KustoTools-KustoExplorer/connections-tab.png "connections-tab")

|Menu|Behavior|
|----|----------|
||---------*Groups*---------|
|Add gourp| Adds a new Kusto Server group| 
|Rename group| Renames the existing Kusto Server group|
|Remove group| Removes the existing  Kusto Server group|
||---------*Clusters*---------|
|Import connections| Imports connections from a file specifying connections|
|Export connections| Exports connections to file|
|Add connection| Adds a new Kusto Server connection| 
|Edit connection| Opens a dialog for Kusto Server connection properties editing|
|Remove connection| Removes the existing connection to Kusto Server|
|Refresh| Refreshes properties of Kusto server connection|
||---------*Identity Providers*---------|
|Inspect Connection Principal| Shows currents active user details|
|Sign-out From AAD| Signs-out current user from connection to AAD|

### View Tab

![view tab](./Images/KustoTools-KustoExplorer/view-tab.png "view-tab")

|Menu|Behavior|
|----|----------|
||---------*Appearance*---------|
|Full View Mode | Maximizes the work space by hiding ribbon menu and Connection Panel|
|Increase Font  | Increases fonts of the query tab and of the results data grid|  
|Decrease Font  | Decreases fonts of the query tab and of the results data grid|
||---------*Data View*---------|
|Reset View| Resets data view settings (*)|
|Hide Duplicates| Removes duplicate results from the data grid|
|Filter Rows in Search| Allows to filter rows during search in query result|
|Hide Empty Columns| Removes empty columns from the data grid|
|Collapse Singular Columns| Collapses columns with singular value|
|Explore Column Values| Shows column values distribution|

(*) Data View Settings: Kusto.Explorer keeps track of what settings are used per unique set of the columns, so when columns are reordered/removed - the data view is saved and will be reused whenever the data with the same columns is retrieved. To reset the view to its defaults, use Reset View menu item. 

### Tools Tab

![tools tab](./Images/KustoTools-KustoExplorer/tools-tab.png "tools-tab")

|Menu|Behavior|
|----|----------|
||---------*IntelliSense*---------|
|Enable IntelliSense| Enables/Disables IntelliSense on Script Panel)|
||---------*Analyze*---------|
|Query Analyzer| Launches Query Analyzer tool|
|Calculator| Launches Calculator|
||---------*Analytics*---------|
|Analytical Reports| Opens dashboard with multiple pre-built reports for data analysis|
||---------*Translate*---------|
|Query to Power BI| Translates query to format suitable for using in Power BI|
||---------*Options*---------|
|Reset Options| Sets application settings to default values|
|Options| Opens tool for application settings edit|



### Management Tab

![management tab](./Images/KustoTools-KustoExplorer/management-tab.png "management-tab")

|Menu             | Behavior|
|-----------------|---------|
||---------*Authorized Principals*---------|
|Manage Cluster Authorized Principals | When in context of a cluster, enables managing its principals for authorized users| 
|Manage Database Authorized Principals | When in context of a database, enables managing its principals for authorized users| 
|Manage Table Authorized Principals | When in context of table, enables managing its principals for authorized users| 
|Manage Function Authorized Principals | When in context of a function, enables managing its principals for authorized users| 

### Help Tab

![help tab](./Images/KustoTools-KustoExplorer/help-tab.png "help-tab")

|Menu             | Behavior|
|-----------------|---------|
||---------*Documentation*---------|
|Help             | Opens a link to the Kusto online documentation  | 
|What's new       | Opens a document that lists all Kusto.Explorer changes|
|Get support      | Opens a link to the support-ticket web page | 
|Suggest Feature  | Opens a link to the Kusto feedback forum | 
|Report Issue     | Opens html file with the details that should be send with the issue report | 

## Connections Panel

![alt text](./Images/KustoTools-KustoExplorer/connectionsPanel.png "connections-panel") 

The left pane of Kusto.Explorer shows all the cluster connections that the client
is configured with, and for each cluster -- the databases, tables, and attributes (columns) 
that they store. The pane allows one to select items (which sets an implicit context
for the search/query in the main panel), or double-click items to copy the name to the
search/query panel.

If the actual schema is large (such as a database with hundreds of tables), it is possible to search the schema by typing CTRL+F and a 
substring (case-insensitive) of the entity name being looked-for.

Kusto.Explorer supports controlling the connection panel from the query window.
This is very useful for scripts, for example. Starting a script file with a command
that instructs Kusto.Explorer to connect to the cluster/database whose data is being
queries by the script is possible by using the following syntax (note that,
as usual, you'll have to run each line using `F5` or similar):

```kusto
#connect cluster('help').database('Samples')

StormEvents | count
```

### Controlling the user identity used for connecting to Kusto

When adding a new connection, the default security model used is
AAD-Federated security, in which authentication is done through
Azure Active Directory using the default AAD user experience.

In some cases, one needs finer control over the authentication parameters
than is available by AAD. In such cases, it is possible to expand the
"Advanced: Connection Strings" edit box and provide a valid
[Kusto connection string](../api/connection-strings/kusto.md) value.

For example, users who have presence in
multiple AAD tenants sometimes need to use a particular "projection"
of their identities to a specific AAD tenant. This can be done by
providing a connection string like so (words IN CAPITAL are to be
replaced by specific values):

```
Data Source=https://CLUSTER_NAME.kusto.windows.net;Initial Catalog=DATABASE_NAME;AAD Federated Security=True;Authority Id=AAD_TENANT_OF_CLUSTER;User=USER_DOMAIN
```

Here, the unique thing is that `AAD_TENANT_OF_CLUSTER` is a domain name
or AAD tenant ID (a GUID) of the AAD tenant in which the cluster is hosted
(usually the organization domain name who owns the cluster, such as 
`contoso.com`), and USER_DOMAIN is the identity of the user who has been
invited into that tenant (e.g., `joe@fabrikam.com`). Note that the domain
name of the user is not necessarily the same as that of the tenant hosting
the cluster.

## Search++ Mode

1. In the ribbon's Home, in the dropdown, choose "Search++"
2. Choose "Multiple tables" and then under "Choose tables" you can define which tables to search
3. In the edit box write your search phrase and hit "Go"
4. You will get a heat-map of table/time-slot grid showing which term appears where
5. Select a cell in the grid and click "View Details" to show the relevant entries

![alt text](./Images/KustoTools-KustoExplorer/ke-search-beta.jpg "ke-search-beta") 

## Query Mode

Kusto.Explorer has powerful script mode - that allows you write, edit and run ad-hoc queries. 
It comes with syntax highlighting and IntelliSense - so you can ramp-up to Kusto CSL
language very fast.

### Basic Queries
Assume you have table Logs. You can start exploring it by typing next:

```kusto
StormEvents | count 
```

When your cursor is positioned on this line - it is colored in gray - and pressing 'F5' will 
run the query. 

Some more queries:

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

First, make sure you have created the table with a schema which matches your file
(e.g. using the [.create table](../management/tables.md) command)

Second, make sure the contents of your file match its extension. E.g.:
- If your file contains comma-separated-values, make sure your file is named "MyFile.csv".
- If your file contains tab-separated-values, make sure your file is named "MyFile.tsv".

Once the above are verified, follow these steps:

1. Right-click on the target database in the [Connections panel](#connections-panel), and select `Refresh`, so that your table appears.

    ![alt text](./Images/KustoTools-KustoExplorer/right-click-refresh-schema.png "right-click-refresh-schema")

2. Right-click on the target table in the [Connections panel](#connections-panel), and select `Import data from local files`.

    ![alt text](./Images/KustoTools-KustoExplorer/right-click-import-local-file.png "right-click-import-local-file")

3. Choose the file(s) you wish to be uploaded and select `Open`.

    ![alt text](./Images/KustoTools-KustoExplorer/import-local-file-choose-files.png "import-local-file-choose-files")

4. Follow the progress, until operation completes

    ![alt text](./Images/KustoTools-KustoExplorer/import-local-file-progress.png "import-local-file-progress")

    ![alt text](./Images/KustoTools-KustoExplorer/import-local-file-complete.png "import-local-file-complete")

5. Query the data in your table (double-click on the table in the [Connections panel](#connections-panel)).

## Managing Authorized Principals

Kusto.Explorer provides a convenient way to manage cluster, database, table or function authorized principals.

Please note that only [admins](../management/access-control/role-based-authorization.md) can add or drop authorized principals in their own scope.

1. Right-click on the target entity in the [Connections panel](#connections-panel), and select `Manage Authorized Principals`
    (also available via the Management Menu).

    ![alt text](./Images/KustoTools-KustoExplorer/right-click-manage-authorized-principals.png "right-click-manage-authorized-principals")

    ![alt text](./Images/KustoTools-KustoExplorer/manage-authorized-principals-window.png "manage-authorized-principals-window")

2. In case you want to add a new authorized principal, select `Add principal`, provide the principal details and confirm the action.

    ![alt text](./Images/KustoTools-KustoExplorer/add-authorized-principals-window.png "add-authorized-principals-window")

    ![alt text](./Images/KustoTools-KustoExplorer/confirm-add-authorized-principals.png "confirm-add-authorized-principals")

3. In case you want to drop an existing authorized principal, select `Drop principal` and confirm the action.

    ![alt text](./Images/KustoTools-KustoExplorer/confirm-drop-authorized-principals.png "confirm-drop-authorized-principals")

## Sharing Queries and Results over Email

Kusto.Explorer provides a convenient way to share queries and query results over email -- Simply click "Export to Clipboard", and the tool will copy to the clipboard:
1. Your query
2. The query results (table or chart)
3. The connection details for the Kusto cluster and database
4. A link that will re-run the query automatically

Here's how it works:

1. Run some query in Kusto.Explorer
2. Click "Export to Clipboard" (or use `Ctrl+Shift+C` keystroke)

![alt text](./Images/KustoTools-KustoExplorer/menu-export.png "menu-export")

3. Switch to (for example) an Outlook Message:

![alt text](./Images/KustoTools-KustoExplorer/share-results.png "share-results")
    
4. Hit "Paste:":

![alt text](./Images/KustoTools-KustoExplorer/share-results-2.png "share-results-2")

## Client-Side Query Parametrization

> [!WARNING]
> There are two typed of query parametrization techniques in Kusto:
> [Language-integrated query parametrization](../query/queryparametersstatement.md) is implemented as part
> of the query engine and meant to be used by applications that
> query the service programmatically.
>
> Client-side query parametrization, described below, is a feature
> of the Kusto.Explorer application only. It is equivalent to doing
> string-replace operations on the queries the user writes before sending
> them to be executed by the service. The syntax described below is not
> part of the query language itself, and cannot be used when sending
> queries to the service by means other than Kusto.Explorer.

If you plan to use same value in multiple queries or in multiple tabs, it is going to 
be hard to change it. Luckily, Kusto.Explorer supports having Query parameters. Parameters 
are denoted with {} brackets. For example: `{parameter1}`

Script editor highlights query parameters:

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-1.png "parametrized-query-1")

You can easily define/edit existing Query parameters:

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-2.png "parametrized-query-2")

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-3.png "parametrized-query-3")

Script editor also has IntelliSense for Query parameters that are already defined:

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-4.png "parametrized-query-4")

There can be multiple "sets" of parameters (listed in Parameters Set combo box).
Buttons, "Add new" and "Delete current" manipulate list of Parameters "sets".

![alt text](./Images/KustoTools-KustoExplorer/parametrized-query-5.png "parametrized-query-5")

Note that Query parameters are shared among tabs, so that they can be easily reused.

## Deep-linking queries

### Overview
It is possible to create a URI that, when opened in a browser, will have Kusto.Explorer 
start locally and run a specified query on the specified Kusto database.

### Limitations
The queries are limited to ~2000 chars due to IE limitation (the limitation is approximate because it is dependent on the cluster and Database name length)
https://support.microsoft.com/en-us/kb/208427 
To reduce chances you will hit this limitation - see the Getting Shorter Links paragraph on this page.

The format of the URI is this:
    https://<ClusterCname>.kusto.windows.net/<DatabaseName>?query=<QueryToExecute>
 
For example: 
    https://help.kusto.windows.net/Samples?query=StormEvents+%7c+limit+10
 
This URI will open new Kusto.Explorer, connect to the `help` Kusto cluster, and run the specified query on the specified database (whose name is `Samples`). (Unless there is an instance of Kusto.Explorer already running, in which case the running instance will open a new tab and run the query in it.)

**Security note**: For security reasons, deep-linking is disabled for control commands.



### Creating a Deep-Link: the Easy Way
The easiest way to create a deep-link is to author your query in Kusto.Explorer, and then use
the Export to Clipboard button to copy the query (plus the deep link and results) to the clipboard,
ready for sharing via Outlook:
        
When pasted to Outlook (or a similar app), the deep link is in small fonts; for example:

https://help.kusto.windows.net:443/Samples [[Click to run query](https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d)] 

The first link opens Kusto.Explorer and sets the cluster/database context appropriately.
The second link ("Click to run query") is the deep link. If you move to the link in Outlook
and press CTRL-K, you can see the actual URL:

https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d

### Deep-link and Parametrized Queries
It is possible to use Parametrized Queries with deep-linking.
First, make a query to be formed as Parametrized Query (e.g. KustoLogs | where Timestamp > ago({Period}) | count) 
Second, provide a parameter for every Query Parameter in the URI
In this case
https://mycluster.kusto.windows.net/MyDatabase?web=0&query=KustoLogs+%7c+where+Timestamp+>+ago({Period})+%7c+count&Period=1h

### Getting Shorter Links
Queries may become longer - and in order to reduce the chance query exceeds maximum length - you 
can use 
`String Kusto.Data.Common.CslCommandGenerator.EncodeQueryAsBase64Url(string query)` method 
available in Kusto Client Library that will produce a more compact version of the query and this 
format is also recognized by Kusto.Explorer

https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d

How does making compact query work?
The query is made more compact by applying next transformation:

```csharp
 UrlEncode(Base64Encode(GZip(original query)))
```

## Kusto.Explorer command-line arguments

Kusto.Explorer supports accepting several command-line arguments in the following syntax (order matters):

[*LocalScriptFile*] [*QueryString*]

Where:
* *LocalScriptFile* is the name of a script file on the local machine which must
  have the extension `.csl`. If such file exists, Kusto.Explorer will automatically
  load this file when it starts up.
* *QueryString* is a string formatted using the HTTP query string formatting,
  which provides additional properties as described in the table below.

For example, to start Kusto.Explorer with a script file called `c:\temp\script.csl`
and configured to communicate with cluster `help`, database `Samples`, use the
following command:

```
Kusto.Explorer.exe c:\temp\script.csl uri=https://help.kusto.windows.net/Samples;Fed=true&name=Samples
```

|Argument  |Description                                                               |
|----------|--------------------------------------------------------------------------|
|**Query to execute**                                                                 |
|`query`   |The query to execute (base64-encoded); if empty, use `querysrc`.          |
|`querysrc`|The URL of a file/blob holding the query to execute (if `query` is empty).|
|**Connection to the Kusto cluster**                                                  |
|`uri`     |The connection string of the Kusto cluster to connect to.                 |
|`name`    |The display name of the connection to the Kusto cluster.                  |
|**Connection group**                                                                 |
|`path`    |The URL of a connection group file to download (URL-encoded).             |
|`group`   |The name of the connection group.                                         |
|`filename`|The local file holding the connection group.                              |

## Kusto.Explorer connection files

Kusto.Explorer keeps its connections settings under `%LOCALAPPDATA%\Kusto.Explorer` folder.
List of Connection Groups is kept inside `%LOCALAPPDATA%\Kusto.Explorer\UserConnectionGroups.xml`,
and each Connection Group is kept inside dedicated file under `%LOCALAPPDATA%\Kusto.Explorer\Connections\`.

### Format of Connection Group file

File location is at `%LOCALAPPDATA%\Kusto.Explorer\UserConnectionGroups.xml`:  

This is an XML serialization of an array of the `ServerGroupDescription` objects with next properties:

```
  <ServerGroupDescription>
    <Name>`Connection Group name`</Name>
    <Details>`Full path to XML file containing the list of connections`</Details>
  </ServerGroupDescription>
```

#### Example of Connection Group file

```
<?xml version="1.0"?>
<ArrayOfServerGroupDescription xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <ServerGroupDescription>
    <Name>Connections</Name>
    <Details>C:\Users\alexans\AppData\Local\Kusto.Explorer\UserConnections.xml</Details>
  </ServerGroupDescription>
</ArrayOfServerGroupDescription>  
```

### Format of Connection list file

File location is under `%LOCALAPPDATA%\Kusto.Explorer\Connections\`:  

This is an XML serialization of an array of the `ServerDescriptionBase` objects with next properties:

```
   <ServerDescriptionBase xsi:type="ServerDescription">
    <Name>`Connection name`</Name>
    <Details>`Details as shown in UX, usually full URI`</Details>
    <ConnectionString>`Full connection string to the cluster`</ConnectionString>
  </ServerDescriptionBase>
```

#### Example of Connection list file

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

In some cases you might need to completely reset Kusto.Explorer. The following procedure can be used to progressively reset Kusto.Explorer deployed on your computer, until it is completely removed and must be installed from scratch.

1. Open `Change or remove a program` (also known as `Programs and Features`),
   then select every item whose name starts with `Kusto.Explorer` and hit `Uninstall`.

   If this fails to uninstall the application (a known issue sometimes with
   ClickOnce applications), please see [this](https://stackoverflow.com/questions/10896223/how-do-i-completely-uninstall-a-clickonce-application-from-my-computer).

2. Delete the folder `%LOCALAPPDATA%\Kusto.Explorer`. (NOTE: This removed all connections that you might have, history, etc..)

3. Delete the folder `%APPDATA%\Kusto`. (NOTE: This removes the Kusto.Explorer token cache; you will need to re-authenticate to all cluster.)

It is also possible to "go back" to a specific version of Kusto.Explorer:

1. Run `appwiz.cpl`
2. Select `Kusto.Explorer` and hit `Uninstall/Change`
3. Select `Restore the application to its previous state`

## Troubleshooting

### Kusto.Explorer fails to start

#### Kusto.Explorer shows error dialog during or after start-up

*Symptoms:*

- Kusto.Explorer shows error dialog at start-up with error containing: `InvalidOperationException` 

*Possible solution:*

This error may suggest that OS system became corrupted or missing some of the essential modules.
To check missing or corrupted system files - use steps described here:   
[https://support.microsoft.com/en-us/help/929833/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system](https://support.microsoft.com/en-us/help/929833/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system)

### Kusto.Explorer always downloads even when there are no updates

*Symptoms:*

- Each time you open Kusto.Explorer it asks you to install a new verison and downloads the entire package, without actually updating the already-installed version.

*Possible solution:*

- This could be a result of corruption in your local ClickOnce store.
- You can clear the local ClickOnce store, by running the following command, in an elevated command prompt.
    * Notes:
        1. If there are any instances of other ClickOnce applications or or `dfsvc.exe`, terminate them before running this command.
        2. Any ClickOnce apps will reinstall automatically the next time you run them, as long as you have access to the original install location stored in the app shortcut. App shortcuts will not be deleted.

    ```
    rd /q /s %userprofile%\appdata\local\apps\2.0
    ```

- Then, try installing Kusto.Explorer again from one of the [installation mirrors](#getting-the-tool)


#### ClickOnce error: Cannot Start Application

*Symptoms:*  

- Program fails to start with error containing: `External component has thrown an exception`
- Program fails to start with error containing: `Value does not fall within the expected range`
- Program fails to start with error containing: `The application binding data format is invalid.` 
- Program fails to start with error containing: `Exception from HRESULT: 0x800736B2`

The error details may be explored by clicking `Details` in the following error dialog:

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

*Proposed solution steps:*
 
1.	Uninstall Kusto.Explorer application using Programs and Features (appwiz.cpl)

2.	First just try running CleanOnlineAppCache, then try the install again. From elevated CMD: 

    rundll32 %windir%\system32\dfshim.dll CleanOnlineAppCache

Try installing again from one of the [installation mirrors](#getting-the-tool)

3.	If it still fails, delete the local ClickOnce store. Any ClickOnce apps will reinstall automatically the next time you run them, as long as you have access to the original install location stored in the app shortcut. App shortcuts would not be deleted.

From elevated CMD:

    rd /q /s %userprofile%\appdata\local\apps\2.0

Try installing again from one of the [installation mirrors](#getting-the-tool)

4.	If it still fails, remove temp deployment files and rename the Kusto.Explorer local AppData folder.

From elevated CMD:

    rd /s/q %userprofile%\AppData\Local\Temp\Deployment
    ren %LOCALAPPDATA%\Kusto.Explorer Kusto.Explorer.bak

Try installing again from one of the [installation mirrors](#getting-the-tool)

5.	To restore your connections from Kusto.Explorer.bak, from elevated CMD, run:

    copy %LOCALAPPDATA%\Kusto.Explorer.bak\User*.xml %LOCALAPPDATA%\Kusto.Explorer

6.	If it still fails, enable verbose ClickOnce logging by creating a LogVerbosityLevel string value of 1 under:

`HKEY_CURRENT_USER\Software\Classes\Software\Microsoft\Windows\CurrentVersion\Deployment`, repro it again, and send the verbose output to 
KEBugReport@microsoft.com. 

#### ClickOnce error: Your administrator has blocked this application because it potentially poses a security risk to your computer

*Symptom:*  
Program fails to install with either of the following errors:
- `Your administrator has blocked this application because it potentially poses a security risk to your computer`.
- `Your security settings do not allow this application to be installed on your computer.`

*Solution:*
1. This could be due to another application overriding the default ClickOnce trust prompt behavior.

2. You can view your default configuration settings, compare them to the actual ones on your machine, and reset them as necessary, as explained [here](https://docs.microsoft.com/en-us/visualstudio/deployment/how-to-configure-the-clickonce-trust-prompt-behavior).

#### Cleanup application data

Sometimes, when previous troubleshooting steps didn't help with getting Kusto.Explorer to start, cleaning data that is stored locally may help.

Data stored by Kusto.Explorer application can be found here: C:\Users\\[your alias]\AppData\Local\Kusto.Explorer.

Please, pay attention that cleaning the data will lead to the loss of opened tabs (Recovery folder), saved connections (Connections folder), application settings (UserSettings folder).