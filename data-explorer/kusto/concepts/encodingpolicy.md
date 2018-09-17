---
title: Encoding policy - Azure Data Explorer | Microsoft Docs
description: This article describes Encoding policy in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Encoding policy

Columns of data held in the Kusto columnar store are subject to an encoding policy,
which defines how the data is encoded, compressed, and indexed. Kusto applies a default
encoding policy according to the column's data type, and normally there's no need
to modify the encoding type.

In some specific scenarios, however, it is useful to modify the default column's
encoding policy. This can be used to do a fine-control over the performance/COGS
trade-off. Some common examples are:

1. The default indexing applied to `string` columns is built for term searches.
   If users only query for the specific values in the column, COGS might be reduced
   if the index is simplified.
2. Contrariwise, if users commonly use a `contains` predicate over values of that
   column, it might prove useful (in terms of query performance) to create a full
   substring index.
3. COGS might be reduced if rarely-used columns are compressed using a non-default
   compression scheme (e.g., switch from using LZ4 to Brotli or even LZMA), which
   comes at the trade-off of compression/decompression performance.