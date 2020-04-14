---
title: Share Kusto.Explorer queries and results
description: Learn how to share Kusto.Explorer queries and results, and create deep links
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/13/2020
---

# Share queries and results

In Kusto.Explorer, you can share queries and results by email. You can also create deep links that will open and run a query in the browser.

## Share queries and results by email

Kusto.Explorer provides a convenient way to share queries and query results by email.

1. [Run your query](kusto-explorer-query-data.md) in Kusto.Explorer.
1. In the Home tab, in the Share section, select **Export to Clipboard** (or press Ctrl+Shift+C).

    ![Export to clipboard](./Images/kusto-explorer-share-queries/menu-export.png "menu-export")

    Kusto.Explorer pastes the following to the clipboard:
    * Your query
    * The query results (table or chart)
    * The connection details for the Kusto cluster and database
    * A link that will rerun the query automatically

1. Paste the contents of the clipboard into a new email message.

    ![Share results in email](./Images/kusto-explorer-share-queries/share-results-2.png "share-results-2")

## Deep-linking queries

You can create a URI that, when opened in a browser, opens Kusto.Explorer locally and runs a specific query on a specified Kusto database.

### Limitations
The queries are limited to ~2000 characters because of browser limitations, HTTP proxies, and tools that validate links, such as Microsoft Outlook. The limitation is approximate because it's dependent on the cluster and Database name length. For more information, see [https://support.microsoft.com/kb/208427](https://support.microsoft.com/kb/208427). 
To reduce the chances of reaching the character limit, see [Getting Shorter Links](#getting-shorter-links), below.

The format of the URI is:
    `https://<ClusterCname>.kusto.windows.net/<DatabaseName>web=0?query=<QueryToExecute>`

For example: 
    [https://help.kusto.windows.net/Samples?web=0query=StormEvents+%7c+limit+10](https://help.kusto.windows.net/Samples?web=0query=StormEvents+%7c+limit+10)
 
This URI will open Kusto.Explorer, connect to the `Help` Kusto cluster, and run the specified query on the `Samples` database. If there's an instance of Kusto.Explorer already running, the running instance will open a new tab and run the query in it.

> [!Note] 
> For security reasons, deep-linking is disabled for control commands.

### Creating a deep-link
The easiest way to create a deep-link is to author your query in Kusto.Explorer and then use
`Export to Clipboard` to copy the query (including the deep link and results) to the clipboard. You can then share it by email.
        
When copied to an email, the deep link is displayed in small font. For example:

https://help.kusto.windows.net:443/Samples [[Click to run query](https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d)] 

The first link opens Kusto.Explorer and sets the cluster and database context appropriately.
The second link (`Click to run query`) is the deep link. If you move the link to an email message and press CTRL+K, you can see the actual URL:

https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d

### Deep-links and parametrized queries

You can use Parametrized Queries with deep-linking.

1. Create a query to be formed as a Parametrized Query (for example, `KustoLogs | where Timestamp > ago({Period}) | count`) 
1. Provide a parameter for every Query Parameter in the URI
In this case:

https://mycluster.kusto.windows.net/MyDatabase?web=0&query=KustoLogs+%7c+where+Timestamp+>+ago({Period})+%7c+count&Period=1h

### Getting shorter links

Queries can become long. To reduce the chance the query exceeds the maximum length, use the 
`String Kusto.Data.Common.CslCommandGenerator.EncodeQueryAsBase64Url(string query)` method 
available in Kusto Client Library. This method produces a more compact version of the query. The shorter format is also recognized by Kusto.Explorer.

https://help.kusto.windows.net/Samples?web=0&query=H4sIAAAAAAAEAAsuyS%2fKdS1LzSspVuDlqlEoLs3NTSzKrEpVSM4vzSvR0FRIqlRIyszTCC5JLCoJycxN1VEwT9EEKS1KzUtJLVIoAYolZwAlFQCB3oo%2bTAAAAA%3d%3d

The query is made more compact by applying next transformation:

```csharp
 UrlEncode(Base64Encode(GZip(original query)))
```

## Next steps

* Learn about [searching Kusto.Explorer](kusto-explorer-search-mode.md)
* Learn about [running Kusto.Explorer from the command line](kusto-explorer-command-line.md)
* Learn about [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/kusto/query/)