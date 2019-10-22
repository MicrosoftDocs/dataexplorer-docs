---
title: Commands management - Azure Data Explorer | Microsoft Docs
description: This article describes Commands management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 08/19/2019

---
# Commands management

## .show commands 

`.show` `commands` command returns a table with admin commands which have reached a final state. These commands are available to query for 30 days.

The Commands table has two columns with resources consumption details of every completed command:
* TotalCpu: The total CPU clock time (User mode + Kernel mode) consumed by this command.
* ResourceUtilization: An object containing all resource utilization information related to that command (including the TotalCpu).

Resource consumption being tracked includes Data Updates, as well as any query associated with the current Admin command.
Currently only some of the Admin commands are covered by the Commands table (.ingest, .set, .append, .set-or-replace, .set-or-append), and gradually, more commands will be added in the future.


* A [database admin or database monitor](../management/access-control/role-based-authorization.md) can see any command that was invoked on their database.
* Other users can only see commands that were invoked by them.

**Syntax**

`.show` `commands`
 
**Example**
 
|ClientActivityId |CommandType |Text |Database |StartedOn |LastUpdatedOn |Duration |State |RootActivityId |User |FailureReason |Application |Principal |TotalCpu |ResourceUtilization
|--|--|--|--|--|--|--|--|--|--|--|--|--|--|--
|KD2RunCommand;a069f9e3-6062-4a0e-aa82-75a1b5e16fb4	|ExtentsMerge	|.merge async Operations ...    |DB1	|2017-09-05 11:08:07.5738569	|2017-09-05 11:08:09.1051161	|00:00:01.5312592	|Completed	|b965d809-3f3e-4f44-bd2b-5e1f49ac46c5	|AAD app id=5ba8cec2-9a70-e92c98cad651	|	|Kusto.Azure.DM.Svc	|aadapp=5ba8cec2-9a70-e92c98cad651	|00:00:03.5781250   |{ "ScannedExtentsStatistics": {    "MinDataScannedTime": null,    "MaxDataScannedTime": null  },  "CacheStatistics": {    Memory": {      "Misses": 2,      "Hits": 20    },    "Disk": {      "Misses": 2,      "Hits": 0    }  },  "MemoryPeak": 159620640,  "TotalCpu": "00:00:03.5781250" } 
|KE.RunCommand;710e08ca-2cd3-4d2d-b7bd-2738d335aa50	|DataIngestPull	|.ingest into MyTableName ...   |TestDB	|2017-09-04 16:00:37.0915452	|2017-09-04 16:04:37.2834555	|00:04:00.1919103	|Failed	|a8986e9e-943f-81b0270d6fae4	|cooper@fabrikam.com	|The socket connection has been disposed.	|Kusto.Explorer	|aaduser=...	|00:00:00	|{ "ScannedExtentsStatistics": {    "MinDataScannedTime": null,    "MaxDataScannedTime": null  },  "CacheStatistics": {    "Memory": {      "Misses": 0,      Hits": 0    },    "Disk": {      "Misses": 0,      "Hits": 0    }  },  "MemoryPeak": 0,  "TotalCpu": "00:00:00"} 
|KD2RunCommand;97db47e6-93e2-4306-8b7d-670f2c3307ff	|ExtentsRebuild	|.merge async Operations ...    |DB2	|2017-09-18 13:29:38.5945531	|2017-09-18 13:29:39.9451163	|00:00:01.3505632	|Completed	|d5ebb755-d5df-4e94-b240-9accdf06c2d1	|AAD app id=5ba8cec2-9a70-e92c98cad651	|	|Kusto.Azure.DM.Svc	|aadapp=5ba8cec2-9a70-e92c98cad651	|00:00:00.8906250	|{ "ScannedExtentsStatistics": {    "MinDataScannedTime": null,    "MaxDataScannedTime": null  },  "CacheStatistics": {    Memory": {      "Misses": 0,      "Hits": 1    },    "Disk": {      "Misses": 0,      "Hits": 0    }  },  "MemoryPeak": 88828560,  "TotalCpu": "00:00:00.8906250"} 

**Example: extracting specific data out of the ResourceUtilization column**

Accessing one of the properties within the ResourceUtilization column, is done by calling ResourcesUtilization.xxx (where xxx is the property name).
Note that the ResourceUtilization is a dynamic column, and hence in order to work with its values, one should first convert it into a specific data type (using a convertion function such as: tolong, toint, totimespan, ...).  

For example:

```kusto
.show commands
| where CommandType == "TableAppend"
| where StartedOn > ago(1h)
| extend MemoryPeak = tolong(ResourcesUtilization.MemoryPeak)
| top 3 by MemoryPeak desc
| project StartedOn, MemoryPeak, TotalCpu, Text
```

|StartedOn |MemoryPeak |TotalCpu |Text
|--|--|--|--
| 2017-09-28 12:11:27.8155381	| 800396032	| 00:00:04.5312500  | .append Server_Boots <\| let bootStartsSourceTable = SessionStarts; ...
| 2017-09-28 11:21:26.7304547	| 750063056	| 00:00:03.8218750  | .set-or-append WebUsage <\| database('CuratedDB').WebUsage_v2 | summarize ... | project ...
| 2017-09-28 12:16:17.4762522	| 676289120	| 00:00:00.0625000  | .set-or-append  AtlasClusterEventStats with(..) <\| Atlas_Temp(datetime(2017-09-28 12:13:28.7621737),datetime(2017-09-28 12:14:28.8168492))

## Investigating performance issues

`.show` `commands` can be used in order to investigate performance issues, as they allow to see see the resources consumed by each Control Command.
The following examples are simple and useful queries for such investigations.

### Querying the TotalCpu column

Top 10 CPU consuming queries in the last day:
```kusto
.show commands
| where StartedOn > ago(1d)
| top 10 by TotalCpu
| project StartedOn, CommandType, ClientActivityId, TotalCpu 
```

All queries in the last 10 hours which their TotalCpu has crossed the 3 minutes:
```kusto
.show commands
| where StartedOn > ago(10h) and TotalCpu > 3m
| project StartedOn, CommandType, ClientActivityId, TotalCpu 
| order by TotalCpu 
```

All queries in the last 24 hours which their TotalCpu was above 5 minutes, grouped by User and Principal:

```kusto
.show commands  
| where StartedOn > ago(24h)
| summarize TotalCount=count(), CountAboveThreshold=countif(TotalCpu > 2m), AverageCpu = avg(TotalCpu), MaxTotalCpu=max(TotalCpu), (50th_Percentile_TotalCpu, 95th_Percentile_TotalCpu)=percentiles(TotalCpu, 50, 95) by User, Principal
| extend PercentageAboveThreshold = strcat(substring(CountAboveThreshold * 100 / TotalCount, 0, 5), "%")
| order by CountAboveThreshold desc
| project User, Principal, CountAboveThreshold, TotalCount, PercentageAboveThreshold, MaxTotalCpu, AverageCpu, 50th_Percentile_TotalCpu, 95th_Percentile_TotalCpu
```

Timechart: Average CPU vs 95th Percentile vs Max CPU :
```kusto
.show commands 
| where StartedOn > ago(1d) 
| summarize MaxCpu_Minutes=max(TotalCpu)/1m, 95th_Percentile_TotalCpu_Minutes=percentile(TotalCpu, 95)/1m, AverageCpu_Minutes=avg(TotalCpu)/1m by bin(StartedOn, 1m)
| render timechart
```

## Querying the MemoryPeak

Top 10 queries in the last day with the highest MemoryPeak values:
```kusto
.show commands
| where StartedOn > ago(1d)
| extend MemoryPeak = tolong(ResourcesUtilization.MemoryPeak)
| project StartedOn, CommandType, ClientActivityId, TotalCpu, MemoryPeak
| top 10 by MemoryPeak  
```

Timechart of Average MemoryPeak vs 95th Percentile vs Max MemoryPeak:
```kusto
.show commands 
| where StartedOn > ago(1d)
| project MemoryPeak = tolong(ResourcesUtilization.MemoryPeak), StartedOn 
| summarize Max_MemoryPeak=max(MemoryPeak), 95th_Percentile_MemoryPeak=percentile(MemoryPeak, 95), Average_MemoryPeak=avg(MemoryPeak) by bin(StartedOn, 1m)
| render timechart
```