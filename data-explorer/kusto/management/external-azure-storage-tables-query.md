---
title: Query Azure Storage external tables - Azure Data Explorer
description: This article describes how to query external tables based on Azure Storage tables.
ms.topic: reference
ms.date: 05/07/2023
---

# Query Azure Storage external tables

In Azure Data Explorer, you can use [Kusto Query Language (KQL)](../query/index.md) to query external tables stored in Azure Storage. Azure Storage external tables can be queried in the same way as you would query a regular table in Azure Data Explorer.

## How it works

When you create an external table, you provide a connection string that contains information about the blobs to access in Azure Storage. When you write a query against the external table, the blobs specified in the connection string are enumerated taking partitioning into account. This means that only blobs containing data that satisfies the query conditions are accessed, rather than the entire dataset.

## Optimize query performance with Parquet files

To optimize query performance for Azure Storage external tables, we recommend using the Parquet data format. Parquet files usually contain metadata, which is used by the query engine to significantly speed up query processing. With metadata, the query engine can quickly retrieve information such as count, min/max per column, and other statistics for each blob, without having to scan all of the rows. The use of metadata can significantly speed up queries, especially queries that involve aggregations or filtering.
