---
title: Role-based Authorization in Kusto - Azure Data Explorer | Microsoft Docs
description: This article describes Role-based Authorization in Kusto in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 04/30/2019

---
# Role-based Authorization in Kusto



**Authorization** is the process of allowing or disallowing a security principal permissions to carry out an action.
Kusto uses a **role-based access control** model, under which authenticated principals are mapped to **roles**, and get access according to the roles they're assigned.

The **Kusto Engine** service has the following roles:

|Role                       |Permissions                                                                        |
|---------------------------|-----------------------------------------------------------------------------------|
|Database admin             |Can do "anything" in the scope of a particular database.|
|Database user              |Can read all data and metadata of the database; additionally, can create tables (thus becoming the table admin for that table) and functions in the database.|
|Database viewer            |Can read all data and metadata of the database.|
|Database ingestor          |Can ingest data to all existing tables in the database, but not query the data|
|Database unrestrictedviewer|Can query all tables in the database which have the [RestrictedViewAccess policy](../restrictedviewaccess-policy.md) enabled.|
|Database monitor           |Can execute `.show` commands in the context of the database and its child entities.|
|Table admin                |Can do anything in the scope of a particular table. |
|Table ingestor             |Can ingest data in the scope of a particular table, but not query the data.|
