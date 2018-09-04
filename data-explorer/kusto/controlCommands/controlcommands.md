---
title: Control Commands - Azure Kusto | Microsoft Docs
description: This article describes Control Commands in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Control Commands

Kusto is divided into a number of cloud services ("clusters"):
* The **Kusto Engine** cloud service is responsible for ingesting, storing,
  and querying customer data.
* The **Kusto Data Management** (DM) cloud service is responsible for feeding
  the Kusto Engine service with data received from customers, as well as
  periodic data management operations such as triggering the retention policy
  and triggering warmup policy (cache prefetch).
* The **Kusto Cluster Management** (CM) cloud service is responsible for
  managing the other two cluster types -- it can be used to set up new clusters,
  take them down, increase/decrease their size, etc. In addition, it provides
  a number of useful workflows to help run complex ops procedures. 

Each of these cloud services implement its own metadata query language
and control commands. These resemble the Kusto query language syntax, but are
distinguished from Kusto queries in that (1) control commands may perform writes
(for example, ingest data into a table or reshape a database), and (2) metadata
queries and control commands all start with a dot (`.`) and run with strong
transactional guarantees.

* [Engine control commands](engine.md)
