---
title:  Encoding policy
description: This article describes the encoding policy in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/28/2023
---
# Encoding policy

The encoding policy defines how data is encoded, compressed, and indexed. This policy applies to all columns of stored data. A default encoding policy is applied based on the column's data type, and a background process adjusts the encoding policy automatically if necessary.

## Scenarios

We recommend the default policy be maintained except for specific scenarios. It can be useful to modify the default column's encoding policy to fine tune control over the performance/COGS trade-off. For example:

* The default indexing applied to `string` columns is built for term searches. If you only query for specific values in the column, COGS might be reduced if the index is simplified using the encoding profile `Identifier`. For more information, see [the string data type](../query/datatypes-string-operators.md).
* Fields that are never queried on or don't need fast searches can disable indexing. You can use profile `BigObject` to turn off the indexes and increase maximal value size in dynamic or string columns.

## How it works

Encoding policy changes do not affect data that has already been ingested. Only new ingestion operations will be performed according to the new policy. The encoding policy applies to individual columns in a table, but can be set at the column level, table level (affecting all columns of the table), or database level.

## Related content

* To view the encoding policy, see [.show encoding policy](show-encoding-policy.md).
* To alter the encoding policy, see [.alter encoding policy](alter-encoding-policy.md).
