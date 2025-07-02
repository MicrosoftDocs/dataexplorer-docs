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
| *OutputSchema* | | | Specify the column names and types for the `bag_unpack` plugin output. For syntax information, see [Output schema syntax](#output-schema-syntax), and to understand the implications, see [Performance considerations](#performance-considerations). |

### Output schema syntax

`(` *ColumnName* `:` *ColumnType* [`,` ...] `)`

Use a use a wildcard `*` as the first parameter to include all columns of the source table in the output, as follows:

`(` `*` `,` *ColumnName* `:` *ColumnType* [`,` ...] `)`

## Performance considerations

Using the plugin without an *OutputSchema* can have severe performance implications in large datasets and should be avoided.

Providing an *OutputSchema* allows the query engine to optimize the query execution, as it can determine the output schema without needing to parse and analyze the input data. This is beneficial when the input data is large or complex. See the [Examples with performance implications](#examples-with-performance-implications) of using the plugin with and without a defined *OutputSchema*.

## Returns

The `bag_unpack` plugin returns a table with as many records as its tabular input (*T*). The schema of the table is the same as the schema of its tabular input with the following modifications:

* The specified input column (*Column*) is removed.
* The name of each column corresponds to the name of each slot, optionally prefixed by *OutputColumnPrefix*.
* The type of each column is either the type of the slot, if all values of the same slot have the same type, or `dynamic`, if the values differ in type.
* The schema is extended with as many columns as there are distinct slots in the top-level property bag values of *T*.

> [!NOTE]
>
> * If you don't specify the *OutputSchema*, the plugin output schema varies based on the input data values. Multiple executions of the plugin with different data inputs can produce different output schemas.
> * If an *OutputSchema* is specified, the plugin returns only the columns defined in the [Output schema syntax](#output-schema-syntax), unless a wildcard `*` is used.
> * To return all columns of the input data, and the columns defined in the *OutputSchema*, use a wildcard `*` in the *OutputSchema*.

Tabular schema rules apply to the input data. In particular:

* An output column name can't be the same as an existing column in the tabular input *T*, unless it's the column to unpack (*Column*). Otherwise, the output includes two columns with the same name.
* All slot names, when prefixed by *OutputColumnPrefix*, must be valid entity names and follow the [identifier naming rules](schema-entities/entity-names.md#identifier-naming-rules).

The plugin ignores null values.

## Examples

The examples in this section show how to use the syntax to help you get started.

**Expand a bag**:

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

**Expand a bag and use the `OutputColumnPrefix` option to produce column names with a prefix**:

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

**Expand a bag and use the `columnsConflict` option to resolve a column conflict between the dynamic column and the existing column**:

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

**Expand a bag and use the `ignoredProperties` option to ignore 2 of the properties in the property bag**:

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

**Expand a bag and use the *OutputSchema* option**:

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

**Expand a bag with an *OutputSchema* and use the wildcard `*` option**:

This query returns the original slot *Description* and the columns defined in the *OutputSchema*.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WPMQvCMBCF90L%2Fw5EplQyiTtmETh266CYi1%2BRog%2B21tGlB1P9upKKD9N5yB%2Fe9x7Pog4qapNX2xtg4oyClwfSu865lDYPvHZdJHJ3iCMJ8vuRd5NiQ0CCytmKhQOzLcG7WzyTsBz9aYi%2FUEpTiRF9oN0NHQlNRvwxlODSOf9z2L%2BwcRw%2BgCesRPUGB5WXkDs1V2gQ0yJWCt5eeSykILrpuQ70X00Yl8ggBAAA%3D" target="_blank">Run the query</a>
::: moniker-end

```kusto
datatable(d:dynamic, Description: string)
[
    dynamic({"Name": "John", "Age":20, "height":180}), "Student",
    dynamic({"Name": "Dave", "Age":40, "height":160}), "Teacher",
    dynamic({"Name": "Jasmine", "Age":30, "height":172}), "Student",
]
| evaluate bag_unpack(d) : (*, Name:string, Age:long)
```

**Output**

|Description|Name|Age|
|---|---|---|
|Student|John|20|
|Teacher|Dave|40|
|Student|Jasmine|30|

### Examples with performance implications

**Expand a bag with and without a defined *OutputSchema* to compare performance implications**:

 This example uses a publicly available table in the [help cluster](https://dataexplorer.azure.com/clusters/help/). In the *ContosoSales* database, there's a table called *SalesDynamic*. The table contains sales data and includes a dynamic column named **Customer_Properties**.

:::image type="content" source="media/plugin/salesdynamic-unpack-bag-plugin.png" alt-text="A screenshot of the SalesDynamic table with the customer properties column highlighted":::

* **Example with no output schema**: The first query doesn't define an *OutputSchema*. The query takes **5.84** seconds of CPU and scans **36.39** MB of data.

    :::moniker range="azure-data-explorer"
    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAAx2MwQmAMAwA%2F06Rp4Ir%2BBAdQOgAEiVI0bSSJkLF4a3%2B7uA4hwelMQdkv1YP0IWHoRIsuM0WTlz3erCkkUnmSeJJop5SA6VNxozibwL3Tbri9U89RwvawJJh%2BEhyC07L9QVtLQjnbQAAAA%3D%3D">Run the query</a>
    ::: moniker-end

    ```kusto
    SalesDynamic
    | evaluate bag_unpack(Customer_Properties) 
    | summarize Sales=sum(SalesAmount) by Country, State
    ```

* **Example with output schema**: The second query does provide an *OutputSchema*. The query takes **0.45** seconds of CPU and scans **19.31** MB of data. The query doesn't have to analyze the input table, saving on processing time.

    :::moniker range="azure-data-explorer"
    > [!div class="nextstepaction"]
    > <a href="https://dataexplorer.azure.com/clusters/help/databases/ContosoSales?query=H4sIAAAAAAAAAz2NQQrDMAwE732FjnbJCwI9BPcBBT8gKEEE09gOklxw6ePrlCa3HZad9biS3GvCGObLB%2BiFa0ElmHAZS9pwfhpXRHMkHh%2BcN2INJBZ6AHPtwOWSlGsvyiEtHXht45Nc0KOyTS4lRuTwJvD7662x%2BaUh7hoLUz2Ef9MXJDzTMp4AAAA%3D" target="_blank">Run the query</a>
    ::: moniker-end

    ```kusto
    SalesDynamic
    | evaluate bag_unpack(Customer_Properties) :  (*, Country:string, State:string, City:string)
    | summarize Sales=sum(SalesAmount) by Country, State
    ```

**Output**

The output is the same for both queries. The first 10 rows of the output are shown below.

| Canada | British Columbia | 56,101,083 |
|--|--|--|
| United Kingdom | England | 77,288,747 |
| Australia | Victoria | 31,242,423 |
| Australia | Queensland | 27,617,822 |
| Australia | South Australia | 8,530,537 |
| Australia | New South Wales | 54,765,786 |
| Australia | Tasmania | 3,704,648 |
| Canada | Alberta | 375,061 |
| Canada | Ontario | 38,282 |
| United States | Washington | 80,544,870 |
| ... | ... | ... |

## Related content

* [parse_json function](./parse-json-function.md)
* [mv-expand operator](./mv-expand-operator.md)
