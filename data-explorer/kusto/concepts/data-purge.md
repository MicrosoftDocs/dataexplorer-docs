---
title: Data purge - Azure Data Explorer | Microsoft Docs
description: This article describes Data purge in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 06/11/2019

---
# Data purge

>[!Note]
> This article provides steps for how to delete personal data from the device or service and can be used to support your obligations under the GDPR. If you're looking for general information about GDPR, see the [GDPR section of the Service Trust portal](https://servicetrust.microsoft.com/ViewPage/GDPRGetStarted).



As a data platform, Azure Data Explorer (Kusto) supports the ability to delete individual records, through the use of `.purge` and related
commands. You can also [Purging an entire table](#purging-an-entire-table).  

> [!WARNING]
> Data deletion through the `.purge` command is designed to
> be used to protect personal data and should not be used in other scenarios. It is not designed to support frequent delete requests, or deletion of massive
> quantities of data, and may have a significant performance
> impact on the service.

## Purge guidelines

It is **strongly recommended** that teams who store personal data in Azure Data Explorer do so only after careful design of the data schema and investigation of relevant policies.

1. In a best-case scenario, the retention period on this data is sufficiently short and data is
   automatically deleted.
2. If retention period usage is not possible, the recommended approach is to isolate all data subject to privacy rules in a small number of Kusto tables (optimally,
   just one table) and link to it from all other tables. This allows one to run the
   data [purge process](#purge-process) on a small number of tables holding sensitive
   data, and avoid all other tables.
3. The caller should make every attempt to batch the execution of `.purge` commands to 1-2 commands per table per day.
   Do not issue multiple commands, each with its own user identity predicate; rather, send a single command whose predicate includes all user identities that
   require purging.

## Purge process

The process of selectively purging data from Azure Data Explorer happens in the following steps:

1. **Phase 1:**
   Given a Kusto table name and a per-record predicate indicating which records
   to delete, Kusto scans the table looking to identify data shards that would
   participate in the data purge (have one or more records for which the predicate
   returns true).
2. **Phase 2: (Soft Delete)**
   Replace each data shard in the table (identified in step (1)) with a re-ingested
   version that doesn't have the records for which the predicate returns true.
   As long as no new data is being ingested into the table, by the end of this phase queries will no longer return data for which the predicate returns true. 
   The duration of the purge soft delete phase depends on the number of records that must be purged,
   their distribution across the data shards in the cluster, the number of nodes in the cluster, 
   the spare capacity it has for purge operations, and several other factors. The duration of phase 2 can 
   vary between a few seconds to many hours.
3. **Phase 3: (Hard Delete)**
   Work back all storage artifacts that may have the "poison" data, and delete
   them from storage. This phase is performed at least 5 days *after* the completion
   of the previous phase, but no longer than 30 days after the initial command,
   to comply with data privacy requirements.

Issuing a `.purge` command triggers this process, which takes a few days to complete. Note that if the "density" of records for which the predicate applies
is sufficiently large, the process will effectively re-ingest all the data in the table, therefore, having a significant impact on performance and COGS.


## Purge limitations and considerations

* **The purge process is final and irreversible**. It isn't possible to "undo" this process or recover
   data that has been purged. Therefore, commands such as [undo table drop](../management/tables.md#undo-drop-table)
   cannot recover purged data, and rollback of the data to a previous version cannot
   go to "before" the latest purge command.

* To avoid mistakes, it's recommended to verify the predicate by running a query prior to purge to ensure that the results match the expected outcome, or use the 2-step process that returns the expected number of records that will be purged. 

* As a precautionary measure, the purge process is disabled, by default, on all clusters.
   Enabling the purge process is a one-time operation that requires opening a
   [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview); please specify that you want the `EnabledForPurge` feature to be turned on.

* The `.purge` command is executed against the Data Management endpoint: 
   `https://ingest-[YourClusterName].kusto.windows.net`.
   The command requires [database admin](../management/access-control/role-based-authorization.md)
   permissions on the relevant databases. 
* Due to the purge process performance impact, and to guarantee that
   [purge guidelines](#purge-guidelines) have been followed, Kusto throttles
   the purge process at 50 `.purge` commands per 24 hours.
   Therefore, the caller is expected to modify the data schema so that
   minimal tables include relevant data, and batch commands per table to reduce the significant COGS impact of the
   purge process. The throttling helps avoid the fixed per-table overhead in managing the purge process. 
* The `predicate` parameter of the [.purge](#purge-table-tablename-records-command) command is used to specify which records to purge.
`Predicate` size is limited to 63 KB. When constructing the `predicate`:
	* Use the ['in' operator](../query/inoperator.md), e.g. `where [ColumnName] in ('Id1', 'Id2', .. , 'Id1000')`. 
		* Note the limits of the ['in' operator](../query/inoperator.md) (list can contain up to `1,000,000` values).
	* If the query size is large, use ['externaldata' operator](../query/externaldata-operator.md), 
  e.g. `where UserId in (externaldata(UserId:string) ["https://...blob.core.windows.net/path/to/file?..."])`. The file stores the list of IDs to purge.
		* Total query size, after expanding all externaldata blobs (total size of all blobs) cannot exceed 64MB. 

## Purge performance

Only one purge request can be executed on the cluster, at any given time. All other requests are queued in "Scheduled" state. 
The purge request queue size must be monitored, and kept within adequate limits to match the requirements applicable for your data.

To reduce purge execution time:
* Decrease the amount of purged data by following [Purge guidelines](#purge-guidelines)
* Adjust the [caching policy](../concepts/cachepolicy.md) since purge takes longer on cold data.
* Scale out the cluster

* Increase cluster purge capacity, after careful consideration, as detailed in [Extents purge rebuild capacity](../concepts/capacitypolicy.md#extents-purge-rebuild-capacity). Changing this parameter requires opening a [support ticket](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview)

## Trigger the purge process

>[!Note]
>Purge execution is invoked by running [purge table *TableName* records](#purge-table-tablename-records-command) command on the Data Management endpoint (**https://ingest-[YourClusterName].kusto.windows.net**).

### Purge table *TableName* records command

Purge command may be invoked in two ways for differing usage scenarios:
1. Programmatic invocation: A single-step which is intended to be invoked by applications. Calling this command directly triggers purge execution sequence.

	**Syntax**
	 ```kusto
	 .purge table [TableName] records in database [DatabaseName] with (noregrets='true') <| [Predicate]
	 ```

	> [!NOTE]
	> Generate this command by using the CslCommandGenerator API, available as part of the [Kusto Client Library](../api/netfx/about-kusto-data.md) NuGet package.

1. Human invocation: A two-step process that requires an explicit confirmation as a separate step. First invocation of the command returns a verification token, which should be provided to run the actual purge. This sequence reduces the risk of inadvertently deleting incorrect data. Using this option may take a long time to complete on large tables with significant cold cache data.
	<!-- If query times-out on DM endpoint (default timeout is 10 minutes), it is recommended to use the [engine `whatif` command](#purge-whatif-command) directly againt the engine endpoint while increasing the [server timeout limit](../concepts/querylimits.md#limit-on-request-execution-time-timeout). Only after you have verified the expected results using the engine whatif command, issue the purge command via the DM endpoint using the 'noregrets' option. -->

	 **Syntax**
	 ```kusto
	 // Step #1 - retrieve a verification token (no records will be purged until step #2 is executed)
	 .purge table [TableName] records in database [DatabaseName] <| [Predicate]

	 // Step #2 - input the verification token to execute purge
	 .purge table [TableName] records in database [DatabaseName] with (verificationtoken='<verification token from step #1>') <| [Predicate]
	 ```
	
	|Parameters  |Description  |
	|---------|---------|
	| DatabaseName   |   Name of the database.      |
	| TableName     |     Name of the table.    |
	| Predicate    |    Identifies the records to purge. See Purge predicate limitations below. | 
	| noregrets    |     If set, triggers a single-step activation.    |
	| verificationtoken     |  In two-step activation scenario (**noregrets** isn't set), this token can be used to execute the second step and commit the action. If **verificationtoken** isn't specified, it will trigger the command's first step, in which information about the purge is returned and a token, that should be passed back to the command to perform step #2.   |

	**Purge predicate limitations**
	* The predicate must be a simple selection (e.g. *where [ColumnName] == 'X'* / *where [ColumnName] in ('X', 'Y', 'Z') and [OtherColumn] == 'A'*).
	* Multiple filters must be combined with an 'and', rather than separate `where` clauses (e.g. `where [ColumnName] == 'X' and  OtherColumn] == 'Y'` and not `where [ColumnName] == 'X' | where [OtherColumn] == 'Y'`).
	* The predicate can't reference tables other than the table being purged (*TableName*). The predicate can only include the selection statement (`where`). It can't project specific columns from the table (output schema when running '*`table` | Predicate*' must match table schema).
	* System functions (such as, `ingestion_time()`, `extent_id()`) are not supported as part of the predicate.

#### Example: Two-step purge

1. To initiate purge in a two-step activation scenario, run step #1 of the command:

	```kusto
	.purge table MyTable records in database MyDatabase <| where CustomerId in ('X', 'Y')
	```

	**Output**

	|NumRecordsToPurge |EstimatedPurgeExecutionTime| VerificationToken
	|--|--|--
	|1,596 |00:00:02 |e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b

	Validate the NumRecordsToPurge prior to running step #2. 
2. To complete a purge in a two-step activation scenario, use the verification token returned from step #1 to run step #2:

	```kusto
	.purge table MyTable records in database MyDatabase
	with (verificationtoken='e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b')
	<| where CustomerId in ('X', 'Y')
	```

	**Output**

	|OperationId |DatabaseName |TableName |ScheduledTime |Duration |LastUpdatedOn |EngineOperationId |State |StateDetails |EngineStartTime |EngineDuration |Retries |ClientRequestId |Principal
	|--|--|--|--|--|--|--|--|--|--|--|--|--|--
	|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:00.1406211 |2019-01-20 11:41:05.4391686 | |Scheduled | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...

#### Example: Single-step purge

To trigger a purge in a single-step activation scenario, run the following command:

```kusto
.purge table MyTable records in database MyDatabase with (noregrets='true') <| where CustomerId in ('X', 'Y')
```

**Output**

|OperationId |DatabaseName |TableName |ScheduledTime |Duration |LastUpdatedOn |EngineOperationId |State |StateDetails |EngineStartTime |EngineDuration |Retries |ClientRequestId |Principal
|--|--|--|--|--|--|--|--|--|--|--|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:00.1406211 |2019-01-20 11:41:05.4391686 | |Scheduled | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...

### Cancel purge operation command

If needed, you can cancel pending purge requests.

> [!NOTE]
> This opportunistic operation is intended for error recovery scenarios. It isn't guaranteed to succeed, and shouldn't be part of a normal operational flow. 
It can only be applied to in-queue requests (not yet dispatched to the engine node for execution). The command is executed on the Data Management endpoint.

**Syntax**

```kusto
 .cancel purge <OperationId>
 ```

**Example**

```kusto
 .cancel purge aa894210-1c60-4657-9d21-adb2887993e1
 ```

**Output**

The output of this command is the same as the 'show purges *OperationId*' command output, showing the updated status of the purge operation being canceled. 
If the attempt is successful, operation state is updated to 'Abandoned', otherwise the operation state is not altered. 

|OperationId |DatabaseName |TableName |ScheduledTime |Duration |LastUpdatedOn |EngineOperationId |State |StateDetails |EngineStartTime |EngineDuration |Retries |ClientRequestId |Principal
|--|--|--|--|--|--|--|--|--|--|--|--|--|--
|c9651d74-3b80-4183-90bb-bbe9e42eadc4 |MyDatabase |MyTable |2019-01-20 11:41:05.4391686 |00:00:00.1406211 |2019-01-20 11:41:05.4391686 | |Abandoned | | | |0 |KE.RunCommand;1d0ad28b-f791-4f5a-a60f-0e32318367b7 |AAD app id=...

## Track purge operation status 

>[!Note]
>Purge operations can be tracked with the [show purges](#show-purges-command) command, executed against the Data Management endpoint(**https://ingest-[YourClusterName].kusto.windows.net**).

Status = 'Completed' indicates successful completion of the first phase of the purge operation, i.e. records are soft-deleted and are no longer available for querying. Customers are **not** expected to track and verify the second phase (hard-delete) completion. This phase is monitored internally by Kusto.

### show purges command

`Show purges` command shows purge operation status by specifying the operation Id within the requested time period. 

```kusto
.show purges <OperationId>
.show purges [in database <DatabaseName>]
.show purges from '<StartDate>' [in database <DatabaseName>]
.show purges from '<StartDate>' to '<EndDate>' [in database <DatabaseName>]
```

|Properties  |Description  |Mandatory/Optional
|---------|---------|
|OperationId    |      The Data Management operation Id outputed after executing single phase or second phase.   |Mandatory
|StartDate    |   Lower time limit for filtering operations. If omitted, defaults to 24 hours before current time.      |Optional
|EndDate    |  Upper time limit for filtering operations. If omitted, defaults to current time.       |Optional
|DatabaseName    |     Database name to filter results.    |Optional


> [!NOTE]
> Status will be provided only on databases that client has [Database admin](../management/access-control/role-based-authorization.md) permissions.

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

* **OperationId** - the DM operation id returned when executing purge. 
* **DatabaseName** - database name (case sensitive). 
* **TableName** - table name (case sensitive). 
* **ScheduledTime** - time of executing purge command to the DM service. 
* **Duration** - total duration of the purge operation, including the execution DM queue wait time. 
* **EngineOperationId** - the operation id of the actual purge executing in the engine. 
* **State** - purge state, can be one of the following: 
	* Scheduled - purge operation is scheduled for execution. If job remains **Scheduled**, there's probably a backlog of purge operations. See [purge performance](#purge-performance) to clear this backlog. If a purge operation fails on a transient error, it will be retried by the DM and set to **Scheduled** again (so you may see an operation transition from **Scheduled** to **InProgress** and back to **Scheduled**).
	* InProgress - the purge operaration is in-progress in the engine. 
	* Completed - purge completed successfully.
	* BadInput - purge failed on bad input and will not be retried. This may be due to various issues such as a syntax error in the predicate, an illegal predicate for purge commands, a query that exceeds limits (e.g., over 1M entities in an externaldata operator or over 64MB of total expanded query size), and 404 or 403 errors for externaldata blobs.
	* Failed - purge failed and will not be retried. This may happen if the operation was waiting in the queue for too long (over 14 days), due to a backlog of other purge operations or a number of failures that exceeds the retry limit. The latter will raise an internal monitoring alert and will be investigated by the Azure Data Explorer team. 
* StateDetails - a description of the State.
* EngineStartTime - the time the command was issued to the engine. If there's a big difference between this time and ScheduledTime, there's usually a big backlog of purge operations and the cluster is not keeping up with the pace. 
* EngineDuration - time of actual purge execution in the engine. If purge was retried several times, it's the sum of all the execution durations. 
* Retries - number of times the operation was retried by the DM service due to a transient error.
* ClientRequestId - client activity id of the DM purge request. 
* Principal - identity of the purge command issuer.



## Purging an entire table
Purging a table includes dropping the table, and marking it as purged so that the hard delete process described in [Purge process](#purge-process) runs on it. 
Dropping a table without purging it doesn't delete all its storage artifacts (deleted according to the hard retention policy initially set on the table). 
The `purge table allrecords` command is quick and efficient and is much preferable to the purge records process, if applicable for your scenario. 
Throttling limitation is not applied to `purge table allrecords` command.

>[!Note]
>The command is invoked by running [purge table *TableName* allrecords](#purge-table-tablename-allrecords-command) command on the Data Management endpoint (**https://ingest-[YourClusterName].kusto.windows.net**).

### purge table *TableName* allrecords command

Similar to '[.purge table records ](#purge-table-tablename-records-command)' command, this command can be invoked in a programmatic (single-step) or in a manual (two-step) mode.
1. Programmatic invocation (single-step):

	 **Syntax**
	 ```kusto
	 .purge table [TableName] in database [DatabaseName] allrecords with (noregrets='true')
	 ```

2. Human invocation (two-steps):

	 **Syntax**
	 ```kusto
	 // Step #1 - retrieve a verification token (the table will not be purged until step #2 is executed)
	 .purge table [TableName] in database [DatabaseName] allrecords

	 // Step #2 - input the verification token to execute purge
	 .purge table [TableName] in database [DatabaseName] allrecords with (verificationtoken='<verification token from step #1>')
	 ```

	|Parameters  |Description  |
	|---------|---------|
	|**DatabaseName**   |   Name of the database.      |
	|**TableName**     |     Name of the table.    |
	|**noregrets**    |     If set, triggers a single-step activation.    |
	|**verificationtoken**     |  In two-step activation scenario (**noregrets** isn't set), this token can be used to execute the second step and commit the action. If **verificationtoken** isn't specified, it will trigger the command's first step, in which a token is returned, to pass back to the command and perform the command's step #2.|

#### Example: Two-step purge

1. To initiate purge in a two-step activation scenario, run step #1 of the command: 

	```kusto
	.purge table MyTable in database MyDatabase allrecords
	```

	**Output**

	| VerificationToken
	|--
	|e43c7184ed22f4f23c7a9d7b124d196be2e570096987e5baadf65057fa65736b

1.  To complete a purge in a two-step activation scenario, use the verification token returned from step #1 to run step #2:

	```kusto
	.purge table MyTable in database MyDatabase allrecords 
	with (verificationtoken='eyJTZXJ2aWNlTmFtZSI6IkVuZ2luZS1pdHNhZ3VpIiwiRGF0YWJhc2VOYW1lIjoiQXp1cmVTdG9yYWdlTG9ncyIsIlRhYmxlTmFtZSI6IkF6dXJlU3RvcmFnZUxvZ3MiLCJQcmVkaWNhdGUiOiIgd2hlcmUgU2VydmVyTGF0ZW5jeSA9PSAyNSJ9')
	```
	The output is the same as the '.show tables' command output (returned without the purged table).

	**Output**

	|TableName|DatabaseName|Folder|DocString
	|---|---|---|---
	|OtherTable|MyDatabase|---|---


#### Example: Single-step purge

To trigger a purge in a single-step activation scenario, run the following command:

```kusto
.purge table MyTable in database MyDatabase allrecords with (noregrets='true')
```

The output is the same as the '.show tables' command output (returned without the purged table).

**Output**

|TableName|DatabaseName|Folder|DocString
|---|---|---|---
|OtherTable|MyDatabase|---|---


