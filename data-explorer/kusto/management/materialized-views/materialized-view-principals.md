---
title: materialized view principals commands - Azure Data Explorer
description: This article describes show materialized views principals commands in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: yifats
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# Materialized view principals

A materialized view can be created by a [Database Admin](../access-control/role-based-authorization.md).
The creator of the materialized view automatically receives admin rights on the view.
Additional admins can be added afterwards, using the commands below. Any change to the view post creation,
requires database admin permissions, or admin rights on the materialized view.

* See [Security roles management](../security-roles.md) for further details (materialized
views behave similarly to tables in this respect).

**Syntax:**

`.show` `materialized-view` *MaterializedViewName* `principals`

[`.add`|`.drop`|`.set` ] `materialized-view` *MaterializedViewName* `admins` `(` *Principal* `,[` *Principal...* `])`

**Properties:**

|Property|Type|Description
|----------------|-------|---|
|MaterializedViewName|String|Name of the materialized view.|
|Principal|String|The principal(s).|
