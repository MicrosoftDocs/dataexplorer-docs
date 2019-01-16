---
title: execute_show_command plugin - Azure Data Explorer | Microsoft Docs
description: This article describes execute_show_command plugin in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018
---
# execute_show_command plugin

  `evaluate` `execute_show_command` `(` *ConnectionString* `,` *ShowCommand* `)`

The `execute_show_command` plugin executes the specified Kusto `.show` command
on the target Kusto cluster/database
and returns the first rowset in the results.

**Arguments**

* *ConnectionString*: A `string` literal indicating the connection string that
  points at the target Kusto endpoint. See remarks below for limitations.
* *ShowCommand*: A `string` literal indicating the `.show` command that is to be executed
  against the Kusto endpoint. Must return one or more rowsets, but only the
  first one is made available for the rest of the Kusto query.

**Examples**

The following example queries the `help` cluster for two records of queries
that were run on it and two records of commands.

```
union
  (evaluate execute_show_command("https://help.kusto.windows.net/$systemdb", ".show queries  | take 2 | project What='Query',   StartedOn, Text")),
  (evaluate execute_show_command("https://help.kusto.windows.net/$systemdb", ".show commands | take 2 | project What='Command', StartedOn, Text"))
```

**Limitations**

1. The connection string handed to this plugin can include any valid Kusto
   connection string argument, but the only values used are the target cluster
   endpoint, databaqse, and authentication.