---
title: .alter column policy encoding command
description: Learn how to use the `.alter column policy encoding` command to change the encoding policy.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/20/2023
---
# .alter column policy encoding command

Alters the encoding policy. For an overview of the encoding policy, see [Encoding policy](encoding-policy.md).

> [!NOTE]
> Encoding policy changes do not affect data that has already been ingested.
> Only new ingestion operations will be performed according to the new policy.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter column` *EntityIdentifier* `policy` `encoding` [`type` `=` *EncodingPolicyType*]

> [!NOTE]
> If you omit the `type`, the existing encoding policy profile is cleared reset to the default value.

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*EntityIdentifier*| `string` | :heavy_check_mark:|The identifier for the column.|
|*EncodingPolicyType*| `string` ||The type of the encoding policy to apply to the specified column. See [encoding policy types](#encoding-policy-types) for the possible values.|

### Encoding policy types

The following table contains the possible values for the *EncodingPolicyType* parameter.

| Encoding Policy Profile | Description |
|--|--|
| `Identifier` | Suitable for columns that have data that represents ID-like information (for example, guids). This policy applies the required index for this column to gain both query performance and reduce size in the storage. |
| `BigObject` | Suitable for columns of dynamic or string type, which holds large objects. For example, the output of [hll aggregate function](../query/hll-aggregation-function.md). This policy disables the index of this column and overrides `MaxValueSize` property in the encoding Policy to 2 MB. |
| `BigObject32` | Similar to `BigObject` in terms of target scenarios. Overrides `MaxValueSize` property in the encoding Policy to 32 MB. |
| `Vector16` | This profile is designed for storing vectors of floating-point numbers in 16 bits precision utilizing the [Bfloat16](https://en.wikipedia.org/wiki/Bfloat16_floating-point_format) instead of the default 64 bits. It is highly recommended for storing ML vector embeddings as it reduces storage requirements by a factor of 4 and accelerates vector processing functions such as [series_dot_product()](../query/series-dot-product-function.md) and [series_cosine_similarity()](../query/series-cosine-similarity-function.md), by orders of magnitude. |
| `Null` | Sets the current default encoding policy to the column and clears the previous encoding policy profile. |

## Example

```kusto
.alter column Logs.ActivityId policy encoding type='identifier'
```

## Related content

* [Encoding policy](encoding-policy.md)
* [.show encoding policy](show-encoding-policy.md)
