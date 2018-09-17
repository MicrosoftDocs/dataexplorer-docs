---
title: Datetime / timespan arithmetic - Azure Data Explorer | Microsoft Docs
description: This article describes Datetime / timespan arithmetic in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Datetime / timespan arithmetic

Kusto supports performing arithmetic operations on values of types `datetime`
and `timespan`:

* One can subtract (but not add) two `datetime` values to get a `timespan` value
  expressing their difference.
  For example, `datetime(1997-06-25) - datetime(1910-06-11)` is how old was
  [Jacques-Yves Cousteau](https://en.wikipedia.org/wiki/Jacques_Cousteau) when
  he died.

* One can add or subtract two `timespan` values to get a `timespan` value
  which is their sum or difference.
  For example, `1d + 2d` is three days.

* One can add or subtract a `timespan` value from a `datetime` value.
  For example, `datetime(1910-06-11) + 1d` is the date Cousteau turned one day old.

* One can divide two `timespan` values to get their quotient.
  For example, `1d / 5h` gives `4.8`.
  This gives one the ability to express any `timespan` value as a multiple of
  another `timespan` value. For example, to express an hour in seconds, simply
  divide `1h` by `1s`: `1h / 1s` (with the obvious result, `3600`).

* Conversely, one can multiple a numeric value (such as `double` and `long`)
  by a `timespan` value to get a `timespan` value.
  For example, one can express an hour and a half as `1.5 * 1h`.