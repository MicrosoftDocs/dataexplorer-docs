---
title: "Tutorial: Transform data using table update policies"
description: "Learn how to use table update policies to perform complex transformations and save the results to destination tables."
author: shsagir
ms.author: shsagir
ms.topic: tutorial
ms.date: 02/15/2024

#customer intent: As a <role>, I want <what> so that <why>.

---
# Tutorial: Transform data using table update policies

When your source data involves simple and quick transformations, it's generally best to perform them upstream in the pipeline by using the event stream. However, this approach might not work well for other transformations that are complex or require specialized functionality to operate.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * [1 - Create a source table](#1---create-a-source-table)
> * [2 - Create a KQL function to transform the data](#2---create-a-kql-function-to-transform-the-data)
> * [3 - Create destination tables](#3---create-destination-tables)
> * [4 - Create update policies](#4---create-update-policies)
> * [5 - Ingest sample data](#5---ingest-sample-data)
> * [6 - Verify the results](#6---verify-the-results)

The example in this tutorial demonstrates how to use update policies for [data routing](update-policy-use-cases.md#data-routing) to perform complex transformations to enrich, cleanse, and transform data at ingestion time. For a list of other common use cases, see [Common use cases for table update policies](update-policy-use-cases.md).

## Prerequisites

**// TODO: Add prerequisites**

## 1 - Create a source table

The source table is where the ingested data is saved. The arrival of new data serves as a trigger to run a transformation function.

**// TODO: Add content from topic directly here so customer doesn't have to click through to another topic.**

```kusto
.create table Raw_Table (RawData:dynamic)
```

For more information, see [.create table command](/azure/data-explorer/kusto/management/create-table-command?context=/fabric/context/context-rta&pivots=fabric).

## 2 - Create a KQL function to transform the data

When you create an update policy, you can specify an in-line KQL script that will be executed. The recommended practice, however, is to encapsulate the transformation logic into a KQL function. A function provides better code maintenance into the future.

**// TODO: Add content from topic directly here so customer doesn't have to click through to another topic.**

For more information, see [.create function command](/azure/data-explorer/kusto/management/create-function?context=/fabric/context/context-rta&pivots=fabric).

```kusto
.create-or-alter function Get_Telemetry(){
Raw_Table
| where todynamic(RawData).MessageType == 'Telemetry'
| extend 
  Timestamp   = unixtime_seconds_todatetime(tolong(RawData.Timestamp)),
  DeviceId    = tostring(RawData.DeviceId),
  SensorId    = tostring(RawData.SensorId),
  SensorValue = toreal(RawData.SensorValue),
  SensorUnit  = tostring(RawData.SensorUnitId)
| project-away RawData}
.create-or-alter function GetAlarms(){
MyRawTable
| where RawData.MessageType == 'Alarms'
| extend 
  Timestamp   = unixtime_seconds_todatetime(tolong(RawData.Timestamp)),
  DeviceId    = tostring(RawData.DeviceId),
  SensorId    = tostring(RawData.SensorId),
  AlarmType   = toint(RawData.AlarmType)
| project-away RawData}
.create-or-alter function DeadLetter(){
MyRawTable
| where  RawData.MessageType !in ('Telemetry','Alarms')
| extend
  TimeStamp = datetime(now),
  ErrorType = 'Unknown MessageType'
| project TimeStamp,RawData,ErrorType
}
```

## 3 - Create destination tables

The destination table must have the same schema as that output by the transformation function (see above). For maintainability reasons, you should create the destination table by using a well crafted .create table command.

If you've already developed a KQL function to transform the data, you can use the .set-or-append command to create the destination table based. The destination table will adopt the schema that's output by the function. This approach results in faster development and ensures consistency.

The following example creates a destination table named **MyNewTable** and its schema is based on the output of the **MyTransformationFunction** function.

```kusto
set-or-append MyNewTable <| MyTransformationFunction | limit 0
```

Note the limit 0 operator ensures that no rows are returned by the function, and it ensures that the table is empty.

For more information, see [Kusto query ingestion (set, append, replace)](/azure/data-explorer/kusto/management/data-ingestion/ingest-from-query?context=/fabric/context/context-rta&pivots=fabric).

```kusto
.execute database script <|
.create table Device_Telemetry (Timestamp:datetime, DeviceId:string, DeviceType:string, SensorName:string, SensorValue:real, SensorUnit:string)
.create table Device_Alarms (Timestamp:datetime, DeviceId:string, DeviceType:string,AlarmType:string)
.create table Error_Log (Timestamp:datetime, RawMsg:dynamic, ErrorType:string )
```

## 4 - Create update policies

The final step is to use the .alter update policy command to link the source table, the transformation function, and the destination table by using an update policy. The update policy gets created on the destination table, and it refers to the source table and transformation function.

The following example creates an update policy on the **MyDestinationTable** table.

``` kusto
.alter table MyDestinationTable policy update
[
    {
        "IsEnabled": true,
        "Source": "MySourceTable",
        "Query": "MyTransformationFunction",
        "IsTransactional": false,
        "PropagateIngestionProperties": false
    }
]
```

For more information, see [.alter table policy update command](/azure/data-explorer/kusto/management/alter-table-update-policy-command?context=/fabric/context/context-rta&pivots=fabric).

> [!TIP]
> You can use the Fabric portal to create an update policy. It generates a template script that you can update with your object names and property values.

```kusto
.execute database script <|
.alter table MyTelemetry  policy update "[{\"IsEnabled\":true,\"Source\":\"MyRawTable\",\"Query\":\"GetTelemetry\",\"IsTransactional\":false,\"PropagateIngestionProperties\":true,\"ManagedIdentity\":null}]"
.alter table MyAlarms  policy update "[{\"IsEnabled\":true,\"Source\":\"MyRawTable\",\"Query\":\"GetAlarms\",\"IsTransactional\":false,\"PropagateIngestionProperties\":true,\"ManagedIdentity\":null}]"
.alter table MyDeadLetter  policy update "[{\"IsEnabled\":true,\"Source\":\"MyRawTable\",\"Query\":\"DeadLetter\",\"IsTransactional\":false,\"PropagateIngestionProperties\":true,\"ManagedIdentity\":null}]"
```

## 5 - Ingest sample data

```kusto
.set-or-append MyRawTable <|
let MyRawStream = datatable(RawData:dynamic )
[
  dynamic({"TimeStamp": 1691757932,"DeviceId": "Sensor01","MessageType": "Telemetry","DeviceTypeId": 34, "SensorId": 45, "SensorValue": 78.3,"SensorUnitId": 14}),
  dynamic({"TimeStamp": 1691757932,"DeviceId": "Sensor01","MessageType": "Alarms", "SensorId": 45,"AlarmType": 2}),
  dynamic({"TimeStamp": 1691757932,"DeviceId": "Sensor01","MessageType": "Foo", "AlarmType": 2})
];
MyRawStream
```

## 6 - Verify the results

```kusto
(MyRawTable| summarize count() by TableName = "MyRawTable")
|union
(MyTelemetry| summarize count() by TableName = "MyTelemetry")
|union 
(MyAlarms| summarize count() by TableName = "MyAlarms")
| union 
(MyDeadLetter | summarize count() by TableName = "DeadLetter")
```

## Clean up resources

```kusto
.execute database script <|
.drop table MyRawTable
.drop table MyTelemetry
.drop table MyAlarms 
.drop table MyDeadLetter
.drop function GetTelemetry
.drop function GetAlarms
.drop function DeadLetter
```

## Related content

* [Create a table update policy](../table-update-policy.md)
