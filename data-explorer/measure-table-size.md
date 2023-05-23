---
title: Estimate table size in Azure Data Explorer
description: Learn how to estimate table size in Azure Data Explorer.
ms.topic: reference
ms.date: 05/23/2023
---
Understanding the size of your tables can be helpful for efficient resource management and optimized query performance.

In this article, learn how to:

* [Estimate the original size of ingested data](#estimate-the-original-size-of-ingested-data): By understanding the amount of data being ingested into your tables, this method can help you make informed decisions about resource management and capacity planning.

* [Estimate table size in terms of access bytes](#estimate-table-size-in-terms-of-access-bytes): By understanding the impact of different query patterns on data access, this method can help you make informed decisions about indexing, partitioning, and data organization strategies.


Understanding the size of your tables is helpful for efficient resource management and optimized query performance. This document outlines various approaches to estimate the uncompressed data size of ingested data in your tables.

## Estimate size of a table

The [.show table details](kusto/management/show-table-details-command.md) command is a straightforward and reliable way to estimate the original data size of a table. The command provides an estimation based on the assumption that the data was transferred in CSV format. This estimation takes into account the approximate lengths of numeric values, such as integers, longs, datetimes, and guids, by considering their string representations. By using this approach, the command quickly calculates an overview of the data size.

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

## Estimate size of a table based on data types

To estimate the data size based on the actual data types and their respective byte sizes, use the [estimate_data_size()](kusto/query/estimate-data-sizefunction.md) function. This function returns an estimated data size in bytes of selected columns. To get the estimate for the entire table, use the [sum()](kusto/query/sum-aggfunction.md) aggregation function.

This method provides a more precise estimation by considering the byte sizes of numeric values without formatting them as strings. For example, integer values require 4 bytes whereas long and datetime values require 8 bytes. By using this approach, you can accurately estimate the data size that would fit in memory and gain a deeper understanding of the data's storage requirements.

The following query estimates the original data size of the `StormEvents` table in bytes.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRSK0oSc1LUSjOrEp1LS7JzE0sSfVPc87PKc3NU7BVSIUKxackliTGgxRpaGkCdRWX5uYmFgG5CiX5JYk5/kWZ6Zl5iTnBQBFboJwGNuM0AQfGaJJ5AAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| extend sizeEstimateOfColumn = estimate_data_size(*)
| summarize totalOriginalSize=sum(sizeEstimateOfColumn)
```

**Output**

|totalOriginalSize|
|--|
|58608932|

## Estimate size of multiple tables

To estimate the size of data in multiple tables, use the [union](kusto/query/unionoperator.md) operator combined with the [estimate_data_size()](kusto/query/estimate-data-sizefunction.md) function. The union operation combines all columns from all tables, creating a super-set of data.

In this case, the `estimate_data_size()` function may calculate the data size while considering many empty columns. With the empty columns, this method may inflate the estimated data input. Nonetheless, it can provide insight into the memory footprint in the case that all data from the specified tables were combined.

The following query estimates the data size based for the `StormEvents` and `PopulationData` tables.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22MsQ7CMAxEd77CY4v4hUzQlSKVPTLUgKXYQYlTEOLjMRIj4717d005KzzYbjW3cqYQj3hKtEchmCwXGRZSqxs45HtLaG7v0HD1Bnoa6QyVXzRUY0Gj8bLNqYlCAPqhOLsdv1K37n1VmwgWj2DZMI2Fr6yYJifBu+7fXf8Bmb5D9qUAAAA=" target="_blank">Run the query</a>

```kusto
union withsource=_TableName StormEvents, PopulationData
| extend sizeEstimateOfColumn = estimate_data_size(*)
| summarize totalOriginalSize=sum(sizeEstimateOfColumn)
```

|totalOriginalSize|
|--|
|59737411|

## Format

Then, format the information to bytes with the [format_bytes()](kusto/query/format-bytesfunction.md) function.

## How should I measure the size of my table?

We recommend using [.show table details](kusto/management/show-table-details-command.md) command. Nonetheless, the choice of method depends on your specific use case and the information you seek to obtain. Whether you need to estimate the original data size, consider byte sizes of actual data types, or assess the combined data size from multiple tables, these methods provide valuable insights into the size of your tables in Azure Data Explorer.
