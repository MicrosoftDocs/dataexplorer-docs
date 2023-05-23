---
title: Estimate table size in Azure Data Explorer
description: Learn how to estimate table size in Azure Data Explorer.
ms.topic: reference
ms.date: 05/23/2023
---
# Estimate table size in Azure Data Explorer

To effectively manage resources and optimize query performance, it's helpful to understand the size of your tables. This document explains various methods to estimate table size using [Kusto Query Language (KQL)](kusto/query/index.md).

## Estimate table size

The [.show table details](kusto/management/show-table-details-command.md) command is a straightforward and reliable way to estimate the original data size of a table. The command provides an estimation based on the assumption that the data was transferred in CSV format. This assumption means that the command takes into account the approximate lengths of numeric values, such as integers, longs, datetimes, and guids to quickly get an overview of the data size.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9MrzsgvVyhJTMpJVQguyS/KdS1LzSspVkhJLUnMzCnmqlEoKMrPSk0uUQjJL0nM8S/KTM/MS8wJzqxKBQAIuj6COwAAAA==" target="_blank">Run the query</a>

```kusto
.show table StormEvents details
| project TotalOriginalSize
```

## Estimate table size based on bytes of actual data types

To estimate the data size based on the actual data types and their respective byte sizes, you can use the estimate data size function in combination with the sum and format_bytes operators. This method provides a more precise estimation by considering the byte sizes of numeric values without formatting them as strings. For example, integers require 4 bytes, while longs, doubles, and datetimes require 8 bytes. By using this approach, you can accurately estimate the data size that would fit in memory and gain a deeper understanding of the data's storage requirements.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRSK0oSc1LUSjOrEpNLS5RsFUAkpm5iSWp8SmJJYnxIHENLU2gwuLS3NzEIiAXxNKAqtdENcHdCWhAGtD4xJL4pMqS1GINoNp4qFodIx0ldyclTQDsmXiFgAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| extend sizeest = estimate_data_size(*)
| summarize sum(sizeest)
| extend sizeGB = format_bytes(sum_sizeest,2,"GB")
```

## How should I measure the size of my table?

We recommend using [.show table details](kusto/management/show-table-details-command.md) command. Nonetheless, the choice of method depends on your specific use case and the information you seek to obtain. Whether you need to estimate the original data size, assess the combined data size from multiple tables, or consider byte sizes of actual data types, these methods provide valuable insights into the size of your tables in Azure Data Explorer.
