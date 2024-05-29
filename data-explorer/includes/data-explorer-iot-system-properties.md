---
ms.topic: include
ms.date: 06/09/2021
---
### Schema mapping examples

**Table schema mapping example**

If your data includes three columns (`Timespan`, `Metric`, and `Value`) and the properties you include are `iothub-connection-device-id` and `sequence-number`, create or alter the table schema by using this command:

```kusto
    .create-merge table TestTable (TimeStamp: datetime, Metric: string, Value: int, IotHubDeviceId:long, IotHubSequenceNumber:long)
```

**CSV mapping example**

Run the following commands to add data to the beginning of the record. Note ordinal values.

```kusto
    .create table TestTable ingestion csv mapping "CsvMapping1"
    '['
    '   { "column" : "TimeStamp", "Properties":{"Ordinal":"2"}},'
    '   { "column" : "Metric", "Properties":{"Ordinal":"3"}},'
    '   { "column" : "Value", "Properties":{"Ordinal":"4"}},'
    '   { "column" : "IotHubDeviceId", "Properties":{"Ordinal":"0"}},'
    '   { "column" : "IotHubSequenceNumber", "Properties":{"Ordinal":"1"}}'
    ']'
```
 
**JSON mapping example**

Data is added by using the system properties mapping. Run these commands:

```kusto
    .create table TestTable ingestion json mapping "JsonMapping1"
    '['
    '    { "column" : "TimeStamp", "Properties":{"Path":"$.timestamp"}},'
    '    { "column" : "Metric", "Properties":{"Path":"$.metric"}},'
    '    { "column" : "Value", "Properties":{"Path":"$.metric_value"}},'
    '    { "column" : "IotHubDeviceId", "Properties":{"Path":"$.iothub-connection-device-id"}},'
    '    { "column" : "IotHubSequenceNumber", "Properties":{"Path":"$.sequence-number"}}'
    ']'
```
