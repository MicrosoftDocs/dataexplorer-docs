---
title: Partial query failures - Azure Data Explorer
description: This article describes Partial query failures in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 10/23/2018
---
# Partial query failures

A *partial query failure* is a failure to run the query that gets detected
only after the query has started the actual execution phase. By that time,
Kusto has already returned the HTTP status line `200 OK` back to the client,
and cannot "take it back", so it has to indicate the failure in the result
stream that carries the query results back to the client. (In fact, it may have
already returned some result data back to the caller.)

There are several kinds of partial query failures:
* [Runaway queries](runawayqueries.md): Queries that take up too many
  resources.
* [Result truncation](resulttruncation.md): Queries whose result set
  has been truncated as it exceeded some limit.
* [Overflows](overflow.md): Queries that trigger an overflow error.
* Other runtime errors: For example, network errors when invoking a
  cross-cluster query, or errors received from a plugin, etc.

Partial query failures can be reported back to the client in one of two
ways:

* As part of the result data (a special kind of record indicates that
  this is not the data itself). This is the default way.
* As part of the "QueryStatus" table in the result stream. This is done
  by using the `deferpartialqueryfailures` option in the request's
  `properties` slot (`Kusto.Data.Common.ClientRequestProperties.OptionDeferPartialQueryFailures`).
  Clients that do that take on the responsibility to consume the entire
  result stream from the service, locate the `QueryStatus` result, and
  make sure no record in this result has a `Severity` of `2` or smaller.

> [!NOTE]
> To expedire delivery of a partial query failure, Kusto may in some cases
> "flush" the result stream as quickly as possible. As a result, the consumer should
> not assume the integrity of the records returned prior to the partial query failure.
