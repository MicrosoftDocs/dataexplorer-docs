---
title: Cluster follower commands - Azure Data Explorer | Microsoft Docs
description: This article describes Cluster follower commands in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 11/06/2019
---
# Cluster follower commands

Control commands for managing a [follower cluster](../concepts/followercluster.md) configuration are listed below. These commands run synchronously, but are applied on the next periodic schema refresh. Therefore, there may be a few minutes delay until the new configuration is applied.
