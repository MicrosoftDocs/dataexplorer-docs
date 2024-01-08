---
title:  The guid data type
description: This article describes The guid data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/08/2024
---
# The guid data type

The `guid` data type represents a 128-bit globally-unique value.

> The `guid`, `uuid`, and `uniqueid` data types are equivalent.

## `guid` literals

To specify a `guid` literal, use one of the following syntax options:

|Value|Example|
|--|--|
|`guid(`*id*`)`|`guid(74be27de-1e4e-49d9-b579-fe0b331d3642)`|A guid ID string.|
|`guid(null)`||Represents the [null value](null-values.md).|

## Related content

* [toguid()](../../query/toguidfunction.md)
