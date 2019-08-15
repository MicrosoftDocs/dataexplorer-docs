---
title: Queries - Azure Data Explorer | Microsoft Docs
description: This article describes Queries in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/11/2019
---
# Queries

## .show queries

The `.show` `queries` command returns a list of queries that have reached a final state, and that the user invoking the command has access to see:


* A [database admin or database monitor](../management/access-control/role-based-authorization.md) can see any command that was invoked on their database.
* Other users can only see queries that were invoked by them.

**Syntax**

`.show` `queries`

## .show running queries

The `.show` `queries` command returns a list of currently-executing queries
by the user, or by another user, or by all users.

**Syntax**

```kusto
.show running queries
```

* (1) returns the currently-executing queries by the invoking user (requires read access).

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

