---
title: Estimate table size in Azure Data Explorer
description: Learn how to estimate table size in Azure Data Explorer.
ms.topic: reference
ms.date: 05/23/2023
---
# Estimate table size in Azure Data Explorer

Understanding the size of your tables can be helpful for efficient resource management and optimized query performance.

In this article, learn how to:

* [Estimate the original size of ingested data](#estimate-the-original-size-of-ingested-data): By understanding the amount of data being ingested into your tables, this method can help you make informed decisions about resource management and capacity planning.

* [Estimate table size in terms of access bytes](#estimate-table-size-in-terms-of-access-bytes): By understanding the impact of different query patterns on data access, this method can help you make informed decisions about indexing, partitioning, and data organization strategies.

## Estimate the original size of ingested data

Use the [.show table details](kusto/management/show-table-details-command.md) to estimate the original data size of a table.

The command provides an estimation of the uncompressed size of data ingested into your table based on the assumption that the data was transferred in CSV format. This estimation takes into account the approximate lengths of numeric values, such as integers, longs, datetimes, and guids, by considering their string representations. By using this approach, the command quickly calculates an overview of the data size.

### Example

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

## Estimate table size in terms of access bytes

To estimate the data size based on data types and their respective byte sizes, use the [estimate_data_size()](kusto/query/estimate-data-sizefunction.md) function. This function returns an estimated data size in bytes of selected columns. To get the estimate for the entire table, use the [sum()](kusto/query/sum-aggfunction.md) aggregation function.

This method provides a more precise estimation by considering the byte sizes of numeric values without formatting them as strings. For example, integer values require 4 bytes whereas long and datetime values require 8 bytes. By using this approach, you can accurately estimate the data size that would fit in memory and gain a deeper understanding of the data's storage requirements.

### Example

The following query estimates the original data size of the `StormEvents` table in bytes.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRSK0oSc1LUSjOrEp1LS7JzE0sSfVPc87PKc3NU7BVSIUKxackliTGgxRpaGkCdRWX5uYmFgG5CiX5JYk5wUCWLVBMA5sxmgAfUpgYcQAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| extend sizeEstimateOfColumn = estimate_data_size(*)
| summarize totalSize=sum(sizeEstimateOfColumn)
```

**Output**

|totalOriginalSize|
|--|
|58608932|

> [!NOTE]
> The output is smaller even though the calculation is done over the same table. This is because this method provides a more precise estimation by considering the byte sizes of numeric values without formatting them as strings.
