---
title:  Kusto Data library best practices
description: This article describes best practices for Kusto Data client library.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 09/07/2023
---
# Kusto Data library best practices

This article explains the best practices for working with the [Kusto Data library](about-kusto-data.md).

## Use a single client instance

The Kusto client providers are designed for concurrent use by multiple threads, and they cache information retrieved during the initial contact with your cluster. To optimize performance, we recommend reusing a single client instance rather than creating a new one for each request.

## Specify the database parameter

The default database property in the Kusto client provider isn't thread-safe. We recommend that you set this property on creation and refrain from altering it afterward. If a single client is used to send requests to multiple databases, use methods that accept a database parameter to specify the desired database.

## Dispose of the client and request results

The Kusto client and request results objects should be disposed of once they're no longer needed. This disposal is essential for scalability, as request holds on to essential network resources and doesn't release them until either disposed or garbage-collected.

## Related content

* [Query best practices](../../query/best-practices.md)
* [Schema management best practices](../../management/management-best-practices.md)
