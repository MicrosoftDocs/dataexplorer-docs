---
title: Queries - Azure Kusto | Microsoft Docs
description: This article describes Queries in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Queries

## .show queries

The `.show` `queries` command returns a list of queries for which the user invoking the command has access to see:

* Cluster admins can see all queries.
* Database admins can see any query that was invoked on a database they have admin access on.
* Other users can only see queries that were invoked by them.

**Syntax**

`.show` `queries`

## .show running queries

The `.show` `queries` command returns a list of currently-executing queries
by the user, or by another user, or by all users.

**Syntax**

1. `.show` `running` `queries`
2. `.show` `running` `queries` `by` `user` *User*
3. `.show` `running` `queries` `by` `*`

(1) returns the currently-executing queries by the invoking user (requires read access). 
(2) returns the currently-executing queries by the specified user (requires cluster admin access).
(3) returns the currently-executing queries by all users (requires cluster admin access).

## .cancel query

The `.cancel` `query` command starts a best-effort attempt to cancel a specific
query previously started by the same user.

* Cluster admins can cancel any running query.
* Database admins can cancel any running query that was invoked on a database they have admin access on.
* Other users may only cancel queries that they started. 

**Syntax**

`.cancel` `query` *ClientRequestId*

* *ClientRequestId* is the value of the original queries ClientRequestId field,
  as a `string` literal.

**Example**

```kusto
.cancel query "KE.RunQuery;8f70e9ab-958f-4955-99df-d2a288b32b2c"
```

