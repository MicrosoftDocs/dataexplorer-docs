---
title: todatetime() - Azure Data Explorer
description: This article describes todatetime() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/05/2023
---
# todatetime()

Converts input to [datetime](./scalar-data-types/datetime.md) scalar.

> [!NOTE]
> Prefer using [datetime()](./scalar-data-types/datetime.md) when possible.

## Syntax

`todatetime(`*value*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar | &check; | The value to convert to [datetime](./scalar-data-types/datetime.md).|

## Returns

If the conversion is successful, the result will be a [datetime](./scalar-data-types/datetime.md) value.
Else, the result will be `null`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJT0ksSS3JzE3VUDc00jUw0jUyMDJS11SwtVXALgMAakZnYjgAAAA=" target="_blank">Run the query</a>

```kusto
print todatetime('12-02-2022') == datetime('12-02-2022')
```

**Output**

|print_0|
|--|
|true|
