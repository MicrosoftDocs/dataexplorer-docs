---
title:  bag_unpack plugin
description: Learn how to use the bag_unpack plugin to unpack a dynamic column.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/01/2025
---
# bag_unpack plugin

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The `bag_unpack` plugin unpacks a single column of type `dynamic`, by treating each property bag top-level slot as a column. The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator.

## Syntax

*T* `|` `evaluate` `bag_unpack(` *Column* [`,` *OutputColumnPrefix* ] [`,` *columnsConflict* ] [`,` *ignoredProperties* ] `)` [`:` *OutputSchema*]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required| Description |
|---|---|---|---|
| *T* | `string` |  :heavy_check_mark: | The tabular input whose column *Column* is to be unpacked. |
| *Column* | `dynamic` |  :heavy_check_mark: | The column of *T* to unpack. |
| *OutputColumnPrefix* | `string` | | A common prefix to add to all columns produced by the plugin. |
| *columnsConflict* | `string` | | The direction for column conflict resolution. Valid values: <br />`error` - Query produces an error (default)<br />`replace_source` - Source column is replaced<br />`keep_source` - Source column is kept |
| *ignoredProperties* | `dynamic` | | An optional set of bag properties to be ignored. } |
| *OutputSchema* | | | Specify the column names and types for the `bag_unpack` plugin output. For syntax information, see [Output schema syntax](#output-schema-syntax). |

### Output schema syntax

`(` *ColumnName* `:` *ColumnType* [`,` ...] `)`

Use a use a wildcard `*` as the first parameter to include all columns of the source table in the output, as follows:

`(` `*` `,` *ColumnName* `:` *ColumnType* [`,` ...] `)`

## Performance considerations

> [!IMPORTANT]
>
* Using the plugin without an *OutputSchema* can have severe performance implications in large datasets and should be avoided.
>
> * Using the wildcard `*` in the *OutputSchema* can lead to significant performance improvements, as the query engine doesn't have to retrieve the input schema.

## Returns

The `bag_unpack` plugin returns a table with as many records as its tabular input (*T*). The schema of the table is the same as the schema of its tabular input with the following modifications:

* The specified input column (*Column*) is removed.
* The schema is extended with as many columns as there are distinct slots in
  the top-level property bag values of *T*. The name of each column corresponds
  to the name of each slot, optionally prefixed by *OutputColumnPrefix*. Its
  type is either the type of the slot, if all values of the same slot have the
  same type, or `dynamic`, if the values differ in type.

## Remarks

If you don't specify the *OutputSchema*, the plugin output schema varies based on the input data values. Multiple executions of the plugin with different data inputs can produce different output schemas.

Tabular schema rules apply to the input data. In particular:

* An output column name can't be the same as an existing column in the tabular input *T*, unless it's the column to unpack (*Column*). Otherwise, the output includes two columns with the same name.

All slot names, when prefixed by *OutputColumnPrefix*, must be valid entity names and follow the [identifier naming rules](schema-entities/entity-names.md#identifier-naming-rules).

* The plugin ignores null values.

## Examples

#### Expand a bag

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjRSrlMq8xNzMZE2uaC4FIIByNaqV/BJzU5WsFJS88jPylHQUlBzTgVwjg1pNHRwKXRLLUuEKTfAo9Eoszs3MQ6g1BquN5apRSC1LzClNLElVSEpMjy/NK0hMztZI0QQABlsx468AAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(d:dynamic)
[
    dynamic({"Name": "John", "Age":20}),
    dynamic({"Name": "Dave", "Age":40}),
    dynamic({"Name": "Jasmine", "Age":30}),
]
| evaluate bag_unpack(d)
```

**Output**

|Age|Name   |
|---|-------|
|20 |John   |
|40 |Dave   |
|30 |Jasmine|

### Expand a bag with `OutputColumnPrefix` to add the prefix 'Property_'

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjRSrlMq8xNzMZE2uaC4FIIByNaqV/BJzU5WsFJS88jPylHQUlBzTgVwjg1pNHRwKXRLLUuEKTfAo9Eoszs3MQ6g1BquN5apRSC1LzClNLElVSEpMjy/NK0hMztZI0VFQDyjKL0gtKqmMV9cEAG0gI1O8AAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(d:dynamic)
[
    dynamic({"Name": "John", "Age":20}),
    dynamic({"Name": "Dave", "Age":40}),
    dynamic({"Name": "Jasmine", "Age":30}),
]
| evaluate bag_unpack(d, 'Property_')
```

**Output**

|Property_Age|Property_Name|
|------------|-------------|
|20          |John         |
|40          |Dave         |
|30          |Jasmine      |

#### Expand a bag with `columnsConflict` to resolve column conflicts

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA43NsQrCMBAG4L1PcWRJC4WKOhUcRKcOOjmJlGty1mKalCapiPrupgq69m66/+fjJLqwlaJ4hy3l1vWNrlOQubxrbBuRRMcIwvC9kmVIiIfyW8UPNhqWAyvMRbMU2LoO53z2StIJaIsD/dByIirQto3+u8XHnaIn0IDKoyOosC697lBcY5mCMMq32m6MPqtGuBXvqVMoqLTG94J4AlkGB0ug6Qbj2zdNIgveEgEAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(Name:string, d:dynamic)
[
    'Old_name', dynamic({"Name": "John", "Age":20}),
    'Old_name', dynamic({"Name": "Dave", "Age":40}),
    'Old_name', dynamic({"Name": "Jasmine", "Age":30}),
]
| evaluate bag_unpack(d, columnsConflict='replace_source') // Use new name
```

**Output**

|Age|Name   |
|---|-------|
|20 |John   |
|40 |Dave   |
|30 |Jasmine|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA43NzwqCQBAG8LtPMexlFQSjOgkdok4G9QARMu5OJu4fcV0hqndvLairM6f5Pn6MxCFspSg+oqbcDX1j6hRkLu8GdSOS6BxBGH5SsgwJ8VB+q/jBJsNyYIW9GZYC29bhXC5eSToD7XGkH1rPRAU63Zi/W33cJXoCjag8DgQV1qU3HYo2likIq7w2bmfNVTVi2PCWqCud9b0gnkCWwSEEYJWE6ekb9wh0nRABAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(Name:string, d:dynamic)
[
    'Old_name', dynamic({"Name": "John", "Age":20}),
    'Old_name', dynamic({"Name": "Dave", "Age":40}),
    'Old_name', dynamic({"Name": "Jasmine", "Age":30}),
]
| evaluate bag_unpack(d, columnsConflict='keep_source') // Keep old name
```

**Output**

|Age|Name     |
|---|---------|
|20 |Old_name |
|40 |Old_name |
|30 |Old_name |

#### Expand a bag with `ignoredProperties` to ignore certain properties in the property bag.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3XOPQ+CMBAG4J1fcekCJDUoOJE4mLjIYNwJMQe9IBEKaYHEqP/d8iFOtMt76dsnJ7A1Ny3JEaF4SqyKzLViC8yZR+fFLlgRC4FF9V0yDuyYm9HfDkkIRVoPj3Pc7Bh8XL4inLCnRdivCD5bByLUVSH/RrBiBKORWJ4H51zWisA2fRtQCpOmkg2NqhtSbUHaegP1WHbYEqSY3zrZYPZwBIdi/C6uS/Xw2ypeID7piet+AWW2HHFQAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(d:dynamic)
[
    dynamic({"Name": "John", "Age":20, "Address": "Address-1" }),
    dynamic({"Name": "Dave", "Age":40, "Address": "Address-2"}),
    dynamic({"Name": "Jasmine", "Age":30, "Address": "Address-3"}),
]
// Ignore 'Age' and 'Address' properties
| evaluate bag_unpack(d, ignoredProperties=dynamic(['Address', 'Age']))
```

**Output**

|Name|
|---|
|John|
|Dave|
|Jasmine|

#### Expand a bag with an *OutputSchema* to evaluate query optimization

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUjRSrlMq8xNzMZE2uaC4FIIByNaqV/BJzU5WsFJS88jPylHQUlBzTgVwjg1pNHRwKXRLLUuEKTfAo9Eoszs3MQ6g1BquN5apRSC1LzClNLElVSEpMjy/NK0hMztZI0VSwUtAA6bUqLinKzEvXUQDqssrJz0vXBADtklvGyQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(d:dynamic)
[
    dynamic({"Name": "John", "Age":20}),
    dynamic({"Name": "Dave", "Age":40}),
    dynamic({"Name": "Jasmine", "Age":30}),
]
| evaluate bag_unpack(d) : (Name:string, Age:long)
```

**Output**

|Name  |Age  |
|---------|---------|
|John     |  20  |
|Dave     |  40  |
|Jasmine  |  30  |

#### Expand a bag using a wildcard `*` in the *OutputSchema* to return all columns of the input table

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WPMQvCMBCF90L%2Fw5EplQyiTtmETh266CYi1%2BRog%2B21tGlB1P9upKKD9N5yB%2Fe9x7Pog4qapNX2xtg4oyClwfSu865lDYPvHZdJHJ3iCMJ8vuRd5NiQ0CCytmKhQOzLcG7WzyTsBz9aYi%2FUEpTiRF9oN0NHQlNRvwxlODSOf9z2L%2BwcRw%2BgCesRPUGB5WXkDs1V2gQ0yJWCt5eeSykILrpuQ70X00Yl8ggBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(d:dynamic, Description: string)
[
    dynamic({"Name": "John", "Age":20}), "Student",
    dynamic({"Name": "Dave", "Age":40}), "Teacher",
    dynamic({"Name": "Jasmine", "Age":30}), "Student",
]
| evaluate bag_unpack(d) : (*, Name:string, Age:long)
```

**Output**

|Description|Name|Age|
|---|---|---|
|Student|John|20|
|Teacher|Dave|40|
|Student|Jasmine|30|

#### Expand a bag and compare performance implications with and without an *OutputSchema*

[!INCLUDE [help-cluster-note](../includes/help-cluster-note.md)]

This query gets the input schema.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WNsQ7CMAxEd74iW1OJX%2BhE2djKXrnBhKiJXcVORREfT1sJNrbT6e69Tjmn84ykYg5vgzPEAopmAN8XmsCNttsmXUkJ8nI0jmNJJCemewxOm2pEnHrhkh1W9R9EiwohSr0rnop0Mxd2oIGpURbNgbz9NhtEdl144ZbslRViCwk8roxh%2BZ3XpUcV98AEH51zzT%2FKAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents 
| evaluate bag_unpack(StormSummary, columnsConflict='keep_source')
| evaluate bag_unpack(Details) 
| extend Location=tostring(Location)
| summarize sum(TotalDamages) by Location
| getschema
```

**Output**

| ColumnName | ColumnOrdinal | DataType | ColumnType |
|--|--|--|--|
| Location | 0 | System.String | string |
| sum_TotalDamages | 1 | System.Int64 | long |

This query uses 0.25 seconds of CPU and scans 8.92 MB of data.

XXXX

This query uses 0.0156 seconds of CPU and scans 2.97 MB of data.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WOMQ7CMAxFd06RrUVC3KATZWMre%2BUGE0VN7Cp2qhZxeAgSqGyW3%2Fv275RTPM9IKmb3NDhDyKBoBnB9pgnsWHdF6XKMkNaDsRxyJDkx3YO32lQj4tQL52Sx2pcTiyLdzIUtqGdqlEWTJ1e3qOCDHL9kI19ZIbQQwaG8Awkh1NtdUeXTwD%2BwTP%2FUDOvv3wv5ySPz0QAAAA%3D%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| evaluate bag_unpack(StormSummary, columnsConflict='keep_source')
| extend Location=tostring(Details.Location)
| extend TotalDamages=toreal(TotalDamages)
| summarize sum(TotalDamages) by Location
```

**Output**

The output shows the first 10 rows of the result set.

| Location | sum_TotalDamages |
|--|--|
| ATLANTIC SOUTH | 0 |
| FLORIDA | 379,455,260 |
| GEORGIA | 1,190,448,750 |
| MISSISSIPPI | 802,890,160 |
| AMERICAN SAMOA | 520,000 |
| KENTUCKY | 111,727,200 |
| OHIO | 417,989,500 |
| KANSAS | 738,830,000 |
| MICHIGAN | 168,351,500 |
| ALABAMA | 299,875,250 |
| ... | ... |

## Related content

* [parse_json function](./parse-json-function.md)
* [mv-expand operator](./mv-expand-operator.md)
