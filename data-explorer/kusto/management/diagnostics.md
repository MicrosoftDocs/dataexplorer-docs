---
title: Diagnostic information - Azure Data Explorer | Microsoft Docs
description: This article describes Diagnostic information in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 02/07/2019

---
# Diagnostic information

Next commands can be used to display system diagnostic information.

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

NodeId|Address|Name|StartTime|IsAdmin|MachineTotalMemory|MachineAvailableMemory|ProcessorCount|EnvironmentDescription
---|---|---|---|---|---|---|---|---
Kusto.Azure.Svc_IN_1|net.tcp://100.112.150.30:23107/|Kusto.Azure.Svc_IN_4/RD000D3AB1E9BD/WaWorkerHost/3820|2016-01-15 02:00:22.6522152|True|274877435904|247797796864|16|{"UpdateDomain":0, "FaultDomain":0}
Kusto.Azure.Svc_IN_3|net.tcp://100.112.154.34:23107/|Kusto.Azure.Svc_IN_3/RD000D3AB1E062/WaWorkerHost/2760|2016-01-15 05:52:52.1434683|False|274877435904|258740346880|16|{"UpdateDomain":1, "FaultDomain":1}
Kusto.Azure.Svc_IN_2|net.tcp://100.112.128.40:23107/|Kusto.Azure.Svc_IN_2/RD000D3AB1E054/WaWorkerHost/3776|2016-01-15 07:17:18.0699790|False|274877435904|244232339456|16|{"UpdateDomain":2, "FaultDomain":2}
Kusto.Azure.Svc_IN_0|net.tcp://100.112.138.15:23107/|Kusto.Azure.Svc_IN_0/RD000D3AB0D6C6/WaWorkerHost/3208|2016-01-15 09:46:36.9865016|False|274877435904|238414581760|16|{"UpdateDomain":3, "FaultDomain":3}


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
|Reserved|Int64|
|Reserved|Int64|
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
|AttentionRequiredReason|String|String specifying the reason for cluster requiring attention
|ProductVersion|String|String with product information (branch, version, etc)
|FailedIngestOperations|Int64|Number of failed ingestion operations past 10 minutes
|FailedMergeOperations|Int64|Number of failed merge operations past 1 hour
|MaxExtentsInSingleTable|Int64|Max number of extents in the table (TableWithMaxExtents)
|TableWithMaxExtents|String|Table with the maximum number of extents (MaxExtentsInSingleTable)
|WarmExtentSize|Double|Total size of extents in the hot cache
|NumberOfDatabases|Int32|Number of databases in the cluster

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

## .show operations 

Returns a table with all administrative operations since the new Admin node was elected. 

|||
|---|---| 
|`.show` `operations`              |Returns all operations that the cluster has processed or is processing 
|`.show` `operations` *OperationId*|Returns operation status for a specific ID 
|`.show` `operations` `(`*OperationId1*`,` *OperationId2*`,` ...)|Returns operations status for specific IDs

**Results**
 
|Output parameter |Type |Description 
|---|---|---
|Id |String |Operation Identifier. 
|Operation |String |Admin command alias 
|NodeId |String |If the command has a remote execution (e.g. DataIngestPull) - NodeId will contain the id of the executing remote node 
|StartedOn |DateTime |Date/time (in UTC) when the operation has started 
|LastUpdatedOn |DateTime |Date/time (in UTC) when the operation last updated (can be either a step inside the operation, or a completion step) 
|Duration |DateTime |TimeSpan between LastUpdateOn and StartedOn 
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