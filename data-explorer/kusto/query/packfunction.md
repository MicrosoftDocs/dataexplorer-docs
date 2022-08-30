---
title: bag_pack(), pack() - Azure Data Explorer
description: This article describes bag_pack() and pack() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/30/2022
---
# bag_pack(), pack()

Creates a `dynamic` JSON object (property bag) from a list of keys and values.

This is an alias to `pack_dictionary()` function.

> [!NOTE]
> The `bag_pack()` and `pack()` functions are interpreted equivalently.

## Syntax

`bag_pack(`*key1*`,` *value1*`,` *key2*`,` *value2*`,... )`

`pack(`*key1*`,` *value1*`,` *key2*`,` *value2*`,... )`

## Arguments

| Name | Type | Required | Description |
|*key*, *value* |--| &check; | An alternating list of keys and values whose total length must be even. All keys must be non-empty constant strings.|

## Returns

Returns a `dynamic` JSON object (property bag) from the listed *key* and *value* inputs.

## Examples

This example show a property bag of keys and values.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAAysoyswrUUhKTI8vSEzO1lDySS1LzVHSUVDyzEvLL8pNLMnMzwNxA4ryk1OLiz1dgBxDI2MToJBLYkkikIfQW1oE1lleXq6XlJmXrpecn6ukqQkA9RzT32IAAAA=)**\]**

```kusto
print bag_pack("Level", "Information", "ProcessID", 1234, "Data", bag_pack("url", "www.bing.com"))
```

**Results**

|print_0|
|{"Level":"Information","ProcessID":1234,"Data":{"url":"www.bing.com"}}|

This example uses pack_bag() to show all the columns and their data from 2 tables using a common number.

Ingest the following 2 tables:

SmsMessages

|SourceNumber |TargetNumber| CharsCount |
|---|---|---|
|555-555-1234 |555-555-1212 | 46 |
|555-555-1234 |555-555-1213 | 50 |
|555-555-1212 |555-555-1234 | 32 |

MmsMessages

|SourceNumber |TargetNumber| AttachmentSize | AttachmentType | AttachmentName |
|---|---|---|---|---|
|555-555-1212 |555-555-1213 | 200 | jpeg | Pic1 |
|555-555-1234 |555-555-1212 | 250 | jpeg | Pic2 |
|555-555-1234 |555-555-1213 | 300 | png | Pic3 |

Then run the following query:

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/kvc6bc487453a064d3c9de.northeurope/databases/NewDatabase1?query=H4sIAAAAAAAAA3WOOwuDQBCEe3/FcpWCKfKwtAiplYD2YdXFO8ydcg9MQn587kIguSLFwu4wO/M10kgyBkcykDyBbpbUAGfsJxrKDsfL4teUnThqc5qdsiyH75H5F6fErGAVlpvZ6Z7KFrsr1SgJJqGGUihFGiBJK2mqT1UC8L/raC32XJKyjXiQ74uFHH4c7X0JDp8Xa5EpsEQxQcgC+8pJEzRv7trJzoNyNMCKotiE2e72B/YCVizKfyMBAAA=)**\]**

```kusto
SmsMessages 
| extend Packed=bag_pack("CharsCount", CharsCount) 
| union withsource=TableName kind=inner 
( MmsMessages 
  | extend Packed=bag_pack("AttachmentSize", AttachmentSize, "AttachmentType", AttachmentType, "AttachmentName", AttachmentName))
| where SourceNumber == "555-555-1234"
```

**Results**

|TableName | SourceNumber | TargetNumber | Packed |
|--|--|--|--|
| union_arg0 | 555-555-1234 | 555-555-1212 | {"CharsCount":"46"} |
| union_arg0 | 555-555-1234 | 555-555-1213 | {"CharsCount":"50"} |
| union_arg1 | 555-555-1234 | 555-555-1212 | {"AttachmentSize":"250","AttachmentType":" jpeg ","AttachmentName":" Pic2 "} |
| union_arg1 | 555-555-1234 | 555-555-1213 | {"AttachmentSize":"300","AttachmentType":" png ","AttachmentName":" Pic3 "} |
