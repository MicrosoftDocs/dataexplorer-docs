---
title: Use command-line arguments to start up Kusto.Explorer
description: Learn how to use command-line arguments to configure Kusto.Explorer to perform additional functions on startup
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/13/2020
---

# Kusto.Explorer command-line arguments

Command-line arguments are used to configure the tool to perform additional functions on start-up. For example, load a script and connect to a cluster. As such, command-line arguments aren't a replacement for any Kusto.Explorer functionality.

Command-line arguments are passed as part of the URL that's used to open the application, in a similar way to [query deep-linking](kusto-explorer-share-queries.md#creating-a-deep-link).

## Command-line argument syntax

Kusto.Explorer supports several command-line arguments in the following syntax (the order matters):

[*LocalScriptFile*] [*QueryString*]

* *LocalScriptFile* is the name of a script file on your local machine, which must have the extension `.kql`. If such a file exists, Kusto.Explorer automatically loads this file when it starts up.
* *QueryString* is a string that uses HTTP query string formatting. This method provides additional properties, as described in the table below.

For example, to start Kusto.Explorer with a script file called `c:\temp\script.kql`
and configured to communicate with cluster `help`, database `Samples`, use the
following command:

```kusto
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

## Next steps

* Learn about [querying data in Kusto.Explorer](kusto-explorer-query-data.md)
* Learn about [Kusto Query Language (KQL)](https://docs.microsoft.com/azure/kusto/query/)
