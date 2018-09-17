---
title: Data Ingestion Transactional Guarantees - Azure Data Explorer | Microsoft Docs
description: This article describes Data Ingestion Transactional Guarantees in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Data Ingestion Transactional Guarantees

## Inline ingestion

### .ingest inline

1. The added extent(s), if there are any, are committed in a single transaction, upon successful completion of the command.
2. There is no case where not all created extent(s) are committed to the table - either all are committed, or none are.

## Ingest from storage

### .ingest into

1. The added extent(s), if there are any, are committed in a single transaction, upon successful completion of the command.
2. There is no case where not all created extent(s) are committed to the table - either all are committed, or none are.

## Ingest from query

### .set

1. Both the new table and the added extent(s) are committed in a single transaction, upon successful completion of the command.
2. Upon failure of table creation (e.g., if a table with the same name already exists), the table will not be added and new extent(s) will not be added.
3. Upon failure of data ingestion (e.g., there was a transient storage failure), the table will not be created and new extent(s) will not be added.
4. There is no case where not all created extent(s) are committed to the table - either all are committed, or none are.

### .append

1. The added extent(s), if there are any, are committed in a single transaction, upon successful completion of the command.
2. Upon failure in data ingestion (e.g., there was a transient storage failure), new extent(s) will not be added.
3. Upon failure in data ingestion, when the `extend_schema` option is set to `true`, the target table will still have its schema extended.
4. There is no case where not all created extent(s) are committed to the table - either all are committed, or none are.

### .set-or-append

1. If the table is created by the command (i.e., it did not already exist), it is committed regardless of the sequential data ingestion phase.
2. The added extent(s), if there are any, are committed in a single transaction, upon successful completion of the command.
3. Upon failure in data ingestion (e.g., there was a transient storage failure), new extent(s) will not be added, but the table will remain in the database.
4. Upon failure in data ingestion, when the `extend_schema` option is set to `true`, the target table will still have its schema extended.
4. There is no case where not all created extent(s) are committed to the table - either all are committed, or none are.

### .set-or-replace

1. If the table is created by the command (i.e., it did not already exist), it is committed regardless of the sequential data ingestion phase.
2. The added extent(s), if there are any, are committed in a single transaction, upon successful completion of the command.
3. Upon failure in data ingestion (e.g., there was a transient storage failure), new extent(s) will not be added, but the table will remain in the database.
4. Upon failure in data ingestion, when the `extend_schema` option is set to `true`, the target table will still have its schema extended.
5. There is no case where not all created extent(s) are committed to the table - either all are committed, or none are.