---
title: Best practices for the Kusto Data library
description: This article describes best practices for Kusto Data client library.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# Best practices for the Kusto Data library

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

This article explains the best practices for working with the [Kusto Data library](about-kusto-data.md).

## Use a single client instance

The Kusto client providers are designed for concurrent use by multiple threads, and they cache information retrieved during the initial contact with your database. To optimize performance, we recommend reusing a single client instance rather than creating a new one for each request.

## Specify the database parameter

The default database property in the Kusto client provider isn't thread-safe. We recommend that you set this property on creation and refrain from altering it afterward. If a single client is used to send requests to multiple databases, use methods that accept a database parameter to specify the desired database.

## Dispose of the client and request results

Although the Kusto client object is designed for use with multiple requests, it should be disposed of when it's no longer needed to send more requests. Likewise, request results objects should be disposed of once they've fulfilled their purpose. The correct disposal of these objects is key for maintaining scalability, as they retain essential network resources until they're explicitly disposed of or subjected to garbage collection.

## Related content

* [Kusto Data overview](about-kusto-data.md)
* [Query best practices](../../query/best-practices.md)
* [Schema management best practices](../../management/management-best-practices.md)
