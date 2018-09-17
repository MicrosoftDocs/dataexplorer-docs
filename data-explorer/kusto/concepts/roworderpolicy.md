---
title: Row order policy - Azure Data Explorer | Microsoft Docs
description: This article describes Row order policy in Azure Data Explorer.
services: azure-data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: azure-data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Row order policy

Row order policy is an optional policy set on tables that provides a "hint" to Kusto
on the desired ordering or rows in a data shard. This policy is appropriate when
the majority of data queries filter on specific values of a specific large-dimension column
(such as an application ID or a tenant ID) and the data ingested into the table is unlikely
to be pre-ordered according to this column.

Control commands which allow to manage policy of Row Order [destinated here](../management/roworder-policy.md). 