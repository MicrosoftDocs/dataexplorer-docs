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

## .show queryplan

The `.show` `queryplan` command creates a query plan for the provided
query, and returns information about the generated plan without actually
executing it. This is mostly useful for Kusto developers.

> [!WARNING]
> Query plan structure is a subject to frequent and breaking changes,
> and no dependency can be taken on the returned data structure.

**Syntax**

`.show` `queryplan` `<|` *query*

**Example**

Running the following command:

```kusto
.show queryplan <| range x from 1 to 10 step 1 | extend r=rand()
```

Provides the next output (cut short for presentation purposes):

|ResultType|Format|Content|
|----------|------|-------|
|QueryText |text  |range x from 1 to 10 step 1 ...|
|RelopTree |json  |{"type":"Extension","output":["x:Int64","r:Double"],"bindi...|
|QueryPlan |json  |{"QueryType":0,"RootOperator":{"$type":"Kusto.DataNode.Ext...|
|Stats     |json  |{"Duration":"00:00:00.0085478","PlanSize":3002}|