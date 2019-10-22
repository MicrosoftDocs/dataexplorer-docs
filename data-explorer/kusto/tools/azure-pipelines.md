---
title: Azure Pipelines / Azure DevOps integration - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Pipelines / Azure DevOps integration in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 05/21/2019

---
# Azure Pipelines / Azure DevOps integration

Azure Pipelines help you easily implement a build, test, and deployment pipeline.

The "Admin Commands" task for Azure Data Explorer (Kusto) allows you to run multiple control
commands as part of your pipeline. These can be specified inline, or as source control
paths to `csl` files.

For more [details](https://marketplace.visualstudio.com/items?itemName=Azure-Kusto.PublishToADX#overview).