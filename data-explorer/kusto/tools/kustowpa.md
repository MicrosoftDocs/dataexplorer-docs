---
title: Kusto WPA - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto WPA in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 03/12/2020
---
# Kusto WPA

Kusto WPA adds the ability to execute and visualize Kusto query results in
Windows Performance Analyzer (WPA). It consists of two major parts:

1. A launcher tool that can accept Kusto.Explorer-shared queries (via
   `Share` &gt; `Query to Clipboard`) and generate query files (`.kpq`) to be processed
   by WPA.

1. A WPA plugin that can "open" the generated query files (`.kpq`). Opening
   such a file automatically sends the query specified in the file to a Kusto
   cluster and loading the results as if they came from a "standard" ETL file.

See [https://aka.ms/kustowpa] for details and download information.