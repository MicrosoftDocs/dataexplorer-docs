---
title: .show callout policy command- Azure Data Explorer
description: This article describes the .show callout policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 09/26/2021
---
# .show callout policy

Display a cluster's [callout policy](calloutpolicy.md). Azure Data Explorer clusters can communicate with external services in many different scenarios. Cluster admins can manage the authorized domains for external calls, by updating the cluster's callout policy.

## Syntax

`.show` `cluster` `policy` `callout` 

### Examples

Display the cluster's callout policy.

```kusto
.show cluster policy callout
```
