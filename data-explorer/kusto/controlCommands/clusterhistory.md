---
title: Cluster Activity Log and History - Azure Kusto | Microsoft Docs
description: This article describes Cluster Activity Log and History in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Cluster Activity Log and History

Each cluster provides DB admins with means to explore usage, track operations and investigate ingestion failures.
These are the commands that enable access to cluster activity history:

* [.show queries](queries.md) - displays information on completed and running queries.
* [.show operations](operations.md) - displays administrative operations both running and completed, since Admin node was last elected.
* [.show journal](journal.md) - displays information on metadata operations performed on the cluster.
* [.show failed ingestions](ingestionfailures.md) - displays information on failures encountered during data ingestion to the cluster.
* [.show commands](commands.md) - displays information on completed commands and their resources utilization.