---
title: .delete callout policy command- Azure Data Explorer
description: This article describes the .delete callout policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .delete callout policy

Deletes a cluster's [callout policy](calloutpolicy.md). Azure Data Explorer clusters can communicate with external services in many different scenarios. Cluster admins can manage the authorized domains for external calls, by updating the cluster's callout policy.

## Permissions

You must have [Cluster AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `cluster` `policy` `callout` 
