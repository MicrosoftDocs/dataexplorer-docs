---
title: Estimate table size in Azure Data Explorer
description: Learn how to estimate table size in Azure Data Explorer.
ms.topic: reference
ms.date: 05/23/2023
---
# Measure table size in Azure Data Explorer

Understanding the size of your tables can be helpful for efficient resource management and optimized query performance.

In this article, learn how to:

* [Estimate the original size of ingested data](#estimate-the-original-size-of-ingested-data): Understand the amount of data being ingested into your tables to help you make informed decisions about resource management and capacity planning.

* [Estimate table size in terms of access bytes](#estimate-table-size-in-terms-of-access-bytes): Understand the impact of different query patterns on data access to help you make informed decisions about indexing, partitioning, and data organization strategies.

## Estimate the original size of ingested data

Use the [.show table details](kusto/management/show-table-details-command.md) to estimate the original data size of a table.

This command provides an estimation of the uncompressed size of data ingested into your table based on the assumption that the data was transferred in CSV format. This estimation takes into account the approximate lengths of numeric values, such as integers, longs, datetimes, and guids, by considering their string representations. By using this approach, the command quickly calculates an overview of the data size.

For an example, see [Use .show table details](#use-show-table-details).

## Estimate table size in terms of access bytes

Use the [estimate_data_size()](kusto/query/estimate-data-sizefunction.md) function to estimate table size based on data types and their respective byte sizes.

This function returns an estimated data size in bytes of selected columns. To get the estimate for the entire table, use the [sum()](kusto/query/sum-aggfunction.md) aggregation function. This method provides a more precise estimation by considering the byte sizes of numeric values without formatting them as strings. For example, integer values require 4 bytes whereas long and datetime values require 8 bytes. By using this approach, you can accurately estimate the data size that would fit in memory and gain a deeper understanding of the data's storage requirements.

For an example, see [Use estimate_data_size()](#use-estimate_data_size).

### Work with multiple tables

You can use the [union](kusto/query/unionoperator.md) operator along with the [estimate_data_size()](kusto/query/estimate-data-sizefunction.md) function to estimate the combined data size of multiple tables.

This approach may inflate the estimated data input due to empty columns. The inflation occurs because `union` creates a super-set of all columns from the specified tables, and `estimate_data_size()` calculates the data size even considering empty columns. This approach offers insight into the memory footprint required if all data from the tables were combined.

For an example, see [Use union with estimate_data_size()](#use-union-with-estimate_data_size).

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
> To format the bytes result to `MB`, `GB`, or another unit, use [format_bytes()](kusto/query/format-bytesfunction.md).

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
