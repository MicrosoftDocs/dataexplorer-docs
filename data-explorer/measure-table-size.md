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

