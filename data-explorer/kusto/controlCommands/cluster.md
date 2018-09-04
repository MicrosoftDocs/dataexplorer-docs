---
title: Cluster and miscellaneous commands - Azure Kusto | Microsoft Docs
description: This article describes Cluster and miscellaneous commands in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Cluster and miscellaneous commands

Commands to show cluster-wide information:
* [.show cluster](#show-cluster): Provides a list of all nodes (servers) that are currently active in the cluster and some statistics.
* [.show cluster admin state](#show-cluster-admin-state): Shows whether the cluster admin functionality is available or not.
* [.show capacity](#show-capacity): Gets an estimate on the currently available compute capacity of the cluster.
* [.show memory](#show-memory): Gets some statistics on the current memory consumption of the cluster.
* [.show diagnostics](#show-diagnostics): Gets diagnostics information about the cluster health.
* [.show operations](#show-operations): Provides a list of currently-running and recently-run commands.
* [.show cluster monitoring](#show-cluster-monitoring): Gets the monitoring configuration of the cluster.

## .show cluster

```kusto
.show cluster
```

Returns a set having one record per node currently active in the cluster.  

**Results**

|Output column |Type |Description 
|---|---|---|
|NodeId|String|Identifies the node (this is the Azure RoleId of the node if the cluster is deployed in Azure). |
|Address|String |The internal endpoint used by the cluster for inter-node communications. 
|Name |String |An internal name for the node (this includes the machine name, process name, and process ID). 
|StartTime |DateTime |The exact date/time (in UTC) that the current Kusto instantiation in the node started. This can be used to detect if the node (or Kusto running on the node) has been restarted recently. 
|IsAdmin |Boolean |Whether this node is currently the "leader" of the cluster. 
|MachineTotalMemory  |Int64 |The amount of RAM that the node has. 
|MachineAvailableMemory  |Int64 |The amount of RAM that is currently "available for use" on the node. 
|ProcessorCount  |Int32 |The amount of processors on the node. 
|EnvironmentDescription  |string |Additional information about the node's environment (e.g. Upgrade/Fault Domains), serialized as JSON. 

**Example**

```kusto
.show cluster
```

NodeId|Address|Name|StartTime|IsAdmin|MachineTotalMemory|MachineAvalableMemory|ProcessorCount|EnvironmentDescription
---|---|---|---|---|---|---|---|---
Kusto.Azure.Svc_IN_1|net.tcp://100.112.150.30:23107/|Kusto.Azure.Svc_IN_4/RD000D3AB1E9BD/WaWorkerHost/3820|2016-01-15 02:00:22.6522152|True|274877435904|247797796864|16|{"UpdateDomain":0, "FaultDomain":0}
Kusto.Azure.Svc_IN_3|net.tcp://100.112.154.34:23107/|Kusto.Azure.Svc_IN_3/RD000D3AB1E062/WaWorkerHost/2760|2016-01-15 05:52:52.1434683|False|274877435904|258740346880|16|{"UpdateDomain":1, "FaultDomain":1}
Kusto.Azure.Svc_IN_2|net.tcp://100.112.128.40:23107/|Kusto.Azure.Svc_IN_2/RD000D3AB1E054/WaWorkerHost/3776|2016-01-15 07:17:18.0699790|False|274877435904|244232339456|16|{"UpdateDomain":2, "FaultDomain":2}
Kusto.Azure.Svc_IN_0|net.tcp://100.112.138.15:23107/|Kusto.Azure.Svc_IN_0/RD000D3AB0D6C6/WaWorkerHost/3208|2016-01-15 09:46:36.9865016|False|274877435904|238414581760|16|{"UpdateDomain":3, "FaultDomain":3}

## .show cluster admin state

```kusto
.show cluster admin state
```

Returns information about the cluster's current admin functionality.

**Results**

|Output column|Type       |Description                                                                         |
|-------------|-----------|------------------------------------------------------------------------------------|
|NodeId       |`String`   |Identifies the node in the cluster that "answers". This is the likeliest admin node.|
|Name         |`String`   |The name of the node in the cluster that "answers".                                 |
|StartTime    |`DateTime` |The timestamp when the node was last started (in UTC).                              |
|IsLeader     |`Boolean`  |Whether this cluster is running as leader or not. (Currently they all are.)         |
|IsPrimary    |`Boolean`  |Whether the cluster admin is in the "primary" role or not. If not, most admin commands will fail.|
|PrimarySince |`DateTime?`|If non-null, indicates when this node's role change to "primary" last.              |
|CurrentStateDescription|`String`|Additional information about the current state.                              |

## .show capacity 

```kusto
.show capacity
```

Returns a calculation for an estimated cluster capacity for each resource. 
 
**Results**

|Output parameter |Type |Description 
|---|---|---
|Resource |String |The name of the resource. 
|Total |Int64 |The amount of total resources of type 'Resource' that are available (e.g. amount of concurrent ingestions) 
|Consumed |Int64 |The amount of how many resources of type 'Resource' consumed right now 
|Remaining |Int64 |The amount of remaining resources  of type 'Resource' 
 
**Example**

|Resource |Total |Consumed |Remaining 
|---|---|---|---
|ingestions |576 |1 |575 

## .show memory

```kusto
.show memory [details]
```

An extension to the `.show cluster` command that also displays memory status of the cluster. Useful for troubleshooting Kusto installations.

**Returns**

|Output parameter |Type |Description 
---|---|---
NodeId |String |Identifies the node (this is the Azure RoleId of the node if the cluster is deployed in Azure). 
StartTime |DateTime |The exact date/time (in UTC) that the current Kusto instantiation in the node started. This can be used to detect if the node (or Kusto running on the node) has been restarted recently. 
IsAdmin  |Boolean |Whether this node is currently the "leader" of the cluster. 
MachineTotalMemory  |Int64 |The amount of RAM that the node has. 
MachineAvailableMemory  |Int64 |The amount of RAM that is currently "available for use" on the node. 
PrivateMemorySize |Int64 |The private memory (memory not shared with other processes which is backed-up by the paging file) used by the Kusto process on the node) 
NativeMemoryAllocated |Int64 |How much memory has been allocated by the Kusto engine's native memory allocator. 
NativeMemoryConsumed |Int64 |How much memory is currently consumed by the Kusto engine's native component. 
NativeMemoryRemainingFree  |Int64 |How much memory is currently free for the Kusto engine's native component to use. 
DiskCacheAllocated  |Int64 |How many bytes are allocated for the Kusto engine's disk cache. 
DiskCacheConsumed  |Int64 |How many bytes are currently in use by the Kusto engine's disk cache. 

**Example**
```kusto
.show memory 
```

NodeId| StartTime| IsAdmin| MachineTotalMemory| MachineAvailableMemory| PrivateMemorySize| NativeMemoryAllocated| NativeMemoryConsumed| NativeMemoryRemainingFree| DiskCacheAllocated| DiskCacheConsumed
---| ---| ---| ---| ---| ---| ---| ---| ---| ---| ---
Kusto.Azure.Svc_IN_110| 2017-08-03 06:36:02.7374153| False| 120258613248| 20828598272| 96472588288| 91983368864| 5782142941| 16249383059| 717259538432| 717140000768
Kusto.Azure.Svc_IN_111| 2017-08-03 06:35:58.3605970| False| 120258613248| 19142393856| 97837383680| 94098849792| 7575301437| 14133902131| 717259538432| 717152124928
Kusto.Azure.Svc_IN_112| 2017-08-03 06:36:10.0399642| False| 120258613248| 19269066752| 98176479232| 94445298432| 7859097661| 13787453491| 717259538432| 717133381632
Kusto.Azure.Svc_IN_113| 2017-08-03 06:36:04.1075278| False| 120258613248| 18443194368| 99023560704| 94828925728| 8397127773| 13403826195| 717259538432| 717088489472
Kusto.Azure.Svc_IN_114| 2017-08-03 06:36:47.5140551| False| 120258613248| 16573874176| 100504666112| 96549002112| 9988212925| 11683749811|  717259538432| 717119356928
Kusto.Azure.Svc_IN_115| 2017-08-03 06:36:35.1836907| True| 120258613248| 18592624640| 99382165504| 94093063168| 7506862397| 14139688755|  717259538432| 717131415552

## .show diagnostics

```kusto
.show diagnostics
```

Returns an information about Kusto cluster health state.
 
**Returns**

|Output parameter |Type |Description|
|-----------------|-----|-----------| 
|IsHealthy|Boolean|Whether the cluster is deemed healthy or not.
|IsScaleOutRequired|Boolean|Whether the cluster should be increased in size (add more computing nodes). 
|MachinesTotal|Int64|The number of machines in the cluster.
|MachinesOffline|Int64|The number of machines that are currently offline (not responding).
|NodeLastRestartedOn|DateTime|The last time any of the nodes in the cluster was restarted.
|AdminLastElectedOn|DateTime|The last time ownership of the cluster admin role has changed.
|MemoryLoadFactor|Double|The amount of data held by the cluster relative to its capacity (which is 100.0)
|ExtentsTotal|Int64|The total number of data extents that the cluster currently have across all databases and all tables.
|ExtentsOffline|Int64|`[Obsolete]` The total number of data extents that are not in warm cache (SSD), but held in Blob Storage.
|ExtentsUnassigned|Int64|`[Obsolete]` The total number of data extents that are not currently assigned to any node.
|InstancesTargetBasedOnDataCapacity|Int64| The number of instances needed to bring the ClusterDataCapacityFactor below 80 (valid only when all machines are sized the same).
|TotalOriginalDataSize|Int64|Total size of the originally ingested data
|TotalExtentSize|Int64|Total size of the stored data (after compression and indexing)
|IngestionsLoadFactor|Double|The utilization percentage of cluster ingestion capacity (can be seen using .show capacity command)
|IngestionsInProgress|Int64|The number of ingestion operations currently being done.
|IngestionsSuccessRate|Double|The percentage of ingestion operations that completed successfully in past 10 minutes.
|MergesInProgress|Int64|The number of extents merge operations currently being done.
|BuildVersion|String|The Kusto software version deployed to the cluster.
|BuildTime|DateTime|The build time of this Kusto software version.
|ClusterDataCapacityFactor|Double|The percentage of the cluster data capacity utilization. It is calculated as SUM(Extent Size Data) / SUM(SSD Cache Size).
|IsDataWarmingRequired|Boolean|Internal: Whether the cluster's warming queries should be run (in order to bring data to local SSD cache). 
|DataWarmingLastRunOn|DateTime|The last time .warm data was run on the cluster
|MergesSuccessRate|Double|The percentage of merges operations that completed successfully in past 10 minutes.
|NotHealthyReason|String|String specifying the reason for cluster not being healthy	
|IsAttentionRequired|Boolean|Whether cluster requires Operation team attention
|AttentionRequiredReason|String|String specifying the reason for cluster requirng attention
|ProductVersion|String|String with product information (branch, version, etc)
|FailedIngestOperations|Int64|Number of failed ingestion operations past 10 minutes
|FailedMergeOperations|Int64|Number of failed merge operations past 1 hour
|MaxExtentsInSingleTable|Int64|Max number of extents in the table (TableWithMaxExtents)
|TableWithMaxExtents|String|Table with the maximum number of extents (MaxExtentsInSingleTable)
|WarmExtentSize|Double|Total size of extents in the hot cache
|NumberOfDatabases|Int32|Number of databases in the cluster

## .show operations 

Returns a table with all administrative operations since the new Admin node was elected. 

|||
|---|---| 
|`.show` `operations`              |Returns all operations that Admin node processed or is processing since it was elected  
|`.show` `running`   `operations`  |Returns all operations that Admin node is processing right now 
|`.show` `completed` `operations`  |Returns all operations that Admin node processed since it was elected  
|`.show` `operations` *OperationId*|Returns operation status for specific ID 
|`.show` `operations` `(`*OperationId1*`,` *OperationId2*`,` ...)|Returns operations status for specific IDS 

**Results**
 
|Output parameter |Type |Description 
|---|---|---
|Id |String |Operation Identifier. This parameter can be used to query Kuskus (Kusto-on-Kusto) as RootActivityId to observe the whole flow. 
|Operation |String |Admin command alias 
|NodeId |String |If the command has a remote execution (e.g. DataIngestPull) - NodeId will contain the id of the executing remote node 
|StartedOn |DateTime |Date/time (in UTC) when the operation has started 
|LastUpdatedOn |DateTime |Date/time (in UTC) when the operation last updated (can be either a step inside the operation, or a completion step) 
|Duration |DateTime |Timespan between LastUpdateOn and StartedOn 
|State |String |Command state: can have values of "InProgress", "Completed" or "Failed" 
|Status |String |Additional help string that either holds errors for failed operations 
 
**Example**
 
|Id |Operation |Node Id |Started On |Last Updated On |Duration |State |Status 
|--|--|--|--|--|--|--|--
|3827def6-0773-4f2a-859e-c02cf395deaf |SchemaShow | |2015-01-06 08:47:01.0000000 |2015-01-06 08:47:01.0000000 |0001-01-01 00:00:00.0000000 |Completed | 
|841fafa4-076a-4cba-9300-4836da0d9c75 |DataIngestPull |Kusto.Azure.Svc_IN_1 |2015-01-06 08:47:02.0000000 |2015-01-06 08:48:19.0000000 |0001-01-01 00:01:17.0000000 |Completed | 
|e198c519-5263-4629-a158-8d68f7a1022f |OperationsShow | |2015-01-06 08:47:18.0000000 |2015-01-06 08:47:18.0000000 |0001-01-01 00:00:00.0000000 |Completed | 
|a9f287a1-f3e6-4154-ad18-b86438da0929 |ExtentsDrop | |2015-01-11 08:41:01.0000000 |0001-01-01 00:00:00.0000000 |0001-01-01 00:00:00.0000000 |InProgress | 
|9edb3ecc-f4b4-4738-87e1-648eed2bd998 |DataIngestPull | |2015-01-10 14:57:41.0000000 |2015-01-10 14:57:41.0000000 |0001-01-01 00:00:00.0000000 |Failed |Collection was modified; enumeration operation may not execute. 

## .show cluster monitoring 

Returns a table with the cluster's monitoring configuration properties.

```kusto
.show cluster monitoring
```

**Results**
 
|Output parameter |Type |Description 
|---|---|---
|KustoAccount |String |The name of the Kusto account the cluster belongs to.
|ClusterAlias |String |The cluster's alias.
|GenevaMonitoringAccount |String |The name of the Geneva monitoring accout the cluster sends metrics to.

**Example**
 
|MonitoringAccount |KustoAccount |ClusterAlias
|--|--|--
|KustoProd |Aria Office |OARIADOCS | fb8efd996b264f9da2cc3366ddbca084

## Follower Cluster

Control commands for managing a [follower cluster](https://kusdoc2.azurewebsites.net/docs/concepts/followercluster.html)'s configuration are listed below.
  - While these commands run synchronously, their effect is applied on the next periodic schema refresh, so there could be up to a few minutes delay until the new configuration is applied.
  - Unless expicitly mentioned otherwise for a specific command below, all these commands require [ClusterAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).
  In case you lack these permissions, [opening a support ticket](http://aka.ms/kustosupport) is required for setting up the follower configuration.


### .show follower databases

Shows the database being followed from other leader cluster(s).

**Syntax**

`.show follower databases`

**Output** 

|Output parameter |Type |Description 
|---|---|---
|DatabaseName |String |The name of the database being followed.
|LeaderClusterMetadataPath |String |The path to the leader cluster's metadata container.
|CachingPolicyOverride |String |An override caching policy for the database, serialized as JSON (or null).
|AuthorizedPrincipalsOverride |String |An override collection of authorized principals for the database, serialized as JSON (or null).
|AuthorizedPrincipalsModificationKind |String |The modification kind to apply using AuthorizedPrincipalsOverride (`none`, `union` or `replace`).
|IsAutoPrefetchEnabled  |Boolean |Whether or not new data is prefetched upon each schema refresh.

### .add follower database

Adds specific database, or all databases, to be followed from a leader cluster.

*Notes:*
- Obtaining the path to the leader cluster's metadata container can only be done by the KustoOps team. Thus, [opening a support ticket](http://aka.ms/kustosupport) is required for running this command.
- When using the `*` option, any database which is created on the leader cluster will automatically be followed in the follower cluster.

**Syntax**

`.add` `follower` `database` *DatabaseName* `from` `h@'`*path to leader cluster's metadata container*`'`

`.add` `follower` `databases` `(`*DatabaseName1*`,`...`,`*DatabaseNameN*`)` `from` `h@'`*path to leader cluster's metadata container*`'`

`.add` `follower` `database` `*` `from` `h@'`*path to leader cluster's metadata container*`'`

**Examples**

```kusto
.add follower database MyDB from h'https://accountname.blob.core.windows.net/containername;storagekey'
```

```kusto
.add follower databases (MyDB1, MyDB2, MyDB3) from h'https://accountname.blob.core.windows.net/containername;storagekey'
```

```kusto
.add follower database * from h'https://accountname.blob.core.windows.net/containername;storagekey'
```

### .drop follower database

Removes specific database, or all databases, to no longer be followed from a leader cluster.

*Note*: when using the `*` option, no databases from the leader cluster will be followed by the follower cluster.

**Syntax**

`.drop` `follower` `database` *DatabaseName* `from` `h@'`*path to leader cluster's metadata container*`'`

`.drop` `follower` `databases` `(`*DatabaseName1*`,`...`,`*DatabaseNameN*`)` `from` `h@'`*path to leader cluster's metadata container*`'`

`.drop` `follower` `database` `*` `from` `h@'`*path to leader cluster's metadata container*`'`

**Example**

```kusto
.drop follower database MyDB from h'https://accountname.blob.core.windows.net/containername'
```

```kusto
.drop follower databases (MyDB1, MyDB2, MyDB3) from h'https://accountname.blob.core.windows.net/containername'
```

```kusto
.drop follower database * from h'https://accountname.blob.core.windows.net/containername'
```

**Output** 

### .alter follower database policy caching

Alters a follower database's caching policy, to override the one set on the source database in the leader cluster.

The path to the leader cluster's metadata container needs to be specified in case:
- The follower cluster is following all databases from the leader cluster, and
- There were no overrides set for this database previously

Requires [DatabaseAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Syntax**

`.alter` `follower` `database` *DatabaseName* [`from` `h@'`*path to leader cluster's metadata container*`'`]
`policy` `caching` `hot` `=` *HotDataSpan*

**Examples**

```kusto
.alter follower database MyDb from h'https://accountname.blob.core.windows.net/containername' policy caching hot = 7d
```

```kusto
.alter follower database MyDb policy caching hot = 7d
```

### .delete follower database policy caching

Deletes a follower database's override caching policy, making the policy set on the source database in the leader cluster the effective one.

Requires [DatabaseAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html). 

**Syntax**

`.delete` `follower` `database` *DatabaseName* `policy` `caching`

**Example**

```kusto
.delete follower database MyDB policy caching
```

### .add follower database principals

Adds authorized principal(s) to the follower database's collection of override authorized principals.

The path to the leader cluster's metadata container needs to be specified in case:
- The follower cluster is following all databases from the leader cluster, and
- There were no overrides set for this database previously

Requires [DatabaseAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).

*Note:* The default `modification kind` for such authorized principals is `none` - to alter that, use the matching command specified below.

**Syntax**

`.add` `follower` `database` *DatabaseName* [`from` `h@'`*path to leader cluster's metadata container*`'`]
(`admins` | `users` | `viewers` | `unrestrictedviewers`) `(`*principal1*`,`...`,`*principalN*`)` [`notes` `'`*notes*`'`]

**Examples**

```kusto
.add follower database MyDB viewers ('aadgroup=mygroup@microsoft.com') 'My Group'
```

```kusto
.add follower database MyDB from h'https://accountname.blob.core.windows.net/containername' viewers ('aadgroup=mygroup@microsoft.com') 'My Group'
```

### .drop follower database principals

Drops authorized principal(s) from the follower database's collection of override authorized principals.

Requires [DatabaseAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).

**Syntax**

`.drop` `follower` `database` *DatabaseName* [`from` `h@'`*path to leader cluster's metadata container*`'`]
(`admins` | `users` | `viewers` | `unrestrictedviewers`) `(`*principal1*`,`...`,`*principalN*`)`

**Example**

```kusto
.drop follower database MyDB viewers ('aadgroup=mygroup@microsoft.com')
```

```kusto
.add follower database MyDB from h'https://accountname.blob.core.windows.net/containername' viewers ('aadgroup=mygroup@microsoft.com')
```

### .alter follower database principals-modification-kind

Alters the follower database's authorized principals modification kind.

Requires [DatabaseAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).

**Syntax**

`.alter` `follower` `database` *DatabaseName* [`from` `h@'`*path to leader cluster's metadata container*`'`]
`principals-modification-kind` = (`none` | `union` | `replace`)

**Example**

```kusto
.alter follower database MyDB principals-modification-kind = union
```

### .alter follower database prefetch-extents

Alters the follower database's configuration of whether or not to prefetch new extents upon each schema refresh.

> Note: Enabling this setting could potentially degrade the freshness of data in the follower database. The default configuration is `false`.

Requires [DatabaseAdmin permission](https://kusdoc2.azurewebsites.net/docs/concepts/principal-roles.html).

**Syntax**

`.alter` `follower` `database` *DatabaseName* [`from` `h@'`*path to leader cluster's metadata container*`'`]
`prefetch-extents` = (`true` | `false`)

**Example**

```kusto
.alter follower database MyDB prefetch-extents = false
```

### .alter follower cluster configuration

Alters a follower clusters configuration:
- Enables *following* a leader cluster's authorized principals and basic-auth users.
- if `follow-authorized-principals` is set to `true`, the follower cluster's authorized principals and basic-auth
users are unioned with those of the leader cluster.

**Syntax**

`.alter` `follower` `cluster` `configuration` `from` `h@'`*path to leader cluster's metadata container*`'` `follow-authorized-principals` `=` *true | false*

**Example**

```kusto
.alter follower cluster configuration from 'https://accountname.blob.core.windows.net/containername' follow-authorized-principals = true
```