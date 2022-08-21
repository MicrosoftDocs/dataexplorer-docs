---
title: Queries management - Azure Data Explorer
description: This article describes Queries management in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/21/2022
---
# Queries management

## .show queries

The `.show` `queries` command returns a list of queries that have reached a final state, and that the user invoking the command has access to see:

* A [database admin or database monitor](../management/access-control/role-based-authorization.md) can see any command that was invoked on their database.
* Other users can only see queries that were invoked by them.
* To see both queries and commands completion, use [.show queries-and-commands](commands-and-queries.md)

**Syntax**

`.show` `queries`

* Returns a table containing previously run queries and their completion statistics. You can use KQL queries to explore the results.
* Note: the text of the query is truncated after 64KB.

**Output**

The output schema is as follows:

|ColumnName |ColumnType |Description |
|---|---|
|ClientActivityId|string|Client ID of the request|
| Text | string | Query text, truncated at 64 KB|
|Database | string | Name of the database on which the query was executed |
| StartedOn | datetime | Timestamp when query execution started |
| LastUpdatedOn | datetime | Timestamp of the last status update|
| Duration |timespan | Server-side query duration |
| State | string | Completion state|
| RootActivityId | guid | Server-side request ID|
|User | string | User ID that ran the query|
|FailureReason|string|Failure reason. If query succeeded, this field is empty.
|TotalCpu | timespan | Total CPU consumed by the query |
| CacheStatistics | dynamic | Data-cache usage statistics |
| Application | string | Name of the application that was used to run the query|
|MemoryPeak | long | Peak memory statistics|
|ScannedExtentsStatistics | dynamic | Statistics of the scanned shards (extents)|
|Principal| string | AAD-ID of the user or application that was used to run the query|
|ClientRequestProperties | dynamic | Client request properties|
|ResultSetStatistics | dynamic |Statistics describing returned data set|
|WorkloadGroup|string | Name of the workload group that query was associated with|

### Example

```kusto
.show queries 
| project Text, Duration
| take 3
```

|Text|Duration|
|---|---|
|T \|count|00:00:00|
|T \| summarize count() by column1|00:00:00.0312564|
|T \| take 10|00:00:00.0155632|

## .show running queries

The `.show` `running` `queries` command returns a list of currently-executing queries
by the user, or by another user, or by all users.

**Syntax**

This example returns the currently executing queries by the current user.

```kusto
.show running queries 
```

This example returns the currently executing queries by another user.

```kusto
.show running queries by user (username)
```

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
  canceling the running query. This information is included in the query results
  if it's successfully canceled.

**Example**

```kusto
.cancel query "KE.RunQuery;8f70e9ab-958f-4955-99df-d2a288b32b2c"
```
