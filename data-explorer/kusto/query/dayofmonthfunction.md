---
title: dayofmonth() - Azure Data Explorer
description: This article describes dayofmonth() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# dayofmonth()

Returns an integer representing the day number of the given datetime.

## Syntax

`dayofmonth(`*date*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | datetime | &check; | The datetime used to extract the day number.|

## Returns

An integer representing the day number of the given datetime.

## Example

<a href="https://dataexplorer.azure.com/clusters/kvc9rf7q4d68qcw5sk2d6f.northeurope/databases/MyDatabase?query=H4sIAAAAAAAAAysoyswrUUhJrMxPy83PK8nQSEksSS3JzE3VMDIwNNU1NNI1NNHUBAAj3TtIJgAAAA==" target="_blank">Run the query</a>

```kusto
dayofmonth(datetime(2015-12-14))
```

|result|
|--|
|14|
