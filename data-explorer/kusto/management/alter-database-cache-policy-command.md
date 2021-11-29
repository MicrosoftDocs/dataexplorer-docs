---
title: ".alter database cache policy command - Azure Data Explorer"
description: "This article describes the .alter database cache policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/29/2021
---
# .alter database cache policy

Change the database cache policy.  To speed up queries on data, Azure Data Explorer caches it, or parts of it, on its processing nodes, SSD, or even in RAM. The [cache policy](cachepolicy.md) enables Azure Data Explorer to describe the data artifacts that it uses, so that more important data can take priority. 

## Syntax

`.alter` `database` *DatabaseName* `policy` `caching` *ArrayOfPolicyObjects*

## Arguments

*DatabaseName* - Specify the name of the database.
*ArrayOfPolicyObjects* - An array with one or more policy objects defined.

## Returns

Returns a JSON representation of the policy.

## Example

The following example sets the caching policy to include the last 30 days.

```kusto
.alter database MyDatabase policy caching hot = 30d
```

**Output**

|PolicyName|EntityName|Policy|ChildEntities|EntityType|
|---|---|---|---|---|
|ClusterRequestClassificationPolicy| database1 |{"DataHotSpan": {"Value": "30.00:00:00"},"IndexHotSpan": { "Value": "30.00:00:00" }} | | |
