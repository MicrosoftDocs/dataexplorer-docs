---
title: GDPR and data purge - Azure Data Explorer | Microsoft Docs
description: This article describes GDPR and data purge in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/06/2019
---
# GDPR and data purge

As a data platform, Kusto supports the ability to delete individiaul records for
GDPR purposes, through the use of the `.purge` command and a number of related
commands noted below. 

Kusto also supports purging an _entire_ table for GDPR purposes - please see details in [Purging an entire table](#purging-an-entire-table).  

> [!WARNING]
> Data deletion through the `.purge` command is designed to
> support GDPR requirements and should not be used in other scenarios. In particular,
> it is not designed to support frequent delete requests, or deletion of massive
> quantities of data. Use of this process for anything other than GDPR
> purposes is not supported by the Kusto team, and may have a significant performance
> impact on the service.

## Purge guidelines

It is **strongly recommended** that teams who store data in Kusto that is subject
to GDPR do so after carefully designing the data schema and policies for GDPR:

1. In a best-case scenario, the retention period on this data is sufficiently short
   that nothing needs to be done to comply with GDPR requirements, as data is
   automatically deleted. If you are planning to use retention policy to comply with GDPR, please refer to the [Using retention policy for GDPR](#using-retention-policy-for-gdpr) section for how to apply the correct policies to ensure data is not retained for longer than the period that is allowed for your scenario.
1. If this is not possible, the recommended approach is to isolate all data subject to GDPR in a small number of Kusto tables (optimally,
   just one table) and link to it from all other tables. This allows one to run the
   data purge process described below on a small number of tables holding sensitive
   data, and to avoid doing so for all others.
1. The caller should make every attempt to batch the execution of `.purge` commands to 1-2 commands per table per day.
   Do not issue multiple commands, each with its own user identity predicate;
   rather, send a single command whose predicate includes all user identities that
   require purging.

Please carefully consult the
[GDPR site](https://aka.ms/gdpr), the [summary of GDPR policy for C&E organization](https://aka.ms/cegdpr/scopingpaas), and the related [GDPR export requirements](https://microsoft.sharepoint.com/teams/Azure_Compliance/GDPR/GDPR%20Wiki/Export%20Guidance.aspx). In particular [this document on delinking](https://aka.ms/delink) 
as the recommended best practices for complying with GDPR requirements. 

## Purge Process

The process of selectively purging data from Kusto happens in the following steps:

1. **Phase 1:**
   Given a Kusto table name and a per-record predicate indicating which records
   to delete, Kusto scans the table looking to identify data shards that would
   participate in the data purge (have one or more records for which the predicate
   returns true).
1. **Phase 2: (Soft Delete)**
   Replace each such data shard in the table identified in step (1) with a re-ingested
   version of it that doesn't have the records for which the predicate returns true.
   By the end of this phase queries will not return such data (as long as no new
   data is being ingested into the table for which the predicate returns true,
   of course). 
   The duration of purge soft delete phase depends on the number of records to purge, and
   their distribution across the data shards in the cluster, the number of nodes in the cluster, 
   the spare capacity it has for purge operations, and several other factors - the duration can 
   vary between few seconds to many hours. The [engine `whatif` command](#purge-whatif-command) 
   provides a *rough* estimation for the expected duration of soft delete given a purge predicate. 
1. **Phase 3: (Hard Delete)**
   Work back all storage artifacts that might have the "poison" data, and delete
   them from storage. This phase is performed at least 5 days *after* the completion
   of the previous phase, but no longer than 30 days after the initial command,
   to comply with GDPR requirements.

Issuing a `.purge` command triggers this process, which takes a few days to
complete. Note that if the "density" of records for which the predicate applies
is sufficiently large, the process will effectively re-ingest all the data in the
table, and so it may have a significant impact on performance and COGS.

_A purge code sample is available as part of [Kusto code samples](../code/codesamples.md)_

## Purge limitations and considerations

1. **The purge process is final and irreversible**; it is not possible to "undo" this process or recover
   data that has been purged. Commands such as [undo table drop](../management/tables.md#undo-drop-table)
   cannot recover such data, and rollback of the data to a previous version cannot
   go "before" the latest purge command.

1. To avoid mistakes, it is recommended to perform a dry-run using the [engine `whatif` command](#purge-whatif-command) 
prior to executing the `.purge` command itself and ensure its results match the expected outcome.

1. As a precaution measure, the purge process is disabled by default on all clusters.
   Enabling the purge process is a one-time operation that requires opening a
   [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview); please specify that you want
   the `EnabledForPurge` feature to be turned on.

1. The `.purge` command is executed against the Data Management endpoint: 
   `https://ingest-[YourClusterName].kusto.windows.net`.
   The command requires [Database Admin](../management/access-control/role-based-authorization.md)
   permissions on the relevant databases.

1. The `predicate` parameter of the [.purge](#purge-table-tablename-records-command) command is used to specify which records to purge. 
`Predicate` size is limited to 950 KB. It is advised to follow the best practices below when constructing the `predicate`:
   * Use the ['in' operator](../query/inoperator.md), e.g. `where [ColumnName] in ('Id1', 'Id2', .. , 'Id1000')`
   * Note the limits of the ['in' operator](../query/inoperator.md) (list can contain up to `1,000,000` values).
   * In case the query size is large, use ['externaldata' operator](../query/externaldata-operator.md), 
  e.g. `where UserId in (externaldata(UserId:string) ["https://...blob.core.windows.net/path/to/file?..."])`. The file stores the list of ids to purge.
     * Total query size, after expanding all externaldata blobs (total size of all blobs) cannot exceed 64MB. 

## Purge performance

At any given time, only one purge request can be executed on the cluster. All other requests are queued in "Scheduled" state. 
The size of purge requests queue must be monitored, and kept within adequate limits to match GDPR requirements applicable for your data.
There are several measures that can be taken in order to reduce purge execution time:

* Decrease the amount of purged data by following [Purge guidelines](#purge-guidelines)
* Adjust the caching policy (purge takes longer on cold data) - see [Cache policy (hot and cold cache)](../concepts/cachepolicy.md)
* Scale out the cluster

* Increase cluster purge capacity - see [Extents Purge Rebuild capacity](../concepts/capacitypolicy.md#extents-purge-rebuild-capacity). Changing this parameter requires careful consideration, and requires opening a [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview)

## Triggering the purge process
Purge execution is invoked by running [purge table *TableName* records](#purge-table-tablename-records-command) command on the Data Management endpoint (**https://ingest-[YourClusterName].kusto.windows.net**).

### purge table *TableName* records command

Purge command may be invoked in two ways, targeting different usage scenarios:
1. Programmatic invocation, single-step.
This version of the command is intended to be invoked by applications. Calling this command directly triggers purge execution sequence.

 **Syntax**
 ```kusto
 .purge table [TableName] records in database [DatabaseName] with (noregrets='true') <| [Predicate]
 ```

 **Note**
 The recommended way to generate this command is using CslCommandGenerator API, available as part of the [Kusto Client Library](../api/netfx/about-kusto-data.md) NuGet package.

1. Human invocation, two-steps.
This version of the command requires an explicit confirmation as a separate step. First invocation of the command executes the [engine `whatif` command](#purge-whatif-command) and returns a verification token, which should be provided to run the actual purge. This sequence reduces the risk of inadvertently deleting data due to human error. Note that the whatif command itself may take a long while to complete on large tables (especially ones with significant amount of cold cache data).
<!-- If query times-out on DM endpoint (default timeout is 10 minutes), it is recommended to use the [engine `whatif` command](#purge-whatif-command) directly againt the engine endpoint while increasing the [server timeout limit](../concepts/querylimits.md#limit-on-request-execution-time-timeout). Only after you have verified the expected results using the engine whatif command, issue the purge command via the DM endpoint using the 'noregrets' option. -->

 **Syntax**
 ```kusto
 // Step #1 - retrieve a verification token (no records will be purged until step #2 is executed)
 .purge table [TableName] records in database [DatabaseName] <| [Predicate]

 // Step #2 - input the verification token to execute purge
 .purge table [TableName] records in database [DatabaseName] with (verificationtoken='<verification token from step #1>') <| [Predicate]
 ```

**Parameters**
* *DatabaseName*: Name of the database.
* *TableName*: Name of the table
* *Predicate*: Identifies the records to purge.
 * The predicate must be a simple selection (e.g. *where [ColumnName] == 'X'* / *where [ColumnName] in ('X', 'Y', 'Z') and [OtherColumn] == 'A'*).
 * Multiple filters must be combined with an 'and', rather than separate where clauses (e.g. *where [ColumnName] == 'X' and [OtherColumn] == 'Y'* and not *where [ColumnName] == 'X' | where [OtherColumn] == 'Y'*).
 * The predicate cannot reference tables other than the table being purged (*TableName*). The predicate can only include the selection statement (*where*), it cannot project specific columns from the table (output schema when running '*`table` | Predicate*' must match table schema).
 * System functions (e.g., ingestion_time(), extent_id()) are not supported as part of the predicate.
 * Please use the [engine `whatif` command](#purge-whatif-command) to test the supported operators for the predicate.
* *noregrets*: If set, triggers a single-step activation.
* *verificationtoken*: In two-steps activation scenario ('noregrets' is not set), this token can be used to execute the second step and commit the action.
 * If not specified - will trigger the command's first step, in which information about the purge is returned and a token, that should be passed back to the command to perform the command's step #2.

**Examples**

To initiate a purge in a two-steps activation scenario, run step #1 of the command:

```kusto
.purge table MyTable records in database MyDatabase <| where CustomerId in ('X', 'Y')
```

**Output**
|NumRecordsToPurge |EstimatedPurgeExecutionTime| VerificationToken
|--|--|--
|1,596 |00:00:02|e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b

Please make sure to validate the NumRecordsToPurge prior to running step #2. 
To complete a purge in a two-steps activation scenario, run the following, with the verification token returned from step #1

```kusto
.purge table MyTable records in database MyDatabase
with (verificationtoken='e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b')
<| where CustomerId in ('X', 'Y')
```

**Output**
|OperationId |DatabaseName |TableName |ScheduledTime |Duration |LastUpdatedOn |EngineOperationId |State |StateDetails |EngineStartTime |EngineDuration |Retries |ClientRequestId |Principal
|--|--|--|--|--|--|--|--|--|--|--|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:00.1406211 |2019-01-20 11:41:05.4391686 | |Scheduled | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...

To trigger a purge in a single-step activation scenario, run the following:

```kusto
.purge table MyTable records in database MyDatabase with (noregrets='true') <| where CustomerId in ('X', 'Y')
```

**Output**
|OperationId |DatabaseName |TableName |ScheduledTime |Duration |LastUpdatedOn |EngineOperationId |State |StateDetails |EngineStartTime |EngineDuration |Retries |ClientRequestId |Principal
|--|--|--|--|--|--|--|--|--|--|--|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:00.1406211 |2019-01-20 11:41:05.4391686 | |Scheduled | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...

<!--### Cancel purge operation command

In some cases it may be useful to cancel pending purge requests.

**Note** 

This is an opportunistic operation that is intended for error recovery scenarios. 
It is not guaranteed to succeed, and should not be part of a normal operational flow. 
It can only be applied to in-queue requests, i.e. requests not yet dispatched to the engine node for execution. 
The command is executed on Data Management endpoint.

 **Syntax**
-->
 <!-- csl -->
 <!--```
 .cancel purge OperationId
 ```

**Examples**
-->
<!-- csl -->
<!--```
 .cancel purge aa894210-1c60-4657-9d21-adb2887993e1
```

**Output**

The output of this command is the same as the 'show purges *OperationId*' command output, showing the updated status of the purge operation being canceled. 
If the attempt is successful, operation state is updated to 'Abandoned', otherwise the operation state is not altered. 

|OperationId |DatabaseName |TableName |ScheduledTime |Duration |LastUpdatedOn |EngineOperationId |State |StateDetails |EngineStartTime |EngineDuration |Retries |ClientRequestId |Principal
|--|--|--|--|--|--|--|--|--|--|--|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:00.1406211 |2019-01-20 11:41:05.4391686 | |Abandoned | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...
-->
## Tracking Purge Operation Status 

Purge operations can be tracked via [show purges](#show-purges-command) command, executed against the Data Management endpoint(**https://ingest-[YourClusterName].kusto.windows.net**).

Status = 'Completed' indicates successful completion of the first phase of purge operation, i.e. records are soft-deleted and are no longer available for querying. Customers are **not** expected to track beyond this point and verify second phase (hard-delete) completion. This phase is monitored internally by Kusto.

### show purges command

```kusto
.show purges <OperationId>
.show purges [in database <DatabaseName>]
.show purges from '<StartDate>' [in database <DatabaseName>]
.show purges from '<StartDate>' to '<EndDate>' [in database <DatabaseName>]
```

Shows purge operation by specifying operation id. 
* OperationId: The Data Management operation id outputed after executing singe phase or second phase.

Shows purge operations status in the requested time period. 
* [optional] StartDate: Lower time limit for filtering operations. If omitted, defaults to 24 hours before current time.
* [optional] EndDate: Upper time limit for filtering operations. If omitted, defaults to current time.
* [optional] DatabaseName: Database name to filter results by.

**Note**
* Status will only be provided on databases on which the client has [Database Admin](../management/access-control/role-based-authorization.md) permissions.

**Examples**

```kusto
.show purges
.show purges c9651d74-3b80-4183-90bb-bbe9e42eadc4
.show purges from '2018-01-30 12:00'
.show purges from '2018-01-30 12:00' to '2018-02-25 12:00'
.show purges from '2018-01-30 12:00' to '2018-02-25 12:00' in database MyDatabase
```

**Output** 

|OperationId |DatabaseName |TableName |ScheduledTime |Duration |LastUpdatedOn |EngineOperationId |State |StateDetails |EngineStartTime |EngineDuration |Retries |ClientRequestId |Principal
|--|--|--|--|--|--|--|--|--|--|--|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:33.6782130 |2019-01-20 11:42:34.6169153 |a0825d4d-6b0f-47f3-a499-54ac5681ab78 |Completed |Purge completed successfully (storage artifacts pending deletion) |2019-01-20 11:41:34.6486506 |00:00:04.4687310 |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...

* OperationId - the DM operation id returned when executing purge. 
* DatabaseName - database name, case sensitive. 
* TableName - table name, case sensitive. 
* ScheduledTime - time of executing purge command to the DM service. 
* Duration - total duration of the purge operation, including the time it was waiting for execution in the DM queue. 
* EngineOperationId - the operation id of the actual purge executing in the engine. 
* State - purge state, can be one of the following: 
  * Scheduled - purge operation is scheduled for execution. If job remains in this state for a long while, this usually means there's a long backlog of purge operations, and you may need to take actions to clear this backlog - see [purge performance](#purge-performance). If a purge operation fails on a transient error, it will be retried by the CM and set to Scheduled again (so you may see an operation transition from Scheduled to InProgress and back to Scheduled).
  * InProgress - the purge operaration is in-progress in the engine. 
  * Completed - purge completed successfully.
  * BadInput - purge failed on bad input and will not be retried. This may be either due to a syntax error in the predicate / an illegal predicate for purge commands / a query that exceeds limits (e.g., over 1M entities in an externaldata operator or over 64MB of total expanded query size) / 404 or 403 errors for externaldata blobs.
  * Failed - purge failed and will not be retried. This could happen if operation is waiting in the queue for too long (over 14 days), due to a long backlog of other purge operations; or due to number of failures that exceeds retry limit. The latter will raise an internal monitoring alert and will be investigated by the Kusto team. 
* StateDetails - a description of the State.
* EngineStartTime - the time the command was issued to the engine. If there's a big difference between this time and StartTime, this usually means there's a big backlog of purge operations and cluster is not keeping up with the pace. 
* EngineDuration - time of actual purge execution in the engine. If purge was retried several times, this would be the sum of the duration in all executions. 
* Retries - number of times the opration retried by the DM service due to a transient error.
* ClientRequestId - client activity id of the CM purge request. 
* Principal - identity of the purge command issuer.

### Monitoring Purge Operations
Purge requests can be monitored as part of [Kusto monitoring](../ops/monitoring.md) solution in MDM. Purge metrics appear in MdmDataMgmtMetrics namespace within Kusto regional MDM account. 

|Metric Name|Dimensions|Comment
|---|---|---|
|PurgeTimeInQueue|TargetCluster|Time since submitting the request to the DM and until the purge was dispatched to engine for execution
|PurgeTotalProcessingTime|TargetCluster|Total time elapsed from issuing a purge request, up to reaching its final state.
|PurgePendingRequestsCount|TargetCluster, PendingState|Number of pending purge requests, i.e. requests that haven't reached their final state. 'PendingState' can be either 'Scheduled' or 'InProgress'
|PurgeFailure|TargetCluster, FailureReason|Number of purge operation failures. 'FailureReason' indicates the failure type

## Using retention policy for GDPR
If you are planning to use retentiopn policy to comply with GDPR requirements, please note that aside from the retention policy itself, the MaxRangeInHours parameter which is part of the [Merge policy](../concepts/mergepolicy.md) also impacts the time span in which the data becomes inaccesible (soft deleted). 
The total time guaranteed for a record to be soft-deleted from Kusto is `Soft-Delete-TimeSpan + Merge-Policy MaxRangeInHours + 2 hours` (the latter 2h being the soft delete periodic cycle time span plus an extra 1h as safety measurement). 
For example, if data needs to be inaccessible after 48 hours, the below settings are advised (all in the effective scope of the relevant table, of course): 
1. Set MaxRangeInHours to 1h in [Merge policy](../concepts/mergepolicy.md). 
1. Set soft delete [Retention policy](../concepts/retentionpolicy.md) to 45 hours. 
 
## Purging an entire table
Purging a table consists of dropping it, and marking it as purged, such that the hard delete process described in [Purge Process](#purge-process) runs on it. Whereas, dropping a table without purging it does not delete all its storage artifacts (they will be deleted according to the hard retention policy initially set on the table). The command is quick and efficient and is much preferable over the purge records process, if applicable for your scenario. 
Throttling limitation is not applied to purge table allrecords command.
command invoked by running [purge table *TableName* allrecords](#purge-table-tablename-allrecords-command) command on the Data Management endpoint (**https://ingest-[YourClusterName].kusto.windows.net**).

### purge table *TableName* allrecords command

Similar to '[.purge table records ](#purge-table-tablename-records-command)' command, this command can be invoked either in a programmatic (single-step) or in a manual (two-step) mode.
1. Programmatic invocation, single-step.

 **Syntax**
 ```kusto
 .purge table [TableName] in database [DatabaseName] allrecords with (noregrets='true')
 ```

2. Human invocation, two-steps.

 **Syntax**
 ```kusto
 // Step #1 - retrieve a verification token (the table will not be purged until step #2 is executed)
 .purge table [TableName] in database [DatabaseName] allrecords

 // Step #2 - input the verification token to execute purge
 .purge table [TableName] in database [DatabaseName] allrecords with (verificationtoken='<verification token from step #1>')
 ```

 **Parameters**
 * *DatabaseName*: Name of the database.
 * *TableName*: Name of the table
 * *noregrets*: If set, triggers a single-step activation.
 * *verificationtoken*: In two-steps activation scenario ('noregrets' is not set), this token can be used to execute the second step and commit the action.
   * If not specified - will trigger the command's first step, in which a token is returned, that should be passed back to the command to perform the command's step #2.

**Examples**

To initiate a purge in a two-steps activation scenario, run step #1 of the command:

```kusto
.purge table MyTable in database MyDatabase allrecords
```

**Output**
| VerificationToken
|--
|e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b

To complete a purge in a two-steps activation scenario, run the following, with the verification token returned from step #1

```kusto
.purge table MyTable in database MyDatabase allrecords 
with (verificationtoken='eyJTZXJ2aWNlTmFtZSI6IkVuZ2luZS1pdHNhZ3VpIiwiRGF0YWJhc2VOYW1lIjoiQXp1cmVTdG9yYWdlTG9ncyIsIlRhYmxlTmFtZSI6IkF6dXJlU3RvcmFnZUxvZ3MiLCJQcmVkaWNhdGUiOiIgd2hlcmUgU2VydmVyTGF0ZW5jeSA9PSAyNSJ9')
```
The output of this command is the same as the '.show tables' command output which is returned without the purged table.
**Output**

|TableName|DatabaseName|Folder|DocString
|---|---|---|---
|OtherTable|MyDatabase|---|---


To trigger a purge in a single-step activation scenario, run the following:

```kusto
.purge table MyTable in database MyDatabase allrecords with (noregrets='true')
```

The output of this command is the same as the '.show tables' command output which is returned without the purged table.
**Output**

|TableName|DatabaseName|Folder|DocString
|---|---|---|---
|OtherTable|MyDatabase|---|---

## Engine purge commands

Some aspects of purge execution can only be obtained by running commands on the engine endpoint executing the purge. These commands are not required for standard purge execution flow, but may be helpful by providing more fine grained visibility of the purge operation.

### purge whatif command

To experiment with the purge syntax and obtain some info about its outcome (number of records to purge, estimated execution time, etc.), an Engine `whatif` command is available and requires Database User permissions. The `whatif` performs a dry-run of the purge. No records will be purged when running this command. The command should be executed in the context of the database being purged. 

**Syntax**

`.purge` `whatif`=[`info`|`stats`|`purge`|`retain`] `table` *TableName* `records` <| *Predicate*

**Examples**

```kusto
.purge whatif=info table Usage records <| where CustomerId in ('X', 'Y')
```

* *TableName* is the name of the table to be purged.

* *Predicate* - identifies the records to be purged. Restrictions as above. 

* *whatif* options: 
    
    a. *info* - show the number of records to be purged, and the estimated time it would take purge with the provided predicate to complete.  

    b. *stats* - show extent statistics about the purge operation. Shows all extents that will be impacted when running purge and the count of retained/purged records in each (this is identical to running whatif with no explicit option - *.purge whatif table Usage records <| where CustomerId in ('X', 'Y')*. 
    
    c. *purge* - show all records that will be *purged* from table *TableName* when running with the provided predicate. 
    
    d. *retain* - show all records that will be *retained* from table *TableName* when running with the provided predicate.