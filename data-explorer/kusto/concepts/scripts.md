---
title: Scripts - Azure Kusto | Microsoft Docs
description: This article describes Scripts in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Scripts

## Overview

Kusto scripts are a way to batch together a number of  data queries, metadata queries,
and control commands in a single blob and have Kusto execute them in sequence.
Scripts can be executed on the client-side (for example, by using
[Kusto.Cli](../tools/kusto-cli.md)'s `-script` command-line arg),
or by executing them on the service-side (by using the `.execute script`
control command). 

## Script format

A Kusto script is a text file in which each data query, metadata query, or control
command occupies a single line. One can "escape" newlines in the file by 
adding `&&` as the last two characters of the line to be continued.

Comments can be added by using `//` as the first two characters of the commented-out
lined.

Empty lines are allowed.

## Execution model

Kusto executes each "instruction" in the script in-sequence, one-by-one:
1. Instructions will be executed even if a previous instruction has failed.
2. Instructions execute serially, not in parallel.
3. Each instruction is its own transaction. There are no guarantees that
   two instructions in tandem will be atomic, isolated, etc.

## Special script commands

There are a few special commands that are handled by the script engine:
1. `#connect` `"`*ConnectionString`"`: Has the script engine connect using the specified
   connection string.
2. `#dbcontext` *DatabaseName*: Has the script engine change its default database
   to the specified database name. 