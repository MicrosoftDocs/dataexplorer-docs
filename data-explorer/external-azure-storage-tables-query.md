---
title: Query Azure Storage external tables - Azure Data Explorer
description: Learn how to query external tables stored in Azure Storage.
ms.topic: reference
ms.date: 05/09/2023
---

# Query Azure Storage external tables

In Azure Data Explorer, you can use [Kusto Query Language (KQL)](../query/index.md) to query external tables stored in Azure Storage. Azure Storage external tables can be queried in the same way as you would query a regular table in Azure Data Explorer.

## How it works

When you create an external table, you provide one or more connection strings that are paths to Azure Blob Storage blob containers. When you write a query against the external table, the blobs in the specified containers are enumerated, and each one is scanned to answer the query.

## Partitioning

When you write a query against an Azure Storage external table with partitioning, then only the folders matching the filters are accessed, rather than all the folders. This reduces the amount of data that needs to be processed and has a potential of significantly improving query performance.

## Optimize query performance with Parquet files

We recommend using the Parquet data format to optimize query performance for Azure Storage external tables.

* Parquet is a columnar storage format, meaning that data is stored in columns rather than rows. Queries that only need to access certain columns of the data can be much more efficient in Parquet, as only the relevant columns need to be read from Azure Storage.

* Parquet files usually include metadata, which significantly speeds up query processing. This metadata allows for rapid retrieval of essential information like column counts, minimum and maximum values, and other statistics for each data block, eliminating the need to scan through all rows.

* When running filtered queries, Parquet file metadata can be used to identify files or sections of files that contain relevant data. This ability means only the necessary data needs to be processed, which leads to faster query performance.

## Related content

* [Create an external table](external-table.md)
* [Create and alter Azure Storage external tables](kusto/management/external-tables-azure-storage.md)
