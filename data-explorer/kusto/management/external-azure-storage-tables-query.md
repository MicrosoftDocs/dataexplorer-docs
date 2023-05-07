---
title: Query Azure Storage external tables - Azure Data Explorer
description: This article describes how to query external tables based on Azure Storage tables.
ms.topic: reference
ms.date: 05/07/2023
---

# Query Azure Storage external tables

In Azure Data Explorer, you can use [Kusto Query Language (KQL)](../query/index.md) to query external tables stored in Azure Storage. Azure Storage external tables can be queried in the same way as you would query a regular table in Azure Data Explorer.

## How it works

When you create an external table, you provide one or more connection strings that are paths to Azure Blob Storage blob containers. When you write a query against the external table, the blobs in the specified containers are enumerated, and each one is scanned to answer the query.

## Partitioning

When you write a query against An Azure Storage external table, partitioning is taken into account. This means that only blobs containing data that satisfies the query conditions are accessed, rather than the entire dataset. Partitioning reduces the amount of data that needs to be processed and improves query performance.

## Optimize query performance with Parquet files

To optimize query performance for Azure Storage external tables, we recommend using the Parquet data format. Parquet files usually contain metadata, which is used by the query engine to significantly speed up query processing. With metadata, the query engine can quickly retrieve information such as count, min/max per column, and other statistics for each blob, without having to scan all of the rows. The use of metadata can significantly speed up queries, especially queries that involve aggregations or filtering.
