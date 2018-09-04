---
title: Stored functions - Azure Kusto | Microsoft Docs
description: This article describes Stored functions in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Stored functions

Stored functions are reusable queries that are stored as part of a database. Stored functions are a kind of 
[user-defined functions](../userdefinedfunctions.md), and have the same invocation syntax and rules. Unlike ad-hoc
user-defined functions (whose scope is that of a query), stored functions are full-fledged durable database entities, similar
to tables, and are supported by a similar array of [control commands](../../controlCommands/functions.md).