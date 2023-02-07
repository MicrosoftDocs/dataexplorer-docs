---
title: .show cluster callout policy command- Azure Data Explorer
description: This article describes the .show cluster callout policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/04/2021
---
# .show cluster callout policy

Display a cluster's [callout policy](calloutpolicy.md). Azure Data Explorer clusters can communicate with external services in many different scenarios. Cluster admins can manage the authorized domains for external calls, by updating the cluster's callout policy.

## Permissions

This command requires at least [AllDatabasesMonitor](access-control/role-based-access-control.md) permissions.

## Syntax

`.show` `cluster` `policy` `callout` 

## Returns

Returns a JSON representation of the policy.

### Examples

Display the cluster's callout policy.

```kusto
.show cluster policy callout
```
