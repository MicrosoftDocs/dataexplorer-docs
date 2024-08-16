---
title: include file
description: include file
ms.topic: include
ms.reviewer: adieldar
ms.date: 08/11/2024
---

## Optimizing performance

For enhanced performance and reduced storage requirements when using this function, consider using the `Vector16` encoding policy for storing floating-point vectors that don't require 64 bits precision, such as ML vector embeddings. The `Vector16` profile, which utilizes the [Bfloat16](https://en.wikipedia.org/wiki/Bfloat16_floating-point_format) floating-point representation, can significantly optimize the operation and reduce storage size by a factor of 4. For more details on the `Vector16` encoding policy, refer to the [Encoding Policy Types](../management/alter-encoding-policy.md#encoding-policy-types).
