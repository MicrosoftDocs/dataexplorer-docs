---
title: Queries management - Azure Data Explorer | Microsoft Docs
description: This article describes Queries management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/23/2020
---
# Queries management

## .show queries

The `.show` `queries` command returns a list of queries that have reached a final state, and that the user invoking the command has access to see:


* A [database admin or database monitor](../management/access-control/role-based-authorization.md) can see any command that was invoked on their database.
* Other users can only see queries that were invoked by them.

**Syntax**

`.show` `queries`

## .show running queries

The `.show` `running` `queries` command returns a list of currently-executing queries
by the user, or by another user, or by all users.

**Syntax**

```kusto
.show running queries
```

* (1) returns the currently-executing queries by the invoking user (requires read access).

## .cancel query

The `.cancel` `query` command starts a best-effort attempt to cancel a specific
running query.

* Cluster admins can cancel any running query.
* Database admins can cancel any running query that was invoked on a database they have admin access on.
* All principals can cancel running queries that they started.

**Syntax**

`.cancel` `query` *ClientRequestId* [`with` `(` `reason` `=` *ReasonPhrase* `)`]

* *ClientRequestId* is the value of the running query's `ClientRequestId` property,
  as a `string` literal.

* *ReasonPhrase*: If specified, a `string` literal that describes the reason for
  cancelling the running query. This information is included in the query results
  if it is successfully cancelled.

**Example**

```kusto
.cancel query "KE.RunQuery;8f70e9ab-958f-4955-99df-d2a288b32b2c"
```
