---
title: bag_pack(), pack() - Azure Data Explorer
description: This article describes bag_pack() and pack() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/30/2022
---
# bag_pack(), pack()

Creates a `dynamic` JSON object (property bag) from a list of keys and values.

Alias to `pack_dictionary()`.

> [!NOTE]
> The `bag_pack()` and `pack()` functions are interpreted equivalently.

## Syntax

`bag_pack(`*key1*`,` *value1*`,` *key2*`,` *value2*`,... )`

`pack(`*key1*`,` *value1*`,` *key2*`,` *value2*`,... )`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
|*key*,&nbsp;*value* |--| &check; | An alternating list of keys and values whose total length must be even. All keys must be non-empty constant strings.|

## Returns

Returns a `dynamic` JSON object (property bag) from the listed *key* and *value* inputs.

## Examples

**Example 1**

The following example creates and returns a property bag from an alternating list of keys and values.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhKTI8vSEzO1lDySS1LzVHSUVDyzEvLL8pNLMnMzwNxA4ryk1OLiz1dgBxDI2MToJBLYkkikIfQW1oE1lleXq6XlJmXrpecn6ukqQkA9RzT32IAAAA=)**\]**

```kusto
print bag_pack("Level", "Information", "ProcessID", 1234, "Data", bag_pack("url", "www.bing.com"))
```

**Results**

|print_0|
|--|
|{"Level":"Information","ProcessID":1234,"Data":{"url":"www.bing.com"}}|

**Example 2**

This example runs a query based on a common souce number and returns a new table with a column for the source table name and a column for the property bag.

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

The following example will create ad-hoc tables and then run the query on the tables.

**\[**[**Click to run query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA6VSQWuDMBS+C/0Pj5wUHFStO2x4GD23FPQ2xoj60Kw1lSTSbezHL9F202C7wwyavMf7fPm+7x1QQdrIDUpJK5SQQEmVXvkBwU2PnShw2zU5igepBOOVDxkVFSorua6pkOtjx9U55cHzwiFxHN+ZNwijFfFhFAehiVf3+nu7LurjJfEnZQPchkUh0X97eVw4B01r839aT0rRom6Qq5R94kw6+2jn0lva4BUh7JsPBMPl0mxvLVZm37EisBjPCxjGNi78C9f3i4Z+Lb/AIjIIN56FhQP6+QJ8V8hL2NFij2WS0+q11UeX/JpOxhPg/QA7zo4cTkzVspc8yYwBRhzYM14mjHMU52p34teQu9V8ag2xvdKspi4R27ZJhbkTsR30vAuRU40CYTw3kCTW/H0DvNexiEoDAAA=)**\]**

```kusto
let SmsMessages = datatable (SourceNumber:string, TargetNumber:string, CharsCount:string) [
"555-555-1234", "555-555-1212", "46", 
"555-555-1234", "555-555-1213", "50",
"555-555-1212", "555-555-1234", "32" 
];
let MmsMessages = datatable (SourceNumber:string, TargetNumber:string, AttachmentSize:string, AttachmentType:string, AttachmentName:string) [
"555-555-1212", "555-555-1213", "200", "jpeg", "Pic1",
"555-555-1234", "555-555-1212", "250", "jpeg", "Pic2",
"555-555-1234", "555-555-1213", "300", "png", "Pic3"
];
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
