---
title:  The guid data type
description:  This article describes The guid data type.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# The guid data type

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../../includes/applies-to-version/sentinel.md)]

The `guid` data type represents a 128-bit globally unique value.

> The `guid`, `uuid`, and `uniqueid` data types are equivalent.

## `guid` literals

To specify a `guid` literal, use one of the following syntax options:

|Syntax|Description|Example|
|--|--|--|
|`guid(`*id*`)`|A guid ID string.|`guid(74be27de-1e4e-49d9-b579-fe0b331d3642)`|
|`guid(null)`|Represents the [null value](null-values.md).||

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Related content

* [toguid()](../toguid-function.md)
