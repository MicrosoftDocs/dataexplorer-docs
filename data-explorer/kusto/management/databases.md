---
title: Databases management - Azure Data Explorer
description: This article describes Databases management in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 03/24/2020
---
# Databases management

This topic describes the following database control commands:

|Command |Description |
|--------|------------|
|[.show databases](show-databases.md) |Returns a table in which every record corresponds to a database in the cluster that the user has access to|
|[.show database](show-database.md) |Returns a table showing the properties of the context database |
|[.show cluster databases](show-cluster-database.md) |Returns a table showing all databases attached to the cluster and to which the user invoking the command has access |
|[.alter database](alter-database.md) |Alters a database's pretty (friendly) name |
|[.show database schema](show-schema-database.md) |Returns a flat list of the structure of the selected databases with all their tables and columns in a single table or JSON object |