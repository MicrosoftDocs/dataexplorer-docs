---
title:  bag_pack()
description: Learn how to use the bag_pack() function to create a dynamic JSON object from a list of keys and values.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# bag_pack()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a [dynamic](scalar-data-types/dynamic.md) property bag object from a list of keys and values.

> **Deprecated aliases**: pack(), pack_dictionary()

## Syntax

`bag_pack(`*key1*`,` *value1*`,` *key2*`,` *value2*`,... )`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*key*| `string` |  :heavy_check_mark: | The key name.|
|*value*| any scalar data type |  :heavy_check_mark: | The key value.|

> [!NOTE]
> The *key* and *value* strings are an alternating list the total length of the list must be even.

## Returns

Returns a `dynamic` property bag object from the listed *key* and *value* inputs.

## Examples

**Example 1**

The following example creates and returns a property bag from an alternating list of keys and values.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhKTI8vSEzO1lDySS1LzVHSUVDyzEvLL8pNLMnMzwNxA4ryk1OLiz1dgBxDI2MToJBLYkkikIfQW1oE1lleXq6XlJmXrpecn6ukqQkA9RzT32IAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print bag_pack("Level", "Information", "ProcessID", 1234, "Data", bag_pack("url", "www.bing.com"))
```

**Results**

|print_0|
|--|
|{"Level": "Information", "ProcessID": 1234, "Data": {"url":"www.bing.com"}}|

**Example 2**

The following example creates a property bag and extract value from property bag using '.' operator.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA12PPwvCMBDF936KI1MLUfpPBaGLOLh00k2kXGsI0ZKUJqIFP7xJzFB6WR4%2F3rt7uaOxr%2B0ZxBHYOavX2LE9CGmoB0emjZBohJIzWjOtkVufNqOQPErg6nmWFyWFLE0pkJMgFDwtN9sdhfxPWd8rQoM7yykUgU8Eolv0BfYxTN6hng7IqxZ5M2D3jIkrYhfO%2BtjUxZotDHUSmx5G9WCdWeEbp%2FCbRSiYF5ca56m8XDtJA3YXAnbyBz3NWFQwAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable (
    Source: int,
    Destination: int,
    Message: string
) [
    1234, 100, "Hi", 
    4567, 200, "Hello",
    1212, 300, "Hey" 
]
| extend MyBag=bag_pack("Dest", Destination, "Text", Message)
| project-away Source, Destination, Message
| extend MyBag_Dest=MyBag.Dest, MyBag_Text=MyBag.Text
```

**Results**

|`MyBag`|`MyBag_Dest`|`MyBag_Text`|
|--|--|--|
|{"Dest":100,"Text":"Hi" }|100|Hi|
|{"Dest":200,"Text":"Hello" }|200|Hello|
|{"Dest":300,"Text":"Hey" }|300|Hey|

**Example 3**

The following example uses two tables, *SmsMessages* and *MmsMessages*, and returns their common columns and a property bag from the other columns. The tables are created ad-hoc as part of the query.

SmsMessages

|SourceNumber |TargetNumber| CharsCount |
|---|---|---|
|555-555-1234 |555-555-1212 | 46 |
|555-555-1234 |555-555-1213 | 50 |
|555-555-1212 |555-555-1234 | 32 |

MmsMessages

|SourceNumber |TargetNumber| FileSize | FileType | FileName |
|---|---|---|---|---|
|555-555-1212 |555-555-1213 | 200 | jpeg | Pic1 |
|555-555-1234 |555-555-1212 | 250 | jpeg | Pic2 |
|555-555-1234 |555-555-1213 | 300 | png | Pic3 |

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA61Sy26DMBC88xUrnxKJSmBCD604VDknikRuVVUZWIEJGGQb9aF+fG1olJgmbQ/FwmZ3Zr3MaBvUkLZqg0qxEhUkUDBtVtYgLDwwT9oNMsft0GYo70BpyUXpj8ieyRL1JWRdManW3SD0Me8t4XGESBzHN/YNabQi/nkcUhuvbs3+KzUa44D4c+Z0ybwyogS8p3uvMXI3/y73QWuWVy0KnfJ3vIbt3/qr2Ja1+JNVc1WTfhoE9qh7LO2543n43ZDLLtN4Xkr/UDp2jaauvThWRsRaez5F3gfUHRdw4KJIuBAoHdc74dhs2PiqURSwY/kBiyRj5XNvPhfkNEim1ykwfV3PDeomHIZ13mHYhMOw/jsMm1haHS8VSnR+F5JkZpKh9bKrMdcO0XdGxv9S9wkokKY3cgMAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
let SmsMessages = datatable (
    SourceNumber: string,
    TargetNumber: string,
    CharsCount: string
) [
    "555-555-1234", "555-555-1212", "46", 
    "555-555-1234", "555-555-1213", "50",
    "555-555-1212", "555-555-1234", "32" 
];
let MmsMessages = datatable (
    SourceNumber: string,
    TargetNumber: string,
    FileSize: string,
    FileType: string,
    FileName: string
) [
    "555-555-1212", "555-555-1213", "200", "jpeg", "Pic1",
    "555-555-1234", "555-555-1212", "250", "jpeg", "Pic2",
    "555-555-1234", "555-555-1213", "300", "png", "Pic3"
];
SmsMessages 
| join kind=inner MmsMessages on SourceNumber
| extend Packed=bag_pack("CharsCount", CharsCount, "FileSize", FileSize, "FileType", FileType, "FileName", FileName) 
| where SourceNumber == "555-555-1234"
| project SourceNumber, TargetNumber, Packed
```

**Results**

| SourceNumber | TargetNumber | `Packed` |
|--|--|--|--|
| 555-555-1234 | 555-555-1213 | {"CharsCount":"50","FileSize":"250","FileType":"jpeg","FileName":"Pic2"} |
| 555-555-1234 | 555-555-1212 | {"CharsCount":"46","FileSize":"250","FileType":"jpeg","FileName":"Pic2"} |
| 555-555-1234 | 555-555-1213 | {"CharsCount":"50","FileSize":"300","FileType":"png","FileName":"Pic3"} |
| 555-555-1234 | 555-555-1212 | {"CharsCount":"46","FileSize":"300","FileType":"png","FileName":"Pic3"} |

## Related content

* [pack-all function](./pack-all-function.md)
* [bag-unpack plugin](./bag-unpack-plugin.md)
