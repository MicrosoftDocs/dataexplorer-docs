---
title:  The guid data type
description: This article describes The guid data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/15/2020
---
# The guid data type

The `guid` data type represents a 128-bit globally-unique value.

> The `guid`, `uuid`, and `uniqueid` data types are equivalent.

## guid literals

To represent a literal of type `guid`, use the following format:

```kusto
guid(74be27de-1e4e-49d9-b579-fe0b331d3642)
```

The special form `guid(null)` represents the [null value](null-values.md).

## Related content

* [toguid()](../../query/toguidfunction.md)
