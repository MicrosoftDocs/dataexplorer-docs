---
title: Estimate table size
description: Learn how to estimate table size in Azure Data Explorer.
ms.topic: reference
ms.date: 05/29/2023
---
# Estimate table size

Understanding the size of a table can be helpful for efficient resource management and optimized query performance. In this article, you'll learn different methods to estimate table sizes and how to use them effectively.

## Original size of ingested data

Use the [.show table details](show-table-details-command.md) to estimate the original data size of a table. For an example, see [Use .show table details](#use-show-table-details).

This command provides an estimation of the uncompressed size of data ingested into your table based on the assumption that the data was transferred in CSV format. The estimation is based on approximate lengths of numeric values, such as integers, longs, datetimes, and guids, by considering their string representations.

**Example use case:** Track the size of incoming data over time to make informed decisions about capacity planning.

## Table size in terms of access bytes

Use the [estimate_data_size()](../query/estimate-data-size-function.md) along with the [sum()](../query/sum-aggregation-function.md) aggregation function to estimate table size based on data types and their respective byte sizes. For an example, see [Use estimate_data_size()](#use-estimate_data_size).

This method provides a more precise estimation by considering the byte sizes of numeric values without formatting them as strings. For example, integer values require 4 bytes whereas long and datetime values require 8 bytes. By using this approach, you can accurately estimate the data size that would fit in memory.

**Example use case:** Determine the cost of a query in terms of bytes to be scanned.

## Combined size of multiple tables

You can use the [union](../query/unionoperator.md) operator along with the [estimate_data_size()](../query/estimate-data-size-function.md) and [sum()](../query/sum-aggregation-function.md) functions to estimate the combined size of multiple tables in terms of access bytes. For an example, see [Use union with estimate_data_size()](#use-union-with-estimate_data_size).

**Example use case:** Assess the memory requirements for consolidating data from multiple tables into a single dataset.

> [!NOTE]
> This approach may inflate the estimated data size due to empty columns, as `union` combines all columns from the specified tables and `estimate_data_size()` takes into account empty columns when calculating the data size.

## Examples

### Use .show table details

The following query estimates the original data size of the `StormEvents` table.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9MrzsgvVyhJTMpJVQguyS/KdS1LzSspVkhJLUnMzCnmqlEoKMrPSk0uUQjJL0nM8S/KTM/MS8wJzqxKBQAIuj6COwAAAA==" target="_blank">Run the query</a>

```kusto
.show table StormEvents details
| project TotalOriginalSize
```

**Output**

|TotalOriginalSize|
|--|
|60192011|

> [!TIP]
> To format the bytes result to `MB`, `GB`, or another unit, use [format_bytes()](../query/format-bytes-function.md).

### Use estimate_data_size()

The following query estimates the original data size of the `StormEvents` table in bytes.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRSK0oSc1LUSjOrEp1LS7JzE0sSfVPc87PKc3NU7BVSIUKxackliTGgxRpaGkCdRWX5uYmFgG5CiX5JYk5wUCWLVBMA5sxmgAfUpgYcQAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| extend sizeEstimateOfColumn = estimate_data_size(*)
| summarize totalSize=sum(sizeEstimateOfColumn)
```

**Output**

|totalSize|
|--|
|58608932|

> [!NOTE]
> The output is smaller even though the calculation is done over the same table. This is because this method provides a more precise estimation by considering the byte sizes of numeric values without formatting them as strings.

### Use union with estimate_data_size()

The following query estimates the data size based for all tables in the `Samples` database.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22NvQrCQBCEe59iSXUXUtlfE5F0WsT+2JgNHtwP3O2hCT68K4gg2M0MM9/U6FKEu+NbSTVfydgLTp5OGAja3RPowRRnKG6jY2EXkOm8HJKvIYIB+kR2Rkb7LqlWy6rUEDCLBU6MfhRlJFP/MPr3ZeiFu6QsFTutTEV9Ed2+a4a+0S/ACKQBtAAAAA==" target="_blank">Run the query</a>

```kusto
union withsource=_TableName *
| extend sizeEstimateOfColumn = estimate_data_size(*)
| summarize totalSize=sum(sizeEstimateOfColumn)
| extend sizeGB = format_bytes(totalSize,2,"GB")
```

|totalSize|sizeGB|
|--|--|
|1761782453926|1640.79 GB|
