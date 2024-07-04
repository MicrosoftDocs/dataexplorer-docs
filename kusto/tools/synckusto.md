---
title:  Sync Kusto
description:  This article describes Sync Kusto.
ms.reviewer: zivc
ms.topic: how-to
ms.date: 08/12/2019
---

# Sync Kusto

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Sync Kusto is a tool that enables users to synchronize various Kusto schema entities, such as table schemas and stored functions. This synchronization is done between the local file
system, an Azure Data Explorer database, and Azure Dev Ops repos.

Sync Kusto is available [on GitHub](https://github.com/microsoft/synckusto).

## Delta Kusto

A closely-related tool is Delta Kusto, which is a command-line tool to enable continuous integration/continuous deployment (CI/CD) automation with Azure Data Explorer objects such as tables, functions, policies, etc.

Delta Kusto is available [on GitHub](https://github.com/microsoft/delta-kusto).
