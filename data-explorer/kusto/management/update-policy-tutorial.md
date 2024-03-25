---
title: "Tutorial: Route data using table update policies"
description: "Learn how to use table update policies to perform complex transformations and save the results to one or more destination tables."
ms.topic: tutorial
ms.date: 02/15/2024

#customer intent: As a data engineer, I want to learn how to use table update policies to perform complex transformations and save the results to one or more destination tables so that I can route data to different tables based on the data content.
---
# Tutorial: Route data using table update policies

When your source data involves simple and quick transformations, it's best to perform them upstream in the pipeline by using an event stream. However, this approach might not work well for other transformations that are complex or require specialized functionality to operate.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * [1 - Create tables and update policies](#1---create-tables-and-update-policies)
> * [2 - Ingest sample data](#2---ingest-sample-data)
> * [3 - Verify the results](#3---verify-the-results)

The example in this tutorial demonstrates how to use update policies for [data routing](update-policy-common-scenarios.md) to perform complex transformations to enrich, cleanse, and transform data at ingestion time. For a list of other common use cases, see [Common use cases for table update policies](update-policy-common-scenarios.md).

## Prerequisites

* A Microsoft account or a Microsoft Entra user identity. An Azure subscription isn't required.
* An Azure Data Explorer cluster and database. [Create a cluster and database](/azure/data-explorer/create-cluster-and-database) **or** a [KQL database in Real-Time Analytics in Microsoft Fabric](/fabric/real-time-analytics/create-database).

## 1 - Create tables and update policies

The following steps guide you through creating a source table, transformation functions, destination tables, and update policies. The tutorial demonstrates how to use table update policies to perform complex transformations and save the results to one or more destination tables. The example uses a single source table named **Raw_Table** and three destination tables named **Device_Telemetry**, **Device_Alarms**, and **Error_Log**.

1. Run the following command to create a table named **Raw_Table**.

    ```kusto
    .create table Raw_Table (RawData: dynamic)
    ```

    The source table is where the ingested data is saved. The table has a single column named **RawData** of type dynamic. The dynamic type is used to store the raw data as is, without any schema. For more information, see [.create table command](/azure/data-explorer/kusto/management/create-table-command).

1. Run the following command to create a function named **Get_Telemetry**, **Get_Alarms**, and **Log_Error** functions.

    ```kusto
    .execute database script <|
      .create-or-alter function Get_Telemetry() {
        Raw_Table
        | where todynamic(RawData).MessageType == 'Telemetry'
        | extend
          Timestamp = unixtime_seconds_todatetime(tolong(RawData.Timestamp)),
          DeviceId = tostring(RawData.DeviceId),
          DeviceType = tostring(RawData.DeviceType),
          SensorName = tostring(RawData.SensorName),
          SensorValue = toreal(RawData.SensorValue),
          SensorUnit = tostring(RawData.SensorUnit)
        | project-away RawData
      }
      .create-or-alter function Get_Alarms() {
        Raw_Table
        | where RawData.MessageType == 'Alarms'
        | extend
          Timestamp = unixtime_seconds_todatetime(tolong(RawData.Timestamp)),
          DeviceId = tostring(RawData.DeviceId),
          DeviceType = tostring(RawData.DeviceTpe) ,
          AlarmType = tostring(RawData.AlarmType)
        | project-away RawData
      }
      .create-or-alter function Log_Error() {
        Raw_Table
        | where RawData.MessageType !in ('Telemetry', 'Alarms')
        | extend
          TimeStamp = datetime(now),
          ErrorType = 'Unknown MessageType'
        | project TimeStamp, RawData, ErrorType
      }
    ```

    When creating an update policy, you can specify an in-line script for execution. However, we recommend encapsulating the transformation logic into a function. Using a function improves code maintenance. When new data arrives, the function is executed to transform the data. The function can be reused across multiple update policies. For more information, see [.create function command](/azure/data-explorer/kusto/management/create-function).

1. Run the following command to create the destination tables.

    ```kusto
    .execute database script <|
      .create table Device_Telemetry (Timestamp: datetime, DeviceId: string, DeviceType: string, SensorName: string, SensorValue: real, SensorUnit: string)
      .set-or-append Device_Alarms <| Get_Alarms | take 0
      .set-or-append Error_Log <| Log_Error | take 0
    ```

    The destination table must have the same schema as that output of the transformation function. You can create destination tables in the following ways:

    * Using the `.create table` command and manually specifying the schema as demonstrated with the creation of the **Device_Telemetry** table. However, this approach can be error-prone and time-consuming.
    * Using the `.set-or-append` command if you've already created a function to transform the data. This method creates a new table with the same schema as the output of the function, using `take 0` to make sure only the schema is returned by the function. For more information, see [.set-or-append command](/azure/data-explorer/kusto/management/data-ingestion/ingest-from-query).

1. Run the following command to create the update policies for the destination tables

    ```kusto
    .execute database script <|
      .alter table Device_Telemetry policy update "[{\"IsEnabled\":true,\"Source\":\"Raw_Table\",\"Query\":\"Get_Telemetry\",\"IsTransactional\":false,\"PropagateIngestionProperties\":true,\"ManagedIdentity\":null}]"
      .alter table Device_Alarms policy update "[{\"IsEnabled\":true,\"Source\":\"Raw_Table\",\"Query\":\"Get_Alarms\",\"IsTransactional\":false,\"PropagateIngestionProperties\":true,\"ManagedIdentity\":null}]"
      .alter table Error_Log policy update "[{\"IsEnabled\":true,\"Source\":\"Raw_Table\",\"Query\":\"Log_Error\",\"IsTransactional\":false,\"PropagateIngestionProperties\":true,\"ManagedIdentity\":null}]"
    ```

    The `.alter table policy update` command is used to link the source table, the transformation function, and the destination table. The update policy is created on the destination table and specifies to the source table and transformation function. For more information, see [.alter table policy update command](/azure/data-explorer/kusto/management/alter-table-update-policy-command?context=/fabric/context/context-rta&pivots=fabric).

## 2 - Ingest sample data

To test the update policies, you can ingest sample data into the source table using the `.set-or-append` command. For more information, see [Ingest data from a query](/azure/data-explorer/kusto/management/data-ingestion/ingest-from-query).

```kusto
.set-or-append Raw_Table <|
  let Raw_Stream = datatable(RawData: dynamic)
    [
    dynamic({"TimeStamp": 1691757932, "DeviceId": "Sensor01", "MessageType": "Telemetry", "DeviceType": "Laminator", "SensorName": "Temperature", "SensorValue": 78.3, "SensorUnit": "Celcius"}),
    dynamic({"TimeStamp": 1691757932, "DeviceId": "Sensor01", "MessageType": "Alarms", "DeviceType": "Laminator", "AlarmType": "Temperature threshold breached"}),
    dynamic({"TimeStamp": 1691757932, "DeviceId": "Sensor01", "MessageType": "Foo", "ErrorType": "Unknown"})
  ];
  Raw_Stream
```

## 3 - Verify the results

To validate the results, you can run a query to verify that the data was transformed and routed to the destination tables. In the following example, the `union` operator is used to combine the source and the results from the destination tables into a single result set.

```kusto
Raw_Table | summarize Rows=count() by TableName = "Raw_Table"
| union (Device_Telemetry | summarize Rows=count() by TableName = "Device_Telemetry")
| union (Device_Alarms | summarize Rows=count() by TableName = "Device_Alarms")
| union (Error_Log | summarize Rows=count() by TableName = "Error_Log")
| sort by Rows desc
```

**Output**

You should see the following output where the Raw_Table has three rows and the destination tables have one row each.

| TableName | Rows |
|--|--|
| Raw_Table | 3 |
| Error_Log | 1 |
| Device_Alarms | 1 |
| Device_Telemetry | 1 |

## Clean up resources

Run the following command in your database to clean up the tables and functions created in this tutorial.

```kusto
.execute database script <|
  .drop table Raw_Table
  .drop table Device_Telemetry
  .drop table Device_Alarms
  .drop table Error_Log
  .drop function Get_Telemetry
  .drop function Get_Alarms
  .drop function Log_Error
```

## Related content

* [Table update policies](update-policy.md)
* [Common scenarios for using table update policies](update-policy-common-scenarios.md)
