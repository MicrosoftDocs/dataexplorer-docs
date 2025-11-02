---
title: Using Kusto.Explorer
description: Learn how to use Kusto.Explorer to query, analyze, and share data. This guide covers query modes, parameterization, and database management.Learn how to use Kusto.Explorer
ms.reviewer: alexans
ms.topic: conceptual
ms.date: 11/02/2025
ms.custom: sfi-image-nochange
---

# Using Kusto.explorer

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Kusto.Explorer is a desktop application that enables you to explore data using the Kusto Query Language (KQL) in an intuitive interface. This guide explains how to use search and query modes, share queries, and manage clusters, databases, and tables for streamlined data analysis.

## Search++ mode

Search++ mode enables you to search for a term using search syntax across one or more tables.

1. On the **Home** tab, in the **Query** dropdown, select **Search++**.
1. Select **Multiple tables**.
1. Under **Choose tables**, specify the tables to search, and then select **OK**.
1. In the edit box, enter the search phrase, and select **Go**.

    A heat map of the table and time-slot grid shows where the terms appear.

    :::image type="content" source="media/kusto-explorer-using/search-plus-plus.png" alt-text="Screenshot of Search++ in Kusto Explorer.":::

1. Select a cell in the grid, and then select **View Details** to show the relevant entries in the results pane.

    :::image type="content" source="media/kusto-explorer-using/search-plus-plus-results.png" alt-text="Screenshot of Search++ results in Kusto Explorer.":::

## Query mode

Kusto.Explorer includes a powerful query mode that lets you write, edit, and run inline queries. The query mode includes syntax highlighting and IntelliSense, so you quickly improve your knowledge of the Kusto Query Language.

This section explains how to run basic queries in Kusto.Explorer and add parameters to queries.

## Basic queries

If you have table Logs, you can start exploring them:

```kusto
StormEvents | count 
```

When your cursor is on this line, it is gray. Select **F5** to run the query.

Here are some more example queries:

```kusto
// Take 10 lines from the table. This is useful to get familiar with the data.
StormEvents | take 10 
```

```kusto
// Filter by EventType == 'Flood' and State == 'California' (where =~ means case insensitive). 
// Take a sample of 10 lines.
StormEvents 
| where EventType == 'Flood' and State =~ 'California'
| take 10
```

:::image type="content" source="media/kusto-explorer-using/basic-query.png" alt-text="Screenshot of Kusto Explorer showing a basic query.":::

Learn more about Kusto Query Language in [Kusto Query Language](../query/index.md).

> [!NOTE]
> Blank lines in the query can affect which part of the query runs.
>
> If no text is selected, the query or command is separated by empty lines. If text is selected, only the selected text runs.

## Client-side query parameterization

> [!NOTE]
> There are two types of query parameterization techniques in Kusto:
>
> * [Language-integrated query parametrization](../query/query-parameters-statement.md) is implemented server-side and is meant to be used by applications that query the service programmatically. This method is not described in this document.
>
> * Client-side query parameterization is a feature of the Kusto.Explorer application only. It's equivalent to using string replace operations on the queries before sending them to the service. The syntax is not part of the query language itself and can't be used when sending queries to the service by means other than Kusto.Explorer.

If you use the same value in multiple queries or tabs, it's inconvenient to change that value in every place it's used. Kusto.Explorer lets you use query parameters for convenience. Query parameters are shared across tabs, so you can reuse them easily. Parameters are denoted by curly brackets ({}). For example, `{parameter1}`.

Define and edit query parameters:

:::image type="content" source="media/kusto-explorer-using/parametrized-query.png" alt-text="Screenshot of the query editor showing a query with parameters. The query editor option **Query parameters** is highlighted.":::

:::image type="content" source="media/kusto-explorer-using/parametrized-query-3.png" alt-text="Screenshot of the **Query parameters** window showing the defined parameters.":::

You can use multiple sets of parameters, listed in the **Parameters Set** combo box.
Select **Add new** or **Delete current** to manage parameter sets.

:::image type="content" source="media/kusto-explorer-using/parametrized-query-5.png" alt-text="Screenshot of the list of parameter sets.":::

## Share queries and results

In Kusto.Explorer, share queries and results by email. Create deep links to open and run a query in the browser.

### Share queries and results by email

Share queries and query results by email in Kusto.Explorer.

:::moniker range="azure-data-explorer"

1. Run the query in Kusto.Explorer.
1. In the **Home** tab, in the **Share** section, select **Query and Results to Clipboard** (or press Ctrl+Shift+C).

    :::image type="content" source="media/kusto-explorer-using/menu-export.png" alt-text="Screenshot of the Query and results to clipboard menu item.":::

    Kusto.Explorer copies the following to the clipboard:
     * Your query
     * The query results (table or chart)
     * The connection details for the Kusto cluster and database
     * A link that reruns the query automatically
1. Paste the contents from the clipboard into a new email message.
::: moniker-end
:::moniker range="microsoft-fabric"
1. [Run your query](#basic-queries) in Kusto.Explorer.
1. In the **Home** tab, in the **Share** section, select **Query and Results to Clipboard** (or press Ctrl+Shift+C).

    :::image type="content" source="media/kusto-explorer-using/menu-export.png" alt-text="Screenshot of the Query and results to clipboard menu item.":::

    Kusto.Explorer copies the following to the clipboard:
     * Your query
     * The query results (table or chart)
     * The connection details for the eventhouse and database
     * A link that reruns the query automatically
1. Paste the contents of the clipboard into a new email message.
    :::image type="content" source="media/kusto-explorer-using/share-results-fabric.png" alt-text="Screenshot of the shared results from a Fabric KQL database in an email." lightbox="media/kusto-explorer-using/share-results-fabric.png":::
::: moniker-end

### Deep linking queries

You can create a URI that, when opened in a browser, opens Kusto.Explorer locally and runs a specific query on a specified Kusto database.

> [!NOTE]
> For security reasons, deep-linking is disabled for management commands.

#### Creating a deep-link

The easiest way to create a deep link is to write the query in Kusto.Explorer and then use `Query and results to Clipboard` to copy the query, including the deep link and results, to the clipboard. You can then share it by email.

When copied to an email, a number of links to execute are displayed in small font. For example:

:::moniker range="azure-data-explorer"
> Execute: [[Web](https://dataexplorer.azure.com/clusters/https%3a%2f%2fhelp.kusto.windows.net/databases/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d)] [[Desktop](https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d)] [Web (Lens)] [Desktop (SAW)] https:\/\/help.kusto.windows.net/Samples
::: moniker-end
:::moniker range="microsoft-fabric"

> Execute: [Web] [Desktop] [Web (Lens)] [Desktop (SAW)] https:\/\/trd-1234.kusto.fabric.microsoft.com

::: moniker-end

The **Web** link opens the query in Azure Data Explorer. The **Desktop** link is the deeplink. It opens the query in Kusto.Explorer and sets the context appropriately.

If you move the link to an email message and press CTRL+K, you can see the actual URL.

:::moniker range="azure-data-explorer"
> https:\/\/help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d
::: moniker-end

#### Deep links and parameterized queries

You can use parametrized queries with deep-linking.

1. Create a query to be formed as a parametrized query (for example, `KustoLogs | where Timestamp > ago({Period}) | count`)

:::moniker range="azure-data-explorer"
1. Provide a parameter for every query parameter in the URI. To copy your URI, in the Azure portal, go to your cluster's overview page, and then select the URI. The URI should be in the following format: 

   `https://<your_cluster>.kusto.windows.net/MyDatabase?
web=0&query=KustoLogs+%7c+where+Timestamp+>+ago({Period})+%7c+count&Period=1h`

    Replace &lt;your_cluster&gt; with your Azure Data Explorer cluster name.
1. Paste the query link directly into your Kusto.Explorer query pane.
::: moniker-end
:::moniker range="microsoft-fabric"
1. Provide a parameter for every query parameter in the URI. To copy your URI, in your KQL query pane in Fabric select **Copy query** > **Link to clipboard**.

1. Paste the link into your Kusto.Explorer query pane.

> [!NOTE]
> To ensure that you can run the query in Kusto.Explorer, make sure that you can connect to the database referred to in the query.
::: moniker-end

#### Limitations

The queries are limited to ~2,000 characters because of browser limitations, HTTP proxies, and tools that validate links, such as Microsoft Outlook. The limitation is approximate because it's dependent on the cluster and Database name length. For more information, see [https://support.microsoft.com/kb/208427](https://support.microsoft.com/kb/208427).

To reduce the chances of reaching the character limit, see [Getting Shorter Links](#getting-shorter-links).

:::moniker range="azure-data-explorer"
The format of the URI is:
    `https://<ClusterCname>.kusto.windows.net/<DatabaseName>web=0?query=<QueryToExecute>`

For example:
    [https://help.kusto.windows.net/Samples?web=0query=StormEvents+%7c+limit+10](https://help.kusto.windows.net/Samples?web=0query=StormEvents+%7c+limit+10)

This URI opens Kusto.Explorer, connect to the `Help` Kusto cluster, and runs the specified query on the `Samples` database. If there's an instance of Kusto.Explorer already running, the running instance opens a new tab and runs the query in it.
::: moniker-end
:::moniker range="microsoft-fabric"

 The URI opens Kusto.Explorer and runs the specified query. A new tab is opened if there's already a running instance.

::: moniker-end

### Getting shorter links

Queries can become long. To reduce the chance of exceeding the maximum length, use the `String Kusto.Data.Common.CslCommandGenerator.EncodeQueryAsBase64Url(string query)` method in the Kusto Client Library. This method produces a more compact version of the query. The shorter format is also recognized by Kusto.Explorer.

:::moniker range="azure-data-explorer"
https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d
::: moniker-end

:::moniker range="microsoft-fabric"
> https://<\BaseAddress>/groups/1234ab-cd55-6789-0123-e4567fg890hi/databases/01234abc-defg-6789-4567fg890hi?experience=power-bi&extensionScenario=openArtifact&query=1234AAAAAAAAAAA567890BBBBBBBBBB01234567890CCCCCCC1234AAAAAAAAAAA567890BBBBBBBBBB01234567890CCCCCCC1234AAAAAAAAAAA567890BBBBBBBBBB01234567890CCCCCCC%AB%AB
::: moniker-end

Make the query more compact by applying the following transformation:

```csharp
 UrlEncode(Base64Encode(gzip(original query)))
```

## Kusto.Explorer command-line arguments

Command-line arguments let the tool perform more functions on startup, like loading a script and connecting to a cluster. However, command-line arguments don't replace any Kusto.Explorer functionality.

Command-line arguments are part of the URL used to open the application, similar to [query deep-linking](#creating-a-deep-link).

### Command-line argument syntax

Kusto.Explorer supports several command-line arguments using this syntax (order matters):

[*LocalScriptFile*] [*QueryString*]

#### Command-line arguments

|Command-line argument  |Description  |
|-----------|----------------------------------------|
| *LocalScriptFile* | The name of a script file on your local machine, which must have the extension `.kql`. If the file exists, Kusto.Explorer automatically loads the file when it starts up. |
| *QueryString* | A string that uses HTTP query string formatting. This method provides more properties, as described in the following table.|

#### Querystring arguments

|Argument  |Description |
|----------|------------------------------------------------
|**Query to execute**                                                                 |
|`query`   |The query to execute (gzipped, then base64-encoded; see [Getting shorter links](#getting-shorter-links)). If not specified, uses `querysrc`.|
|`querysrc`|The URL of a file/blob holding the query to execute.|
|**Connection to the Kusto cluster**                                                  |
|`uri`     |The connection string of the Kusto cluster to connect to.                 |
|`name`    |The display name of the connection to the Kusto cluster.                  |
|**Connection group**                                                                 |
|`path`    |The URL of a connection group file to download (URL-encoded).             |
|`group`   |The name of the connection group.                                         |
|`filename`|The local file holding the connection group.                              |

#### Example

:::moniker range="azure-data-explorer"
To start Kusto.Explorer with a script file called `c:\temp\script.kql` and set up to communicate with the cluster `help` and database `Samples`, run this command:

```kusto
Kusto.Explorer.exe c:\temp\script.kql "uri=https://help.kusto.windows.net/Samples;Fed=true&name=Samples"
```

::: moniker-end
:::moniker range="microsoft-fabric"
To start Kusto.Explorer with a script file called `c:\temp\script.kql` and set up to communicate with a specific group and database, run this command:

```kusto
Kusto.Explorer.exe c:\temp\script.kql "uri=https://<baseaddress>/groups/<GroupID>/databases/<DatabaseID>"
```

::: moniker-end


## Manage databases, tables, or function-authorized principals

> [!IMPORTANT]
> Only [admins](../access-control/role-based-access-control.md) can add or remove authorized principals in their own scope.

1. To view the list of authorized principals, open the [Connections panel](kusto-explorer.md#connections-tab), right-click the target entity, and select **Manage Database Authorized Principals**. You can also select this option from the Management menu.

    :::image type="content" source="media/kusto-explorer-using/right-click-manage-authorized-principals.png" alt-text="Screenshot of the entity dropdown menu. The option titled Manage Database Authorized Principals is highlighted.":::

1. Select **Add principal** to add an authorized principal.
    :::image type="content" source="media/kusto-explorer-using/manage-authorized-principals-window.png" alt-text="Screenshot of the Manage authorized principals window. The options titled Drop principal and Add principal are highlighted.":::

1. Enter the principal details, then select **Add principal**.

    :::image type="content" source="media/kusto-explorer-using/add-authorized-principals-window.png" alt-text="Screenshot of the Add authorized principal window. The button titled Add principal is highlighted.":::

1. Confirm the addition of the authorized principal.

    :::image type="content" source="media/kusto-explorer-using/confirm-add-authorized-principals.png" alt-text="Screenshot of the Review Principal window showing a confirmation request for adding an authorized principal.":::

To remove an authorized principal, select **Drop principal** and confirm the action.

:::image type="content" source="media/kusto-explorer-using/confirm-drop-authorized-principals.png" alt-text="Screenshot of the Drop Principal window showing a confirmation request for removing an authorized principal.":::

## Related content

* [Kusto.Explorer keyboard shortcuts](kusto-explorer-shortcuts.md)
* [Kusto.Explorer options](kusto-explorer-options.md)
* [Troubleshooting Kusto.Explorer](kusto-explorer-troubleshooting.md)
* [Kusto.Explorer code features](kusto-explorer-code-features.md)
* Learn more about [Kusto Query Language (KQL)](../query/index.md)
